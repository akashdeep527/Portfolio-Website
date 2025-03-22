import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import initialData from '../data';
import { ResumeData } from '../types';

interface ResumeContextType {
  data: ResumeData;
  updateProfile: (profile: ResumeData['profile']) => void;
  updateStats: (stats: ResumeData['stats']) => void;
  updateExperience: (experience: ResumeData['experience']) => void;
  updateEducation: (education: ResumeData['education']) => void;
  updateSkills: (skills: ResumeData['skills']) => void;
  updateLanguages: (languages: ResumeData['languages']) => void;
  resetData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ResumeData>(() => {
    const savedData = localStorage.getItem('resumeData');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(data));
  }, [data]);

  const updateProfile = (profile: ResumeData['profile']) => {
    setData(prev => ({ ...prev, profile }));
  };

  const updateStats = (stats: ResumeData['stats']) => {
    setData(prev => ({ ...prev, stats }));
  };

  const updateExperience = (experience: ResumeData['experience']) => {
    setData(prev => ({ ...prev, experience }));
  };

  const updateEducation = (education: ResumeData['education']) => {
    setData(prev => ({ ...prev, education }));
  };

  const updateSkills = (skills: ResumeData['skills']) => {
    setData(prev => ({ ...prev, skills }));
  };

  const updateLanguages = (languages: ResumeData['languages']) => {
    setData(prev => ({ ...prev, languages }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <ResumeContext.Provider value={{
      data,
      updateProfile,
      updateStats,
      updateExperience,
      updateEducation,
      updateSkills,
      updateLanguages,
      resetData
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};