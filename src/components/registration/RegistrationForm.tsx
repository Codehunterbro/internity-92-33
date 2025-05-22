import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePurchasedCourses } from '@/hooks/use-purchased-courses';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { createStudentRegistration, StudentRegistrationData } from '@/services/studentRegistrationService';
import { initiatePayment, loadRazorpayScript } from '@/services/PaymentService';
import { savePurchasedCourses } from '@/services/coursePurchaseService';
import { updateRegistrationPayment } from '@/services/studentRegistrationService';

const formSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  college_name: z.string().min(1, 'College name is required'),
  semester: z.enum(['1', '2', '3', '4', '5', '6', '7', '8'], { 
    required_error: 'Please select a semester' 
  }),
  branch: z.string().min(1, 'Branch is required'),
  has_backlogs: z.boolean(),
  last_semester_score: z.number()
    .min(0, 'Score must be at least 0')
    .max(10, 'Score cannot be more than 10'),
  ai_thoughts: z.string().min(10, 'Please provide your thoughts (minimum 10 characters)'),
});

type FormData = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationForm = ({ isOpen, onClose }: RegistrationFormProps) => {
  const { selectedCourses, clearCart } = useCart();
  const { addPurchasedCourses } = usePurchasedCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      college_name: '',
      semester: '1',
      branch: '',
      has_backlogs: false,
      last_semester_score: 0,
      ai_thoughts: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Save registration data
      await createStudentRegistration(data as StudentRegistrationData);
      
      // Move to confirmation step
      setStep('confirmation');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Error',
        description: 'There was an error during registration. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePayment = async () => {
    try {
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to continue',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }
      
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast({
          title: 'Payment Error',
          description: 'Could not load payment gateway. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      // Initiate payment
      const paymentData = await initiatePayment(1000, 'registration', user.id);
      
      // Configure Razorpay options
      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Internity',
        description: 'Course Registration Fee',
        order_id: paymentData.order_id,
        handler: async function(response: any) {
          try {
            // Update payment status in registration
            await updateRegistrationPayment(response.razorpay_payment_id);
            
            // Save course selections to student_transactions table
            await savePurchasedCourses(selectedCourses.map(course => course.id));
            
            // Add purchased courses to the user's profile
            // Fix: Add course_id property to match the Course type
            await addPurchasedCourses(selectedCourses.map(course => ({
              id: course.id,
              course_id: course.id, // Add this line to fix the type error
              title: course.title,
              image: course.image || '',
              lessonsCompleted: 0,
              totalLessons: 45,
              duration: "6 Month",
            })));
            
            // Clear cart
            clearCart();
            
            // Show success message
            toast({
              title: 'Registration Complete',
              description: 'Your registration was successful! You can now access your courses.',
            });
            
            // Close dialog and navigate to my courses
            onClose();
            navigate('/dashboard/my-courses');
            
          } catch (error) {
            console.error('Payment completion error:', error);
            toast({
              title: 'Error',
              description: 'Payment was received but there was an error updating your registration. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#7c3aed',
        }
      };
      
      // Open Razorpay checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: 'Payment Error',
        description: 'There was an error initiating payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Student Registration</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="college_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your college name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
                              <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="has_backlogs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Do you have any backlogs?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="last_semester_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Semester Score (GPA)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter GPA (0-10)" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            min={0}
                            max={10}
                            step={0.01}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="ai_thoughts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your thoughts on AI?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your thoughts on AI and its impact..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Continue</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Complete Registration</DialogTitle>
            </DialogHeader>
            
            <div className="py-6 space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-green-700 mb-2">0% Risk</h3>
                <p className="text-gray-700">Your full fee will be refunded if you won't get selected.</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Selected Courses:</h4>
                <div className="space-y-2">
                  {selectedCourses.map((course) => (
                    <div key={course.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                      <div className="h-10 w-10 bg-gray-200 rounded-md mr-3 overflow-hidden">
                        {course.image && <img src={course.image} alt={course.title} className="h-full w-full object-cover" />}
                      </div>
                      <span className="font-medium">{course.title}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Registration Fee:</span>
                    <span>₹1,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('form')}
              >
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                className="bg-brand-purple hover:bg-brand-purple/90"
              >
                Pay & Register Yourself
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationForm;