
import { useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const TermsAndConditions = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-[20px]"> {/* Changed top padding to 20px */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Effective Date: 17 FEB 2025 | Last Updated: 20 FEB 2025</p>
            <p className="text-sm text-muted-foreground">Governing Law: Laws of India</p>
          </div>
          
          <div className="mb-8">
            <p className="mb-2">Thank you for using Nexshrim Technologies Private Limited!</p>
            <p>These Terms and Conditions ("Terms") are a binding legal agreement between you and Nexshrim that govern your use of the platform.</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>By using Nexshrim Technologies Private Limited ("Platform"), you agree to these legally binding Terms. Violations may result in account suspension.</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Internship Program</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">2.1 Tiered Internship Structure</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tier 1:</strong> Available to all users completing the course with ≥60% score.</li>
                <li><strong>Tier 2:</strong> Reserved for the top 75th percentile of each cohort.</li>
                <li><strong>Tier 3:</strong> Awarded to the top 50th percentile of active users.</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">2.2 Eligibility Criteria</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Percentile Formula:</strong><br />
                Percentile = (1 - (Student's Rank / Total Students)) × 100</li>
                <li><strong>Percentile Metrics:</strong>
                  <ul className="list-circle pl-5 mt-2 space-y-1">
                    <li>Required certificate submission (15%), Major Projects (30%), Minor Project (25%), Final Exam (30%)</li>
                  </ul>
                </li>
                <li><strong>Disqualification:</strong> Plagiarism, account sharing, or misconduct.</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">2.3 Third-Party Partnerships</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Internships facilitated via partner companies.</li>
                <li><strong>No Guarantee:</strong> Nexshrim does not assure stipends, roles, or placements.</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. User Obligations</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide accurate registration details (e.g., full name, educational credentials).</li>
              <li>Do not share account credentials.</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Report Card Metrics</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">1. Minor Projects (20%)</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Projects will be provided by instructors in live classes or directly on the bases of attendance and attending live classes of the student individual.</li>
                <li>Minor Projects will not be provided if student is requirements are not completed.</li>
                <li>Instructors are not responsible for any damage cause to students course performance.</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">2. Major Projects (20%)</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Projects will be provided by instructors in live classes or directly on the bases of attendance and attending live classes of the student individual.</li>
                <li>Minor Projects will not be provided if student is requirements are not completed.</li>
                <li>Instructors are not responsible for any damage cause to students course performance.</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">3. Daily Quizzes (20%)</h3>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">4. Final Exams (40%)</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>All details about final exam will be provided at the time of the admit card distribution like exam center, Timings etc.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
