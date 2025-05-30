
import { supabase } from "@/integrations/supabase/client";

export async function getModulesByLessonId(courseId: string, userId: string) {
  // First get all modules for this course
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select(`
      id, 
      title, 
      description,
      order_index,
      course_id,
      week_1,
      week_2,
      week_3,
      week_4,
      courses:course_id (
        title
      )
    `)
    .eq('course_id', courseId)
    .order('order_index');

  if (modulesError) {
    console.error('Error fetching modules:', modulesError);
    return [];
  }

  if (!modules || modules.length === 0) {
    return [];
  }

  // For each module, get all lessons grouped by week
  const modulesWithLessons = await Promise.all(modules.map(async (module) => {
    // Get all lessons for this module
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select(`
        id, 
        title,
        subtitle,
        type,
        duration,
        is_locked,
        week_id,
        order_index,
        lesson_progress:lesson_progress(status)
      `)
      .eq('module_id', module.id)
      .order('order_index');

    if (lessonsError) {
      console.error(`Error fetching lessons for module ${module.id}:`, lessonsError);
      return {
        ...module,
        course_title: module.courses?.title || 'Course',
        weeks: []
      };
    }

    // Group lessons by week
    const lessonsByWeek = {};
    
    if (lessons) {
      lessons.forEach(lesson => {
        const weekId = lesson.week_id || '1'; // Default to week 1 if no week_id
        
        if (!lessonsByWeek[weekId]) {
          lessonsByWeek[weekId] = [];
        }
        
        lessonsByWeek[weekId].push({
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          duration: lesson.duration,
          isLocked: lesson.is_locked,
          isCompleted: lesson.lesson_progress && lesson.lesson_progress.length > 0 && 
                      lesson.lesson_progress[0].status === 'completed'
        });
      });
    }
    
    // Create weeks array
    const weeks = [];
    
    // Manually check for week_1, week_2, etc. properties
    for (let i = 1; i <= 4; i++) {
      const weekId = i.toString();
      const weekTitle = module[`week_${weekId}`];
      
      if (weekTitle) {
        weeks.push({
          id: weekId,
          title: weekTitle,
          lessons: lessonsByWeek[weekId] || []
        });
      }
    }
    
    return {
      ...module,
      course_title: module.courses?.title || 'Course',
      weeks
    };
  }));
  
  return modulesWithLessons;
}

export async function updateCourseProgress(userId: string, courseId: string, status: string) {
  // Instead of using course_progress, we'll use purchased_courses which exists in the schema
  // First check if entry exists
  const { data: existingCourse, error: checkError } = await supabase
    .from('purchased_courses')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
    
  if (checkError) {
    console.error('Error checking course progress:', checkError);
    return null;
  }
  
  // We'll create a custom metadata field to track progress
  const progressData = {
    status,
    completed_at: status === 'completed' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };
  
  if (existingCourse) {
    // Update existing entry
    const { data, error } = await supabase
      .from('purchased_courses')
      .update({
        // Store progress in a more generic way since we don't have a dedicated status field
        lessonscompleted: status === 'completed' ? 1 : 0
      })
      .eq('id', existingCourse.id)
      .select();
      
    if (error) {
      console.error('Error updating course progress:', error);
      return null;
    }
    
    return {
      ...data,
      progress: progressData
    };
  } else {
    // Create new entry if it doesn't exist
    const { data, error } = await supabase
      .from('purchased_courses')
      .insert({
        user_id: userId,
        course_id: courseId,
        title: 'Course', // We should fetch the title from courses table in a real implementation
        lessonscompleted: status === 'completed' ? 1 : 0
      })
      .select();
      
    if (error) {
      console.error('Error creating course progress:', error);
      return null;
    }
    
    return {
      ...data,
      progress: progressData
    };
  }
}
