-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create question_sets table
CREATE TABLE IF NOT EXISTS question_sets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_name TEXT NOT NULL,
  question_set_id UUID REFERENCES question_sets(id),
  user_id TEXT, -- For future user authentication
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create interview_responses table
CREATE TABLE IF NOT EXISTS interview_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  video_url TEXT,
  audio_url TEXT,
  transcription TEXT,
  ai_feedback JSONB,
  duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resume_scans table
CREATE TABLE IF NOT EXISTS resume_scans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT, -- For future user authentication
  filename TEXT NOT NULL,
  file_url TEXT,
  extracted_text TEXT,
  ai_feedback JSONB,
  overall_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cover_letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT, -- For future user authentication
  company_name TEXT,
  position TEXT,
  tone TEXT,
  content TEXT NOT NULL,
  resume_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default question sets
INSERT INTO question_sets (name, description, category, difficulty, questions) VALUES
(
  'Software Engineer - Behavioral',
  'Common behavioral questions for software engineering positions',
  'behavioral',
  'medium',
  '[
    {
      "id": "be1",
      "text": "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
      "timeLimit": 180
    },
    {
      "id": "be2", 
      "text": "Describe a challenging project you worked on. What made it challenging and how did you overcome the obstacles?",
      "timeLimit": 240
    },
    {
      "id": "be3",
      "text": "Tell me about a time when you had to learn a new technology quickly. How did you approach it?",
      "timeLimit": 180
    },
    {
      "id": "be4",
      "text": "Describe a situation where you had to make a decision with incomplete information. What was your process?",
      "timeLimit": 180
    }
  ]'::jsonb
),
(
  'Software Engineer - Technical',
  'Technical questions focusing on problem-solving and system design',
  'technical',
  'hard',
  '[
    {
      "id": "te1",
      "text": "How would you design a URL shortening service like bit.ly? Walk me through your approach.",
      "timeLimit": 300
    },
    {
      "id": "te2",
      "text": "Explain the difference between SQL and NoSQL databases. When would you use each?",
      "timeLimit": 240
    },
    {
      "id": "te3",
      "text": "How would you optimize a slow-performing web application? What steps would you take?",
      "timeLimit": 240
    },
    {
      "id": "te4",
      "text": "Describe how you would implement a real-time chat application. What technologies would you use?",
      "timeLimit": 300
    }
  ]'::jsonb
),
(
  'General - Entry Level',
  'Basic questions suitable for entry-level positions across various fields',
  'general',
  'easy',
  '[
    {
      "id": "ge1",
      "text": "Tell me about yourself and why you are interested in this position.",
      "timeLimit": 120
    },
    {
      "id": "ge2",
      "text": "What are your greatest strengths and how do they relate to this role?",
      "timeLimit": 120
    },
    {
      "id": "ge3",
      "text": "Where do you see yourself in 5 years?",
      "timeLimit": 120
    },
    {
      "id": "ge4",
      "text": "Why do you want to work for our company?",
      "timeLimit": 120
    },
    {
      "id": "ge5",
      "text": "Tell me about a time when you faced a challenge and how you overcame it.",
      "timeLimit": 180
    }
  ]'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policies (open for now, can be restricted later with authentication)
CREATE POLICY "Allow all operations on question_sets" ON question_sets FOR ALL USING (true);
CREATE POLICY "Allow all operations on interview_sessions" ON interview_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on interview_responses" ON interview_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations on resume_scans" ON resume_scans FOR ALL USING (true);
CREATE POLICY "Allow all operations on cover_letters" ON cover_letters FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_question_set_id ON interview_sessions(question_set_id);
CREATE INDEX IF NOT EXISTS idx_interview_responses_session_id ON interview_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_resume_scans_created_at ON resume_scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON cover_letters(created_at DESC);

-- Ensure interview_sessions has all needed columns
ALTER TABLE IF EXISTS interview_sessions
  ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_questions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure interview_responses has all needed columns
ALTER TABLE IF EXISTS interview_responses
  ADD COLUMN IF NOT EXISTS overall_score INTEGER,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure question_sets.questions is JSONB (backfill if needed)
ALTER TABLE IF EXISTS question_sets
  ALTER COLUMN questions TYPE JSONB USING questions::jsonb;
