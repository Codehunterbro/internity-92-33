import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { GraduationCap, Users, Award, BookOpen, BarChart3, Play } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-brand-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About TechLearn</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Empowering the next generation of digital innovators through cutting-edge education.
            </p>
          </div>
        </section>
        
        {/* Our Mission */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                 At Internity, our mission is to bridge the gap between education and opportunity by providing a powerful, accessible, and personalized learning platform. We aim to empower students with real-world skills through industry-relevant courses, immersive learning experiences, and practical mentorship. Simultaneously, we equip educators and administrators with intuitive tools to manage content, track progress, and drive student success.

We believe learning should be affordable, actionable, and accessible — and we’re committed to creating a future where every learner is ready for the challenges of tomorrow.
                </p>
                <p className="text-lg text-gray-700">
                  Through our innovative platform, expert instructors, and industry-relevant curriculum, 
                  we aim to transform lives, advance careers, and drive technological progress 
                  worldwide.
                </p>
              </div>
   <div className="grid grid-cols-2 gap-6">
  <div className="bg-purple-50 rounded-xl p-6 text-center">
    <GraduationCap className="h-10 w-10 text-brand-purple mx-auto mb-4" />
    <h3 className="font-bold text-lg mb-2">Built for Students</h3>
    <p className="text-gray-600">Hands-on, career-focused learning</p>
  </div>
  <div className="bg-purple-50 rounded-xl p-6 text-center">
    <Users className="h-10 w-10 text-brand-purple mx-auto mb-4" />
    <h3 className="font-bold text-lg mb-2">Mentor-Led Programs</h3>
    <p className="text-gray-600">Guidance from top industry experts</p>
  </div>
  <div className="bg-purple-50 rounded-xl p-6 text-center">
    <Award className="h-10 w-10 text-brand-purple mx-auto mb-4" />
    <h3 className="font-bold text-lg mb-2">Skill-Driven</h3>
    <p className="text-gray-600">Focused on real-world applications</p>
  </div>
  <div className="bg-purple-50 rounded-xl p-6 text-center">
    <BookOpen className="h-10 w-10 text-brand-purple mx-auto mb-4" />
    <h3 className="font-bold text-lg mb-2">10+ Courses</h3>
    <p className="text-gray-600">Launching with curated content</p>
  </div>
</div>

            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
               Internity began with a vision to bridge the gap between classroom learning and real-world skills. What started as a small initiative has grown into a dynamic edtech platform, empowering students through practical courses, hands-on projects, and expert mentorship. We're here to make learning relevant, accessible, and future-ready.


              </p>
              
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold mb-4">Excellence</h3>
                <p className="text-gray-700">
                  We're committed to delivering the highest quality educational content and 
                  experiences, constantly evolving our curriculum to meet industry demands.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold mb-4">Inclusivity</h3>
                <p className="text-gray-700">
                  We believe that everyone deserves access to quality education, regardless of 
                  their background, location, or financial circumstances.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Play className="h-7 w-7 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold mb-4">Innovation</h3>
                <p className="text-gray-700">
                  We continuously push the boundaries of online education, leveraging technology 
                  to create engaging, effective, and personalized learning experiences.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        
        
      </main>
      
      <Footer />
    </div>
  );
};

export default About;