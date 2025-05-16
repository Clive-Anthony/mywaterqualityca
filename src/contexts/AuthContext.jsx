// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

<<<<<<< HEAD
// Create an authentication context
const AuthContext = createContext(null);

// AuthProvider component to wrap your app with
=======
// Create context
const AuthContext = createContext(null);

// Provider component
>>>>>>> 83a7882 (folder restructure)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

<<<<<<< HEAD
  useEffect(() => {
    // Check for active session on component mount
    checkUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    
    // Clean up the listener when the component unmounts
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Check if there's already a user session
  async function checkUser() {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        setUser(data.session.user);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Sign up with email and password
  // UPDATED implementation - ensure metadata is correctly formatted:
async function signUp({ email, password, ...metadata }) {
  try {
    setLoading(true);
    console.log("Signup metadata:", metadata); // Debug log
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.first_name || '',
          last_name: metadata.last_name || '',
          full_name: metadata.full_name || `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim()
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Signup error details:", error); // More detailed error logging
    setError(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
}

  // Sign in with email and password
  async function signIn({ email, password, remember = false }) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Sign in with Google OAuth
  async function signInWithGoogle() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Sign out
  async function signOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Send password reset email
  async function resetPassword(email) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Update user profile data
  async function updateProfile(updates) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;
      
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Context value
=======
  // Check for user session on mount
  useEffect(() => {
    console.log('AuthProvider initializing...');
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setUser(data.session?.user || null);
        console.log('Initial auth session:', data.session?.user ? 'User logged in' : 'No user');
      } catch (err) {
        console.error('Error getting auth session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      setUser(session?.user || null);
      setLoading(false);
    });

    checkUser();

    // Clean up the subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Auth context value
>>>>>>> 83a7882 (folder restructure)
  const value = {
    user,
    loading,
    error,
<<<<<<< HEAD
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  };

  // Provide the auth context to child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
=======
    signOut: async () => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          throw error;
        }
        
        setUser(null);
      } catch (err) {
        console.error('Sign out error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
>>>>>>> 83a7882 (folder restructure)
  return context;
}