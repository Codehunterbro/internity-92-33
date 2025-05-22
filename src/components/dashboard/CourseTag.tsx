
import { cn } from '@/lib/utils';

interface CourseTagProps {
  tag: string;
  className?: string;
}

const CourseTag = ({ tag, className }: CourseTagProps) => {
  return (
    <span 
      className={cn(
        "text-xs font-medium bg-secondary px-2 py-1 rounded-full text-brand-purple",
        className
      )}
    >
      {tag}
    </span>
  );
};

export default CourseTag;
