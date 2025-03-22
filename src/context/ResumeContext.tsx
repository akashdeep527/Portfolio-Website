import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import initialData from '../data';
import { ResumeData } from '../types';
import { useAuth } from './AuthContext';
import * as resumeService from '../services/resumeService';

interface ResumeContextType {
  data: ResumeData;
  loading: boolean;
  updateProfile: (profile: ResumeData['profile']) => Promise<void>;
  updateStats: (stats: ResumeData['stats']) => Promise<void>;
  updateExperience: (experience: ResumeData['experience']) => Promise<void>;
  updateEducation: (education: ResumeData['education']) => Promise<void>;
  updateSkills: (skills: ResumeData['skills']) => Promise<void>;
  updateLanguages: (languages: ResumeData['languages']) => Promise<void>;
  resetData: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Helper to convert Supabase data format to app's ResumeData format
const mapSupabaseToResumeData = async (userId: string): Promise<ResumeData> => {
  try {
    // Default to initial data
    const result: ResumeData = { ...initialData };
    
    // Load profile
    const { data: profileData } = await resumeService.getProfile(userId);
    if (profileData) {
      result.profile = {
        name: profileData.full_name,
        title: profileData.title,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        description: profileData.about
      };
    }
    
    // Load experiences
    const { data: experiencesData } = await resumeService.getExperiences(userId);
    if (experiencesData && experiencesData.length > 0) {
      result.experience = experiencesData.map(exp => ({
        id: exp.id.toString(),
        company: exp.company,
        position: exp.position,
        period: `${exp.start_date} - ${exp.end_date || 'Present'}`,
        challenges: [{ id: '1', challenge: 'Description', result: exp.description }]
      }));
    }
    
    // Load education
    const { data: educationData } = await resumeService.getEducation(userId);
    if (educationData && educationData.length > 0) {
      result.education = educationData.map(edu => ({
        id: edu.id.toString(),
        degree: edu.degree,
        institution: edu.institution,
        period: `${edu.start_date} - ${edu.end_date || 'Present'}`
      }));
    }
    
    // Load skills
    const { data: skillsData } = await resumeService.getSkills(userId);
    if (skillsData && skillsData.length > 0) {
      result.skills = skillsData.map(skill => ({
        id: skill.id.toString(),
        name: skill.name,
        category: skill.category as 'core' | 'tool'
      }));
    }
    
    // Load languages
    const { data: languagesData } = await resumeService.getLanguages(userId);
    if (languagesData && languagesData.length > 0) {
      result.languages = languagesData.map(lang => `${lang.name} (${lang.proficiency})`);
    }
    
    return result;
  } catch (error) {
    console.error('Error mapping Supabase data:', error);
    return initialData;
  }
};

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || 'guest';
  const storageKey = `resumeData_${userId}`;
  
  const [data, setData] = useState<ResumeData>(initialData);
  const [loading, setLoading] = useState<boolean>(true);

  // Load data from Supabase when user changes or on auth state change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (isAuthenticated && user) {
          // Try to load from Supabase first
          const supabaseData = await mapSupabaseToResumeData(user.id);
          setData(supabaseData);
        } else {
          // For guest users, use localStorage
          const savedData = localStorage.getItem(storageKey);
          if (savedData) {
            setData(JSON.parse(savedData));
          } else {
            setData(initialData);
          }
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
        // Fallback to localStorage or initial data
        const savedData = localStorage.getItem(storageKey);
        setData(savedData ? JSON.parse(savedData) : initialData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, isAuthenticated, user, storageKey]);

  // Save data to localStorage as backup
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, storageKey, loading]);

  // Update functions that interact with Supabase
  const updateProfile = async (profile: ResumeData['profile']) => {
    setData(prev => ({ ...prev, profile }));
    
    if (isAuthenticated && user) {
      try {
        await resumeService.updateProfile(user.id, {
          full_name: profile.name,
          title: profile.title,
          about: profile.description,
          email: profile.email,
          phone: profile.phone,
          location: profile.location
        });
      } catch (error) {
        console.error('Error updating profile in Supabase:', error);
      }
    }
  };

  const updateStats = async (stats: ResumeData['stats']) => {
    setData(prev => ({ ...prev, stats }));
    // Note: Stats are not yet implemented in Supabase
  };

  const updateExperience = async (experience: ResumeData['experience']) => {
    setData(prev => ({ ...prev, experience }));
    
    if (isAuthenticated && user) {
      try {
        // This is a simplified implementation - a full implementation would handle
        // creating, updating, and deleting individual experiences
        // For now, we'll just update the first experience if it exists
        if (experience.length > 0 && experience[0]) {
          const exp = experience[0];
          const description = exp.challenges.map(c => `${c.challenge}: ${c.result}`).join('\n');
          const [startDate, endDate] = exp.period.split(' - ');
          
          await resumeService.updateExperience(parseInt(exp.id), {
            user_id: user.id,
            company: exp.company,
            position: exp.position,
            start_date: startDate,
            end_date: endDate === 'Present' ? null : endDate,
            description,
            current: endDate === 'Present'
          });
        }
      } catch (error) {
        console.error('Error updating experience in Supabase:', error);
      }
    }
  };

  const updateEducation = async (education: ResumeData['education']) => {
    setData(prev => ({ ...prev, education }));
    
    if (isAuthenticated && user) {
      try {
        // Simplified implementation similar to experience
        if (education.length > 0 && education[0]) {
          const edu = education[0];
          const [startDate, endDate] = edu.period.split(' - ');
          
          await resumeService.updateEducation(parseInt(edu.id), {
            user_id: user.id,
            institution: edu.institution,
            degree: edu.degree,
            field: '', // Not in the current UI
            start_date: startDate,
            end_date: endDate === 'Present' ? null : endDate,
            description: ''
          });
        }
      } catch (error) {
        console.error('Error updating education in Supabase:', error);
      }
    }
  };

  const updateSkills = async (skills: ResumeData['skills']) => {
    setData(prev => ({ ...prev, skills }));
    
    if (isAuthenticated && user) {
      try {
        // Simplified implementation
        if (skills.length > 0 && skills[0]) {
          const skill = skills[0];
          await resumeService.updateSkill(parseInt(skill.id), {
            user_id: user.id,
            name: skill.name,
            category: skill.category,
            level: 5 // Default level
          });
        }
      } catch (error) {
        console.error('Error updating skills in Supabase:', error);
      }
    }
  };

  const updateLanguages = async (languages: ResumeData['languages']) => {
    setData(prev => ({ ...prev, languages }));
    
    if (isAuthenticated && user) {
      try {
        // Simplified implementation
        if (languages.length > 0) {
          const lang = languages[0];
          const [name, proficiency] = lang.split(' (');
          await resumeService.updateLanguage(1, { // Using default ID 1
            user_id: user.id,
            name,
            proficiency: proficiency ? proficiency.replace(')', '') : 'Fluent'
          });
        }
      } catch (error) {
        console.error('Error updating languages in Supabase:', error);
      }
    }
  };

  const resetData = async () => {
    setData(initialData);
    // Note: This doesn't delete data from Supabase, just resets the local state
  };

  return (
    <ResumeContext.Provider value={{
      data,
      loading,
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