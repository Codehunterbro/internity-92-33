import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Clock, GraduationCap, Trophy, FileText } from 'lucide-react';
import ActivityCalendar from '@/components/dashboard/ActivityCalendar';
const Dashboard = () => {
  // Mock data for the dashboard
  const stats = [{
    title: 'Courses Enrolled',
    value: '3',
    icon: <GraduationCap className="h-5 w-5 text-brand-purple" />,
    change: '+1 this month',
    trend: 'up'
  }, {
    title: 'Completed Lessons',
    value: '24',
    icon: <Activity className="h-5 w-5 text-green-500" />,
    change: '70% complete',
    trend: 'up'
  }, {
    title: 'Hours Learned',
    value: '48',
    icon: <Clock className="h-5 w-5 text-yellow-500" />,
    change: '+12 this week',
    trend: 'up'
  }, {
    title: 'Achievements',
    value: '5',
    icon: <Trophy className="h-5 w-5 text-orange-500" />,
    change: 'Bronze level',
    trend: 'neutral'
  }];

  // Mock calendar data for the GitHub-style contribution graph (full year)
  const calendarData = Array(12).fill(null).map((_, monthIdx) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIdx],
    days: Array(7).fill(null).map(() => Array(5).fill(null).map((_, idx) => ({
      type: ['present', 'absent', 'project'][Math.floor(Math.random() * 3)] as 'present' | 'absent' | 'project',
      day: idx + 1
    })))
  }));

  // Mock achievements
  const achievements = [{
    id: 1,
    title: "Advanced Python Programming Course",
    institution: "INTERNITY"
  }, {
    id: 2,
    title: "Web Development Fundamentals",
    institution: "INTERNITY"
  }, {
    id: 3,
    title: "UI/UX Design Principles",
    institution: "INTERNITY"
  }, {
    id: 4,
    title: "Mobile App Development",
    institution: "INTERNITY"
  }];

  // Mock assignments
  const assignments = [{
    id: 1,
    title: "UI/UX Design",
    completed: 8,
    total: 9,
    progress: 90,
    deadline: "02 June"
  }, {
    id: 2,
    title: "Java",
    date: "24 March, 10:30",
    completed: 8,
    total: 9,
    progress: 90
  }];

  // Mock upcoming tests
  const upcomingTests = [{
    id: 1,
    title: "Graphic test",
    description: "Visual Performance Evaluation",
    date: "Wed, 20 Apr",
    time: "11AM - 11:45AM",
    status: "live"
  }, {
    id: 2,
    title: "Graphic test",
    description: "Visual Performance Evaluation",
    date: "Wed, 20 Apr",
    time: "11AM - 11:45AM",
    status: "upcoming",
    countdown: "3h 56m 43s"
  }];
  return <DashboardLayout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Hi Michael !</h1>
          <p className="text-muted-foreground text-lg">
            What do you want to <span className="text-brand-purple">learn</span> today?
          </p>
        </div>

        {/* Activity Calendar - GitHub style (full year) */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Activity</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <ActivityCalendar data={calendarData} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* My Assignments - More minimal */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">My Assignment</CardTitle>
                <Link to="/dashboard/assignments" className="text-purple-600 text-sm font-medium">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {assignments.map(assignment => <div key={assignment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <span className="text-sm text-gray-500">{assignment.completed}/{assignment.total}</span>
                    </div>
                    {assignment.date && <p className="text-xs text-gray-500 mb-1">{assignment.date}</p>}
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1">
                      <div className="bg-orange-500 h-1.5 rounded-full" style={{
                    width: `${assignment.progress}%`
                  }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{assignment.progress}%</span>
                      {assignment.deadline && <span>Deadline: {assignment.deadline}</span>}
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Achievements - Updated to match Achievement page */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Achievements</h2>
            <Link to="/dashboard/achievements" className="text-purple-600 text-sm font-medium">
              View All
            </Link>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {achievements.slice(0, 2).map(achievement => <div key={achievement.id} className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-brand-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-brand-purple">{achievement.institution}</p>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>;
};
export default Dashboard;
