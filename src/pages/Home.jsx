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
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Why Test Your Water?
      </h2>
      <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
        Understand what's in your water and make informed decisions about your health and home.
      </p>
    </div>

    <div className="mt-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="mt-5 text-lg font-medium text-gray-900">Protect Your Family's Health</h3>
          <p className="mt-2 text-base text-gray-500">
            Detect potentially harmful contaminants like lead, bacteria, and pesticides that may be present in your drinking water.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="mt-5 text-lg font-medium text-gray-900">Home Maintenance Benefits</h3>
          <p className="mt-2 text-base text-gray-500">
            Identify water issues that can damage plumbing, appliances, and fixtures. Prevent costly repairs and extend the life of your systems.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-5 text-lg font-medium text-gray-900">Professional Reports</h3>
          <p className="mt-2 text-base text-gray-500">
            Receive detailed, easy-to-understand reports with recommendations tailored to your specific water quality results.
          </p>
        </div>
      </div>
    </div>

    <div className="mt-12 text-center">
      <p className="text-base text-gray-500">
        Water quality can vary significantly, even within the same neighborhood. Municipal water treatment doesn't catch everything, and well water should be tested regularly.
      </p>
    </div>
  </div>
</div>

        {/* How It Works Section */}
        <div className="bg-blue-50 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        How It Works
      </h2>
      <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
        Testing your water is simple with our easy-to-use kits and streamlined process.
      </p>
    </div>

    <div className="mt-16">
      <div className="lg:grid lg:grid-cols-3 lg:gap-16">
        {/* Step 1 */}
        <div className="mt-10 lg:mt-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <span className="text-lg font-bold">1</span>
          </div>
          <div className="mt-5">
            <h3 className="text-lg font-medium text-gray-900">Order Your Test Kit</h3>
            <p className="mt-2 text-base text-gray-500">
              Choose the water test kit that fits your needs. We offer options for basic testing, comprehensive analysis, and specialized tests for wells and pools.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mt-10 lg:mt-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <span className="text-lg font-bold">2</span>
          </div>
          <div className="mt-5">
            <h3 className="text-lg font-medium text-gray-900">Collect Your Sample</h3>
            <p className="mt-2 text-base text-gray-500">
              Follow our simple instructions to collect your water sample. Each kit includes everything you need, with clear step-by-step directions.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mt-10 lg:mt-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <span className="text-lg font-bold">3</span>
          </div>
          <div className="mt-5">
            <h3 className="text-lg font-medium text-gray-900">Mail It Back & Get Results</h3>
            <p className="mt-2 text-base text-gray-500">
              Send your sample to our lab using the prepaid shipping label. Within 48 hours of receiving your sample, we'll provide detailed digital results.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-16 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="md:flex md:items-center">
          <div className="md:flex-shrink-0">
            <svg className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <div className="text-lg font-medium text-gray-900">Understand Your Results</div>
            <p className="mt-1 text-gray-600">
              Our reports clearly explain what's in your water and what it means for your health and home. Each result is color-coded and includes specific recommendations based on your unique water profile.
            </p>
            <div className="mt-4">
              <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-900">
                See a sample report
                <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Featured Test Kits */}
        <div className="bg-white py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Our Most Popular Test Kits
      </h2>
      <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
        Professional-grade water testing for every need
      </p>
    </div>

    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Basic Water Test */}
      <div className="border border-gray-200 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900">Basic Water Test</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">$49.99</span>
          </div>
          <p className="mt-4 text-gray-500">
            Tests for 8 common contaminants including lead, bacteria, and chlorine. Perfect for regular monitoring.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">Lead, Bacteria, Chlorine</span>
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">pH, Nitrates, Nitrites</span>
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">Hardness, Copper</span>
            </li>
          </ul>
          <div className="mt-8">
            <a href="/test-kits" className="block w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-md hover:bg-blue-700">Order Now</a>
          </div>
        </div>
      </div>

      {/* Advanced Water Test */}
      <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-3 text-xs font-medium">
          Most Popular
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900">Advanced Water Test</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">$89.99</span>
          </div>
          <p className="mt-4 text-gray-500">
            Tests for 16 contaminants including heavy metals, pesticides, and minerals. Comprehensive analysis.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">All Basic Test parameters</span>
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">Arsenic, Chromium, Mercury</span>
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">Iron, Fluoride, Pesticides</span>
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">Manganese, PFAS</span>
            </li>
          </ul>
          <div className="mt-8">
            <a href="/test-kits" className="block w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-md hover:bg-blue-700">Order Now</a>
          </div>
        </div>
      </div>

      {/* Well Water Test */}
      <div className="border border-gray-200 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900">Well Water Test</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">$129.99</span>
          </div>
          <p className="mt-4 text-gray-500">
            Specifically designed for private wells, testing for 20+ contaminants including well-specific concerns.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">All Advanced Test parameters</span>
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">Uranium, Radon</span>
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500">Sulfate, Sodium</span>
            </li>
          </ul>
          <div className="mt-8">
            <a href="/test-kits" className="block w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-md hover:bg-blue-700">Order Now</a>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-10 text-center">
      <a href="/test-kits" className="inline-flex items-center text-blue-600 hover:text-blue-900">
        View all test kits
        <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  </div>
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