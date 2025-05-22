
import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';
import MapSection from '@/components/contact/MapSection';

const Contact = () => {
  // Function to handle registration button click
  const handleRegistrationClick = () => {
    // Navigate to registration page
    window.location.href = '/dashboard/courses';
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-brand-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Have questions or need assistance? We're here to help!
            </p>
            
            {/* Register Now Button - Visible and Enabled */}
            
          </div>
        </section>
        
        {/* Contact Info & Form */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
                <p className="text-lg text-gray-700 mb-10">
                  Whether you're curious about our courses, need technical assistance, or want to 
                  explore partnership opportunities, our team is ready to answer your questions.
                </p>
                
                <div className="space-y-6">
        <Card>
          <CardContent className="flex items-start p-6">
            <Mail className="h-6 w-6 text-brand-purple mr-4" />
            <div>
              <h3 className="font-bold mb-1">Email Us</h3>
              <p className="text-gray-700">support@theinternity.com</p>
              <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-start p-6">
            <Phone className="h-6 w-6 text-brand-purple mr-4" />
            <div>
              <h3 className="font-bold mb-1">Call Us</h3>
              <p className="text-gray-700">+91 6232075690</p>
              <p className="text-gray-500 text-sm">Mon-Fri, 9am-6pm IST</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-start p-6">
            <MapPin className="h-6 w-6 text-brand-purple mr-4" />
            <div>
              <h3 className="font-bold mb-1">Visit Us</h3>
              <p className="text-gray-700">Bussiness Incubation , Shri Shankaracharya Technical Campus , Junwani, Chhattisgarh 490020</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-start p-6">
            <Clock className="h-6 w-6 text-brand-purple mr-4" />
            <div>
              <h3 className="font-bold mb-1">Monday-Friday: 9am-5pm IST</h3>
              <p className="text-gray-700">Saturday: 10am-4pm IST</p>
              <p className="text-gray-700">Sunday: Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Find Us</h2>
            <MapSection />
          </div>
        </section>
        
        {/* FAQ Section */}
        
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
