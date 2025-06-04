
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import OrderSummary from '@/components/checkout/OrderSummary';
import { Button } from '@/components/ui/button';
import { initiatePayment, loadRazorpayScript } from '@/services/PaymentService';
import { getCheckoutAvailability, formatRemainingTime } from '@/services/checkoutSettingsService';
import { Clock } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedCourses, clearCart } = useCart();
  const { addPurchasedCourses } = usePurchasedCourses();
  const { user } = useAuth();
  const [validCourseIds, setValidCourseIds] = useState<Record<string, string>>({});
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [existingTransactions, setExistingTransactions] = useState<Record<string, boolean>>({});
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState(false);
  const [checkoutAvailableAfter, setCheckoutAvailableAfter] = useState<Date | null>(null);
  const [remainingTimeText, setRemainingTimeText] = useState<string>('');

  const subtotal = selectedCourses.reduce((total, course) => total + course.priceINR, 0);
  const discount = Math.round(subtotal * 0.10); // 10% discount
  const total = subtotal - discount;

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Check if checkout is available
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const { isEnabled, availableAfter } = await getCheckoutAvailability();
        setIsCheckoutEnabled(isEnabled);
        setCheckoutAvailableAfter(availableAfter);
        
        if (availableAfter) {
          setRemainingTimeText(formatRemainingTime(availableAfter));
          
          // Update remaining time every minute
          const interval = setInterval(() => {
            setRemainingTimeText(formatRemainingTime(availableAfter));
          }, 60000);
          
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error("Error checking checkout availability:", error);
      }
    };
    
    checkAvailability();
  }, []);

  // Redirect if not enough courses selected
  useEffect(() => {
    if (selectedCourses.length !== 2) {
      toast({
        title: "Insufficient courses selected",
        description: "You need to select exactly 2 courses to proceed with checkout.",
        variant: "destructive"
      });
      navigate('/dashboard/courses');
    }
  }, [selectedCourses, navigate, toast]);

  const checkExistingTransactions = async (courseMapping: Record<string, string>) => {
    try {
      const courseIds = selectedCourses
        .map(course => courseMapping[course.title.toLowerCase()])
        .filter(Boolean);
      
      if (courseIds.length === 0) return;

      const { data, error } = await supabase
        .from('student_transactions')
        .select('course_id')
        .eq('user_id', user?.id)
        .in('course_id', courseIds);

      if (error) {
        console.error('Error checking existing transactions:', error);
        return;
      }

      const existingMap: Record<string, boolean> = {};
      if (data) {
        data.forEach(transaction => {
          existingMap[transaction.course_id] = true;
        });
      }
      setExistingTransactions(existingMap);
      console.log("Existing transactions loaded:", existingMap);

      const allAlreadyPurchased = courseIds.every(id => existingMap[id]);
      if (allAlreadyPurchased && courseIds.length > 0) {
        toast({
          title: "Already purchased",
          description: "You have already purchased all courses in your cart.",
        });
      }
    } catch (err) {
      console.error('Error checking existing transactions:', err);
    }
  };

  const getValidCourseId = async (course: any) => {
    const normalizedTitle = course.title.toLowerCase();
    if (validCourseIds[normalizedTitle]) {
      return validCourseIds[normalizedTitle];
    }

    console.log(`Course "${course.title}" not found in database. Inserting...`);
    
    try {
      const courseToInsert = {
        title: course.title,
        description: course.description || "No description available",
        price: Math.round(course.priceINR / 83),
        instructor: course.instructor || "Unknown Instructor",
        image: course.image,
        tags: course.tags || [],
        category: course.tags?.[0] || "Uncategorized",
        duration: course.duration || "6 months",
      };

      const { data, error } = await supabase
        .from('courses')
        .insert(courseToInsert)
        .select('id')
        .single();

      if (error) {
        console.error('Failed to insert course:', error);
        throw new Error(`Failed to insert course: ${error.message}`);
      }

      console.log(`Successfully inserted course with id: ${data.id}`);
      return data.id;
    } catch (error) {
      console.error('Error inserting course:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    // Check if checkout is enabled by time
    if (!isCheckoutEnabled && checkoutAvailableAfter) {
      const now = new Date();
      if (now < checkoutAvailableAfter) {
        toast({
          title: "Checkout not available yet",
          description: remainingTimeText,
          variant: "destructive"
        });
        return;
      }
    }
    
    // Check if 2 courses are selected
    if (selectedCourses.length !== 2) {
      toast({
        title: "Select 2 courses",
        description: "You need to select exactly 2 courses to proceed to checkout.",
        variant: "destructive"
      });
      navigate('/dashboard/courses');
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase this course",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      if (isLoadingCourses) {
        toast({
          title: "Still loading",
          description: "Please wait while we verify course information",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const courseId = selectedCourses[0]?.id;
      if (!courseId) {
        throw new Error('No course selected');
      }

      const paymentData = await initiatePayment(total, courseId, user.id);

      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Internity Education",
        description: "Course Purchase",
        order_id: paymentData.order_id,
        handler: async (response: any) => {
          console.log('Payment successful:', response);
          await handlePaymentSuccess();
          clearCart();
          navigate('/dashboard/my-courses');
          toast({
            title: "Payment successful!",
            description: "Your course purchase was successful.",
          });
        },
        prefill: {
          name: user.user_metadata?.name || "",
          email: user.email,
        },
        theme: {
          color: "#7C3AED",
        },
      };

      const razorpay = (window as any).Razorpay;
      if (!razorpay) {
        throw new Error('Razorpay not loaded');
      }

      const rzp = new razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const transactionId = `TR-${uuidv4().slice(0, 8)}`;
      const receiptUrl = `https://example.com/receipt/${transactionId}`;

      let allSuccess = true;
      let failMsg = "";
      const coursesToAdd = [];
      
      for (const course of selectedCourses) {
        console.log(`Processing transaction for course: ${course.title}`);
        
        try {
          const validCourseId = await getValidCourseId(course);
          console.log(`Valid course ID for "${course.title}": ${validCourseId}`);
          
          if (existingTransactions[validCourseId]) {
            console.log(`User already purchased course: ${course.title}, skipping transaction`);
            
            coursesToAdd.push({
              id: validCourseId,
              title: course.title,
              image: course.image,
              lessonsCompleted: 0,
              totalLessons: 45,
              duration: "6 Month"
            });
            continue;
          }

          const transaction = {
            transaction_id: transactionId,
            user_id: user.id,
            course_id: validCourseId,
            amount: course.priceINR,
            receipt_url: receiptUrl,
          };

          console.log("Inserting transaction:", transaction);

          const { data, error } = await supabase
            .from('student_transactions')
            .insert(transaction)
            .select();

          if (error) {
            if (error.code === '23505' && error.message.includes('student_transactions_user_id_course_id_key')) {
              console.log(`User already has a transaction for course: ${course.title}, marking as success`);
              
              coursesToAdd.push({
                id: validCourseId,
                title: course.title,
                image: course.image,
                lessonsCompleted: 0,
                totalLessons: 45,
                duration: "6 Month"
              });
            } else {
              allSuccess = false;
              failMsg += `Error for course ${course.title}: ${error.message}\n`;
              console.error('Transaction error details:', error);
            }
          } else {
            console.log("Transaction inserted successfully:", data);
            
            coursesToAdd.push({
              id: validCourseId,
              title: course.title,
              image: course.image,
              lessonsCompleted: 0,
              totalLessons: 45,
              duration: "6 Month"
            });
          }
        } catch (error: any) {
          allSuccess = false;
          failMsg += `Error processing ${course.title}: ${error.message}\n`;
          console.error(`Failed to process course ${course.title}:`, error);
        }
      }

      if (coursesToAdd.length > 0) {
        await addPurchasedCourses(coursesToAdd);
      }

      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          grade: 'Beginner',
          attendance_present: 0,
          attendance_absent: 0,
        });

      if (profileUpdateError) {
        console.error('Error updating profile:', profileUpdateError);
      }

      const { error: achievementError } = await supabase
        .from('student_achievements')
        .insert({
          user_id: user.id,
          title: "Started Learning Journey",
          study_timeframe: "6 months",
        });

      if (achievementError) {
        console.error('Error adding achievement:', achievementError);
      }

      if (!allSuccess) {
        toast({
          title: "Failed to add some transactions",
          description: failMsg || "See console for error details.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error processing payment completion:', error);
      toast({
        title: "Error",
        description: "Failed to complete payment process: " + (error.message || 'Unknown error'),
        variant: "destructive",
      });
    }
  };

  const isCheckoutDisabled = (!isCheckoutEnabled && checkoutAvailableAfter && new Date() < checkoutAvailableAfter) || 
                             selectedCourses.length !== 2;

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground text-sm md:text-base">Complete your enrollment in our 12-month program</p>
            {isLoadingCourses && (
              <p className="text-xs md:text-sm text-amber-600 mt-2">Verifying course information...</p>
            )}
            
            {!isCheckoutEnabled && checkoutAvailableAfter && new Date() < checkoutAvailableAfter && (
              <div className="flex items-center justify-center gap-2 mt-4 text-amber-600">
                <Clock className="h-4 w-4" />
                <p className="text-sm md:text-base">{remainingTimeText}</p>
              </div>
            )}
          </div>
          <div className="max-w-lg mx-auto">
            <OrderSummary />
            
            <div className="mt-4 md:mt-6 px-2 md:px-0">
              <Button 
                onClick={handlePayment}
                className="w-full py-4 md:py-6 text-sm md:text-base bg-brand-purple hover:bg-brand-purple-hover"
                disabled={isProcessing || isLoadingCourses || isCheckoutDisabled}
              >
                {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString('en-IN')} & Enroll Now`}
                {isCheckoutDisabled && remainingTimeText && (
                  <span className="block text-xs mt-1">{remainingTimeText}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
