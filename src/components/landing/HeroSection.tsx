import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [seatsTaken, setSeatsTaken] = useState(() => {
    // Initialize with calculation based on dates
    return calculateSeatsBasedOnDate();
  });
  const totalSeats = 250;
  const seatsLeft = totalSeats - seatsTaken;
  const isLowSeats = seatsLeft <= 20;

  // Function to calculate seats based on date progression
  function calculateSeatsBasedOnDate() {
    // Campaign start date (when seats were at initial value)
    const campaignStartStr = localStorage.getItem('campaignStartDate');
    const initialSeats = 73; // Starting number of seats taken

    let campaignStart;
    let initialSeatsTaken;

    // If we have a stored campaign start, use it
    if (campaignStartStr) {
      campaignStart = new Date(campaignStartStr);
      initialSeatsTaken = parseInt(localStorage.getItem('initialSeatsTaken') || initialSeats.toString());
    } else {
      // First time setup - store campaign start as today
      // In a real app, you would set this to a specific launch date
      campaignStart = new Date();
      // Reset to the hour to ensure consistent calculations
      campaignStart.setHours(0, 0, 0, 0);
      localStorage.setItem('campaignStartDate', campaignStart.toISOString());
      localStorage.setItem('initialSeatsTaken', initialSeats.toString());
      initialSeatsTaken = initialSeats;
    }

    // Current date
    const today = new Date();

    // Calculate days since campaign start
    const dayDifference = Math.floor((today.getTime() - campaignStart.getTime()) / (1000 * 60 * 60 * 24));

    // For each day, add 10-15 seats (using a seeded random number based on the date)
    // This ensures the same number is generated for a given date
    let calculatedSeatsTaken = initialSeatsTaken;
    for (let i = 1; i <= dayDifference; i++) {
      // Create a date object for each day since start
      const currentDate = new Date(campaignStart);
      currentDate.setDate(campaignStart.getDate() + i);

      // Use the date string as a simple "seed" for deterministic randomness
      const dateSeed = currentDate.toISOString().split('T')[0].replace(/-/g, '');
      const seedNumber = parseInt(dateSeed) % 100;

      // Generate a "random" number between 10-15 based on the date
      const dailyIncrease = 10 + seedNumber % 6;

      // Add to running total
      calculatedSeatsTaken += dailyIncrease;
    }

    // Ensure we don't exceed max (always leave at least 9 seats)
    return Math.min(calculatedSeatsTaken, 241);
  }

  // Update seats when component mounts and periodically check for date changes
  useEffect(() => {
    // Update the seats based on current date
    const updateSeats = () => {
      const calculatedSeats = calculateSeatsBasedOnDate();
      setSeatsTaken(calculatedSeats);
      localStorage.setItem('lastCalculatedSeats', calculatedSeats.toString());
    };

    // Initial update
    updateSeats();

    // Check for date changes every hour
    const dateCheckInterval = setInterval(() => {
      updateSeats();
    }, 3600000); // 1 hour

    setIsLoaded(true);
    return () => clearInterval(dateCheckInterval);
  }, []);
  return <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Full-screen background video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-1/2 left-1/2 min-w-full min-h-full w-full transform -translate-x-1/2 -translate-y-1/2 object-cover">
          <source src="/internity-assets/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero content */}
          <div className={`w-full lg:w-1/2 text-center lg:text-left ${isLoaded ? 'animate-fade-up' : 'opacity-0'}`}>
            <h1 className="font-bold mb-6 leading-tight text-white">
              Getting <span className="text-brand-purple">Quality</span> Education is Now More <span className="text-brand-purple">Easy</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto lg:mx-0">
              Transform your passion into expertise with our diverse range of expert-led courses. Learn at your own pace, anywhere, and unlock various modern opportunities to grow, achieve, and succeed.
            </p>
            
            {/* Seats availability indicator */}
            <div className={`mb-8 rounded-lg p-3 ${isLowSeats ? 'bg-red-500/20 border border-red-500 animate-pulse' : 'bg-white/10 backdrop-blur-sm'} max-w-md mx-auto lg:mx-0`}>
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={isLowSeats ? "destructive" : "secondary"} className="px-2 py-0.5">
                    Limited Enrollment
                  </Badge>
                  {isLowSeats && <Badge variant="destructive" className="px-2 py-0.5 animate-pulse">
                      Urgent
                    </Badge>}
                </div>
                <p className="text-white font-medium">
                  Only <span className={`font-bold text-xl ${isLowSeats ? 'text-red-400' : 'text-brand-purple'}`}>{seatsLeft}</span> seats remaining out of <span className="font-medium">{totalSeats}</span>
                </p>
                <div className="w-full mt-2 bg-white/20 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${isLowSeats ? 'bg-red-500' : 'bg-brand-purple'}`} style={{
                  width: `${seatsTaken / totalSeats * 100}%`
                }}></div>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  {isLowSeats ? 'Hurry! Only ' + seatsLeft + ' seats left!' : 'Seats are filling up fast!'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup" className="btn-primary inline-flex items-center justify-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/courses" className="btn-outline inline-flex items-center justify-center bg-white/10 border-white text-white hover:bg-white/20">
                Browse Courses
              </Link>
            </div>
            
            {/* Stats */}
            
          </div>

          {/* Empty right side */}
          <div className={`w-full lg:w-1/2 ${isLoaded ? 'animate-fade-in delay-300' : 'opacity-0'}`}>
            {/* Intentionally left empty */}
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;