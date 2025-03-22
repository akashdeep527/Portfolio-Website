import { supabase } from '../config/supabase';
import { ResumeData } from '../types';

/**
 * Syncs all resume data with Supabase for a specific user
 * This function handles: profile, experience, education, skills, languages
 * @param userId The user's ID
 * @param data The current resume data
 * @returns A boolean indicating whether the sync was successful
 */
export const syncDataWithSupabase = async (userId: string, data: ResumeData): Promise<boolean> => {
  try {
    console.log('Starting sync with Supabase for user:', userId);
    
    // Sync profile data - use correct field names matching the Supabase schema
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: data.profile.name,
        title: data.profile.title,
        about: data.profile.description,
        email: data.profile.email,
        phone: data.profile.phone,
        location: data.profile.location,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (profileError) {
      console.error('Error syncing profile data:', profileError);
      return false;
    }
    
    // Sync experiences - first delete existing entries, then insert new ones
    const { error: deleteExpError } = await supabase
      .from('experiences')
      .delete()
      .eq('user_id', userId);
      
    if (deleteExpError) {
      console.error('Error deleting existing experiences:', deleteExpError);
      return false;
    }
    
    if (data.experience.length > 0) {
      const experienceData = data.experience.map(exp => {
        // Parse period into start and end dates
        const [startDate, endDate] = exp.period.split(' - ');
        const isCurrent = endDate === 'Present';
        
        // Combine challenges into description
        const description = exp.challenges
          .map(c => `${c.challenge}: ${c.result}`)
          .join('\n');
        
        return {
          user_id: userId,
          company: exp.company,
          position: exp.position,
          start_date: startDate,
          end_date: isCurrent ? null : endDate,
          description: description,
          current: isCurrent
        };
      });
      
      const { error: insertExpError } = await supabase
        .from('experiences')
        .insert(experienceData);
        
      if (insertExpError) {
        console.error('Error inserting experiences:', insertExpError);
        // Continue with other syncs even if this fails
      }
    }
    
    // Sync education - first delete existing entries, then insert new ones
    const { error: deleteEduError } = await supabase
      .from('education')
      .delete()
      .eq('user_id', userId);
      
    if (deleteEduError) {
      console.error('Error deleting existing education:', deleteEduError);
      // Continue with other syncs even if this fails
    } else if (data.education.length > 0) {
      const educationData = data.education.map(edu => {
        // Parse period into start and end dates
        const [startDate, endDate] = edu.period.split(' - ');
        const isCurrent = endDate === 'Present';
        
        return {
          user_id: userId,
          institution: edu.institution,
          degree: edu.degree,
          field: '',  // Not present in current data structure
          start_date: startDate,
          end_date: isCurrent ? null : endDate,
          description: ''  // Not present in current data structure
        };
      });
      
      const { error: insertEduError } = await supabase
        .from('education')
        .insert(educationData);
        
      if (insertEduError) {
        console.error('Error inserting education:', insertEduError);
        // Continue with other syncs even if this fails
      }
    }
    
    // Sync skills - first delete existing entries, then insert new ones
    const { error: deleteSkillsError } = await supabase
      .from('skills')
      .delete()
      .eq('user_id', userId);
      
    if (deleteSkillsError) {
      console.error('Error deleting existing skills:', deleteSkillsError);
      // Continue with other syncs even if this fails
    } else if (data.skills.length > 0) {
      const skillsData = data.skills.map(skill => ({
        user_id: userId,
        name: skill.name,
        level: 5,  // Default level since not in current data structure
        category: skill.category
      }));
      
      const { error: insertSkillsError } = await supabase
        .from('skills')
        .insert(skillsData);
        
      if (insertSkillsError) {
        console.error('Error inserting skills:', insertSkillsError);
        // Continue with other syncs even if this fails
      }
    }
    
    // Sync languages - first delete existing entries, then insert new ones
    const { error: deleteLangError } = await supabase
      .from('languages')
      .delete()
      .eq('user_id', userId);
      
    if (deleteLangError) {
      console.error('Error deleting existing languages:', deleteLangError);
      // Continue with other syncs even if this fails
    } else if (data.languages.length > 0) {
      const languagesData = data.languages.map(lang => {
        // Parse language string if it contains proficiency in parentheses
        let name = lang;
        let proficiency = 'Fluent';
        
        if (typeof lang === 'string' && lang.includes('(')) {
          const parts = lang.split('(');
          name = parts[0].trim();
          proficiency = parts[1].replace(')', '').trim();
        }
        
        return {
          user_id: userId,
          name,
          proficiency
        };
      });
      
      const { error: insertLangError } = await supabase
        .from('languages')
        .insert(languagesData);
        
      if (insertLangError) {
        console.error('Error inserting languages:', insertLangError);
        // Continue with other syncs even if this fails
      }
    }
    
    console.log('Sync with Supabase completed successfully');
    return true;
  } catch (error) {
    console.error('Error syncing data with Supabase:', error);
    return false;
  }
}; 