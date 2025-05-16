// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
// import { loadStripe } from '@stripe/stripe-js';
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements
// } from '@stripe/react-stripe-js';
import { loadStripe, Elements, CardElement, useStripe, useElements } from '../services/stripeClient';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Lock, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

// Load Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Inner payment form component
const PaymentForm = ({ onSubmit, isLoading, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    onSubmit(stripe, cardElement);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
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
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const { cart, isLoading: cartLoading, fetchCart } = useCart();
  
  const [step, setStep] = useState('auth'); // 'auth', 'shipping', 'payment'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Canada'
  });
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cart.items.length === 0) {
      navigate('/test-kits');
    }
  }, [cart, cartLoading, navigate]);
  
  // Update step based on auth status
  useEffect(() => {
    if (user) {
      setStep('shipping');
      
      // Load user info into shipping form
      setShipping({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address?.street || '',
        city: user.user_metadata?.address?.city || '',
        state: user.user_metadata?.address?.state || '',
        zipCode: user.user_metadata?.address?.postalCode || '',
        country: user.user_metadata?.address?.country || 'Canada'
      });
    } else {
      setStep('auth');
    }
  }, [user]);
  
  // Handle shipping form submission
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep('payment');
  };
  
  // Handle payment submission
  const handlePaymentSubmit = async (stripe, cardElement) => {
    if (!stripe || !cardElement) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total: cart.total,
            status: 'pending',
            shipping_address: shipping.address,
            shipping_city: shipping.city,
            shipping_state: shipping.state,
            shipping_zip: shipping.zipCode,
            shipping_country: shipping.country,
            shipping_method: 'Standard',
            billing_address: shipping.address, // Using same address for billing
          }
        ])
        .select('id')
        .single();
      
      if (orderError) {
        throw new Error('Failed to create order. Please try again.');
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
        throw new Error('Failed to process order items. Please try again.');
      }
      
      // In a real app, you would create a payment intent on your server
      // and use Stripe to confirm the payment
      // For this example, we'll simulate a successful payment
      
      // Update order status to paid
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);
        
      if (updateError) {
        throw new Error('Error updating order status');
      }
      
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
      
      // Refresh cart
      await fetchCart();
      
      // Navigate to confirmation page
      navigate(`/order/confirmation/${orderId}`);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (cartLoading) {
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
  
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'auth' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                  <User className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-medium text-gray-500">Account</span>
              </div>
              <div className={`h-0.5 flex-1 mx-2 ${step !== 'auth' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'shipping' ? 'bg-blue-600 text-white' : step === 'payment' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-medium text-gray-500">Shipping</span>
              </div>
              <div className={`h-0.5 flex-1 mx-2 ${step === 'payment' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-medium text-gray-500">Payment</span>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4 mb-4">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${cart.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm font-medium text-gray-500">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">$0.00</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm font-medium text-gray-500">Tax</p>
                  <p className="text-sm font-medium text-gray-900">${(cart.total * 0.13).toFixed(2)}</p>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">${(cart.total * 1.13).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Step Content */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            {step === 'auth' && (
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account</h2>
                
                <div className="text-sm text-gray-500 mb-6">
                  <p>You need to be logged in to complete your purchase.</p>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Log In
                  </button>
                  
                  <button
                    onClick={() => navigate('/signup', { state: { from: '/checkout' } })}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
            
            {step === 'shipping' && (
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={shipping.name}
                          onChange={(e) => setShipping({...shipping, name: e.target.value})}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={shipping.email}
                          onChange={(e) => setShipping({...shipping, email: e.target.value})}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={shipping.phone}
                          onChange={(e) => setShipping({...shipping, phone: e.target.value})}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="address"
                          value={shipping.address}
                          onChange={(e) => setShipping({...shipping, address: e.target.value})}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="city"
                          value={shipping.city}
                          onChange={(e) => setShipping({...shipping, city: e.target.value})}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State/Province
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="state"
                          value={shipping.state}
                          onChange={(e) => setShipping({...shipping, state: e.target.value})}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal Code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="zipCode"
                          value={shipping.zipCode}
                          onChange={(e) => setShipping({...shipping, zipCode: e.target.value})}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <div className="mt-1">
                        <select
                          id="country"
                          value={shipping.country}
                          onChange={(e) => setShipping({...shipping, country: e.target.value})}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="Canada">Canada</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {step === 'payment' && (
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment</h2>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ship To</h3>
                  <div className="text-sm text-gray-500">
                    <p>{shipping.name}</p>
                    <p>{shipping.address}</p>
                    <p>{shipping.city}, {shipping.state} {shipping.zipCode}</p>
                    <p>{shipping.country}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center mb-4">
                    <Lock className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">Secure Payment</h3>
                  </div>
                  
                  <Elements stripe={stripePromise}>
                    <PaymentForm 
                      onSubmit={handlePaymentSubmit} 
                      isLoading={isLoading}
                      total={cart.total * 1.13} // With tax
                    />
                  </Elements>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}