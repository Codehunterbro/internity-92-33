
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

export async function getModulesWithLessonsForCourse(courseId: string) {
  console.log('Fetching modules with lessons for course:', courseId);
  
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
      week_4
    `)
    .eq('course_id', courseId)
    .order('order_index');

  if (modulesError) {
    console.error('Error fetching modules:', modulesError);
    return [];
  }

  if (!modules || modules.length === 0) {
    console.log('No modules found for course:', courseId);
    return [];
  }

  console.log('Found modules:', modules);

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
        order_index
      `)
      .eq('module_id', module.id)
      .order('order_index');

    if (lessonsError) {
      console.error(`Error fetching lessons for module ${module.id}:`, lessonsError);
      return {
        ...module,
        weeks: []
      };
    }

    console.log(`Lessons for module ${module.id}:`, lessons);

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
          isLocked: false, // Unlock all lessons for now
          isCompleted: false
        });
      });
    }
    
    // Create weeks array based on module week titles
    const weeks = [];
    
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
    
    console.log(`Processed weeks for module ${module.id}:`, weeks);
    
    return {
      ...module,
      weeks
    };
  }));
  
  console.log('Final modules with lessons:', modulesWithLessons);
  return modulesWithLessons;
}
