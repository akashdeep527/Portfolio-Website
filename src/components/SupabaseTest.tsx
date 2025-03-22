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
    
    try {
      const result = await initializeSupabase();
      
      if (result.success) {
        setStatus(prev => ({
          ...prev,
          message: 'Supabase initialized successfully!'
        }));
      } else {
        // If the error is about the table not existing, suggest creating tables first
        if (result.error && result.error.includes('does not exist')) {
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
    </div>
  );
};

export default SupabaseTest; 