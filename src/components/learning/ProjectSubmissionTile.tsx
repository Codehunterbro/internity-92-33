
import React from 'react';
import { File, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface ProjectSubmissionTileProps {
  type: 'minor' | 'major';
  title: string;
  description?: string;
  dueDate?: string;
  status?: 'not_submitted' | 'submitted' | 'graded' | 'overdue';
  score?: string;
  isLocked?: boolean;
  onClick?: () => void;
}

const ProjectSubmissionTile = ({
  type,
  title,
  description,
  dueDate,
  status = 'not_submitted',
  score,
  isLocked = false,
  onClick
}: ProjectSubmissionTileProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'submitted':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'graded':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'submitted':
        return 'Submitted - Waiting Review';
      case 'graded':
        return `Graded - Score: ${score || 'N/A'}`;
      case 'overdue':
        return 'Overdue';
      default:
        return 'Not Submitted';
    }
  };

  const formattedDueDate = dueDate ? 
    `Due ${formatDistanceToNow(new Date(dueDate), { addSuffix: true })}` : 
    'No deadline set';

  const borderColor = isLocked ? 
    'border-gray-200' : 
    type === 'major' ? 'border-purple-200' : 'border-blue-200';
    
  const headerBgColor = isLocked ? 
    'bg-gray-50' : 
    type === 'major' ? 'bg-purple-50' : 'bg-blue-50';

  const iconBgColor = isLocked ? 
    'bg-gray-100' : 
    type === 'major' ? 'bg-purple-100' : 'bg-blue-100';
    
  const iconColor = isLocked ? 
    'text-gray-600' : 
    type === 'major' ? 'text-purple-600' : 'text-blue-600';
    
  const buttonColor = isLocked ? 
    'bg-gray-600 hover:bg-gray-700' : 
    type === 'major' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <Card className={`mb-6 ${borderColor}`}>
      <CardHeader className={`pb-2 ${headerBgColor}`}>
        <div className="flex items-center">
          <div className={`p-2 mr-3 rounded-md ${iconBgColor}`}>
            {isLocked ? (
              <Lock className={`h-5 w-5 ${iconColor}`} />
            ) : (
              <File className={`h-5 w-5 ${iconColor}`} />
            )}
          </div>
          <div>
            <CardTitle className="text-lg">
              {type === 'major' ? 'Major Project' : 'Minor Project'}: {title}
            </CardTitle>
            {!isLocked && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {dueDate && !isLocked && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Due Date:</span>
              <span className="font-medium">{formattedDueDate}</span>
            </div>
          )}
          {!isLocked && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className={`font-medium px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          )}
          {isLocked && (
            <div className="text-sm text-gray-500">
              This project is currently locked and will be available soon.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onClick} 
          className={`w-full ${buttonColor}`}
          disabled={isLocked}
        >
          {isLocked ? 'Locked' : status === 'not_submitted' ? 'Submit Project' : 'View Submission'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectSubmissionTile;
