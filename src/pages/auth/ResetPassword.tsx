
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AuthLayout from '@/components/auth/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Improved token extraction using URL parameters, hash fragments, and direct URL parsing
  useEffect(() => {
    // First, ensure we're signed out when reaching this page
    // This prevents auto-redirection to dashboard
    const ensureSignedOut = async () => {
      await supabase.auth.signOut();
      console.log('Signed out on reset password page load');
    };
    
    ensureSignedOut();
    
    const extractAndProcessToken = async () => {
      try {
        console.log('Current URL:', window.location.href);
        console.log('Location pathname:', location.pathname);
        console.log('Location search:', location.search);
        console.log('Location hash:', location.hash);
        
        // Extract tokens from various possible formats
        let accessToken = null;
        let refreshToken = '';
        let type = null;
        
        // Check URL search parameters first
        const urlToken = searchParams.get('access_token');
        if (urlToken) {
          accessToken = urlToken;
          type = searchParams.get('type');
          refreshToken = searchParams.get('refresh_token') || '';
          console.log('Found token in URL params');
        }
        
        // If no token in search params, check the hash
        if (!accessToken && location.hash) {
          // Handle both /reset-password#access_token=... and #/reset-password?access_token=... formats
          let hashContent = location.hash.replace(/^#\/?/, '');
          
          // If the hash contains a path with search params
          if (hashContent.includes('?')) {
            const [path, query] = hashContent.split('?');
            const hashParams = new URLSearchParams(query);
            accessToken = hashParams.get('access_token');
            type = hashParams.get('type');
            refreshToken = hashParams.get('refresh_token') || '';
            console.log('Found token in hash path query:', Boolean(accessToken));
          } 
          // Direct hash parameter format
          else if (hashContent.includes('access_token=')) {
            // Parse key-value pairs from hash fragment
            const hashParts = hashContent.split('&');
            for (const part of hashParts) {
              if (part.startsWith('access_token=')) {
                accessToken = part.split('=')[1];
              } else if (part.startsWith('type=')) {
                type = part.split('=')[1];
              } else if (part.startsWith('refresh_token=')) {
                refreshToken = part.split('=')[1];
              }
            }
            console.log('Found token in hash fragments:', Boolean(accessToken));
          }
        }

        // If we found a token, try to set the session
        if (accessToken) {
          console.log('Token found. Type:', type);
          
          // Check if this is a recovery token
          if (type === 'recovery' || location.pathname.includes('reset-password')) {
            setHasToken(true);
            
            try {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              
              if (error) {
                console.error('Error setting recovery session:', error);
                toast.error("Invalid or expired recovery link. Please request a new password reset link.");
                navigate('/forgot-password');
              } else {
                toast.success("Password reset link verified. Please set your new password.");
              }
            } catch (sessionError) {
              console.error('Session error:', sessionError);
              toast.error("Failed to process recovery token. Please request a new password reset link.");
              navigate('/forgot-password');
            }
          } else {
            // Not a recovery token - don't allow password reset
            console.log('Token found but not a recovery token');
            toast.error("Invalid recovery link. Please request a password reset link.");
            navigate('/forgot-password');
          }
        } else if (location.pathname.includes('reset-password')) {
          // We're on the reset password page but no token found
          console.log('No valid token found on reset password page');
          toast.error("No recovery token found. Please request a password reset link.");
          
          if (!location.pathname.includes('forgot-password')) {
            navigate('/forgot-password');
          }
        }
      } catch (error) {
        console.error('Error processing recovery token:', error);
        toast.error("An error occurred while processing your recovery link.");
        navigate('/forgot-password');
      }
    };
    
    extractAndProcessToken();
  }, [location, navigate, searchParams]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (values: FormValues) => {
    if (!hasToken) {
      toast.error("Invalid recovery session. Please request a new password reset link.");
      navigate('/forgot-password');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updatePassword(values.password);
      toast.success("Your password has been reset successfully. Please login with your new password.");
      
      // This will be handled in the updatePassword method:
      // 1. Update the password
      // 2. Sign out the user
      // 3. Navigate to login
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error("Failed to update password. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Reset your password"
      subheading="Enter your new password below"
      linkText="Sign in instead"
      linkHref="/login"
      linkDescription="Remembered your password?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      {...field} 
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      {...field} 
                    />
                    <button 
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-brand-purple hover:bg-brand-purple-hover"
              disabled={isSubmitting || !hasToken}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default ResetPassword;
