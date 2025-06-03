
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
        return <CheckCircle className="h-3 md:h-4 w-3 md:w-4 text-green-600" />;
      case 'submitted':
        return <Clock className="h-3 md:h-4 w-3 md:w-4 text-blue-600" />;
      case 'pending':
      case 'not_submitted':
      default:
        return <AlertCircle className="h-3 md:h-4 w-3 md:w-4 text-yellow-600" />;
    }
  };

  const getCategoryIcon = () => {
    return <FileText className="h-3 md:h-4 w-3 md:w-4 text-gray-500" />;
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
      <CardHeader className="pb-2 md:pb-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
          <div className="flex items-center space-x-2 md:space-x-3">
            {getCategoryIcon()}
            <Badge variant="outline" className="text-xs">
              {type === 'major' ? 'Major Project' : 'Minor Project'}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center text-xs md:text-sm text-gray-500">
              <Calendar className="h-3 md:h-4 w-3 md:w-4 mr-1" />
              {formatDeadline(deadline)}
            </div>
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 md:space-y-3">
          <h3 className="font-semibold text-base md:text-lg text-gray-900 break-words">{title}</h3>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed break-words">{description}</p>
          
          {/* Display marks if available and status is marked */}
          {score && status === 'done' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 md:p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-medium text-green-800">Score:</span>
                <span className="text-base md:text-lg font-bold text-green-900">{score}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-xs md:text-sm text-gray-500">
                Deadline: {formatDeadline(deadline)}
              </span>
            </div>
            <Button 
              onClick={() => onCheck(type, moduleId, weekId, courseId)} 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2 rounded-md text-xs md:text-sm w-full sm:w-auto"
            >
              Check
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
