
import React from 'react';

interface ActivityCalendarProps {
  data: {
    month: string;
    days: {
      type: 'present' | 'absent' | 'project' | 'none';
      day: number;
    }[][];
  }[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
  const getDayColor = (type: 'present' | 'absent' | 'project' | 'none') => {
    switch (type) {
      case 'present':
        return 'bg-green-400';
      case 'absent':
        return 'bg-red-400';
      case 'project':
        return 'bg-purple-400';
      default:
        return 'bg-gray-200';
    }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Generate mock data for a full year (12 months)
  const generateFullYearData = () => {
    return months.map(month => ({
      month,
      days: Array(7).fill(null).map(() => 
        Array(6).fill(null).map((_, idx) => ({ 
          type: ['present', 'absent', 'project'][Math.floor(Math.random() * 3)] as 'present' | 'absent' | 'project',
          day: idx + 1
        }))
      )
    }));
  };

  const fullYearData = generateFullYearData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Activity</h2>
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-3">
            <div className="w-5"></div> {/* Space for week day labels */}
            <div className="flex flex-1 justify-between">
              {fullYearData.map((month, idx) => (
                <div key={idx} className="px-2 text-sm font-medium">{month.month}</div>
              ))}
            </div>
          </div>
          
          <div className="flex">
            {/* Calendar grid */}
            <div className="flex flex-1 gap-1">
              {fullYearData.map((month, monthIdx) => (
                <div key={monthIdx} className="flex-1">
                  <div className="grid grid-cols-7 gap-1">
                    {Array(7).fill(null).map((_, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-1">
                        {Array(6).fill(null).map((_, dayIdx) => {
                          const type = ['present', 'absent', 'project'][Math.floor(Math.random() * 3)] as 'present' | 'absent' | 'project';
                          return (
                            <div 
                              key={dayIdx} 
                              className={`w-6 h-6 rounded-sm ${getDayColor(type)}`}
                              title={`${type.charAt(0).toUpperCase() + type.slice(1)}: Day ${dayIdx + 1}`}
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
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
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span>Project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
