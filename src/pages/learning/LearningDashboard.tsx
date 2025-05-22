
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, PlayCircle, User, Users, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';

const LearningDashboard = () => {
  const { purchasedCourses, isLoading, refetchCourses } = usePurchasedCourses();
  
  useEffect(() => {
    // Refetch courses when the component mounts
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand-purple">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="text-white mb-4 md:mb-0">
              <h1 className="text-2xl font-bold">Learning Dashboard</h1>
              <p className="opacity-80">Track your progress and continue learning</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <CalendarDays className="mr-2 h-4 w-4" />
                My Schedule
              </Button>
              <Button className="bg-white text-brand-purple hover:bg-white/90">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">My Courses</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 text-brand-purple animate-spin" />
                <span className="ml-2 text-lg">Loading your courses...</span>
              </div>
            ) : purchasedCourses && purchasedCourses.length > 0 ? (
              <div className="space-y-6">
                {purchasedCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-48 md:h-auto overflow-hidden">
                        <img 
                          src={course.image || '/placeholder.svg'} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{Math.round((course.lessonsCompleted / course.totalLessons) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-brand-purple h-2 rounded-full" 
                              style={{ width: `${Math.round((course.lessonsCompleted / course.totalLessons) * 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {course.lessonsCompleted} of {course.totalLessons} lessons completed
                          </p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <p className="text-sm font-medium">Next Lesson:</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <PlayCircle className="h-4 w-4 text-brand-purple mr-1" />
                              <span>Continue where you left off</span>
                            </div>
                          </div>
                          
                          <Link 
                            to={`/learn/course/${course.id}`}
                            className="bg-brand-purple text-white px-4 py-2 rounded-lg text-sm"
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
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-500">You haven't purchased any courses yet</h3>
                <Link to="/dashboard/courses" className="mt-4 inline-block bg-brand-purple text-white py-2 px-4 rounded-md">
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
          
          {/* Sidebar with schedule and mentors */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Live Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-brand-purple pl-4">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <User className="h-4 w-4 mr-1" />
                      <span>{event.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.attendees} attending</span>
                    </div>
                    <Button variant="outline" className="mt-2 text-xs h-8">
                      Join Event
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-brand-purple">
                  View All Events
                </Button>
              </CardContent>
            </Card>
            
            {/* Mentors */}
            <Card>
              <CardHeader>
                <CardTitle>Your Mentors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-semibold">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{mentor.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          mentor.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {mentor.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{mentor.role}</p>
                      <p className="text-xs text-muted-foreground">{mentor.expertise}</p>
                      <Button 
                        variant="ghost" 
                        className="mt-2 text-xs h-8 text-brand-purple"
                        disabled={!mentor.available}
                      >
                        Schedule Meeting
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-brand-purple">
                      {purchasedCourses.reduce((total, course) => total + course.lessonsCompleted, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Lessons Completed</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-brand-purple">32</p>
                    <p className="text-sm text-muted-foreground">Hours Spent</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-brand-purple">5</p>
                    <p className="text-sm text-muted-foreground">Assignments</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-brand-purple">
                      {purchasedCourses.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningDashboard;
