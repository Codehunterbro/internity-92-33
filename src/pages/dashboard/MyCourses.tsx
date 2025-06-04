
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PurchasedCoursesSection from '@/components/dashboard/courses/PurchasedCoursesSection';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';

const MyCourses = () => {
  const {
    error,
    purchasedCourses,
    refetchCourses
  } = usePurchasedCourses();
  const {
    toast
  } = useToast();
  const [hasRefetched, setHasRefetched] = useState(false);
  const [showMobileHighlight, setShowMobileHighlight] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!hasRefetched) {
      refetchCourses().catch(err => {
        console.error("Failed to fetch courses:", err);
      }).finally(() => {
        setHasRefetched(true);
      });
    }
  }, [refetchCourses, hasRefetched]);

  // Show mobile highlight on first visit for small screens
  useEffect(() => {
    if (isMobile && hasRefetched) {
      const hasSeenHighlight = localStorage.getItem('myCoursesHighlightSeen');
      if (!hasSeenHighlight) {
        setShowMobileHighlight(true);
        localStorage.setItem('myCoursesHighlightSeen', 'true');
      }
    }
  }, [isMobile, hasRefetched]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load your courses. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleDismissHighlight = () => {
    setShowMobileHighlight(false);
  };
  
  return <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Mobile highlight banner */}
        {showMobileHighlight && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismissHighlight}
              className="absolute top-2 right-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="pr-8">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Welcome to My Courses! 📚</h3>
              <p className="text-sm text-blue-700">
                Here you can view all your enrolled courses, track your progress, and continue learning. 
                Tap on any course card to start or continue your learning journey.
              </p>
            </div>
          </div>
        )}

        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
              <Link to="/dashboard/courses">
                Browse More Courses
              </Link>
            </Button>
          </div>
          
          <PurchasedCoursesSection />
        </div>
      </div>
    </DashboardLayout>;
};

export default MyCourses;
