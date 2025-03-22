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
          setStatus({
            connected: false,
            message: 'Failed to connect to Supabase',
            tables: [],
            error: result.error
          });
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
        setStatus(prev => ({
          ...prev,
          message: 'Failed to initialize Supabase',
          error: result.error
        }));
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
    
    try {
      const result = await createSupabaseTables();
      
      if (result.success) {
        // Refresh the connection status to show new tables
        const connectionResult = await testSupabaseConnection();
        
        setStatus({
          connected: true,
          message: 'Tables created successfully!',
          tables: connectionResult.success ? connectionResult.tables || [] : []
        });
      } else {
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
          {status.message}
        </p>
        
        {status.error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Error: {status.error}
          </p>
        )}
      </div>
      
      {status.tables.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Available Tables:</h3>
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
      
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Test User Credentials:</h3>
        <p className="text-gray-600 dark:text-gray-400">Email: admin@example.com</p>
        <p className="text-gray-600 dark:text-gray-400">Password: Password123!</p>
      </div>
    </div>
  );
};

export default SupabaseTest; 