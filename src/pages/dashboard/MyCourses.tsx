import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PurchasedCoursesSection from '@/components/dashboard/courses/PurchasedCoursesSection';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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

  // Fetch courses when component mounts - only once
  useEffect(() => {
    if (!hasRefetched) {
      refetchCourses().catch(err => {
        console.error("Failed to fetch courses:", err);
      }).finally(() => {
        setHasRefetched(true);
      });
    }
  }, [refetchCourses, hasRefetched]);

  // Display error toast if there's an issue fetching courses
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load your courses. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  return <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Full-width course section to fill the space */}
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