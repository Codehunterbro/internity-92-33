
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface CourseInstructorProps {
  instructor: string;
  instructorRole: string;
}

const CourseInstructor = ({ instructor, instructorRole }: CourseInstructorProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center cursor-pointer">
          <div className="w-8 h-8 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple text-xs font-bold">
            {instructor.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{instructor}</p>
            <p className="text-xs text-muted-foreground">{instructorRole}</p>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">{instructor}</p>
          <p className="text-xs text-muted-foreground">{instructorRole}</p>
          <p className="text-xs">Expert in their field with years of industry experience.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CourseInstructor;
