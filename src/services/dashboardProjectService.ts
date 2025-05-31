
import { supabase } from "@/integrations/supabase/client";

export interface DashboardProject {
  id: string;
  title: string;
  description: string;
  type: 'minor' | 'major';
  moduleId: string;
  weekId?: string;
  courseId: string;
  deadline: string;
  status: 'pending' | 'done' | 'submitted' | 'not_submitted';
  submissionDate?: string;
  score?: string;
  feedback?: string;
}

export async function fetchUserProjects(userId: string): Promise<DashboardProject[]> {
  try {
    const projects: DashboardProject[] = [];

    // Fetch user's purchased courses to get course IDs
    const { data: purchasedCourses, error: coursesError } = await supabase
      .from('purchased_courses')
      .select('course_id')
      .eq('user_id', userId);

    if (coursesError) {
      console.error('Error fetching purchased courses:', coursesError);
      return [];
    }

    if (!purchasedCourses || purchasedCourses.length === 0) {
      return [];
    }

    const courseIds = purchasedCourses.map(course => course.course_id);

    // Fetch modules for these courses
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id, course_id')
      .in('course_id', courseIds);

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return [];
    }

    if (!modules || modules.length === 0) {
      return [];
    }

    const moduleIds = modules.map(module => module.id);

    // Fetch minor project documents that are not locked
    const { data: minorProjectDocs, error: minorDocsError } = await supabase
      .from('minor_project_documents')
      .select('*')
      .in('module_id', moduleIds)
      .eq('is_locked', false);

    if (minorDocsError) {
      console.error('Error fetching minor project documents:', minorDocsError);
    }

    // Fetch major project documents that are not locked
    const { data: majorProjectDocs, error: majorDocsError } = await supabase
      .from('major_project_documents')
      .select('*')
      .in('module_id', moduleIds)
      .eq('is_locked', false);

    if (majorDocsError) {
      console.error('Error fetching major project documents:', majorDocsError);
    }

    // Fetch user's minor project submissions
    const { data: minorSubmissions, error: minorSubmissionsError } = await supabase
      .from('minor_projects')
      .select('*')
      .eq('user_id', userId)
      .in('module_id', moduleIds);

    if (minorSubmissionsError) {
      console.error('Error fetching minor project submissions:', minorSubmissionsError);
    }

    // Fetch user's major project submissions
    const { data: majorSubmissions, error: majorSubmissionsError } = await supabase
      .from('major_projects')
      .select('*')
      .eq('user_id', userId)
      .in('module_id', moduleIds);

    if (majorSubmissionsError) {
      console.error('Error fetching major project submissions:', majorSubmissionsError);
    }

    // Process minor projects
    if (minorProjectDocs) {
      minorProjectDocs.forEach(doc => {
        const module = modules.find(m => m.id === doc.module_id);
        const submission = minorSubmissions?.find(s => 
          s.module_id === doc.module_id && s.week_id === doc.week_id
        );

        if (module) {
          projects.push({
            id: doc.id,
            title: doc.title,
            description: doc.description || '',
            type: 'minor',
            moduleId: doc.module_id,
            weekId: doc.week_id || undefined,
            courseId: module.course_id,
            deadline: doc.deadline || '',
            status: submission?.status || 'not_submitted',
            submissionDate: submission?.submission_date || undefined,
            score: submission?.score || undefined,
            feedback: submission?.feedback || undefined
          });
        }
      });
    }

    // Process major projects
    if (majorProjectDocs) {
      majorProjectDocs.forEach(doc => {
        const module = modules.find(m => m.id === doc.module_id);
        const submission = majorSubmissions?.find(s => s.module_id === doc.module_id);

        if (module) {
          projects.push({
            id: doc.id,
            title: doc.title,
            description: doc.description || '',
            type: 'major',
            moduleId: doc.module_id,
            courseId: module.course_id,
            deadline: doc.deadline || '',
            status: submission?.status || 'not_submitted',
            submissionDate: submission?.submission_date || undefined,
            score: submission?.score || undefined,
            feedback: submission?.feedback || undefined
          });
        }
      });
    }

    return projects;
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    return [];
  }
}
