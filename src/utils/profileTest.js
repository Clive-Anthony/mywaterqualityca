// src/utils/profileTest.js - Testing utility for profiles

import { supabase } from '../services/supabaseClient';

// Test if the profiles table exists and is properly set up
export const testProfilesTable = async () => {
  try {
    console.log("Testing profiles table...");
    
    // Try to query the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Profiles table test error:', error);
      return {
        success: false,
        error: error,
        message: `Profiles table error: ${error.message}`
      };
    }
    
    console.log('Profiles table exists and is accessible:', data);
    return {
      success: true,
      data: data,
      message: 'Profiles table exists and is accessible'
    };
  } catch (err) {
    console.error('Profiles table test exception:', err);
    return {
      success: false,
      error: err,
      message: `Profiles table test exception: ${err.message}`
    };
  }
};

// Test creating a profile record manually
export const testProfileCreation = async (userId = null) => {
  if (!userId) {
    // Get the current user ID if available
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
    
    if (!userId) {
      return {
        success: false,
        message: "No user ID provided or user not logged in"
      };
    }
  }
  
  try {
    console.log("Testing profile creation for user:", userId);
    
    // Check if a profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!fetchError && existingProfile) {
      console.log('Profile already exists:', existingProfile);
      return {
        success: true,
        data: existingProfile,
        message: 'Profile already exists',
        exists: true
      };
    }
    
    // Get user details from auth.users
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        message: "Could not get user details"
      };
    }
    
    // Create a test profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email: user.email,
          first_name: user.user_metadata?.first_name || 'Test',
          last_name: user.user_metadata?.last_name || 'User',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (insertError) {
      console.error('Profile creation error:', insertError);
      return {
        success: false,
        error: insertError,
        message: `Profile creation failed: ${insertError.message}`
      };
    }
    
    console.log('Profile created successfully:', newProfile);
    return {
      success: true,
      data: newProfile,
      message: 'Profile created successfully'
    };
  } catch (err) {
    console.error('Profile creation test exception:', err);
    return {
      success: false,
      error: err,
      message: `Profile creation test exception: ${err.message}`
    };
  }
};

// Expose these tests to the window object for console access
// Only in development environment
if (import.meta.env.DEV) {
  // Add to the existing supabaseTest object if it exists
  if (window.supabaseTest) {
    window.supabaseTest.testProfilesTable = testProfilesTable;
    window.supabaseTest.testProfileCreation = testProfileCreation;
  } else {
    window.supabaseTest = {
      testProfilesTable,
      testProfileCreation
    };
  }
  
  console.log('Profile tests available! Run them in console with:');
  console.log('window.supabaseTest.testProfilesTable()');
  console.log('window.supabaseTest.testProfileCreation()');
}

export default {
  testProfilesTable,
  testProfileCreation
};