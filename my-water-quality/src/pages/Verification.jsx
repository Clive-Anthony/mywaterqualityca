// src/pages/Verification.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { authService } from '../services/supabaseClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function VerificationPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the email from location state (passed from signup page)
  const email = location.state?.email || '';
  
  const handleResendEmail = async () => {
    if (!email) {
      setError('Email address is missing. Please go back to the signup page.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      // In a real app, this would call Supabase to resend verification email
      // await supabase.auth.resend({ type: 'signup', email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Verification email sent successfully. Please check your inbox.');
    } catch (err) {
      console.error('Error resending verification email:', err);
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen flex flex-col py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to{' '}
              <span className="font-medium">
                {email || 'your email address'}
              </span>
              . Please check your inbox and click the link to verify your account.
            </p>
            
            {message && (
              <div className="mb-4 p-4 bg-green-50 rounded-md text-green-800">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 rounded-md text-red-800">
                {error}
              </div>
            )}
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button 
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {loading ? 'Sending...' : 'click here to resend'}
                </button>
              </p>
            </div>
            
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}