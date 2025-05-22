import { Check, BookOpen, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Course } from '@/services/courseService';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CourseDetailDialogProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

// Define a type for curriculum structure
interface CurriculumSection {
  title: string;
  lessons: {
    title: string;
  }[];
}

const CourseDetailDialog = ({
  course,
  isOpen,
  onClose,
  onPurchase
}: CourseDetailDialogProps) => {
  const [curriculum, setCurriculum] = useState<CurriculumSection[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (course && isOpen) {
      setIsLoading(true);

      // Try to fetch curriculum data directly from Supabase for this course
      const fetchCurriculumData = async () => {
        try {
          const {
            data,
            error
          } = await supabase.from('courses').select('course_curriculum').eq('id', course.id).single();
          if (error) {
            console.error('Error fetching curriculum data:', error);
            processCurriculumData(course.curriculum);
            return;
          }
          if (data && data.course_curriculum) {
            console.log("Fetched curriculum data:", data.course_curriculum);
            processCurriculumData(data.course_curriculum);
          } else {
            console.log("Using course curriculum data:", course.curriculum);
            processCurriculumData(course.curriculum);
          }
        } catch (err) {
          console.error('Failed to fetch curriculum:', err);
          processCurriculumData(course.curriculum);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCurriculumData();
    }
  }, [course, isOpen]);
  
  const processCurriculumData = (curriculumData: any) => {
    console.log("Processing curriculum data:", curriculumData);
    let processedCurriculum: CurriculumSection[] = [];
    try {
      // Handle the format shown in the image (object with named sections like "Introduction")
      if (curriculumData && typeof curriculumData === 'object' && !Array.isArray(curriculumData)) {
        processedCurriculum = Object.entries(curriculumData).map(([sectionName, lessonArray]) => {
          if (Array.isArray(lessonArray)) {
            return {
              title: sectionName,
              lessons: lessonArray.map((lesson: any) => ({
                title: lesson.title || "Unnamed Lesson"
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
            title: lesson.title || "Unnamed Lesson"
          })) : []
        }));
      }
      // Check if curriculum has a sections array property
      else if (curriculumData && curriculumData.sections && Array.isArray(curriculumData.sections)) {
        processedCurriculum = curriculumData.sections.map((section: any) => ({
          title: section.title || "Unnamed Section",
          lessons: Array.isArray(section.lessons) ? section.lessons.map((lesson: any) => ({
            title: lesson.title || "Unnamed Lesson"
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
              title: lesson.title || "Unnamed Lesson"
            })) : []
          }));
        } else {
          // Default structure if we can't extract valid sections
          processedCurriculum = [{
            title: "Course Content",
            lessons: [{
              title: "Introduction to the course"
            }]
          }];
        }
      } else {
        // Default curriculum if none exists
        processedCurriculum = [{
          title: "Getting Started",
          lessons: [{
            title: "Course Overview"
          }, {
            title: "Setting Up Your Environment"
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
          title: "Course Overview"
        }, {
          title: "Setting Up Your Environment"
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
  
  if (!course) return null;

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

  // Use the course_features if available, otherwise fall back to the features array
  const courseFeatures = course.course_features || course.features || [
    "24/7 access to course materials", 
    "Certificate upon completion", 
    "Personal mentor support", 
    "Access to exclusive tech community"
  ];
  
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{course.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Course Overview</h3>
            <p className="text-muted-foreground whitespace-pre-line">{course.long_description || course.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-brand-purple mr-2" />
                <div>
                  <p className="text-sm font-medium">{course.students?.toLocaleString() || "0"}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-brand-purple mr-2" />
                <div>
                  <p className="text-sm font-medium">{formatDuration(course.duration)}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
              
            </CardHeader>
            <CardContent>
              {isLoading ? <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
                </div> : <div className="space-y-4">
                  {curriculum && curriculum.length > 0 ? curriculum.map((section, index) => <div key={index} className="border rounded-lg">
                        <div className="bg-gray-50 p-4 font-medium border-b">
                          {section?.title || `Section ${index + 1}`}
                        </div>
                        <div className="p-4 space-y-3">
                          {section && section.lessons && Array.isArray(section.lessons) ? section.lessons.map((lesson, lessonIndex) => <div key={lessonIndex} className="flex items-center justify-between py-2">
                                <div className="flex items-center">
                                  <BookOpen className="w-5 h-5 text-brand-purple mr-3" />
                                  <span>{lesson.title}</span>
                                </div>
                              </div>) : <div className="py-2 text-muted-foreground">No lesson details available</div>}
                        </div>
                      </div>) : <div className="text-center py-8 text-muted-foreground">
                      No curriculum information available for this course
                    </div>}
                </div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple text-xl font-bold mr-4">
                  {course.instructor?.split(' ').map(n => n?.[0] || '').join('') || 'IN'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{course.instructor || "Instructor"}</h3>
                  <p className="text-muted-foreground">{course.instructorRole || "Instructor"}</p>
                </div>
              </div>
              <p className="text-muted-foreground">{course.instructorBio || `Expert instructor with extensive experience in ${course.category || "this field"}.`}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Course Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {courseFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button className="w-full py-6 text-lg" onClick={onPurchase}>
            Enroll Now for ₹{course.priceINR?.toLocaleString('en-IN') || (course.price * 83).toLocaleString('en-IN')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};

export default CourseDetailDialog;