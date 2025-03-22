export interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  description: string;
}

export interface StatData {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  period: string;
  challenges: {
    id: string;
    challenge: string;
    result: string;
  }[];
}

export interface EducationData {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface SkillData {
  id: string;
  name: string;
  category: 'core' | 'tool';
}

export interface ResumeData {
  profile: ProfileData;
  stats: StatData[];
  experience: ExperienceData[];
  education: EducationData[];
  skills: SkillData[];
  languages: string[];
}