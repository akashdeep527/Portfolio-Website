import { supabase } from '../config/supabase';
import initialData from '../data';

/**
 * Initialize a new user's profile and associated data in Supabase
 * This creates starter entries for all tables with the user's ID
 */
export const initializeUserProfile = async (userId: string, email: string) => {
  try {
    console.log(`Initializing profile for user: ${userId}`);
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      console.log('Profile already exists, skipping initialization');
      return;
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: initialData.profile.name,
        title: initialData.profile.title,
        about: initialData.profile.description,
        email: email || initialData.profile.email,
        phone: initialData.profile.phone,
        location: initialData.profile.location,
        website: ''
      });
    
    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }
    
    // Create experience entries
    for (const exp of initialData.experience) {
      const [startDate, endDate] = exp.period.split(' - ');
      const description = exp.challenges.map(c => `${c.challenge}: ${c.result}`).join('\n');
      
      const { error: expError } = await supabase
        .from('experiences')
        .insert({
          user_id: userId,
          company: exp.company,
          position: exp.position,
          start_date: startDate,
          end_date: endDate === 'Present' ? null : endDate,
          description,
          current: endDate === 'Present'
        });
      
      if (expError) {
        console.error('Error creating experience:', expError);
      }
    }
    
    // Create education entries
    for (const edu of initialData.education) {
      const [startDate, endDate] = edu.period.split(' - ');
      
      const { error: eduError } = await supabase
        .from('education')
        .insert({
          user_id: userId,
          institution: edu.institution,
          degree: edu.degree,
          field: '', // Not in the current UI
          start_date: startDate,
          end_date: endDate === 'Present' ? null : endDate,
          description: ''
        });
      
      if (eduError) {
        console.error('Error creating education:', eduError);
      }
    }
    
    // Create skill entries
    for (const skill of initialData.skills) {
      const { error: skillError } = await supabase
        .from('skills')
        .insert({
          user_id: userId,
          name: skill.name,
          level: 5, // Default level
          category: skill.category
        });
      
      if (skillError) {
        console.error('Error creating skill:', skillError);
      }
    }
    
    // Create language entries
    for (const lang of initialData.languages) {
      const { error: langError } = await supabase
        .from('languages')
        .insert({
          user_id: userId,
          name: lang,
          proficiency: 'Fluent'
        });
      
      if (langError) {
        console.error('Error creating language:', langError);
      }
    }
    
    console.log('Successfully initialized profile data for user:', userId);
  } catch (error) {
    console.error('Error initializing user profile:', error);
    throw error;
  }
}; 