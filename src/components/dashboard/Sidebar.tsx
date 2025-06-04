import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Award, ChevronLeft, ChevronRight, ClipboardList, HelpCircle, BookOpen, FileText, Lock } from 'lucide-react';
import { checkUserPurchasedCoursesCount } from '@/services/coursePurchaseService';
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
  disabled?: boolean;
}
const SidebarItem = ({
  icon,
  label,
  to,
  isActive,
  isCollapsed,
  disabled = false
}: SidebarItemProps) => {
  const content = <div className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-purple text-white' : disabled ? 'text-gray-400 hover:bg-gray-50 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'} ${isCollapsed ? 'justify-center' : ''}`}>
      <div className="flex-shrink-0">{icon}</div>
      {!isCollapsed && <span className="ml-3">{label}</span>}
      {!isCollapsed && disabled && <Lock className="ml-auto h-4 w-4" />}
    </div>;
  if (disabled) {
    return <div className="relative group">
        {content}
        <div className="absolute left-full ml-2 top-0 z-50 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          Purchase 2 courses to unlock
        </div>
      </div>;
  }
  return <Link to={to}>{content}</Link>;
};
const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [purchasedCoursesCount, setPurchasedCoursesCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isPathActive = (path: string) => {
    return location.pathname === path;
  };
  useEffect(() => {
    const fetchPurchasedCoursesCount = async () => {
      try {
        const count = await checkUserPurchasedCoursesCount();
        console.log("Purchased courses count:", count);
        setPurchasedCoursesCount(count);
      } catch (error) {
        console.error("Failed to fetch purchased courses count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch purchased course count on initial load and whenever location changes
    // This ensures the sidebar updates when user completes a purchase
    fetchPurchasedCoursesCount();
  }, [location.pathname]);
  const hasRequiredCourses = purchasedCoursesCount !== null && purchasedCoursesCount >= 2;
  const navigation = [{
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    to: '/dashboard',
    disabled: !hasRequiredCourses
  }, {
    label: 'My Courses',
    icon: <BookOpen size={20} />,
    to: '/dashboard/my-courses',
    disabled: false // Always enabled since it displays purchased courses
  }, {
    label: 'Courses',
    icon: <GraduationCap size={20} />,
    to: '/dashboard/courses',
    disabled: false // Always enabled
  }, {
    label: 'Projects',
    icon: <FileText size={20} />,
    to: '/dashboard/projects',
    disabled: !hasRequiredCourses
  }, {
    label: 'Achievements',
    icon: <Award size={20} />,
    to: '/dashboard/achievements',
    disabled: !hasRequiredCourses
  }];
  return <aside className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col overflow-hidden`}>
      {/* Sidebar header */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-200`}>
        {!isCollapsed && <Link to="/dashboard" className="flex items-center">
            <span className="font-bold text-brand-purple text-2xl">INTERNITY</span>
          </Link>}
        {isCollapsed && <Link to="/dashboard" className="flex items-center justify-center">
            <span className="text-xl font-bold text-brand-purple">IN</span>
          </Link>}
      </div>
      
      {/* Sidebar navigation - removed overflow-y-auto */}
      <div className="flex-1 p-4 space-y-1">
        {isLoading ?
      // Loading state
      Array.from({
        length: 6
      }).map((_, index) => <div key={`skeleton-${index}`} className="h-12 bg-gray-100 rounded-lg animate-pulse mb-2"></div>) : navigation.map(item => <SidebarItem key={item.to} icon={item.icon} label={item.label} to={item.to} isActive={isPathActive(item.to)} isCollapsed={isCollapsed} disabled={item.disabled} />)}
      </div>
      
      {/* Sidebar footer */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {/* Help Center - Moved to the bottom */}
        {!isCollapsed && <div className="bg-black rounded-lg p-4 text-white mb-4">
            <div className="relative">
              <div className="bg-purple-400 w-16 h-16 rounded-full absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-black" />
              </div>
            </div>
            <h3 className="text-xl text-center font-semibold mt-8 mb-2">Help Center</h3>
            <p className="text-gray-400 text-sm text-center mb-4">Have a problem? <br />Send us a message!</p>
            <Link to="/contact">
              <button className="w-full bg-white text-black py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                Go to help center
              </button>
            </Link>
          </div>}
        
        {/* Collapse button */}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="mt-4 w-full flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>;
};
export default Sidebar;