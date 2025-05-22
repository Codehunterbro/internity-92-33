
import { supabase } from "@/integrations/supabase/client";

export async function getModulesByCourseId(courseId: string) {
  const { data, error } = await supabase
    .from('modules')
    .select(`
      id, 
      title, 
      description, 
      order_index,
      week_1,
      week_2,
      week_3,
      week_4
    `)
    .eq('course_id', courseId)
    .order('order_index');

  if (error) {
    console.error('Error fetching modules:', error);
    return [];
  }

  // Ensure all modules have a description property, even if it's null
  const modulesWithDescription = data?.map(module => ({
    ...module,
    description: module.description || ''
  })) || [];

  return modulesWithDescription;
}

export async function getModuleById(moduleId: string) {
  const { data, error } = await supabase
    .from('modules')
    .select(`
      id, 
      title, 
      description, 
      course_id, 
      order_index,
      week_1,
      week_2,
      week_3,
      week_4
    `)
    .eq('id', moduleId)
    .single();

  if (error) {
    console.error('Error fetching module:', error);
    return null;
  }

  // Ensure the module has a description property, even if it's null
  return {
    ...data,
    description: data.description || ''
  };
}
