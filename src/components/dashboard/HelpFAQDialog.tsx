
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface HelpFAQDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpFAQDialog: React.FC<HelpFAQDialogProps> = ({ isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState<string | null>('general');
  
  const faqSections = [
    {
      id: 'general',
      title: 'General Questions',
      questions: [
        {
          q: 'How do I get started with a course?',
          a: 'Simply browse our course catalog, select a course you\'re interested in, and click the "Enroll" button. Once enrolled, you can access the course content immediately from your dashboard.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, PayPal, and bank transfers. Payment processing is secure and encrypted.'
        },
        {
          q: 'Can I access courses on mobile devices?',
          a: 'Yes! Our platform is fully responsive and works on all devices including smartphones and tablets.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      questions: [
        {
          q: 'What should I do if a video isn\'t playing?',
          a: 'First, check your internet connection. If the problem persists, try clearing your browser cache or using a different browser. If issues continue, contact our support team.'
        },
        {
          q: 'How do I reset my password?',
          a: 'Click on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you instructions to reset your password.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Subscriptions',
      questions: [
        {
          q: 'How do I cancel my subscription?',
          a: 'You can cancel your subscription at any time from your account settings under "Manage Subscriptions & Payments". Your access will continue until the end of your current billing period.'
        },
        {
          q: 'Can I get a refund?',
          a: 'We offer a 30-day money-back guarantee for all our courses. Contact our support team with your purchase details to process a refund.'
        }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Help & FAQ</DialogTitle>
            <button 
              className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search help articles..."
              className="pl-10"
            />
          </div>

          {/* FAQ Sections */}
          <div className="space-y-4">
            {faqSections.map((section) => (
              <div key={section.id} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                >
                  <h3 className="font-medium">{section.title}</h3>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      openSection === section.id ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {openSection === section.id && (
                  <div className="divide-y">
                    {section.questions.map((item, idx) => (
                      <div key={idx} className="p-4">
                        <h4 className="font-medium mb-2">{item.q}</h4>
                        <p className="text-sm text-gray-600">{item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h4 className="font-medium mb-2">Still need help?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Our support team is ready to assist you
            </p>
            <button className="text-purple-600 font-medium hover:text-purple-700">
              Contact Support
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpFAQDialog;
