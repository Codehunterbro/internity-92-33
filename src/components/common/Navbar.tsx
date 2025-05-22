
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch profile picture when user changes
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_picture')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfilePicture(data.profile_picture);
        }
      }
    };
    
    fetchProfilePicture();
  }, [user]);

  const getInitials = (name: string) => {
    return name?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'U';
  };

  const userInitials = user?.user_metadata?.full_name 
    ? getInitials(user.user_metadata.full_name)
    : 'U';

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 py-4 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold text-brand-purple">Internity</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link ${!isScrolled ? 'text-white' : ''} ${isActive('/') ? 'active-nav-link' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className={`nav-link ${!isScrolled ? 'text-white' : ''} ${isActive('/courses') ? 'active-nav-link' : ''}`}
            >
              Courses
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${!isScrolled ? 'text-white' : ''} ${isActive('/about') ? 'active-nav-link' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${!isScrolled ? 'text-white' : ''} ${isActive('/contact') ? 'active-nav-link' : ''}`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-10 w-10 bg-brand-purple text-white cursor-pointer">
                    <AvatarImage src={profilePicture || undefined} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/my-courses">My Courses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="rounded-xl">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-brand-purple hover:bg-brand-purple-hover rounded-xl">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${!isScrolled ? 'text-white' : 'text-foreground'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${!isScrolled ? 'text-white' : 'text-foreground'}`} />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`py-2 ${isActive('/') ? 'text-brand-purple font-medium' : 'text-foreground/80'}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className={`py-2 ${isActive('/courses') ? 'text-brand-purple font-medium' : 'text-foreground/80'}`}
              onClick={closeMenu}
            >
              Courses
            </Link>
            <Link 
              to="/about" 
              className={`py-2 ${isActive('/about') ? 'text-brand-purple font-medium' : 'text-foreground/80'}`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`py-2 ${isActive('/contact') ? 'text-brand-purple font-medium' : 'text-foreground/80'}`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            <div className="pt-4 flex flex-col space-y-3">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={closeMenu} className="py-2">
                    Dashboard
                  </Link>
                  <Link to="/dashboard/my-courses" onClick={closeMenu} className="py-2">
                    My Courses
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="text-left py-2 text-red-600"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full rounded-xl">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <Button className="w-full bg-brand-purple hover:bg-brand-purple-hover rounded-xl">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
