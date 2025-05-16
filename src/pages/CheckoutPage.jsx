// pages/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useCart } from '../hooks/useCart';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ShippingForm from '../components/ShippingForm';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { cart, isLoading: isCartLoading } = useCart();
  
  const [checkoutStep, setCheckoutStep] = useState('review');
  const [shippingInfo, setShippingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to home if cart is empty
  useEffect(() => {
    if (!isCartLoading && cart.items.length === 0) {
      navigate('/');
    }
  }, [cart, isCartLoading, navigate]);
  
  // Set checkout step based on authentication state
  useEffect(() => {
    if (user) {
      // Fetch user's shipping info if available
      const fetchShippingInfo = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, phone')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data) {
          setShippingInfo({
            name: user.user_metadata?.full_name || '',
            email: user.email,
            address: data.shipping_address || '',
            city: data.shipping_city || '',
            state: data.shipping_state || '',
            zip: data.shipping_zip || '',
            country: data.shipping_country || '',
            phone: data.phone || ''
          });
        }
      };
      
      fetchShippingInfo();
      setCheckoutStep('shipping');
    } else {
      setCheckoutStep('auth');
    }
  }, [user]);
  
  const handleShippingSubmit = async (info) => {
    setIsLoading(true);
    
    // Save shipping info to profile
    if (user) {
      await supabase
        .from('profiles')
        .update({
          shipping_address: info.address,
          shipping_city: info.city,
          shipping_state: info.state,
          shipping_zip: info.zip,
          shipping_country: info.country,
          phone: info.phone
        })
        .eq('user_id', user.id);
    }
    
    setShippingInfo(info);
    setCheckoutStep('payment');
    setIsLoading(false);
  };
  
  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      {/* Order Summary Section */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.items.map(item => (
          <div key={item.id} className="checkout-item">
            <p>{item.name} x {item.quantity}</p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="checkout-total">
          <p>Total:</p>
          <p>${cart.total.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Authentication Section */}
      {checkoutStep === 'auth' && (
        <div className="auth-section">
          <h2>Account</h2>
          <p>You need an account to complete your purchase</p>
          
          <div className="auth-tabs">
            <button 
              className={`tab ${checkoutStep === 'auth' ? 'active' : ''}`}
              onClick={() => setCheckoutStep('auth')}
            >
              Login
            </button>
            <button
              className={`tab ${checkoutStep === 'register' ? 'active' : ''}`}
              onClick={() => setCheckoutStep('register')}
            >
              Create Account
            </button>
          </div>
          
          {checkoutStep === 'auth' ? (
            <LoginForm onSuccess={() => setCheckoutStep('shipping')} />
          ) : (
            <RegisterForm onSuccess={() => setCheckoutStep('shipping')} />
          )}
        </div>
      )}
      
      {/* Shipping Section */}
      {checkoutStep === 'shipping' && (
        <div className="shipping-section">
          <h2>Shipping Information</h2>
          <ShippingForm 
            initialData={shippingInfo}
            onSubmit={handleShippingSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
      
      {/* Payment Section (Step 5)*/}
        {checkoutStep === 'payment' && (
        <div className="payment-section">
            <h2>Payment</h2>
            <PaymentForm 
            shippingInfo={shippingInfo}
            onSuccess={() => navigate('/order/confirmation')}
            />
        </div>
        )}
    </div>
  );
};