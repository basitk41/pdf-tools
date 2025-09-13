// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import mockAuth from '../services/auth';
import { supabase } from '../services/supabaseClient';

interface User {
  username?: string;
  token?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const loggedInUser = await mockAuth.checkAuth();
        setUser(loggedInUser);
      } catch (error) {
        console.error('Failed to check auth status', error);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email,name,role')
        .eq('email', username)
        .eq('password', password)
        .single();
      if (error) {
        throw error;
      }
      // const loggedInUser = await mockAuth.login(username, password);
      setUser(data);
      localStorage.setItem('authToken', data.email); // Store token
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await mockAuth.logout();
      setUser(null);
      localStorage.removeItem('authToken'); // Remove token
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
