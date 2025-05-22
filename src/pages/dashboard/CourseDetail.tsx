import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Check, Clock, PlayCircle, ShoppingCart, Star, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { getCourseById, Course } from '@/services/courseService';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';

const CourseDetail = () => {
  const {
    courseId
  } = useParams<{
    courseId: string;
  }>();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    selectedCourses,
    addCourse,
    removeCourse,
    isCheckoutEnabled,
    checkoutAvailableAfter
  } = useCart();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [isPurchased, setIsPurchased] = useState(false);
  const { purchasedCourses } = usePurchasedCourses();
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        setIsLoading(true);
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        
        // Check if course is already purchased
        if (purchasedCourses && purchasedCourses.some(pc => pc.id === courseId)) {
          setIsPurchased(true);
        }
        
        if (!courseData) {
          toast({
            title: "Error",
            description: "Course not found",
            variant: "destructive"
          });
        } else {
          // Process curriculum data
          processCurriculumData(courseData.curriculum);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, toast, purchasedCourses]);
  
  const processCurriculumData = (curriculumData: any) => {
    let processedCurriculum = [];
    try {
      // Handle the format shown in the image (object with named sections like "Introduction")
      if (curriculumData && typeof curriculumData === 'object' && !Array.isArray(curriculumData)) {
        processedCurriculum = Object.entries(curriculumData).map(([sectionName, lessonArray]) => {
          if (Array.isArray(lessonArray)) {
            return {
              title: sectionName,
              lessons: lessonArray.map((lesson: any) => ({
                title: lesson.title || "Unnamed Lesson",
                duration: lesson.duration || "N/A",
                type: lesson.type || "video"
              }))
            };
          }
          return {
            title: sectionName,
            lessons: []
          };
        });
      }
      // Check if curriculum is already an array
      else if (Array.isArray(curriculumData)) {
        // Ensure each section has the required properties
        processedCurriculum = curriculumData.map(section => ({
          title: section.title || "Unnamed Section",
          lessons: Array.isArray(section.lessons) ? section.lessons.map((lesson: any) => ({
            title: lesson.title || "Unnamed Lesson",
            duration: lesson.duration || "N/A",
            type: lesson.type || "video"
          })) : []
        }));
      }
      // Check if curriculum has a sections array property
      else if (curriculumData && curriculumData.sections && Array.isArray(curriculumData.sections)) {
        processedCurriculum = curriculumData.sections.map((section: any) => ({
          title: section.title || "Unnamed Section",
          lessons: Array.isArray(section.lessons) ? section.lessons.map((lesson: any) => ({
            title: lesson.title || "Unnamed Lesson",
            duration: lesson.duration || "N/A",
            type: lesson.type || "video"
          })) : []
        }));
      }
      // If curriculum is an object but doesn't have sections array
      else if (curriculumData && typeof curriculumData === 'object') {
        // Try to convert object to array if possible
        const possibleSections = Object.values(curriculumData);
        if (Array.isArray(possibleSections) && possibleSections.length > 0) {
          processedCurriculum = possibleSections.map((section: any) => ({
            title: section.title || "Unnamed Section",
            lessons: Array.isArray(section.lessons) ? section.lessons.map((lesson: any) => ({
              title: lesson.title || "Unnamed Lesson",
              duration: lesson.duration || "N/A",
              type: lesson.type || "video"
            })) : []
          }));
        } else {
          // Default structure if we can't extract valid sections
          processedCurriculum = [{
            title: "Course Content",
            lessons: [{
              title: "Introduction to the course",
              duration: "10 min",
              type: "video"
            }]
          }];
        }
      } else {
        // Default curriculum if none exists
        processedCurriculum = [{
          title: "Getting Started",
          lessons: [{
            title: "Course Overview",
            duration: "10 min",
            type: "video"
          }, {
            title: "Setting Up Your Environment",
            duration: "20 min",
            type: "video"
          }]
        }];
      }
      console.log("Processed curriculum:", processedCurriculum);
    } catch (error) {
      console.error("Error processing curriculum data:", error);
      // Fallback to a default curriculum
      processedCurriculum = [{
        title: "Getting Started",
        lessons: [{
          title: "Course Overview",
          duration: "10 min",
          type: "video"
        }, {
          title: "Setting Up Your Environment",
          duration: "20 min",
          type: "video"
        }]
      }];
    }

    // Calculate total lessons safely
    let lessonCount = 0;
    if (Array.isArray(processedCurriculum)) {
      lessonCount = processedCurriculum.reduce((total, section) => {
        // Ensure section has a lessons array before trying to access its length
        if (section && section.lessons && Array.isArray(section.lessons)) {
          return total + section.lessons.length;
        }
        return total;
      }, 0);
    }
    setCurriculum(processedCurriculum);
    setTotalLessons(lessonCount);
  };

  // Process course data for display
  const isInCart = selectedCourses.some(c => c.id === courseId);
  const handleAddToCart = () => {
    if (!course) return;
    if (isInCart) {
      removeCourse(course.id);
      toast({
        title: "Removed from selection",
        description: `${course.title} has been removed from your selected courses.`
      });
    } else {
      if (selectedCourses.length < 2) {
        addCourse({
          id: course.id,
          title: course.title,
          price: course.price,
          priceINR: course.priceINR || Math.round(course.price * 83),
          image: course.image
        });
        toast({
          title: "Added to selection",
          description: `${course.title} has been added to your selected courses.`
        });
      } else {
        toast({
          title: "Selection limit reached",
          description: "You can only select up to 2 courses. Please proceed to checkout or remove a course.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleCheckout = () => {
    if (!isCheckoutEnabled && checkoutAvailableAfter) {
      const now = new Date();
      if (now < checkoutAvailableAfter) {
        const formattedDate = checkoutAvailableAfter.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
        
        toast({
          title: "Checkout not available yet",
          description: `Checkout will be available after ${formattedDate}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    if (selectedCourses.length !== 2) {
      toast({
        title: "Select 2 courses",
        description: "You need to select exactly 2 courses to proceed to checkout.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/checkout');
  };
  
  // Function to extract YouTube video ID from course_introduction text
  const getYoutubeVideoId = (introText: string) => {
    if (!introText) return null;
    
    // Try to extract YouTube URL from the text
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = introText.match(youtubeRegex);
    
    return match ? match[1] : null;
  };
  
  const youtubeVideoId = course?.course_introduction ? getYoutubeVideoId(course.course_introduction) : null;

  if (isLoading) {
    return <DashboardLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading course details...</p>
        </div>
      </DashboardLayout>;
  }
  if (!course) {
    return <DashboardLayout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="text-muted-foreground mt-2">The course you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/dashboard/courses')} className="mt-4">
            Browse Courses
          </Button>
        </div>
      </DashboardLayout>;
  }

  // Format duration to clearly show months
  const formatDuration = (duration: string | null) => {
    if (!duration) return "N/A";

    // If it already contains "Month" or "Months", return as is
    if (duration.toLowerCase().includes("month")) {
      return duration;
    }

    // Try to extract a number if it might be just a number of months
    const monthMatch = duration.match(/^(\d+)$/);
    if (monthMatch) {
      const months = parseInt(monthMatch[1], 10);
      return `${months} Month${months !== 1 ? 's' : ''}`;
    }
    return duration;
  };

  // Process course data for display
  const courseFeatures = course.course_features || course.features || [
    "24/7 access to course materials", 
    "Certificate upon completion", 
    "Personal mentor support", 
    "Access to exclusive tech community"
  ];
  
  return <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Course header with image or YouTube embed */}
        <div className="relative h-64 rounded-xl overflow-hidden">
          {isPurchased && youtubeVideoId ? (
            <iframe 
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              className="w-full h-full"
              title={course.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <>
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" onError={e => {
                e.currentTarget.src = "/placeholder.svg";
              }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-end">
                <div className="p-8 text-white max-w-2xl">
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <p className="mb-4">{course.description}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span>{course.rating || "N/A"}</span>
                      <span className="text-white/70 ml-1">({course.reviews_count || 0} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-white/90 mr-1" />
                      <span>{course.students?.toLocaleString() || 0} students</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course details & curriculum */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course overview */}
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">
                  {course.long_description || course.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-brand-purple mr-3" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{formatDuration(course.duration)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-brand-purple mr-3" />
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">{course.category || "General"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-brand-purple mr-3" />
                    <div>
                      <p className="text-sm font-medium">Students</p>
                      <p className="text-sm text-muted-foreground">{course.students?.toLocaleString() || "0"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-brand-purple mr-3" />
                    <div>
                      <p className="text-sm font-medium">Rating</p>
                      <p className="text-sm text-muted-foreground">
                        {course.rating || "N/A"} ({course.reviews_count || 0} reviews)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Course curriculum */}
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {curriculum && curriculum.length > 0 ? curriculum.map((section, index) => <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 font-medium border-b">
                        {section.title}
                      </div>
                      <div className="p-4 space-y-3">
                        {section.lessons && Array.isArray(section.lessons) ? section.lessons.map((lesson, lessonIndex) => <div key={lessonIndex} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              {lesson.type === 'video' ? <PlayCircle className="w-5 h-5 text-brand-purple mr-3" /> : <BookOpen className="w-5 h-5 text-orange-500 mr-3" />}
                              <span>{lesson.title}</span>
                            </div>
                            {lesson.type !== 'video' && (
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            )}
                          </div>) : <div className="py-2 text-muted-foreground">No lesson details available</div>}
                      </div>
                    </div>) : <div className="text-center py-8 text-muted-foreground">
                      No curriculum information available for this course
                    </div>}
                </div>
              </CardContent>
            </Card>
            
            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple text-xl font-bold mr-4">
                    {course.instructor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{course.instructor}</h3>
                    <p className="text-muted-foreground">{course.instructorRole || "Instructor"}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{course.instructorBio || `Expert instructor with extensive experience in ${course.category || "this field"}.`}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Course sidebar/card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-4">₹{course.priceINR?.toLocaleString('en-IN') || (course.price * 83).toLocaleString('en-IN')}</h3>
                
                <div className="space-y-4 mb-6">
                  {isPurchased ? (
                    <Button 
                      className="w-full text-base py-6 bg-green-600 hover:bg-green-700"
                      onClick={() => navigate(`/learn/course/${course.id}`)}
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Open Course
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className={`w-full text-base py-6 ${isInCart ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-purple hover:bg-brand-purple-hover'}`} 
                        onClick={handleAddToCart}
                      >
                        {isInCart ? <>Remove from Selection</> : <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Selection
                          </>}
                      </Button>
                      
                      {selectedCourses.length > 0 && 
                        <Button 
                          variant="outline" 
                          className="w-full text-base py-6" 
                          onClick={handleCheckout}
                          disabled={selectedCourses.length !== 2 || (!isCheckoutEnabled && checkoutAvailableAfter && new Date() < checkoutAvailableAfter)}
                        >
                          Proceed to Checkout ({selectedCourses.length}/2)
                          {(!isCheckoutEnabled && checkoutAvailableAfter && new Date() < checkoutAvailableAfter) && (
                            <span className="text-xs block mt-1 text-amber-500">
                              Coming soon
                            </span>
                          )}
                        </Button>
                      }
                    </>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">This course includes:</h4>
                  <ul className="space-y-2">
                    {courseFeatures.map((feature, index) => <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>;
};

export default CourseDetail;