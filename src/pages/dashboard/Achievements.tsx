import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Download, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
interface Achievement {
  id: string;
  title: string;
  description?: string;
  attachment_url?: string;
  file_size?: string;
  file_type?: string;
  uploaded_by?: string;
}
const Achievements = () => {
  const {
    user
  } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchAchievements = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching achievements for user:', user.id);
      const {
        data,
        error: fetchError
      } = await supabase.from('student_achievements').select('*').eq('user_id', user.id);
      if (fetchError) {
        console.error('Error fetching achievements:', fetchError);
        throw fetchError;
      }
      console.log('Fetched achievements:', data);
      setAchievements(data || []);
    } catch (error) {
      console.error('Error in fetchAchievements:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch achievements');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = async (achievement: Achievement) => {
    if (!achievement.attachment_url) {
      console.log('No attachment URL available');
      return;
    }
    try {
      console.log('Downloading achievement:', achievement.title);
      const link = document.createElement('a');
      link.href = achievement.attachment_url;
      link.download = `${achievement.title}.${achievement.file_type || 'pdf'}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading achievement:', error);
    }
  };
  const formatFileSize = (sizeStr?: string) => {
    if (!sizeStr) return '';
    return ` (${sizeStr})`;
  };
  useEffect(() => {
    fetchAchievements();
  }, [user]);
  if (isLoading) {
    return <DashboardLayout>
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">My Achievements</h1>
          <div className="grid gap-4 md:gap-6">
            {Array.from({
            length: 3
          }).map((_, index) => <Card key={index}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-10 md:h-12 w-10 md:w-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-3 md:h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </DashboardLayout>;
  }
  if (error) {
    return <DashboardLayout>
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">My Achievements</h1>
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <p className="text-red-500 text-sm md:text-base">Error loading achievements: {error}</p>
              <Button onClick={fetchAchievements} className="mt-4" size="sm">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>;
  }
  return <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">My Achievements</h1>
        
        {achievements.length === 0 ? <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <GraduationCap className="h-10 md:h-12 w-10 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No Achievements Yet</h3>
              <p className="text-gray-500 text-sm md:text-base">
                Complete courses and projects to earn your first achievement!
              </p>
            </CardContent>
          </Card> : <div className="grid gap-4 md:gap-6">
            {achievements.map(achievement => <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                    <div className="h-10 md:h-12 w-10 md:w-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-5 md:h-6 w-5 md:w-6 text-brand-purple" />
                    </div>
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="font-medium text-base md:text-lg text-gray-900 break-words">
                        {achievement.title}
                      </h3>
                      {achievement.description && <p className="md:text-sm text-gray-600 mt-1 break-words text-sm">
                          {achievement.description}
                        </p>}
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500 mt-2">
                        <span className="text-brand-purple font-medium text-base">INTERNITY</span>
                        {achievement.file_type && <>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{achievement.file_type.toUpperCase()}{formatFileSize(achievement.file_size)}</span>
                            </div>
                          </>}
                      </div>
                    </div>
                    {achievement.attachment_url && <Button variant="outline" size="sm" onClick={() => handleDownload(achievement)} className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 text-xs md:text-sm">
                        <Download className="h-3 md:h-4 w-3 md:w-4" />
                        Download
                      </Button>}
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </div>
    </DashboardLayout>;
};
export default Achievements;