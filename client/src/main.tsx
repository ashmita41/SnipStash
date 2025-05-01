import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import Prism core
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Debug environment variables and initialization
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('Environment initialization:');
console.log('Environment variables:', {
  API_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  BASE_URL: import.meta.env.BASE_URL,
  ORIGIN: window.location.origin
});

// Check if API URL is accessible
const checkApiAccess = () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  fetch(`${API_URL}/api/status`, { 
    method: 'GET',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      'Origin': window.location.origin
    }
  })
    .then(response => {
      clearTimeout(timeoutId);
      if (response.ok) {
        console.log('API is accessible ✅');
        return response.json();
      } else {
        console.warn(`API responded with status ${response.status} ⚠️`);
        return null;
      }
    })
    .then(data => {
      if (data) console.log('API status:', data);
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.error('API access check failed:', error.message, '❌');
      console.log('If this is a CORS error, please check your backend CORS configuration.');
      console.log(`Make sure ${window.location.origin} is allowed in your backend CORS settings.`);
    });
};

// Run API access check
checkApiAccess();

// Initialize Prism
if (typeof window !== 'undefined') {
  window.Prism = window.Prism || {};
  Object.assign(window.Prism, Prism);
}

// Mount React app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
