import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Simple debug component to test Supabase connection
function DebugComponent() {
  const [status, setStatus] = React.useState<string>('Not tested');
  const [error, setError] = React.useState<string | null>(null);
  
  const testConnection = async () => {
    try {
      setStatus('Testing...');
      setError(null);
      
      // Get Supabase credentials from env
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not found in environment variables');
      }
      
      // Create client
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Try a simple query
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      
      if (error) throw error;
      
      setStatus(`Connection successful! Found ${data ? data.length : 0} profiles.`);
    } catch (err) {
      setStatus('Connection failed');
      setError(err instanceof Error ? err.message : String(err));
    }
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Supabase Connection Tester</h1>
      <p>This is a minimal app to test your Supabase connection.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Connection Status</h2>
        <div style={{ 
          padding: '10px', 
          backgroundColor: status.includes('successful') ? '#d1fae5' : '#fee2e2',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          {status}
        </div>
        
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#fee2e2',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <button 
          onClick={testConnection}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Connection
        </button>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Environment Variables</h2>
        <div style={{ fontFamily: 'monospace' }}>
          <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set'}</p>
          <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/" style={{ color: '#3b82f6' }}>Back to Main App</Link>
      </div>
    </div>
  );
}

// Fallback App with simple routes
export default function FallbackApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/debug" element={<DebugComponent />} />
        <Route path="/" element={
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Portfolio Site Troubleshooter</h1>
            <p>The main app is currently experiencing issues. Use these links to troubleshoot:</p>
            <div style={{ marginTop: '20px' }}>
              <Link 
                to="/debug" 
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
              >
                Test Supabase Connection
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
} 