import axios from 'axios';

// Use the environment variable or fallback to the production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://snipstash-api.onrender.com';

// Create an axios instance with custom config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log CORS and network errors in a helpful way
    if (error.message === 'Network Error') {
      console.error('CORS Error or API Unreachable:', {
        message: error.message,
        apiUrl: API_URL,
        clientOrigin: window.location.origin
      });
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) => 
      apiClient.post('/api/auth/login', credentials),
    signup: (credentials: { email: string; password: string }) => 
      apiClient.post('/api/auth/signup', credentials),
    me: () => apiClient.get('/api/auth/me')
  },
  
  // Snippets
  snippets: {
    getAll: () => apiClient.get('/api/snippets'),
    getOne: (id: string) => apiClient.get(`/api/snippets/${id}`),
    create: (snippet: { title: string; code: string; language: string; tags: string[] }) => 
      apiClient.post('/api/snippets', snippet),
    update: (id: string, snippet: { title: string; code: string; language: string; tags: string[] }) => 
      apiClient.put(`/api/snippets/${id}`, snippet),
    delete: (id: string) => apiClient.delete(`/api/snippets/${id}`),
  },
  
  // Status
  status: {
    check: () => apiClient.get('/api/status'),
    corsDebug: () => apiClient.get('/api/cors-debug')
  }
};

export default api; 