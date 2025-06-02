
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
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching achievements for user:', user.id);

      const { data, error: fetchError } = await supabase
        .from('student_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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
      
      // Create a temporary link to download the file
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
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Achievements</h1>
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Achievements</h1>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500">Error loading achievements: {error}</p>
              <Button onClick={fetchAchievements} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Achievements</h1>
        
        {achievements.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Achievements Yet</h3>
              <p className="text-gray-500">
                Complete courses and projects to earn your first achievement!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-brand-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg text-gray-900 truncate">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {achievement.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                        <span className="text-brand-purple font-medium">INTERNITY</span>
                        {achievement.file_type && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{achievement.file_type.toUpperCase()}{formatFileSize(achievement.file_size)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {achievement.attachment_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(achievement)}
                        className="flex items-center gap-2 flex-shrink-0"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Achievements;
