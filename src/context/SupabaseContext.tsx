
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

// Initialize Supabase client with proper fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if environment variables aren't available
let supabaseClient: SupabaseClient;

try {
  if (!supabaseUrl) {
    console.warn('Supabase URL is missing. Please set the VITE_SUPABASE_URL environment variable.');
  }
  if (!supabaseAnonKey) {
    console.warn('Supabase Anon Key is missing. Please set the VITE_SUPABASE_ANON_KEY environment variable.');
  }
  
  // Only create the client if both URL and key are available
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Create a mock client that returns empty results
    supabaseClient = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase is not configured') }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ data: null, error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
    } as any;
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a mock client as fallback
  supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase client initialization failed') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ data: null, error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  } as any;
}

type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  user: any | null;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  loading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check if Supabase is properly configured
      if (!supabaseUrl || !supabaseAnonKey) {
        toast({
          title: "Configuration Error",
          description: "Supabase is not properly configured. Please check your environment variables.",
          variant: "destructive",
        });
        throw new Error("Supabase is not properly configured");
      }
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Unable to sign in",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        throw error;
      }
      return true;
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "Unable to sign out",
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
    signOut,
    loading,
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
