import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Users, Bookmark } from 'lucide-react';
import CourseDetailDialog from '@/components/courses/CourseDetailDialog';
import { Course, getAllCourses } from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';

const CourseCard = ({ course, onClick }: { course: Course, onClick: () => void }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
      {/* Course image */}
      <div className="aspect-video relative overflow-hidden">
        <div className={`image-wrapper ${isImageLoaded ? 'image-loaded' : 'image-loading'}`}>
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />
        </div>
        <div className="absolute top-4 right-4">
          <Bookmark className="w-6 h-6 text-white bg-brand-purple/80 p-1 rounded-full cursor-pointer hover:bg-brand-purple transition-colors" />
        </div>
      </div>
      
      {/* Course content */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {course.tags && course.tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs font-medium bg-secondary px-2 py-1 rounded-full text-brand-purple"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Title and description */}
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{course.description}</p>
        
        {/* Course meta */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-muted-foreground mr-1" />
            <span>{course.students?.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-muted-foreground mr-1" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        {/* Price and button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-brand-purple font-bold">₹3,500</p>
            <p className="text-xs text-muted-foreground">Full program access</p>
          </div>
          <button 
            onClick={onClick}
            className="btn-primary py-2 px-4 inline-flex items-center text-sm bg-brand-purple text-white rounded-lg hover:bg-brand-purple/90 transition-colors"
          >
            Details <ArrowRight className="ml-1 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await getAllCourses();
        setCourses(coursesData.slice(0, 3)); // Display only the first 3 courses
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('courses-section');
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  return (
    <section id="courses-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h6 className="text-sm font-semibold uppercase tracking-wider text-brand-purple mb-3">Featured Programs</h6>
            <h2 className="text-3xl md:text-4xl font-bold">Popular Courses</h2>
          </div>
          <Link 
            to="/courses" 
            className="inline-flex items-center text-brand-purple font-semibold hover:underline"
          >
            View All Courses <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
          </div>
        ) : (
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                onClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        )}

        <CourseDetailDialog
          course={selectedCourse}
          isOpen={selectedCourse !== null}
          onClose={() => setSelectedCourse(null)}
          onPurchase={() => {}}
        />
      </div>
    </section>
  );
};

export default CoursesSection;
