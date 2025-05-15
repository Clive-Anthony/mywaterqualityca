// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Droplet, Shield, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div>
        {/* Hero Section */}
        <div className="relative bg-blue-600">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              src="/api/placeholder/1500/600"
              alt="Clear water background"
            />
            <div className="absolute inset-0 bg-blue-700 mix-blend-multiply opacity-90" aria-hidden="true"></div>
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Know What's in Your Water</h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl">Professional water testing kits delivered to your door. Get accurate results and peace of mind about the water you and your family consume daily.</p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-md"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/test-kits" className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-500">
                View Test Kits
              </Link>
            </div>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="bg-white py-16">
          {/* ...rest of the value proposition section... */}
        </div>

        {/* How It Works Section */}
        <div className="bg-blue-50 py-16">
          {/* ...rest of the How It Works section... */}
        </div>

        {/* Featured Test Kits */}
        <div className="bg-white py-16">
          {/* ...rest of the Featured Test Kits section... */}
        </div>

        {/* CTA Section */}
        <div className="bg-blue-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to test your water?</span>
              <span className="block text-blue-200">Create an account today to get started.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Get Started
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link to="/about" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500">
                  Learn More
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