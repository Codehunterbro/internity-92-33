import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

const AuthLoading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(10);
  const [message, setMessage] = useState('Processing your authentication...');
  
  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 700);

    // Check if the user is already logged in
    const checkAuthStatus = async () => {
      try {
        setMessage('Checking authentication status...');
        setProgress(40);
        
        // Try to get the current session
        const { data } = await supabase.auth.getSession();
        setProgress(70);
        
        if (data?.session) {
          // User is logged in, redirect to dashboard
          setMessage('Authentication successful! Redirecting...');
          setProgress(100);
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        } else {
          // No session, redirect to login after a delay
          setMessage('Please log in to continue');
          setProgress(100);
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setMessage('Something went wrong. Redirecting to login...');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    };

    checkAuthStatus();
    
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Internity</h1>
        <div className="space-y-4">
          <p className="text-gray-600 mb-6">{message}</p>
          <Progress value={progress} className="mb-4" />
        </div>
        
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
      </div>
    </div>
  );
};

export default AuthLoading;