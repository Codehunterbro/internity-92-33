import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePurchasedCourses } from '@/contexts/PurchasedCoursesContext';
import { Book } from 'lucide-react';

interface CourseEnrollButtonProps {
  course: {
    id: string | number;
    title: string;
    price: number;
    priceINR?: number;
    image: string;
  };
}

const CourseEnrollButton = ({ course }: CourseEnrollButtonProps) => {
  const { addCourse, selectedCourses } = useCart();
  const { user } = useAuth();
  const { purchasedCourses } = usePurchasedCourses();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Convert course ID to string for consistent comparison
  const courseStringId = String(course.id);
  const isEnrolled = selectedCourses.some(c => c.id === courseStringId);
  
  // Check if this course is already purchased
  const isPurchased = purchasedCourses?.some(pc => pc.id === courseStringId);

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add courses to your cart",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    addCourse({
      id: courseStringId,
      title: course.title,
      price: course.price,
      priceINR: 3500, // Standardized INR price
      image: course.image,
    });
  };
  
  const handleOpenCourse = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/learn/course/${courseStringId}`);
  };

  if (isPurchased) {
    return (
      <Button
        onClick={handleOpenCourse}
        className="whitespace-nowrap bg-green-600 hover:bg-green-700 text-white"
      >
        <Book className="h-4 w-4 mr-1" />
        Open Course
      </Button>
    );
  }

  return (
    <Button
      onClick={handleEnroll}
      variant={isEnrolled ? "secondary" : "default"}
      className={`whitespace-nowrap ${isEnrolled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-brand-purple hover:bg-brand-purple/90'}`}
      disabled={isEnrolled}
    >
      {isEnrolled ? 'Added' : 'Add to Cart'}
    </Button>
  );
};

export default CourseEnrollButton;
