
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProjectTabsProps {
  activeTab: 'all' | 'pending' | 'submitted' | 'marked';
  onTabChange: (tab: 'all' | 'pending' | 'submitted' | 'marked') => void;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'marked', label: 'Marked' }
  ] as const;

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-fit">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProjectTabs;
