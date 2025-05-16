// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth API wrapper
export const authService = {
  // Get the current user
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user;
  },
  
  // Get the current session
  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session;
  },
  
  // Sign up with email
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign in with email
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Reset password
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return { success: true };
  },
  
  // Update user profile
  updateProfile: async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (error) throw error;
    return data;
  }
};

// Test kits API wrapper
export const testKitsService = {
  // Get all test kits
  getAllTestKits: async () => {
    const { data, error } = await supabase
      .from('test_kits')
      .select('*');
      
    if (error) throw error;
    return data;
  },
  
  // Get a specific test kit by ID
  getTestKitById: async (id) => {
    const { data, error } = await supabase
      .from('test_kits')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Get featured test kits
  getFeaturedTestKits: async () => {
    const { data, error } = await supabase
      .from('test_kits')
      .select('*');
      // .eq('featured', true);
      
    if (error) throw error;
    return data;
  }
};

// User profiles service
export const profileService = {
  // Get user profile
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update user profile
  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
    return data;
  },
  
  // Create user profile
  createUserProfile: async (profile) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile]);
      
    if (error) throw error;
    return data;
  }
};

// Orders service
export const ordersService = {
  // Get user orders
  getUserOrders: async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          test_kit:test_kits (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get order by ID
  getOrderById: async (orderId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          test_kit:test_kits (*)
        )
      `)
      .eq('id', orderId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Create new order
  createOrder: async (order, orderItems) => {
    // Start a transaction
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
      
    if (orderError) throw orderError;
    
    // Add order items with the new order ID
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: newOrder.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);
      
    if (itemsError) throw itemsError;
    
    return newOrder;
  }
};

// Test results service
export const resultsService = {
  // Get user test results
  getUserResults: async (userId) => {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        order:orders (*),
        test_kit:test_kits (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get result by ID
  getResultById: async (resultId) => {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        order:orders (*),
        test_kit:test_kits (*),
        result_parameters (*)
      `)
      .eq('id', resultId)
      .single();
      
    if (error) throw error;
    return data;
  }
};