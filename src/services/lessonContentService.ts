
import { supabase } from "@/integrations/supabase/client";

export async function getLessonContent(lessonId: string) {
  try {
    console.log('Fetching lesson content for lesson ID:', lessonId);

    // Get lesson resources
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select(`
        id,
        name,
        type,
        size,
        url
      `)
      .eq('lesson_id', lessonId);

    if (resourcesError) {
      console.error('Error fetching lesson resources:', resourcesError);
    } else {
      console.log('Fetched resources:', resources);
    }

    // Get quiz questions if this is a quiz lesson
    const { data: quizQuestions, error: quizError } = await supabase
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

    if (quizError) {
      console.error('Error fetching quiz questions:', quizError);
    } else {
      console.log('Fetched quiz questions:', quizQuestions);
    }

    return {
      resources: resources || [],
      quizQuestions: quizQuestions || []
    };
  } catch (error) {
    console.error('Error in getLessonContent:', error);
    return {
      resources: [],
      quizQuestions: []
    };
  }
}
