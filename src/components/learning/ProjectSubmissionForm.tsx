import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, FileUp, Youtube } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
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
  
  const form = useForm({
    defaultValues: {
      videoUrl: existingSubmission?.video_url || '',
      title: existingSubmission?.title || projectDocument?.title || '',
      description: existingSubmission?.description || projectDocument?.description || ''
    }
  });

  useEffect(() => {
    if (projectDocument) {
      setIsLocked(projectDocument.is_locked);
      
      // Only update form values if we have project document and no existing submission
      if (!existingSubmission) {
        form.reset({
          videoUrl: projectDocument.video_url || '',
          title: projectDocument.title || '',
          description: projectDocument.description || ''
        });
      }
    }
  }, [projectDocument, existingSubmission, form]);

  useEffect(() => {
    // Display existing attachment if available
    if (existingSubmission?.attachment_url) {
      setPreviewUrl(existingSubmission.attachment_url);
    }
  }, [existingSubmission]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL for images
      if (file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const onSubmit = async (values: any) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a project",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Starting project submission:", { type, moduleId, weekId, values });
      
      // Create project record if not exists
      let projectId = existingSubmission?.id;
      
      if (!projectId) {
        if (type === 'minor' && weekId) {
          projectId = await createMinorProjectIfNotExists(moduleId, weekId, user.id, values.title);
        } else {
          // For major projects, retrieve the title from the document for reference only
          // We don't pass title to createMajorProjectIfNotExists since it doesn't exist in the schema
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
      
      // Handle file upload if a new file is selected
      let attachmentUrl = existingSubmission?.attachment_url || null;
      
      if (selectedFile) {
        console.log("Uploading file:", selectedFile.name);
        attachmentUrl = await uploadProjectFile(selectedFile, user.id, type, projectId);
        console.log("File upload result:", attachmentUrl);
        
        if (!attachmentUrl) {
          throw new Error("Failed to upload file");
        }
      }
      
      // Submit the project
      const submissionData = {
        video_url: values.videoUrl,
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
      
      toast({
        title: "Project Submitted",
        description: "Your project has been successfully submitted",
      });
      
      if (onSubmissionComplete) {
        onSubmissionComplete();
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Project Resources</h3>
              
              {projectDocument?.video_url && (
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Project Instruction Video</h4>
                  <div className="aspect-video">
                    <iframe 
                      src={`https://www.youtube.com/embed/${projectDocument.video_url}`} 
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

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Your Submission</h3>
              
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Youtube className="h-4 w-4 mr-2" />
                      YouTube Video ID (optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. dQw4w9WgXcQ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel className="flex items-center mb-2">
                  <FileUp className="h-4 w-4 mr-2" />
                  Project File
                </FormLabel>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  {previewUrl && previewUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                    <div className="mb-3">
                      <img 
                        src={previewUrl} 
                        alt="File preview" 
                        className="max-h-40 mx-auto object-contain"
                      />
                    </div>
                  ) : previewUrl && (
                    <div className="mb-3 flex items-center justify-center space-x-2">
                      <FileUp className="h-5 w-5" />
                      <span>File uploaded</span>
                    </div>
                  )}
                  
                  <Input
                    type="file"
                    id="projectFile"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.zip,.txt,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label 
                    htmlFor="projectFile" 
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    {selectedFile ? 'Change file' : 'Upload file'}
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Drag & drop or click to browse. Supported formats: PDF, ZIP, TXT, DOC, DOCX, JPG, PNG
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max size: 10 MB
                  </p>
                  
                  {selectedFile && (
                    <p className="mt-2 text-sm">
                      Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </div>
            </div>
            
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
      </CardContent>
    </Card>
  );
};

export default ProjectSubmissionForm;
