import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  email: string;
  _id?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// API URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Define an axios error type
interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios defaults and check for existing session
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Set base URL for all requests
      axios.defaults.baseURL = API_URL;
      console.log('Using API URL:', API_URL);
      
      // Enable CORS credentials
      axios.defaults.withCredentials = false;
      
      // Add request interceptor for JWT token
      axios.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Check for existing token and user data
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Set user from localStorage
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Verify token with server if needed
          const response = await axios.get('/api/auth/me');
          if (response.data) {
            setUser(response.data);
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Session validation error:', error);
          // Clear invalid session
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      
      const { token, user } = response.data;
      
      // Store both token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user || { email }));
      
      setUser(user || { email });
      setIsAuthenticated(true);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error('Login error:', axiosError.response?.data || axiosError.message);
      throw new Error(axiosError.response?.data?.message || 'Failed to login');
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      console.log('Attempting to register with:', { email });
      
      // Set explicit headers for this request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      const response = await axios.post('/api/auth/signup', {
        email,
        password,
      }, config);
      
      console.log('Registration response:', response.data);
      const { token } = response.data;
      
      const userData = { email };
      
      // Store both token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error('Registration error:', axiosError.response?.data || axiosError.message);
      if (axiosError.message.includes('Network Error')) {
        throw new Error('Network error. Please check if the server is running.');
      } else {
        throw new Error(
          axiosError.response?.data?.message || 
          'Failed to create account. Please try again.'
        );
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 
