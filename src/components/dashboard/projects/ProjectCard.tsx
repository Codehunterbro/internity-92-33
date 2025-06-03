
import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  type: 'minor' | 'major';
  moduleId: string;
  weekId?: string;
  courseId: string;
  deadline: string;
  status: 'pending' | 'done' | 'submitted' | 'not_submitted';
  score?: string;
  onCheck: (type: 'minor' | 'major', moduleId: string, weekId?: string, courseId?: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  type,
  moduleId,
  weekId,
  courseId,
  deadline,
  status,
  score,
  onCheck
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'done':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">MARKED</Badge>;
      case 'submitted':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">SUBMITTED</Badge>;
      case 'pending':
      case 'not_submitted':
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">PENDING</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />;
      case 'pending':
      case 'not_submitted':
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />;
    }
  };

  const formatDeadline = (deadline: string) => {
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
      });
    } catch {
      return deadline;
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-3">
          {/* Top row with icon, badge and status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                {type === 'major' ? 'Major Project' : 'Minor Project'}
              </Badge>
            </div>
            {getStatusBadge()}
          </div>
          
          {/* Date row */}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{formatDeadline(deadline)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Title */}
        <h3 className="font-semibold text-base text-gray-900 leading-tight">{title}</h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{description}</p>
        
        {/* Score display if available */}
        {score && status === 'done' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Score:</span>
              <span className="text-lg font-bold text-green-900">{score}</span>
            </div>
          </div>
        )}
        
        {/* Bottom section with status and button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 flex-1">
            {getStatusIcon()}
            <span className="text-sm text-gray-500 truncate">
              Deadline: {formatDeadline(deadline)}
            </span>
          </div>
          
          <Button 
            onClick={() => onCheck(type, moduleId, weekId, courseId)} 
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto"
          >
            Check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
