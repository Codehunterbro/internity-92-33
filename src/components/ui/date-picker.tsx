
import * as React from "react";
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isSameDay, isAfter, isBefore } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  assignmentDates?: Date[];
}

export function DatePicker({ date, setDate, assignmentDates = [] }: DatePickerProps) {
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = React.useState<Date>(startOfWeek(today, { weekStartsOn: 1 }));
  
  // Create lookup for dates with assignments
  const assignmentDatesLookup = assignmentDates.reduce((acc, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    acc[dateKey] = true;
    return acc;
  }, {} as Record<string, boolean>);

  // Function to determine if a date has an assignment
  const hasAssignment = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return assignmentDatesLookup[dateKey];
  };

  // Get days of current week to display
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    return addDays(currentWeekStart, i);
  });

  const navigatePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const navigateNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  // Check if date is past
  const isPastDate = (day: Date) => isBefore(day, today) && !isSameDay(day, today);
  
  // Check if date is future
  const isFutureDate = (day: Date) => isAfter(day, today) && !isSameDay(day, today);

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="sr-only">Open calendar</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  modifiers={{
                    hasAssignment: assignmentDates,
                  }}
                  modifiersStyles={{
                    hasAssignment: {
                      border: '2px solid var(--brand-purple)',
                      borderRadius: '50%',
                    }
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={navigatePreviousWeek} className="h-8 w-8 rounded-lg">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNextWeek} className="h-8 w-8 rounded-lg">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-xs font-medium py-1">
              {day}
            </div>
          ))}
          
          {currentWeek.map((day) => {
            const dayNumber = format(day, 'd');
            const isSelected = date && isSameDay(date, day);
            const hasAssignmentOnDay = hasAssignment(day);
            const isPast = isPastDate(day);
            const isFuture = isFutureDate(day);
            
            return (
              <Button
                key={day.toString()}
                variant="ghost"
                className={cn(
                  "h-14 p-0 rounded-lg flex flex-col items-center justify-center",
                  isSelected ? "bg-brand-purple text-white" : "bg-gray-100",
                  hasAssignmentOnDay && !isSelected && "border-2 border-brand-purple",
                  isPast && "opacity-50",
                  isFuture && "bg-gray-100"
                )}
                onClick={() => setDate(day)}
              >
                <span className={cn(
                  "text-sm",
                  isSelected ? "text-white" : ""
                )}>
                  {dayNumber}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
