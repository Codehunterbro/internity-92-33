import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { checkUserPurchasedCoursesCount } from '@/services/coursePurchaseService';
import { getUserRegistrationStatus } from '@/services/studentRegistrationService';

interface CourseRequiredRouteProps {
  children: React.ReactNode;
}

const CourseRequiredRoute = ({ children }: CourseRequiredRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [purchasedCoursesCount, setPurchasedCoursesCount] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [hasCompletedPayment, setHasCompletedPayment] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        try {
          // Check purchased courses
          const count = await checkUserPurchasedCoursesCount();
          setPurchasedCoursesCount(count);
          
          // Check registration status
          const { isRegistered, hasCompletedPayment } = await getUserRegistrationStatus();
          setIsRegistered(isRegistered);
          setHasCompletedPayment(hasCompletedPayment);
        } catch (error) {
          console.error('Error checking user status:', error);
        } finally {
          setIsCheckingStatus(false);
        }
      } else {
        setIsCheckingStatus(false);
      }
    };

    if (!loading) {
      checkUserStatus();
    }
  }, [user, loading]);

  if (loading || isCheckingStatus) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is on a protected route (not /dashboard/courses) and hasn't purchased courses or completed registration
  const isCoursesPage = location.pathname === '/dashboard/courses';
  const hasPurchasedRequiredCourses = (purchasedCoursesCount !== null && purchasedCoursesCount >= 2);
  const hasCompletedRegistration = isRegistered && hasCompletedPayment;

  if (!isCoursesPage && !(hasPurchasedRequiredCourses || hasCompletedRegistration)) {
    return <Navigate to="/dashboard/courses" replace />;
  }

  return <>{children}</>;
};

export default CourseRequiredRoute;