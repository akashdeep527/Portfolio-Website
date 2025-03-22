import React, { Suspense, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Resume } from './components/Resume';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProfileEditor from './components/admin/ProfileEditor';
import ExperienceEditor from './components/admin/ExperienceEditor';
import EducationEditor from './components/admin/EducationEditor';
import SkillsEditor from './components/admin/SkillsEditor';
import LanguagesEditor from './components/admin/LanguagesEditor';
import StatsEditor from './components/admin/StatsEditor';
import SupabaseTest from './components/SupabaseTest';
import { ResumeProvider } from './context/ResumeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Error boundary to catch rendering errors
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
          <h2>Something went wrong!</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && (this.state.error.toString())}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <ErrorBoundary>
            <AuthProvider>
              <ErrorBoundary>
                <ResumeProvider>
                  <Routes>
                    <Route path="/" element={<Resume />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/supabase-test" element={<SupabaseTest />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      } 
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="profile" element={<ProfileEditor />} />
                      <Route path="experience" element={<ExperienceEditor />} />
                      <Route path="education" element={<EducationEditor />} />
                      <Route path="skills" element={<SkillsEditor />} />
                      <Route path="languages" element={<LanguagesEditor />} />
                      <Route path="stats" element={<StatsEditor />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ResumeProvider>
              </ErrorBoundary>
            </AuthProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;