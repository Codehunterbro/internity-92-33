import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) {
        // Check for specific error messages
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Try logging in instead.",
            variant: "info",
          });
          navigate('/login');
          return;
        } else if (error.message.includes('confirmation email')) {
          // This means the account was created but there was an issue with the email
          console.log('Signup successful but email confirmation failed:', error.message);
          toast({
            title: "Account created",
            description: "Your account has been created successfully. You can now log in with your credentials.",
            variant: "info",
          });
          navigate('/login');
          return;
        } else {
          toast({
            title: "Signup failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Handle successful signup
        console.log('Signup successful:', data);
        toast({
          title: "Account created",
          description: "Your account has been created successfully. You can now log in with your credentials.",
          variant: "info",
        });
        
        // Redirect to login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred, but your account might still have been created. Try logging in with your credentials.",
        variant: "info",
      });
      // Still redirect to login to let them try
      navigate('/login');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in process');
      
      // Clean up any existing auth state to prevent conflicts
      localStorage.removeItem('supabase.auth.token');
      
      // Get hostname and build redirect URL more carefully
      let redirectUrl = window.location.origin;
      
      // Make sure the redirectUrl ends with '/auth/callback'
      if (!redirectUrl.endsWith('/')) redirectUrl += '/';
      redirectUrl += 'auth/callback';
      
      // Clean up any duplicate slashes in the URL
      redirectUrl = redirectUrl.replace(/([^:]\/)\/+/g, '$1');
      
      console.log('Using redirect URL:', redirectUrl);
      
      // Direct oauth flow without the loading page
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: "Google login failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        console.log('Auth data received, redirecting:', data);
        // The redirectTo option handles the redirect to Google
        // We're not navigating to the loading page anymore
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Google login failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Get the current URL's origin for the redirect
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) {
        console.error('Password reset error details:', error);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return Promise.reject(error);
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for the password reset link.",
        });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
        return Promise.reject(error);
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Password update failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      signInWithGoogle,
      resetPassword,
      updatePassword
    }}>
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