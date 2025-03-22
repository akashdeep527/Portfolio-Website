// This script will help set up your Supabase database
// Run with: node scripts/setupSupabase.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Starting Supabase setup...');
  
  try {
    // Read and execute the SQL script
    const sqlFilePath = path.join(__dirname, '..', 'supabase', 'setup.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      console.error(`SQL file not found: ${sqlFilePath}`);
      process.exit(1);
    }
    
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL script by semicolons to execute each statement separately
    const statements = sqlScript
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each SQL statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('pgexec', { query: statement + ';' });
        
        if (error) {
          console.warn(`Warning on statement ${i + 1}: ${error.message}`);
        }
      } catch (err) {
        console.warn(`Could not execute statement ${i + 1}: ${err.message}`);
      }
    }
    
    console.log('Database setup completed!');
    
    // Create a test user
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'Password123!'
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log('Test user already exists.');
      } else {
        console.error('Error creating test user:', error.message);
      }
    } else if (data.user) {
      console.log('Test user created!');
      console.log('Email: admin@example.com');
      console.log('Password: Password123!');
      
      // Create a profile for the test user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: 'Admin User',
          title: 'Portfolio Owner',
          about: 'This is a test profile for the portfolio website.',
          email: data.user.email,
          phone: '123-456-7890',
          location: 'New York, NY',
          website: 'https://example.com'
        });
      
      if (profileError) {
        console.error('Error creating profile:', profileError.message);
      } else {
        console.log('Test profile created!');
      }
    }
    
    console.log('Done!');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main(); 