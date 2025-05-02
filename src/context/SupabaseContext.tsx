
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

// Initialize Supabase client with proper URL and key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pifzapdqhaxgskypadws.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZnphcGRxaGF4Z3NreXBhZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTQ2NjIsImV4cCI6MjA2MTM3MDY2Mn0.CPcFj62zuDGbTJNjsGgA7NK2YAACDDlieKCL_QFDg8M';

let supabaseClient: SupabaseClient;

try {
  // Create the Supabase client
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized with URL:', supabaseUrl);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a mock client as fallback
  supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase client initialization failed') }),
      signOut: () => Promise.resolve({ error: null }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
    },
    from: () => ({
      select: () => ({ data: null, error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as any;
}

type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  user: any | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  isAdmin: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);

        // Check if user is admin
        if (data.session?.user) {
          const { data: userData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('is_admin')
            .eq('id', data.session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile data:", profileError);
          } else {
            console.log("Admin status check:", userData?.is_admin);
            setIsAdmin(userData?.is_admin || false);
          }
        }
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        // Check if user is admin when auth changes
        if (session?.user) {
          const { data: userData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile data on auth change:", profileError);
          } else {
            console.log("Admin status update:", userData?.is_admin);
            setIsAdmin(userData?.is_admin || false);
          }
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // After successful login, check if the user is an admin
      if (data.user) {
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error("Error checking admin status:", profileError);
        } else {
          console.log("Admin login check:", profileData?.is_admin);
          setIsAdmin(profileData?.is_admin || false);
        }
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Unable to sign in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear user data on logout
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "Unable to sign out",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "Unable to sign in with Google",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    supabase: supabaseClient,
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
    signInWithGoogle,
    isAdmin,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
