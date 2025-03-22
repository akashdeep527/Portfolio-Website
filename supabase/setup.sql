-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  about TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL, -- storing as text for easier handling
  end_date TEXT, -- can be null for current positions
  description TEXT,
  current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date TEXT NOT NULL, -- storing as text for easier handling
  end_date TEXT, -- can be null for ongoing education
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  level SMALLINT NOT NULL CHECK (level >= 1 AND level <= 5), -- 1-5 for skill level
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  proficiency TEXT NOT NULL, -- e.g., 'Fluent', 'Intermediate', 'Beginner'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies
-- Allow users to view their own data
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Experiences policies
CREATE POLICY "Users can view their own experiences" ON experiences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experiences" ON experiences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences" ON experiences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences" ON experiences
  FOR DELETE USING (auth.uid() = user_id);

-- Education policies
CREATE POLICY "Users can view their own education" ON education
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own education" ON education
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education" ON education
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education" ON education
  FOR DELETE USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Users can view their own skills" ON skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" ON skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" ON skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" ON skills
  FOR DELETE USING (auth.uid() = user_id);

-- Languages policies
CREATE POLICY "Users can view their own languages" ON languages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own languages" ON languages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own languages" ON languages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own languages" ON languages
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at column
CREATE TRIGGER update_profiles_modified
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_experiences_modified
BEFORE UPDATE ON experiences
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_education_modified
BEFORE UPDATE ON education
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_skills_modified
BEFORE UPDATE ON skills
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_languages_modified
BEFORE UPDATE ON languages
FOR EACH ROW EXECUTE FUNCTION update_modified_column(); 