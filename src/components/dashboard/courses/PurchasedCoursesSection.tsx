import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import CourseCard from '@/components/dashboard/CourseCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCourseById } from '@/services/courseService';

const PurchasedCoursesSection = () => {
  const { purchasedCourses, isLoading, refetchCourses, error } = usePurchasedCourses();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [courseImages, setCourseImages] = useState<Record<string, string>>({});

  // Function to fetch course images
  const fetchCourseImages = async () => {
    if (!purchasedCourses || purchasedCourses.length === 0) return;
    
    const imageData: Record<string, string> = {};
    
    for (const course of purchasedCourses) {
      try {
        // Fetch course details from courses table to get actual image
        const courseDetails = await getCourseById(course.course_id);
        if (courseDetails && courseDetails.image) {
          imageData[course.id] = courseDetails.image;
        }
      } catch (err) {
        console.error(`Failed to fetch image for course ${course.id}:`, err);
      }
    }
    
    setCourseImages(imageData);
  };

  // Fetch course images when purchased courses load
  useEffect(() => {
    if (purchasedCourses && purchasedCourses.length > 0) {
      fetchCourseImages();
    }
  }, [purchasedCourses]);

  // Function to handle manual refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetchCourses();
      toast({
        title: "Refreshed",
        description: "Your course list has been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh your courses",
        variant: "destructive",
      });
      console.error("Error refreshing courses:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to render skeleton loaders during loading
  const renderSkeletons = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-lg border border-gray-200 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render empty state
  const renderEmptyState = () => {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-500 mb-4">You haven't purchased any courses yet</h3>
        <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
          <Link to="/dashboard/courses">
            Browse Courses
          </Link>
        </Button>
      </div>
    );
  };

  // Function to render course cards
  const renderCourseCards = () => {
    if (!purchasedCourses || purchasedCourses.length === 0) {
      return renderEmptyState();
    }

    // Log course data to debug
    console.log("Rendering purchased courses:", purchasedCourses);
    console.log("Course images data:", courseImages);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedCourses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.course_id}
            title={course.title}
            image={courseImages[course.id] || course.image || '/placeholder.svg'}
            completedLessons={course.lessonsCompleted || 0}
            totalLessons={course.totalLessons || 0}
            duration={course.duration || "N/A"}
          />
        ))}
      </div>
    );
  };

  // Main render method
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {!isLoading && purchasedCourses && purchasedCourses.length > 0 ? 
            `${purchasedCourses.length} Courses Purchased` : 
            'Your Courses'}
        </h3>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            'Refresh Courses'
          )}
        </Button>
      </div>
      
      {isLoading ? renderSkeletons() : renderCourseCards()}
      
      {error && (
        <div className="text-center p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
          <p>There was an error loading your courses.</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default PurchasedCoursesSection;