
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SubscriptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionsDialog: React.FC<SubscriptionsDialogProps> = ({ isOpen, onClose }) => {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      features: [
        'Access to basic courses',
        'Limited course materials',
        'Community support',
        'Monthly webinars'
      ],
      icon: Package,
      current: true
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      features: [
        'Access to all courses',
        'Downloadable resources',
        'Priority support',
        'Weekly live sessions',
        'Certification on completion'
      ],
      icon: Zap,
      popular: true
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Manage Subscriptions & Payments</DialogTitle>
            <button 
              className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Current Plan: Basic</h3>
            </div>
            <p className="text-sm text-gray-600">Your plan renews on May 21, 2024</p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative rounded-xl border p-6 ${
                  plan.popular ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col h-full">
                  <div>
                    <plan.icon className="h-8 w-8 text-purple-600 mb-4" />
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <svg className="h-4 w-4 text-purple-600" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className={plan.current ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-purple-600 hover:bg-purple-700'}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade Plan'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment History */}
          <div>
            <h4 className="font-medium mb-3">Payment History</h4>
            <div className="border rounded-lg divide-y">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Basic Plan - Monthly</p>
                  <p className="text-sm text-gray-500">April 21, 2024</p>
                </div>
                <span className="font-medium">$9.99</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Basic Plan - Monthly</p>
                  <p className="text-sm text-gray-500">March 21, 2024</p>
                </div>
                <span className="font-medium">$9.99</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionsDialog;
