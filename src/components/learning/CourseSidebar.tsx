import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, CheckCircle, Circle, Lock, PlayCircle, FileText, Book, Calendar, ArrowLeft, PanelLeft, PanelRight, File } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Type definitions
export interface Module {
  id: string;
  title: string;
  description?: string;
  week_1?: string;
  week_2?: string;
  week_3?: string;
  week_4?: string;
  weeks: Week[];
}

export interface Week {
  id: string; // "1", "2", etc.
  title: string; // From module's week_1, week_2, etc.
  lessons: Lesson[];
  hasMinorProject?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'minor_project' | 'major_project';
  duration: string | null;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface CourseSidebarProps {
  modules: Module[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onModuleClick?: (moduleId: string) => void;
  onWeekClick?: (moduleId: string, weekId: string) => void;
  onLessonClick?: (moduleId: string, weekId: string, lessonId: string) => void;
  onProjectClick?: (type: 'minor' | 'major', moduleId: string, weekId?: string) => void;
  isLoading?: boolean;
}

const CourseSidebar = ({ 
  modules, 
  isCollapsed, 
  onToggleCollapse,
  onModuleClick,
  onWeekClick,
  onLessonClick,
  onProjectClick,
  isLoading = false
}: CourseSidebarProps) => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [expandedModules, setExpandedModules] = useState<string[]>(
    modules.map(module => module.id)
  );
  
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [lessonCompletionStatus, setLessonCompletionStatus] = useState<Record<string, boolean>>({});

  // Fetch lesson completion status
  const fetchLessonCompletionStatus = async () => {
    if (!user || !courseId) return;

    try {
      const { data: progressData, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'completed');

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

  useEffect(() => {
    fetchLessonCompletionStatus();
  }, [user, courseId]);

  // Listen for lesson completion events
  useEffect(() => {
    const handleLessonCompleted = () => {
      console.log('Refreshing lesson completion status in sidebar...');
      fetchLessonCompletionStatus();
    };

    window.addEventListener('lessonCompleted', handleLessonCompleted);
    
    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompleted);
    };
  }, [user, courseId]);

  const handleBackClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate('/dashboard/my-courses');
  };

