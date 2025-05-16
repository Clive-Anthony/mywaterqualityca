// src/components/TestKitsList.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useCart } from '../hooks/useCart';
import { Droplet, Search, Filter, AlertTriangle } from 'lucide-react';

const TestKitsList = () => {
  const [testKits, setTestKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchTestKits();
  }, []);

  const fetchTestKits = async () => {
    try {
      setLoading(true);
      
      // Fetch test kits from Supabase
      const { data, error } = await supabase
        .from('test_kits')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setTestKits(data);
    } catch (err) {
      console.error('Error fetching test kits:', err.message);
      setError('Failed to load test kits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (testKit, quantity = 1) => {
    if (testKit.quantity < 1) {
      alert('This test kit is currently out of stock.');
      return;
    }
    
    try {
      await addToCart(testKit.id, quantity);
      alert(`Added ${testKit.name} to your cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Filter test kits based on search term and price filter
  const filteredTestKits = testKits.filter(kit => {
    const matchesSearch = kit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         kit.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (priceFilter === 'all') {
      return matchesSearch;
    } else if (priceFilter === 'under-50' && kit.price < 50) {
      return matchesSearch;
    } else if (priceFilter === '50-100' && kit.price >= 50 && kit.price <= 100) {
      return matchesSearch;
    } else if (priceFilter === 'over-100' && kit.price > 100) {
      return matchesSearch;
    }
    
    return false;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Water Testing Kits</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search test kits..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <label htmlFor="price-filter" className="sr-only">Filter by price</label>
          <select
            id="price-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under-50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="over-100">Over $100</option>
          </select>
        </div>
      </div>

      {filteredTestKits.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Droplet className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">No test kits found</h2>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search or filters' : 'No test kits are currently available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestKits.map((testKit) => (
            <div key={testKit.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{testKit.name}</h2>
                <p className="text-gray-600 mb-4">{testKit.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-semibold text-blue-600">${testKit.price.toFixed(2)}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    testKit.quantity > 10 
                      ? 'bg-green-100 text-green-800' 
                      : testKit.quantity > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {testKit.quantity > 10 
                      ? 'In Stock' 
                      : testKit.quantity > 0 
                        ? `Only ${testKit.quantity} left` 
                        : 'Out of Stock'}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(testKit)}
                  disabled={testKit.quantity < 1}
                  className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                    testKit.quantity < 1 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {testKit.quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestKitsList;