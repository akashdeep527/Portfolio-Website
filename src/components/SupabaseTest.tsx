import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { testSupabaseConnection, initializeSupabase } from '../utils/testSupabase';
import { createSupabaseTables } from '../utils/createSupabaseTables';

interface ConnectionStatus {
  connected: boolean;
  message: string;
  tables: string[];
  error?: string;
}

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    message: 'Testing connection...',
    tables: []
  });
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCreatingTables, setIsCreatingTables] = useState(false);
  const [sqlInstructions, setSqlInstructions] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testSupabaseConnection();
        
        if (result.success) {
          setStatus({
            connected: true,
            message: 'Successfully connected to Supabase!',
            tables: result.tables || []
          });
        } else {
          // Check if we have some existing tables but not all
          if (result.existingTables && result.existingTables.length > 0) {
            setStatus({
              connected: true,
              message: 'Connected to Supabase, but some tables need to be created',
              tables: result.existingTables || [],
              error: result.error
            });
          } else if (result.error && result.error.includes('does not exist')) {
            // Tables don't exist, but the connection works
            setStatus({
              connected: true,
              message: 'Connected to Supabase, but tables need to be created',
              tables: [],
              error: 'No tables found. Please create tables.'
            });
          } else {
            // General connection error
            setStatus({
              connected: false,
              message: 'Failed to connect to Supabase',
              tables: [],
              error: result.error
            });
          }
        }
      } catch (error) {
        setStatus({
          connected: false,
          message: 'Error testing connection',
          tables: [],
          error: String(error)
        });
      }
    };

    checkConnection();
  }, []);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setNeedsEmailConfirmation(false);
    
    try {
      const result = await initializeSupabase();
      
      if (result.success) {
        setStatus(prev => ({
          ...prev,
          message: 'Supabase initialized successfully!'
        }));
      } else {
        // Check if the error is about email confirmation
        if (result.needsConfirmation) {
          setNeedsEmailConfirmation(true);
          setStatus(prev => ({
            ...prev,
            message: 'User requires email confirmation',
            error: result.error
          }));
        }
        // If the error is about the table not existing, suggest creating tables first
        else if (result.error && result.error.includes('does not exist')) {
          setStatus(prev => ({
            ...prev,
            message: 'Tables need to be created first',
            error: 'Please click "Create Database Tables" before initializing'
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            message: 'Failed to initialize Supabase',
            error: result.error
          }));
        }
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        message: 'Error initializing Supabase',
        error: String(error)
      }));
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCreateTables = async () => {
    setIsCreatingTables(true);
    setSqlInstructions(null);
    
    try {
      const result = await createSupabaseTables();
      
      if (result.success) {
        // Refresh the connection status to show new tables
        const connectionResult = await testSupabaseConnection();
        
        setStatus({
          connected: true,
          message: 'Tables created successfully!',
          tables: connectionResult.success 
            ? connectionResult.tables || [] 
            : result.tables || [],
          error: undefined
        });
      } else {
        // Check if we have SQL instructions
        if (result.sqlInstructions) {
          setSqlInstructions(result.sqlInstructions);
        }
        
        setStatus(prev => ({
          ...prev,
          message: 'Failed to create tables',
          error: result.error
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        message: 'Error creating tables',
        error: String(error)
      }));
    } finally {
      setIsCreatingTables(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInitializing(true);
    
    try {
      // Try to sign in with admin provided credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });
      
      if (error) {
        setStatus(prev => ({
          ...prev,
          message: 'Admin sign-in failed',
          error: error.message
        }));
      } else if (data?.user) {
        // Successfully signed in
        setStatus(prev => ({
          ...prev,
          message: 'Signed in as admin user',
          error: undefined
        }));
        
        // Create profile if needed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (!profile && !profileError) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: 'Admin User',
              title: 'Portfolio Admin',
              email: adminEmail
            });
            
          if (insertError) {
            console.error('Error creating admin profile:', insertError);
          } else {
            setStatus(prev => ({
              ...prev,
              message: 'Signed in and created admin profile',
              error: undefined
            }));
          }
        }
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        message: 'Error during admin sign-in',
        error: String(error)
      }));
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Supabase Connection Test</h2>
      
      <div className={`p-4 mb-4 rounded-md ${status.connected ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
        <p className={`font-medium ${status.connected ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
          {status.connected ? status.message : 'Failed to connect to Supabase'}
        </p>
        
        {status.error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {status.error}
          </p>
        )}
      </div>
      
      {status.tables.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Detected Tables:</h3>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
            {status.tables.map(table => (
              <li key={table}>{table}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleCreateTables}
          disabled={isCreatingTables}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400"
        >
          {isCreatingTables ? 'Creating Tables...' : 'Create Database Tables'}
        </button>
        
        <button
          onClick={handleInitialize}
          disabled={isInitializing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isInitializing ? 'Initializing...' : 'Initialize Test Data'}
        </button>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        First create tables, then initialize test data to create a test user and profile.
      </p>
      
      {sqlInstructions && (
        <div className="mt-6 overflow-auto max-h-96 border border-gray-300 rounded-md p-4 bg-gray-100 dark:bg-gray-900 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            SQL Instructions for Manual Setup
          </h3>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Please copy and run this SQL in the Supabase Dashboard SQL Editor:
          </p>
          <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto p-2 bg-gray-200 dark:bg-gray-800 rounded">
            {sqlInstructions}
          </pre>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            After running the SQL, refresh this page and try connecting again.
          </p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Test User Credentials:</h3>
        <p className="text-gray-600 dark:text-gray-400">Email: test.user@gmail.com</p>
        <p className="text-gray-600 dark:text-gray-400">Password: Password123!</p>
      </div>
      
      {needsEmailConfirmation && (
        <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 rounded-md">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Email Confirmation Required</h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
            The test user email (test.user@gmail.com) needs verification before you can sign in.
          </p>
          
          <div className="mt-4">
            <button 
              onClick={() => setAdminMode(!adminMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              {adminMode ? 'Hide Admin Login' : 'Use Your Own Credentials Instead'}
            </button>
            
            {adminMode ? (
              <form onSubmit={handleAdminSignIn} className="mt-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                  Enter your Supabase credentials to bypass the test user:
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Your Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-green-400"
                    disabled={isInitializing}
                  >
                    {isInitializing ? 'Signing In...' : 'Sign In with Your Account'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Or, you can try one of these options:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-yellow-800 dark:text-yellow-300">
                  <li>Go to your Supabase dashboard, navigate to Authentication &gt; Users, find test.user@gmail.com and confirm the email manually</li>
                  <li>Check your Supabase logs or email service for the confirmation email</li>
                  <li>In the Supabase dashboard, go to Authentication &gt; Settings and disable email confirmation for testing</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest; 