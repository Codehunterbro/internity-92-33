
import { BookOpen, Monitor, Award, Users, Calendar, Briefcase } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="w-7 h-7 text-white" />,
    title: "Expert-Led Courses",
    description: "Learn from industry experts with years of professional experience who guide you through real-world examples and practical challenges."
  },
  {
    icon: <Monitor className="w-7 h-7 text-white" />,
    title: "Interactive Learning",
    description: "Engage with interactive content, coding exercises, quizzes, and hands-on projects designed to reinforce your understanding."
  },
  {
    icon: <Award className="w-7 h-7 text-white" />,
    title: "Certifications",
    description: "Earn industry-recognized certificates upon course completion to showcase your skills to potential employers."
  },
  {
    icon: <Users className="w-7 h-7 text-white" />,
    title: "Community Support",
    description: "Join our vibrant community of learners and instructors for networking, collaboration, and peer-to-peer learning."
  },
  {
    icon: <Calendar className="w-7 h-7 text-white" />,
    title: "Flexible Schedule",
    description: "Learn at your own pace with 24/7 access to course materials, allowing you to balance education with other commitments."
  },
  {
    icon: <Briefcase className="w-7 h-7 text-white" />,
    title: "Guaranteed Internships",
    description: "Complete your 2-month study program and seamlessly transition into a 4-month internship with our industry partners."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h6 className="text-sm font-semibold uppercase tracking-wider text-brand-purple mb-3">Why Choose Us</h6>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Comprehensive Learning That Works</h2>
          <p className="text-muted-foreground text-lg">
            Our 12-month program combines 6 months of focused learning with 6 months of hands-on internship experience, 
            giving you the perfect balance of theory and practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-brand-purple w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
