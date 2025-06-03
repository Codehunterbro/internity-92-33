
import React, { useState } from 'react';
import { Menu, X, ChevronDown, CheckCircle, PlayCircle, FileText, File, Book, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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

  const getLessonIcon = (lesson: any) => {
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

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="fixed top-4 left-4 z-50 bg-white shadow-lg border-gray-300 lg:hidden"
          >
            <Menu className="w-4 h-4" />
            <span className="ml-2 text-sm">Course Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85vw] max-w-sm p-0 lg:hidden">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-lg text-gray-900">Course Content</h2>
              <p className="text-sm text-gray-600 mt-1">Navigate through modules and lessons</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {modules.length > 0 ? modules.map((module) => (
                <Collapsible 
                  key={module.id}
                  open={expandedModules.includes(module.id)}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Book className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-semibold text-gray-900 block">{module.title}</span>
                        <span className="text-xs text-gray-500">
                          {module.weeks?.length || 0} weeks
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedModules.includes(module.id) ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2 ml-4 space-y-2">
                    {module.weeks && module.weeks.map((week) => (
                      <Collapsible
                        key={`${module.id}-${week.id}`}
                        open={expandedWeeks.includes(`${module.id}-${week.id}`)}
                        onOpenChange={() => toggleWeek(module.id, week.id)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center p-2 hover:bg-gray-50 rounded-md border border-gray-100 bg-white">
                            <div className="mr-2 flex-shrink-0">
                              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                                <Calendar className="w-3 h-3 text-gray-600" />
                              </div>
                            </div>
                            <div className="flex-1 text-left">
                              <span className="text-sm font-medium text-gray-800">{week.title}</span>
                              <span className="text-xs text-gray-500 block">
                                {week.lessons?.length || 0} lessons
                              </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                              expandedWeeks.includes(`${module.id}-${week.id}`) ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="ml-4 mt-1 space-y-1">
                          {week.lessons && week.lessons.map((lesson, index) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center p-2 rounded-md text-sm cursor-pointer border ${
                                lessonId === lesson.id
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200 bg-white'
                              }`}
                              onClick={() => handleLessonClick(module.id, week.id, lesson.id)}
                            >
                              <div className="mr-2 flex-shrink-0">
                                {getLessonIcon(lesson)}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium">Day {index + 1}</span>
                                <span className="block text-xs text-gray-500 truncate">{lesson.title}</span>
                              </div>
                            </div>
                          ))}
                          
                          {/* Minor Project */}
                          <div
                            className="flex items-center p-2 rounded-md text-sm cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 mt-2"
                            onClick={() => handleProjectClick('minor', module.id, week.id)}
                          >
                            <div className="mr-2 flex-shrink-0">
                              <File className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="font-semibold text-indigo-700">MINOR PROJECT</span>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    
                    {/* Major Project */}
                    <div
                      className="flex items-center p-3 rounded-md text-sm cursor-pointer bg-purple-50 hover:bg-purple-100 border border-purple-200 mt-3"
                      onClick={() => handleProjectClick('major', module.id)}
                    >
                      <div className="mr-2 flex-shrink-0">
                        <File className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-semibold text-purple-700">MAJOR PROJECT</span>
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
