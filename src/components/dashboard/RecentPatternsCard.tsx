import { Moon, Droplets, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLatestDataRange, getSevenDaysEndingAt } from '@/hooks/useLatestDataRange';
import { useUserProfile } from '@/context/UserProfileContext';

const ACTIVITY_TYPE_IDS = {
  sleeping: 'e74434f7-3f12-4854-a66f-493f0fc1cb28',
  hydration: 'd3942123-3739-459f-ac0d-04f8de531dc7',
  mindfulness: 'e363142a-a13c-45bd-9728-a1143a2b5d5a',
};

interface Pattern {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  bgColor: string;
}

const defaultPatterns: Pattern[] = [
  { icon: Moon, text: 'Sleep has been consistent.', bgColor: 'bg-activity-sleep' },
  { icon: Droplets, text: 'Hydration is building up.', bgColor: 'bg-activity-hydration' },
  { icon: Brain, text: 'Mindfulness stayed light but regular.', bgColor: 'bg-activity-mindfulness' },
];

const analyzePatterns = (logs: any[]): Pattern[] => {
  const sleepLogs = logs.filter(l => l.activity_type_id === ACTIVITY_TYPE_IDS.sleeping);
  const hydrationLogs = logs.filter(l => l.activity_type_id === ACTIVITY_TYPE_IDS.hydration);
  const mindfulnessLogs = logs.filter(l => l.activity_type_id === ACTIVITY_TYPE_IDS.mindfulness);

  const newPatterns: Pattern[] = [];

  if (sleepLogs.length >= 5) {
    const avgSleep = sleepLogs.reduce((sum, l) => sum + (l.sleep_duration_hours || 0), 0) / sleepLogs.length;
    newPatterns.push({ icon: Moon, text: avgSleep >= 7 ? 'Sleep has been consistent and restful.' : 'Sleep is building toward consistency.', bgColor: 'bg-activity-sleep' });
  } else if (sleepLogs.length > 0) {
    newPatterns.push({ icon: Moon, text: 'Sleep tracking is taking shape.', bgColor: 'bg-activity-sleep' });
  }

  if (hydrationLogs.length >= 4) {
    const avgHydration = hydrationLogs.reduce((sum, l) => sum + (l.hydration_units || 0), 0) / hydrationLogs.length;
    newPatterns.push({ icon: Droplets, text: avgHydration >= 7 ? 'Hydration has been strong this week.' : 'Hydration is improving gradually.', bgColor: 'bg-activity-hydration' });
  } else if (hydrationLogs.length > 0) {
    newPatterns.push({ icon: Droplets, text: 'Hydration habits are forming.', bgColor: 'bg-activity-hydration' });
  }

  if (mindfulnessLogs.length >= 3) {
    newPatterns.push({ icon: Brain, text: 'Mindfulness stayed light but regular.', bgColor: 'bg-activity-mindfulness' });
  } else if (mindfulnessLogs.length > 0) {
    newPatterns.push({ icon: Brain, text: 'Mindfulness sessions are emerging.', bgColor: 'bg-activity-mindfulness' });
  }

  return newPatterns;
};

export const RecentPatternsCard = () => {
  const { session, authLoading } = useUserProfile();
  const { latestDate, isLoading: rangeLoading } = useLatestDataRange();
  const [patterns, setPatterns] = useState<Pattern[]>(defaultPatterns);
  const [isLoading, setIsLoading] = useState(true);

  console.log('[DEBUG] RecentPatternsCard initialized, authLoading:', authLoading, 'rangeLoading:', rangeLoading);

  useEffect(() => {
    console.log('[DEBUG] RecentPatternsCard effect, authLoading:', authLoading, 'rangeLoading:', rangeLoading, 'userId:', session?.user?.id ?? 'none');

    if (authLoading || rangeLoading) return;

    if (!session?.user) {
      console.log('[DEBUG] RecentPatternsCard: no session user');
      setIsLoading(false);
      return;
    }

    const userId = session.user.id;

    const fetchPatterns = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('date', sevenDaysAgo.toISOString().split('T')[0])
          .eq('completed', true);

        if (error) { console.error('[DEBUG] RecentPatternsCard error:', error); setIsLoading(false); return; }

        let activeLogs = logs || [];

        if (activeLogs.length === 0 && latestDate) {
          console.log('[DEBUG] RecentPatternsCard: falling back to latestDate', latestDate);
          const fallbackStart = getSevenDaysEndingAt(latestDate);
          const { data: fallbackLogs } = await supabase
            .from('activity_logs')
            .select('*')
            .eq('user_id', userId)
            .gte('date', fallbackStart)
            .lte('date', latestDate)
            .eq('completed', true);
          activeLogs = fallbackLogs || [];
        }

        if (activeLogs.length === 0) {
          console.log('[DEBUG] RecentPatternsCard: Query returned 0 rows – possible causes: wrong table, user_id mismatch, or empty database');
        } else {
          console.log('[DEBUG] RecentPatternsCard: processing', activeLogs.length, 'logs');
        }

        const newPatterns = analyzePatterns(activeLogs);
        setPatterns(newPatterns.length > 0 ? newPatterns : defaultPatterns);
      } catch (err) {
        console.error('[DEBUG] RecentPatternsCard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatterns();
  }, [session, authLoading, latestDate, rangeLoading]);

  return (
    <div className="wellora-card animate-fade-in-up stagger-1">
      <h3 className="text-base font-medium text-foreground mb-4">Recent patterns</h3>
      <div className="space-y-3">
        {patterns.map((pattern, index) => {
          const Icon = pattern.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${pattern.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">{pattern.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
