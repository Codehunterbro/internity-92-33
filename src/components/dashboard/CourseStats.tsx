
import { Star, Clock, Users } from 'lucide-react';

interface CourseStatsProps {
  rating: number;
  students: number;
  duration: string;
}

const CourseStats = ({ rating, students, duration }: CourseStatsProps) => {
  return (
    <div className="flex items-center justify-between mb-4 text-sm">
      <div className="flex items-center">
        <Star className="w-4 h-4 text-yellow-400 mr-1" />
        <span className="font-medium">{rating}</span>
      </div>
      <div className="flex items-center">
        <Users className="w-4 h-4 text-muted-foreground mr-1" />
        <span>{students.toLocaleString()}</span>
      </div>
      <div className="flex items-center">
        <Clock className="w-4 h-4 text-muted-foreground mr-1" />
        <span>{duration}</span>
      </div>
    </div>
  );
};

export default CourseStats;
