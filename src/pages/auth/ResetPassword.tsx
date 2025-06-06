
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [hasValidToken, setHasValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handlePasswordRecovery = async () => {
      try {
        console.log('Starting password recovery process...');
        console.log('Current URL:', window.location.href);
        console.log('Location hash:', location.hash);
        console.log('Location search:', location.search);

        // Extract token and type from URL
        let accessToken: string | null = null;
        let type: string | null = null;
        let refreshToken: string | null = null;

        // Check URL search parameters first
        const urlParams = new URLSearchParams(location.search);
        accessToken = urlParams.get('access_token');
        type = urlParams.get('type');
        refreshToken = urlParams.get('refresh_token');

        // If not in search params, check hash
        if (!accessToken && location.hash) {
          let hashContent = location.hash.substring(1);
          
          // Handle different hash formats
          if (hashContent.includes('?')) {
            const queryPart = hashContent.split('?')[1];
            const hashParams = new URLSearchParams(queryPart);
            accessToken = hashParams.get('access_token');
            type = hashParams.get('type');
            refreshToken = hashParams.get('refresh_token');
          } else {
            const hashParams = new URLSearchParams(hashContent);
            accessToken = hashParams.get('access_token');
            type = hashParams.get('type');
            refreshToken = hashParams.get('refresh_token');
          }
        }

        console.log('Extracted access token:', Boolean(accessToken));
        console.log('Extracted type:', type);
        console.log('Extracted refresh token:', Boolean(refreshToken));

        if (!accessToken || type !== 'recovery') {
          console.log('No valid recovery token found');
          toast.error('Invalid recovery link. Please request a new password reset.');
          navigate('/forgot-password');
          return;
        }

        try {
          // First, ensure we're signed out
          await supabase.auth.signOut();
          
          // Set the session with the recovery tokens
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '', // Use empty string if no refresh token
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            toast.error('Invalid or expired recovery link. Please request a new password reset.');
            navigate('/forgot-password');
            return;
          }

          if (data.session) {
            console.log('Recovery session set successfully');
            setHasValidToken(true);
            toast.success('Password reset link verified. Please enter your new password.');
          } else {
            console.log('No session created');
            toast.error('Failed to verify recovery link. Please request a new password reset.');
            navigate('/forgot-password');
          }
        } catch (error) {
          console.error('Error setting recovery session:', error);
          toast.error('Failed to process recovery link. Please request a new password reset.');
          navigate('/forgot-password');
        }
      } catch (error) {
        console.error('Error processing password reset:', error);
        toast.error('An error occurred while processing your recovery link.');
        navigate('/forgot-password');
      } finally {
        setIsLoading(false);
      }
    };

    handlePasswordRecovery();
  }, [location, navigate]);
  
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
    if (!hasValidToken) {
      toast.error("Invalid recovery session. Please request a new password reset link.");
      navigate('/forgot-password');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updatePassword(values.password);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout
        heading="Processing..."
        subheading="Verifying your password reset link"
        linkText="Back to login"
        linkHref="/login"
        linkDescription="Having trouble?"
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
        </div>
      </AuthLayout>
    );
  }

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
              disabled={isSubmitting || !hasValidToken}
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
