
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const OrderSummary = () => {
  const { selectedCourses, removeCourse } = useCart();
  
  const subtotal = selectedCourses.reduce((total, course) => total + course.priceINR, 0);
  const discount = 1000; // Fixed discount of ₹1000 instead of percentage
  const total = subtotal - discount;

  return (
    <Card className="mx-2 md:mx-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
        <CardDescription className="text-sm md:text-base">Review your selection</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="space-y-4">
          {selectedCourses.map((course) => (
            <div key={course.id} className="flex flex-col md:flex-row items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg">
              <div className="w-full md:w-32 h-20 md:h-24">
                <AspectRatio ratio={4/3} className="bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm md:text-base line-clamp-2 md:truncate">{course.title}</h4>
                <p className="text-brand-purple font-medium mt-1 md:mt-2 text-sm md:text-base">₹{course.priceINR.toLocaleString('en-IN')}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCourse(course.id)}
                className="text-gray-400 hover:text-red-500 self-start md:self-center"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {selectedCourses.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm md:text-base">Your cart is empty</p>
              <Button 
                variant="link" 
                className="mt-2 text-brand-purple text-sm md:text-base"
                asChild
              >
                <Link to="/dashboard/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 mt-4 md:mt-6 pt-4 space-y-2">
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-muted-foreground">Bundle discount</span>
            <span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-bold text-base md:text-lg pt-2 border-t border-gray-200 mt-2">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-6 bg-gray-50 rounded-lg p-3 md:p-4">
          <h4 className="font-medium text-sm md:text-base mb-3">Program Benefits:</h4>
          <ul className="space-y-2">
            <li className="flex items-start text-xs md:text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>6 months intensive learning phase</span>
            </li>
            <li className="flex items-start text-xs md:text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>6 months internship with industry partners</span>
            </li>
            <li className="flex items-start text-xs md:text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Personalized mentorship and career guidance</span>
            </li>
            <li className="flex items-start text-xs md:text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Industry-recognized certification</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
