
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";

type SupabaseContextType = {
  supabase: typeof supabase;
  session: Session | null;
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Function to check admin status
  const checkAdminStatus = async (userId: string) => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      // If there's no profile entry yet, check if email is an admin email
      if (!data) {
        const { data: userData } = await supabase.auth.getUser();
        const email = userData?.user?.email;
        
        if (email && (
          email === 'phisyche@gmail.com' ||
          email === 'admin@starstarzfashions.com' ||
          email === 'orpheuscrypt@gmail.com' ||
          email.endsWith('@starstarzfashions.com')
        )) {
          // Create profile with admin access
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: userId, 
              email: email,
              is_admin: true
            }]);
            
          if (insertError) {
            console.error("Error creating admin profile:", insertError);
          }
          
          return true;
        }
        
        return false;
      }
      
      return data.is_admin || false;
    } catch (error) {
      console.error("Error in admin check:", error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Check admin status after session update
        if (newSession?.user) {
          const isUserAdmin = await checkAdminStatus(newSession.user.id);
          setIsAdmin(isUserAdmin);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          return;
        }
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Check admin status for initial session
          const isUserAdmin = await checkAdminStatus(data.session.user.id);
          setIsAdmin(isUserAdmin);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Re-check admin status on sign in
      if (data.user) {
        const isUserAdmin = await checkAdminStatus(data.user.id);
        setIsAdmin(isUserAdmin);
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
