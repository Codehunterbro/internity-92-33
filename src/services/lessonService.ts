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
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();
    
    if (error) {
      console.error('Error fetching lesson by ID:', error);
      return null;
    }
    
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
        order_index
      `)
      .eq('lesson_id', lessonId)
      .order('order_index');

    if (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }

    console.log("Quiz questions data:", data);
    
    // Process the quiz questions to ensure options are properly formatted
    const processedData = data?.map(question => {
      let options = [];
      
      // Handle different formats of options
      if (question.options) {
        if (Array.isArray(question.options)) {
          options = question.options;
        } else if (typeof question.options === 'object') {
          options = Object.values(question.options);
        } else if (typeof question.options === 'string') {
          try {
            const parsedOptions = JSON.parse(question.options);
            if (Array.isArray(parsedOptions)) {
              options = parsedOptions;
            } else if (typeof parsedOptions === 'object') {
              options = Object.values(parsedOptions);
            }
          } catch (e) {
            console.error('Failed to parse options as JSON:', e);
          }
        }
      }
      
      return {
        ...question,
        options
      };
    }) || [];
    
    console.log("Processed quiz questions:", processedData);
    return processedData;
  } catch (error) {
    console.error("Error in getQuizQuestionsByLessonId:", error);
    throw error;
  }
}

export async function updateLessonProgress(userId: string, lessonId: string, courseId: string, status: string) {
  // Check if progress entry exists
  const { data: existingProgress, error: checkError } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking lesson progress:', checkError);
    return null;
  }

  if (existingProgress) {
    // Update existing progress
    const { data, error } = await supabase
      .from('lesson_progress')
      .update({
        status: status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProgress.id)
      .select();

    if (error) {
      console.error('Error updating lesson progress:', error);
      return null;
    }

    return data;
  } else {
    // Create new progress entry
    const { data, error } = await supabase
      .from('lesson_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        status: status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .select();

    if (error) {
      console.error('Error creating lesson progress:', error);
      return null;
    }

    return data;
  }
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching lesson progress:', error);
    return null;
  }

  return data;
}
