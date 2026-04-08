import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLatestDataRange, getSevenDaysEndingAt } from '@/hooks/useLatestDataRange';

export interface AIInsightData {
  heroInsight: string;
  weeklySummary: string[];
  indicators: { activity: string; status: string }[];
  microCopyCandidates: string[];
}

const FALLBACK_DATA: AIInsightData = {
  heroInsight: "Your rhythm is taking shape.",
  weeklySummary: [
    "Weekdays showed a steady rhythm.",
    "Sleep stayed consistent throughout the week."
  ],
  indicators: [
    { activity: "walking", status: "steady" },
    { activity: "sleep", status: "consistent" }
  ],
  microCopyCandidates: [
    "Mornings carried a calmer pace.",
    "Your patterns are emerging gently."
  ],
};

const ACTIVITY_TYPE_IDS = {
  walking: '038a9c76-4848-48a9-8245-2d2fefe85711',
  sleeping: 'e74434f7-3f12-4854-a66f-493f0fc1cb28',
  stretching: '1f244fe2-03a7-45b8-8da8-5ecd8868821f',
  hydration: 'd3942123-3739-459f-ac0d-04f8de531dc7',
  mindfulness: 'e363142a-a13c-45bd-9728-a1143a2b5d5a',
};

export const useAIInsights = () => {
  const { latestDate, isLoading: rangeLoading } = useLatestDataRange();
  const [data, setData] = useState<AIInsightData>(FALLBACK_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rangeLoading) return;

    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setData(FALLBACK_DATA); setIsLoading(false); return; }

        // Try last 7 days first
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        let { data: logs, error: logsError } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', sevenDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: false });

        if (logsError) { console.error('Error fetching activity logs:', logsError); setData(FALLBACK_DATA); setIsLoading(false); return; }

        // Fallback to latest data range if current week is empty
        if ((!logs || logs.length === 0) && latestDate) {
          const fallbackStart = getSevenDaysEndingAt(latestDate);
          const { data: fallbackLogs } = await supabase
            .from('activity_logs')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', fallbackStart)
            .lte('date', latestDate)
            .order('date', { ascending: false });
          logs = fallbackLogs || [];
        }

        const activityData = processLogsForInsight(logs || [], user.email || 'User');

        const { data: responseData, error: fnError } = await supabase.functions.invoke('weekly-ai-insight', {
          body: activityData
        });

        if (fnError) {
          console.error('AI insight fetch error:', fnError);
          setData(generateLocalInsights(logs || []));
          return;
        }

        setData(responseData || generateLocalInsights(logs || []));
      } catch (err) {
        console.error('AI insight error:', err);
        setError('Failed to load insights');
        setData(FALLBACK_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [latestDate, rangeLoading]);

  const currentMicroCopy = data?.microCopyCandidates?.[
    Math.floor(Date.now() / 60000) % (data?.microCopyCandidates?.length || 1)
  ] || null;

  return { data, isLoading, error, currentMicroCopy };
};

function processLogsForInsight(logs: any[], userName: string) {
  // Derive the date range from the actual logs
  const logDates = logs.map(l => l.date).sort();
  const uniqueDates = [...new Set(logDates)];
  const days = uniqueDates.length > 0
    ? Array.from({ length: 7 }, (_, i) => {
        const latest = new Date(uniqueDates[uniqueDates.length - 1] + 'T00:00:00');
        const d = new Date(latest);
        d.setDate(latest.getDate() - i);
        return d.toISOString().split('T')[0];
      })
    : Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

  const getActivityStatus = (activityTypeId: string, date: string) => {
    const log = logs.find(l => l.activity_type_id === activityTypeId && l.date === date);
    if (!log || !log.completed) return 'missed';
    return 'completed';
  };

  const getSleepStatus = (date: string) => {
    const log = logs.find(l => l.activity_type_id === ACTIVITY_TYPE_IDS.sleeping && l.date === date);
    if (!log || !log.completed) return 'missed';
    return (log.sleep_duration_hours || 0) >= 7 ? 'good' : 'average';
  };

  const getHydrationStatus = (date: string) => {
    const log = logs.find(l => l.activity_type_id === ACTIVITY_TYPE_IDS.hydration && l.date === date);
    if (!log || !log.completed) return 'low';
    return (log.hydration_units || 0) >= 8 ? 'high' : 'medium';
  };

  const getMindfulnessStatus = (date: string) => {
    const log = logs.find(l => l.activity_type_id === ACTIVITY_TYPE_IDS.mindfulness && l.date === date);
    if (!log || !log.completed) return 'missed';
    return (log.duration_minutes || 0) >= 15 ? 'long' : 'short';
  };

  return {
    userName,
    weekRange: `${days[6]} to ${days[0]}`,
    activities: {
      walking: days.map(d => getActivityStatus(ACTIVITY_TYPE_IDS.walking, d)),
      sleep: days.map(d => getSleepStatus(d)),
      stretching: days.map(d => getActivityStatus(ACTIVITY_TYPE_IDS.stretching, d)),
      hydration: days.map(d => getHydrationStatus(d)),
      mindfulness: days.map(d => getMindfulnessStatus(d)),
    }
  };
}

function generateLocalInsights(logs: any[]): AIInsightData {
  const walkingLogs = logs.filter(l => l.activity_type_id === ACTIVITY_TYPE_IDS.walking && l.completed);
  const sleepLogs = logs.filter(l => l.activity_type_id === ACTIVITY_TYPE_IDS.sleeping && l.completed);
  const mindfulnessLogs = logs.filter(l => l.activity_type_id === ACTIVITY_TYPE_IDS.mindfulness && l.completed);
  
  const summaries: string[] = [];
  const microCopies: string[] = [];
  
  if (walkingLogs.length >= 4) {
    summaries.push("Walking was fairly consistent this week.");
    microCopies.push("Movement became part of your rhythm.");
  } else if (walkingLogs.length > 0) {
    summaries.push("Walking showed up on some days.");
  }
  
  if (sleepLogs.length >= 5) {
    summaries.push("Sleep stayed consistent throughout the week.");
    microCopies.push("Your rest patterns are settling nicely.");
  }
  
  if (mindfulnessLogs.length >= 3) {
    summaries.push("Mindfulness sessions were regular.");
    microCopies.push("Short moments of stillness added up.");
  }
  
  if (summaries.length === 0) summaries.push("Your rhythm is taking shape.");
  if (microCopies.length === 0) microCopies.push("Patterns emerge as you continue.");

  const heroInsights = [
    "Short mindfulness sessions seem to fit your days well.",
    "Your weekly rhythm is taking shape nicely.",
    "Rest and activity are finding their balance.",
    "Your patterns show gentle consistency.",
  ];

  return {
    heroInsight: heroInsights[Math.floor(Math.random() * heroInsights.length)],
    weeklySummary: summaries,
    indicators: [
      { activity: "walking", status: walkingLogs.length >= 4 ? "steady" : "building" },
      { activity: "sleep", status: sleepLogs.length >= 5 ? "consistent" : "variable" },
    ],
    microCopyCandidates: microCopies,
  };
}
