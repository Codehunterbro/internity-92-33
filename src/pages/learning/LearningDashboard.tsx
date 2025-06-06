
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, PlayCircle, User, Users, Loader2, BookOpen, Award, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import ResponsiveCourseMenu from '@/components/learning/ResponsiveCourseMenu';

const LearningDashboard = () => {
  const { purchasedCourses, isLoading, refetchCourses } = usePurchasedCourses();
  
  useEffect(() => {
    refetchCourses();
  }, [refetchCourses]);

  const upcomingEvents = [
    {
      id: 1,
      title: "Live Coding Session: Building a React App",
      date: "Sep 15, 2023",
      time: "2:00 PM - 3:30 PM",
      instructor: "John Smith",
      attendees: 42,
    },
    {
      id: 2,
      title: "Q&A Session: Web Development Career Paths",
      date: "Sep 18, 2023",
      time: "4:00 PM - 5:00 PM",
      instructor: "Sarah Johnson",
      attendees: 78,
    }
  ];
  
  const mentors = [
    {
      id: 1,
      name: "David Wilson",
      role: "Senior Developer",
      expertise: "Frontend Development",
      available: true,
    },
    {
      id: 2,
      name: "Emily Chen",
      role: "UX Designer",
      expertise: "User Research, Prototyping",
      available: false,
    }
  ];

  // Mock modules for the responsive menu with correct types
  const mockModules = [
    {
      id: '1',
      title: 'Module 1: Fundamentals',
      weeks: [
        {
          id: '1',
          title: 'Week 1: Introduction',
          lessons: [
            { id: '1', title: 'Getting Started', type: 'video' as const, duration: '15 min', isCompleted: true, isLocked: false },
            { id: '2', title: 'Basics', type: 'reading' as const, duration: '10 min', isCompleted: false, isLocked: false }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Course Menu - only shows on small screens */}
      <ResponsiveCourseMenu 
        modules={mockModules}
        lessonCompletionStatus={{}}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">Learning Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden sm:flex text-xs sm:text-sm">
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button size="sm" className="bg-brand-purple hover:bg-brand-purple/90 text-xs sm:text-sm">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Courses Section */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center w-full sm:w-auto">
                <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-brand-purple mx-auto mb-1" />
                  <p className="text-sm sm:text-lg font-bold text-brand-purple">{purchasedCourses?.length || 0}</p>
                  <p className="text-xs text-gray-500">Enrolled</p>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm sm:text-lg font-bold text-green-600">
                    {purchasedCourses?.reduce((total, course) => total + course.lessonsCompleted, 0) || 0}
                  </p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-sm sm:text-lg font-bold text-yellow-600">5</p>
                  <p className="text-xs text-gray-500">Certificates</p>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 text-brand-purple animate-spin" />
                <span className="ml-2 text-sm sm:text-lg">Loading your courses...</span>
              </div>
            ) : purchasedCourses && purchasedCourses.length > 0 ? (
              <div className="grid gap-4 sm:gap-6">
                {purchasedCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-48 h-32 lg:h-auto overflow-hidden">
                        <img 
                          src={course.image || '/placeholder.svg'} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1 p-3 sm:p-4 lg:p-6">
                        <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900">{course.title}</h3>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-xs sm:text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-brand-purple">
                              {Math.round((course.lessonsCompleted / course.totalLessons) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-brand-purple h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.round((course.lessonsCompleted / course.totalLessons) * 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {course.lessonsCompleted} of {course.totalLessons} lessons completed
                          </p>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-700">Next Lesson:</p>
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                              <PlayCircle className="h-4 w-4 text-brand-purple mr-1" />
                              <span>Continue where you left off</span>
                            </div>
                          </div>
                          
                          <Link 
                            to={`/learn/course/${course.id}`}
                            className="bg-brand-purple text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-brand-purple/90 transition-colors w-full lg:w-auto text-center"
                          >
                            Continue Learning
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8 sm:py-12">
                  <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-500 mb-2">You haven't purchased any courses yet</h3>
                  <p className="text-sm text-gray-400 mb-4">Start your learning journey today</p>
                  <Link to="/dashboard/courses" className="bg-brand-purple text-white py-2 px-4 rounded-md hover:bg-brand-purple/90 transition-colors text-sm">
                    Browse Courses
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-brand-purple pl-3">
                    <h4 className="font-medium text-xs sm:text-sm">{event.title}</h4>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 text-xs h-6 sm:h-7">
                      Join Event
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Mentors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Your Mentors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-semibold text-xs">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-xs sm:text-sm">{mentor.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          mentor.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {mentor.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{mentor.role}</p>
                      <p className="text-xs text-gray-400">{mentor.expertise}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="mt-1 text-xs h-6 sm:h-7 text-brand-purple px-0"
                        disabled={!mentor.available}
                      >
                        Schedule Meeting
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningDashboard;
