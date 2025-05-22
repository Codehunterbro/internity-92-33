import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';
import { initiatePayment, loadRazorpayScript } from '@/services/PaymentService';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  cardName: z.string().min(3, { message: "Cardholder name is required" }),
  cardNumber: z.string()
    .min(16, { message: "Card number must be 16 digits" })
    .max(19, { message: "Card number must be at most 19 characters" })
    .regex(/^[\d\s-]+$/, { message: "Card number can only contain digits, spaces, or dashes" }),
  expDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string()
    .min(3, { message: "CVV must be 3 or 4 digits" })
    .max(4, { message: "CVV must be 3 or 4 digits" })
    .regex(/^\d+$/, { message: "CVV must contain only digits" }),
  country: z.string().min(2, { message: "Country is required" }),
  postalCode: z.string().min(3, { message: "Postal/ZIP code is required" }),
});

type PaymentFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isProcessing: boolean;
  total: number;
};

const PaymentForm = ({ onSubmit, isProcessing, total }: PaymentFormProps) => {
  const { user } = useAuth();
  const { selectedCourses, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expDate: "",
      cvv: "",
      country: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handlePayment = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to make a payment",
        variant: "destructive",
      });
      return;
    }

    try {
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
          await onSubmit(values);
          clearCart();
          navigate('/dashboard/my-courses');
          toast({
            title: "Payment successful!",
            description: "Your course purchase was successful.",
          });
        },
        prefill: {
          name: values.cardName,
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

    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Enter your details to complete enrollment</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const formatted = value.replace(/(.{4})/g, '$1 ').trim();
                            field.onChange(formatted);
                          }}
                          maxLength={19}
                        />
                        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MM/YY" 
                          {...field} 
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            field.onChange(value);
                          }}
                          maxLength={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123" 
                          type="password" 
                          {...field} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-2 border-t border-gray-200">
              <h3 className="font-medium pt-4">Billing Address</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal/ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Lock className="h-4 w-4 mr-2" />
              Secure payment powered by Razorpay
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-base bg-brand-purple hover:bg-brand-purple-hover"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString('en-IN')} & Enroll Now`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
