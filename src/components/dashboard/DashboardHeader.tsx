
import { useState, useEffect } from 'react';
import { Menu, Bell, User, ShoppingCart, X, MoreVertical, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationDialog from './NotificationDialog';
import ProfileDialog from './ProfileDialog';
import SettingsDialog from './SettingsDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

const DashboardHeader = ({
  onToggleSidebar
}: DashboardHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const userDisplayName = user?.user_metadata?.full_name || user?.email || 'User';
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    selectedCourses,
    removeCourse
  } = useCart();
  const totalAmount = selectedCourses.reduce((sum, course) => sum + course.priceINR, 0);
  const discount = 1000;
  const finalAmount = totalAmount - discount;

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.id) {
        const {
          data,
          error
        } = await supabase.from('profiles').select('profile_picture').eq('id', user.id).single();
        if (!error && data) {
          setProfilePicture(data.profile_picture);
        }
      }
    };
    fetchProfilePicture();
  }, [user]);

  return <header className="bg-white border-b flex items-center justify-between px-4 md:px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-3 md:mr-4 lg:hidden" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5 md:h-5 md:w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop cart and user controls */}
        <div className="hidden md:flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6 md:h-5 md:w-5" />
                {selectedCourses.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {selectedCourses.length}
                  </span>}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:max-w-[400px]">
              <SheetHeader>
                <SheetTitle>Selected Courses</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {selectedCourses.map(course => <div key={course.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <img src={course.image} alt={course.title} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{course.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">₹{course.priceINR.toLocaleString('en-IN')}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)} className="text-gray-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>)}
                
                {selectedCourses.length > 0 ? <div className="space-y-4 mt-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">- Registration Fees </span>
                        <span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total</span>
                        <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-brand-purple hover:bg-brand-purple/90" onClick={() => navigate('/checkout')}>
                      Proceed to Checkout
                    </Button>
                  </div> : <div className="text-center py-6 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Your cart is empty</p>
                    <Button variant="link" className="mt-2 text-brand-purple" onClick={() => navigate('/dashboard/courses')}>
                      Browse Courses
                    </Button>
                  </div>}
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)}>
            <Bell className="h-6 w-6 md:h-5 md:w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="flex items-center gap-2" onClick={() => setShowProfile(true)}>
              <Avatar className="w-9 h-9 md:w-8 md:h-8">
                <AvatarImage src={profilePicture || undefined} />
                <AvatarFallback className="bg-brand-purple/10 text-brand-purple font-bold text-xs">
                  {userDisplayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{userDisplayName}</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile navigation - improved design */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative p-2" onClick={() => setShowNotifications(true)}>
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
              <div className="px-3 py-2 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profilePicture || undefined} />
                    <AvatarFallback className="bg-brand-purple/10 text-brand-purple font-bold text-xs">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[140px]">{userDisplayName}</span>
                    <span className="text-xs text-muted-foreground">Student</span>
                  </div>
                </div>
              </div>
              
              <DropdownMenuItem onClick={() => setShowProfile(true)} className="cursor-pointer py-3">
                <User className="h-4 w-4 mr-3" />
                <span>View Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Sheet>
                  <SheetTrigger className="w-full flex items-center cursor-pointer py-3 px-2 hover:bg-accent rounded-sm">
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    <span>Cart</span>
                    {selectedCourses.length > 0 && (
                      <span className="ml-auto bg-brand-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedCourses.length}
                      </span>
                    )}
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:max-w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Selected Courses</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {selectedCourses.map(course => <div key={course.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <img src={course.image} alt={course.title} className="w-20 h-20 object-cover rounded-md" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{course.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">₹{course.priceINR.toLocaleString('en-IN')}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)} className="text-gray-400 hover:text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>)}
                      
                      {selectedCourses.length > 0 ? <div className="space-y-4 mt-6">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">- Registration Fees </span>
                              <span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t">
                              <span>Total</span>
                              <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                          <Button className="w-full bg-brand-purple hover:bg-brand-purple/90" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                          </Button>
                        </div> : <div className="text-center py-6 text-muted-foreground">
                          <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p>Your cart is empty</p>
                          <Button variant="link" className="mt-2 text-brand-purple" onClick={() => navigate('/dashboard/courses')}>
                            Browse Courses
                          </Button>
                        </div>}
                    </div>
                  </SheetContent>
                </Sheet>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer py-3">
                <LogOut className="h-4 w-4 mr-3" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <NotificationDialog isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      
      <ProfileDialog isOpen={showProfile} onClose={() => setShowProfile(false)} onProfileUpdate={() => {
      if (user?.id) {
        supabase.from('profiles').select('profile_picture').eq('id', user.id).single().then(({
          data
        }) => {
          if (data) setProfilePicture(data.profile_picture);
        });
      }
    }} />
      
      <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </header>;
};

export default DashboardHeader;
