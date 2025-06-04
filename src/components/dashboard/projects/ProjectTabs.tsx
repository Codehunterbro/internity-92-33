
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProjectTabsProps {
  activeTab: 'all' | 'pending' | 'submitted' | 'marked';
  onTabChange: (tab: 'all' | 'pending' | 'submitted' | 'marked') => void;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'pending',
    label: 'Pending'
  }, {
    id: 'submitted',
    label: 'Submitted'
  }, {
    id: 'marked',
    label: 'Marked'
  }] as const;

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 w-full max-w-md">
          <div className="grid grid-cols-4 gap-1 w-full">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                  activeTab === tab.id 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                size="sm"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTabs;
