// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Loading mock cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        
        // For development, use mock data
        const mockCartItems = [
          {
            id: 'item-1',
            product_id: 'kit-2',
            name: 'Advanced Water Test',
            description: 'Tests for 16 contaminants including heavy metals, pesticides, and minerals.',
            price: 89.99,
            quantity: 1,
            image_url: '/api/placeholder/100/100'
          },
          {
            id: 'item-2',
            product_id: 'kit-4',
            name: 'Swimming Pool Test',
            description: 'Perfect for pool owners, tests for chlorine, pH, alkalinity, and other pool parameters.',
            price: 69.99,
            quantity: 2,
            image_url: '/api/placeholder/100/100'
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setCartItems(mockCartItems);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load your cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [user]);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.13; // Assuming 13% tax rate for Canada
  const shipping = subtotal > 0 ? 9.99 : 0; // Flat shipping rate
  const total = subtotal + tax + shipping;
  
  // Handle quantity changes
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };
  
  // Handle checkout
  const handleCheckout = () => {
    // In a real app, this would save the cart to the database
    // and redirect to the checkout page
    navigate('/checkout');
  };
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="mt-1 text-sm text-gray-500">
              Review your items before checkout
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
              {error}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add test kits to your cart to get started
              </p>
              <div className="mt-6">
                <Link
                  to="/test-kits"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Test Kits
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow overflow-hidden rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row">
                          {/* Product Image */}
                          <div className="flex-shrink-0 sm:mr-6">
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="w-full sm:w-24 h-24 object-cover rounded-md" 
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1 mt-4 sm:mt-0">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                              <p className="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</p>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex items-center border rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-white shadow overflow-hidden rounded-lg">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Order Summary</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Shipping</dt>
                        <dd className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Tax</dt>
                        <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <dt className="text-base font-medium text-gray-900">Total</dt>
                          <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                        </div>
                      </div>
                    </dl>
                    
                    <div className="mt-6">
                      <button
                        onClick={handleCheckout}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                    
                    <div className="mt-6 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-blue-500" />
                      <p className="ml-2 text-xs text-gray-500">
                        Shipping costs calculated at checkout based on your location
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="mt-8 bg-blue-50 rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-blue-900">Free shipping on orders over $100</h3>
                  <p className="mt-2 text-xs text-blue-700">
                    Test kits typically ship within 1-2 business days. Once your sample is returned to our lab, results are typically available within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}