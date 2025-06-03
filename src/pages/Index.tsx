
import Navbar from '@/components/common/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CoursesSection from '@/components/landing/CoursesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import ProgramStructureSection from '@/components/landing/ProgramStructureSection';
import PathwaysSection from '@/components/landing/PathwaysSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/common/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
        <ProgramStructureSection />
        <PathwaysSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
