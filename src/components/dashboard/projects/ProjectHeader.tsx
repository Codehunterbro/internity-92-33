
import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectHeaderProps {
  title: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
  weekFilter: string;
  monthFilter: string;
  onWeekFilterChange: (value: string) => void;
  onMonthFilterChange: (value: string) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  title, 
  filterValue, 
  onFilterChange,
  weekFilter,
  monthFilter,
  onWeekFilterChange,
  onMonthFilterChange
}) => {
  const weekOptions = [
    { value: 'all', label: 'All Weeks' },
    { value: 'week1', label: 'Week 1' },
    { value: 'week2', label: 'Week 2' },
    { value: 'week3', label: 'Week 3' },
    { value: 'week4', label: 'Week 4' }
  ];

  const monthOptions = [
    { value: 'all', label: 'All Months' },
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' }
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <Select value={weekFilter} onValueChange={onWeekFilterChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Week" />
          </SelectTrigger>
          <SelectContent>
            {weekOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={monthFilter} onValueChange={onMonthFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
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
