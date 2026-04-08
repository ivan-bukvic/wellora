import { useState, useEffect } from 'react';
import { Footprints, Moon, Droplets, Brain, PersonStanding, LucideProps } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/context/UserProfileContext';

interface FlowActivity {
  name: string;
  time: string;
  duration: string;
  completed: boolean;
  hourOfDay: number;
}

const ACTIVITY_TYPE_IDS = {
  walking: '038a9c76-4848-48a9-8245-2d2fefe85711',
  sleeping: 'e74434f7-3f12-4854-a66f-493f0fc1cb28',
  stretching: '1f244fe2-03a7-45b8-8da8-5ecd8868821f',
  hydration: 'd3942123-3739-459f-ac0d-04f8de531dc7',
  mindfulness: 'e363142a-a13c-45bd-9728-a1143a2b5d5a',
};

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Walking: Footprints,
  Sleeping: Moon,
  Stretching: PersonStanding,
  Hydration: Droplets,
  Mindfulness: Brain,
};

const activityColorMap: Record<string, string> = {
  Walking: 'hsl(var(--activity-walking))',
  Sleeping: 'hsl(var(--activity-sleep))',
  Stretching: 'hsl(var(--activity-stretching))',
  Hydration: 'hsl(var(--activity-hydration))',
  Mindfulness: 'hsl(var(--activity-mindfulness))',
};

const defaultFlow: FlowActivity[] = [
  { name: 'Sleeping', time: '6:30 AM', duration: '7.5 hours', completed: true, hourOfDay: 6.5 },
  { name: 'Stretching', time: '7:00 AM', duration: '15 min', completed: true, hourOfDay: 7 },
  { name: 'Walking', time: '8:30 AM', duration: '30 min', completed: true, hourOfDay: 8.5 },
  { name: 'Hydration', time: '12:00 PM', duration: '6/8 glasses', completed: true, hourOfDay: 12 },
  { name: 'Mindfulness', time: '3:30 PM', duration: '10 min', completed: true, hourOfDay: 15.5 },
];

const timeScale = {
  start: 6,
  end: 21,
  labels: [
    { hour: 6, label: '6 AM' },
    { hour: 9, label: '9 AM' },
    { hour: 12, label: '12 PM' },
    { hour: 15, label: '3 PM' },
    { hour: 18, label: '6 PM' },
    { hour: 21, label: '9 PM' },
  ],
};

const getPositionPercent = (hour: number) => {
  const range = timeScale.end - timeScale.start;
  return ((hour - timeScale.start) / range) * 100;
};

const getActivityName = (typeId: string): string => {
  switch (typeId) {
    case ACTIVITY_TYPE_IDS.walking: return 'Walking';
    case ACTIVITY_TYPE_IDS.sleeping: return 'Sleeping';
    case ACTIVITY_TYPE_IDS.stretching: return 'Stretching';
    case ACTIVITY_TYPE_IDS.hydration: return 'Hydration';
    case ACTIVITY_TYPE_IDS.mindfulness: return 'Mindfulness';
    default: return 'Activity';
  }
};

const formatDuration = (log: any): string => {
  const name = getActivityName(log.activity_type_id);
  if (name === 'Sleeping' && log.sleep_duration_hours) return `${log.sleep_duration_hours} hours`;
  if (name === 'Hydration' && log.hydration_units) return `${log.hydration_units}/8 glasses`;
  if (log.duration_minutes) return `${log.duration_minutes} min`;
  return 'Completed';
};

const getActivityHour = (name: string, index: number): number => {
  switch (name) {
    case 'Sleeping': return 6.5;
    case 'Stretching': return 7;
    case 'Walking': return 8.5;
    case 'Hydration': return 12;
    case 'Mindfulness': return 15.5;
    default: return 9 + index * 2;
  }
};

const formatTimeOfDay = (hour: number): string => {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return m > 0 ? `${displayHour}:${m.toString().padStart(2, '0')} ${period}` : `${displayHour}:00 ${period}`;
};

