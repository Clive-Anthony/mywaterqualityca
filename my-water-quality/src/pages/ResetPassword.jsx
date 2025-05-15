// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hashParams, setHashParams] = useState(null);
  
  const navigate = useNavigate();
  const { loading } = useAuth();
  
  // Extract hash parameters from URL for password reset
  useEffect(() => {
    // In a real implementation, we would parse the hash fragment
    // to extract access_token, type, etc. from Supabase redirect
    const hash = window.location.hash.substring(1);
    const params = hash.split('&').reduce((acc, param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {});
    
    setHashParams(params);
    
    // If no token is present, redirect to forgot password
    if (!hash || !params.access_token) {
      setError('Invalid or expired password reset link. Please try again.');
    }
  }, [navigate]);
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!password || !confirmPassword) {
      return setError('Please enter all fields');
    }
    
    if (password.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (!hashParams?.access_token) {
      return setError('Invalid reset link. Please request a new password reset link.');
    }
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset your password. Please try again.');
    }
  };
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen flex flex-col py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {success ? 'Password Reset Complete' : 'Reset Your Password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {success 
              ? 'Your password has been reset successfully' 
              : 'Create a new password for your account'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {success ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <p className="text-gray-700 mb-6">
                  Your password has been reset successfully. You will be redirected to the login page shortly.
                </p>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to login
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}
                
                <form className="space-y-6" onSubmit={handleResetPassword}>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading || !hashParams?.access_token}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(loading || !hashParams?.access_token) ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Need help?
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to="/forgot-password"
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Request new reset link
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}