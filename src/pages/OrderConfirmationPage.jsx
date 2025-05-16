// pages/OrderConfirmationPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const supabase = useSupabaseClient();
  const user = useUser();
  
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !orderId) return;
      
      setIsLoading(true);
      
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();
      
      if (orderError) {
        setError('Failed to load order details');
        setIsLoading(false);
        return;
      }
      
      setOrder(orderData);
      
      // Fetch order items with test kit details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          test_kits (
            id,
            name,
            description,
            image_url
          )
        `)
        .eq('order_id', orderId);
      
      if (itemsError) {
        setError('Failed to load order items');
      } else {
        setItems(itemsData);
      }
      
      setIsLoading(false);
    };
    
    fetchOrderDetails();
  }, [orderId, user]);
  
  if (isLoading) {
    return <div className="loading">Loading order details...</div>;
  }
  
  if (error || !order) {
    return (
      <div className="error-container">
        <h1>Order Not Found</h1>
        <p>{error || 'We could not find this order'}</p>
        <Link to="/" className="button">Return to Home</Link>
      </div>
    );
  }
  
  return (
    <div className="confirmation-page">
      <div className="confirmation-header">
        <h1>Thank You for Your Order!</h1>
        <p className="order-number">Order #{orderId}</p>
        <p>A confirmation email has been sent to {order.shipping_email}</p>
      </div>
      
      <div className="order-details">
        <h2>Order Summary</h2>
        
        <div className="order-items">
          {items.map(item => (
            <div key={item.id} className="order-item">
              <img 
                src={item.test_kits.image_url} 
                alt={item.test_kits.name} 
              />
              <div className="item-details">
                <h3>{item.test_kits.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="order-total">
          <p>Total:</p>
          <p>${order.total_amount.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="shipping-details">
        <h2>Shipping Information</h2>
        <p>{order.shipping_name}</p>
        <p>{order.shipping_address}</p>
        <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
        <p>{order.shipping_country}</p>
        <p>{order.shipping_phone}</p>
      </div>
      
      <div className="next-steps">
        <h2>What's Next?</h2>
        <p>
          Your water testing kit will be shipped within 1-2 business days.
          Once you receive it, follow the instructions to collect your water
          sample and return it using the prepaid shipping label.
        </p>
        <p>
          You'll receive an email notification when your sample arrives at our
          lab, and another when your test results are ready to view in your account.
        </p>
        
        <div className="action-buttons">
          <Link to="/dashboard" className="button">
            View Your Dashboard
          </Link>
          <Link to="/test-kits" className="button secondary">
            Shop More Test Kits
          </Link>
        </div>
      </div>
    </div>
  );
};