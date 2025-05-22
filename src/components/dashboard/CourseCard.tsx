import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  image: string;
  completedLessons: number;
  totalLessons: number;
  duration: string;
  onClick?: () => void;
}

const CourseCard = ({
  id,
  title,
  image,
  completedLessons,
  totalLessons,
  duration,
  onClick
}: CourseCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/learn/courses/${id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image || '/placeholder.svg'} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
            setIsImageLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-5 flex-1 flex flex-col bg-white group-hover:bg-purple-50 transition-colors duration-300">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-purple transition-colors duration-300">
          {title}
        </h3>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{Math.round((completedLessons / totalLessons) * 100) || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand-purple h-2 rounded-full" 
              style={{ width: `${Math.round((completedLessons / totalLessons) * 100) || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span>Duration: {duration}</span>
            </div>
            <button 
              className="bg-brand-purple hover:bg-brand-purple/90 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                navigate(`/learn/courses/${id}`);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              Continue Learning
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;