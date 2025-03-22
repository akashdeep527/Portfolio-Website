import { supabase } from '../config/supabase';

/**
 * Test Supabase connection and database tables
 * This function checks:
 * 1. If we can connect to Supabase
 * 2. If all required tables exist
 */
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data: tableData, error: tableError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tableError) {
      console.error('Error connecting to Supabase:', tableError.message);
      return { success: false, error: tableError.message };
    }
    
    console.log('Successfully connected to Supabase!');
    
    // Check if our tables exist
    const tables = ['profiles', 'experiences', 'education', 'skills', 'languages'];
    const existingTables = tableData?.map(t => t.tablename) || [];
    
    const missingTables = tables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.warn(`Missing tables: ${missingTables.join(', ')}`);
      return { 
        success: false, 
        error: `Missing tables: ${missingTables.join(', ')}`,
        existingTables
      };
    }
    
    console.log('All tables exist:', tables.join(', '));
    return { success: true, tables: existingTables };
    
  } catch (error) {
    console.error('Unexpected error testing Supabase connection:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Initialize Supabase by creating a test user and profile
 * This helps verify that authentication and database operations work
 */
export const initializeSupabase = async () => {
  try {
    // Check if we need to create tables
    const { success, error, existingTables } = await testSupabaseConnection();
    
    if (!success) {
      console.log('Connection test failed:', error);
      console.log('Existing tables:', existingTables);
      
      // If you want to auto-create tables, you'd need to run SQL statements here
      
      return { success: false, error };
    }
    
    // Create a test user if needed
    const email = 'admin@example.com';
    const password = 'Password123!';
    
    // Check if user already exists by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // If sign in failed because user doesn't exist, create the user
    if (signInError && signInError.message.includes('Invalid login credentials')) {
      console.log('Creating test user...');
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (signUpError) {
        console.error('Error creating test user:', signUpError.message);
        return { success: false, error: signUpError.message };
      }
      
      // Create user profile
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: 'Admin User',
            title: 'Portfolio Owner',
            about: 'This is a test profile.',
            email: user.email,
            phone: '123-456-7890',
            location: 'New York, NY',
            website: 'https://example.com'
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError.message);
          return { success: false, error: profileError.message };
        }
      }
      
      console.log('Test user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
    } else if (!signInError) {
      console.log('Test user already exists.');
    } else {
      console.error('Error checking user:', signInError.message);
      return { success: false, error: signInError.message };
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Unexpected error initializing Supabase:', error);
    return { success: false, error: String(error) };
  }
}; 