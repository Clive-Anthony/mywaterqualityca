// hooks/useCart.jsx
import { useContext, createContext, useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const supabase = useSupabaseClient();
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
    const user = supabase.auth.user();
    if (!user) {
      const sessionId = getSessionId();
      await supabase.rpc('set_config', {
        key: 'app.session_id',
        value: sessionId
      });
    }
  };
  
  // Fetch cart from database
  const fetchCart = async () => {
    setIsLoading(true);
    
    await initializeSession();
    
    // Get cart and cart items
    let { data: cartData, error: cartError } = await supabase
      .from('carts')
      .select('cart_id')
      .limit(1)
      .order('created_at', { ascending: false });
    
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
    setIsLoading(false);
  };
  
  // Add item to cart
  const addToCart = async (testKitId, quantity) => {
    setIsLoading(true);
    
    await initializeSession();
    
    // Get existing cart or create new one
    let { data: cartData } = await supabase
      .from('carts')
      .select('cart_id')
      .limit(1)
      .order('created_at', { ascending: false });
    
    let cartId;
    
    if (!cartData || cartData.length === 0) {
      // Create new cart
      const user = supabase.auth.user();
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
    } else {
      cartId = cartData[0].cart_id;
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
      setIsCartOpen(true); // Open cart drawer
      await fetchCart(); // Refresh cart
    }
    
    setIsLoading(false);
  };
  
  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setIsLoading(true);
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('item_id', itemId);
    
    if (error) {
      console.error('Error removing item from cart:', error);
    } else {
      await fetchCart(); // Refresh cart
    }
    
    setIsLoading(false);
  };
  
  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('item_id', itemId);
    
    if (error) {
      console.error('Error updating quantity:', error);
    } else {
      await fetchCart(); // Refresh cart
    }
    
    setIsLoading(false);
  };
  
  // Load cart on initial render
  useEffect(() => {
    fetchCart();
    
    // Subscribe to auth changes to refresh cart when user logs in/out
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });
    
    return () => {
      authListener?.unsubscribe();
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

export const useCart = () => useContext(CartContext);