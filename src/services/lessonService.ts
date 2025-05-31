
import { supabase } from "@/integrations/supabase/client";

export async function getLessonsByModuleId(moduleId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      subtitle,
      type,
      content,
      is_locked,
      order_index,
      duration,
      video_type,
      video_id,
      week_id
    `)
    .eq('module_id', moduleId)
    .order('order_index');

  if (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }

  return data || [];
}

export async function getAllLessons(courseId: string) {
  try {
    // First, get all modules for this course
    const { data: modules, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId);
    
    if (moduleError) {
      console.error('Error fetching modules:', moduleError);
      return [];
    }
    
    if (!modules || modules.length === 0) {
      return [];
    }
    
    // Then get all lessons for these modules
    const moduleIds = modules.map(module => module.id);
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select(`
        id,
        title,
        subtitle,
        type,
        content,
        is_locked,
        order_index,
        duration,
        video_type,
        video_id,
        module_id,
        week_id
      `)
      .in('module_id', moduleIds)
      .order('order_index');
      
    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return [];
    }
    
    return lessons || [];
  } catch (error) {
    console.error('Error in getAllLessons:', error);
    return [];
  }
}

export const getLessonById = async (lessonId: string) => {
  if (!lessonId) return null;
  
  try {
    console.log('Fetching lesson by ID:', lessonId);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();
    
    if (error) {
      console.error('Error fetching lesson by ID:', error);
      return null;
    }
    
    console.log('Lesson fetched from database:', data);
    return data;
  } catch (error) {
    console.error('Error in getLessonById:', error);
    return null;
  }
};

export async function getResourcesByLessonId(lessonId: string) {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      name,
      type,
      size,
      url
    `)
    .eq('lesson_id', lessonId);

  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  return data || [];
}

export async function getQuizQuestionsByLessonId(lessonId: string) {
  try {
    console.log("Fetching quiz questions for lesson ID:", lessonId);
    
    const { data, error } = await supabase
      .from('quiz_questions')
      .select(`
        id,
        question,
        options,
        correct_answer,
        explanation,
        order_index,
        is_quiz_locked
      `)
      .eq('lesson_id', lessonId)
      .order('order_index');

    if (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }

    console.log("Quiz questions data from database:", data);
    
    // Return the raw data - let the component handle the quiz lock logic
    return data || [];
  } catch (error) {
    console.error("Error in getQuizQuestionsByLessonId:", error);
    throw error;
  }
}
