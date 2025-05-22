
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface CourseEnrollButtonProps {
  course: {
    id: string;
    title: string;
    price: number;
    image: string;
  }
}

const CourseEnrollButton = ({ course }: CourseEnrollButtonProps) => {
  const { addCourse, selectedCourses } = useCart();
  const { toast } = useToast();
  
  // Check if course is already in the cart
  const isInCart = selectedCourses.some(c => c.id === course.id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInCart) {
      addCourse({
        id: course.id,
        title: course.title,
        price: course.price,
        priceINR: course.price * 83, // Calculate priceINR for cart item
        image: course.image
      });
      
      toast({
        title: 'Added to cart',
        description: `${course.title} has been added to your cart.`
      });
    } else {
      toast({
        title: 'Already in cart',
        description: `${course.title} is already in your cart.`
      });
    }
  };
  
  return (
    <Button 
      onClick={handleAddToCart}
      variant="outline"
      className="flex items-center justify-center"
      size="sm"
    >
      <ShoppingCart className="h-4 w-4 mr-1" />
      Enroll
    </Button>
  );
};

export default CourseEnrollButton;
