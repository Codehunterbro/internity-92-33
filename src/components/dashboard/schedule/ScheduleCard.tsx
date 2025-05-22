
import { Eye, FileText } from 'lucide-react';

interface ScheduleCardProps {
  course: {
    title: string;
    subtitle: string;
  };
  isLive?: boolean;
}

const ScheduleCard = ({ course, isLive }: ScheduleCardProps) => {
  return (
    <div>
      <div className="text-center py-2 bg-gray-100 text-gray-500 text-sm font-medium">
        {course.title}
        <div className="font-bold text-black">{course.subtitle}</div>
      </div>
      
      <div className="border rounded-md p-3 mt-4">
        <div className="flex flex-col">
          <div className="mb-2">
            <div className="text-sm font-medium">Introduction to Python</div>
            <div className="text-xs text-gray-500">Basics, syntax, and installation</div>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            {isLive ? (
              <div className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> Live
              </div>
            ) : (
              <div className="text-xs text-gray-500">11AM - 11:45AM</div>
            )}
            
            <div className="flex gap-1">
              {!isLive && (
                <>
                  <button className="text-xs py-0.5 px-1 bg-purple-100 text-purple-700 rounded flex items-center">
                    <FileText className="h-3 w-3 mr-0.5" /> Notes
                  </button>
                  <button className="text-xs py-0.5 px-1 bg-gray-100 text-gray-700 rounded flex items-center">
                    <Eye className="h-3 w-3 mr-0.5" /> Watch
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
