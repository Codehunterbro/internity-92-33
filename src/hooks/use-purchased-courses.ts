
import { usePurchasedCourses as usePurchasedCoursesContext } from '@/contexts/PurchasedCoursesContext';

// This hook is just a re-export of the context hook for compatibility
export const usePurchasedCourses = () => {
  return usePurchasedCoursesContext();
};

export default usePurchasedCourses;
