
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Bell, Filter, BookOpen, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'course' | 'assignment' | 'quiz' | 'system' | 'event';
  isRead: boolean;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    setIsLoading(true);

    try {
      // In the future, this would fetch real notifications from Supabase
      // For now, we'll use the dummy data with some modifications
      
      // This is where you would fetch from the database once notifications are implemented
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false });

      // if (error) throw error;
      
      // Simulate fetched data
      setTimeout(() => {
        setNotifications([
          {
            id: '1',
            title: 'New Course Available',
            description: 'Web Development with React and TypeScript is now available',
            time: '2 hours ago',
            type: 'course',
            isRead: false
          },
          {
            id: '2',
            title: 'Assignment Due',
            description: 'Your assignment for Web Development is due tomorrow',
            time: '1 day ago',
            type: 'assignment',
            isRead: false
          },
          {
            id: '3',
            title: 'Quiz Results',
            description: 'Your recent HTML Fundamentals quiz results are now available',
            time: '2 days ago',
            type: 'quiz',
            isRead: true
          },
          {
            id: '4',
            title: 'Upcoming Webinar',
            description: 'Join our live session on Machine Learning this Friday',
            time: '3 days ago',
            type: 'event',
            isRead: false
          },
          {
            id: '5',
            title: 'Course Milestone',
            description: 'You\'ve completed 50% of the Python course',
            time: '4 days ago',
            type: 'course',
            isRead: true
          },
          {
            id: '6',
            title: 'New Resource Added',
            description: 'Additional study materials for Web Development have been added',
            time: '5 days ago',
            type: 'course',
            isRead: true
          },
          {
            id: '7',
            title: 'Discussion Forum Update',
            description: 'Your question has received 3 new responses',
            time: '1 week ago',
            type: 'system',
            isRead: true
          },
          {
            id: '8',
            title: 'Certificate Generated',
            description: 'Your JavaScript Basics certificate is ready to download',
            time: '1 week ago',
            type: 'system',
            isRead: true
          },
          {
            id: '9',
            title: 'New Course Recommendation',
            description: 'Based on your interests: Advanced Data Structures',
            time: '1 week ago',
            type: 'course',
            isRead: true
          },
          {
            id: '10',
            title: 'Mentor Session Available',
            description: 'Book your one-on-one session with industry experts',
            time: '2 weeks ago',
            type: 'event',
            isRead: true
          }
        ]);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (id: string) => {
    // In the future, update the notification in Supabase
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const filteredNotifications = filter 
    ? notifications.filter(notification => notification.type === filter)
    : notifications;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'assignment':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'quiz':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="text-purple-500 h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <DialogTitle className="text-lg font-semibold">Notifications</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Filter 
                className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                onClick={() => setFilter(filter ? null : 'course')}
              />
              <div className="absolute right-0 mt-1 w-40 bg-white shadow-md rounded-md overflow-hidden hidden group-hover:block z-10">
                <div 
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${!filter ? 'bg-purple-50 text-purple-700' : ''}`}
                  onClick={() => setFilter(null)}
                >
                  All Notifications
                </div>
                <div 
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${filter === 'course' ? 'bg-purple-50 text-purple-700' : ''}`}
                  onClick={() => setFilter('course')}
                >
                  Course Updates
                </div>
                <div 
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${filter === 'assignment' ? 'bg-purple-50 text-purple-700' : ''}`}
                  onClick={() => setFilter('assignment')}
                >
                  Assignments
                </div>
                <div 
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${filter === 'quiz' ? 'bg-purple-50 text-purple-700' : ''}`}
                  onClick={() => setFilter('quiz')}
                >
                  Quizzes
                </div>
                <div 
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${filter === 'event' ? 'bg-purple-50 text-purple-700' : ''}`}
                  onClick={() => setFilter('event')}
                >
                  Events
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="font-medium">Results ({filteredNotifications.length})</span>
            {filter && (
              <button 
                className="text-sm text-purple-600 hover:text-purple-800"
                onClick={() => setFilter(null)}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
        
        <ScrollArea className="max-h-[70vh]">
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border-b border-gray-100 ${!notification.isRead ? 'bg-purple-50' : ''}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-500">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'} mb-0.5`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{notification.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xs text-gray-400">
                          {notification.time}
                        </div>
                        <div className="mt-1">
                          {notification.type === 'event' && (
                            <div className="flex items-center text-xs text-purple-600">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Upcoming</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No notifications found</p>
                {filter && (
                  <button 
                    className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                    onClick={() => setFilter(null)}
                  >
                    View all notifications
                  </button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
