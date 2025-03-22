import { supabase } from '../config/supabase';

/**
 * Test Supabase connection and database tables
 * This function checks:
 * 1. If we can connect to Supabase
 * 2. If tables exist by trying to select from them
 */
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Simple check if we can reach Supabase at all - using a simpler method
    const { data: configData, error: configError } = await supabase.from('_config').select('name').limit(1).maybeSingle();
    
    if (configError && !configError.message.includes('does not exist')) {
      console.error('Error connecting to Supabase:', configError.message);
      return { success: false, error: configError.message };
    } else {
      console.log('Supabase connection appears to be working');
    }
    
    // Check each table by trying to select from it
    const tables = ['profiles', 'experiences', 'education', 'skills', 'languages'];
    const existingTables = [];
    const missingTables = [];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        
        if (!error) {
          existingTables.push(table);
        } else if (error.message.includes('does not exist')) {
          missingTables.push(table);
        } else {
          console.warn(`Error checking table ${table}:`, error.message);
        }
      } catch (err) {
        missingTables.push(table);
      }
    }
    
    if (missingTables.length > 0) {
      console.warn(`Missing tables: ${missingTables.join(', ')}`);
      return { 
        success: false, 
        error: `Missing tables: ${missingTables.join(', ')}`,
        existingTables
      };
    }
    
    console.log('All tables exist:', existingTables.join(', '));
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
        try {
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
        } catch (profileErr) {
          console.error('Error creating profile:', profileErr);
          return { success: false, error: String(profileErr) };
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