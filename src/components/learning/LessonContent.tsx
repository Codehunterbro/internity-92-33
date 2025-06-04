
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, BookOpen, HelpCircle, Video } from 'lucide-react';
import VideoPlayer from '@/components/learning/VideoPlayer';
import QuizSection from '@/components/learning/QuizSection';
import { getQuizQuestionsByLessonId } from '@/services/lessonService';
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
  quizQuestions: any[];
}

const LessonContent = ({
  lesson,
  resources,
  quizQuestions: initialQuizQuestions
}: LessonContentProps) => {
  const [activeTab, setActiveTab] = useState('content');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const {
    user
  } = useAuth();
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(initialQuizQuestions || []);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      if (activeTab === 'quiz' && user && lesson.id && quizQuestions.length === 0) {
        setIsLoadingQuiz(true);
        try {
          console.log("Fetching quiz questions for lesson ID:", lesson.id);
          const questions = await getQuizQuestionsByLessonId(lesson.id);
          console.log("Fetched quiz questions:", questions);
          if (questions && questions.length > 0) {
            setQuizQuestions(questions);
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
    setQuizCompleted(true);
    toast.success('Quiz completed successfully!');
  };

  const renderVideoContent = () => {
    if (lesson.video_id && lesson.video_type === 'youtube') {
      return <VideoPlayer lessonData={{
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
      }} lessonId={lesson.id} />;
    }

    const videoResources = resources.filter(r => r.type.toLowerCase().includes('video') || r.url.toLowerCase().includes('.mp4') || r.url.toLowerCase().includes('.webm') || r.url.toLowerCase().includes('.mov'));
    if (videoResources.length > 0) {
      return <div className="space-y-4">
          {videoResources.map(video => <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 lg:mb-6">
              <div className="aspect-video bg-black">
                <video controls className="w-full h-full" preload="metadata">
                  <source src={video.url} type="video/mp4" />
                  <source src={video.url} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-semibold mb-2">{video.name}</h3>
                <p className="text-gray-600 text-sm lg:text-base">Video resource for this lesson</p>
              </div>
            </div>)}
        </div>;
    }
    return null;
  };

  const renderLessonContent = () => {
    if (lesson.content && lesson.content.trim()) {
      return <div className="prose prose-sm lg:prose max-w-none" dangerouslySetInnerHTML={{
        __html: lesson.content
      }} />;
    }
    return null;
  };

  return <div className="p-4 lg:p-6">
      <h1 className="text-xl lg:text-2xl font-bold mb-2">{lesson.title}</h1>
      {lesson.subtitle && <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">{lesson.subtitle}</p>}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 lg:mb-6 w-full grid grid-cols-3 h-auto">
          <TabsTrigger value="content" className="flex items-center gap-1 lg:gap-2 lg:text-sm py-2 text-sm">
            <BookOpen className="h-5 w-5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1 lg:gap-2 lg:text-sm py-2 text-sm">
            <FileText className="h-5 w-5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-1 lg:gap-2 lg:text-sm py-2 text-sm">
            <HelpCircle className="h-5 w-5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="p-0 mt-0">
          {renderVideoContent()}
          {renderLessonContent()}
        </TabsContent>
        
        <TabsContent value="resources" className="p-0 mt-0">
          {resources.length > 0 ? <div className="space-y-4">
              <h2 className="text-lg lg:text-xl font-semibold">Lesson Resources</h2>
              <div className="grid grid-cols-1 gap-3 lg:gap-4">
                {resources.map(resource => <div key={resource.id} className="border rounded-md p-3 lg:p-4 flex items-center">
                    {resource.type.toLowerCase().includes('video') ? <Video className="h-10 w-10 lg:h-10 lg:w-10 text-brand-purple mr-3 lg:mr-4 flex-shrink-0" /> : <FileText className="h-10 w-10 lg:h-10 lg:w-10 text-brand-purple mr-3 lg:mr-4 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium lg:text-lg truncate text-base">{resource.name}</h3>
                      <p className="lg:text-sm text-gray-500 text-sm">{resource.type} · {resource.size}</p>
                    </div>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="bg-brand-purple hover:bg-brand-purple/90 text-white py-1.5 px-4 lg:py-1 lg:px-3 rounded text-sm lg:text-sm whitespace-nowrap ml-2">
                      {resource.type.toLowerCase().includes('video') ? 'View' : 'Download'}
                    </a>
                  </div>)}
              </div>
            </div> : <div className="text-center py-8 lg:py-10">
              <FileText className="h-12 w-12 lg:h-12 lg:w-12 mx-auto text-gray-400 mb-3 lg:mb-4" />
              <h3 className="text-base lg:text-lg font-medium text-gray-700">No resources available</h3>
              <p className="text-gray-500 text-sm lg:text-base">This lesson doesn't have any downloadable resources.</p>
            </div>}
        </TabsContent>
        
        <TabsContent value="quiz" className="p-0 mt-0">
          {isLoadingQuiz ? <div className="text-center py-8 lg:py-10">
              <div className="h-8 w-8 lg:h-12 lg:w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent mx-auto mb-3 lg:mb-4"></div>
              <h3 className="text-base lg:text-lg font-medium text-gray-700">Loading quiz...</h3>
            </div> : quizQuestions.length > 0 ? <QuizSection questions={quizQuestions} lessonId={lesson.id} onComplete={handleQuizComplete} completed={quizCompleted} /> : <div className="text-center py-8 lg:py-10">
              <HelpCircle className="h-12 w-12 lg:h-12 lg:w-12 mx-auto text-gray-400 mb-3 lg:mb-4" />
              <h3 className="text-base lg:text-lg font-medium text-gray-700">No quiz available</h3>
              <p className="text-gray-500 text-sm lg:text-base">This lesson doesn't have a quiz yet.</p>
            </div>}
        </TabsContent>
      </Tabs>
    </div>;
};

export default LessonContent;
