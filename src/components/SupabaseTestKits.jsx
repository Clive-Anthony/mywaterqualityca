// src/components/SupabaseTestKits.jsx
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { useCart } from '../hooks/useCart';
import { AlertTriangle, Database, ExternalLink } from 'lucide-react';

const SupabaseTestKits = () => {
  const [testKits, setTestKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const timeoutRef = useRef(null);
  const { addToCart } = useCart();

  // Function to get debug info about Supabase configuration
  const getDebugInfo = () => {
    return {
      supabaseUrl: supabase?.supabaseUrl || 'Not available',
      hasAnonKey: !!supabase?.supabaseKey,
      authSession: !!supabase?.auth?.session,
      timestamp: new Date().toISOString(),
      // Add more information that might be helpful
      isRLS: "RLS should be disabled or have a policy for anonymous access",
      requiresAuth: "This component should NOT require authentication"
    };
  };

  useEffect(() => {
    let isMounted = true;
    
    // Set a timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      if (isMounted && loading) {
        console.log('Timeout reached: Query to Supabase test_kits table did not complete in time');
        setLoading(false);
        setError('Query timeout: No response from Supabase after 10 seconds');
        setDebugInfo(getDebugInfo());
      }
    }, 10000); // 10 second timeout
    
    // Direct function call, not wrapped in a named function
    async function fetchData() {
      console.log('Directly fetching test kits from Supabase...');
      try {
        // Log Supabase configuration for debugging
        const debug = getDebugInfo();
        console.log('Supabase config:', debug);
        
        // Try to fix CORS issues by adding a small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('About to query Supabase test_kits table');
        
        // We need to use the public schema to access without auth
        console.log('Explicitly querying from public schema');
        
        // Simple direct query to test_kits table - no extras
        // Use public schema explicitly
        const { data, error } = await supabase
          .from('test_kits')
          .select('*');
        
        // Log the raw response for debugging
        console.log('Supabase response:', { data, error });
        
        if (error) {
          // If we get a permission denied error, try a different approach
          if (error.message && error.message.includes('permission denied')) {
            console.log('Permission denied error - this suggests an RLS issue.');
            
            // Try to enable the client to use anon key explicitly
            console.log('Attempting to query with explicit anonymous access...');
            
            // RLS troubleshooting - SQL query to check policies
            const { data: rlsData, error: rlsError } = await supabase.rpc('get_policies');
            console.log('RLS policies:', { rlsData, rlsError });
            
            throw new Error(`Permission denied. RLS is likely blocking anonymous access. Check RLS policies for the test_kits table. Error: ${error.message}`);
          }
          
          console.error('Supabase query error:', error);
          throw new Error(`Supabase query failed: ${error.message}`);
        }
        
        if (!data) {
          throw new Error('No data returned from Supabase');
        }
        
        console.log(`Successfully loaded ${data.length} test kits from Supabase`);
        
        if (isMounted) {
          setTestKits(data);
          setDebugInfo(null); // Clear debug info on success
        }
      } catch (err) {
        console.error('Error in fetching test kits:', err);
        if (isMounted) {
          setError(err.message);
          setDebugInfo(getDebugInfo());
        }
      } finally {
        clearTimeout(timeoutRef.current);
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutRef.current);
    };
  }, []);
  
  const handleAddToCart = async (testKit) => {
    try {
      await addToCart(testKit.id, 1);
      alert(`Added ${testKit.name} to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p>Loading test kits from Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error loading test kits</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            
            {debugInfo && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-red-800">Debugging Information:</h4>
                <div className="mt-2 p-3 bg-red-100 rounded text-xs font-mono overflow-auto">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
                
            <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-red-800">Troubleshooting Steps:</h4>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 relative">
                      <span className="absolute inset-0 flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <p className="ml-2 text-sm text-red-700">
                      Check if your Supabase URL and Anon Key are correctly set in the .env file
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 relative">
                      <span className="absolute inset-0 flex items-center justify-center">
                        2
                      </span>
                    </div>
                    <p className="ml-2 text-sm text-red-700">
                      Verify that the 'test_kits' table exists in your Supabase database
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 relative">
                      <span className="absolute inset-0 flex items-center justify-center">
                        3
                      </span>
                    </div>
                    <p className="ml-2 text-sm text-red-700">
                      <strong>Important:</strong> Make sure Row Level Security (RLS) is configured to allow anonymous access. Run this SQL:
                      <code className="block mt-2 p-2 bg-red-200 rounded text-xs">
                        ALTER TABLE public.test_kits ENABLE ROW LEVEL SECURITY;<br />
                        CREATE POLICY "Allow anonymous read access" ON public.test_kits<br />
                        FOR SELECT TO authenticated, anon USING (true);
                      </code>
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <a 
                      href="https://supabase.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-red-800 hover:text-red-900"
                    >
                      Open Supabase Dashboard
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testKits.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No test kits found in the database.</p>
        <p className="text-sm text-gray-500 mt-2">
          You may need to add some test kits to your Supabase test_kits table.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testKits.map((kit) => (
        <div key={kit.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{kit.name}</h2>
            <p className="text-gray-600 mb-4">{kit.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-semibold text-blue-600">${Number(kit.price).toFixed(2)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                kit.quantity > 10 
                  ? 'bg-green-100 text-green-800' 
                  : kit.quantity > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {kit.quantity > 10 
                  ? 'In Stock' 
                  : kit.quantity > 0 
                    ? `Only ${kit.quantity} left` 
                    : 'Out of Stock'}
              </span>
            </div>
            
            <button
              onClick={() => handleAddToCart(kit)}
              disabled={kit.quantity < 1}
              className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                kit.quantity < 1 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {kit.quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupabaseTestKits;