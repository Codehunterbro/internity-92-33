
import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectHeaderProps {
  title: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  title, 
  filterValue, 
  onFilterChange 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
        
        <div className="relative">
          <Button variant="outline" className="flex items-center space-x-2">
            <span>{filterValue}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
