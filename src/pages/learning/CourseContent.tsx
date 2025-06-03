import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseSidebar, { Module as CourseSidebarModule } from '@/components/learning/CourseSidebar';
import ResponsiveCourseMenu from '@/components/learning/ResponsiveCourseMenu';
import LessonContent from '@/components/learning/LessonContent';
import QuizSection from '@/components/learning/QuizSection';
import ProjectSubmissionView from '@/components/learning/ProjectSubmissionView';
import { useToast } from '@/hooks/use-toast';
import { getLessonById } from '@/services/lessonService';
import { getLessonContent } from '@/services/lessonContentService';
import { getModulesWithLessonsForCourse } from '@/services/moduleService';
import { Skeleton } from '@/components/ui/skeleton';
import CustomWelcomeMessage from '@/components/learning/CustomWelcomeMessage';
import { checkUserPurchasedCoursesCount } from '@/services/coursePurchaseService';
import { getCourseById } from '@/services/courseService';
import { Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for lesson types
interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  type: 'video' | 'reading' | 'quiz' | 'project';
  content?: string;
  is_locked?: boolean;
  duration?: string;
  video_type?: string;
  video_id?: string;
  module_id: string;
  week_id?: string;
  order_index: number;
}
const CourseContent = () => {
  const {
    courseId,
    lessonId,
    projectModuleId,
    projectWeekId
  } = useParams<{
    courseId: string;
    lessonId?: string;
    projectModuleId?: string;
    projectWeekId?: string;
  }>();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [modules, setModules] = useState<CourseSidebarModule[]>([]);
  const [lessonCompletionStatus, setLessonCompletionStatus] = useState<Record<string, boolean>>({});

  // Determine if we're viewing a project based on URL params
  const isProjectView = Boolean(projectModuleId && (projectWeekId || projectModuleId));
  const projectType = projectWeekId ? 'minor' : 'major';
  console.log("Route params:", {
    courseId,
    lessonId,
    projectModuleId,
    projectWeekId
  });
  console.log("Is project view:", isProjectView, "Project type:", projectType);

  // Fetch lesson completion status
  const fetchLessonCompletionStatus = async () => {
    if (!user || !courseId) return;
    try {
      const {
        data: progressData,
        error
      } = await supabase.from('lesson_progress').select('lesson_id, status').eq('user_id', user.id).eq('course_id', courseId).eq('status', 'completed');
      if (error) {
        console.error('Error fetching lesson progress:', error);
        return;
      }
      const completionMap: Record<string, boolean> = {};
      progressData?.forEach(progress => {
        completionMap[progress.lesson_id] = true;
      });
      setLessonCompletionStatus(completionMap);
    } catch (error) {
      console.error('Error in fetchLessonCompletionStatus:', error);
    }
  };

  // Check if course is purchased and get course title
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      try {
        setIsLoading(true);

        // Check purchase status
        const count = await checkUserPurchasedCoursesCount();
        setIsPurchased(count >= 1);

        // Get course details for title
        const course = await getCourseById(courseId);
        if (course) {
          setCourseTitle(course.title);
          console.log("Course loaded:", course.title);
        } else {
          console.error("Course not found with ID:", courseId);
          toast({
            title: 'Error',
            description: 'Course not found. Please try again.',
            variant: 'destructive'
          });
          navigate('/dashboard/my-courses');
        }

        // Fetch modules with lessons
        const modulesData = await getModulesWithLessonsForCourse(courseId);
        console.log("Modules data fetched:", modulesData);
        setModules(modulesData);

        // Fetch lesson completion status
        await fetchLessonCompletionStatus();
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load course. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, navigate, toast, user]);

  // Listen for lesson completion events
  useEffect(() => {
    const handleLessonCompleted = () => {
      console.log('Refreshing lesson completion status...');
      fetchLessonCompletionStatus();
    };
    window.addEventListener('lessonCompleted', handleLessonCompleted);
    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompleted);
    };
  }, [user, courseId]);

  // Fetch lesson when the lesson ID changes
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setCurrentLesson(null);
        setLessonContent(null);
        return;
      }
      try {
        setIsLoading(true);
        console.log('Fetching lesson with ID:', lessonId);
        const lesson = await getLessonById(lessonId);
        console.log('Fetched lesson data:', lesson);
        if (lesson) {
          setCurrentLesson(lesson as Lesson);

          // Fetch lesson content including resources
          const content = await getLessonContent(lesson.id);
          console.log('Fetched lesson content:', content);
          setLessonContent(content);
        } else {
          console.error('Lesson not found with ID:', lessonId);
          toast({
            title: 'Error',
            description: 'Lesson not found. Please try again.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        toast({
          title: 'Error',
          description: 'Failed to load lesson. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, toast]);
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleLessonClick = (moduleId: string, weekId: string, lessonId: string) => {
    navigate(`/learn/course/${courseId}/lesson/${lessonId}`);
  };
  const handleProjectClick = (type: 'minor' | 'major', moduleId: string, weekId?: string) => {
    console.log(`Project clicked: ${type}, module: ${moduleId}, week: ${weekId}`);
    if (type === 'minor' && weekId) {
      navigate(`/learn/course/${courseId}/project/minor/${moduleId}/${weekId}`);
    } else if (type === 'major') {
      navigate(`/learn/course/${courseId}/project/major/${moduleId}`);
    }
  };
  console.log("CourseContent rendering with courseId:", courseId, "and isPurchased:", isPurchased);
  console.log("Current lesson:", currentLesson);
  console.log("Lesson content:", lessonContent);
  console.log("Project view:", isProjectView, projectType, projectModuleId, projectWeekId);

  // Check if current lesson is locked
  const isContentLocked = currentLesson?.is_locked && !isPurchased;
  return <div className="flex h-screen overflow-hidden bg-white">
      {/* Responsive Course Menu - only shows on small screens */}
      <div className="lg:hidden">
        <ResponsiveCourseMenu modules={modules} lessonId={lessonId} onLessonClick={handleLessonClick} onProjectClick={handleProjectClick} lessonCompletionStatus={lessonCompletionStatus} />
      </div>

      {/* Desktop Sidebar - hidden on small screens */}
      <div className={`hidden lg:block ${isCollapsed ? 'w-16' : 'w-72'} border-r border-gray-200 overflow-y-auto transition-all duration-300`}>
        <CourseSidebar modules={modules} isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} onLessonClick={handleLessonClick} onProjectClick={handleProjectClick} isLoading={isLoading} />
      </div>
      
      {/* Main Content - Added top margin for mobile to prevent hamburger overlap */}
      <div className="flex-1 overflow-y-auto mt-16 lg:mt-0 my-[22px]">
        {isLoading ? <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div> : isProjectView && projectModuleId ?
      // Show project submission view with increased width
      <div className="max-w-7xl mx-auto">
            <ProjectSubmissionView type={projectType as 'minor' | 'major'} moduleId={projectModuleId} weekId={projectWeekId} />
          </div> : !currentLesson && !lessonId ? <div className="max-w-7xl mx-auto">
            <CustomWelcomeMessage isPurchased={isPurchased} courseTitle={courseTitle} />
          </div> : currentLesson ? <div className="max-w-7xl mx-auto">
            {isContentLocked ? <div className="flex flex-col items-center justify-center h-64 text-center p-4 sm:p-6 lg:p-8">
                <Lock className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Content Locked</h3>
                <p className="text-gray-500 mb-4">
                  This lesson is locked. Please purchase the course to access this content.
                </p>
                <button onClick={() => navigate('/dashboard/courses')} className="bg-brand-purple text-white px-6 py-2 rounded-md hover:bg-brand-purple/90 transition-colors">
                  View Course Details
                </button>
              </div> : <Tabs defaultValue="content" className="mb-6">
                <TabsContent value="content" className="pt-4">
                  <LessonContent lesson={{
              id: currentLesson.id,
              title: currentLesson.title,
              subtitle: currentLesson.subtitle,
              type: currentLesson.type as 'video' | 'reading' | 'quiz',
              content: currentLesson.content || '',
              video_type: currentLesson.video_type,
              video_id: currentLesson.video_id
            }} resources={lessonContent?.resources || []} quizQuestions={lessonContent?.quizQuestions || []} />
                </TabsContent>
                
                {currentLesson.type === 'quiz' && <TabsContent value="quiz" className="pt-4">
                    <QuizSection lessonId={currentLesson.id} onComplete={() => {}} completed={false} questions={lessonContent?.quizQuestions || []} />
                  </TabsContent>}
              </Tabs>}
          </div> : <div className="flex flex-col items-center justify-center h-64 max-w-7xl mx-auto">
            <p className="text-gray-500">Lesson not found</p>
          </div>}
      </div>
    </div>;
};
export default CourseContent;