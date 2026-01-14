import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from './useDemoMode';

interface UseUserHasDataResult {
  hasData: boolean;
  isLoading: boolean;
}

export const useUserHasData = (): UseUserHasDataResult => {
  const { isDemoUser, isLoading: demoLoading } = useDemoMode();
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserData = async () => {
      // Demo users always "have data"
      if (isDemoUser) {
        setHasData(true);
        setIsLoading(false);
        return;
      }

      // Wait for demo mode check to complete
      if (demoLoading) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setHasData(false);
          setIsLoading(false);
          return;
        }

        // Check if user has any activity logs
        const { count, error } = await supabase
          .from('activity_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error checking user data:', error);
          setHasData(false);
        } else {
          setHasData((count ?? 0) > 0);
        }
      } catch (err) {
        console.error('Error checking user data:', err);
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserData();
  }, [isDemoUser, demoLoading]);

  return { hasData, isLoading };
};
