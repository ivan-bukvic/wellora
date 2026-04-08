import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LatestDataRange {
  latestDate: string | null;
  latestWeekDates: string[];
  latestMonthStart: string | null;
  isLoading: boolean;
}

/**
 * Queries the user's most recent activity_log date and computes
 * fallback week (Mon–Sun) and month ranges from it.
 */
export const useLatestDataRange = (): LatestDataRange => {
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    // Also check current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const fetchLatest = async () => {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          setLatestDate(data[0].date);
        } else {
          setLatestDate(null);
        }
      } catch (err) {
        console.error('useLatestDataRange error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, [userId]);

  // Compute the Mon–Sun week containing latestDate
  const latestWeekDates: string[] = (() => {
    if (!latestDate) return [];
    const d = new Date(latestDate + 'T00:00:00');
    const dayOfWeek = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  })();

  // Compute month start for the month containing latestDate
  const latestMonthStart: string | null = (() => {
    if (!latestDate) return null;
    const d = new Date(latestDate + 'T00:00:00');
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  })();

  return { latestDate, latestWeekDates, latestMonthStart, isLoading };
};

/**
 * Returns ISO date strings for the 7 days ending at `endDate`.
 */
export const getSevenDaysEndingAt = (endDate: string): string => {
  const d = new Date(endDate + 'T00:00:00');
  d.setDate(d.getDate() - 6);
  return d.toISOString().split('T')[0];
};

/**
 * Returns Mon–Sun week dates for a week containing `dateStr`.
 */
export const getWeekDatesFor = (dateStr: string): string[] => {
  const d = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.toISOString().split('T')[0];
  });
};
