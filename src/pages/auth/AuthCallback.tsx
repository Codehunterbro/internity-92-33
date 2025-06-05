
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
        console.log('URL search params:', window.location.search);
        console.log('URL hash:', window.location.hash);
        
        setProgress(30);
        
        // Parse URL parameters for OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check for OAuth error parameters
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        
        if (error) {
          console.error('OAuth error from URL:', error, errorDescription);
          throw new Error(errorDescription || error);
        }
        
        setProgress(50);
        
        // Let Supabase handle the OAuth callback automatically
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        setProgress(70);
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (sessionData?.session) {
          console.log('Session found:', sessionData.session);
          setProgress(100);
          
          // Clean up URL
          window.history.replaceState({}, document.title, '/');
          
          toast.success('Successfully logged in with Google');
          navigate('/dashboard', { replace: true });
          return;
        }
        
        // If no session yet, wait a bit and try again
        console.log('No session found immediately, waiting...');
        setProgress(85);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: retrySessionData, error: retryError } = await supabase.auth.getSession();
        
        if (retryError) {
          console.error('Retry session error:', retryError);
          throw retryError;
        }
        
        if (retrySessionData?.session) {
          console.log('Session found on retry:', retrySessionData.session);
          setProgress(100);
          
          // Clean up URL
          window.history.replaceState({}, document.title, '/');
          
          toast.success('Successfully logged in with Google');
          navigate('/dashboard', { replace: true });
          return;
        }
        
        // Still no session - this might be an incomplete callback
        console.log('No session found after retry, redirecting to login');
        throw new Error('Authentication incomplete. Please try again.');
        
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        
        toast.error('Google login failed', {
          description: err.message || 'Please try again'
        });
        
        // Wait a moment then redirect
        setTimeout(() => {
          window.history.replaceState({}, document.title, '/');
          navigate('/login', { replace: true });
        }, 3000);
      }
    };
    
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
            <p className="text-sm mt-2">Redirecting to login...</p>
            <Progress value={100} className="mt-4 bg-red-100">
              <div className="h-full bg-red-500 transition-all" style={{ width: '100%' }} />
            </Progress>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">Please wait while we complete your Google sign-in...</p>
            <Progress value={progress} className="mb-4" />
            <div className="text-sm text-gray-500">
              {progress < 50 && "Initializing..."}
              {progress >= 50 && progress < 85 && "Verifying credentials..."}
              {progress >= 85 && "Completing sign-in..."}
            </div>
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
