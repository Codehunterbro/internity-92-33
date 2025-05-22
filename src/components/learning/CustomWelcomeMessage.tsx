import { BookOpen, Lock } from "lucide-react";
interface CustomWelcomeMessageProps {
  isPurchased: boolean;
}
const CustomWelcomeMessage = ({
  isPurchased
}: CustomWelcomeMessageProps) => {
  if (isPurchased) {
    return <div className="flex flex-col items-center justify-center text-center p-10 gap-4">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-2">
          <Lock className="w-12 h-12 text-brand-purple" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to sadfsdf</h2>
        <ul className="space-y-3 text-left max-w-lg mx-auto">
          <li className="flex items-center">
            <div className="bg-green-100 rounded-full p-1 mr-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span>Registration has been successfully completed.</span>
          </li>
          <li className="flex items-center">
            <div className="bg-gray-100 rounded-full p-1 mr-2">
              <div className="w-4 h-4 flex items-center justify-center text-gray-500">•</div>
            </div>
            <span>Your application is under review. Results will be announced on 31st May.</span>
          </li>
          <li className="flex items-center">
            <div className="bg-gray-100 rounded-full p-1 mr-2">
              <div className="w-4 h-4 flex items-center justify-center text-gray-500">•</div>
            </div>
            <span>Upon selection, you will need to pay the full course fee.</span>
          </li>
          <li className="flex items-center">
            <div className="bg-gray-100 rounded-full p-1 mr-2">
              <div className="w-4 h-4 flex items-center justify-center text-gray-500">•</div>
            </div>
            <span>Join the classes when the batch officially begins.</span>
          </li>
        </ul>
        <div className="mt-8">
          
        </div>
      </div>;
  }
  return <div className="flex flex-col items-center justify-center text-center p-10 gap-4">
      <BookOpen className="h-16 w-16 text-yellow-500 opacity-70" />
      <h2 className="text-2xl font-bold text-gray-800">Course Access Locked</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl">
        <p className="text-gray-700 mb-4">
          Your course has been registered, but access to the content is currently locked. 
          We'll review your registration and unlock the content soon.
        </p>
        <p className="text-gray-700 mb-4">
          <strong className="font-medium">Remember:</strong> Your full fee will be refunded if you're not selected.
        </p>
        <p className="text-gray-700">
          <strong className="font-medium">For any assistance:</strong> Please reach out to our support team.
        </p>
      </div>
    </div>;
};
export default CustomWelcomeMessage;