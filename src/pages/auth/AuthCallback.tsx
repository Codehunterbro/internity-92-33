
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
        console.log('Current hash:', window.location.hash);
        setProgress(30);
        
        // Clean up the URL immediately to prevent showing confusing hash
        const originalHash = window.location.hash;
        window.history.replaceState({}, document.title, '/');
        
        // Parse the hash parameters
        const hashParams = new URLSearchParams(originalHash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const errorParam = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        // Check for OAuth errors first
        if (errorParam) {
          console.error('OAuth error from URL:', errorParam, errorDescription);
          throw new Error(errorDescription || errorParam);
        }
        
        setProgress(50);
        
        // If we have tokens in the URL, set the session
        if (accessToken && refreshToken) {
          console.log('Found tokens in URL hash, setting session');
          setProgress(70);
          
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (sessionError) {
            console.error('Error setting session from tokens:', sessionError);
            throw new Error('Failed to complete authentication');
          }
          
          if (sessionData?.session) {
            console.log('Successfully set session from URL tokens');
            setProgress(100);
            toast.success('Successfully logged in');
            navigate('/dashboard', { replace: true });
            return;
          }
        }
        
        // Fallback: check for existing session
        const { data: existingSession, error: sessionError } = await supabase.auth.getSession();
        setProgress(85);
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          throw sessionError;
        }
        
        if (existingSession?.session) {
          console.log('Found existing session');
          setProgress(100);
          toast.success('Successfully logged in');
          navigate('/dashboard', { replace: true });
        } else {
          // No valid authentication data found
          console.log('No authentication data found');
          throw new Error('No authentication data received. Please try again.');
        }
        
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        toast.error('Authentication failed', {
          description: err.message || 'Please try logging in again'
        });
        
        // Redirect to home page after a delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };
    
    // Start the auth process
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Signing into Internity</h1>
        
        {error ? (
          <div className="mb-4 text-red-500">
            <p className="font-medium">Authentication Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Redirecting you back...</p>
            <Progress value={100} className="mt-4" />
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
