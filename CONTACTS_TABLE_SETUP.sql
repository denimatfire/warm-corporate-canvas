-- Create contacts table for storing contact form submissions
-- Run this in your Supabase SQL editor

-- Create the contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  -- Add indexes for better performance
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
-- Allow anyone to insert (submit contact forms)
CREATE POLICY "Allow public contact form submissions" ON contacts
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all contacts (for admin purposes)
CREATE POLICY "Allow authenticated users to read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update contact status
CREATE POLICY "Allow authenticated users to update contacts" ON contacts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete contacts
CREATE POLICY "Allow authenticated users to delete contacts" ON contacts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO contacts (name, email, message, status) VALUES
--   ('John Doe', 'john@example.com', 'This is a test message', 'new'),
--   ('Jane Smith', 'jane@example.com', 'Another test message', 'read');

-- Grant necessary permissions
GRANT ALL ON contacts TO authenticated;
GRANT INSERT ON contacts TO anon;

-- Create a view for contact statistics (optional)
CREATE OR REPLACE VIEW contact_stats AS
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'new') as new_count,
  COUNT(*) FILTER (WHERE status = 'read') as read_count,
  COUNT(*) FILTER (WHERE status = 'replied') as replied_count,
  COUNT(*) FILTER (WHERE status = 'archived') as archived_count
FROM contacts;

-- Grant access to the view
GRANT SELECT ON contact_stats TO authenticated;
