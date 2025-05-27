
import { supabase } from "@/integrations/supabase/client";

export async function getLessonContent(lessonId: string) {
  try {
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
    }

    return {
      resources: resources || []
    };
  } catch (error) {
    console.error('Error in getLessonContent:', error);
    return {
      resources: []
    };
  }
}
