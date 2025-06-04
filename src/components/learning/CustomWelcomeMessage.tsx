import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, Clock } from 'lucide-react';
interface CustomWelcomeMessageProps {
  isPurchased: boolean;
  courseTitle: string;
}
const CustomWelcomeMessage: React.FC<CustomWelcomeMessageProps> = ({
  isPurchased,
  courseTitle
}) => {
  return <div className="p-3 sm:p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
          Welcome to {courseTitle}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 lg:mb-6 px-2">
          {isPurchased ? "You have full access to this course. Start your learning journey!" : "Get started with the free lessons, or purchase the full course for complete access."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-sm sm:text-base lg:text-lg">
              <BookOpen className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-2 text-blue-600" />
              Course Content
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="sm:text-sm lg:text-base text-sm">
              Access video lessons, reading materials, and interactive quizzes.
              {!isPurchased && " Some content requires course purchase."}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-sm sm:text-base lg:text-lg">
              <Users className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-2 text-green-600" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="sm:text-sm lg:text-base text-sm">
              Submit minor and major projects to demonstrate your learning.
              {!isPurchased && " Project submissions require course purchase."}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-sm sm:text-base lg:text-lg">
              <Clock className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
              Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="sm:text-sm lg:text-base text-sm">
              Track your progress through lessons and see your completion status.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-sm sm:text-base lg:text-lg">
              <Award className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-2 text-purple-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="sm:text-sm lg:text-base text-sm">
              Earn certificates and achievements as you complete course milestones.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-gray-600 sm:text-sm lg:text-base px-2 text-sm">
          <span className="hidden lg:inline">Select a lesson from the sidebar to get started, or explore the course structure.</span>
          <span className="lg:hidden">Tap the menu button to navigate between lessons and explore the course structure.</span>
        </p>
      </div>
    </div>;
};
export default CustomWelcomeMessage;