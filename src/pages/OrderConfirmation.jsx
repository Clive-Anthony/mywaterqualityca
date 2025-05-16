// src/pages/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !orderId) return;
      
      try {
        setLoading(true);
        
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();
        
        if (orderError) {
          setError('Failed to load order details');
          setLoading(false);
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
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, user, supabase]);
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                <p className="text-gray-600 mb-6">{error || 'We could not find this order'}</p>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-6 border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-center">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">Thank You for Your Order!</h1>
              <p className="mt-2 text-sm text-gray-600 text-center">Order #{orderId}</p>
              <p className="mt-1 text-sm text-gray-600 text-center">
                A confirmation email has been sent to {order.shipping_email || user.email}
              </p>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={item.test_kits.image_url || '/api/placeholder/60/60'} 
                        alt={item.test_kits.name} 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{item.test_kits.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-sm font-medium text-gray-900">${order.total_amount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
              <p className="text-sm text-gray-500">{order.shipping_name}</p>
              <p className="text-sm text-gray-500">{order.shipping_address}</p>
              <p className="text-sm text-gray-500">
                {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
              </p>
              <p className="text-sm text-gray-500">{order.shipping_country}</p>
              <p className="text-sm text-gray-500">{order.shipping_phone}</p>
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h2>
              <p className="text-sm text-gray-500 mb-4">
                Your water testing kit will be shipped within 1-2 business days.
                Once you receive it, follow the instructions to collect your water
                sample and return it using the prepaid shipping label.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                You'll receive an email notification when your sample arrives at our
                lab, and another when your test results are ready to view in your account.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Your Dashboard
                </Link>
                <Link
                  to="/test-kits"
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Shop More Test Kits
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}