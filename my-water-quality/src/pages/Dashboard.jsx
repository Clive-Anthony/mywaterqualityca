// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ShoppingBag, FileText, User, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { testKitsService, ordersService, resultsService } from '../services/supabaseClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [featuredTestKits, setFeaturedTestKits] = useState([]);
  const [waterQualityStatus, setWaterQualityStatus] = useState('good'); // 'good', 'warning', 'alert'
  
  useEffect(() => {
    // Fetch user's dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would all be actual API calls to Supabase
        
        // Mock data for recent orders
        const mockOrders = [
          {
            id: 'ord-123',
            created_at: '2025-05-01T10:30:00Z',
            status: 'delivered',
            total: 89.99,
            items: [{ name: 'Advanced Water Test', quantity: 1 }]
          },
          {
            id: 'ord-122',
            created_at: '2025-04-15T14:20:00Z',
            status: 'shipped',
            total: 49.99,
            items: [{ name: 'Basic Water Test', quantity: 1 }]
          }
        ];
        
        // Mock data for test results
        const mockResults = [
          {
            id: 'res-456',
            completed_date: '2025-05-07T09:45:00Z',
            status: 'completed',
            sample_id: 'WQ-12345',
            test_kit: { name: 'Advanced Water Test' },
            summary: 'Your water shows normal levels for all tested parameters.'
          },
          {
            id: 'res-455',
            completed_date: '2025-04-22T11:15:00Z',
            status: 'completed',
            sample_id: 'WQ-12344',
            test_kit: { name: 'Basic Water Test' },
            summary: 'Your water shows elevated levels of chlorine, but is otherwise safe.'
          }
        ];
        
        // Mock data for featured test kits
        const mockTestKits = [
          {
            id: 'kit-789',
            name: 'Complete Home Water Test',
            description: 'Comprehensive testing for 25+ contaminants',
            price: 149.99,
            image_url: '/api/placeholder/300/200'
          },
          {
            id: 'kit-790',
            name: 'Well Water Special Test',
            description: 'Designed specifically for private wells',
            price: 129.99,
            image_url: '/api/placeholder/300/200'
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setRecentOrders(mockOrders);
        setRecentResults(mockResults);
        setFeaturedTestKits(mockTestKits);
        
        // Determine water quality status based on most recent result
        if (mockResults.length > 0) {
          const latestResult = mockResults[0];
          if (latestResult.summary.includes('elevated')) {
            setWaterQualityStatus('warning');
          } else if (latestResult.summary.includes('unsafe')) {
            setWaterQualityStatus('alert');
          } else {
            setWaterQualityStatus('good');
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
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
  
  // Get water quality status details
  const getWaterQualityStatusDetails = () => {
    switch (waterQualityStatus) {
      case 'good':
        return {
          icon: <TrendingUp className="h-6 w-6 text-green-500" />,
          color: 'bg-green-100',
          text: 'Good',
          description: 'Your water quality looks good based on your most recent test results.'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-6 w-6 text-yellow-500" />,
          color: 'bg-yellow-100',
          text: 'Warning',
          description: 'Some parameters are elevated in your recent test. Review your results for details.'
        };
      case 'alert':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          color: 'bg-red-100',
          text: 'Alert',
          description: 'Your water shows concerning levels of one or more contaminants. Immediate action recommended.'
        };
      default:
        return {
          icon: <Droplet className="h-6 w-6 text-blue-500" />,
          color: 'bg-blue-100',
          text: 'Unknown',
          description: 'We need more data to assess your water quality.'
        };
    }
  };
  
  const waterQualityStatusDetails = getWaterQualityStatusDetails();
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Welcome back, {user?.user_metadata?.first_name || 'User'}
            </h1>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <Link
                to="/test-kits"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Order a Test Kit
              </Link>
            </div>
          </div>
          
          {loading ? (
            // Loading state
            <div className="mt-6 text-center py-12">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-gray-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading your dashboard...
              </div>
            </div>
          ) : (
            <div className="mt-6">
              {/* Water Quality Status Card */}
              <div className={`${waterQualityStatusDetails.color} rounded-lg shadow-sm p-6 mb-6`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {waterQualityStatusDetails.icon}
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium">
                      Water Quality Status: <span className="font-bold">{waterQualityStatusDetails.text}</span>
                    </h3>
                    <p className="mt-1 text-sm">
                      {waterQualityStatusDetails.description}
                    </p>
                    {recentResults.length > 0 && (
                      <Link
                        to={`/results/${recentResults[0].id}`}
                        className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        View latest result
                        <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center">
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                      <h3 className="ml-2 text-lg font-medium text-gray-900">Recent Orders</h3>
                    </div>
                  </div>
                  <div className="px-5 py-3">
                    {recentOrders.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4">You don't have any orders yet.</p>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <li key={order.id} className="py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                              </div>
                              <div className="flex items-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <span className="ml-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link to="/orders" className="font-medium text-blue-600 hover:text-blue-900">
                        View all orders <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Recent Test Results */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <h3 className="ml-2 text-lg font-medium text-gray-900">Recent Test Results</h3>
                    </div>
                  </div>
                  <div className="px-5 py-3">
                    {recentResults.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4">You don't have any test results yet.</p>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {recentResults.map((result) => (
                          <li key={result.id} className="py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{result.test_kit.name}</p>
                                <p className="text-sm text-gray-500">Sample ID: {result.sample_id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">{formatDate(result.completed_date)}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {result.summary}
                              </p>
                              <Link
                                to={`/results/${result.id}`}
                                className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-900"
                              >
                                View full report
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link to="/results" className="font-medium text-blue-600 hover:text-blue-900">
                        View all results <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recommended Test Kits */}
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900">Recommended Test Kits</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredTestKits.map((kit) => (
                    <div key={kit.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="relative h-48 bg-gray-200">
                        <img
                          src={kit.image_url}
                          alt={kit.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">{kit.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{kit.description}</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900">${kit.price.toFixed(2)}</p>
                        <div className="mt-4">
                          <Link
                            to={`/test-kits/${kit.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
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