
import { supabase } from "@/integrations/supabase/client";

export interface MinorProject {
  id: string;
  title: string;
  description: string;
  module_id: string;
  week_id: string;
  deadline: string;
  status: string;
  submission_date?: string;
  score?: string;
  feedback?: string;
  is_locked: boolean;
  attachment_url?: string;
  video_url?: string;
}

export interface MajorProject {
  id: string;
  module_id: string;
  deadline: string;
  status: string;
  submission_date?: string;
  score?: string;
  feedback?: string;
  is_locked: boolean;
  attachment_url?: string;
  video_url?: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  description: string;
  module_id: string;
  week_id?: string;
  is_locked: boolean;
  attachment_url?: string;
  video_url?: string;
}

export async function getMinorProjectByModuleAndWeek(moduleId: string, weekId: string, userId: string) {
  try {
    console.log('Fetching minor project for:', { moduleId, weekId, userId });
    
    const { data, error } = await supabase
      .from('minor_projects')
      .select('*')
      .eq('module_id', moduleId)
      .eq('week_id', weekId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching minor project:', error);
      return null;
    }
    
    console.log('Fetched minor project:', data);
    return data;
  } catch (error) {
    console.error('Error in getMinorProjectByModuleAndWeek:', error);
    return null;
  }
}

export async function getMajorProjectByModule(moduleId: string, userId: string) {
  try {
    console.log('Fetching major project for:', { moduleId, userId });
    
    const { data, error } = await supabase
      .from('major_projects')
      .select('*')
      .eq('module_id', moduleId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching major project:', error);
      return null;
    }
    
    console.log('Fetched major project:', data);
    return data;
  } catch (error) {
    console.error('Error in getMajorProjectByModule:', error);
    return null;
  }
}

export async function getMinorProjectDocument(moduleId: string, weekId: string) {
  try {
    console.log('Fetching minor project document for:', { moduleId, weekId });
    
    const { data, error } = await supabase
      .from('minor_project_documents')
      .select('*')
      .eq('module_id', moduleId)
      .eq('week_id', weekId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching minor project document:', error);
      return null;
    }
    
    console.log('Fetched minor project document:', data);
    return data;
  } catch (error) {
    console.error('Error in getMinorProjectDocument:', error);
    return null;
  }
}

export async function getMajorProjectDocument(moduleId: string) {
  try {
    console.log('Fetching major project document for module:', moduleId);
    
    const { data, error } = await supabase
      .from('major_project_documents')
      .select('*')
      .eq('module_id', moduleId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching major project document:', error);
      return null;
    }
    
    console.log('Fetched major project document:', data);
    return data;
  } catch (error) {
    console.error('Error in getMajorProjectDocument:', error);
    return null;
  }
}

export async function submitMinorProject(projectId: string, submissionData: any) {
  try {
    const { data, error } = await supabase
      .from('minor_projects')
      .update({
        status: 'submitted',
        submission_date: new Date().toISOString(),
        ...submissionData
      })
      .eq('id', projectId)
      .select();
      
    if (error) {
      console.error('Error submitting minor project:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in submitMinorProject:', error);
    return { success: false, error };
  }
}

export async function submitMajorProject(projectId: string, submissionData: any) {
  try {
    const { data, error } = await supabase
      .from('major_projects')
      .update({
        status: 'submitted',
        submission_date: new Date().toISOString(),
        ...submissionData
      })
      .eq('id', projectId)
      .select();
      
    if (error) {
      console.error('Error submitting major project:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in submitMajorProject:', error);
    return { success: false, error };
  }
}

export async function createMinorProjectIfNotExists(moduleId: string, weekId: string, userId: string, title: string) {
  try {
    // First check if the project already exists
    const { data: existingProject } = await supabase
      .from('minor_projects')
      .select('id')
      .eq('module_id', moduleId)
      .eq('week_id', weekId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (existingProject) {
      return existingProject.id;
    }
    
    // If not, create a new project
    const { data, error } = await supabase
      .from('minor_projects')
      .insert({
        module_id: moduleId,
        week_id: weekId,
        user_id: userId,
        title: title,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        status: 'not_submitted',
        is_locked: false
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating minor project:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error in createMinorProjectIfNotExists:', error);
    return null;
  }
}

export async function createMajorProjectIfNotExists(moduleId: string, userId: string, projectTitle: string) {
  try {
    console.log("Creating major project if not exists:", { moduleId, userId });
    
    // First check if the project already exists
    const { data: existingProject, error: queryError } = await supabase
      .from('major_projects')
      .select('id')
      .eq('module_id', moduleId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (queryError) {
      console.error('Error checking for existing major project:', queryError);
    }
      
    if (existingProject) {
      console.log("Found existing major project:", existingProject);
      return existingProject.id;
    }
    
    // Get the project document to copy title/description if available
    const projectDoc = await getMajorProjectDocument(moduleId);
    
    // If not, create a new project
    const { data, error } = await supabase
      .from('major_projects')
      .insert({
        module_id: moduleId,
        user_id: userId,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: 'not_submitted',
        is_locked: false,
        instructions: projectDoc?.description || null
      })
      .select();
      
    if (error) {
      console.error('Error creating major project:', error);
      return null;
    }
    
    console.log("Created new major project:", data);
    return data[0].id;
  } catch (error) {
    console.error('Error in createMajorProjectIfNotExists:', error);
    return null;
  }
}

export async function uploadProjectFile(file: File, userId: string, projectType: 'major' | 'minor', projectId: string) {
  try {
    // Use the correct bucket names exactly as specified
    const bucketId = projectType === 'major' ? 'Major Project Documents' : 'Minor Project Documents';
    
    // Create a unique file path to avoid conflicts
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filePath = `${userId}/${projectId}/${timestamp}_${cleanFileName}`;
    
    console.log(`Uploading ${projectType} project file to bucket '${bucketId}':`, filePath);
    
    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error(`Error uploading ${projectType} project file:`, error);
      return null;
    }
    
    console.log(`Successfully uploaded file:`, data);
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketId)
      .getPublicUrl(filePath);
      
    console.log(`Generated public URL:`, publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`Error in uploadProjectFile for ${projectType} project:`, error);
    return null;
  }
}
