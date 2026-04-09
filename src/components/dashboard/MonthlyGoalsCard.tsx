import { useState, useEffect } from 'react';
import { Target, Moon, Droplets, Brain, Footprints, PersonStanding } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useLatestDataRange } from '@/hooks/useLatestDataRange';
import { useUserProfile } from '@/context/UserProfileContext';

const ACTIVITY_TYPE_IDS = {
  sleeping: 'e74434f7-3f12-4854-a66f-493f0fc1cb28',
  hydration: 'd3942123-3739-459f-ac0d-04f8de531dc7',
  mindfulness: 'e363142a-a13c-45bd-9728-a1143a2b5d5a',
  stretching: '1f244fe2-03a7-45b8-8da8-5ecd8868821f',
  walking: '038a9c76-4848-48a9-8245-2d2fefe85711',
};

interface Goal {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  typeId: string;
}

// Weekly-based targets (e.g. Sleep 56 = 8 hrs/day × 7)
const goalConfig: Goal[] = [
  { icon: Moon, label: 'Sleep', current: 0, target: 56, unit: 'hrs', color: 'bg-activity-sleep', typeId: ACTIVITY_TYPE_IDS.sleeping },
  { icon: Droplets, label: 'Drink Water', current: 0, target: 56, unit: 'glasses', color: 'bg-activity-hydration', typeId: ACTIVITY_TYPE_IDS.hydration },
  { icon: Brain, label: 'Mindfulness', current: 0, target: 70, unit: 'min', color: 'bg-activity-mindfulness', typeId: ACTIVITY_TYPE_IDS.mindfulness },
  { icon: PersonStanding, label: 'Stretching', current: 0, target: 7, unit: 'sessions', color: 'bg-activity-stretching', typeId: ACTIVITY_TYPE_IDS.stretching },
  { icon: Footprints, label: 'Walking', current: 0, target: 210, unit: 'min', color: 'bg-activity-walking', typeId: ACTIVITY_TYPE_IDS.walking },
];

const computeGoals = (logs: any[], actualDays: number): Goal[] => {
  const scale = actualDays / 7;
  return goalConfig.map(goal => {
    const adjustedTarget = Math.round(goal.target * scale);
    const activityLogs = logs?.filter(l => l.activity_type_id === goal.typeId) || [];
    let current = 0;
    switch (goal.typeId) {
      case ACTIVITY_TYPE_IDS.sleeping:
        current = Math.round(activityLogs.reduce((sum, l) => sum + (l.sleep_duration_hours || 0), 0));
        break;
      case ACTIVITY_TYPE_IDS.hydration:
        current = activityLogs.reduce((sum, l) => sum + (l.hydration_units || 0), 0);
        break;
      case ACTIVITY_TYPE_IDS.mindfulness:
      case ACTIVITY_TYPE_IDS.walking:
        current = activityLogs.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);
        break;
      case ACTIVITY_TYPE_IDS.stretching:
        current = activityLogs.length;
        break;
    }
    return { ...goal, current, target: adjustedTarget };
  });
};

const getActualDays = (logs: any[]): { actualDays: number; earliestDate: string; latestLogDate: string } => {
  const dates = logs.map(l => l.date as string).sort();
  const earliestDate = dates[0];
  const latestLogDate = dates[dates.length - 1];
  const diffMs = new Date(latestLogDate + 'T00:00:00').getTime() - new Date(earliestDate + 'T00:00:00').getTime();
  const actualDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return { actualDays, earliestDate, latestLogDate };
};

export const MonthlyGoalsCard = () => {
  const { session, authLoading } = useUserProfile();
  const { latestDate, latestMonthStart, isLoading: rangeLoading } = useLatestDataRange();
  const [goals, setGoals] = useState(goalConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [showingHistorical, setShowingHistorical] = useState(false);
  const [historicalLabel, setHistoricalLabel] = useState('');
  const [dataRangeLabel, setDataRangeLabel] = useState('');

  useEffect(() => {
    if (authLoading || rangeLoading) return;

    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    const userId = session.user.id;

    const processLogs = (logs: any[], monthLabel?: string) => {
      if (!logs || logs.length === 0) return false;
      const { actualDays, earliestDate, latestLogDate } = getActualDays(logs);
      console.log('Actual data range:', earliestDate, '→', latestLogDate, '=', actualDays, 'days');
      console.log('Filtered logs count:', logs.length);

      const computed = computeGoals(logs, actualDays);
      console.log('Adjusted goals:', computed.map(g => ({ label: g.label, current: g.current, target: g.target })));

      setGoals(computed);

      // Build range label like "Jan 1–21"
      const start = new Date(earliestDate + 'T00:00:00');
      const end = new Date(latestLogDate + 'T00:00:00');
      const monthName = start.toLocaleDateString('en-US', { month: 'short' });
      setDataRangeLabel(`${monthName} ${start.getDate()}–${end.getDate()}`);

      if (monthLabel) {
        setShowingHistorical(true);
        setHistoricalLabel(monthLabel);
      } else {
        setShowingHistorical(false);
      }
      return true;
    };

    const fetchGoalsData = async () => {
      try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const monthStartStr = monthStart.toISOString().split('T')[0];
        const monthEndStr = monthEnd.toISOString().split('T')[0];

        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('date', monthStartStr)
          .lte('date', monthEndStr)
          .eq('completed', true);

        if (error) { console.error('MonthlyGoalsCard error:', error); setIsLoading(false); return; }

        if (logs && logs.length > 0) {
          processLogs(logs);
        } else if (latestMonthStart && latestDate) {
          const fallbackDate = new Date(latestMonthStart + 'T00:00:00');
          const fallbackEndDate = new Date(fallbackDate.getFullYear(), fallbackDate.getMonth() + 1, 0);
          const fallbackEndStr = fallbackEndDate.toISOString().split('T')[0];

          const { data: fallbackLogs } = await supabase
            .from('activity_logs')
            .select('*')
            .eq('user_id', userId)
            .gte('date', latestMonthStart)
            .lte('date', fallbackEndStr)
            .eq('completed', true);

          const label = fallbackDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          processLogs(fallbackLogs || [], label);
        }
      } catch (err) {
        console.error('MonthlyGoalsCard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoalsData();
  }, [session, authLoading, latestDate, latestMonthStart, rangeLoading]);

  return (
    <div className="wellora-card animate-fade-in-up stagger-3 h-[280px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-primary" />
        <h3 className="text-base font-semibold text-foreground">Your Monthly Goals</h3>
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full ml-auto">
          {showingHistorical ? historicalLabel : dataRangeLabel}
        </span>
      </div>
      
      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="space-y-2.5">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            return (
              <div key={goal.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{goal.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{goal.current} / {goal.target} {goal.unit}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ease-out ${goal.color}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
