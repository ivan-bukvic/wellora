import { useState, useEffect } from 'react';
import { Droplets, Brain, Footprints, Moon, PersonStanding } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLatestDataRange, getWeekDatesFor } from '@/hooks/useLatestDataRange';
import { useUserProfile } from '@/context/UserProfileContext';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const ACTIVITY_TYPE_IDS = {
  walking: '038a9c76-4848-48a9-8245-2d2fefe85711',
  sleeping: 'e74434f7-3f12-4854-a66f-493f0fc1cb28',
  stretching: '1f244fe2-03a7-45b8-8da8-5ecd8868821f',
  hydration: 'd3942123-3739-459f-ac0d-04f8de531dc7',
  mindfulness: 'e363142a-a13c-45bd-9728-a1143a2b5d5a',
};

const activityConfig = [
  { name: 'Walking', typeId: ACTIVITY_TYPE_IDS.walking, icon: Footprints, activeColor: 'bg-activity-walking/40', inactiveColor: 'bg-muted/40' },
  { name: 'Sleep', typeId: ACTIVITY_TYPE_IDS.sleeping, icon: Moon, activeColor: 'bg-activity-sleep/40', inactiveColor: 'bg-muted/40' },
  { name: 'Hydration', typeId: ACTIVITY_TYPE_IDS.hydration, icon: Droplets, activeColor: 'bg-activity-hydration/40', inactiveColor: 'bg-muted/40' },
  { name: 'Stretching', typeId: ACTIVITY_TYPE_IDS.stretching, icon: PersonStanding, activeColor: 'bg-activity-stretching/40', inactiveColor: 'bg-muted/40' },
  { name: 'Mindfulness', typeId: ACTIVITY_TYPE_IDS.mindfulness, icon: Brain, activeColor: 'bg-activity-mindfulness/40', inactiveColor: 'bg-muted/40' },
];

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.toISOString().split('T')[0];
  });
};

const buildPatterns = (logs: any[], weekDates: string[]) => {
  const patterns: Record<string, boolean[]> = {};
  activityConfig.forEach(activity => {
    patterns[activity.typeId] = weekDates.map(date => {
      const log = logs?.find(l => l.activity_type_id === activity.typeId && l.date === date);
      return log?.completed || false;
    });
  });
  return patterns;
};

export const WeeklyRhythmStrips = () => {
  const { session, authLoading } = useUserProfile();
  const { latestDate, isLoading: rangeLoading } = useLatestDataRange();
  const [activityPatterns, setActivityPatterns] = useState<Record<string, boolean[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showingHistorical, setShowingHistorical] = useState(false);
  const [historicalLabel, setHistoricalLabel] = useState('');

  console.log('[DEBUG] WeeklyRhythmStrips initialized, authLoading:', authLoading, 'rangeLoading:', rangeLoading);

  useEffect(() => {
    console.log('[DEBUG] WeeklyRhythmStrips effect, authLoading:', authLoading, 'rangeLoading:', rangeLoading, 'userId:', session?.user?.id ?? 'none');

    if (authLoading || rangeLoading) return;

    if (!session?.user) {
      console.log('[DEBUG] WeeklyRhythmStrips: no session user');
      setIsLoading(false);
      return;
    }

    const userId = session.user.id;

    const fetchWeeklyData = async () => {
      try {
        const weekDates = getWeekDates();
        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('activity_type_id, date, completed')
          .eq('user_id', userId)
          .in('date', weekDates);

        if (error) { console.error('[DEBUG] WeeklyRhythmStrips error:', error); setIsLoading(false); return; }

        const hasData = logs && logs.length > 0;
        if (hasData) {
          console.log('[DEBUG] WeeklyRhythmStrips: current week has', logs.length, 'logs');
          setActivityPatterns(buildPatterns(logs, weekDates));
          setShowingHistorical(false);
        } else if (latestDate) {
          console.log('[DEBUG] WeeklyRhythmStrips: falling back to latestDate', latestDate);
          const fallbackWeek = getWeekDatesFor(latestDate);
          const { data: fallbackLogs } = await supabase
            .from('activity_logs')
            .select('activity_type_id, date, completed')
            .eq('user_id', userId)
            .in('date', fallbackWeek);

          if (fallbackLogs && fallbackLogs.length > 0) {
            setActivityPatterns(buildPatterns(fallbackLogs, fallbackWeek));
            setShowingHistorical(true);
            const d = new Date(fallbackWeek[0] + 'T00:00:00');
            setHistoricalLabel(`Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
          } else {
            console.log('[DEBUG] WeeklyRhythmStrips: Query returned 0 rows – possible causes: wrong table, user_id mismatch, or empty database');
          }
        } else {
          console.log('[DEBUG] WeeklyRhythmStrips: Query returned 0 rows – possible causes: wrong table, user_id mismatch, or empty database');
        }
      } catch (err) {
        console.error('[DEBUG] WeeklyRhythmStrips fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, [session, authLoading, latestDate, rangeLoading]);

  return (
    <div className="bg-card/60 border border-border/30 rounded-2xl p-4 animate-fade-in-up">
      <div className="flex items-center justify-between mb-0.5">
        <h3 className="text-sm font-medium text-foreground">Your weekly rhythm</h3>
        {showingHistorical && (
          <span className="text-[9px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">{historicalLabel}</span>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground mb-3">A gentle view of how your habits showed up.</p>
      
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-[72px] flex-shrink-0" />
        <div className="flex-1 flex justify-between px-0.5">
          {days.map((day, i) => (
            <span key={i} className="text-[9px] text-muted-foreground/70 w-4 text-center">{day}</span>
          ))}
        </div>
      </div>
      
      <div className="space-y-1.5">
        {activityConfig.map((activity) => {
          const Icon = activity.icon;
          const pattern = activityPatterns[activity.typeId] || Array(7).fill(false);
          return (
            <div key={activity.name} className="flex items-center gap-1.5">
              <div className="w-[72px] flex items-center gap-1 flex-shrink-0">
                <Icon className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-[10px] text-muted-foreground">{activity.name}</span>
              </div>
              <div className="flex-1 flex justify-between gap-0.5">
                {pattern.map((active, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-all ${active ? activity.activeColor : activity.inactiveColor}`} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
