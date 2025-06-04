import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

// Testimonials data from real students
const testimonials = [{
  id: 1,
  content: "Learning backend development with Node.js at Internity transformed my understanding of how servers work. The mix of mentorship, projects, and hands-on experience made me job-ready in less than a year!",
  name: "Aarav Mehta",
  role: "Backend Developer at Infosys",
  subject: "Backend with Node.js",
  avatar: null,
  rating: 5
}, {
  id: 2,
  content: "The Figma design bootcamp helped me see creativity and logic come together. I created real-life prototypes and collaborated like a real design team member—this course landed me a paid internship!",
  name: "Priya Raghavan",
  role: "UI/UX Designer at Zomato",
  subject: "Design & Prototyping (Figma)",
  avatar: null,
  rating: 5
}, {
  id: 3,
  content: "From version control to CI/CD pipelines, everything was taught with live projects and constant feedback. Internity's DevOps track helped me transition from a student to a professional seamlessly.",
  name: "Rohan Sharma",
  role: "DevOps Engineer at Tata Consultancy Services",
  subject: "DevOps",
  avatar: null,
  rating: 5
}, {
  id: 4,
  content: "React was tough to crack, but the structured videos, weekly tasks, and mini-projects made it digestible. I now confidently build complex UIs and contribute to my team at Flipkart.",
  name: "Neha Kapoor",
  role: "Frontend Developer at Flipkart",
  subject: "Frontend (React.js)",
  avatar: null,
  rating: 5
}, {
  id: 5,
  content: "Internity didn't just teach me the theory of cybersecurity, they made me practice it through live simulations. This course gave me the confidence to crack my first interview!",
  name: "Mohit Verma",
  role: "Cybersecurity Analyst at Wipro",
  subject: "Cybersecurity",
  avatar: null,
  rating: 5
}, {
  id: 6,
  content: "The ML modules were top-notch. From Python basics to real datasets and prediction models, Internity gave me a complete data science roadmap. Today I work on models that impact millions.",
  name: "Sneha Iyer",
  role: "Data Scientist at Paytm",
  subject: "Data Science & Machine Learning",
  avatar: null,
  rating: 5
}, {
  id: 7,
  content: "The cloud computing curriculum was on point. Labs on AWS and GCP, certification prep, and mock interviews—it all led to my placement at AWS!",
  name: "Aditya Jain",
  role: "Cloud Engineer at Amazon Web Services (AWS)",
  subject: "Cloud Computing (AWS, GCP, Azure)",
  avatar: null,
  rating: 5
}, {
  id: 8,
  content: "Internity took me from zero to building deep learning models with confidence. The CNN project and mentor-led sessions made a huge difference in my career.",
  name: "Ishita Malhotra",
  role: "AI Engineer at HCL Technologies",
  subject: "Artificial Intelligence & Deep Learning",
  avatar: null,
  rating: 5
}, {
  id: 9,
  content: "DSA always scared me. But with Internity's approach—daily problem-solving, mentor reviews, and weekly contests—I finally cracked product-based company interviews.",
  name: "Raj Patel",
  role: "Software Engineer at Zoho",
  subject: "DSA (Data Structures & Algorithms)",
  avatar: null,
  rating: 5
}, {
  id: 10,
  content: "My minor and major projects at Internity got me shortlisted for research roles. The documentation and guidance made me realize the power of learning by building.",
  name: "Ananya Sen",
  role: "Intern at Microsoft Research",
  subject: "Research & Project-based Learning",
  avatar: null,
  rating: 5
}];

