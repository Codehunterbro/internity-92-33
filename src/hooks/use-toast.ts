import { toast as sonnerToast } from 'sonner';

// This is a compatibility layer to support both the Sonner API and
// the shadcn/ui toast API patterns
function createCompatibleToast() {
  const toast = (messageOrOptions: string | { title?: string; description?: string; variant?: string }) => {
    if (typeof messageOrOptions === 'string') {
      return sonnerToast(messageOrOptions);
    }
    
    // For the shadcn/ui style API
    const { title, description, variant } = messageOrOptions;
    if (description) {
      return sonnerToast(title || '', {
        description
      });
    }
    return sonnerToast(title || '');
  };

  // Add all the sonnerToast methods to our compatible toast function
  Object.keys(sonnerToast).forEach(key => {
    if (typeof sonnerToast[key] === 'function') {
      toast[key] = (message, options) => {
        if (typeof message === 'object' && message !== null) {
          // Handle object format for success, error, etc.
          const { title, description } = message;
          return sonnerToast[key](title || '', {
            ...(options || {}),
            ...(description ? { description } : {})
          });
        }
        return sonnerToast[key](message, options);
      };
    }
  });

  return toast as typeof sonnerToast & {
    (messageOrOptions: string | { title?: string; description?: string; variant?: string }): string | number;
  };
}

// Create a consistent interface for the toast function
export const toast = createCompatibleToast();

// Export useToast for backward compatibility
// This follows the pattern used in the shadcn/ui toast
export const useToast = () => {
  return {
    toast
  };
};