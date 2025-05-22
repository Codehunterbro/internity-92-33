
import { useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const PrivacyPolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-[35px]"> {/* Reduced top padding to 35px */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">Effective Date: May 11, 2025</p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <p>TheInternity.com ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website https://theinternity.com/ (the "Site"). By using our Site, you agree to the terms of this Privacy Policy.</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Information We Collect</h2>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">a. Personal Information</h3>
                <p>We may collect personal information that you provide to us, such as:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Contact information</li>
                  <li>Educational background</li>
                  <li>Payment information (if applicable)</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">b. Non-Personal Information</h3>
                <p>We may collect non-personal information automatically, including:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Usage data (pages visited, time spent, etc.)</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Personalize your learning experience</li>
                <li>Communicate with you about updates, offers, and support</li>
                <li>Process transactions and certifications</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can adjust your browser settings to refuse cookies, but some features may not function properly.</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Sharing Your Information</h2>
              <p>We do not sell or rent your personal information. We may share your information with:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Service providers assisting with our operations (e.g., payment processors, hosting)</li>
                <li>Legal authorities if required by law</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">5. Data Security</h2>
              <p>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">6. Your Rights</h2>
              <p>You may access, update, or delete your personal information by contacting us. You may also opt out of marketing communications at any time.</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">7. Children's Privacy</h2>
              <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">9. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at contact@theinternity.com.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
