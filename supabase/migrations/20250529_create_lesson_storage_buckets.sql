
-- Create storage buckets for lesson resources
INSERT INTO storage.buckets (id, name, public) VALUES 
('lesson_resources', 'lesson_resources', true),
('lesson_videos', 'lesson_videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for lesson resources bucket
CREATE POLICY "Users can view lesson resources" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'lesson_resources');

CREATE POLICY "Admins can upload lesson resources" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lesson_resources' AND (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
));

CREATE POLICY "Admins can update lesson resources" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'lesson_resources' AND (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
));

CREATE POLICY "Admins can delete lesson resources" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'lesson_resources' AND (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
));

-- Create policies for lesson videos bucket
CREATE POLICY "Users can view lesson videos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'lesson_videos');

CREATE POLICY "Admins can upload lesson videos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lesson_videos' AND (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
));

CREATE POLICY "Admins can update lesson videos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'lesson_videos' AND (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
));

CREATE POLICY "Admins can delete lesson videos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'lesson_videos' AND (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
));
