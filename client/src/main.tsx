import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import Prism core
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Debug environment variables
console.log('Environment variables:', {
  API_URL: import.meta.env.VITE_API_URL || 'Not set',
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

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
