
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
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted' | 'marked'>('all');
  const [monthFilter, setMonthFilter] = useState('all');
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

  // Helper function to get status priority for sorting
  const getStatusPriority = (status: string): number => {
    switch (status) {
      case 'pending':
      case 'not_submitted':
        return 1;
      case 'submitted':
        return 2;
      case 'done':
        return 3;
      default:
        return 4;
    }
  };

  // Helper function to filter projects by month
  const filterByMonth = (project: DashboardProject): boolean => {
    if (monthFilter === 'all') return true;
    
    try {
      const projectDate = new Date(project.deadline);
      const projectMonth = projectDate.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
      return projectMonth === monthFilter;
    } catch {
      return true;
    }
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      // Filter by status tab
      if (activeTab === 'all') return true;
      if (activeTab === 'pending') return project.status === 'pending' || project.status === 'not_submitted';
      if (activeTab === 'submitted') return project.status === 'submitted';
      if (activeTab === 'marked') return project.status === 'done';
      return true;
    })
    .filter(filterByMonth)
    .sort((a, b) => {
      // First sort by status priority
      const statusPriorityA = getStatusPriority(a.status);
      const statusPriorityB = getStatusPriority(b.status);
      
      if (statusPriorityA !== statusPriorityB) {
        return statusPriorityA - statusPriorityB;
      }
      
      // If same status, sort by earliest deadline
      try {
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        return dateA.getTime() - dateB.getTime();
      } catch {
        return 0;
      }
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
          monthFilter={monthFilter}
          onMonthFilterChange={setMonthFilter}
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
            {filteredAndSortedProjects.map((project) => (
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
                score={project.score}
                onCheck={handleProjectCheck}
              />
            ))}
            
            {filteredAndSortedProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {projects.length === 0 
                    ? "No projects available. Purchase a course to access projects." 
                    : "No projects found for the selected filters."
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
