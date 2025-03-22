import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for your Supabase tables
export interface Profile {
  id: string;
  full_name: string;
  title: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  avatar_url?: string;
}

export interface Experience {
  id: number;
  user_id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  current: boolean;
}

export interface Education {
  id: number;
  user_id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

export interface Skill {
  id: number;
  user_id: string;
  name: string;
  level: number; // 1-5 for skill level
  category: string;
}

export interface Language {
  id: number;
  user_id: string;
  name: string;
  proficiency: string; // e.g., 'Fluent', 'Intermediate', 'Beginner'
} 