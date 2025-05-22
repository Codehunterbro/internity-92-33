import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
interface AuthLayoutProps {
  children: ReactNode;
  heading: string;
  subheading: string;
  linkText: string;
  linkHref: string;
  linkDescription: string;
}
const AuthLayout = ({
  children,
  heading,
  subheading,
  linkText,
  linkHref,
  linkDescription
}: AuthLayoutProps) => {
  return <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6">
          {/* Logo */}
          <Link to="/" className="block mb-8">
            <span className="text-2xl font-bold text-brand-purple">Internity
          </span>
          </Link>
          
          {/* Heading */}
          <h1 className="text-3xl font-bold mb-2">{heading}</h1>
          <p className="text-muted-foreground mb-8">{subheading}</p>
          
          {/* Auth form */}
          {children}
          
          {/* Link to other auth page */}
          <p className="text-center mt-8 text-muted-foreground">
            {linkDescription}{' '}
            <Link to={linkHref} className="text-brand-purple hover:underline font-medium">
              {linkText}
            </Link>
          </p>
          
          {/* Legal links - only Terms and Conditions */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to TechLearn's{' '}
              <Link to="/legal/terms" className="text-brand-purple hover:underline">
                Terms & Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image/info */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-brand-purple to-brand-purple-dark relative">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Unlock Your Tech Potential</h2>
            <p className="text-white/80 text-lg mb-8">
              Join our comprehensive 12-month program combining intensive learning and hands-on internship 
              experience to kickstart your career in tech.
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-white mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">6+</div>
                <div className="text-white/70 text-sm">Months Study</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">6+</div>
                <div className="text-white/70 text-sm">Months Internship</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">50+</div>
                <div className="text-white/70 text-sm">Industry Partners</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
              <blockquote className="text-white italic mb-4">
                "The TechLearn program completely transformed my career. In just one year, I went from a beginner to
                a confident professional with real-world experience."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold mr-3">AP</div>
                <div>
                  <p className="text-white font-medium">Abhishek Pagariya</p>
                  <p className="text-white/70 text-sm">Data Scientist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default AuthLayout;