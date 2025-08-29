-- Photos Database Setup for Portfolio Website
-- Run this in your Supabase SQL Editor

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  category VARCHAR(100),
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_photos_published ON photos(is_published);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_author_id ON photos(author_id);

-- Enable Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view published photos
CREATE POLICY "Public can view published photos" ON photos
  FOR SELECT USING (is_published = true);

-- Authenticated users can view their own photos
CREATE POLICY "Users can view own photos" ON photos
  FOR SELECT USING (auth.uid() = author_id);

-- Authenticated users can insert their own photos
CREATE POLICY "Users can insert own photos" ON photos
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Authenticated users can update their own photos
CREATE POLICY "Users can update own photos" ON photos
  FOR UPDATE USING (auth.uid() = author_id);

-- Authenticated users can delete their own photos
CREATE POLICY "Users can delete own photos" ON photos
  FOR DELETE USING (auth.uid() = author_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_photos_updated_at 
  BEFORE UPDATE ON photos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove if not needed)
INSERT INTO photos (title, caption, category, image_url, image_path, is_published, tags, metadata) VALUES
('Henkle Hackathon', 'Presenting our project on Use of AIML in Supplychain in Control Tower at the Henkle Hackathon Finalist Presentation', 'Personal', '/Henkle.JPG', '/Henkle.JPG', true, ARRAY['hackathon', 'AI/ML', 'supply chain'], '{"location": "Henkle", "event_type": "hackathon"}'),
('MBA Convocation', 'Celebrating the completion of my MBA journey! A milestone achievement that represents years of hard work and dedication ✨', 'Academic', '/MBAconvocation.JPG', '/MBAconvocation.JPG', true, ARRAY['graduation', 'MBA', 'academic'], '{"degree": "MBA", "institution": "University"}'),
('M.Tech Convocation', 'Another milestone achieved! M.Tech convocation - representing the culmination of advanced studies and research in technology 🔬', 'Academic', '/MtechConvocation.JPG', '/MtechConvocation.JPG', true, ARRAY['graduation', 'M.Tech', 'research'], '{"degree": "M.Tech", "institution": "University"}');

-- Grant necessary permissions
GRANT ALL ON photos TO authenticated;
GRANT SELECT ON photos TO anon;
