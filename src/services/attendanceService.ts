
import { supabase } from "@/integrations/supabase/client";

export async function markAttendance(userId: string, lessonId: string, courseId: string) {
  try {
    console.log("Marking attendance with params:", { userId, lessonId, courseId });
    
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        status: 'present'
      })
      .select();

    if (error) {
      // If it's a unique constraint violation, it means attendance already marked for today
      if (error.code === '23505') {
        console.log('Attendance already marked for today');
        return { success: true, alreadyMarked: true };
      }
      console.error('Error marking attendance:', error);
      return { success: false, error };
    }

    console.log('Attendance marked successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in markAttendance:', error);
    return { success: false, error };
  }
}

export async function getUserAttendance(userId: string, courseId?: string) {
  try {
    let query = supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserAttendance:', error);
    return [];
  }
}

export async function checkTodayAttendance(userId: string, lessonId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log("Checking attendance for:", { userId, lessonId, today });
    
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('date', today)
      .maybeSingle();

    if (error) {
      console.error('Error checking today attendance:', error);
      return false;
    }

    console.log("Attendance check result:", data);
    return !!data;
  } catch (error) {
    console.error('Error in checkTodayAttendance:', error);
    return false;
  }
}
