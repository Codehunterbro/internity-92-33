
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { 
  getMinorProjectByModuleAndWeek, 
  getMajorProjectByModule,
  getMinorProjectDocument,
  getMajorProjectDocument
} from '@/services/projectService';
import ProjectSubmissionForm from './ProjectSubmissionForm';

interface ProjectSubmissionViewProps {
  type: 'minor' | 'major';
  moduleId: string;
  weekId?: string;
}

const ProjectSubmissionView: React.FC<ProjectSubmissionViewProps> = ({
  type,
  moduleId,
  weekId
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [projectDocument, setProjectDocument] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch project document (instructions, resources, etc.)
      let documentData = null;
      if (type === 'minor' && weekId) {
        documentData = await getMinorProjectDocument(moduleId, weekId);
      } else {
        documentData = await getMajorProjectDocument(moduleId);
      }
      
      setProjectDocument(documentData);
      
      // Fetch user's existing submission if any
      let submissionData = null;
      if (type === 'minor' && weekId) {
        submissionData = await getMinorProjectByModuleAndWeek(moduleId, weekId, user.id);
      } else {
        submissionData = await getMajorProjectByModule(moduleId, user.id);
      }
      
      setExistingSubmission(submissionData);
    } catch (err) {
      console.error('Error loading project data:', err);
      setError('Failed to load project data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, moduleId, weekId, type]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-purple mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchData} 
          className="text-blue-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {type === 'major' ? 'Major Project Submission' : 'Minor Project Submission'}
      </h1>
      
      <ProjectSubmissionForm
        type={type}
        moduleId={moduleId}
        weekId={weekId}
        projectDocument={projectDocument}
        existingSubmission={existingSubmission}
        onSubmissionComplete={fetchData}
      />
    </div>
  );
};

export default ProjectSubmissionView;
