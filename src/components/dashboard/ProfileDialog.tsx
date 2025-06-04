
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import ProfileEditSection from './ProfileEditSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, ChevronRight } from 'lucide-react';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import { useNavigate } from 'react-router-dom';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate?: () => void;
}

interface ProfileData {
  full_name?: string;
  profile_picture?: string | null;
}

const ProfileDialog = ({ isOpen, onClose, onProfileUpdate }: ProfileDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { user } = useAuth();
  const { purchasedCourses } = usePurchasedCourses();
  const navigate = useNavigate();

  // IMPORTANT: Reset editing state to false when dialog is opened
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    };

    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

  const handleCloseEdit = () => {
    setIsEditing(false);
    // Re-fetch profile data when edit mode is closed
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data);
            if (onProfileUpdate) {
              onProfileUpdate();
            }
          }
        });
    }
  };

  const navigateToLesson = (courseId: string) => {
    onClose(); // Close the dialog first
    navigate(`/learn/course/${courseId}`); // Navigate to the course lectures
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] max-h-[85vh] overflow-y-auto">
        {user && profile && !isEditing ? (
          <div className="space-y-4 sm:space-y-6 p-2 sm:p-6">
            <div className="text-center">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold">Profile</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 mb-3 sm:mb-4">
                <Avatar className="w-16 h-16 sm:w-24 sm:h-24">
                  <AvatarImage src={profile.profile_picture || undefined} />
                  <AvatarFallback>{profile.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-lg sm:text-xl font-medium">{profile.full_name || user.email}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            {/* Course Progress Statistics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-y">
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-semibold">{purchasedCourses.filter(c => 
                  (c.lessonsCompleted / c.totalLessons) < 0.1).length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-semibold">{purchasedCourses.filter(c => 
                  (c.lessonsCompleted / c.totalLessons) >= 0.1 && 
                  (c.lessonsCompleted / c.totalLessons) < 1).length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-semibold">{purchasedCourses.filter(c => 
                  (c.lessonsCompleted / c.totalLessons) === 1).length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            {/* Course List */}
            <div className="space-y-3 sm:space-y-4">
              {purchasedCourses.map((course) => {
                const progress = (course.lessonsCompleted / course.totalLessons) * 100;
                return (
                  <div 
                    key={course.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => navigateToLesson(course.id)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                        <span className="text-brand-purple font-semibold text-xs sm:text-sm">
                          {course.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm">{course.title}</h4>
                        <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : user ? (
          <ProfileEditSection 
            user={user} 
            currentName={profile?.full_name || user.email || ''} 
            currentPicture={profile?.profile_picture}
            onClose={handleCloseEdit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
