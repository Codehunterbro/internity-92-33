
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-12 md:py-20 bg-brand-purple relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-48 md:w-96 h-48 md:h-96 rounded-full bg-white blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 md:w-96 h-48 md:h-96 rounded-full bg-white blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6 text-white leading-tight">
            Start Your Journey to a Successful Tech Career Today
          </h2>
          <p className="text-white/90 text-sm md:text-lg lg:text-xl mb-6 md:mb-10 max-w-3xl mx-auto px-4">
            Join the next generation of developers, designers, and tech leaders. Our immersive, mentor-led programs are designed to help you build real skills and launch your dream career.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
            <Link 
              to="/signup" 
              className="bg-white text-brand-purple hover:bg-gray-100 transition-colors py-3 md:py-4 px-6 md:px-8 rounded-xl font-medium flex items-center justify-center text-sm md:text-base"
            >
              Enroll Now <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent text-white border border-white/30 hover:bg-white/10 transition-colors py-3 md:py-4 px-6 md:px-8 rounded-xl font-medium flex items-center justify-center text-sm md:text-base"
            >
              Contact Us
            </Link>
          </div>
          
          <div className="mt-8 md:mt-16 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 text-white px-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">6</span>
              <span className="text-white/80 text-sm md:text-base">Month Program</span>
            </div>
            <div className="w-px h-8 md:h-16 bg-white/20 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">10+</span>
              <span className="text-white/80 text-sm md:text-base">Courses</span>
            </div>
            <div className="w-px h-8 md:h-16 bg-white/20 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">20+</span>
              <span className="text-white/80 text-sm md:text-base">Industry Partners</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
