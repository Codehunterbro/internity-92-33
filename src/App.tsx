
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { PurchasedCoursesProvider } from "./contexts/PurchasedCoursesContext";

// Page imports
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LandCourses from "./pages/LandCourses";

// Auth pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthCallback from "./pages/auth/AuthCallback";
import AuthLoading from "./pages/auth/AuthLoading";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import Courses from "./pages/dashboard/Courses";
import CourseDetail from "./pages/dashboard/CourseDetail";
import MyCourses from "./pages/dashboard/MyCourses";
import Achievements from "./pages/dashboard/Achievements";
import Projects from "./pages/dashboard/Projects";

// Learning pages
import LearningDashboard from "./pages/learning/LearningDashboard";
import CourseContent from "./pages/learning/CourseContent";

// Legal pages
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import RefundPolicy from "./pages/legal/RefundPolicy";

// Checkout
import Checkout from "./pages/checkout/Checkout";

// 404
import NotFound from "./pages/NotFound";

// Guards
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CourseRequiredRoute from "./components/auth/CourseRequiredRoute";

// Layout
import DashboardLayout from "./components/dashboard/DashboardLayout";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PurchasedCoursesProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/courses" element={<LandCourses />} />
                  
                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/auth/loading" element={<AuthLoading />} />
                  
                  {/* Legal routes */}
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/refund" element={<RefundPolicy />} />
                  
                  {/* Checkout */}
                  <Route path="/checkout" element={<Checkout />} />
                  
                  {/* Protected Dashboard routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <CourseRequiredRoute>
                        <DashboardLayout>
                          <Dashboard />
                        </DashboardLayout>
                      </CourseRequiredRoute>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard/courses" element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Courses />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard/course/:id" element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <CourseDetail />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard/my-courses" element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <MyCourses />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard/projects" element={
                    <ProtectedRoute>
                      <CourseRequiredRoute>
                        <DashboardLayout>
                          <Projects />
                        </DashboardLayout>
                      </CourseRequiredRoute>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard/achievements" element={
                    <ProtectedRoute>
                      <CourseRequiredRoute>
                        <DashboardLayout>
                          <Achievements />
                        </DashboardLayout>
                      </CourseRequiredRoute>
                    </ProtectedRoute>
                  } />
                  
                  {/* Learning routes */}
                  <Route path="/learn" element={
                    <ProtectedRoute>
                      <LearningDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/learn/course/:courseId" element={
                    <ProtectedRoute>
                      <CourseContent />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/learn/course/:courseId/lesson/:lessonId" element={
                    <ProtectedRoute>
                      <CourseContent />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/learn/course/:courseId/project/:projectType/:moduleId/:weekId?" element={
                    <ProtectedRoute>
                      <CourseContent />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/learn/courses/:courseId" element={
                    <ProtectedRoute>
                      <CourseContent />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </PurchasedCoursesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
