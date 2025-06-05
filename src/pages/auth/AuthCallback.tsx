
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
        console.log('Current URL:', window.location.href);
        setProgress(30);
        
        // First, try to get the session to see if we're already authenticated
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
        }
        
        if (sessionData?.session) {
          console.log('Existing session found, redirecting to dashboard');
          setProgress(100);
          toast.success('Successfully logged in with Google');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
          return;
        }
        
        setProgress(50);
        
        // Check if we have auth tokens in the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const errorCode = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        console.log('URL hash params:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          errorCode,
          errorDescription
        });
        
        // Handle OAuth errors
        if (errorCode) {
          console.error('OAuth error:', errorCode, errorDescription);
          setError(`Authentication failed: ${errorDescription || errorCode}`);
          toast.error('Google login failed', {
            description: errorDescription || 'Please try again'
          });
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }
        
        // If we have tokens, try to set the session
        if (accessToken && refreshToken) {
          console.log('Found tokens in URL, setting session');
          setProgress(70);
          
          const { data: newSessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (setSessionError) {
            console.error('Error setting session:', setSessionError);
            setError('Failed to complete authentication');
            toast.error('Authentication failed', {
              description: 'Failed to establish session'
            });
            setTimeout(() => navigate('/login', { replace: true }), 3000);
            return;
          }
          
          if (newSessionData?.session) {
            console.log('Session set successfully');
            setProgress(100);
            toast.success('Successfully logged in with Google');
            
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname + '#/dashboard');
            
            setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
            return;
          }
        }
        
        // If we reach here, something went wrong
        console.log('No valid authentication data found');
        setError('Authentication incomplete. Please try again.');
        toast.error('Authentication incomplete', {
          description: 'Please try logging in again'
        });
        setTimeout(() => navigate('/login', { replace: true }), 3000);
        
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('An unexpected error occurred');
        toast.error('Authentication error', {
          description: 'An unexpected error occurred during login'
        });
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };
    
    // Small delay to ensure the page is fully loaded
    const timeout = setTimeout(handleAuthCallback, 500);
    
    return () => clearTimeout(timeout);
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
