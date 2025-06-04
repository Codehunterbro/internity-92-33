
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Clock, Users, Star, BookOpen } from 'lucide-react';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import { supabase } from '@/integrations/supabase/client';

interface CourseWithDuration {
  id: string;
  title: string;
  image: string | null;
  duration: string | null;
  totalLessons: number;
  lessonsCompleted: number;
}

const PurchasedCoursesSection = () => {
  const { purchasedCourses, isLoading } = usePurchasedCourses();
  const [coursesWithDuration, setCoursesWithDuration] = useState<CourseWithDuration[]>([]);

  useEffect(() => {
    const fetchCourseDurations = async () => {
      if (purchasedCourses.length === 0) return;

      try {
        const courseIds = purchasedCourses.map(course => course.course_id);
        
        const { data: coursesData, error } = await supabase
          .from('courses')
          .select('id, duration')
          .in('id', courseIds);

        if (error) {
          console.error('Error fetching course durations:', error);
          return;
        }

        const coursesWithDurationData = purchasedCourses.map(course => {
          const courseData = coursesData?.find(c => c.id === course.course_id);
          return {
            id: course.course_id,
            title: course.title,
            image: course.image,
            duration: courseData?.duration || null,
            totalLessons: course.totalLessons,
            lessonsCompleted: course.lessonsCompleted
          };
        });

        setCoursesWithDuration(coursesWithDurationData);
      } catch (error) {
        console.error('Error fetching course durations:', error);
      }
    };

    fetchCourseDurations();
  }, [purchasedCourses]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="flex justify-between mb-4">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (coursesWithDuration.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Enrolled</h3>
          <p className="text-gray-500 mb-6">
            Start your learning journey by enrolling in a course
          </p>
          <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
            <Link to="/dashboard/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {coursesWithDuration.map((course) => {
        const progress = course.totalLessons > 0 
          ? Math.round((course.lessonsCompleted / course.totalLessons) * 100) 
          : 0;

        return (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={course.image || '/placeholder.svg'}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Play className="h-4 w-4 text-brand-purple" />
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-brand-purple transition-colors duration-200">
                {course.title}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration ? `${course.duration} months` : 'Duration not specified'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Live</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-800">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{course.lessonsCompleted} of {course.totalLessons} lessons</span>
                </div>
              </div>

              <Button asChild className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white">
                <Link to={`/dashboard/course/${course.id}`}>
                  {progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PurchasedCoursesSection;
