
import { supabase } from '@/integrations/supabase/client';

export interface StudentRegistrationData {
  full_name: string;
  college_name: string;
  semester: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
  branch: string;
  has_backlogs: boolean;
  last_semester_score: number;
  ai_thoughts: string;
}

export const createStudentRegistration = async (data: StudentRegistrationData) => {
  const { error } = await supabase.from('student_registrations').insert({
    ...data,
    user_id: (await supabase.auth.getUser()).data.user?.id,
  });
  
  if (error) {
    console.error('Error creating registration:', error);
    throw error;
  }
  
  return true;
};

export const getStudentRegistration = async () => {
  const { data, error } = await supabase
    .from('student_registrations')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .single();
    
  if (error && error.code !== 'PGRST116') { // Code for "No rows returned"
    console.error('Error fetching registration:', error);
    throw error;
  }
  
  return data;
};

export const updateRegistrationPayment = async (paymentId: string) => {
  const { error } = await supabase
    .from('student_registrations')
    .update({
      payment_status: 'completed',
      payment_id: paymentId,
      payment_date: new Date().toISOString()
    })
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    
  if (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
  
  return true;
};

export const getUserRegistrationStatus = async (): Promise<{
  isRegistered: boolean;
  hasCompletedPayment: boolean;
}> => {
  const registration = await getStudentRegistration();
  
  return {
    isRegistered: !!registration,
    hasCompletedPayment: registration?.payment_status === 'completed',
  };
};
