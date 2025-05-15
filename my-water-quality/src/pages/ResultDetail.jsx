// src/pages/ResultDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, AlertTriangle, FileText, Info, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { resultsService } from '../services/supabaseClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function ResultDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchResult = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // For development, use mock data
        // In a real app, this would be a call to the Supabase API
        const mockResults = {
          'res-456': {
            id: 'res-456',
            completed_date: '2025-05-07T09:45:00Z',
            status: 'completed',
            sample_id: 'WQ-12345',
            sample_collection_date: '2025-05-05T14:30:00Z',
            test_kit: { 
              name: 'Advanced Water Test',
              id: 'kit-2',
              description: 'Tests for 16 contaminants including heavy metals, pesticides, and minerals.'
            },
            summary: 'Your water shows normal levels for all tested parameters. No action is needed at this time.',
            parameters: [
              { name: 'Lead', value: '0.001', unit: 'mg/L', status: 'normal', max_limit: '0.005', description: 'Lead can cause developmental issues and other health problems.' },
              { name: 'Bacteria', value: 'Not Detected', unit: '', status: 'normal', max_limit: 'None Detected', description: 'Bacteria in drinking water can cause gastrointestinal illness.' },
              { name: 'Chlorine', value: '0.8', unit: 'mg/L', status: 'normal', max_limit: '4.0', description: 'Chlorine is used to disinfect water but can affect taste and odor at higher levels.' },
              { name: 'pH', value: '7.2', unit: '', status: 'normal', max_limit: '6.5-8.5', description: 'pH affects how water tastes and can impact plumbing if too acidic or alkaline.' },
              { name: 'Nitrates', value: '2.1', unit: 'mg/L', status: 'normal', max_limit: '10.0', description: 'High nitrate levels can be dangerous, especially for infants.' },
              { name: 'Nitrites', value: '0.01', unit: 'mg/L', status: 'normal', max_limit: '1.0', description: 'Nitrites can indicate bacterial contamination or agricultural runoff.' },
              { name: 'Hardness', value: '120', unit: 'mg/L', status: 'normal', max_limit: 'N/A', description: 'Water hardness affects how soap lathers and can cause scale buildup.' },
              { name: 'Copper', value: '0.3', unit: 'mg/L', status: 'normal', max_limit: '1.3', description: 'Copper can cause gastrointestinal distress and liver damage at high levels.' },
              { name: 'Iron', value: '0.1', unit: 'mg/L', status: 'normal', max_limit: '0.3', description: 'Iron can cause discoloration and a metallic taste.' },
              { name: 'Manganese', value: '0.02', unit: 'mg/L', status: 'normal', max_limit: '0.05', description: 'Manganese can cause discoloration and a metallic taste.' }
            ],
            overall_status: 'normal',
            recommendations: [
              'Continue to monitor your water quality annually.',
              'Consider testing for additional parameters if you notice changes in taste, odor, or appearance.'
            ],
            source_type: 'Municipal',
            laboratory_name: 'Water Quality Labs Inc.',
            laboratory_certification: 'CWQL-2025-456',
            order_id: 'ord-1234'
          },
          'res-455': {
            id: 'res-455',
            completed_date: '2025-04-22T11:15:00Z',
            status: 'completed',
            sample_id: 'WQ-12344',
            sample_collection_date: '2025-04-20T09:00:00Z',
            test_kit: { 
              name: 'Basic Water Test',
              id: 'kit-1',
              description: 'Tests for 8 common contaminants including lead, bacteria, and chlorine.'
            },
            summary: 'Your water shows elevated levels of chlorine, but is otherwise safe. While not a health concern, you may notice a stronger chlorine taste and odor.',
            parameters: [
              { name: 'Lead', value: '0.002', unit: 'mg/L', status: 'normal', max_limit: '0.005', description: 'Lead can cause developmental issues and other health problems.' },
              { name: 'Bacteria', value: 'Not Detected', unit: '', status: 'normal', max_limit: 'None Detected', description: 'Bacteria in drinking water can cause gastrointestinal illness.' },
              { name: 'Chlorine', value: '3.2', unit: 'mg/L', status: 'elevated', max_limit: '4.0', description: 'Chlorine is used to disinfect water but can affect taste and odor at higher levels.' },
              { name: 'pH', value: '7.5', unit: '', status: 'normal', max_limit: '6.5-8.5', description: 'pH affects how water tastes and can impact plumbing if too acidic or alkaline.' },
              { name: 'Hardness', value: '110', unit: 'mg/L', status: 'normal', max_limit: 'N/A', description: 'Water hardness affects how soap lathers and can cause scale buildup.' },
              { name: 'Copper', value: '0.2', unit: 'mg/L', status: 'normal', max_limit: '1.3', description: 'Copper can cause gastrointestinal distress and liver damage at high levels.' }
            ],
            overall_status: 'warning',
            recommendations: [
              'Consider using a carbon filter to reduce chlorine taste and odor.',
              'If you notice skin irritation after showering, a shower filter may help reduce chlorine exposure.',
              'Retest in 3-6 months to monitor chlorine levels.'
            ],
            source_type: 'Municipal',
            laboratory_name: 'Water Quality Labs Inc.',
            laboratory_certification: 'CWQL-2025-455',
            order_id: 'ord-1233'
          },
          'res-454': {
            id: 'res-454',
            completed_date: '2025-03-15T14:30:00Z',
            status: 'completed',
            sample_id: 'WQ-12343',
            sample_collection_date: '2025-03-12T11:45:00Z',
            test_kit: { 
              name: 'Well Water Test',
              id: 'kit-3',
              description: 'Specifically designed for private wells, testing for 20+ contaminants.'
            },
            summary: 'Your water shows unsafe levels of lead and elevated bacteria. Immediate action is recommended to address these serious health concerns.',
            parameters: [
              { name: 'Lead', value: '0.012', unit: 'mg/L', status: 'unsafe', max_limit: '0.005', description: 'Lead can cause developmental issues and other health problems.' },
              { name: 'Bacteria', value: 'Detected', unit: '', status: 'unsafe', max_limit: 'None Detected', description: 'Bacteria in drinking water can cause gastrointestinal illness.' },
              { name: 'Chlorine', value: '0.3', unit: 'mg/L', status: 'normal', max_limit: '4.0', description: 'Chlorine is used to disinfect water but can affect taste and odor at higher levels.' },
              { name: 'pH', value: '6.9', unit: '', status: 'normal', max_limit: '6.5-8.5', description: 'pH affects how water tastes and can impact plumbing if too acidic or alkaline.' },
              { name: 'Arsenic', value: '0.003', unit: 'mg/L', status: 'normal', max_limit: '0.010', description: 'Arsenic is naturally occurring but can cause cancer and other health problems.' },
              { name: 'Iron', value: '0.2', unit: 'mg/L', status: 'normal', max_limit: '0.3', description: 'Iron can cause discoloration and a metallic taste.' },
              { name: 'Manganese', value: '0.03', unit: 'mg/L', status: 'normal', max_limit: '0.05', description: 'Manganese can cause discoloration and a metallic taste.' },
              { name: 'Hardness', value: '140', unit: 'mg/L', status: 'normal', max_limit: 'N/A', description: 'Water hardness affects how soap lathers and can cause scale buildup.' }
            ],
            overall_status: 'alert',
            recommendations: [
              'Stop using your water for drinking and cooking immediately.',
              'Use bottled water for drinking, cooking, and brushing teeth until issues are resolved.',
              'Contact a professional water treatment specialist as soon as possible.',
              'Consider installing a whole-house lead filtration system.',
              'Have your well disinfected to address bacterial contamination.',
              'Retest after treatment to ensure issues have been resolved.'
            ],
            source_type: 'Private Well',
            laboratory_name: 'Water Quality Labs Inc.',
            laboratory_certification: 'CWQL-2025-454',
            order_id: 'ord-1232'
          }
        };
        
        // Get the result with the matching ID
        const resultData = mockResults[id];
        
        if (!resultData) {
          throw new Error('Test result not found');
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setResult(resultData);
      } catch (err) {
        console.error('Error fetching test result:', err);
        setError(err.message || 'Failed to load test result. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResult();
  }, [id, user]);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status color based on parameter status
  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'elevated':
        return 'bg-yellow-100 text-yellow-800';
      case 'unsafe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status icon based on parameter status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'elevated':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'unsafe':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get overall status details
  const getOverallStatusDetails = (status) => {
    switch (status) {
      case 'normal':
        return {
          color: 'bg-green-100',
          textColor: 'text-green-800',
          title: 'Normal - No Action Needed',
          icon: <FileText className="h-6 w-6 text-green-600" />,
          description: 'All parameters are within safe limits.'
        };
      case 'warning':
        return {
          color: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          title: 'Warning - Some Parameters Elevated',
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          description: 'Some parameters are elevated but still within acceptable limits. Consider the recommendations below.'
        };
      case 'alert':
        return {
          color: 'bg-red-100',
          textColor: 'text-red-800',
          title: 'Alert - Immediate Action Recommended',
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          description: 'One or more parameters exceed safe limits. Please follow the recommendations below.'
        };
      default:
        return {
          color: 'bg-gray-100',
          textColor: 'text-gray-800',
          title: 'Unknown Status',
          icon: <Info className="h-6 w-6 text-gray-600" />,
          description: 'The status of this test result is unknown.'
        };
    }
  };
  
  if (loading) {
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
  
  if (error || !result) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error || 'Test result not found'}</h3>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/results')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Results
                    </button>
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
  
  const statusDetails = getOverallStatusDetails(result.overall_status);
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/results')}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Results
            </button>
          </div>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{result.test_kit.name} Results</h1>
              <p className="mt-1 text-sm text-gray-500">
                Sample ID: {result.sample_id} | Test Completed: {formatDate(result.completed_date)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Report
              </button>
            </div>
          </div>
          
          {/* Summary Card */}
          <div className={`${statusDetails.color} rounded-lg shadow p-6 mb-8`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {statusDetails.icon}
              </div>
              <div className="ml-4">
                <h2 className={`text-lg font-medium ${statusDetails.textColor}`}>{statusDetails.title}</h2>
                <p className="mt-1 text-sm text-gray-800">{result.summary}</p>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Left column - Test Parameters */}
            <div className="md:col-span-2">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Test Parameters</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Detailed results for all tested parameters
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Parameter
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Result
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Limit
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {result.parameters.map((param, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {param.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {param.value} {param.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {param.max_limit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(param.status)}`}>
                                {param.status.charAt(0).toUpperCase() + param.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Parameter Explanations */}
              <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Parameter Explanations</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Understanding what these parameters mean for your water quality
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    {result.parameters.map((param, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 sm:border-b-0 sm:pb-0">
                        <dt className="text-sm font-medium text-gray-900">{param.name}</dt>
                        <dd className="mt-1 text-sm text-gray-500">{param.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
            
            {/* Right column - Recommendations and Test Info */}
            <div className="space-y-8">
              {/* Recommendations */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Recommendations</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="space-y-3">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">{recommendation}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Test Information */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Test Information</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Test Kit</dt>
                      <dd className="mt-1 text-sm text-gray-900">{result.test_kit.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Sample ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{result.sample_id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Sample Collection Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(result.sample_collection_date)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Test Completion Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(result.completed_date)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Water Source</dt>
                      <dd className="mt-1 text-sm text-gray-900">{result.source_type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Laboratory</dt>
                      <dd className="mt-1 text-sm text-gray-900">{result.laboratory_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Certification</dt>
                      <dd className="mt-1 text-sm text-gray-900">{result.laboratory_certification}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Order Reference</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <Link 
                          to={`/orders/${result.order_id}`} 
                          className="text-blue-600 hover:text-blue-500"
                        >
                          {result.order_id}
                        </Link>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Help Section */}
              <div className="bg-blue-50 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-blue-900">Need Help?</h3>
                <p className="mt-2 text-sm text-blue-700">
                  Our water quality experts can help you understand your results and recommend appropriate solutions for any issues detected.
                </p>
                <div className="mt-4">
                  <a
                    href="mailto:support@mywaterquality.ca"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Contact an Expert
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
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