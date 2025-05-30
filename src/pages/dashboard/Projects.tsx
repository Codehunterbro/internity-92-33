
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, FileText, Book } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  getMinorProjectByModuleAndWeek, 
  getMajorProjectByModule,
  getMinorProjectDocument,
  getMajorProjectDocument
} from '@/services/projectService';

interface ProjectTileData {
  id: string;
  type: 'minor' | 'major';
  title: string;
  description: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
  deadline: string;
  courseId: string;
  moduleId: string;
  weekId?: string;
  courseName: string;
}

const Projects = () => {
  const { user } = useAuth();
  const { purchasedCourses, isLoading: coursesLoading } = usePurchasedCourses();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectTileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Done'>('All');

  useEffect(() => {
    if (user && purchasedCourses && purchasedCourses.length > 0) {
      fetchAllProjects();
    } else if (!coursesLoading) {
      setIsLoading(false);
    }
  }, [user, purchasedCourses, coursesLoading]);

  const fetchAllProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const allProjects: ProjectTileData[] = [];

    try {
      // For each purchased course, fetch modules and projects
      for (const course of purchasedCourses) {
        // This is a simplified approach - in a real app, you'd need to fetch modules for each course
        // For now, we'll create sample project data based on the course structure
        
        // Sample module IDs - replace with actual module fetching logic
        const sampleModuleIds = ['module-1', 'module-2'];
        
        for (const moduleId of sampleModuleIds) {
          // Fetch minor projects for each week
          for (let weekId = 1; weekId <= 4; weekId++) {
            try {
              const minorProjectDoc = await getMinorProjectDocument(moduleId, weekId.toString());
              const minorProjectSubmission = await getMinorProjectByModuleAndWeek(moduleId, weekId.toString(), user.id);
              
              if (minorProjectDoc) {
                const status = getProjectStatus(minorProjectSubmission, minorProjectDoc.deadline);
                allProjects.push({
                  id: `minor-${moduleId}-${weekId}`,
                  type: 'minor',
                  title: minorProjectDoc.title,
                  description: minorProjectDoc.description || 'Complete the minor project for this week',
                  status,
                  deadline: minorProjectDoc.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  courseId: course.id,
                  moduleId,
                  weekId: weekId.toString(),
                  courseName: course.title
                });
              }
            } catch (error) {
              console.error(`Error fetching minor project for module ${moduleId}, week ${weekId}:`, error);
            }
          }

          // Fetch major project
          try {
            const majorProjectDoc = await getMajorProjectDocument(moduleId);
            const majorProjectSubmission = await getMajorProjectByModule(moduleId, user.id);
            
            if (majorProjectDoc) {
              const status = getProjectStatus(majorProjectSubmission, majorProjectDoc.deadline);
              allProjects.push({
                id: `major-${moduleId}`,
                type: 'major',
                title: majorProjectDoc.title,
                description: majorProjectDoc.description || 'Complete the major project for this module',
                status,
                deadline: majorProjectDoc.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                courseId: course.id,
                moduleId,
                courseName: course.title
              });
            }
          } catch (error) {
            console.error(`Error fetching major project for module ${moduleId}:`, error);
          }
        }
      }

      setProjects(allProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectStatus = (submission: any, deadline?: string): 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE' => {
    if (!submission) {
      if (deadline && new Date(deadline) < new Date()) {
        return 'OVERDUE';
      }
      return 'PENDING';
    }

    if (submission.status === 'graded') {
      return 'GRADED';
    }

    if (submission.status === 'submitted') {
      return 'SUBMITTED';
    }

    return 'PENDING';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">PENDING</Badge>;
      case 'SUBMITTED':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">SUBMITTED</Badge>;
      case 'GRADED':
        return <Badge className="bg-green-100 text-green-800 border-green-200">DONE</Badge>;
      case 'OVERDUE':
        return <Badge className="bg-red-100 text-red-800 border-red-200">OVERDUE</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">PENDING</Badge>;
    }
  };

  const getProjectIcon = (type: 'minor' | 'major') => {
    return type === 'major' ? (
      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
        <Book className="w-5 h-5 text-purple-600" />
      </div>
    ) : (
      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
        <FileText className="w-5 h-5 text-blue-600" />
      </div>
    );
  };

  const handleCheckProject = (project: ProjectTileData) => {
    // Navigate to the learning section of the course with the specific project
    if (project.type === 'minor') {
      navigate(`/learn/course/${project.courseId}/project/minor/${project.moduleId}/${project.weekId}`);
    } else {
      navigate(`/learn/course/${project.courseId}/project/major/${project.moduleId}`);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return project.status === 'PENDING' || project.status === 'OVERDUE';
    if (activeTab === 'Done') return project.status === 'GRADED';
    return true;
  });

  if (isLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-purple mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!purchasedCourses || purchasedCourses.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Courses Found</h2>
          <p className="text-gray-600 mb-6">You haven't purchased any courses yet. Purchase a course to see your projects.</p>
          <Button onClick={() => navigate('/dashboard/courses')} className="bg-brand-purple hover:bg-brand-purple/90">
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Today
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-0 mb-6 border-b border-gray-200">
        {['All', 'Pending', 'Done'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500">No projects found</h3>
            <p className="text-gray-400">No projects available for the selected filter.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {getProjectIcon(project.type)}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {project.type === 'major' ? 'Major Project' : 'Minor Project'}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-red-600 font-medium">
                            {format(new Date(project.deadline), 'EEE, dd MMM')}
                          </span>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {project.description}
                      </p>
                      
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Course:</span> {project.courseName}
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Deadline:</span>
                          <span className="text-red-600 ml-1">
                            {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button
                      onClick={() => handleCheckProject(project)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-2 rounded-lg"
                      variant="ghost"
                    >
                      check
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
