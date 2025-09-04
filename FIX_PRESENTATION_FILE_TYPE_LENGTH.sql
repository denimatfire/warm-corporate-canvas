-- Fix presentation_file_type column length to accommodate longer MIME types
-- PowerPoint MIME types can be up to 75+ characters

ALTER TABLE projects 
ALTER COLUMN presentation_file_type TYPE VARCHAR(100);

-- Add comment for documentation
COMMENT ON COLUMN projects.presentation_file_type IS 'MIME type of the presentation file (e.g., application/pdf, application/vnd.openxmlformats-officedocument.presentationml.presentation)';
