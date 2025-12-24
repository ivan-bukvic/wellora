import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from './useDemoMode';
import { generateDemoActivityLogs } from '@/data/demoData';

export interface AIInsightData {
  heroInsight: string;
  weeklySummary: string[];
  indicators: { activity: string; status: string }[];
  microCopyCandidates: string[];
}

const FALLBACK_DATA: AIInsightData = {
  heroInsight: "Your rhythm is taking shape.",
  weeklySummary: [],
  indicators: [],
  microCopyCandidates: [],
};

// Demo reflections for portfolio user
const DEMO_AI_DATA: AIInsightData = {
  heroInsight: "Short mindfulness sessions seem to fit your days well.",
  weeklySummary: [
    "Weekdays showed a steady rhythm.",
    "Mindfulness was shorter but more regular.",
    "Weekends were lighter — that's natural.",
    "Sleep stayed consistent throughout the week."
  ],
  indicators: [
    { activity: "walking", status: "steady" },
    { activity: "sleep", status: "improving" },
    { activity: "hydration", status: "inconsistent" }
  ],
  microCopyCandidates: [
    "Stretching often followed walking.",
    "Hydration dipped slightly on weekends.",
    "Mornings carried a calmer pace."
  ]
};

export const useAIInsights = () => {
  const { isDemoUser, demoUserName } = useDemoMode();
  const [data, setData] = useState<AIInsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      // For demo user, use static demo data
      if (isDemoUser) {
        setData(DEMO_AI_DATA);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build activity data from last 7 days
        const logs = generateDemoActivityLogs().slice(0, 7);
        
        const activityData = {
          userName: demoUserName || 'User',
          weekRange: `${logs[6]?.date || ''} to ${logs[0]?.date || ''}`,
          activities: {
            walking: logs.map(l => l.activities.find(a => a.name === 'Walking')?.completed ? 'completed' : 'missed'),
            sleep: logs.map(l => {
              const sleep = l.activities.find(a => a.name === 'Sleeping');
              if (!sleep?.completed) return 'missed';
              const hours = parseFloat(sleep.duration || '0');
              return hours >= 7 ? 'good' : 'average';
            }),
            stretching: logs.map(l => l.activities.find(a => a.name === 'Stretching')?.completed ? 'completed' : 'missed'),
            hydration: logs.map(l => {
              const hydration = l.activities.find(a => a.name === 'Hydration');
              if (!hydration?.completed) return 'low';
              return hydration.duration?.includes('8/8') ? 'high' : 'medium';
            }),
            mindfulness: logs.map(l => {
              const mindfulness = l.activities.find(a => a.name === 'Mindfulness');
              if (!mindfulness?.completed) return 'missed';
              const mins = parseInt(mindfulness.duration || '0');
              return mins >= 15 ? 'long' : 'short';
            }),
          }
        };

        const { data: responseData, error: fnError } = await supabase.functions.invoke('weekly-ai-insight', {
          body: activityData
        });

        if (fnError) {
          console.error('AI insight fetch error:', fnError);
          setData(FALLBACK_DATA);
          return;
        }

        setData(responseData || FALLBACK_DATA);
      } catch (err) {
        console.error('AI insight error:', err);
        setError('Failed to load insights');
        setData(FALLBACK_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [isDemoUser, demoUserName]);

  // Get a rotating micro-copy
  const currentMicroCopy = data?.microCopyCandidates?.[
    Math.floor(Date.now() / 60000) % (data?.microCopyCandidates?.length || 1)
  ] || null;

  return {
    data: data || FALLBACK_DATA,
    isLoading,
    error,
    currentMicroCopy,
  };
};
