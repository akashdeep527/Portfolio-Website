import { supabase } from '../config/supabase';
import { Profile, Experience, Education, Skill, Language } from '../config/supabase';

// Profile service functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data: data as Profile | null, error };
};

export const updateProfile = async (userId: string, profile: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();
  
  return { data: data as Profile | null, error };
};

// Experience service functions
export const getExperiences = async (userId: string) => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });
  
  return { data: data as Experience[] | null, error };
};

export const addExperience = async (experience: Omit<Experience, 'id'>) => {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single();
  
  return { data: data as Experience | null, error };
};

export const updateExperience = async (id: number, experience: Partial<Experience>) => {
  const { data, error } = await supabase
    .from('experiences')
    .update(experience)
    .eq('id', id)
    .select()
    .single();
  
  return { data: data as Experience | null, error };
};

export const deleteExperience = async (id: number) => {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Education service functions
export const getEducation = async (userId: string) => {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });
  
  return { data: data as Education[] | null, error };
};

export const addEducation = async (education: Omit<Education, 'id'>) => {
  const { data, error } = await supabase
    .from('education')
    .insert(education)
    .select()
    .single();
  
  return { data: data as Education | null, error };
};

export const updateEducation = async (id: number, education: Partial<Education>) => {
  const { data, error } = await supabase
    .from('education')
    .update(education)
    .eq('id', id)
    .select()
    .single();
  
  return { data: data as Education | null, error };
};

export const deleteEducation = async (id: number) => {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Skills service functions
export const getSkills = async (userId: string) => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .order('category');
  
  return { data: data as Skill[] | null, error };
};

export const addSkill = async (skill: Omit<Skill, 'id'>) => {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single();
  
  return { data: data as Skill | null, error };
};

export const updateSkill = async (id: number, skill: Partial<Skill>) => {
  const { data, error } = await supabase
    .from('skills')
    .update(skill)
    .eq('id', id)
    .select()
    .single();
  
  return { data: data as Skill | null, error };
};

export const deleteSkill = async (id: number) => {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Languages service functions
export const getLanguages = async (userId: string) => {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .eq('user_id', userId);
  
  return { data: data as Language[] | null, error };
};

export const addLanguage = async (language: Omit<Language, 'id'>) => {
  const { data, error } = await supabase
    .from('languages')
    .insert(language)
    .select()
    .single();
  
  return { data: data as Language | null, error };
};

export const updateLanguage = async (id: number, language: Partial<Language>) => {
  const { data, error } = await supabase
    .from('languages')
    .update(language)
    .eq('id', id)
    .select()
    .single();
  
  return { data: data as Language | null, error };
};

export const deleteLanguage = async (id: number) => {
  const { error } = await supabase
    .from('languages')
    .delete()
    .eq('id', id);
  
  return { error };
}; 