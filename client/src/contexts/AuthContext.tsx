import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

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
  checkApiConnection: () => Promise<boolean>;
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

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Test API connection
      try {
        await checkApiConnection();
        console.log('API connection successful');
      } catch (error) {
        console.error('API connection failed:', error);
      }

      // Check for existing token and user data
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Set user from localStorage
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Verify token with server if needed
          try {
            const response = await api.auth.me();
            if (response.data) {
              setUser(response.data);
              // Update stored user data
              localStorage.setItem('user', JSON.stringify(response.data));
            }
          } catch (verifyError) {
            console.warn('Could not verify token with server, using stored user data:', verifyError);
          }
        } catch (parseError) {
          console.error('Session validation error:', parseError);
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

  const checkApiConnection = async (): Promise<boolean> => {
    try {
      const response = await api.status.check();
      console.log('API Status:', response.data);
      return true;
    } catch (error) {
      console.error('API Status Check Failed:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // First check if API is reachable and CORS is configured properly
      try {
        const statusCheck = await api.status.check();
        console.log('API Status before login:', statusCheck.data);
      } catch (statusError) {
        console.error('API Status check failed before login:', statusError);
        throw new Error('API is unreachable. Please check your connection and CORS configuration.');
      }
      
      const response = await api.auth.login({ email, password });
      
      const { token, user } = response.data;
      
      // Store both token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user || { email }));
      
      setUser(user || { email });
      setIsAuthenticated(true);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error('Login error:', axiosError.response?.data || axiosError.message);
      if (axiosError.message.includes('Network Error')) {
        throw new Error('Network error or CORS issue. Please check that the server allows requests from ' + window.location.origin);
      } else {
        throw new Error(axiosError.response?.data?.message || 'Failed to login');
      }
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      console.log('Attempting to register with:', { email });
      
      // First check if API is reachable and CORS is configured properly
      try {
        const statusCheck = await api.status.check();
        console.log('API Status before signup:', statusCheck.data);
      } catch (statusError) {
        console.error('API Status check failed before signup:', statusError);
        throw new Error('API is unreachable. Please check your connection and CORS configuration.');
      }
      
      const response = await api.auth.signup({ email, password });
      
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
        throw new Error('Network error or CORS issue. Please check that the server allows requests from ' + window.location.origin);
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
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, checkApiConnection }}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}; 
