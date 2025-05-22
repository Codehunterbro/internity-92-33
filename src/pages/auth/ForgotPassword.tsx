import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword(values.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error in forgot password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading={isSubmitted ? "Check your email" : "Reset your password"}
      subheading={isSubmitted 
        ? "We've sent you an email with a link to reset your password." 
        : "Enter your email and we'll send you a link to reset your password"}
      linkText="Back to login"
      linkHref="/login"
      linkDescription="Remembered your password?"
    >
      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-brand-purple hover:bg-brand-purple-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            If an account exists with this email, you'll receive a link to reset your password.
          </p>
          <Button asChild className="w-full">
            <Link to="/login">Return to login</Link>
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;