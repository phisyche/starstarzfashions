
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
  updateEmail: (email: string) => Promise<any>;
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
      // Use the is_admin function we created in SQL
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      // If we still need to check the profiles table as fallback
      if (data === null) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error checking profile admin status:", profileError);
          return false;
        }
        
        return profileData?.is_admin || false;
      }
      
      return data || false;
    } catch (error) {
      console.error("Error in admin check:", error);
      return false;
    }
  };

  useEffect(() => {
    const setUpAuth = async () => {
      setLoading(true);
      
      // Setup auth listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Auth state changed:", event, newSession?.user?.email);
          
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Check admin status after session update
          if (newSession?.user) {
            const isUserAdmin = await checkAdminStatus(newSession.user.id);
            setIsAdmin(isUserAdmin);
            console.log("Admin status:", isUserAdmin, "for user:", newSession.user.email);
          } else {
            setIsAdmin(false);
          }
          
          setLoading(false);
        }
      );
      
      // Then check for existing session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        setLoading(false);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        
        // Check admin status for initial session
        const isUserAdmin = await checkAdminStatus(data.session.user.id);
        setIsAdmin(isUserAdmin);
        console.log("Initial admin status:", isUserAdmin, "for user:", data.session.user.email);
      }
      
      setLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setUpAuth();
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
      
      // Clear local storage cart items on logout
      localStorage.removeItem('cartItems');
      localStorage.removeItem('favoriteItems');
      
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

  const updateEmail = async (newEmail: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      
      if (error) {
        throw error;
      }
      
      // Update the local user state
      setUser(data.user);
      
      // Also update the email in profiles table
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ email: newEmail })
          .eq('id', user.id);
          
        if (profileError) {
          console.error("Error updating profile email:", profileError);
        }
      }
      
      toast({
        title: "Email updated",
        description: "Please check your new email to confirm the change.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Email update failed",
        description: error.message || "Unable to update email",
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
    updateEmail,
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
