
import { supabase } from "@/integrations/supabase/client";

export async function markAttendance(userId: string, lessonId: string, courseId: string) {
  try {
    console.log("Marking attendance with params:", { userId, lessonId, courseId });
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Check if attendance already exists for today
    const { data: existingAttendance, error: checkError } = await supabase
      .from('attendance')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('date', today)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing attendance:', checkError);
      return { success: false, error: checkError };
    }

    if (existingAttendance) {
      console.log('Attendance already marked for today');
      return { success: true, alreadyMarked: true };
    }

    // Insert new attendance record
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        status: 'present',
        date: today
      })
      .select();

    if (error) {
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
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('date', today)
      .maybeSingle();

    if (error) {
      console.error('Error checking today attendance:', error);
      return false;
    }

    const attendanceExists = !!data;
    console.log("Attendance check result:", attendanceExists);
    return attendanceExists;
  } catch (error) {
    console.error('Error in checkTodayAttendance:', error);
    return false;
  }
}
