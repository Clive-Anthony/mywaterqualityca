// src/utils/validateSupabase.js
import { supabase } from '../services/supabaseClient';

export const validateSupabaseSetup = async () => {
  try {
    console.log('Checking Supabase configuration...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'Not set');
    
    // Check if we have the required environment variables
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables!');
      return false;
    }
    
    // Test a simple query to see if connection works
    const { data, error } = await supabase.from('test_kits').select('id').limit(1);
    
    if (error) {
      console.error('Supabase query error:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Supabase validation error:', err);
    return false;
  }
};