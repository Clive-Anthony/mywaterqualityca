// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../my-water-quality/src/contexts/AuthContext';
import ProtectedRoute from '../my-water-quality/src/components/auth/ProtectedRoute';

// Pages
import HomePage from '../my-water-quality/src/pages/Home';
import LoginPage from '../my-water-quality/src/pages/Login';
import SignupPage from '../my-water-quality/src/pages/Signup';
import VerificationPage from '../my-water-quality/src/pages/Verification';
import DashboardPage from '../my-water-quality/src/pages/Dashboard';
import ForgotPasswordPage from '../my-water-quality/src/pages/ForgotPassword';
import ResetPasswordPage from '../my-water-quality/src/pages/ResetPassword';
import TestKitsPage from '../my-water-quality/src/pages/TestKits';
import ProfilePage from '../my-water-quality/src/pages/Profile';
import OrdersPage from '../my-water-quality/src/pages/Orders';
import ResultsPage from '../my-water-quality/src/pages/Results';
import ResultDetailPage from '../my-water-quality/src/pages/ResultDetail';
import CartPage from '../my-water-quality/src/pages/Cart';
import CheckoutPage from '../my-water-quality/src/pages/Checkout';
import NotFoundPage from '../my-water-quality/src/pages/NotFound';

export default function App() {
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
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
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