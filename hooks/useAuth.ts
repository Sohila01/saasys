
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { User, UserRole } from '../types';
import { initializeApi, getApi } from '../services/api-new';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userSetRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      console.log('Initializing auth...');
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
          // Try to restore session from token
          initializeApi();
          try {
            const api = getApi();
            const response = await api.get('/auth/me');
            if (mounted && response.data) {
              console.log('User restored from token:', response.data);
              const userData: User = {
                id: response.data.userId || response.data.id,
                email: response.data.email || '',
                full_name: response.data.full_name || response.data.name || 'User',
                tenant_id: response.data.tenantId || response.data.tenant_id || '',
                role: response.data.role || 'user'
              };
              userSetRef.current = true;
              setUser(userData);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.log('Could not restore session from token:', err);
            localStorage.removeItem('access_token');
          }
        }

        // Set up auth state listener for Supabase fallback
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          console.log('Auth state changed:', _event, !!session);
          
          if (!mounted) return;
          setLoading(false);

          if (session?.user && !userSetRef.current) {
            userSetRef.current = true;
            console.log('User authenticated via Supabase');
            
            const defaultUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              tenant_id: '',
              role: 'user' as any
            };
            setUser(defaultUser);
          } else if (!session?.user) {
            console.log('No session, clearing user');
            userSetRef.current = false;
            setUser(null);
          }
        });

        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error('Auth initialization error:', err);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Attempting backend login for:', email);
    
    try {
      initializeApi();
      const api = getApi();
      
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.access_token) {
        // Store token
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        
        // Set user
        const userData: User = {
          id: response.data.userId || response.data.user.id,
          email: response.data.email || response.data.user.email,
          full_name: response.data.full_name || response.data.user.full_name || 'User',
          tenant_id: response.data.tenantId || response.data.user.tenant_id || '',
          role: response.data.role || response.data.user.role || 'user'
        };
        
        userSetRef.current = true;
        setUser(userData);
        console.log('Login successful via backend');
        return response.data;
      }
    } catch (err: any) {
      console.error('Backend login failed:', err.message);
      // Fallback to Supabase auth
      console.log('Falling back to Supabase authentication');
      const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { user: session?.user };
    }
  };

  const logout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    await supabase.auth.signOut();
    setUser(null);
    userSetRef.current = false;
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
};


