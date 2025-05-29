
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
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to {courseTitle}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {isPurchased 
            ? "You have full access to this course. Start your learning journey!" 
            : "Get started with the free lessons, or purchase the full course for complete access."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Course Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Access video lessons, reading materials, and interactive quizzes.
              {!isPurchased && " Some content requires course purchase."}
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Submit minor and major projects to demonstrate your learning.
              {!isPurchased && " Project submissions require course purchase."}
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Track your progress through lessons and see your completion status.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Earn certificates and achievements as you complete course milestones.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-gray-600">
          Select a lesson from the sidebar to get started, or explore the course structure.
        </p>
      </div>
    </div>
  );
};

export default CustomWelcomeMessage;
