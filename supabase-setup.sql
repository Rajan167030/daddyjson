-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'unread'
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for contact form submissions)
CREATE POLICY "Allow contact form submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read submissions
CREATE POLICY "Allow authenticated users to read submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');