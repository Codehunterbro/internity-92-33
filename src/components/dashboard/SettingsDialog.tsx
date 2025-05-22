
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X, ChevronRight, User, Bell, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import UserProfileDialog from './UserProfileDialog';
import SubscriptionsDialog from './SubscriptionsDialog';
import HelpFAQDialog from './HelpFAQDialog';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [showHelpFAQ, setShowHelpFAQ] = useState(false);
  
  const menuItems = [
    { icon: <User size={18} />, label: 'Profile', onClick: () => setShowProfile(true) },
    { icon: <Bell size={18} />, label: 'Notifications', onClick: () => {} },
    { icon: <CreditCard size={18} />, label: 'Manage Subscriptions & Payments', onClick: () => setShowSubscriptions(true) },
    { icon: <HelpCircle size={18} />, label: 'Help/FAQ', onClick: () => setShowHelpFAQ(true) },
  ];

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md p-0 gap-0 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
            </div>
            <div 
              className="h-4 w-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 cursor-pointer"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </div>
          </div>
          
          <div>
            {menuItems.map((item, idx) => (
              <div key={idx} className="border-b border-gray-100">
                <button
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50"
                  onClick={() => {
                    item.onClick();
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-700">{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="p-6 flex justify-center">
            <button
              className="flex items-center justify-center gap-2 text-purple-600 font-medium"
              onClick={handleLogout}
            >
              <LogOut size={18} className="text-purple-600" />
              <span>Logout</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <UserProfileDialog 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
      
      <SubscriptionsDialog 
        isOpen={showSubscriptions} 
        onClose={() => setShowSubscriptions(false)} 
      />
      
      <HelpFAQDialog 
        isOpen={showHelpFAQ} 
        onClose={() => setShowHelpFAQ(false)} 
      />
    </>
  );
};

export default SettingsDialog;
