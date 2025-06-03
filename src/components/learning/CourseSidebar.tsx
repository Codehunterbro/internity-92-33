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
    
    if (onLessonClick) {
      onLessonClick(moduleId, weekId, lessonId);
    }
    
    navigate(`/learn/course/${courseId}/lesson/${lessonId}`);
  };

  const handleProjectClick = (type: 'minor' | 'major', moduleId: string, weekId?: string) => {
    if (onProjectClick) {
      onProjectClick(type, moduleId, weekId);
    }
  };

  const getLessonIcon = (lesson: Lesson) => {
    const isCompleted = lessonCompletionStatus[lesson.id] || lesson.isCompleted;
    
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    
    switch (lesson.type) {
      case 'video':
        return <PlayCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />;
      case 'reading':
        return <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />;
      case 'quiz':
        return <PlayCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />;
      case 'minor_project':
      case 'major_project':
        return <File className="w-4 h-4 text-indigo-500 flex-shrink-0" />;
      default:
        return <PlayCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />;
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
      className={`bg-white border-r border-gray-100 h-screen transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-80'
      } flex flex-col`}
    >
      {/* Sidebar header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {!isCollapsed && (
          <button onClick={handleBackClick} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">Back to My Courses</span>
          </button>
        )}
        <button 
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? <PanelRight className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Module list */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {modules.length > 0 ? (
            modules.map((module) => (
              <div key={module.id} className="mb-1">
                <div 
                  className="p-3 flex items-center cursor-pointer hover:bg-gray-50 rounded-lg border border-gray-100 bg-white shadow-sm transition-all"
                  onClick={(e) => toggleModule(module.id, e)}
                >
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                      <Book className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 block truncate">{module.title}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{module.weeks?.length || 0} weeks</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                      expandedModules.includes(module.id) ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                
                {expandedModules.includes(module.id) && module.weeks && module.weeks.length > 0 && (
                  <div className="mt-2 ml-2 space-y-2">
                    {module.weeks.map((week) => (
                      <div key={`${module.id}-${week.id}`}>
                        <div 
                          className="p-2.5 flex items-center cursor-pointer hover:bg-gray-50 rounded-md border border-gray-100 bg-white transition-all"
                          onClick={(e) => toggleWeek(module.id, week.id, e)}
                        >
                          <div className="mr-2 flex-shrink-0">
                            <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center border border-gray-200">
                              <Calendar className="w-3 h-3 text-gray-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-800 truncate block">{week.title}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{week.lessons?.length || 0} lessons</p>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                              expandedWeeks.includes(`${module.id}-${week.id}`) ? 'transform rotate-180' : ''
                            }`}
                          />
                        </div>
                        
                        {expandedWeeks.includes(`${module.id}-${week.id}`) && week.lessons && week.lessons.length > 0 && (
                          <div className="ml-3 mt-1 space-y-1">
                            {week.lessons.map((lesson, index) => (
                              <div
                                key={lesson.id}
                                className={`flex items-center p-2.5 rounded-md text-sm cursor-pointer border transition-all ${
                                  lessonId === lesson.id
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 border-gray-100 bg-white'
                                } ${lesson.isLocked ? 'opacity-60' : ''}`}
                                onClick={() => handleLessonClick(module.id, week.id, lesson.id, lesson.isLocked)}
                              >
                                <div className="mr-2 flex-shrink-0">
                                  {lesson.isLocked ? (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    getLessonIcon(lesson)
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs">Day {index + 1}</div>
                                  <div className="text-xs text-gray-500 truncate">{lesson.title}</div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Minor Project Submission */}
                            <div
                              className="flex items-center p-2.5 rounded-md text-sm cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 mt-2 transition-all"
                              onClick={() => handleProjectClick('minor', module.id, week.id)}
                            >
                              <div className="mr-2 flex-shrink-0">
                                <File className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-semibold text-blue-700 text-xs uppercase tracking-wide">Minor Project</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Major Project Submission */}
                    <div className="mt-3">
                      <div
                        className="flex items-center p-2.5 rounded-md text-sm cursor-pointer bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all"
                        onClick={() => handleProjectClick('major', module.id)}
                      >
                        <div className="mr-2 flex-shrink-0">
                          <File className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-purple-700 text-xs uppercase tracking-wide">Major Project</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No modules available</p>
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
