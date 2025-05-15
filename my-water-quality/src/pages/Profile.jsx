// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Home, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/supabaseClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function ProfilePage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Canada'
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Load user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // For development, populate with user metadata or mock data
        const userData = {
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          address: user.user_metadata?.address || {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'Canada'
          }
        };
        
        setProfile(userData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfile({
        ...profile,
        address: {
          ...profile.address,
          [addressField]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      setSaving(true);
      
      // In a real app, this would update the user's profile in Supabase
      // await profileService.updateUserProfile(user.id, profile);
      
      // Update user metadata
      const metadata = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        full_name: `${profile.firstName} ${profile.lastName}`.trim(),
        phone: profile.phone,
        address: profile.address
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success message
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account information and preferences
            </p>
          </div>
          
          <div className="bg-white shadow overflow-hidden rounded-lg">
            {/* Profile form */}
            <form onSubmit={handleSubmit}>
              <div className="px-4 py-5 sm:p-6">
                {/* Success message */}
                {success && (
                  <div className="mb-4 bg-green-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Save className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Profile updated successfully
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Error message */}
                {error && (
                  <div className="mb-4 bg-red-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Basic Information Section */}
                  <div className="sm:col-span-6">
                    <h2 className="text-xl font-medium text-gray-900 flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      Basic Information
                    </h2>
                    <hr className="mt-2" />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profile.email}
                        disabled
                        className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="sm:col-span-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                  </div>
                  
                  {/* Address Section */}
                  <div className="sm:col-span-6 mt-6">
                    <h2 className="text-xl font-medium text-gray-900 flex items-center">
                      <Home className="h-5 w-5 text-gray-400 mr-2" />
                      Address
                    </h2>
                    <hr className="mt-2" />
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address.street"
                        id="street"
                        value={profile.address.street}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address.city"
                        id="city"
                        value={profile.address.city}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      Province/State
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address.state"
                        id="state"
                        value={profile.address.state}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address.postalCode"
                        id="postalCode"
                        value={profile.address.postalCode}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="country"
                        name="address.country"
                        value={profile.address.country}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="Canada">Canada</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form actions */}
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={saving}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Security Section */}
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-medium text-gray-900">Password & Security</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your password and account security settings
              </p>
              
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change Password
                </a>
              </div>
            </div>
          </div>
          
          {/* Delete Account Section */}
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-medium text-gray-900">Delete Account</h2>
              <p className="mt-1 text-sm text-gray-500">
                Permanently delete your account and all associated data
              </p>
              
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
              <p className="mt-2 text-xs text-red-500">
                Warning: This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}