import { supabase } from '../config/supabase';

/**
 * This utility function creates all the necessary tables in Supabase
 * directly from the browser. Use when you can't run the NodeJS setup script.
 */
export const createSupabaseTables = async () => {
  try {
    console.log('Creating tables in Supabase...');
    
    // Create profiles table
    const createProfilesTable = `
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
    `;
    
    // Create experiences table
    const createExperiencesTable = `
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
    `;
    
    // Create education table
    const createEducationTable = `
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
    `;
    
    // Create skills table
    const createSkillsTable = `
      CREATE TABLE IF NOT EXISTS skills (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        level SMALLINT NOT NULL CHECK (level >= 1 AND level <= 5),
        category TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Create languages table
    const createLanguagesTable = `
      CREATE TABLE IF NOT EXISTS languages (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        proficiency TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Array of SQL statements to execute
    const statements = [
      createProfilesTable,
      createExperiencesTable,
      createEducationTable,
      createSkillsTable,
      createLanguagesTable
    ];
    
    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('pgexec', { query: statement });
      
      if (error) {
        console.error('Error executing SQL:', error.message);
        throw new Error(`SQL execution failed: ${error.message}`);
      }
    }
    
    // Set up Row Level Security (RLS)
    const rlsStatements = [
      // Enable RLS on tables
      `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE education ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE skills ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE languages ENABLE ROW LEVEL SECURITY;`,
      
      // Create policies for profiles
      `CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);`,
      `CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);`,
      
      // Create policies for experiences
      `CREATE POLICY "Users can view their own experiences" ON experiences FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own experiences" ON experiences FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update their own experiences" ON experiences FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own experiences" ON experiences FOR DELETE USING (auth.uid() = user_id);`,
      
      // Create policies for education
      `CREATE POLICY "Users can view their own education" ON education FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own education" ON education FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update their own education" ON education FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own education" ON education FOR DELETE USING (auth.uid() = user_id);`,
      
      // Create policies for skills
      `CREATE POLICY "Users can view their own skills" ON skills FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update their own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own skills" ON skills FOR DELETE USING (auth.uid() = user_id);`,
      
      // Create policies for languages
      `CREATE POLICY "Users can view their own languages" ON languages FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own languages" ON languages FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update their own languages" ON languages FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own languages" ON languages FOR DELETE USING (auth.uid() = user_id);`
    ];
    
    // Execute RLS statements
    for (const statement of rlsStatements) {
      const { error } = await supabase.rpc('pgexec', { query: statement });
      
      if (error) {
        // Some errors are expected if policies already exist, so we'll just log them
        console.warn('Warning executing RLS statement:', error.message);
      }
    }
    
    console.log('All tables and policies have been created successfully!');
    return { success: true };
  } catch (error) {
    console.error('Failed to create tables:', error);
    return { success: false, error: String(error) };
  }
}; 