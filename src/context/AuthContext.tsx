import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { Session, User } from '@supabase/supabase-js';
import { initializeUserProfile } from '../utils/initUserProfile';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on component mount
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    getSession();

    // Set up subscription to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (!error && data.user) {
        // Initialize profile data for the new user
        try {
          await initializeUserProfile(data.user.id, email);
        } catch (profileError) {
          console.error("Error initializing profile data:", profileError);
          // Continue with signup even if profile initialization fails
        }
      }
      
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error.message);
      }
      
      // Clear state manually to ensure clean logout
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear any Supabase-related cookies and local storage
      try {
        // Clear supabase-related items from localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
        
        // Clear session cookies if possible
        document.cookie.split(';').forEach(c => {
          const cookie = c.trim();
          if (cookie.startsWith('sb-')) {
            document.cookie = cookie.split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          }
        });
      } catch (e) {
        console.error("Error clearing browser storage:", e);
      }
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signUp, logout, session }}>
      {!loading && children}
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