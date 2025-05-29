
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, FileUp, Youtube, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  ProjectDocument, 
  uploadProjectFile, 
  submitMinorProject, 
  submitMajorProject,
  createMinorProjectIfNotExists,
  createMajorProjectIfNotExists
} from '@/services/projectService';

interface ProjectSubmissionFormProps {
  type: 'minor' | 'major';
  moduleId: string;
  weekId?: string;
  projectDocument: ProjectDocument | null;
  existingSubmission?: any;
  onSubmissionComplete?: () => void;
}

const ProjectSubmissionForm: React.FC<ProjectSubmissionFormProps> = ({
  type,
  moduleId,
  weekId,
  projectDocument,
  existingSubmission,
  onSubmissionComplete
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const form = useForm({
    defaultValues: {
      videoUrl: existingSubmission?.video_url || '',
    }
  });

  useEffect(() => {
    if (projectDocument) {
      setIsLocked(projectDocument.is_locked);
      
      if (!existingSubmission && projectDocument.video_url) {
        form.reset({
          videoUrl: projectDocument.video_url || '',
        });
      }
    }
  }, [projectDocument, existingSubmission, form]);

  useEffect(() => {
    if (existingSubmission?.attachment_url) {
      setPreviewUrl(existingSubmission.attachment_url);
    }
  }, [existingSubmission]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large. Please select a file smaller than 10MB");
        return;
      }
      
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const extractYouTubeId = (url: string) => {
    if (!url) return '';
    
    // If it's already just an ID
    if (url.length === 11 && !url.includes('/') && !url.includes('=')) {
      return url;
    }
    
    // Extract from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const onSubmit = async (values: any) => {
    if (!user) {
      toast.error("You must be logged in to submit a project");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(10);
      console.log("Starting project submission:", { type, moduleId, weekId, values });
      
      let projectId = existingSubmission?.id;
      
      if (!projectId) {
        setUploadProgress(20);
        console.log("Creating new project...");
        
        if (type === 'minor' && weekId) {
          projectId = await createMinorProjectIfNotExists(moduleId, weekId, user.id, projectDocument?.title || "Minor Project");
        } else {
          projectId = await createMajorProjectIfNotExists(
            moduleId, 
            user.id,
            projectDocument?.title || "Major Project"
          );
        }
        
        console.log("Project ID after creation:", projectId);
        
        if (!projectId) {
          throw new Error("Failed to create project record");
        }
      }
      
      setUploadProgress(40);
      
      let attachmentUrl = existingSubmission?.attachment_url || null;
      
      if (selectedFile) {
        console.log("Uploading file:", selectedFile.name);
        setUploadProgress(60);
        
        try {
          attachmentUrl = await uploadProjectFile(selectedFile, user.id, type, projectId);
          console.log("File upload result:", attachmentUrl);
          
          if (!attachmentUrl) {
            throw new Error("Failed to upload file");
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("File upload failed. Please try again.");
        }
      }
      
      setUploadProgress(80);
      
      const submissionData = {
        video_url: extractYouTubeId(values.videoUrl),
        attachment_url: attachmentUrl
      };
      
      console.log("Submitting project data:", { projectId, submissionData });
      
      let result;
      if (type === 'minor') {
        result = await submitMinorProject(projectId, submissionData);
      } else {
        result = await submitMajorProject(projectId, submissionData);
      }
      
      console.log("Submission result:", result);
      
      if (!result.success) {
        throw new Error("Failed to submit project");
      }
      
      setUploadProgress(100);
      
      toast.success("Project submitted successfully!");
      
      if (onSubmissionComplete) {
        onSubmissionComplete();
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error(error instanceof Error ? error.message : "There was an error submitting your project. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (isLocked) {
    return (
      <Card className="mb-6">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-md bg-gray-200">
              <Lock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {type === 'major' ? 'Major Project' : 'Minor Project'}
              </CardTitle>
              <CardDescription>This project is currently locked</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Alert>
            <AlertDescription>
              This project is not yet available. Please check back later or contact your instructor for more information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className={`${type === 'major' ? 'bg-purple-50' : 'bg-blue-50'}`}>
        <CardTitle className="text-xl">
          {projectDocument?.title || (type === 'major' ? 'Major Project' : 'Minor Project')}
        </CardTitle>
        <CardDescription>
          {projectDocument?.description || 'Complete and submit your project to demonstrate your understanding.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Project Resources Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Project Resources</h3>
            
            {projectDocument?.video_url && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Project Instruction Video</h4>
                <div className="aspect-video bg-black rounded">
                  <iframe 
                    src={`https://www.youtube.com/embed/${extractYouTubeId(projectDocument.video_url)}`} 
                    className="w-full h-full rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            
            {projectDocument?.attachment_url && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Project Resources</h4>
                <a 
                  href={projectDocument.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <FileUp className="h-4 w-4 mr-1" />
                  Download Project Resources
                </a>
              </div>
            )}
          </div>

          {/* Submission Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Submission</h3>
                
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Youtube className="h-4 w-4 mr-2" />
                        YouTube Video URL or ID (optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* File Upload Section */}
                <div>
                  <FormLabel className="flex items-center mb-2">
                    <FileUp className="h-4 w-4 mr-2" />
                    Project File
                  </FormLabel>
                  <div className="border-2 border-dashed rounded-md p-6 text-center transition-colors hover:border-blue-400">
                    {previewUrl && previewUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <div className="mb-3">
                        <img 
                          src={previewUrl} 
                          alt="File preview" 
                          className="max-h-40 mx-auto object-contain rounded"
                        />
                      </div>
                    ) : (previewUrl || selectedFile) && (
                      <div className="mb-3 flex items-center justify-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-600">File ready for upload</span>
                      </div>
                    )}
                    
                    <Input
                      type="file"
                      id="projectFile"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.zip,.txt,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
                    />
                    <label 
                      htmlFor="projectFile" 
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                          {selectedFile ? 'Change file' : 'Upload file'}
                        </span>
                      </div>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported: PDF, ZIP, TXT, DOC, DOCX, JPG, PNG, PPT, PPTX
                    </p>
                    <p className="text-xs text-gray-400">
                      Max size: 10 MB
                    </p>
                    
                    {selectedFile && (
                      <p className="mt-2 text-sm font-medium">
                        Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className={`w-full ${type === 'major' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : existingSubmission ? 'Update Submission' : 'Submit Project'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSubmissionForm;
