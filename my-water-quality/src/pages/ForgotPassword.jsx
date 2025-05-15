// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { resetPassword, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      return setError('Please enter your email address');
    }
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError('Failed to send password reset email. Please try again.');
    }
  };
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen flex flex-col py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSubmitted ? 'Check your email' : 'Reset your password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSubmitted 
              ? 'We\'ve sent you instructions to reset your password' 
              : 'Enter your email address and we\'ll send you a link to reset your password'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isSubmitted ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <p className="text-gray-700 mb-6">
                  If an account exists for <span className="font-medium">{email}</span>,
                  you will receive a password reset link at this email address shortly.
                </p>
                <Link
                  to="/login"
                  className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
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
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Sending...' : 'Send reset link'}
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
                        Remember your password?
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to="/login"
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Return to login
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