const DailyFlowTimeline = () => {
  const { session, authLoading } = useUserProfile();
  const [todayFlow, setTodayFlow] = useState<FlowActivity[]>(defaultFlow);
  const [isLoading, setIsLoading] = useState(true);
  const [flowDate, setFlowDate] = useState<string | null>(null);
  const timelineY = 40;

  console.log('[DEBUG] DailyFlowTimeline initialized, authLoading:', authLoading, 'userId:', session?.user?.id ?? 'none');

  useEffect(() => {
    console.log('[DEBUG] DailyFlowTimeline effect running, authLoading:', authLoading, 'userId:', session?.user?.id ?? 'none');

    if (authLoading) return;

    if (!session?.user) {
      console.log('[DEBUG] DailyFlowTimeline: no session user, skipping fetch');
      setIsLoading(false);
      return;
    }

    const userId = session.user.id;

    const fetchTodayFlow = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        let { data: logs, error } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today);

        if (error) { console.error('[DEBUG] DailyFlowTimeline error:', error); setIsLoading(false); return; }

        if (!logs || logs.length === 0) {
          console.log('[DEBUG] DailyFlowTimeline: no logs today, fetching latest');
          const { data: recentLogs, error: recentError } = await supabase
            .from('activity_logs')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(10);

          if (!recentError && recentLogs && recentLogs.length > 0) {
            const latestDate = recentLogs[0].date;
            logs = recentLogs.filter(l => l.date === latestDate);
            setFlowDate(latestDate);
            console.log('[DEBUG] DailyFlowTimeline: using fallback date', latestDate, 'with', logs.length, 'logs');
          } else {
            console.log('[DEBUG] DailyFlowTimeline: Query returned 0 rows – possible causes: wrong table, user_id mismatch, or empty database');
          }
        } else {
          console.log('[DEBUG] DailyFlowTimeline: found', logs.length, 'logs for today');
        }

        if (logs && logs.length > 0) {
          const flowActivities: FlowActivity[] = logs.map((log, index) => {
            const name = getActivityName(log.activity_type_id);
            const hourOfDay = getActivityHour(name, index);
            return {
              name,
              time: formatTimeOfDay(hourOfDay),
              duration: formatDuration(log),
              completed: log.completed,
              hourOfDay,
            };
          });
          flowActivities.sort((a, b) => a.hourOfDay - b.hourOfDay);
          setTodayFlow(flowActivities);
        }
      } catch (err) {
        console.error('[DEBUG] DailyFlowTimeline fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayFlow();
  }, [session, authLoading]);
  
  return (
    <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden flex flex-col" style={{ background: 'linear-gradient(to bottom right, hsl(var(--primary) / 0.03), hsl(var(--background)), hsl(var(--primary) / 0.02))' }}>
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-base font-semibold text-foreground">
          {flowDate ? `Last recorded: ${new Date(flowDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Today's Flow"}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          A gentle timeline of how your day unfolded
        </p>
      </div>
      
      <div className="flex-1 flex flex-col px-6 pb-4">
        <div className="relative flex-1" style={{ minHeight: '140px' }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="flowLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
                <stop offset="15%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                <stop offset="85%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <path d="M 0 40 Q 60 36, 120 42 Q 180 48, 240 38 Q 300 32, 360 42 Q 380 46, 400 40" stroke="url(#flowLineGradient)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
          
          {todayFlow.map((activity) => {
            const xPercent = getPositionPercent(activity.hourOfDay);
            return (
              <div key={`guide-${activity.name}`} className="absolute" style={{ left: `${xPercent}%`, top: `${timelineY + 8}%`, height: `${100 - timelineY - 8}%`, width: '1px', backgroundImage: 'linear-gradient(to bottom, hsl(var(--muted-foreground) / 0.15) 2px, transparent 2px)', backgroundSize: '1px 6px', transform: 'translateX(-50%)' }} />
            );
          })}
          
          <TooltipProvider delayDuration={100}>
            {todayFlow.map((activity) => {
              const Icon = iconMap[activity.name];
              const activityColor = activityColorMap[activity.name];
              const xPercent = getPositionPercent(activity.hourOfDay);
              if (!Icon) return null;
              return (
                <div key={activity.name} className="absolute flex flex-col items-center" style={{ left: `${xPercent}%`, top: `${timelineY}%`, transform: 'translate(-50%, -50%)' }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md bg-card border-2 ${activity.completed ? '' : 'opacity-60'} shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30`} style={{ borderColor: activityColor }}>
                        <Icon className="w-4 h-4 text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-border/50 shadow-soft px-3 py-2" sideOffset={8}>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{activity.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                        <p className="text-xs text-primary font-medium mt-0.5">{activity.duration}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  <span className="mt-1.5 text-[9px] text-muted-foreground/60 font-medium whitespace-nowrap">
                    {activity.time.replace(' AM', '').replace(' PM', '')}
                  </span>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
        
        <div className="relative h-5 mt-1">
          {timeScale.labels.map(({ hour, label }) => {
            const xPercent = getPositionPercent(hour);
            return (
              <span key={hour} className="absolute text-[10px] text-muted-foreground/40 font-medium transform -translate-x-1/2" style={{ left: `${xPercent}%` }}>
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyFlowTimeline;
