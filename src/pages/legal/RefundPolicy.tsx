
import { useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const RefundPolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-[35px]"> {/* Reduced top padding to 35px */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
          
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">Last Updated: May 11, 2025</p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <p>Thank you for using Nexshrim!</p>
              <p>This Refund Policy outlines the terms and conditions for requesting refunds for courses purchased on our platform.</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Refund Eligibility</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>2-Day Window:</strong> Full/partial refunds only if requested within 48 hours of purchase.</li>
                <li><strong>Non-Refundable:</strong>
                  <ul className="list-circle pl-5 mt-2 space-y-1">
                    <li>30% administrative fee per course.</li>
                    <li>Internships initiated during the refund period.</li>
                  </ul>
                </li>
              </ul>
              <div className="p-4 rounded-lg bg-amber-50 border-l-4 border-amber-500 mt-4">
                <p>Please note that all refund requests must be made within 48 hours of purchase. Requests made after this period will not be considered.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Process</h2>
              <div className="mb-4">
                <p><strong>Step 1:</strong> Email support@nexshrim.com with:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Order ID</li>
                  <li>Reason for refund (if reason is not valid or found fraud no refund will be provided)</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <p><strong>Step 2:</strong> Refunds processed within 5 business days via original payment method.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Non-Transferable</h2>
              <div className="p-4 rounded-lg bg-amber-50 border-l-4 border-amber-500">
                <p><strong>Important:</strong> Refunds are non-transferable to any other individual.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
