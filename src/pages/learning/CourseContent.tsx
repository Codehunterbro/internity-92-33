
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseWithModulesAndLessons } from '@/services/courseService';
import { getLessonContent } from '@/services/lessonContentService';
import { updateLessonProgress } from '@/services/progressService';
import CourseSidebar, { Module } from '@/components/learning/CourseSidebar';
import LessonContent from '@/components/learning/LessonContent';
import ProjectSubmissionView from '@/components/learning/ProjectSubmissionView';
import { Loader2 } from 'lucide-react';

const CourseContent = () => {
  const { courseId, lessonId, projectType, moduleId, weekId } = useParams<{
    courseId: string;
    lessonId?: string;
    projectType?: 'minor' | 'major';
    moduleId?: string;
    weekId?: string;
  }>();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  useEffect(() => {
    if (lessonId && modules.length > 0) {
      fetchLessonContent();
    }
  }, [lessonId, modules]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const courseData = await getCourseWithModulesAndLessons(courseId!);
      if (!courseData) {
        setError('Course not found');
        return;
      }
      
      setCourse(courseData);
      setModules(courseData.modules || []);
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError('Failed to load course data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessonContent = async () => {
    if (!lessonId) return;
    
    try {
      const lessonData = await getLessonContent(lessonId);
      setCurrentLesson(lessonData);
      
      // Mark lesson as viewed/completed
      if (user) {
        await updateLessonProgress(user.id, courseId!, lessonId, 'completed');
      }
    } catch (err) {
      console.error('Error fetching lesson content:', err);
      setError('Failed to load lesson content');
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-purple mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Render project submission view if we're on a project route
  if (projectType && moduleId) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <CourseSidebar
          modules={modules}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          isLoading={isLoading}
        />
        <main className="flex-1 overflow-y-auto">
          <ProjectSubmissionView
            type={projectType}
            moduleId={moduleId}
            weekId={weekId}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <CourseSidebar
        modules={modules}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        isLoading={isLoading}
      />
      <main className="flex-1 overflow-y-auto">
        {currentLesson ? (
          <LessonContent lesson={currentLesson} />
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to {course?.title}
            </h2>
            <p className="text-gray-600">
              Select a lesson from the sidebar to get started, or choose a project to work on.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseContent;
