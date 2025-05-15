// src/utils/supabaseTest.js - Updated to include profile tests

import { supabase } from '../services/supabaseClient';
import { testProfilesTable, testProfileCreation } from './profileTest';

// Test the basic Supabase connection
export const testConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Log environment variables (careful not to expose sensitive info in production)
    console.log('Supabase URL configured:', !!import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase key configured:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Test if we can connect to Supabase with a simple query
    // We'll try to access the public schema first
    const { data, error } = await supabase
      .from('test_kits')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Connection test error:', error);
      return {
        success: false,
        error: error,
        message: `Connection failed: ${error.message}`
      };
    }
    
    console.log('Connection test successful:', data);
    return {
      success: true,
      data: data,
      message: 'Supabase connection successful!'
    };
  } catch (err) {
    console.error('Connection test exception:', err);
    return {
      success: false,
      error: err,
      message: `Connection test exception: ${err.message}`
    };
  }
};

// Test auth functionality
export const testAuth = async () => {
  try {
    console.log("Testing Supabase auth functionality...");
    
    // Check if auth API is accessible
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth test error:', error);
      return {
        success: false,
        error: error,
        message: `Auth API test failed: ${error.message}`
      };
    }
    
    console.log('Auth API test successful!', data);
    return {
      success: true,
      data: data,
      message: 'Auth API connection successful!'
    };
  } catch (err) {
    console.error('Auth test exception:', err);
    return {
      success: false,
      error: err,
      message: `Auth test exception: ${err.message}`
    };
  }
};

// Test signup with test credentials
export const testSignup = async () => {
  try {
    console.log("Testing Supabase signup functionality with test credentials...");
    
    // Use a test email that won't affect real users
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    // Attempt to sign up
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User'
        }
      }
    });
    
    if (error) {
      console.error('Signup test error:', error);
      return {
        success: false,
        error: error,
        message: `Signup test failed: ${error.message}`
      };
    }
    
    console.log('Signup test result:', data);
    
    // Check if profile was created
    if (data.user) {
      setTimeout(async () => {
        // Wait a moment for any triggers to execute
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        console.log('Profile after signup:', profile);
      }, 1000);
    }
    
    return {
      success: true,
      data: data,
      message: 'Signup test completed! Check results for details.'
    };
  } catch (err) {
    console.error('Signup test exception:', err);
    return {
      success: false,
      error: err,
      message: `Signup test exception: ${err.message}`
    };
  }
};

// Run all available tests
export const runAllTests = async () => {
  const results = {
    connection: await testConnection(),
    auth: await testAuth(),
    profiles: await testProfilesTable()
    // We don't auto-run signup or profile creation to avoid creating test data automatically
  };
  
  console.log('All test results:', results);
  return results;
};

// Expose these tests to the window object for console access
// Only in development environment
if (import.meta.env.DEV) {
  window.supabaseTest = {
    testConnection,
    testAuth,
    testSignup,
    testProfilesTable,
    testProfileCreation,
    runAll: runAllTests
  };
  
  console.log('Supabase tests available! Run them in console with:');
  console.log('window.supabaseTest.testConnection()');
  console.log('window.supabaseTest.testAuth()');
  console.log('window.supabaseTest.testProfilesTable()');
  console.log('window.supabaseTest.runAll()');
}