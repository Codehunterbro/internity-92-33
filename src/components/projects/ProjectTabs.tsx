
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProjectTabsProps {
  activeTab: 'all' | 'pending' | 'done';
  onTabChange: (tab: 'all' | 'pending' | 'done') => void;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'done', label: 'Done' }
  ] as const;

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default ProjectTabs;
