
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: 'Advanced Python Programming Course',
      institution: 'INTERNITY',
      date: 'Jan 2023',
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      institution: 'INTERNITY',
      date: 'Mar 2023',
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      institution: 'INTERNITY',
      date: 'Jun 2023',
    },
    {
      id: 4,
      title: 'Mobile App Development',
      institution: 'INTERNITY',
      date: 'Aug 2023',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Achievements</h1>
        
        <div className="grid gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{achievement.title}</h3>
                    <div className="flex gap-3 text-sm text-gray-500">
                      <span className="text-brand-purple">{achievement.institution}</span>
                      <span>•</span>
                      <span>{achievement.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Achievements;