  const toggleModule = (moduleId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Call the onModuleClick callback if provided
    if (onModuleClick) {
      onModuleClick(moduleId);
    }
    
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleWeek = (moduleId: string, weekId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Call the onWeekClick callback if provided
    if (onWeekClick) {
      onWeekClick(moduleId, weekId);
    }
    
    const weekKey = `${moduleId}-${weekId}`;
    setExpandedWeeks(prev => 
      prev.includes(weekKey)
        ? prev.filter(id => id !== weekKey)
        : [...prev, weekKey]
    );
  };

  const handleLessonClick = (moduleId: string, weekId: string, lessonId: string, isLocked: boolean) => {
    if (isLocked) return;
    
    // Call the onLessonClick callback if provided
    if (onLessonClick) {
      onLessonClick(moduleId, weekId, lessonId);
    }
    
    // Navigate to the lesson
    navigate(`/learn/course/${courseId}/lesson/${lessonId}`);
  };

  const handleProjectClick = (type: 'minor' | 'major', moduleId: string, weekId?: string) => {
    if (onProjectClick) {
      onProjectClick(type, moduleId, weekId);
    }
  };

  const getLessonIcon = (lesson: Lesson) => {
    // Check completion status from our fetched data
    const isCompleted = lessonCompletionStatus[lesson.id] || lesson.isCompleted;
    
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-green-500" />;
    
    switch (lesson.type) {
      case 'video':
        return <PlayCircle className="w-4 h-4 text-purple-500" />;
      case 'reading':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'quiz':
        return <PlayCircle className="w-4 h-4 text-orange-500" />;
      case 'minor_project':
      case 'major_project':
        return <File className="w-4 h-4 text-indigo-500" />;
      default:
        return <PlayCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <aside 
        className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${
          isCollapsed ? 'w-12' : 'w-80'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <button onClick={handleBackClick} className="flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm">Back to My Courses</span>
            </button>
          )}
          <button 
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {isCollapsed ? <PanelRight className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="space-y-2 ml-4">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-5 bg-gray-200 rounded w-5/6"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-80'
      } flex flex-col`}
    >
      {/* Sidebar header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <button onClick={handleBackClick} className="flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium text-sm">Back to My Courses</span>
          </button>
        )}
        <button 
          onClick={onToggleCollapse}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {isCollapsed ? <PanelRight className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Module list */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
          {modules.length > 0 ? (
            modules.map((module) => (
              <div key={module.id} className="border-b border-gray-100 last:border-none">
                <div 
                  className="p-4 flex items-center cursor-pointer hover:bg-gray-50"
                  onClick={(e) => toggleModule(module.id, e)}
                >
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center">
                      <Book className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <span className="text-sm font-bold">{module.title}</span>
                  <ChevronDown
                    className={`ml-auto w-5 h-5 text-gray-400 transition-transform ${
                      expandedModules.includes(module.id) ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                
                {expandedModules.includes(module.id) && module.weeks && module.weeks.length > 0 && (
                  <div className="pl-4">
                    {module.weeks.map((week) => (
                      <div key={`${module.id}-${week.id}`} className="mb-2">
                        <div 
                          className="pl-4 pr-2 py-2 flex items-center cursor-pointer hover:bg-gray-50"
                          onClick={(e) => toggleWeek(module.id, week.id, e)}
                        >
                          <div className="mr-3 flex-shrink-0">
                            <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                          <span className="text-sm font-medium">{week.title}</span>
                          <ChevronDown
                            className={`ml-auto w-5 h-5 text-gray-400 transition-transform ${
                              expandedWeeks.includes(`${module.id}-${week.id}`) ? 'transform rotate-180' : ''
                            }`}
                          />
                        </div>
                        
                        {expandedWeeks.includes(`${module.id}-${week.id}`) && week.lessons && week.lessons.length > 0 && (
                          <div className="pl-12 pr-4 pb-2 space-y-1">
                            {week.lessons.map((lesson, index) => (
                              <div
                                key={lesson.id}
                                className={`flex items-center py-2 px-3 rounded-md text-sm cursor-pointer ${
                                  lessonId === lesson.id
                                    ? 'bg-gray-100 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                } ${lesson.isLocked ? 'opacity-60' : ''}`}
                                onClick={() => handleLessonClick(module.id, week.id, lesson.id, lesson.isLocked)}
                              >
                                <div className="mr-3 flex-shrink-0">
                                  {lesson.isLocked ? (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    getLessonIcon(lesson)
                                  )}
                                </div>
                                <span className="truncate">Day {index + 1}: {lesson.title}</span>
                                {lesson.duration && (
                                  <span className="ml-auto text-xs text-gray-400">{lesson.duration}</span>
                                )}
                              </div>
                            ))}
                            
                            {/* Minor Project Submission Tile at the end of each week */}
                            <div
                              className="flex items-center py-2 px-3 rounded-md text-sm cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 mt-2"
                              onClick={() => handleProjectClick('minor', module.id, week.id)}
                            >
                              <div className="mr-3 flex-shrink-0">
                                <File className="w-4 h-4 text-indigo-600" />
                              </div>
                              <span className="font-medium text-indigo-700">MINOR PROJECT</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Major Project Submission Tile at the end of each module */}
                    <div className="pl-4 pr-4 pb-4">
                      <div
                        className="flex items-center py-3 px-4 rounded-md text-sm cursor-pointer bg-purple-50 hover:bg-purple-100 border border-purple-200 mt-2"
                        onClick={() => handleProjectClick('major', module.id)}
                      >
                        <div className="mr-3 flex-shrink-0">
                          <File className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-medium text-purple-700">MAJOR PROJECT</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No modules available
            </div>
          )}
        </div>
      )}
      
      {isCollapsed && (
        <div className="flex-1 overflow-y-auto py-4">
          {modules.map((module, index) => (
            <div 
              key={module.id} 
              className="flex justify-center py-3"
              onClick={(e) => toggleModule(module.id, e)}
            >
              <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center cursor-pointer">
                <Book className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default CourseSidebar;
