import { useState, useEffect } from 'react';
import { Target, Moon, Droplets, Brain, Footprints, PersonStanding } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

// Activity type IDs from the database
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

const goalConfig: Goal[] = [
  {
    icon: Moon,
    label: 'Sleep',
    current: 0,
    target: 56, // 8 hrs * 7 days = 56 hrs/week target (monthly ~240)
    unit: 'hrs',
    color: 'bg-activity-sleep',
    typeId: ACTIVITY_TYPE_IDS.sleeping,
  },
  {
    icon: Droplets,
    label: 'Drink Water',
    current: 0,
    target: 56, // 8 glasses * 7 days (monthly ~180L equivalent)
    unit: 'glasses',
    color: 'bg-activity-hydration',
    typeId: ACTIVITY_TYPE_IDS.hydration,
  },
  {
    icon: Brain,
    label: 'Mindfulness',
    current: 0,
    target: 70, // 10 min * 7 days = 70 min/week
    unit: 'min',
    color: 'bg-activity-mindfulness',
    typeId: ACTIVITY_TYPE_IDS.mindfulness,
  },
  {
    icon: PersonStanding,
    label: 'Stretching',
    current: 0,
    target: 7, // 1 session per day
    unit: 'sessions',
    color: 'bg-activity-stretching',
    typeId: ACTIVITY_TYPE_IDS.stretching,
  },
  {
    icon: Footprints,
    label: 'Walking',
    current: 0,
    target: 210, // 30 min * 7 days = 210 min/week
    unit: 'min',
    color: 'bg-activity-walking',
    typeId: ACTIVITY_TYPE_IDS.walking,
  },
];

export const MonthlyGoalsCard = () => {
  const [goals, setGoals] = useState(goalConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoalsData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Get this month's start date
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', monthStart.toISOString().split('T')[0])
          .eq('completed', true);

        if (error) {
          console.error('Error fetching goals data:', error);
          setIsLoading(false);
          return;
        }

        // Calculate current values for each goal
        const updatedGoals = goalConfig.map(goal => {
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
              current = activityLogs.length; // Count sessions
              break;
          }

          return { ...goal, current };
        });

        setGoals(updatedGoals);
      } catch (err) {
        console.error('Error in goals fetch:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoalsData();
  }, []);

  return (
    <div className="wellora-card animate-fade-in-up stagger-3 h-[280px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-primary" />
        <h3 className="text-base font-semibold text-foreground">Your Monthly Goals</h3>
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
                  <span className="text-[10px] text-muted-foreground">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${goal.color}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
