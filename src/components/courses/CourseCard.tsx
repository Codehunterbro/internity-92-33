
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CourseTag from './CourseTag';
import CourseStats from './CourseStats';
import CourseEnrollButton from './CourseEnrollButton';
import { Course } from '@/services/courseService';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard = ({ course, onClick }: CourseCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

  // Format duration to clearly show months
  const formatDuration = (duration: string | null) => {
    if (!duration) return "N/A";
    
    // If it already contains "Month" or "Months", return as is
    if (duration.toLowerCase().includes("month")) {
      return duration;
    }
    
    // Try to extract a number if it might be just a number of months
    const monthMatch = duration.match(/^(\d+)$/);
    if (monthMatch) {
      const months = parseInt(monthMatch[1], 10);
      return `${months} Month${months !== 1 ? 's' : ''}`;
    }
    
    return duration;
  };

  const handleCardClick = () => {
    // Call the onClick handler (which will open course detail dialog)
    onClick();
  };

  return (
    <Card 
      className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative" onClick={handleCardClick}>
        <img 
          src={course.image || '/placeholder.svg'} 
          alt={course.title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
            setIsImageLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-5 flex-1 flex flex-col bg-white group-hover:bg-purple-50 transition-colors duration-300">
        <div className="flex flex-wrap gap-2 mb-3">
          {course.tags?.slice(0, 2).map((tag, index) => (
            <CourseTag key={index} tag={tag} />
          ))}
          {course.tags && course.tags.length > 2 && (
            <CourseTag tag={`+${course.tags.length - 2}`} />
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-purple transition-colors duration-300">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description}
        </p>

        {course.instructor && (
          <p className="text-sm text-muted-foreground mb-2 italic">
            Taught by: {course.instructor}
          </p>
        )}

        <CourseStats 
          rating={course.rating || 0}
          students={course.students || 0}
          duration={formatDuration(course.duration) || "N/A"}
        />
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="text-lg font-bold text-brand-purple">
            ₹{(course.priceINR || Math.round(course.price * 83)).toLocaleString('en-IN')}
          </div>
          <CourseEnrollButton course={{
            id: course.id,
            title: course.title,
            price: course.price, // Original USD price from database
            priceINR: course.priceINR, // INR price from database
            image: course.image || '/placeholder.svg',
          }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
