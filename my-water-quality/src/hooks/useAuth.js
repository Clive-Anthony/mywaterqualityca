// src/hooks/useAuth.js - Modified signUp function to create a profile record

import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for user on hook initialization
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (err) {
        console.error('Error getting current user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event);
        
        // If a user just signed up or signed in, ensure their profile exists
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await ensureProfileExists(session.user);
          } catch (profileErr) {
            console.error('Error ensuring profile exists:', profileErr);
          }
        }
        
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Ensure a user profile exists in the public.profiles table
  const ensureProfileExists = async (user) => {
    if (!user) return;
    
    console.log('Ensuring profile exists for user:', user.id);
    
    // First check if a profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error code
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }
    
    // If profile exists, no need to create a new one
    if (existingProfile) {
      console.log('Profile already exists:', existingProfile);
      return existingProfile;
    }
    
    console.log('Creating new profile for user:', user.id);
    
    // Create a new profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id, // Use the auth.users ID as the profiles ID
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating profile:', insertError);
      throw insertError;
    }
    
    console.log('Created new profile:', newProfile);
    return newProfile;
  };

  // Sign up with email and password
  const signUp = async (params) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have the correct structure
      const { email, password, ...metadata } = params;
      
      console.log('Signup params:', { email, metadata });
      
      // 1. First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      // 2. Create a profile record in public.profiles table
      if (data?.user) {
        console.log('User created successfully, now creating profile...');
        
        try {
          await ensureProfileExists(data.user);
        } catch (profileError) {
          console.error('Failed to create profile:', profileError);
          // Even if profile creation fails, we return the user object
          // since the auth user was created successfully
        }
      }
      
      return data;
    } catch (err) {
      console.error('Signup error details:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      // Ensure profile exists after sign in
      if (data?.user) {
        try {
          await ensureProfileExists(data.user);
        } catch (profileError) {
          console.error('Error ensuring profile after sign in:', profileError);
        }
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Other auth methods remain the same
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };
}

// Also export as default to support both import styles
export default useAuth;