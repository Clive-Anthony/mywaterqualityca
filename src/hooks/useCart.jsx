// src/hooks/useCart.jsx - Fixed implementation
import { useContext, createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabaseClient'; // Import supabase directly

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get session ID for anonymous users
  const getSessionId = () => {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  };
  
  // Initialize session for anonymous users
  const initializeSession = async () => {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    
    if (!user) {
      const sessionId = getSessionId();
      await supabase.rpc('set_config', {
        key: 'app.session_id',
        value: sessionId
      }).catch(err => {
        console.error('Error setting session config:', err);
      });
    }
  };
  
  // Fetch cart from database
  const fetchCart = async () => {
    try {
      console.log('Fetching cart...'); // Debug log
      setIsLoading(true);
      
      await initializeSession();
      
      // Get current auth state
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      
      // Query based on user or session ID
      let query = supabase.from('carts').select('cart_id').limit(1).order('created_at', { ascending: false });
      
      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId);
      }
      
      // Execute query
      let { data: cartData, error: cartError } = await query;
      
      if (cartError) {
        console.error('Error fetching cart:', cartError);
        setIsLoading(false);
        return;
      }
      
      // If no cart exists yet, that's fine
      if (!cartData || cartData.length === 0) {
        setCart({ items: [], total: 0 });
        setIsLoading(false);
        return;
      }
      
      const cartId = cartData[0].cart_id;
      console.log('Found existing cart ID:', cartId); // Debug log
      
      // Get cart items with test kit details
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          item_id,
          quantity,
          test_kits (
            id,
            name,
            description,
            price,
            image_url
          )
        `)
        .eq('cart_id', cartId);
      
      if (itemsError) {
        console.error('Error fetching cart items:', itemsError);
        setIsLoading(false);
        return;
      }
      
      // Calculate total
      const formattedItems = items.map(item => ({
        id: item.item_id,
        testKitId: item.test_kits.id,
        name: item.test_kits.name,
        price: item.test_kits.price,
        quantity: item.quantity,
        image: item.test_kits.image_url
      }));
      
      const total = formattedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      
      setCart({ items: formattedItems, total });
      console.log('Cart updated:', { items: formattedItems.length, total }); // Debug log
    } catch (err) {
      console.error('Error in fetchCart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add item to cart
  const addToCart = async (testKitId, quantity) => {
    try {
      console.log('Adding to cart:', testKitId, quantity); // Debug log
      setIsLoading(true);
      
      await initializeSession();
      
      // Get current auth state
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      
      // Get existing cart or create new one
      let query = supabase.from('carts').select('cart_id').limit(1).order('created_at', { ascending: false });
      
      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId);
      }
      
      let { data: cartData } = await query;
      
      let cartId;
      
      if (!cartData || cartData.length === 0) {
        // Create new cart
        const newCart = user 
          ? { user_id: user.id }
          : { session_id: getSessionId() };
        
        const { data: newCartData, error: newCartError } = await supabase
          .from('carts')
          .insert([newCart])
          .select('cart_id');
        
        if (newCartError) {
          console.error('Error creating cart:', newCartError);
          setIsLoading(false);
          return;
        }
        
        cartId = newCartData[0].cart_id;
        console.log('Created new cart with ID:', cartId); // Debug log
      } else {
        cartId = cartData[0].cart_id;
        console.log('Using existing cart ID:', cartId); // Debug log
      }
      
      // Add item to cart or update quantity if exists
      const { error: itemError } = await supabase
        .from('cart_items')
        .upsert(
          {
            cart_id: cartId,
            test_kit_id: testKitId,
            quantity
          },
          {
            onConflict: 'cart_id, test_kit_id',
            ignoreDuplicates: false
          }
        );
      
      if (itemError) {
        console.error('Error adding item to cart:', itemError);
      } else {
        console.log('Item added to cart:', { cartId, testKitId, quantity }); // Debug log
        setIsCartOpen(true); // Open cart drawer
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      console.error('Error in addToCart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      console.log('Removing item from cart:', itemId); // Debug log
      setIsLoading(true);
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('item_id', itemId);
      
      if (error) {
        console.error('Error removing item from cart:', error);
      } else {
        console.log('Item removed from cart:', itemId); // Debug log
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      console.error('Error in removeFromCart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      console.log('Updating item quantity:', { itemId, quantity }); // Debug log
      setIsLoading(true);
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('item_id', itemId);
      
      if (error) {
        console.error('Error updating quantity:', error);
      } else {
        console.log('Item quantity updated:', { itemId, quantity }); // Debug log
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      console.error('Error in updateQuantity:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load cart on initial render
  useEffect(() => {
    fetchCart();
    console.log('Setting up auth state change listener'); // Debug log
    
    // Subscribe to auth changes to refresh cart when user logs in/out
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      console.log('Auth state changed, refreshing cart'); // Debug log
      fetchCart();
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoading,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};