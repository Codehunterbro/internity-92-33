
import { supabase } from "@/integrations/supabase/client";

export async function updateLessonProgress(
  userId: string, 
  lessonId: string, 
  courseId: string, 
  status: 'not_started' | 'in_progress' | 'completed'
) {
  try {
    console.log('Updating lesson progress:', { userId, lessonId, courseId, status });

    // Check if progress record already exists
    const { data: existingProgress, error: checkError } = await supabase
      .from('lesson_progress')
      .select('id, status')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing progress:', checkError);
      return { success: false, error: checkError };
    }

    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('lesson_progress')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select();

      if (error) {
        console.error('Error updating lesson progress:', error);
        return { success: false, error };
      }

      console.log('Lesson progress updated:', data);
      return { success: true, data };
    } else {
      // Create new progress record
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          course_id: courseId,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .select();

      if (error) {
        console.error('Error creating lesson progress:', error);
        return { success: false, error };
      }

      console.log('Lesson progress created:', data);
      return { success: true, data };
    }
  } catch (error) {
    console.error('Error in updateLessonProgress:', error);
    return { success: false, error };
  }
}

export async function getLessonProgress(userId: string, lessonId: string, courseId: string) {
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching lesson progress:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLessonProgress:', error);
    return null;
  }
}
