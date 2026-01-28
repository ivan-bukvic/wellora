import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseUserHasDataResult {
  hasData: boolean;
  isLoading: boolean;
}

/**
 * Hook to check if user has activity data.
 * 
 * Since all new users automatically receive seeded demo data on signup
 * (via the handle_new_user trigger), authenticated users will always have data.
 * This hook now simply checks for authentication status.
 */
export const useUserHasData = (): UseUserHasDataResult => {
  const [hasData, setHasData] = useState(true); // Default to true since all users have seeded data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // If user is authenticated, they have data (seeded on signup)
        setHasData(!!user);
      } catch (err) {
        console.error('Error checking auth:', err);
        setHasData(true); // Default to true to avoid empty states
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { hasData, isLoading };
};
