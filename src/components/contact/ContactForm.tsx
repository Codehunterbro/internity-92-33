import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlternativeContact, setShowAlternativeContact] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Sending email with EmailJS...");
      console.log("Form data:", formData);
      
      const result = await emailjs.sendForm(
        'sice_w64vumf', 
        'templathifd', 
        form.current!, 
        'HB1zg3Y9nWAU'
      );

      console.log("EmailJS result:", result);

      if (result.text === 'OK') {
        toast("Message Sent Successfully! We'll get back to you within 24 hours.");
        setFormData({
          user_name: '',
          user_email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error("Failed to send email: " + result.text);
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      
      let errorMessage = "Please try again or contact us directly.";
      
      // Check specifically for Gmail API authentication scope error
      if (error instanceof Error && 
          error.message.includes("Gmail_API") && 
          error.message.includes("authentication scopes")) {
        setShowAlternativeContact(true);
        errorMessage = "We're experiencing technical difficulties with our email system. Please use alternative contact methods shown below.";
      } else if (error instanceof Error) {
        errorMessage = "Error: " + error.message;
      }
      
      toast.error("Failed to Send Message: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MessageSquare className="h-6 w-6 mr-2 text-brand-purple" />
          Send a Message
        </h2>
        
        {showAlternativeContact && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <p className="font-medium">Email system currently unavailable</p>
            <p className="mt-1">Please contact us directly at:</p>
            <ul className="mt-2 list-disc list-inside">
              <li>Email: Support@techlearn.edu</li>
              <li>Phone: +91 6232075690</li>
            </ul>
          </div>
        )}
        
        <form ref={form} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="user_name" className="block font-medium mb-2">Full Name</label>
            <Input 
              id="user_name" 
              name="user_name" 
              placeholder="Your name" 
              value={formData.user_name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="user_email" className="block font-medium mb-2">Email Address</label>
            <Input 
              id="user_email" 
              name="user_email" 
              type="email" 
              placeholder="your.email@example.com" 
              value={formData.user_email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block font-medium mb-2">Subject</label>
            <Input 
              id="subject" 
              name="subject" 
              placeholder="How can we help?" 
              value={formData.subject} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block font-medium mb-2">Message</label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Tell us more about your inquiry..." 
              rows={6} 
              value={formData.message} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand-purple hover:bg-brand-purple-hover py-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;