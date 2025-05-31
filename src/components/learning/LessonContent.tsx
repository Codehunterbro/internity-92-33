
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
  const { user } = useAuth();
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
    // Check if lesson has a video_id (YouTube video)
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
      }} />;
    }

    // Check if there are any video resources uploaded
    const videoResources = resources.filter(r => 
      r.type.toLowerCase().includes('video') || 
      r.url.toLowerCase().includes('.mp4') || 
      r.url.toLowerCase().includes('.webm') || 
      r.url.toLowerCase().includes('.mov')
    );
    
    if (videoResources.length > 0) {
      return (
        <div className="space-y-4">
          {videoResources.map(video => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="aspect-video bg-black">
                <video controls className="w-full h-full" preload="metadata">
                  <source src={video.url} type="video/mp4" />
                  <source src={video.url} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{video.name}</h3>
                <p className="text-gray-600">Video resource for this lesson</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  const renderLessonContent = () => {
    if (lesson.content && lesson.content.trim()) {
      return (
        <div 
          className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: lesson.content }} 
        />
      );
    }
    return null;
  };

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
            <HelpCircle className="h-4 w-4" />
            <span>Quiz</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="p-0 mt-0">
          {/* Display video content first if available */}
          {renderVideoContent()}
          
          {/* Then display lesson content */}
          {renderLessonContent()}
        </TabsContent>
        
        <TabsContent value="resources" className="p-0 mt-0">
          {resources.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Lesson Resources</h2>
              <div className="grid grid-cols-1 gap-4">
                {resources.map(resource => (
                  <div key={resource.id} className="border rounded-md p-4 flex items-center">
                    {resource.type.toLowerCase().includes('video') ? (
                      <Video className="h-10 w-10 text-brand-purple mr-4" />
                    ) : (
                      <FileText className="h-10 w-10 text-brand-purple mr-4" />
                    )}
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
                      {resource.type.toLowerCase().includes('video') ? 'View' : 'Download'}
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
