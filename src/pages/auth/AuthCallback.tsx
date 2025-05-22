import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started');
        setProgress(30);
        
        // Get the current URL to debug any issues
        const currentUrl = window.location.href;
        console.log('Current callback URL:', currentUrl);
        
        // Get the current session without relying on URL hash which might cause 404s
        const { data, error } = await supabase.auth.getSession();
        setProgress(70);
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          toast.error('Authentication failed', {
            description: error.message
          });
          setTimeout(() => navigate('/login'), 3000); // Redirect after showing error
          return;
        }
        
        if (data?.session) {
          // Successfully authenticated
          console.log('Successfully authenticated in callback');
          setProgress(100);
          toast.success('Successfully logged in');
          navigate('/dashboard', { replace: true }); // Use replace to prevent back button issues
        } else {
          // No session found, but no error either
          console.log('No session found in callback, checking URL hash');
          
          // Try to handle the URL hash directly in case the session wasn't automatically processed
          // This is a fallback mechanism for browsers that might not process the hash correctly
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            console.log('Found access token in URL, attempting to set session');
            setProgress(85);
            // We have an access token in the URL, try to set the session manually
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || '',
            });
            
            if (setSessionError) {
              console.error('Error setting session from URL params:', setSessionError);
              setError('Failed to complete authentication');
              toast.error('Authentication failed', {
                description: 'Failed to complete the login process'
              });
              setTimeout(() => navigate('/login'), 3000);
              return;
            }
            
            // Successfully set the session, now get user details
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
              setProgress(100);
              toast.success('Successfully logged in');
              navigate('/dashboard', { replace: true });
              return;
            }
          }
          
          // Final fallback - if all else fails
          console.log('No authentication data found, redirecting to login');
          setError('Authentication incomplete. Redirecting to login...');
          toast.error('Authentication incomplete', {
            description: 'Please try logging in again'
          });
          setTimeout(() => navigate('/login', { replace: true }), 3000);
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };
    
    // Start the auth process
    setProgress(10);
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Signing into Internity</h1>
        
        {error ? (
          <div className="mb-4 text-red-500">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Redirecting you to login...</p>
            <Progress value={progress} className="mt-4" />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">Please wait while we complete the authentication process...</p>
            <Progress value={progress} className="mb-4" />
          </div>
        )}
        
        {!error && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="rounded-full h-3 w-3 bg-brand-purple animate-pulse"></div>
              <div className="rounded-full h-3 w-3 bg-brand-purple animate-pulse delay-150"></div>
              <div className="rounded-full h-3 w-3 bg-brand-purple animate-pulse delay-300"></div>
              <div className="rounded-full h-3 w-3 bg-brand-purple animate-pulse delay-450"></div>
            </div>
            
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mx-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;