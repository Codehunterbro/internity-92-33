
import { supabase } from "@/integrations/supabase/client";

export async function getCheckoutAvailability() {
  try {
    const { data, error } = await supabase
      .from('checkout_settings')
      .select('*')
      .eq('feature_name', 'course_checkout')
      .single();
    
    if (error) {
      console.error('Error fetching checkout settings:', error);
      return { isEnabled: false, availableAfter: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) };
    }
    
    return {
      isEnabled: data.is_enabled,
      availableAfter: new Date(data.available_after)
    };
  } catch (error) {
    console.error('Failed to check checkout availability:', error);
    return { isEnabled: false, availableAfter: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) };
  }
}

export function formatRemainingTime(targetDate: Date) {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return "Available now";
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 1) {
    return `Available in ${diffDays} days`;
  } else if (diffDays === 1) {
    return `Available in 1 day and ${diffHours} hours`;
  } else {
    return `Available in ${diffHours} hours`;
  }
}
