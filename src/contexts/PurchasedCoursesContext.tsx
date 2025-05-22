import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getCourseById } from '@/services/courseService';

export type Course = {
  id: string; // Always use string for consistency
  course_id: string; // Course ID reference to courses table
  title: string;
  image: string;
  lessonsCompleted: number;
  totalLessons: number;
  duration: string;
};

type PurchasedCoursesContextType = {
  purchasedCourses: Course[];
  addPurchasedCourses: (courses: Course[]) => Promise<void>;
  isLoading: boolean;
  refetchCourses: () => Promise<void>;
  updateLessonProgress: (courseId: string, completed: number) => Promise<void>;
  error: Error | null; // Added error property
};

const PurchasedCoursesContext = createContext<PurchasedCoursesContextType | undefined>(undefined);

export function PurchasedCoursesProvider({ children }: { children: ReactNode }) {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null); // Added error state
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPurchasedCourses();
    } else {
      // Clear courses if user logs out
      setPurchasedCourses([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadPurchasedCourses = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null); // Reset error state when loading
      console.log('Loading purchased courses for user:', user.id);
      
      // First approach: Try to get courses from the purchased_courses table
      const { data: purchasedData, error: purchasedError } = await supabase
        .from('purchased_courses')
        .select('*')
        .eq('user_id', user.id);

      if (purchasedError) {
        console.error('Error loading purchased courses from purchased_courses table:', purchasedError);
        // If there's an error with the purchased_courses table, try the student_transactions approach
        await loadCoursesFromTransactions();
        return;
      }

      console.log('Purchased courses data from purchased_courses table:', purchasedData);

      if (purchasedData && purchasedData.length > 0) {
        const formattedCourses: Course[] = [];
        
        for (const course of purchasedData) {
          try {
            // If image is missing, try to fetch it from courses table
            let courseImage = course.image;
            if (!courseImage) {
              const courseDetails = await getCourseById(course.course_id);
              courseImage = courseDetails?.image || '';
              
              // Update the image in purchased_courses table if we found one
              if (courseImage) {
                await supabase
                  .from('purchased_courses')
                  .update({ image: courseImage })
                  .eq('id', course.id);
              }
            }
            
            formattedCourses.push({
              id: course.id,
              course_id: course.course_id,
              title: course.title || '',
              image: courseImage || '',
              lessonsCompleted: course.lessonscompleted || 0,
              totalLessons: course.totallessons || 45,
              duration: course.duration || "6 Month"
            });
          } catch (err) {
            console.error(`Error processing course ${course.id}:`, err);
          }
        }

        console.log('Formatted courses from purchased_courses table:', formattedCourses);
        setPurchasedCourses(formattedCourses);
      } else {
        // If no courses found in purchased_courses, try transactions approach
        console.log('No courses found in purchased_courses table, trying transactions approach');
        await loadCoursesFromTransactions();
      }
    } catch (err) {
      console.error('Unexpected error loading courses from purchased_courses table:', err);
      setError(err instanceof Error ? err : new Error('Failed to load courses')); // Set error state
      // Try the backup approach
      await loadCoursesFromTransactions();
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoursesFromTransactions = async () => {
    if (!user) return;

    try {
      console.log('Loading courses from student_transactions table');
      
      // Get all transactions for the current user
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('student_transactions')
        .select('course_id')
        .eq('user_id', user.id);

      if (transactionsError) {
        console.error('Error loading student_transactions:', transactionsError);
        setError(new Error('Failed to load course transactions')); // Set error state
        setPurchasedCourses([]);
        return;
      }

      if (!transactionsData || transactionsData.length === 0) {
        console.log('No transactions found for user');
        setPurchasedCourses([]);
        return;
      }

      console.log('Found transactions:', transactionsData);

      // Extract course IDs from transactions
      const courseIds = transactionsData.map(transaction => transaction.course_id);

      // Get course details for these IDs
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, image, duration')
        .in('id', courseIds);

      if (coursesError) {
        console.error('Error loading courses from IDs:', coursesError);
        setError(new Error('Failed to load course details')); // Set error state
        setPurchasedCourses([]);
        return;
      }

      console.log('Courses data from transactions approach:', coursesData);

      if (coursesData && coursesData.length > 0) {
        // Create course objects from the data
        const formattedCourses: Course[] = [];
        
        for (const course of coursesData) {
          formattedCourses.push({
            id: String(course.id),
            course_id: String(course.id),
            title: course.title || '',
            image: course.image || '',
            lessonsCompleted: 0, // Default values since we don't have progress data
            totalLessons: 45,
            duration: course.duration || "6 Month"
          });
          
          // Now also insert these into purchased_courses for future use
          await supabase
            .from('purchased_courses')
            .upsert({
              user_id: user.id,
              course_id: course.id,
              title: course.title,
              image: course.image,
              lessonscompleted: 0,
              totallessons: 45,
              duration: course.duration || "6 Month",
              purchased_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,course_id',
              ignoreDuplicates: true
            });
        }

        console.log('Formatted courses from transactions approach:', formattedCourses);
        setPurchasedCourses(formattedCourses);
      } else {
        console.log('No course details found for transactions');
        setPurchasedCourses([]);
      }
    } catch (err) {
      console.error('Error in loadCoursesFromTransactions:', err);
      setError(err instanceof Error ? err : new Error('Failed to load courses from transactions')); // Set error state
      setPurchasedCourses([]);
    }
  };

  const updateLessonProgress = async (courseId: string, completed: number) => {
    if (!user) return;

    try {
      // First update in purchased_courses table
      const { error } = await supabase
        .from('purchased_courses')
        .update({ lessonscompleted: completed })
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error updating lesson progress:', error);
        setError(new Error('Failed to update progress')); // Set error state
        toast({
          title: "Error",
          description: "Failed to update your progress",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setPurchasedCourses(prevCourses => 
        prevCourses.map(course => 
          course.course_id === courseId
            ? { ...course, lessonsCompleted: completed }
            : course
        )
      );

      toast({
        title: "Success",
        description: "Your progress has been updated",
      });
    } catch (err) {
      console.error('Unexpected error updating progress:', err);
      setError(err instanceof Error ? err : new Error('Failed to update progress')); // Set error state
    }
  };

  const refetchCourses = async () => {
    setError(null); // Reset error state when refetching
    return await loadPurchasedCourses();
  };

  const addPurchasedCourses = async (courses: Course[]) => {
    if (!user) return;

    // Ensure all course IDs are strings
    const coursesToAdd = courses.map(course => ({
      user_id: user.id,
      course_id: String(course.course_id), // Ensure ID is a string
      title: course.title,
      image: course.image,
      lessonscompleted: 0,
      totallessons: course.totalLessons || 45,
      duration: course.duration || "6 Month",
      purchased_at: new Date().toISOString()
    }));

    try {
      console.log('Adding purchased courses:', coursesToAdd);

      const { error } = await supabase
        .from('purchased_courses')
        .upsert(coursesToAdd, { 
          onConflict: 'user_id,course_id',
          ignoreDuplicates: true
        });

      if (error) {
        console.error('Error adding purchased courses:', error);
        setError(new Error('Failed to add courses to your library')); // Set error state
        toast({
          title: "Error",
          description: "Failed to add courses to your library: " + error.message,
          variant: "destructive",
        });
        return;
      }

      await loadPurchasedCourses();
      toast({
        title: "Success",
        description: "Courses added to your library",
      });
    } catch (err) {
      console.error('Unexpected error adding courses:', err);
      setError(err instanceof Error ? err : new Error('Failed to add courses')); // Set error state
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <PurchasedCoursesContext.Provider value={{ 
      purchasedCourses, 
      addPurchasedCourses, 
      isLoading,
      refetchCourses,
      updateLessonProgress,
      error // Added error to the context value
    }}>
      {children}
    </PurchasedCoursesContext.Provider>
  );
}

export const usePurchasedCourses = () => {
  const context = useContext(PurchasedCoursesContext);
  if (context === undefined) {
    throw new Error('usePurchasedCourses must be used within a PurchasedCoursesProvider');
  }
  return context;
};