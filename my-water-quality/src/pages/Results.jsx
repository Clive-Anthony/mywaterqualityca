// src/pages/Results.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, AlertTriangle, ChevronRight, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { resultsService } from '../services/supabaseClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function ResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // For development, use mock data
        const mockResults = [
          {
            id: 'res-456',
            completed_date: '2025-05-07T09:45:00Z',
            status: 'completed',
            sample_id: 'WQ-12345',
            test_kit: { 
              name: 'Advanced Water Test',
              id: 'kit-2'
            },
            summary: 'Your water shows normal levels for all tested parameters.',
            parameters: [
              { name: 'Lead', value: '0.001', unit: 'mg/L', status: 'normal', max_limit: '0.005' },
              { name: 'Bacteria', value: 'Not Detected', unit: '', status: 'normal', max_limit: 'None Detected' },
              { name: 'Chlorine', value: '0.8', unit: 'mg/L', status: 'normal', max_limit: '4.0' },
              { name: 'pH', value: '7.2', unit: '', status: 'normal', max_limit: '6.5-8.5' },
              { name: 'Nitrates', value: '2.1', unit: 'mg/L', status: 'normal', max_limit: '10.0' },
              { name: 'Nitrites', value: '0.01', unit: 'mg/L', status: 'normal', max_limit: '1.0' }
            ],
            overall_status: 'normal'
          },
          {
            id: 'res-455',
            completed_date: '2025-04-22T11:15:00Z',
            status: 'completed',
            sample_id: 'WQ-12344',
            test_kit: { 
              name: 'Basic Water Test',
              id: 'kit-1'
            },
            summary: 'Your water shows elevated levels of chlorine, but is otherwise safe.',
            parameters: [
              { name: 'Lead', value: '0.002', unit: 'mg/L', status: 'normal', max_limit: '0.005' },
              { name: 'Bacteria', value: 'Not Detected', unit: '', status: 'normal', max_limit: 'None Detected' },
              { name: 'Chlorine', value: '3.2', unit: 'mg/L', status: 'elevated', max_limit: '4.0' },
              { name: 'pH', value: '7.5', unit: '', status: 'normal', max_limit: '6.5-8.5' }
            ],
            overall_status: 'warning'
          },
          {
            id: 'res-454',
            completed_date: '2025-03-15T14:30:00Z',
            status: 'completed',
            sample_id: 'WQ-12343',
            test_kit: { 
              name: 'Well Water Test',
              id: 'kit-3'
            },
            summary: 'Your water shows unsafe levels of lead and elevated bacteria. Immediate action recommended.',
            parameters: [
              { name: 'Lead', value: '0.012', unit: 'mg/L', status: 'unsafe', max_limit: '0.005' },
              { name: 'Bacteria', value: 'Detected', unit: '', status: 'unsafe', max_limit: 'None Detected' },
              { name: 'Chlorine', value: '0.3', unit: 'mg/L', status: 'normal', max_limit: '4.0' },
              { name: 'pH', value: '6.9', unit: '', status: 'normal', max_limit: '6.5-8.5' },
              { name: 'Arsenic', value: '0.003', unit: 'mg/L', status: 'normal', max_limit: '0.010' },
              { name: 'Iron', value: '0.2', unit: 'mg/L', status: 'normal', max_limit: '0.3' }
            ],
            overall_status: 'alert'
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setResults(mockResults);
      } catch (err) {
        console.error('Error fetching test results:', err);
        setError('Failed to load your test results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [user]);
  
  // Filter results based on search term
  const filteredResults = results.filter((result) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const kitNameMatch = result.test_kit.name.toLowerCase().includes(searchLower);
    const sampleIdMatch = result.sample_id.toLowerCase().includes(searchLower);
    const parametersMatch = result.parameters.some(param => 
      param.name.toLowerCase().includes(searchLower)
    );
    
    return kitNameMatch || sampleIdMatch || parametersMatch;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status details based on overall result status
  const getStatusDetails = (status) => {
    switch (status) {
      case 'normal':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Normal',
          icon: <FileText className="h-5 w-5 text-green-500" />
        };
      case 'warning':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'Warning',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
        };
      case 'alert':
        return {
          color: 'bg-red-100 text-red-800',
          text: 'Alert',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Unknown',
          icon: <FileText className="h-5 w-5 text-gray-500" />
        };
    }
  };
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Water Test Results</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and download your water quality test results
            </p>
          </div>
          
          {/* Search bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="max-w-md w-full">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search results by test kit or parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          {/* Results list */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
              {error}
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No test results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search' 
                  : 'You don\'t have any test results yet'}
              </p>
              <div className="mt-6">
                <Link
                  to="/test-kits"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Order a Test Kit
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResults.map((result) => {
                const status = getStatusDetails(result.overall_status);
                
                return (
                  <div key={result.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {status.icon}
                          <h3 className="ml-2 text-lg font-medium text-gray-900">{result.test_kit.name}</h3>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span className="truncate">Sample ID: {result.sample_id}</span>
                      </div>
                      
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">Completed on {formatDate(result.completed_date)}</span>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {result.summary}
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Key Parameters:</h4>
                        <div className="space-y-1">
                          {result.parameters.slice(0, 3).map((param, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-sm font-medium text-gray-500">{param.name}</span>
                              <div className="flex items-center">
                                <span className={`text-sm font-medium ${
                                  param.status === 'normal' ? 'text-green-600' : 
                                  param.status === 'elevated' ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {param.value} {param.unit}
                                </span>
                              </div>
                            </div>
                          ))}
                          {result.parameters.length > 3 && (
                            <div className="text-sm text-blue-600">
                              +{result.parameters.length - 3} more parameters
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <Link
                          to={`/results/${result.id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Full Report
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                        
                        <button
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Download className="mr-1 h-4 w-4" />
                          PDF
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Information section */}
          <div className="mt-8 bg-blue-50 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-blue-900">Understanding Your Results</h2>
            <p className="mt-2 text-sm text-blue-700">
              Our water test results use a simple color-coded system to help you understand your water quality:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Normal</h3>
                    <p className="text-xs text-gray-500">Parameters within safe limits</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Warning</h3>
                    <p className="text-xs text-gray-500">Elevated levels, but generally safe</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Alert</h3>
                    <p className="text-xs text-gray-500">Unsafe levels, action recommended</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}