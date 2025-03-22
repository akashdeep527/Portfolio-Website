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
    
    // Array of table names and their creation SQL
    const tablesToCreate = [
      { name: 'profiles', sql: createProfilesTable },
      { name: 'experiences', sql: createExperiencesTable },
      { name: 'education', sql: createEducationTable },
      { name: 'skills', sql: createSkillsTable },
      { name: 'languages', sql: createLanguagesTable }
    ];
    
    const createdTables: string[] = [];
    const failedTables: Array<{name: string, error: string}> = [];
    
    // Check which tables need to be created
    for (const table of tablesToCreate) {
      const exists = await tableExists(table.name);
      
      if (!exists) {
        try {
          console.log(`Creating table: ${table.name}`);
          const { error } = await supabase.rpc('pgexec', { query: table.sql });
          
          if (error) {
            console.error(`Error creating ${table.name}:`, error.message);
            failedTables.push({ name: table.name, error: error.message });
          } else {
            createdTables.push(table.name);
          }
        } catch (err) {
          console.error(`Error creating ${table.name}:`, err);
          failedTables.push({ name: table.name, error: String(err) });
        }
      } else {
        console.log(`Table ${table.name} already exists`);
        createdTables.push(table.name);
      }
    }
    
    // Set up Row Level Security (RLS) only if we successfully created tables
    if (createdTables.length > 0) {
      console.log('Setting up Row Level Security policies...');
      
      // Enable RLS on tables
      const rlsEnableStatements = createdTables.map(table => 
        `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
      );
      
      // Profiles policies
      const profilePolicies = [
        `CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);`,
        `CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);`,
        `CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);`
      ];
      
      // Policies for other tables
      const otherTablesPolicies = ['experiences', 'education', 'skills', 'languages']
        .filter(table => createdTables.includes(table))
        .flatMap(table => [
          `CREATE POLICY "Users can view their own ${table}" ON ${table} FOR SELECT USING (auth.uid() = user_id);`,
          `CREATE POLICY "Users can insert their own ${table}" ON ${table} FOR INSERT WITH CHECK (auth.uid() = user_id);`,
          `CREATE POLICY "Users can update their own ${table}" ON ${table} FOR UPDATE USING (auth.uid() = user_id);`,
          `CREATE POLICY "Users can delete their own ${table}" ON ${table} FOR DELETE USING (auth.uid() = user_id);`
        ]);
      
      // All RLS statements
      const rlsStatements = [
        ...rlsEnableStatements,
        ...profilePolicies,
        ...otherTablesPolicies
      ];
      
      // Execute RLS statements
      for (const statement of rlsStatements) {
        try {
          const { error } = await supabase.rpc('pgexec', { query: statement });
          
          if (error && !error.message.includes('already exists')) {
            console.warn('Warning executing RLS statement:', error.message);
          }
        } catch (err) {
          console.warn('Warning executing RLS statement:', err);
        }
      }
    }
    
    if (failedTables.length > 0) {
      const message = `Created ${createdTables.length} tables, but failed to create ${failedTables.length} tables: ${failedTables.map(t => t.name).join(', ')}`;
      console.warn(message);
      return { 
        success: createdTables.length > 0, 
        partialSuccess: createdTables.length > 0 && failedTables.length > 0,
        createdTables,
        failedTables,
        message
      };
    }
    
    console.log('All tables and policies have been created successfully!');
    return { success: true, tables: createdTables };
  } catch (error) {
    console.error('Failed to create tables:', error);
    return { success: false, error: String(error) };
  }
}; 