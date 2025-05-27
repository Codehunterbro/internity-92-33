
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCheckoutAvailability } from '@/services/checkoutSettingsService';

type Course = {
  id: string; // Change to string to ensure consistency
  title: string;
  price: number;
  priceINR: number;
  image: string;
};

type CartContextType = {
  selectedCourses: Course[];
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void; // Changed to string
  clearCart: () => void;
  hasReachedLimit: boolean;
  isCheckoutEnabled: boolean;
  checkoutAvailableAfter: Date | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState(false);
  const [checkoutAvailableAfter, setCheckoutAvailableAfter] = useState<Date | null>(null);
  const { toast } = useToast();
  
  // Maximum number of courses that can be selected
  const MAX_COURSES = 2;
  
  // Check if user has reached the maximum limit
  const hasReachedLimit = selectedCourses.length >= MAX_COURSES;

  // Debug logging for selected courses
  useEffect(() => {
    console.log('Cart: Selected courses count:', selectedCourses.length);
    console.log('Cart: Selected courses:', selectedCourses);
    console.log('Cart: Has reached limit:', hasReachedLimit);
  }, [selectedCourses, hasReachedLimit]);

  // Fetch checkout settings on component mount
  useEffect(() => {
    const fetchCheckoutSettings = async () => {
      try {
        const { isEnabled, availableAfter } = await getCheckoutAvailability();
        setIsCheckoutEnabled(isEnabled);
        setCheckoutAvailableAfter(availableAfter);
      } catch (error) {
        console.error("Error fetching checkout settings:", error);
        // Default to disabled if error occurs
        setIsCheckoutEnabled(false);
      }
    };
    
    fetchCheckoutSettings();
  }, []);

  const addCourse = (course: Course) => {
    // Ensure the ID is a string
    const courseWithStringId = {
      ...course,
      id: String(course.id)
    };
    
    // Check if already selected
    if (selectedCourses.some(c => c.id === courseWithStringId.id)) {
      toast({
        title: "Course already selected",
        description: `${course.title} is already in your selection.`,
      });
      return;
    }
    
    // Check if limit reached
    if (hasReachedLimit) {
      toast({
        title: "Selection limit reached",
        description: `You can only select ${MAX_COURSES} courses. Please remove a course before adding another.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedCourses(prev => {
      const newCourses = [...prev, courseWithStringId];
      console.log('Cart: Adding course, new count:', newCourses.length);
      return newCourses;
    });
    
    toast({
      title: "Course added",
      description: `${course.title} has been added to your selection.`,
    });
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses(prev => {
      const newCourses = prev.filter(c => c.id !== courseId);
      console.log('Cart: Removing course, new count:', newCourses.length);
      return newCourses;
    });
    
    toast({
      title: "Course removed",
      description: "The course has been removed from your selection.",
    });
  };

  const clearCart = () => {
    setSelectedCourses([]);
    console.log('Cart: Cleared all courses');
  };

  return (
    <CartContext.Provider value={{ 
      selectedCourses, 
      addCourse, 
      removeCourse, 
      clearCart,
      hasReachedLimit,
      isCheckoutEnabled,
      checkoutAvailableAfter
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
