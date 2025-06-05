import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
      (event, session) => {
        console.log('Auth state changed:', event);
        // Don't automatically set session for password recovery events
        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery event detected, not setting session automatically');
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Initial session check
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
        toast.error("Login failed: " + error.message);
      } else {
        toast.success("Login successful");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error("Login failed: An unexpected error occurred.");
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
          toast.error("Account exists: An account with this email already exists. Try logging in instead.");
          navigate('/login');
          return;
        } else if (error.message.includes('confirmation email')) {
          // This means the account was created but there was an issue with the email
          console.log('Signup successful but email confirmation failed:', error.message);
          toast.success("Account created: Your account has been created successfully. You can now log in with your credentials.");
          navigate('/login');
          return;
        } else {
          toast.error("Signup failed: " + error.message);
        }
      } else {
        // Handle successful signup
        console.log('Signup successful:', data);
        toast.success("Account created: Your account has been created successfully. You can now log in with your credentials.");
        
        // Redirect to login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error("Signup failed: An unexpected error occurred, but your account might still have been created. Try logging in with your credentials.");
      // Still redirect to login to let them try
      navigate('/login');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.success("Logged out");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in process');
      
      // Get current URL details
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const port = window.location.port;
      
      // Build the base URL
      let baseUrl = `${protocol}//${hostname}`;
      if (port && !['80', '443'].includes(port)) {
        baseUrl += `:${port}`;
      }
      
      // Always use the auth/callback route for OAuth
      const redirectUrl = `${baseUrl}/auth/callback`;
      
      console.log('OAuth redirect URL:', redirectUrl);
      console.log('Current location:', window.location.href);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        }
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        toast.error(`Google login failed: ${error.message}`);
        return;
      }
      
      console.log('Google OAuth initiated successfully:', data);
      
    } catch (error: any) {
      console.error('Unexpected error during Google sign-in:', error);
      toast.error(`Google login failed: ${error.message || 'An unexpected error occurred'}`);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Get the absolute URL with hash routing support
      const origin = window.location.origin;
      
      // Create an absolute URL that works with hash-based routing
      // This format ensures that Supabase's auth system redirects properly
      const redirectTo = `${origin}/#/reset-password`;
      
      console.log('Password reset redirect URL:', redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast.error("Password reset failed: " + error.message);
        return Promise.reject(error);
      } else {
        toast.success("Password reset email sent. Check your email for the reset link.");
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error("An unexpected error occurred during password reset.");
      return Promise.reject(error);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      // First, explicitly clear any existing session to prevent unintended login
      console.log('Starting password update process...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Password update error:', error);
        toast.error("Password update failed: " + error.message);
        return Promise.reject(error);
      } else {
        console.log('Password updated successfully');
        toast.success("Your password has been successfully updated.");
        
        // Explicitly sign out after password update
        await supabase.auth.signOut();
        console.log('User signed out after password update');
        
        // Redirect to login page to have the user sign in with their new password
        navigate('/login');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error("An unexpected error occurred while updating your password.");
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
