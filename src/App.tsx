import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Resume from './components/Resume';
import Login from './components/auth/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProfileEditor from './components/admin/ProfileEditor';
import ExperienceEditor from './components/admin/ExperienceEditor';
import EducationEditor from './components/admin/EducationEditor';
import SkillsEditor from './components/admin/SkillsEditor';
import LanguagesEditor from './components/admin/LanguagesEditor';
import StatsEditor from './components/admin/StatsEditor';
import { ResumeProvider } from './context/ResumeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Resume />} />
            <Route path="/login" element={<Login />} />
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
        </BrowserRouter>
      </ResumeProvider>
    </AuthProvider>
  );
}

export default App;