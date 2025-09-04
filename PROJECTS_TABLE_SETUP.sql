-- Migration script to create projects table for Projects & Presentations system
-- This follows the same pattern as articles and photos tables

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  content TEXT, -- Detailed project description
  cover_image VARCHAR(500),
  cover_image_path VARCHAR(500),
  
  -- Presentation details
  presentation_type VARCHAR(20) NOT NULL CHECK (presentation_type IN ('file', 'external_url')),
  presentation_url VARCHAR(500), -- For SlideShare, Google Slides, etc.
  presentation_file_path VARCHAR(500), -- For uploaded files
  presentation_file_name VARCHAR(255), -- Original filename
  presentation_file_size BIGINT, -- File size in bytes
  presentation_file_type VARCHAR(100), -- PDF, PPT, PPTX, etc. (MIME types can be long)
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  
  -- Author and timestamps
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_published_at ON projects(published_at);
CREATE INDEX IF NOT EXISTS idx_projects_view_count ON projects(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_projects_author_id ON projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_presentation_type ON projects(presentation_type);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);

-- Create updated_at trigger (following existing pattern)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published projects
CREATE POLICY "Public read access to published projects" ON projects
    FOR SELECT USING (status = 'published');

-- Policy for authenticated users to read their own projects
CREATE POLICY "Users can read their own projects" ON projects
    FOR SELECT USING (auth.uid() = author_id);

-- Policy for authenticated users to insert their own projects
CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Policy for authenticated users to update their own projects
CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = author_id);

-- Policy for authenticated users to delete their own projects
CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = author_id);

-- Insert some sample categories (optional)
INSERT INTO projects (title, slug, description, presentation_type, presentation_url, category, status, is_featured, author_id) VALUES
('Sample Academic Presentation', 'sample-academic-presentation', 'A sample academic presentation showcasing research findings', 'external_url', 'https://slideshare.net/sample', 'Academic', 'published', true, (SELECT id FROM auth.users LIMIT 1)),
('Technical Project Demo', 'technical-project-demo', 'Demonstration of a technical project with implementation details', 'external_url', 'https://docs.google.com/presentation/sample', 'Technical', 'published', false, (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (slug) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE projects IS 'Stores project presentations and documents with support for both file uploads and external URLs';
COMMENT ON COLUMN projects.presentation_type IS 'Type of presentation: file (uploaded) or external_url (link to external platform)';
COMMENT ON COLUMN projects.presentation_url IS 'External URL for presentations hosted on platforms like SlideShare, Google Slides, etc.';
COMMENT ON COLUMN projects.presentation_file_path IS 'Path to uploaded presentation file in Supabase Storage';
COMMENT ON COLUMN projects.view_count IS 'Number of times the project has been viewed';
COMMENT ON COLUMN projects.download_count IS 'Number of times the project has been downloaded (for file uploads)';
COMMENT ON COLUMN projects.is_featured IS 'Whether this project should be featured on the homepage';
