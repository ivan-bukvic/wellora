import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/context/UserProfileContext';

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
  const { session, authLoading } = useUserProfile();
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('[DEBUG] useLatestDataRange hook initialized, authLoading:', authLoading, 'userId:', session?.user?.id ?? 'none');

  useEffect(() => {
    console.log('[DEBUG] useLatestDataRange effect running, authLoading:', authLoading, 'userId:', session?.user?.id ?? 'none');

    if (authLoading) return;

    if (!session?.user) {
      console.log('[DEBUG] useLatestDataRange: no session user, skipping fetch');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userId = session.user.id;

    const fetchLatest = async () => {
      try {
        console.log('[DEBUG] useLatestDataRange: fetching latest date for user', userId);
        const { data, error } = await supabase
          .from('activity_logs')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(1);

        if (error) {
          console.error('[DEBUG] useLatestDataRange query error:', error);
        } else if (data && data.length > 0) {
          console.log('[DEBUG] useLatestDataRange: latest date =', data[0].date);
          setLatestDate(data[0].date);
        } else {
          console.log('[DEBUG] useLatestDataRange: Query returned 0 rows – possible causes: wrong table, user_id mismatch, or empty database');
          setLatestDate(null);
        }
      } catch (err) {
        console.error('[DEBUG] useLatestDataRange error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, [session, authLoading]);

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
