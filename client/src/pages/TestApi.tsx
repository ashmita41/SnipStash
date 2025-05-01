import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiStatus {
  status: string;
  message: string;
  time: string;
  cors: string;
  origin: string;
}

interface CorsDebug {
  message: string;
  timestamp: string;
  requestOrigin: string;
  host: string;
  allowedOrigins: string[];
  isVercelDomain: boolean | string;
  originAllowed: boolean | string;
  corsConfigured: boolean;
  headers: Record<string, string>;
}

const TestApi = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [corsDebug, setCorsDebug] = useState<CorsDebug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkApiConnection } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  useEffect(() => {
    const checkApi = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Direct axios call to test the exact URL
        const response = await axios.get(`${API_URL}/api/status`);
        setApiStatus(response.data);
        
        // Get CORS debug info
        try {
          const corsResponse = await axios.get(`${API_URL}/api/cors-debug`);
          setCorsDebug(corsResponse.data);
        } catch (corsErr: any) {
          console.error('CORS debug error:', corsErr);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('API test error:', err);
        setError(err.message || 'Unknown error');
        setLoading(false);
      }
    };
    
    checkApi();
  }, [API_URL]);
  
  const handleRefresh = async () => {
    setLoading(true);
    const success = await checkApiConnection();
    
    // Get CORS debug info
    try {
      const corsResponse = await axios.get(`${API_URL}/api/cors-debug`);
      setCorsDebug(corsResponse.data);
    } catch (corsErr: any) {
      console.error('CORS debug error:', corsErr);
    }
    
    setLoading(false);
    if (!success) {
      setError('Failed to connect to API');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-4">
        <p><strong>API URL:</strong> {API_URL}</p>
        <p><strong>Current Origin:</strong> {window.location.origin}</p>
      </div>
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <p className="mt-2">
            This error indicates that your frontend cannot connect to your backend API.
            Please check that your backend is running and that CORS is properly configured.
          </p>
          <pre className="bg-gray-100 p-2 mt-2 overflow-x-auto text-xs">
            {JSON.stringify({ 
              apiUrl: API_URL,
              currentUrl: window.location.origin,
              corsAllowed: apiStatus?.cors 
            }, null, 2)}
          </pre>
        </div>
      )}
      
      {apiStatus && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className="font-bold">Connection Successful!</p>
          <p><strong>Status:</strong> {apiStatus.status}</p>
          <p><strong>Message:</strong> {apiStatus.message}</p>
          <p><strong>Time:</strong> {apiStatus.time}</p>
          <p><strong>CORS:</strong> {apiStatus.cors}</p>
          <p><strong>Request Origin:</strong> {apiStatus.origin}</p>
        </div>
      )}
      
      {corsDebug && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
          <p className="font-bold">CORS Debug Information</p>
          <p><strong>Request Origin:</strong> {corsDebug.requestOrigin}</p>
          <p><strong>Host:</strong> {corsDebug.host}</p>
          <p><strong>Origin Allowed:</strong> {String(corsDebug.originAllowed)}</p>
          <p><strong>Is Vercel Domain:</strong> {String(corsDebug.isVercelDomain)}</p>
          <p><strong>CORS Configured:</strong> {corsDebug.corsConfigured ? 'Yes' : 'No'}</p>
          
          <div className="mt-3">
            <p className="font-semibold">Allowed Origins:</p>
            <ul className="list-disc list-inside ml-2">
              {corsDebug.allowedOrigins.map((origin, index) => (
                <li key={index} className="text-xs">{origin}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
        
        <Link
          to="/signup"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back to Signup
        </Link>
      </div>
    </div>
  );
};

export default TestApi; 