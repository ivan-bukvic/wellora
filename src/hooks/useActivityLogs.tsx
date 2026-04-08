import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLog {
  id: string;
  date: string;
  activity_type_id: string;
  activity_name: string;
  completed: boolean;
  duration_minutes: number | null;
  sleep_duration_hours: number | null;
  hydration_units: number | null;
}

interface DayLog {
  date: string;
  activities: Array<{
    name: string;
    completed: boolean;
    duration?: string;
  }>;
}

interface CalendarDayData {
  completed: number;
  total: number;
  hasStreak: boolean;
}

interface TodayRoutineItem {
  name: string;
  completed: boolean;
  duration?: string;
  progress?: string;
}

// Activity type name mapping
const activityTypeNames: Record<string, string> = {
  '038a9c76-4848-48a9-8245-2d2fefe85711': 'Walking',
  'e74434f7-3f12-4854-a66f-493f0fc1cb28': 'Sleeping',
  '1f244fe2-03a7-45b8-8da8-5ecd8868821f': 'Stretching',
  'd3942123-3739-459f-ac0d-04f8de531dc7': 'Hydration',
  'e363142a-a13c-45bd-9728-a1143a2b5d5a': 'Mindfulness',
};

interface UseActivityLogsOptions {
  days?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export const useActivityLogs = (optionsOrDays?: number | UseActivityLogsOptions) => {
  const options: UseActivityLogsOptions = typeof optionsOrDays === 'number' 
    ? { days: optionsOrDays } 
    : (optionsOrDays ?? {});

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // If days or startDate is provided, compute a start date filter; otherwise fetch all
  const startDateStr = options.startDate ?? (options.days != null ? (() => {
    const d = new Date();
    d.setDate(d.getDate() - options.days!);
    return d.toISOString().split('T')[0];
  })() : undefined);
  const endDateStr = options.endDate;

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
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

    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', userId);

        if (startDateStr) {
          query = query.gte('date', startDateStr);
        }

        if (endDateStr) {
          query = query.lte('date', endDateStr);
        }

        const { data, error: fetchError } = await query.order('date', { ascending: false });

        if (fetchError) throw fetchError;

        const enrichedLogs = (data || []).map(log => ({
          ...log,
          activity_name: activityTypeNames[log.activity_type_id] || 'Unknown',
        }));

        setLogs(enrichedLogs);
      } catch (err) {
        console.error('Error fetching activity logs:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [userId, startDateStr, endDateStr]);

  // Group logs by date for the activity log list
  const groupedLogs = useMemo((): DayLog[] => {
    const grouped: Record<string, DayLog> = {};
    const allActivityNames = ['Walking', 'Sleeping', 'Stretching', 'Hydration', 'Mindfulness'];

    logs.forEach(log => {
      if (!grouped[log.date]) {
        grouped[log.date] = {
          date: log.date,
          activities: allActivityNames.map(name => ({
            name,
            completed: false,
            duration: '',
          })),
        };
      }

      const activityIndex = grouped[log.date].activities.findIndex(a => a.name === log.activity_name);
      if (activityIndex !== -1) {
        const activity = grouped[log.date].activities[activityIndex];
        activity.completed = log.completed;
        
        if (log.activity_name === 'Sleeping' && log.sleep_duration_hours) {
          activity.duration = `${log.sleep_duration_hours} hrs`;
        } else if (log.activity_name === 'Hydration' && log.hydration_units) {
          activity.duration = `${log.hydration_units}/8 glasses`;
        } else if (log.duration_minutes) {
          activity.duration = `${log.duration_minutes} min`;
        }
      }
    });

    return Object.values(grouped).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [logs]);

  // Get today's routine (falls back to most recent date if today has no data)
  const { todayRoutine, routineDate } = useMemo((): { todayRoutine: TodayRoutineItem[]; routineDate: string } => {
    const today = new Date().toISOString().split('T')[0];
    let targetDate = today;
    let targetLogs = logs.filter(log => log.date === today);

    // Fallback: if no logs today, use the most recent date from groupedLogs
    if (targetLogs.length === 0 && groupedLogs.length > 0) {
      targetDate = groupedLogs[0].date;
      targetLogs = logs.filter(log => log.date === targetDate);
    }

    const allActivityNames = ['Walking', 'Sleeping', 'Stretching', 'Hydration', 'Mindfulness'];

    const routine = allActivityNames.map(name => {
      const log = targetLogs.find(l => l.activity_name === name);
      
      if (!log) {
        return { name, completed: false };
      }

      let duration = '';
      if (name === 'Sleeping' && log.sleep_duration_hours) {
        duration = `${log.sleep_duration_hours} hrs`;
      } else if (name === 'Hydration') {
        const units = log.hydration_units || 0;
        if (log.completed) {
          duration = `${units}/8 glasses`;
        } else {
          return { name, completed: false, progress: `${units}/8 glasses` };
        }
      } else if (log.duration_minutes) {
        duration = `${log.duration_minutes} min`;
      }

      return { name, completed: log.completed, duration };
    });

    return { todayRoutine: routine, routineDate: targetDate };
  }, [logs, groupedLogs]);

  // Calendar data mapping
  const calendarData = useMemo((): Record<string, CalendarDayData> => {
    const data: Record<string, CalendarDayData> = {};
    
    groupedLogs.forEach((log, index) => {
      const completedCount = log.activities.filter(a => a.completed).length;
      const prevLog = groupedLogs[index + 1];
      const prevCompleted = prevLog ? prevLog.activities.filter(a => a.completed).length : 0;
      
      data[log.date] = {
        completed: completedCount,
        total: 5,
        hasStreak: completedCount >= 3 && prevCompleted >= 3,
      };
    });
    
    return data;
  }, [groupedLogs]);

  // Completed activities per date for calendar hover
  const completedActivitiesMap = useMemo((): Record<string, string[]> => {
    const map: Record<string, string[]> = {};
    
    groupedLogs.forEach(log => {
      map[log.date] = log.activities.filter(a => a.completed).map(a => a.name);
    });
    
    return map;
  }, [groupedLogs]);

  return {
    logs,
    groupedLogs,
    todayRoutine,
    routineDate,
    calendarData,
    completedActivitiesMap,
    isLoading,
    error,
  };
};