// Split testimonials for the two rows
const rtlTestimonials = testimonials.slice(0, 5);
const ltrTestimonials = testimonials.slice(5, 10);
const TestimonialsSection = () => {
  const rtlTrackRef = useRef<HTMLDivElement>(null);
  const ltrTrackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rtlPosition = 0;
    let rtlMaxScroll = 0;
    let rtlAnimationId: number;
    let rtlPaused = false;
    let ltrPosition = 0;
    let ltrMaxScroll = 0;
    let ltrAnimationId: number;
    let ltrPaused = false;
    if (rtlTrackRef.current && ltrTrackRef.current) {
      const rtlTrack = rtlTrackRef.current;
      rtlMaxScroll = rtlTrack.scrollWidth / 2;
      const ltrTrack = ltrTrackRef.current;
      ltrPosition = -ltrTrack.scrollWidth / 2;
      ltrMaxScroll = 0;
    }
    function scrollRightToLeft() {
      if (rtlTrackRef.current && !rtlPaused) {
        rtlPosition += 0.5;
        if (rtlPosition >= rtlMaxScroll) {
          rtlPosition = 0;
        }
        rtlTrackRef.current.style.transform = `translateX(-${rtlPosition}px)`;
      }
      rtlAnimationId = requestAnimationFrame(scrollRightToLeft);
    }
    function scrollLeftToRight() {
      if (ltrTrackRef.current && !ltrPaused) {
        ltrPosition += 0.5;
        if (ltrPosition >= 0) {
          ltrPosition = -ltrTrackRef.current.scrollWidth / 2;
        }
        ltrTrackRef.current.style.transform = `translateX(${ltrPosition}px)`;
      }
      ltrAnimationId = requestAnimationFrame(scrollLeftToRight);
    }
    scrollRightToLeft();
    scrollLeftToRight();
    const rtlContainer = document.getElementById('rtl-container');
    const ltrContainer = document.getElementById('ltr-container');
    const handleRtlMouseEnter = () => {
      rtlPaused = true;
    };
    const handleRtlMouseLeave = () => {
      rtlPaused = false;
    };
    const handleLtrMouseEnter = () => {
      ltrPaused = true;
    };
    const handleLtrMouseLeave = () => {
      ltrPaused = false;
    };
    if (rtlContainer) {
      rtlContainer.addEventListener('mouseenter', handleRtlMouseEnter);
      rtlContainer.addEventListener('mouseleave', handleRtlMouseLeave);
    }
    if (ltrContainer) {
      ltrContainer.addEventListener('mouseenter', handleLtrMouseEnter);
      ltrContainer.addEventListener('mouseleave', handleLtrMouseLeave);
    }
    return () => {
      cancelAnimationFrame(rtlAnimationId);
      cancelAnimationFrame(ltrAnimationId);
      if (rtlContainer) {
        rtlContainer.removeEventListener('mouseenter', handleRtlMouseEnter);
        rtlContainer.removeEventListener('mouseleave', handleRtlMouseLeave);
      }
      if (ltrContainer) {
        ltrContainer.removeEventListener('mouseenter', handleLtrMouseEnter);
        ltrContainer.removeEventListener('mouseleave', handleLtrMouseLeave);
      }
    };
  }, []);
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => <Star key={i} className={`w-3 md:w-4 h-3 md:h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill={i < rating ? 'currentColor' : 'none'} />);
  };
  return <section className="py-12 md:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <h6 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-brand-purple mb-2 md:mb-3">Testimonials</h6>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Success Stories from Our Students</h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            Hear from our graduates who have transformed their careers through our comprehensive program.
          </p>
        </div>

        {/* Right-to-Left Scrolling Testimonials */}
        <div id="rtl-container" className="relative overflow-hidden mb-6 md:mb-10">
          <div id="rtl-track" ref={rtlTrackRef} className="flex">
            {/* First set of testimonials */}
            {rtlTestimonials.map(testimonial => <div key={testimonial.id} className="flex-shrink-0 w-64 md:w-72 lg:w-96 p-4 md:p-6 mx-2 md:mx-4 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="flex mb-3 md:mb-4 items-center">
                  <div className="w-8 md:w-12 h-8 md:h-12 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple font-bold text-xs md:text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3 md:ml-4">
                    <p className="font-semibold text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-2 md:mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="inline-block px-2 md:px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-medium mb-2 md:mb-3">
                  {testimonial.subject}
                </div>
                <Quote className="w-6 md:w-8 h-6 md:h-8 text-brand-purple opacity-20 mb-1" />
                <p className="text-muted-foreground md:text-sm leading-relaxed text-sm">{testimonial.content}</p>
              </div>)}
            
            {/* Duplicate for infinite scroll */}
            {rtlTestimonials.map(testimonial => <div key={`dup-${testimonial.id}`} className="flex-shrink-0 w-64 md:w-72 lg:w-96 p-4 md:p-6 mx-2 md:mx-4 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="flex mb-3 md:mb-4 items-center">
                  <div className="w-8 md:w-12 h-8 md:h-12 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple font-bold text-xs md:text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3 md:ml-4">
                    <p className="font-semibold text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-2 md:mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="inline-block px-2 md:px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-medium mb-2 md:mb-3">
                  {testimonial.subject}
                </div>
                <Quote className="w-6 md:w-8 h-6 md:h-8 text-brand-purple opacity-20 mb-1" />
                <p className="text-muted-foreground md:text-sm leading-relaxed text-sm">{testimonial.content}</p>
              </div>)}
          </div>
        </div>

        {/* Left-to-Right Scrolling Testimonials */}
        <div id="ltr-container" className="relative overflow-hidden">
          <div id="ltr-track" ref={ltrTrackRef} className="flex">
            {/* First set of testimonials */}
            {ltrTestimonials.map(testimonial => <div key={testimonial.id} className="flex-shrink-0 w-64 md:w-72 lg:w-96 p-4 md:p-6 mx-2 md:mx-4 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="flex mb-3 md:mb-4 items-center">
                  <div className="w-8 md:w-12 h-8 md:h-12 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple font-bold text-xs md:text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3 md:ml-4">
                    <p className="font-semibold text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-2 md:mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="inline-block px-2 md:px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-medium mb-2 md:mb-3">
                  {testimonial.subject}
                </div>
                <Quote className="w-6 md:w-8 h-6 md:h-8 text-brand-purple opacity-20 mb-1" />
                <p className="text-muted-foreground md:text-sm leading-relaxed text-sm">{testimonial.content}</p>
              </div>)}
            
            {/* Duplicate for infinite scroll */}
            {ltrTestimonials.map(testimonial => <div key={`dup-${testimonial.id}`} className="flex-shrink-0 w-64 md:w-72 lg:w-96 p-4 md:p-6 mx-2 md:mx-4 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="flex mb-3 md:mb-4 items-center">
                  <div className="w-8 md:w-12 h-8 md:h-12 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple font-bold text-xs md:text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3 md:ml-4">
                    <p className="font-semibold text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-2 md:mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="inline-block px-2 md:px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-medium mb-2 md:mb-3">
                  {testimonial.subject}
                </div>
                <Quote className="w-6 md:w-8 h-6 md:h-8 text-brand-purple opacity-20 mb-1" />
                <p className="text-muted-foreground md:text-sm leading-relaxed text-sm">{testimonial.content}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;