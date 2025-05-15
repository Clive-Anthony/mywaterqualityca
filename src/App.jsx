// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { validateSupabaseSetup } from './utils/validateSupabase';
import { useEffect } from 'react';
import { supabase } from './services/supabaseClient';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import VerificationPage from './pages/Verification';
import DashboardPage from './pages/Dashboard';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import TestKitsPage from './pages/TestKits';
import ProfilePage from './pages/Profile';
import OrdersPage from './pages/Orders';
import ResultsPage from './pages/Results';
import ResultDetailPage from './pages/ResultDetail';
import CartPage from './pages/Cart';
import NotFoundPage from './pages/NotFound';

export default function App() {

  // Add this connection test function

const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Log environment variables (be careful not to expose in production)
    console.log('Supabase URL configured:', !!import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase key configured:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Test if we can connect to Supabase with a simple query
    const { data, error } = await supabase.from('test_kits').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
    
    console.log('Supabase connection successful!', data);
    return true;
  } catch (err) {
    console.error('Supabase connection test exception:', err);
    return false;
  }

};

useEffect(() => {
  // Test Supabase connection when the app loads
  testSupabaseConnection().then(isConnected => {
    console.log('Supabase connection test result:', isConnected);
  });
}, []);

  validateSupabaseSetup().then(isValid => console.log('Supabase setup valid:', isValid));
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/test-kits" element={<TestKitsPage />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:id"
            element={
              <ProtectedRoute>
                <ResultDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          
          {/* Catch 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}