
import React, { useState } from 'react';
import { AlignJustify, X, ChevronDown, CheckCircle, PlayCircle, FileText, File, Book, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { Module } from './CourseSidebar';

interface ResponsiveCourseMenuProps {
  modules: Module[];
  lessonId?: string;
  onLessonClick?: (moduleId: string, weekId: string, lessonId: string) => void;
  onProjectClick?: (type: 'minor' | 'major', moduleId: string, weekId?: string) => void;
  lessonCompletionStatus: Record<string, boolean>;
}

const ResponsiveCourseMenu = ({ 
  modules, 
  lessonId, 
  onLessonClick, 
  onProjectClick,
  lessonCompletionStatus 
}: ResponsiveCourseMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleWeek = (moduleId: string, weekId: string) => {
    const weekKey = `${moduleId}-${weekId}`;
    setExpandedWeeks(prev => 
      prev.includes(weekKey)
        ? prev.filter(id => id !== weekKey)
        : [...prev, weekKey]
    );
  };

  const handleLessonClick = (moduleId: string, weekId: string, lessonId: string) => {
    if (onLessonClick) {
      onLessonClick(moduleId, weekId, lessonId);
    }
    setIsOpen(false);
  };

  const handleProjectClick = (type: 'minor' | 'major', moduleId: string, weekId?: string) => {
    if (onProjectClick) {
      onProjectClick(type, moduleId, weekId);
    }
    setIsOpen(false);
  };

  const handleMyCoursesClick = () => {
    navigate('/dashboard/my-courses');
    setIsOpen(false);
  };

  const getLessonIcon = (lesson: any) => {
    const isCompleted = lessonCompletionStatus[lesson.id] || lesson.isCompleted;
    
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
    
    switch (lesson.type) {
      case 'video':
        return <PlayCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />;
      case 'reading':
        return <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      case 'quiz':
        return <PlayCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />;
      case 'minor_project':
      case 'major_project':
        return <File className="w-5 h-5 text-indigo-500 flex-shrink-0" />;
      default:
        return <PlayCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />;
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="fixed top-4 left-4 z-50 bg-white shadow-md border border-gray-200 lg:hidden w-12 h-12 p-0"
          >
            <AlignJustify className="w-6 h-6 text-gray-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85vw] max-w-sm p-0 lg:hidden bg-white">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg text-gray-900">Course Content</h2>
                  <p className="text-sm text-gray-600 mt-1">Navigate through modules</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                  <Book className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              
              {/* Navigation to My Courses */}
              <Button
                onClick={handleMyCoursesClick}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">My Courses</span>
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {modules.length > 0 ? modules.map((module) => (
                <Collapsible 
                  key={module.id}
                  open={expandedModules.includes(module.id)}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100 bg-white shadow-sm transition-all">
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                          <Book className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <span className="text-sm font-semibold text-gray-900 block truncate">{module.title}</span>
                        <span className="text-xs text-gray-500">
                          {module.weeks?.length || 0} weeks
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                        expandedModules.includes(module.id) ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2 ml-2 space-y-2">
                    {module.weeks && module.weeks.map((week) => (
                      <Collapsible
                        key={`${module.id}-${week.id}`}
                        open={expandedWeeks.includes(`${module.id}-${week.id}`)}
                        onOpenChange={() => toggleWeek(module.id, week.id)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center p-2.5 hover:bg-gray-50 rounded-md border border-gray-100 bg-white transition-all">
                            <div className="mr-2 flex-shrink-0">
                              <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center border border-gray-200">
                                <Calendar className="w-3 h-3 text-gray-600" />
                              </div>
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <span className="text-sm font-medium text-gray-800 truncate block">{week.title}</span>
                              <span className="text-xs text-gray-500">
                                {week.lessons?.length || 0} lessons
                              </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                              expandedWeeks.includes(`${module.id}-${week.id}`) ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="ml-3 mt-1 space-y-1">
                          {week.lessons && week.lessons.map((lesson, index) => {
                            const isCompleted = lessonCompletionStatus[lesson.id] || lesson.isCompleted;
                            return (
                              <div
                                key={lesson.id}
                                className={`flex items-center p-2.5 rounded-md text-sm cursor-pointer border transition-all ${
                                  lessonId === lesson.id
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 border-gray-100 bg-white'
                                }`}
                                onClick={() => handleLessonClick(module.id, week.id, lesson.id)}
                              >
                                <div className="mr-2 flex-shrink-0">
                                  {getLessonIcon(lesson)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="font-medium block text-xs">Day {index + 1}</span>
                                  <span className="block text-xs text-gray-500 truncate">{lesson.title}</span>
                                </div>
                              </div>
                            );
                          })}
                          
                          <div className="pt-2">
                            <div
                              className="flex items-center p-2.5 rounded-md text-sm cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all"
                              onClick={() => handleProjectClick('minor', module.id, week.id)}
                            >
                              <div className="mr-2 flex-shrink-0">
                                <File className="w-5 h-5 text-blue-600" />
                              </div>
                              <span className="font-semibold text-blue-700 text-xs uppercase tracking-wide">Minor Project</span>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    
                    <div className="pt-3">
                      <div
                        className="flex items-center p-2.5 rounded-md text-sm cursor-pointer bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all"
                        onClick={() => handleProjectClick('major', module.id)}
                      >
                        <div className="mr-2 flex-shrink-0">
                          <File className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-semibold text-purple-700 text-xs uppercase tracking-wide">Major Project</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )) : (
                <div className="text-center py-8">
                  <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No modules available</p>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ResponsiveCourseMenu;
