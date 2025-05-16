// components/PaymentForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useCart } from '../hooks/useCart';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Load Stripe outside of component to avoid recreating on re-renders
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Inner form component
const CheckoutForm = ({ shippingInfo, onSuccess }) => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { cart } = useCart();
  
  const stripe = useStripe();
  const elements = useElements();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Create order in database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          total_amount: cart.total,
          shipping_name: shippingInfo.name,
          shipping_address: shippingInfo.address,
          shipping_city: shippingInfo.city,
          shipping_state: shippingInfo.state,
          shipping_zip: shippingInfo.zip,
          shipping_country: shippingInfo.country,
          shipping_email: shippingInfo.email,
          shipping_phone: shippingInfo.phone,
          status: 'pending'
        }
      ])
      .select('id')
      .single();
    
    if (orderError) {
      setError('Failed to create order. Please try again.');
      setIsLoading(false);
      return;
    }
    
    const orderId = orderData.id;
    
    // Create order items
    const orderItems = cart.items.map(item => ({
      order_id: orderId,
      test_kit_id: item.testKitId,
      quantity: item.quantity,
      price: item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      setError('Failed to process order items. Please try again.');
      setIsLoading(false);
      return;
    }
    
    // Create payment intent on server
    const { data: paymentData, error: paymentError } = await supabase
      .functions.invoke('create-payment-intent', {
        body: {
          orderId,
          amount: Math.round(cart.total * 100) // Convert to cents
        }
      });
    
    if (paymentError || !paymentData.clientSecret) {
      setError('Failed to initialize payment. Please try again.');
      setIsLoading(false);
      return;
    }
    
    // Confirm card payment
    const { error: stripeError } = await stripe.confirmCardPayment(
      paymentData.clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: shippingInfo.name,
            email: shippingInfo.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.zip,
              country: shippingInfo.country
            }
          }
        }
      }
    );
    
    if (stripeError) {
      setError(stripeError.message);
      
      // Update order status to failed
      await supabase
        .from('orders')
        .update({ status: 'payment_failed' })
        .eq('id', orderId);
    } else {
      // Payment succeeded, update order status
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);
      
      // Clear cart
      const { data: cartData } = await supabase
        .from('carts')
        .select('cart_id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (cartData && cartData.length > 0) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartData[0].cart_id);
      }
      
      // Navigate to confirmation page
      navigate(`/order/confirmation/${orderId}`);
    }
    
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Card Information</label>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#9e2146'
                }
              }
            }}
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="payment-button"
      >
        {isLoading ? 'Processing...' : `Pay $${cart.total.toFixed(2)}`}
      </button>
    </form>
  );
};

// Wrapper component that provides Stripe context
const PaymentForm = ({ shippingInfo, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm shippingInfo={shippingInfo} onSuccess={onSuccess} />
    </Elements>
  );
};

export default PaymentForm;