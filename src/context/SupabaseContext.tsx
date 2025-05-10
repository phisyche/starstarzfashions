
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type AuthData = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profileData: any;
  profileLoading: boolean;
  profileError: any;
};

type SupabaseContextType = AuthData & {
  supabase: typeof supabase;
  signUp: (data: { email: string; password: string; metadata?: Record<string, any> }) => Promise<any>;
  signIn: (data: { email: string; password: string }) => Promise<any>;
  signOut: () => Promise<void>;
  updateEmail: (email: string) => Promise<any>;
  refreshProfile: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setIsAdmin(false);
        setProfileData(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if the user is an admin
  const checkAdminStatus = async (user: User) => {
    try {
      // First try to get the admin status from user metadata
      if (user.user_metadata?.isAdmin) {
        setIsAdmin(true);
        console.log('Admin status from metadata: true for user:', user.email);
      } else {
        // Use our RPC function to check admin status
        const { data, error } = await supabase.rpc('is_admin');

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data || false);
          console.log('Admin status from function:', data, 'for user:', user.email);
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
    
    setLoading(false);
  };

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      setProfileError(null);
      
      // Use our security definer function to safely get profile
      const { data, error } = await supabase
        .rpc('get_profile_by_id', { profile_id: userId });
      
      if (error) {
        console.error('Error fetching profile:', error);
        setProfileError(error);
        
        // If the RPC fails, try direct fetch with caution
        try {
          const directResult = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (directResult.error) {
            console.error('Error in fallback profile fetch:', directResult.error);
          } else {
            setProfileData(directResult.data);
          }
        } catch (fallbackError) {
          console.error('Fallback fetch error:', fallbackError);
        }
      } else {
        setProfileData(data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setProfileError(error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Refresh user profile data
  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  // Sign up a new user
  const signUp = async ({ email, password, metadata = {} }: { email: string; password: string; metadata?: Record<string, any> }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Sign in existing user
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Clear any cached data
      localStorage.removeItem('favorites');
      localStorage.removeItem('cart');
      
      // Ensure user state is cleared
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setProfileData(null);
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out"
      });
      
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  // Update user email
  const updateEmail = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      toast({
        title: "Email update initiated",
        description: "Please check your new email address for verification instructions"
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error updating email",
        description: (error as Error).message || "An error occurred while updating email",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        profileData,
        profileLoading,
        profileError,
        supabase,
        signUp,
        signIn,
        signOut,
        updateEmail,
        refreshProfile
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export function useSupabase() {
  const context = useContext(SupabaseContext);
  
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  
  return context;
}
