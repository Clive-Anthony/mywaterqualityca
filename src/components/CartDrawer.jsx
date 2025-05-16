// components/CartDrawer.jsx
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };
  
  if (!isCartOpen) return null;
  
  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h3>Your Cart</h3>
          <button onClick={() => setIsCartOpen(false)}>✕</button>
        </div>
        
        <div className="cart-items">
          {cart.items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                  
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button 
                  className="remove-item" 
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        
        {cart.items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <p>Total:</p>
              <p>${cart.total.toFixed(2)}</p>
            </div>
            
            <button 
              className="checkout-button" 
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};