import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Clock, Search, Star, Users, ShoppingCart } from 'lucide-react';
import { getAllCourses, Course } from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { checkUserPurchasedCoursesCount } from '@/services/coursePurchaseService';
import { getUserRegistrationStatus } from '@/services/studentRegistrationService';
import RegistrationForm from '@/components/registration/RegistrationForm';

// Course categories
const categories = [
 'All Courses',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'Machine Learning',

  'Cloud Computing'
];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPurchasedCourses, setHasPurchasedCourses] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const navigate = useNavigate();
  
  const { toast } = useToast();
  const { selectedCourses, addCourse, removeCourse, hasReachedLimit } = useCart();
  
  // Check if user has purchased courses on component mount
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const count = await checkUserPurchasedCoursesCount();
        setHasPurchasedCourses(count >= 2);
        
        const { isRegistered } = await getUserRegistrationStatus();
        setIsAlreadyRegistered(isRegistered);
      } catch (error) {
        console.error("Failed to check user status:", error);
      }
    };
    
    checkUserStatus();
  }, []);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await getAllCourses();
        setCourses(coursesData);
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

  // Filter courses based on search query and selected category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Courses' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle course selection toggle
  const handleCourseSelection = (course: Course) => {
    const isCourseSelected = selectedCourses.some(c => c.id === String(course.id));
    
    if (isCourseSelected) {
      removeCourse(String(course.id));
    } else {
      addCourse({
        id: String(course.id),
        title: course.title,
        price: course.price,
        priceINR: course.priceINR || Math.round(course.price * 83),
        image: course.image || '/placeholder.svg',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Select Your Courses</h1>
            <p className="text-muted-foreground">Select any 2 courses to begin your journey with Internity</p>
          </div>
          
          {/* Course selection info and register button */}
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
              <ShoppingCart className="h-5 w-5 text-brand-purple mr-2" />
              <span className="font-medium">
                {selectedCourses.length}/2 courses selected
              </span>
            </div>
            
            <Button
              onClick={() => setIsRegistrationOpen(true)}
              disabled={selectedCourses.length !== 2 || hasPurchasedCourses || isAlreadyRegistered}
              className="bg-brand-purple hover:bg-brand-purple/90"
            >
              Register Now
            </Button>
          </div>
        </div>
        
        {hasPurchasedCourses && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 font-medium">
              You have already registered for the required courses. Explore the other sections from the sidebar!
            </p>
          </div>
        )}
        
        {!hasPurchasedCourses && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700 font-medium">
              You need to select and register for 2 courses to unlock all features. Other sections will be available after registration.
            </p>
          </div>
        )}
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex items-center justify-center w-full">
          <div className="w-full max-w-6xl overflow-x-auto no-scrollbar">
            <div className="flex flex-wrap justify-center gap-3 py-2 px-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-brand-purple text-white shadow-md scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-muted-foreground">Loading courses...</p>
          </div>
        )}
        
        {/* Courses grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const isCourseSelected = selectedCourses.some(c => c.id === String(course.id));
              
              return (
                <Card 
                  key={course.id} 
                  className={`overflow-hidden transition-shadow h-full flex flex-col cursor-pointer hover:shadow-md ${
                    isCourseSelected 
                      ? 'border-2 border-brand-purple shadow-md' 
                      : ''
                  }`}
                  onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                >
                  <div className="relative">
                    <img 
                      src={course.image || '/placeholder.svg'} 
                      alt={course.title} 
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCourseSelection(course);
                      }}
                      variant={isCourseSelected ? "destructive" : "secondary"}
                      size="sm"
                      className={`absolute top-2 right-2 ${
                        (!isCourseSelected && hasReachedLimit) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!isCourseSelected && hasReachedLimit}
                    >
                      {isCourseSelected ? 'Remove' : 'Select'}
                    </Button>
                  </div>
                  
                  <CardContent className="p-5 flex-1 flex flex-col">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.tags?.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {course.tags && course.tags.length > 2 && (
                        <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                          +{course.tags.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 hover:text-brand-purple transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-4 text-sm mt-auto">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{course.rating || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-muted-foreground mr-1" />
                        <span>{course.students?.toLocaleString() || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                        <span>{course.duration || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center border-t pt-4 mt-auto">
                      <div className="w-8 h-8 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple text-xs font-bold">
                        {course.instructor?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">{course.instructorRole || "Instructor"}</p>
                      </div>
                      <div className="ml-auto text-brand-purple font-bold">
                        ₹{course.priceINR?.toLocaleString('en-IN') || "N/A"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* No courses found message */}
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-4 text-lg font-medium">No courses found</h3>
            <p className="mt-1 text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
      
      {/* Registration form dialog */}
      <RegistrationForm
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Courses;
