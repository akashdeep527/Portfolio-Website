import { supabase } from '../config/supabase';

/**
 * Check if a table exists by trying to select from it
 */
const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error || !error.message.includes('does not exist');
  } catch (err) {
    return false;
  }
};

/**
 * This utility function creates all the necessary tables in Supabase
 * directly from the browser. Use when you can't run the NodeJS setup script.
 */
export const createSupabaseTables = async () => {
  try {
    console.log('Creating tables in Supabase...');
    
    // Define the expected tables
    const expectedTables = [
      'profiles', 
      'experiences', 
      'education', 
      'skills', 
      'languages'
    ];
    
    const createdTables: string[] = [];
    const failedTables: Array<{name: string, error: string}> = [];
    
    // Check which tables already exist
    for (const tableName of expectedTables) {
      const exists = await tableExists(tableName);
      if (exists) {
        console.log(`Table ${tableName} already exists`);
        createdTables.push(tableName);
      } else {
        failedTables.push({ 
          name: tableName, 
          error: "Table doesn't exist and can't be created through the browser interface" 
        });
      }
    }
    
    if (failedTables.length > 0) {
      // Generate SQL instructions for the user to run in Supabase Dashboard
      const sqlInstructions = `
-- Run this SQL in the Supabase Dashboard SQL Editor:

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
  start_date TEXT NOT NULL,
  end_date TEXT,
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
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  level SMALLINT NOT NULL CHECK (level >= 1 AND level <= 5),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Set up RLS policies for experiences
CREATE POLICY "Users can view their own experiences" ON experiences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own experiences" ON experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own experiences" ON experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own experiences" ON experiences FOR DELETE USING (auth.uid() = user_id);

-- Set up RLS policies for education
CREATE POLICY "Users can view their own education" ON education FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own education" ON education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own education" ON education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own education" ON education FOR DELETE USING (auth.uid() = user_id);

-- Set up RLS policies for skills
CREATE POLICY "Users can view their own skills" ON skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON skills FOR DELETE USING (auth.uid() = user_id);

-- Set up RLS policies for languages
CREATE POLICY "Users can view their own languages" ON languages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own languages" ON languages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own languages" ON languages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own languages" ON languages FOR DELETE USING (auth.uid() = user_id);
`;

      console.log('SQL Instructions for manual table creation:', sqlInstructions);
      
      const message = `Browser-based table creation failed. Please use the SQL Editor in the Supabase Dashboard to create these tables: ${failedTables.map(t => t.name).join(', ')}`;
      console.warn(message);
      
      return { 
        success: false,
        error: "Tables need to be created in the Supabase Dashboard SQL Editor",
        sqlInstructions,
        message
      };
    }
    
    console.log('All tables have been verified successfully!');
    return { success: true, tables: createdTables };
  } catch (error) {
    console.error('Failed to create tables:', error);
    return { success: false, error: String(error) };
  }
}; 