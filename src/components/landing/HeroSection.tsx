
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-purple via-purple-700 to-indigo-800">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/internity-assets/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-brand-purple/40"></div>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-80 md:h-80 rounded-full bg-white blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-white leading-tight animate-fade-in">
            Launch Your{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Tech Career
            </span>{' '}
            in Just 6 Months
          </h1>
          
          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-white/90 max-w-4xl mx-auto px-4 animate-fade-in">
            Master in-demand skills with our intensive, mentor-led programs. Join the next generation of developers, designers, and tech innovators.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-8 md:mb-12 px-4 animate-fade-in">
            <Link 
              to="/signup" 
              className="bg-white text-brand-purple hover:bg-gray-100 transition-all duration-300 py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg flex items-center justify-center hover:shadow-lg hover:scale-105"
            >
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button 
              onClick={handlePlayVideo}
              className="bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300 py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg flex items-center justify-center"
            >
              <Play className="mr-2 w-5 h-5" /> Watch Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto px-4 animate-fade-in">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">500+</div>
              <div className="text-white/80 text-sm md:text-base">Students Placed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">95%</div>
              <div className="text-white/80 text-sm md:text-base">Job Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">₹8L+</div>
              <div className="text-white/80 text-sm md:text-base">Average Package</div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-12 right-0 text-white text-xl hover:text-gray-300"
            >
              ✕
            </button>
            <div className="relative pb-9/16">
              <video
                controls
                autoPlay
                className="w-full rounded-lg"
              >
                <source src="/internity-assets/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
