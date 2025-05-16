// src/components/TestKitTable.jsx
// A simplified table view of test kits that uses a more direct approach
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const TestKitTable = () => {
  const [testKits, setTestKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Request timed out. Supabase connection may be misconfigured.');
      }
    }, 8000); // 8 seconds timeout

    async function checkConnection() {
      try {
        // Simple test to see if Supabase config exists
        const info = {
          hasUrl: !!supabase?.supabaseUrl,
          urlFirstChars: supabase?.supabaseUrl?.substring(0, 10) + '...',
          hasKey: !!supabase?.supabaseKey,
          keyLength: supabase?.supabaseKey?.length || 0,
          timestamp: new Date().toISOString()
        };
        
        setConnectionInfo(info);
        console.log('Supabase connection info:', info);
        
        // First try a very simple query
        console.log('Testing basic Supabase connection...');
        
        // Raw SQL query that should work even without the test_kits table
        const { data: versionData, error: versionError } = await supabase.rpc('version');
        
        if (versionError) {
          console.error('Basic Supabase connection test failed:', versionError);
          throw new Error(`Connection test failed: ${versionError.message}`);
        }
        
        console.log('Basic Supabase connection test succeeded:', versionData);
        
        // Now actually query the test_kits table
        console.log('Querying test_kits table...');
        const { data, error } = await supabase
          .from('test_kits')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        setTestKits(data || []);
      } catch (err) {
        console.error('Failed to fetch test kits:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    }
    
    checkConnection();
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (loading) {
    return <div className="text-center py-4">Loading test kits...</div>;
  }
  
  if (error) {
    return (
      <div className="border border-red-300 rounded bg-red-50 p-4 my-4">
        <h3 className="text-red-800 font-medium">Error fetching test kits</h3>
        <p className="text-red-700 text-sm mt-2">{error}</p>
        
        {connectionInfo && (
          <div className="mt-4 bg-white p-3 rounded text-xs overflow-x-auto">
            <pre>Connection Info: {JSON.stringify(connectionInfo, null, 2)}</pre>
          </div>
        )}
        
        <div className="mt-4 text-sm">
          <p className="font-medium">Troubleshooting:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</li>
            <li>Make sure the test_kits table exists in your Supabase database</li>
            <li>Check RLS policies to ensure anonymous access is allowed</li>
          </ul>
        </div>
      </div>
    );
  }
  
  if (testKits.length === 0) {
    return <div className="text-center py-4">No test kits found in the database.</div>;
  }
  
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {testKits.map((kit) => (
            <tr key={kit.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {kit.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {kit.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${Number(kit.price).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {kit.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestKitTable;