
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface PurchasedCourse {
  id: string;
  course_id: string;
  title: string;
  image?: string;
  duration?: string;
  lessonsCompleted: number;
  totalLessons: number;
  purchased_at: string;
}

interface PurchasedCoursesContextType {
  purchasedCourses: PurchasedCourse[];
  isLoading: boolean;
  error: string | null;
  refetchCourses: () => Promise<void>;
}

const PurchasedCoursesContext = createContext<PurchasedCoursesContextType | undefined>(undefined);

export const usePurchasedCourses = () => {
  const context = useContext(PurchasedCoursesContext);
  if (!context) {
    throw new Error('usePurchasedCourses must be used within a PurchasedCoursesProvider');
  }
  return context;
};

export const PurchasedCoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchasedCourses = async () => {
    if (!user) {
      setPurchasedCourses([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching purchased courses for user:', user.id);

      // Get purchased courses with course details
      const { data: purchasedCoursesData, error: purchasedError } = await supabase
        .from('purchased_courses')
        .select(`
          id,
          course_id,
          title,
          image,
          duration,
          purchased_at
        `)
        .eq('user_id', user.id);

      if (purchasedError) {
        console.error('Error fetching purchased courses:', purchasedError);
        throw purchasedError;
      }

      console.log('Purchased courses data:', purchasedCoursesData);

      if (!purchasedCoursesData || purchasedCoursesData.length === 0) {
        setPurchasedCourses([]);
        return;
      }

      // For each purchased course, get total lessons and completed lessons
      const coursesWithProgress = await Promise.all(
        purchasedCoursesData.map(async (course) => {
          try {
            // Get total lessons count for this course
            const { count: totalLessons, error: lessonsError } = await supabase
              .from('lessons')
              .select('*', { count: 'exact', head: true })
              .in('module_id', 
                await supabase
                  .from('modules')
                  .select('id')
                  .eq('course_id', course.course_id)
                  .then(({ data }) => data?.map(m => m.id) || [])
              );

            if (lessonsError) {
              console.error('Error fetching lessons count:', lessonsError);
            }

            // Get completed lessons count for this user and course
            const { count: completedLessons, error: progressError } = await supabase
              .from('lesson_progress')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('course_id', course.course_id)
              .eq('status', 'completed');

            if (progressError) {
              console.error('Error fetching progress count:', progressError);
            }

            console.log(`Course ${course.title}: ${completedLessons || 0}/${totalLessons || 0} lessons completed`);

            return {
              ...course,
              totalLessons: totalLessons || 0,
              lessonsCompleted: completedLessons || 0
            };
          } catch (error) {
            console.error(`Error processing course ${course.id}:`, error);
            return {
              ...course,
              totalLessons: 0,
              lessonsCompleted: 0
            };
          }
        })
      );

      console.log('Final courses with progress:', coursesWithProgress);
      setPurchasedCourses(coursesWithProgress);
    } catch (error) {
      console.error('Error in fetchPurchasedCourses:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const refetchCourses = async () => {
    await fetchPurchasedCourses();
  };

  useEffect(() => {
    fetchPurchasedCourses();
  }, [user]);

  // Listen for lesson completion events
  useEffect(() => {
    const handleLessonCompleted = () => {
      console.log('Lesson completed event received, refreshing courses...');
      fetchPurchasedCourses();
    };

    window.addEventListener('lessonCompleted', handleLessonCompleted);
    
    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompleted);
    };
  }, [user]);

  const value: PurchasedCoursesContextType = {
    purchasedCourses,
    isLoading,
    error,
    refetchCourses
  };

  return (
    <PurchasedCoursesContext.Provider value={value}>
      {children}
    </PurchasedCoursesContext.Provider>
  );
};
