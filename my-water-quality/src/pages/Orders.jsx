// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ordersService } from '../services/supabaseClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // For development, use mock data
        const mockOrders = [
          {
            id: 'ord-1234',
            created_at: '2025-05-01T10:30:00Z',
            status: 'delivered',
            total: 89.99,
            items: [
              { name: 'Advanced Water Test', quantity: 1, price: 89.99 }
            ],
            shipping_address: {
              name: 'John Doe',
              street: '123 Main St',
              city: 'Toronto',
              state: 'ON',
              postal_code: 'M5V 2T6',
              country: 'Canada'
            },
            tracking_number: 'TRK123456789CA'
          },
          {
            id: 'ord-1233',
            created_at: '2025-04-15T14:20:00Z',
            status: 'shipped',
            total: 49.99,
            items: [
              { name: 'Basic Water Test', quantity: 1, price: 49.99 }
            ],
            shipping_address: {
              name: 'John Doe',
              street: '123 Main St',
              city: 'Toronto',
              state: 'ON',
              postal_code: 'M5V 2T6',
              country: 'Canada'
            },
            tracking_number: 'TRK987654321CA'
          },
          {
            id: 'ord-1232',
            created_at: '2025-03-22T09:15:00Z',
            status: 'processing',
            total: 139.98,
            items: [
              { name: 'Basic Water Test', quantity: 1, price: 49.99 },
              { name: 'Well Water Test', quantity: 1, price: 89.99 }
            ],
            shipping_address: {
              name: 'John Doe',
              street: '123 Main St',
              city: 'Toronto',
              state: 'ON',
              postal_code: 'M5V 2T6',
              country: 'Canada'
            },
            tracking_number: null
          },
          {
            id: 'ord-1231',
            created_at: '2025-02-10T16:45:00Z',
            status: 'delivered',
            total: 129.99,
            items: [
              { name: 'Well Water Test', quantity: 1, price: 129.99 }
            ],
            shipping_address: {
              name: 'John Doe',
              street: '123 Main St',
              city: 'Toronto',
              state: 'ON',
              postal_code: 'M5V 2T6',
              country: 'Canada'
            },
            tracking_number: 'TRK555666777CA'
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setOrders(mockOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const orderIdMatch = order.id.toLowerCase().includes(searchLower);
      const trackingMatch = order.tracking_number?.toLowerCase().includes(searchLower) || false;
      const itemsMatch = order.items.some(item => 
        item.name.toLowerCase().includes(searchLower)
      );
      
      return orderIdMatch || trackingMatch || itemsMatch;
    }
    
    return true;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and track your orders
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="relative rounded-md shadow-sm max-w-xs w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Orders list */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
              {error}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'You haven\'t placed any orders yet'}
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
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <ul className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <li key={order.id} className="p-4 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <span className="text-xl font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Items:</h4>
                      <ul className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                        {order.items.map((item, index) => (
                          <li key={index} className="py-2 flex justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                              <span className="ml-2 text-sm text-gray-500">× {item.quantity}</span>
                            </div>
                            <span className="text-sm text-gray-900">${item.price.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {order.tracking_number && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500">Tracking:</h4>
                        <p className="mt-1 text-sm text-gray-900">{order.tracking_number}</p>
                        <a 
                          href="#" 
                          className="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                        >
                          Track Package
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View Order Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Help section */}
          <div className="mt-8 bg-blue-50 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-blue-900">Need Help With Your Order?</h2>
            <p className="mt-2 text-sm text-blue-700">
              If you have any questions about your order or need assistance, our customer service team is here to help.
            </p>
            <div className="mt-4">
              <a
                href="mailto:support@mywaterquality.ca"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}