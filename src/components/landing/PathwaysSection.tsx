import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
const categories = [{
  name: "Coding",
  active: true
}, {
  name: "Design",
  active: false
}, {
  name: "Health",
  active: false
}, {
  name: "Business",
  active: false
}, {
  name: "Marketing",
  active: false
}];
const PathwaysSection = () => {
  return <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Enhanced Bottom Gradient Card */}
        <div className="mt-6 md:mt-12 rounded-xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-400 p-6 md:p-12 relative">
            <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white/10 rounded-full blur-3xl -mr-16 md:-mr-32 -mt-16 md:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-24 md:w-48 h-24 md:h-48 bg-yellow-500/20 rounded-full blur-2xl -ml-12 md:-ml-24 -mb-8 md:-mb-16"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 relative z-10">
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">Educational Resources</h2>
                <p className="text-white/90 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
                  Access comprehensive educational materials designed to enhance your professional skills. Our curated resources help you track your progress, identify areas for improvement, and develop expertise in your chosen field.
                </p>
                
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1 md:py-2 rounded-full text-white text-xs md:text-sm">Self-paced learning</span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1 md:py-2 rounded-full text-white text-xs md:text-sm">Expert guidance</span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1 md:py-2 rounded-full text-white text-xs md:text-sm">Industry-relevant</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-yellow-100 rounded-full blur-2xl opacity-70"></div>
                
                <div className="mb-4 md:mb-6 relative z-10">
                  <h3 className="text-lg md:text-2xl font-bold mb-2">Strategy & Implementation</h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                    <span className="px-2 md:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Professional certification</span>
                    <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">8 weeks</span>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-5 relative z-10">
                  <div>
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2 text-sm md:text-base">
                      <span className="flex items-center justify-center w-5 md:w-6 h-5 md:h-6 bg-yellow-100 text-yellow-600 rounded-full text-xs">1</span>
                      Learning Objectives
                    </h4>
                    <p className="text-gray-600 ml-6 md:ml-8 md:text-sm text-sm">Develop comprehensive strategies across multiple channels to achieve measurable outcomes and drive sustainable results.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2 text-sm md:text-base">
                      <span className="flex items-center justify-center w-5 md:w-6 h-5 md:h-6 bg-green-100 text-green-600 rounded-full text-xs">2</span>
                      Course Overview
                    </h4>
                    <p className="text-gray-600 ml-6 md:ml-8 md:text-sm text-sm">Master the development of data-driven plans that deliver measurable results through practical applications and case studies.</p>
                  </div>
                  
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100 ml-6 md:ml-8 px-[13px] py-[12px] mx-0">
                    <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">Key Learning Modules:</h4>
                    <ul className="space-y-1 md:space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1 text-xs">✓</span>
                        <span className="md:text-sm text-sm">Advanced research methodologies and audience analysis techniques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1 text-xs">✓</span>
                        <span className="md:text-sm text-sm">Strategic content formulation and execution plans</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1 text-xs">✓</span>
                        <span className="md:text-sm text-sm">Performance metrics implementation and outcome measurement</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 md:mt-6">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full" style={{
                      width: '75%'
                    }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default PathwaysSection;