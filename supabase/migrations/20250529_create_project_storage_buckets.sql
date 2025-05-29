
-- Create storage buckets for project documents
INSERT INTO storage.buckets (id, name, public) VALUES 
('Major Project Documents', 'Major Project Documents', true),
('Minor Project Documents', 'Minor Project Documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for Major Project Documents bucket
CREATE POLICY "Users can upload major project files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'Major Project Documents');

CREATE POLICY "Users can view major project files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'Major Project Documents');

CREATE POLICY "Users can update their major project files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'Major Project Documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their major project files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'Major Project Documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for Minor Project Documents bucket
CREATE POLICY "Users can upload minor project files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'Minor Project Documents');

CREATE POLICY "Users can view minor project files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'Minor Project Documents');

CREATE POLICY "Users can update their minor project files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'Minor Project Documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their minor project files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'Minor Project Documents' AND auth.uid()::text = (storage.foldername(name))[1]);
