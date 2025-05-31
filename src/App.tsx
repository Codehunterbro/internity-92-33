
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthCallback from "./pages/auth/AuthCallback";
import Dashboard from "./pages/dashboard/Dashboard";
import Courses from "./pages/dashboard/Courses";
import {LandCourses} from './pages/LandCourses';
import MyCourses from "./pages/dashboard/MyCourses";
import CourseDetail from "./pages/dashboard/CourseDetail";
import Assignments from "./pages/dashboard/Assignments";
import Achievements from "./pages/dashboard/Achievements";
import Checkout from "./pages/checkout/Checkout";
import LearningDashboard from "./pages/learning/LearningDashboard";
import CourseContent from "./pages/learning/CourseContent";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import RefundPolicy from "./pages/legal/RefundPolicy";
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CourseRequiredRoute from "@/components/auth/CourseRequiredRoute";
import { CartProvider } from "@/contexts/CartContext";
import { PurchasedCoursesProvider } from "@/contexts/PurchasedCoursesContext";
import AuthLoading from "./pages/auth/AuthLoading";

// Create the query client outside the component
const queryClient = new QueryClient();

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <PurchasedCoursesProvider>
              <TooltipProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/courses" element={<LandCourses />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Reset password routes */}
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  
                  {/* Auth callback route - clean handling */}
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  
                  {/* Auth loading screen */}
                  <Route path="/auth/loading" element={<AuthLoading />} />
                  
                  {/* Legal routes */}
                  <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                  <Route path="/legal/refund" element={<RefundPolicy />} />
                  <Route path="/legal/terms" element={<TermsAndConditions />} />
                  
                  {/* Protected dashboard routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><CourseRequiredRoute><Dashboard /></CourseRequiredRoute></ProtectedRoute>} />
                  <Route path="/dashboard/my-courses" element={<ProtectedRoute><CourseRequiredRoute><MyCourses /></CourseRequiredRoute></ProtectedRoute>} />
                  <Route path="/dashboard/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                  <Route path="/dashboard/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
                  <Route path="/dashboard/assignments" element={<ProtectedRoute><CourseRequiredRoute><Assignments /></CourseRequiredRoute></ProtectedRoute>} />
                  <Route path="/dashboard/achievements" element={<ProtectedRoute><CourseRequiredRoute><Achievements /></CourseRequiredRoute></ProtectedRoute>} />
                  
                  {/* Checkout route */}
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  
                  {/* Learning routes - Updated to handle project routes */}
                  <Route path="/learn/courses/:courseId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
                  <Route path="/learn/course/:courseId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
                  <Route path="/learn/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
                  <Route path="/learn/course/:courseId/project/minor/:projectModuleId/:projectWeekId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
                  <Route path="/learn/course/:courseId/project/major/:projectModuleId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
                  
                  {/* Catch-all route - now redirects to projects instead of 404 */}
                  <Route path="*" element={<Projects />} />
                </Routes>
                <Toaster />
              </TooltipProvider>
            </PurchasedCoursesProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
