
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { purchasedCourses } = usePurchasedCourses();
  const [fullName, setFullName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate total progress across all courses
  const totalProgress = purchasedCourses.length > 0
    ? purchasedCourses.reduce((acc, course) => acc + (course.lessonsCompleted / course.totalLessons) * 100, 0) / purchasedCourses.length
    : 0;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // First try to get the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
          
        if (profileData && profileData.full_name) {
          setFullName(profileData.full_name);
        } else {
          // If no profile or no full_name, use the user's metadata or email
          setFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchUserProfile();
    }
  }, [user, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Profile</DialogTitle>
            <button 
              className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="text-center">
            <div className="h-24 w-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-purple-600">
                {fullName?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-lg">
              {isLoading ? 'Loading...' : fullName}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Progress Overview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Learning Progress</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{Math.round(totalProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-semibold text-purple-600">
                    {purchasedCourses.length}
                  </p>
                  <p className="text-sm text-gray-500">Enrolled Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-purple-600">
                    {purchasedCourses.reduce((acc, course) => acc + course.lessonsCompleted, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Lessons Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div>
            <h4 className="font-medium mb-3">Course Progress</h4>
            {purchasedCourses.length > 0 ? (
              <div className="space-y-4">
                {purchasedCourses.map((course) => (
                  <div key={course.id} className="bg-white border rounded-lg p-4">
                    <h5 className="font-medium mb-2">{course.title}</h5>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{course.lessonsCompleted} of {course.totalLessons} lessons</span>
                      <span>{Math.round((course.lessonsCompleted / course.totalLessons) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(course.lessonsCompleted / course.totalLessons) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No courses enrolled yet</p>
                <Button asChild variant="link" className="mt-2 text-purple-600">
                  <Link to="/dashboard/courses">Browse Courses</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
