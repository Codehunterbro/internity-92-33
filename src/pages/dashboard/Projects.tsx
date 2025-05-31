
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectHeader from '@/components/dashboard/projects/ProjectHeader';
import ProjectTabs from '@/components/dashboard/projects/ProjectTabs';
import ProjectCard from '@/components/dashboard/projects/ProjectCard';
import { fetchUserProjects, DashboardProject } from '@/services/dashboardProjectService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'done'>('all');
  const [filterValue, setFilterValue] = useState('Today');
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: 'Authentication required',
            description: 'Please log in to view your projects.',
            variant: 'destructive'
          });
          navigate('/login');
          return;
        }

        console.log('Fetching projects for user:', user.id);
        const userProjects = await fetchUserProjects(user.id);
        console.log('Loaded projects:', userProjects);
        setProjects(userProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [navigate, toast]);

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return project.status === 'pending' || project.status === 'not_submitted';
    if (activeTab === 'done') return project.status === 'done' || project.status === 'submitted';
    return true;
  });

  const handleProjectCheck = (type: 'minor' | 'major', moduleId: string, weekId?: string, courseId?: string) => {
    console.log('Navigating to project:', { type, moduleId, weekId, courseId });
    
    if (!courseId) {
      toast({
        title: 'Error',
        description: 'Course information not available.',
        variant: 'destructive'
      });
      return;
    }

    // Navigate to the learning section based on project type
    if (type === 'minor' && weekId) {
      navigate(`/learn/course/${courseId}/project/minor/${moduleId}/${weekId}`);
    } else if (type === 'major') {
      navigate(`/learn/course/${courseId}/project/major/${moduleId}`);
    } else {
      toast({
        title: 'Error',
        description: 'Invalid project configuration.',
        variant: 'destructive'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <ProjectHeader 
          title="Projects"
          filterValue={filterValue}
          onFilterChange={setFilterValue}
        />
        
        <div className="mb-8">
          <ProjectTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={`${project.type}-${project.id}`}
                id={project.id}
                title={project.title}
                description={project.description}
                type={project.type}
                moduleId={project.moduleId}
                weekId={project.weekId}
                courseId={project.courseId}
                deadline={project.deadline}
                status={project.status}
                onCheck={handleProjectCheck}
              />
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {projects.length === 0 
                    ? "No projects available. Purchase a course to access projects." 
                    : "No projects found for the selected filter."
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
