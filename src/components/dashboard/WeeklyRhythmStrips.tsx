import { useState, useEffect } from 'react';
import { Droplets, Brain, Footprints, Moon, PersonStanding } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Activity type IDs from the database
const ACTIVITY_TYPE_IDS = {
  walking: '038a9c76-4848-48a9-8245-2d2fefe85711',
  sleeping: 'e74434f7-3f12-4854-a66f-493f0fc1cb28',
  stretching: '1f244fe2-03a7-45b8-8da8-5ecd8868821f',
  hydration: 'd3942123-3739-459f-ac0d-04f8de531dc7',
  mindfulness: 'e363142a-a13c-45bd-9728-a1143a2b5d5a',
};

const activityConfig = [
  {
    name: 'Walking',
    typeId: ACTIVITY_TYPE_IDS.walking,
    icon: Footprints,
    activeColor: 'bg-activity-walking/40',
    inactiveColor: 'bg-muted/40',
  },
  {
    name: 'Sleep',
    typeId: ACTIVITY_TYPE_IDS.sleeping,
    icon: Moon,
    activeColor: 'bg-activity-sleep/40',
    inactiveColor: 'bg-muted/40',
  },
  {
    name: 'Hydration',
    typeId: ACTIVITY_TYPE_IDS.hydration,
    icon: Droplets,
    activeColor: 'bg-activity-hydration/40',
    inactiveColor: 'bg-muted/40',
  },
  {
    name: 'Stretching',
    typeId: ACTIVITY_TYPE_IDS.stretching,
    icon: PersonStanding,
    activeColor: 'bg-activity-stretching/40',
    inactiveColor: 'bg-muted/40',
  },
  {
    name: 'Mindfulness',
    typeId: ACTIVITY_TYPE_IDS.mindfulness,
    icon: Brain,
    activeColor: 'bg-activity-mindfulness/40',
    inactiveColor: 'bg-muted/40',
  },
];

// Get the last 7 days starting from Monday of current week
const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Adjust to get Monday (0 = Sunday, so Monday = 1)
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.toISOString().split('T')[0];
  });
};

export const WeeklyRhythmStrips = () => {
  const [activityPatterns, setActivityPatterns] = useState<Record<string, boolean[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        const weekDates = getWeekDates();
        
        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('activity_type_id, date, completed')
          .eq('user_id', user.id)
          .in('date', weekDates);

        if (error) {
          console.error('Error fetching weekly data:', error);
          setIsLoading(false);
          return;
        }

        // Build pattern for each activity
        const patterns: Record<string, boolean[]> = {};
        
        activityConfig.forEach(activity => {
          patterns[activity.typeId] = weekDates.map(date => {
            const log = logs?.find(
              l => l.activity_type_id === activity.typeId && l.date === date
            );
            return log?.completed || false;
          });
        });

        setActivityPatterns(patterns);
      } catch (err) {
        console.error('Error in weekly rhythm fetch:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <div className="bg-card/60 border border-border/30 rounded-2xl p-4 animate-fade-in-up">
      <h3 className="text-sm font-medium text-foreground mb-0.5">Your weekly rhythm</h3>
      <p className="text-[10px] text-muted-foreground mb-3">A gentle view of how your habits showed up.</p>
      
      {/* Day headers */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-[72px] flex-shrink-0" />
        <div className="flex-1 flex justify-between px-0.5">
          {days.map((day, i) => (
            <span key={i} className="text-[9px] text-muted-foreground/70 w-4 text-center">{day}</span>
          ))}
        </div>
      </div>
      
      {/* Activity rows */}
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
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      active ? activity.activeColor : activity.inactiveColor
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
