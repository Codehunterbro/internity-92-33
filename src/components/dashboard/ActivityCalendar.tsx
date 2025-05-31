
import React, { useState, useEffect, useRef } from 'react';
import { getUserAttendance } from '@/services/attendanceService';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityCalendarProps {
  data?: {
    month: string;
    days: {
      type: 'present' | 'absent' | 'project' | 'none';
      day: number;
    }[][];
  }[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate dates for the year
  const generateYearDates = () => {
    const dates = [];
    const startDate = new Date();
    startDate.setMonth(0, 1); // January 1st of current year
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(new Date(date));
    }
    return dates;
  };

  const dates = generateYearDates();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Fetch attendance data from database
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!user) return;
      
      try {
        const attendance = await getUserAttendance(user.id);
        const attendanceMap: Record<string, string> = {};
        
        attendance.forEach(record => {
          attendanceMap[record.date] = record.status;
        });
        
        setAttendanceData(attendanceMap);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, [user]);

  // Scroll to current month on mount
  useEffect(() => {
    if (containerRef.current) {
      const currentMonth = new Date().getMonth();
      const monthWidth = containerRef.current.scrollWidth / 12;
      const scrollPosition = currentMonth * monthWidth - (containerRef.current.clientWidth / 2) + (monthWidth / 2);
      containerRef.current.scrollLeft = Math.max(0, scrollPosition);
    }
  }, []);

  const getDayColor = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const status = attendanceData[dateStr];
    
    switch (status) {
      case 'present':
        return 'bg-green-400';
      case 'absent':
        return 'bg-red-400';
      default:
        return 'bg-gray-200';
    }
  };

  // Handle mouse enter for tooltip
  const handleMouseEnter = (e: React.MouseEvent, date: Date) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dateStr = date.toISOString().split('T')[0];
    const status = attendanceData[dateStr] || 'no-data';
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    const statusText = {
      'present': 'Present',
      'absent': 'Absent',
      'no-data': 'No data'
    };
    
    setTooltip({
      show: true,
      content: `${formatDate(date)} - ${statusText[status]}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  // Handle mouse leave for tooltip
  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  // Group dates by weeks for grid layout
  const getWeeksData = () => {
    const weeks = [];
    const year = new Date().getFullYear();
    
    // Get first day of year and calculate offset
    const firstDay = new Date(year, 0, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Create weeks array
    for (let week = 0; week < 53; week++) {
      const weekDates = [];
      for (let day = 0; day < 7; day++) {
        const dateIndex = week * 7 + day - firstDayOfWeek;
        if (dateIndex >= 0 && dateIndex < dates.length) {
          weekDates.push(dates[dateIndex]);
        } else {
          weekDates.push(null);
        }
      }
      weeks.push(weekDates);
    }
    
    return weeks;
  };

  const weeksData = getWeeksData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Activity</h2>
      <div className="overflow-x-auto" ref={containerRef}>
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-3">
            <div className="w-5"></div> {/* Space for week day labels */}
            <div className="flex flex-1 justify-between">
              {months.map((month, idx) => (
                <div key={idx} className="px-2 text-sm font-medium">{month}</div>
              ))}
            </div>
          </div>
          
          <div className="flex">
            {/* Calendar grid */}
            <div className="flex flex-1 gap-1">
              {weeksData.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((date, dayIdx) => {
                    if (!date) {
                      return <div key={dayIdx} className="w-6 h-6"></div>;
                    }
                    
                    return (
                      <div 
                        key={dayIdx} 
                        className={`w-6 h-6 rounded-sm ${getDayColor(date)} hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                        onMouseEnter={(e) => handleMouseEnter(e, date)}
                        onMouseLeave={handleMouseLeave}
                        title={`${date.toLocaleDateString()} - ${attendanceData[date.toISOString().split('T')[0]] || 'No data'}`}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-end mt-4 gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span>No Data</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 bg-gray-800 text-white px-2 py-1 rounded text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;
