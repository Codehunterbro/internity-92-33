import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Clock, Search, Star, Users, ShoppingCart, Shield, RefreshCw } from 'lucide-react';
import { getAllCourses, Course } from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { checkUserPurchasedCoursesCount } from '@/services/coursePurchaseService';
import { getUserRegistrationStatus } from '@/services/studentRegistrationService';
import RegistrationForm from '@/components/registration/RegistrationForm';

// Course categories
const categories = ['All Courses', 'Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science', 'Machine Learning', 'Cloud Computing'];

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

  // Fetch courses on component mount
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
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [toast]);

  // Filter courses based on search query and selected category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.description.toLowerCase().includes(searchQuery.toLowerCase());
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
        priceINR: 3500,
        image: course.image || '/placeholder.svg'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Select Your Courses</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Select any 2 courses to begin your journey with Internity</p>
          </div>
          
          {/* Course selection info and register button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 w-full sm:w-auto">
              <ShoppingCart className="h-5 w-5 text-brand-purple mr-2" />
              <span className="font-medium text-sm sm:text-base">
                {selectedCourses.length}/2 courses selected
              </span>
            </div>
            
            <Button 
              onClick={() => setIsRegistrationOpen(true)} 
              disabled={selectedCourses.length !== 2 || hasPurchasedCourses || isAlreadyRegistered} 
              className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple/90 text-white px-6 py-3 rounded-lg font-medium text-sm sm:text-base min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Register Now
            </Button>
          </div>
        </div>
        
        {hasPurchasedCourses && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-green-700 font-medium text-sm sm:text-base">You have already registered for the required courses. Your application is pending.</p>
          </div>
        )}
        
        {!hasPurchasedCourses && (
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 shadow-xl">
            {/* Background decorative elements - Adjusted for mobile */}
            <div className="absolute top-0 right-0 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-white/10 rounded-full -translate-y-4 sm:-translate-y-8 translate-x-4 sm:translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 bg-white/10 rounded-full translate-y-2 sm:translate-y-4 -translate-x-2 sm:-translate-x-4"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
                    🚀 Start Your Tech Journey Today!
                  </h3>
                  <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                    You need to select and register for <span className="font-bold text-white">2 courses</span> to unlock all features. 
                    Other sections will be available after registration.
                  </p>
                </div>
              </div>
              
              {/* Risk-free guarantee section - Mobile optimized */}
              <div className="bg-white/15 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="bg-green-500 p-1.5 sm:p-2 rounded-full">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white text-center sm:text-left">
                    💯 100% RISK-FREE REGISTRATION
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-green-500/20 p-1.5 sm:p-2 rounded-full">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-200" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm sm:text-base">0% RISK</p>
                      <p className="text-blue-100 text-xs sm:text-sm">Complete safety guaranteed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-blue-500/20 p-1.5 sm:p-2 rounded-full">
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-blue-200" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm sm:text-base">FULL REFUND</p>
                      <p className="text-blue-100 text-xs sm:text-sm">If not selected for program</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-400/20 rounded-lg border border-yellow-300/30">
                  <p className="text-white font-bold text-center text-xs sm:text-sm lg:text-base">
                    ⚡ <span className="text-yellow-200">GUARANTEED:</span> If you're not selected for the internship program, 
                    <span className="text-yellow-200 underline"> your complete payment will be refunded!</span> ⚡
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search and filters */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search for courses..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-10 w-full text-sm sm:text-base" 
            />
          </div>
        </div>
        
        {/* Categories */}
        <div className="w-full">
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 sm:gap-3 min-w-max px-1">
              {categories.map(category => (
                <button 
                  key={category} 
                  onClick={() => setSelectedCategory(category)} 
                  className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-200 ${
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
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base">Loading courses...</p>
          </div>
        )}
        
        {/* Courses grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredCourses.map(course => {
              const isCourseSelected = selectedCourses.some(c => c.id === String(course.id));
              return (
                <Card key={course.id} className={`overflow-hidden transition-shadow h-full flex flex-col cursor-pointer hover:shadow-md ${isCourseSelected ? 'border-2 border-brand-purple shadow-md' : ''}`} onClick={() => navigate(`/dashboard/courses/${course.id}`)}>
                  <div className="relative">
                    <img src={course.image || '/placeholder.svg'} alt={course.title} className="w-full h-32 sm:h-40 lg:h-48 object-cover" />
                    <Button 
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCourseSelection(course);
                      }} 
                      variant={isCourseSelected ? "destructive" : "secondary"} 
                      size="sm" 
                      className={`absolute top-2 right-2 text-xs sm:text-sm ${!isCourseSelected && hasReachedLimit ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      disabled={!isCourseSelected && hasReachedLimit}
                    >
                      {isCourseSelected ? 'Remove' : 'Select'}
                    </Button>
                  </div>
                  
                  <CardContent className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                      {course.tags?.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                          {tag}
                        </span>
                      ))}
                      {course.tags && course.tags.length > 2 && (
                        <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                          +{course.tags.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 hover:text-brand-purple transition-colors line-clamp-2">{course.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs sm:text-sm mt-auto">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{course.rating || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mr-1" />
                        <span>{course.students?.toLocaleString() || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mr-1" />
                        <span>{course.duration || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center border-t pt-3 sm:pt-4 mt-auto">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple text-xs font-bold">
                        {course.instructor?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground truncate">{course.instructorRole || "Instructor"}</p>
                      </div>
                      <div className="ml-2 text-brand-purple font-bold text-sm sm:text-base">
                        ₹3,500
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
          <div className="text-center py-8 sm:py-12">
            <BookOpen className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium">No courses found</h3>
            <p className="mt-1 text-muted-foreground text-sm sm:text-base">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
      
      {/* Registration form dialog */}
      <RegistrationForm isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
    </DashboardLayout>
  );
};

export default Courses;
