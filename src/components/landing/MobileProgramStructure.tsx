
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Clock, Users, Award, BookOpen } from 'lucide-react';

const MobileProgramStructure = () => {
  const programStructure = [
    {
      month: "Month 1",
      title: "Foundation",
      description: "Start your journey with the fundamentals",
      topics: ["HTML Basics", "CSS Fundamentals", "JavaScript Intro"],
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      month: "Month 2", 
      title: "Intermediate",
      description: "Build upon your knowledge with advanced concepts",
      topics: ["React Basics", "State Management", "API Integration"],
      icon: <Users className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 border-green-200"
    },
    {
      month: "Month 3",
      title: "Advanced",
      description: "Master complex topics and real-world applications", 
      topics: ["Advanced React", "Testing", "Performance"],
      icon: <Award className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-200"
    },
    {
      month: "Month 4-6",
      title: "Specialization",
      description: "Focus on your chosen career path",
      topics: ["Portfolio Projects", "Industry Tools", "Career Prep"],
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-50 border-orange-200"
    }
  ];

  return (
    <div className="space-y-4 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Your 6-Month Journey to Success
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Follow your journey from beginner to professional with our comprehensive 6-month program.
        </p>
      </div>

      <div className="grid gap-4">
        {programStructure.map((phase, index) => (
          <Card key={index} className={`${phase.color} border-2 transition-all duration-300 hover:shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                    {phase.icon}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {phase.month}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {phase.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {phase.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.topics.map((topic, topicIndex) => (
                        <span 
                          key={topicIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-brand-purple to-purple-600 rounded-xl text-white text-center">
        <h3 className="text-xl font-bold mb-2">Ready to Start Your Journey?</h3>
        <p className="text-purple-100 mb-4 text-sm">
          Join thousands of students who have transformed their careers
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>6 Months</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>Live Support</span>
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-1" />
            <span>Certificate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProgramStructure;
