
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

interface ProfileEditSectionProps {
  user: User;
  currentName: string;
  currentPicture?: string | null;
  onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ProfileEditSection = ({ user, currentName, currentPicture, onClose }: ProfileEditSectionProps) => {
  const [newName, setNewName] = useState(currentName);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName }
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', user.id);

      toast({
        title: "Profile updated",
        description: "Your name has been updated successfully."
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const validateFile = (file: File) => {
    if (!file) {
      throw new Error('No file selected');
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File is too large. Maximum size is 5MB');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Validate the file
      validateFile(file);
      
      // Create a folder structure with user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      if (!data.publicUrl) throw new Error('Failed to get public URL');

      // Update profile with new picture URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });

      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
        <div className="relative mx-auto w-24 h-24 mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={currentPicture || undefined} />
            <AvatarFallback>{newName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <label 
            className="absolute bottom-0 right-0 p-1 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
            htmlFor="picture-upload"
          >
            <Upload className={`h-4 w-4 text-white ${isUploading ? 'animate-spin' : ''}`} />
          </label>
          <input
            id="picture-upload"
            type="file"
            className="hidden"
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
        {isUploading && (
          <p className="text-sm text-purple-600">Uploading...</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium block mb-1">
            Display Name
          </label>
          <Input
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateProfile}
            className="bg-brand-purple hover:bg-brand-purple/90"
            disabled={isUploading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditSection;
