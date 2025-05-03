
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";

// Initialize Supabase client with proper URL and key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pifzapdqhaxgskypadws.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZnphcGRxaGF4Z3NreXBhZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTQ2NjIsImV4cCI6MjA2MTM3MDY2Mn0.CPcFj62zuDGbTJNjsGgA7NK2YAACDDlieKCL_QFDg8M';

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
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);

        // Check if user is admin
        if (data.session?.user) {
          const { data: userData, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', data.session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile data:", profileError);
            // Create a profile if it doesn't exist
            if (profileError.code === 'PGRST116') {
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: data.session.user.id,
                  email: data.session.user.email,
                  is_admin: data.session.user.email === 'phisyche@gmail.com' || 
                            data.session.user.email?.endsWith('@starstarzfashions.com')
                });
              
              if (insertError) {
                console.error("Error creating profile:", insertError);
              } else {
                // Check admin status again
                const { data: newData } = await supabase
                  .from('profiles')
                  .select('is_admin')
                  .eq('id', data.session.user.id)
                  .single();
                
                setIsAdmin(newData?.is_admin || false);
              }
            }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        // Check if user is admin when auth changes
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: userData, error: profileError } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', session.user.id)
                .single();

              if (profileError) {
                console.error("Error fetching profile data on auth change:", profileError);
                // Create a profile if it doesn't exist
                if (profileError.code === 'PGRST116') {
                  const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                      id: session.user.id,
                      email: session.user.email,
                      is_admin: session.user.email === 'phisyche@gmail.com' || 
                                session.user.email?.endsWith('@starstarzfashions.com')
                    });
                  
                  if (insertError) {
                    console.error("Error creating profile:", insertError);
                  } else {
                    // Check admin status again
                    const { data: newData } = await supabase
                      .from('profiles')
                      .select('is_admin')
                      .eq('id', session.user.id)
                      .single();
                    
                    setIsAdmin(newData?.is_admin || false);
                  }
                }
              } else {
                console.log("Admin status update:", userData?.is_admin);
                setIsAdmin(userData?.is_admin || false);
              }
            } catch (error) {
              console.error("Error checking admin status:", error);
            }
          }, 0);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // After successful login, check if the user is an admin
      if (data.user) {
        setTimeout(async () => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', data.user.id)
              .single();
              
            if (profileError) {
              console.error("Error checking admin status:", profileError);
              // Create a profile if it doesn't exist
              if (profileError.code === 'PGRST116') {
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: data.user.id,
                    email: data.user.email,
                    is_admin: data.user.email === 'phisyche@gmail.com' || 
                              data.user.email?.endsWith('@starstarzfashions.com')
                  });
                
                if (insertError) {
                  console.error("Error creating profile:", insertError);
                } else {
                  // Check admin status again
                  const { data: newData } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', data.user.id)
                    .single();
                  
                  setIsAdmin(newData?.is_admin || false);
                }
              }
            } else {
              console.log("Admin login check:", profileData?.is_admin);
              setIsAdmin(profileData?.is_admin || false);
            }
          } catch (error) {
            console.error("Error checking admin status:", error);
          }
        }, 0);
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
      const { data, error } = await supabase.auth.signUp({
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
      const { error } = await supabase.auth.signOut();
      
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
      const { data, error } = await supabase.auth.signInWithOAuth({
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
    supabase,
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
