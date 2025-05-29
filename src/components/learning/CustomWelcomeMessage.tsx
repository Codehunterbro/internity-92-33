
import { BookOpen, Lock } from 'lucide-react';

interface CustomWelcomeMessageProps {
  isPurchased: boolean;
  courseTitle?: string;
}

const CustomWelcomeMessage = ({ isPurchased, courseTitle }: CustomWelcomeMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
        isPurchased ? 'bg-purple-100' : 'bg-gray-100'
      }`}>
        {isPurchased ? (
          <BookOpen className="w-10 h-10 text-brand-purple" />
        ) : (
          <Lock className="w-10 h-10 text-gray-400" />
        )}
      </div>
      
      {isPurchased ? (
        <>
          <h2 className="text-2xl font-bold mb-2">Welcome to {courseTitle || 'Your Course'}</h2>
          <p className="text-gray-600 max-w-md">
            Select a lesson from the sidebar to start learning. 
            Your progress will be tracked as you complete each lesson.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">Course Preview</h2>
          <p className="text-gray-600 max-w-md mb-4">
            You're viewing a preview of this course. Purchase the course to access all lessons and features.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard/courses'}
            className="bg-brand-purple text-white px-6 py-2 rounded-md hover:bg-brand-purple/90 transition-colors"
          >
            View Course Details
          </button>
        </>
      )}
    </div>
  );
};

export default CustomWelcomeMessage;
