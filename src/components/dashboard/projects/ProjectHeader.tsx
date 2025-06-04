
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectHeaderProps {
  title: string;
  monthFilter: string;
  onMonthFilterChange: (value: string) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  title, 
  monthFilter,
  onMonthFilterChange
}) => {
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
      
      <div className="flex items-center gap-2">
        <Select value={monthFilter} onValueChange={onMonthFilterChange}>
          <SelectTrigger className="w-[140px] text-xs sm:text-sm">
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
      </div>
    </div>
  );
};

export default ProjectHeader;
