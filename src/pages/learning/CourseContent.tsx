
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseSidebar, { Module as CourseSidebarModule } from '@/components/learning/CourseSidebar';
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
  } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [modules, setModules] = useState<CourseSidebarModule[]>([]);

  // Determine if we're viewing a project based on URL params
  const isProjectView = projectModuleId && (projectWeekId || projectModuleId);
  const projectType = projectWeekId ? 'minor' : 'major';
  
  console.log("Route params:", { courseId, lessonId, projectModuleId, projectWeekId });
  console.log("Is project view:", isProjectView, "Project type:", projectType);

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
  }, [courseId, navigate, toast]);

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

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-72'} border-r border-gray-200 overflow-y-auto transition-all duration-300`}>
        <CourseSidebar 
          modules={modules} 
          isCollapsed={isCollapsed} 
          onToggleCollapse={handleToggleCollapse} 
          onLessonClick={handleLessonClick} 
          onProjectClick={handleProjectClick} 
          isLoading={isLoading} 
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : isProjectView ? (
          // Show project submission view
          <ProjectSubmissionView 
            type={projectType as 'minor' | 'major'} 
            moduleId={projectModuleId!} 
            weekId={projectWeekId} 
          />
        ) : !currentLesson && !lessonId ? (
          <CustomWelcomeMessage 
            isPurchased={isPurchased} 
            courseTitle={courseTitle} 
          />
        ) : currentLesson ? (
          <div className="p-6">
            {isContentLocked ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Lock className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Content Locked</h3>
                <p className="text-gray-500 mb-4">
                  This lesson is locked. Please purchase the course to access this content.
                </p>
                <button 
                  onClick={() => navigate('/dashboard/courses')} 
                  className="bg-brand-purple text-white px-6 py-2 rounded-md hover:bg-brand-purple/90 transition-colors"
                >
                  View Course Details
                </button>
              </div>
            ) : (
              <Tabs defaultValue="content" className="mb-6">
                <TabsContent value="content" className="pt-4">
                  <LessonContent 
                    lesson={{
                      id: currentLesson.id,
                      title: currentLesson.title,
                      subtitle: currentLesson.subtitle,
                      type: currentLesson.type as 'video' | 'reading' | 'quiz',
                      content: currentLesson.content || '',
                      video_type: currentLesson.video_type,
                      video_id: currentLesson.video_id
                    }} 
                    resources={lessonContent?.resources || []} 
                    quizQuestions={lessonContent?.quizQuestions || []} 
                  />
                </TabsContent>
                
                {currentLesson.type === 'quiz' && (
                  <TabsContent value="quiz" className="pt-4">
                    <QuizSection 
                      lessonId={currentLesson.id} 
                      onComplete={() => {}} 
                      completed={false} 
                      questions={lessonContent?.quizQuestions || []} 
                    />
                  </TabsContent>
                )}
              </Tabs>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500">Lesson not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
