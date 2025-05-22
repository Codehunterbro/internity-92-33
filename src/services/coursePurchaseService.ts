
import { supabase } from '@/integrations/supabase/client';

export const checkUserPurchasedCoursesCount = async (): Promise<number> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      console.log('No authenticated user found');
      return 0;
    }
    
    // First check purchased_courses table
    const { data: purchasedData, error: purchasedError } = await supabase
      .from('purchased_courses')
      .select('id')
      .eq('user_id', user.id);
      
    if (!purchasedError && purchasedData && purchasedData.length > 0) {
      console.log(`Found ${purchasedData.length} courses in purchased_courses table`);
      return purchasedData.length;
    }
    
    // If no data in purchased_courses, check student_transactions
    const { data: transactionData, error: transactionError } = await supabase
      .from('student_transactions')
      .select('course_id')
      .eq('user_id', user.id);
    
    if (transactionError) {
      console.error('Error checking purchased courses:', transactionError);
      return 0;
    }
    
    // Count unique course IDs
    const uniqueCourseIds = new Set();
    transactionData?.forEach(transaction => {
      if (transaction.course_id) {
        uniqueCourseIds.add(transaction.course_id);
      }
    });
    
    console.log(`Found ${uniqueCourseIds.size} unique courses in student_transactions`);
    return uniqueCourseIds.size;
  } catch (err) {
    console.error('Unexpected error checking purchased courses:', err);
    return 0;
  }
};

export const savePurchasedCourses = async (courseIds: string[]) => {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const coursesToInsert = courseIds.map(courseId => ({
    user_id: userId,
    course_id: courseId,
    transaction_id: `REG-${Date.now()}-${courseId.substring(0, 8)}`, // Generate a unique transaction ID
    amount: 1000, // ₹1000 per registration
    receipt_url: null
  }));
  
  console.log('Saving transactions:', coursesToInsert);
  
  const { error } = await supabase
    .from('student_transactions')
    .insert(coursesToInsert);
    
  if (error) {
    console.error('Error recording transactions:', error);
    throw error;
  }
  
  return true;
};
