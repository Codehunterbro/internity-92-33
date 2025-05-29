
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, BookOpen, HelpCircle, Lock } from 'lucide-react';
import VideoPlayer from '@/components/learning/VideoPlayer';
import QuizSection from '@/components/learning/QuizSection';
import { updateLessonProgress, getLessonProgress, getQuizQuestionsByLessonId } from '@/services/lessonService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface LessonContentProps {
  lesson: {
    id: string;
    title: string;
    subtitle?: string;
    type: 'video' | 'reading' | 'quiz';
    content: string;
    video_type?: string;
    video_id?: string;
  };
  resources: Resource[];
  quizQuestions?: any[];
}

const LessonContent = ({
  lesson,
  resources,
  quizQuestions: initialQuizQuestions = []
}: LessonContentProps) => {
  const [activeTab, setActiveTab] = useState('content');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { user } = useAuth();
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(initialQuizQuestions || []);
  const [isQuizLocked, setIsQuizLocked] = useState(false);

  console.log('LessonContent - lesson data:', lesson);
  console.log('LessonContent - video_id:', lesson.video_id);
  console.log('LessonContent - video_type:', lesson.video_type);

  useEffect(() => {
    if (user && lesson.id) {
      const fetchLessonProgress = async () => {
        setIsLoadingProgress(true);
        const progress = await getLessonProgress(user.id, lesson.id);
        if (progress && progress.status === 'completed') {
          setQuizCompleted(true);
        }
        setIsLoadingProgress(false);
      };
      
      fetchLessonProgress();
    }
  }, [lesson.id, user]);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      if (activeTab === 'quiz' && user && lesson.id && quizQuestions.length === 0) {
        setIsLoadingQuiz(true);
        try {
          console.log("Fetching quiz questions for lesson ID:", lesson.id);
          const questions = await getQuizQuestionsByLessonId(lesson.id);
          console.log("Fetched quiz questions:", questions);
          
          // Check if quiz is locked based on is_quiz_locked field
          if (questions && questions.length > 0) {
            const firstQuestion = questions[0];
            if (firstQuestion.is_quiz_locked) {
              setIsQuizLocked(true);
              console.log("Quiz is locked for this lesson");
            } else {
              setQuizQuestions(questions);
              setIsQuizLocked(false);
            }
          }
        } catch (error) {
          console.error("Error loading quiz questions:", error);
          toast.error("Failed to load quiz questions");
        } finally {
          setIsLoadingQuiz(false);
        }
      }
    };

    fetchQuizQuestions();
  }, [activeTab, lesson.id, user, quizQuestions.length]);

  const handleQuizComplete = async (score: number) => {
    if (!user) return;
    
    try {
      await updateLessonProgress(user.id, lesson.id, '217ba514-c638-40ed-9ffc-adc383f77c8c', 'completed');
      setQuizCompleted(true);
      toast.success('Quiz completed successfully!');
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast.error('Failed to update lesson progress');
    }
  };

  // Check if lesson has video content
  const hasVideo = lesson.video_id && lesson.video_type;
  console.log('Has video:', hasVideo);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
      {lesson.subtitle && <p className="text-gray-600 mb-6">{lesson.subtitle}</p>}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Resources</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            {isQuizLocked ? <Lock className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
            <span>Quiz</span>
            {isQuizLocked && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="p-0 mt-0">
          {/* Show video if available */}
          {hasVideo && (
            <div className="mb-6">
              <VideoPlayer 
                lessonData={{
                  title: lesson.title,
                  subtitle: lesson.subtitle || '',
                  videoType: 'youtube' as 'youtube',
                  videoId: lesson.video_id,
                  videoTitle: lesson.title,
                  videoDescription: lesson.subtitle || '',
                  resources: resources.map(r => ({
                    name: r.name,
                    type: r.type,
                    size: r.size
                  }))
                }} 
              />
            </div>
          )}
          
          {/* Show text content if available */}
          {lesson.content && (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{
              __html: lesson.content
            }} />
          )}

          {/* Show placeholder if no content */}
          {!lesson.content && !hasVideo && (
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No content available</h3>
              <p className="text-gray-500">This lesson doesn't have content yet.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resources" className="p-0 mt-0">
          {resources.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Lesson Resources</h2>
              <div className="grid grid-cols-1 gap-4">
                {resources.map(resource => (
                  <div key={resource.id} className="border rounded-md p-4 flex items-center">
                    <FileText className="h-10 w-10 text-brand-purple mr-4" />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{resource.name}</h3>
                      <p className="text-sm text-gray-500">{resource.type} · {resource.size}</p>
                    </div>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-brand-purple hover:bg-brand-purple/90 text-white py-1 px-3 rounded text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No resources available</h3>
              <p className="text-gray-500">This lesson doesn't have any downloadable resources.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quiz" className="p-0 mt-0">
          {isLoadingQuiz ? (
            <div className="text-center py-10">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-700">Loading quiz...</h3>
            </div>
          ) : isQuizLocked ? (
            <div className="text-center py-10">
              <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Quiz Locked</h3>
              <p className="text-gray-500">This quiz is currently locked and not available.</p>
            </div>
          ) : quizQuestions.length > 0 ? (
            <QuizSection 
              questions={quizQuestions} 
              lessonId={parseInt(lesson.id) || 0} 
              onComplete={handleQuizComplete}
              completed={quizCompleted}
            />
          ) : (
            <div className="text-center py-10">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No quiz available</h3>
              <p className="text-gray-500">This lesson doesn't have a quiz yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonContent;
