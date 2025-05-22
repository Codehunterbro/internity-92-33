
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const initiatePayment = async (amount: number, courseId: string, userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: { amount, courseId, userId }
    });

    if (error) throw error;

    if (!data.orderId) {
      throw new Error('Failed to create order');
    }

    return {
      order_id: data.orderId,
      key_id: data.key_id,
      amount: data.amount,
      currency: data.currency,
    };
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
};

// Helper to load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
