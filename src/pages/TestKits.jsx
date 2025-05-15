// src/pages/TestKits.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Check, Droplet } from 'lucide-react';
import { testKitsService } from '../services/supabaseClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function TestKitsPage() {
  const [testKits, setTestKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
  });
  
  useEffect(() => {
    const fetchTestKits = async () => {
      try {
        setLoading(true);
        
        // For development, use mock data
        const mockTestKits = [
          {
            id: 'kit-1',
            name: 'Basic Water Test',
            description: 'Tests for 8 common contaminants including lead, bacteria, and chlorine.',
            price: 49.99,
            image_url: '/api/placeholder/300/200',
            type: 'basic',
            parameters: ['Lead', 'Bacteria', 'Chlorine', 'pH', 'Nitrates', 'Nitrites', 'Hardness', 'Copper']
          },
          {
            id: 'kit-2',
            name: 'Advanced Water Test',
            description: 'Tests for 16 contaminants including heavy metals, pesticides, and minerals.',
            price: 89.99,
            image_url: '/api/placeholder/300/200',
            type: 'advanced',
            parameters: ['Lead', 'Bacteria', 'Chlorine', 'pH', 'Nitrates', 'Nitrites', 'Hardness', 'Copper', 'Arsenic', 'Chromium', 'Mercury', 'Iron', 'Fluoride', 'Pesticides', 'Manganese', 'PFAS']
          },
          {
            id: 'kit-3',
            name: 'Well Water Test',
            description: 'Specifically designed for private wells, testing for 20+ contaminants.',
            price: 129.99,
            image_url: '/api/placeholder/300/200',
            type: 'specialized',
            parameters: ['Lead', 'Bacteria', 'Chlorine', 'pH', 'Nitrates', 'Nitrites', 'Hardness', 'Copper', 'Arsenic', 'Chromium', 'Mercury', 'Iron', 'Fluoride', 'Pesticides', 'Manganese', 'PFAS', 'Uranium', 'Radon', 'Sulfate', 'Sodium']
          },
          {
            id: 'kit-4',
            name: 'Swimming Pool Test',
            description: 'Perfect for pool owners, tests for chlorine, pH, alkalinity, and other pool parameters.',
            price: 69.99,
            image_url: '/api/placeholder/300/200',
            type: 'specialized',
            parameters: ['Chlorine', 'pH', 'Alkalinity', 'Calcium Hardness', 'Cyanuric Acid', 'Phosphates', 'Metals', 'TDS']
          },
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setTestKits(mockTestKits);
      } catch (err) {
        console.error('Error fetching test kits:', err);
        setError('Failed to load test kits. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestKits();
  }, []);
  
  // Filter test kits based on selected filters
  const filteredTestKits = testKits.filter(kit => {
    // Filter by type
    if (filters.type !== 'all' && kit.type !== filters.type) {
      return false;
    }
    
    // Filter by price range
    if (filters.priceRange === 'under-50' && kit.price >= 50) {
      return false;
    } else if (filters.priceRange === '50-100' && (kit.price < 50 || kit.price > 100)) {
      return false;
    } else if (filters.priceRange === 'over-100' && kit.price <= 100) {
      return false;
    }
    
    return true;
  });
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="py-12 px-6 sm:px-12 lg:py-16 lg:px-16 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Water Testing Kits
                </h1>
                <p className="mt-4 text-lg text-blue-100">
                  Professional-grade water testing kits for your home, business, or special applications.
                  Easy to use with quick and reliable results.
                </p>
                <div className="mt-6">
                  <a href="#test-kits" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50">
                    View All Kits
                  </a>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Water testing kit" 
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
          
          {/* Filters Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Test Kit Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="basic">Basic</option>
                  <option value="advanced">Advanced</option>
                  <option value="specialized">Specialized</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <select
                  id="priceRange"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Prices</option>
                  <option value="under-50">Under $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="over-100">Over $100</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Test Kits Grid */}
          <div id="test-kits" className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Test Kits</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md text-red-800">
                {error}
              </div>
            ) : filteredTestKits.length === 0 ? (
              <div className="text-center py-12">
                <Droplet className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No test kits found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTestKits.map((kit) => (
                  <div key={kit.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src={kit.image_url} 
                        alt={kit.name} 
                        className="w-full h-full object-cover"
                      />
                      {kit.type === 'advanced' && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-3 text-xs font-medium">
                          Popular
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-medium text-gray-900">{kit.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{kit.description}</p>
                      
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tests For:</h4>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {kit.parameters.slice(0, 3).map((param, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {param}
                            </span>
                          ))}
                          {kit.parameters.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{kit.parameters.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-semibold text-gray-900">${kit.price.toFixed(2)}</span>
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Add to Cart
                        </button>
                      </div>
                      
                      <Link 
                        to={`/test-kits/${kit.id}`}
                        className="mt-2 block text-center text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Why Choose Our Test Kits */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Test Kits?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Laboratory Accuracy</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Our test kits use the same methods employed by professional laboratories, providing reliable and accurate results.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Easy to Use</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Simple instructions make our kits accessible to everyone, regardless of technical expertise.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Fast Results</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Receive your comprehensive digital report within 48 hours of our lab receiving your sample.
                </p>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-16 bg-blue-600 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Not sure which test kit is right for you?</h2>
              <p className="text-blue-100 mb-6 max-w-3xl mx-auto">
                Our water quality experts can help you determine the best testing solution based on your specific needs and concerns.
              </p>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Contact an Expert
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}