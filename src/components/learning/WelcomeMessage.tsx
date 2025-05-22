
import { BookOpen } from 'lucide-react';

interface WelcomeMessageProps {
  courseTitle?: string;
}

const WelcomeMessage = ({ courseTitle }: WelcomeMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
        <BookOpen className="w-10 h-10 text-brand-purple" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to {courseTitle || 'Your Course'}</h2>
      <p className="text-gray-600 max-w-md">
        Select a lesson from the sidebar to start learning. 
        Your progress will be tracked as you complete each lesson.
      </p>
    </div>
  );
};

export default WelcomeMessage;
