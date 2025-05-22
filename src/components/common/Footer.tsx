import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState, useRef } from 'react';
import CTASection from '../landing/CTASection';
import { SplashCursor } from '@/components/ui/splash-cursor';

import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Footer = () => {
  const [currentYear] = useState(() => new Date().getFullYear());
  const [showEffect, setShowEffect] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  
  // Splash effect configuration
  const splashConfig = {
    SPLAT_RADIUS: 0.18,
    SPLAT_FORCE: 5000,
    COLOR_UPDATE_SPEED: 12,
    BACK_COLOR: { r: 0.03, g: 0.03, b: 0.1 }, // Deep blue-black
    TRANSPARENT: true,
    autoSplat: true, // Enable auto-splat on mouse move
    splatInterval: 25, // Create splat effect every 25ms of mouse movement
  };
  
  return (
    <>
      <CTASection />
      <footer 
        id="footer-container"
        ref={footerRef}
        className="bg-black text-white py-20 relative overflow-hidden"
        onMouseEnter={() => setShowEffect(true)}
        onMouseLeave={() => setShowEffect(false)}
      >
        {/* Animation Effect Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {showEffect && (
            <SplashCursor 
              containerId="footer-container"
              {...splashConfig}
            />
          )}
        </div>
        
        {/* 3D Typography Layer (positioned above the animation) */}
        <div className="container mx-auto px-4 mb-16 relative z-10">
          <div className="flex justify-center">
            <img 
              src="/internity-assets/Group 28.png" 
              alt="INTEGRITY 3D Typography" 
              className="max-w-full h-auto"
            />
          </div>
        </div>
        
        {/* Footer Links Section (positioned above the animation) */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-14">
              {/* Important Links with bottom border animation on hover */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      to="/legal/refund"
                      className="text-white transition-colors duration-300 relative group"
                    >
                      <span className="font-medium">Refund Policy</span>
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View our refund policy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link 
                    to="/contact"
                    className="text-white transition-colors duration-300 relative group"
                  >
                    <span className="font-medium">Contact us</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div>
                      <h4 className="text-sm font-semibold">Get in touch</h4>
                      <p className="text-sm">
                        Our support team is here to help you with any questions
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      to="/legal/privacy"
                      className="text-white transition-colors duration-300 relative group"
                    >
                      <span className="font-medium">Privacy Policy</span>
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View our privacy policy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      to="/legal/terms"
                      className="text-white transition-colors duration-300 relative group"
                    >
                      <span className="font-medium">Terms of services</span>
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Read our terms and conditions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Social Media Icons with scale animation on hover */}
            <div className="mt-8 md:mt-0 flex space-x-6">
              
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://www.linkedin.com/company/nexshrim-technologies/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-transform duration-300 hover:scale-110"
                    >
                      <Linkedin size={20} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              
            </div>
          </div>
          
          <Separator className="bg-gray-800 mb-8" />
          
          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            &copy;{currentYear} Nexshrim Technologies Private Limited. All rights reserved
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
