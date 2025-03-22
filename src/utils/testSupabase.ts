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
 * Initialize Supabase with a test user and profile
 * This will create a test user if it doesn't already exist
 */
export const initializeSupabase = async () => {
  try {
    // Try to sign in with our test credentials
    const testEmail = 'test.user@gmail.com'; // Changed from admin@example.com
    const testPassword = 'Password123!';
    
    console.log('Checking if test user exists...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    // If we can sign in, the user already exists
    if (signInData?.user) {
      console.log('Test user already exists');
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();
      
      if (profileError && profileError.message.includes('does not exist')) {
        // Table doesn't exist
        return { success: false, error: 'The profiles table does not exist. Please create tables first.' };
      }
      
      if (!profile) {
        // Create profile for existing user
        console.log('Creating profile for existing user');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: signInData.user.id,
            full_name: 'Test User',
            title: 'Software Developer',
            email: testEmail
          });
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          return { success: false, error: insertError.message };
        }
      }
      
      return { success: true };
    }
    
    // If sign in fails with 'Invalid login credentials', we need to create the user
    if (signInError && signInError.message.includes('Invalid login credentials')) {
      console.log('Test user does not exist, creating...');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword
      });
      
      if (signUpError) {
        console.error('Error creating test user:', signUpError);
        return { success: false, error: signUpError.message };
      }
      
      if (!signUpData?.user) {
        return { success: false, error: 'Failed to create user' };
      }
      
      console.log('Test user created, inserting profile data');
      
      // Create profile for new user
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: signUpData.user.id,
          full_name: 'Test User',
          title: 'Software Developer',
          email: testEmail
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
        if (insertError.message.includes('does not exist')) {
          return { success: false, error: 'The profiles table does not exist. Please create tables first.' };
        }
        return { success: false, error: insertError.message };
      }
      
      return { success: true };
    }
    
    // Any other error
    if (signInError) {
      console.error('Error checking for existing user:', signInError);
      return { success: false, error: signInError.message };
    }
    
    return { success: false, error: 'Unknown error initializing Supabase' };
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    return { success: false, error: String(error) };
  }
}; 