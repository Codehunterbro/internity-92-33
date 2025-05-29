
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Lock } from 'lucide-react';
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
      console.log(`Fetching ${type} project data for module: ${moduleId}, week: ${weekId}`);
      
      // Fetch project document (instructions, resources, etc.)
      let documentData = null;
      if (type === 'minor' && weekId) {
        documentData = await getMinorProjectDocument(moduleId, weekId);
        console.log('Minor project document fetched:', documentData);
      } else if (type === 'major') {
        documentData = await getMajorProjectDocument(moduleId);
        console.log('Major project document fetched:', documentData);
      }
      
      setProjectDocument(documentData);
      
      // Check if the project document exists and is locked
      if (!documentData) {
        console.log(`${type} project document not found`);
        setError(`${type === 'major' ? 'Major' : 'Minor'} project not available`);
        setIsLoading(false);
        return;
      }
      
      if (documentData?.is_locked) {
        console.log(`${type} project is locked`);
        setIsLoading(false);
        return;
      }
      
      // Fetch user's existing submission if any
      let submissionData = null;
      if (type === 'minor' && weekId) {
        submissionData = await getMinorProjectByModuleAndWeek(moduleId, weekId, user.id);
        console.log('Minor project submission fetched:', submissionData);
      } else if (type === 'major') {
        submissionData = await getMajorProjectByModule(moduleId, user.id);
        console.log('Major project submission fetched:', submissionData);
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

  // Check if project document is locked
  if (!projectDocument || projectDocument?.is_locked) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <Lock className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {type === 'major' ? 'Major Project' : 'Minor Project'} Locked
          </h3>
          <p className="text-gray-500 mb-4">
            This project is currently locked and not available for submission.
          </p>
          <p className="text-sm text-gray-400">
            Please check back later or contact your instructor for more information.
          </p>
        </div>
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
