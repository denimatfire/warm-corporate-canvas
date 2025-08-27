-- Add cover_image_path column to articles table
-- This column stores the Supabase Storage path for the cover image
-- Run this in your Supabase SQL editor

ALTER TABLE articles 
ADD COLUMN cover_image_path TEXT;

-- Add a comment to explain what this column is for
COMMENT ON COLUMN articles.cover_image_path IS 'Supabase Storage path for the cover image (e.g., article-covers/filename.jpg)';

-- Update existing articles to have a default value if needed
-- UPDATE articles SET cover_image_path = NULL WHERE cover_image_path IS NULL;
