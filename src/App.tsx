
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
import NotFound from "./pages/NotFound";
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
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Reset password routes - Enhanced to be more comprehensive */}
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                  
                  {/* Special routes to handle various token formats */}
                  <Route path="/reset-password/*" element={<ResetPassword />} />
                  <Route path="reset-password/*" element={<ResetPassword />} />
                  
                  {/* Auth callback routes - comprehensive handling of all potential patterns */}
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="auth/callback" element={<Navigate to="/auth/callback" replace />} />
                  <Route path="/#/auth/callback" element={<Navigate to="/auth/callback" replace />} />
                  <Route path="callback" element={<Navigate to="/auth/callback" replace />} />
                  
                  {/* Auth loading screen - shown during authentication processing */}
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
                  
                  {/* Checkout route - also protected */}
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  
                  {/* Learning routes - also protected */}
                  <Route path="/learn/courses/:courseId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
                  <Route path="/learn/course/:courseId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
                  <Route path="/learn/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
                  
                  {/* This will catch any URL with tokens as a special case - fixed format */}
                  <Route path="*/*access_token=*" element={<ResetPassword />} />

                  {/* For any unmatched routes, show auth loading instead of 404 error */}
                  <Route path="*" element={<AuthLoading />} />
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
