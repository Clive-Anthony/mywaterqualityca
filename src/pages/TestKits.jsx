// src/pages/TestKits.jsx - Updated version
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SupabaseTestKits from '../components/SupabaseTestKits';
import TestKitTable from '../components/TestKitTable';
import { Link } from 'react-router-dom';

export default function TestKitsPage() {
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Professional Water Testing Kits
                </h1>
                <p className="mt-4 max-w-3xl text-xl text-blue-100">
                  Discover what's in your water with our easy-to-use testing kits. 
                  Get accurate results and comprehensive reports to help you make 
                  informed decisions about your water quality.
                </p>
                <div className="mt-8">
                  <a href="#test-kits" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50">
                    View All Kits
                  </a>
                </div>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="/api/placeholder/500/300" 
                  alt="Water testing kit" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="test-kits">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Test Kits</h2>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grid View</h3>
            <p className="text-gray-500 mb-6">Card-based view of test kits with add to cart functionality:</p>
            <SupabaseTestKits />
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Our Test Kits?</h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Professional-grade water testing with simple, easy-to-understand results
              </p>
            </div>
            
            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Laboratory-Grade Accuracy</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our test kits use the same methods as professional labs, giving you reliable results.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Quick Results</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get your comprehensive water quality report within 48 hours of our lab receiving your sample.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Simple to Use</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Easy-to-follow instructions make collecting and submitting your water sample straightforward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-blue-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Not sure which test kit is right for you?</span>
              <span className="block text-blue-200">Our water quality experts can help.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Contact an Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}