import { Target, Moon, Droplets, Brain, Footprints, PersonStanding } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserHasData } from '@/hooks/useUserHasData';

const goals = [
  {
    icon: Moon,
    label: 'Sleep',
    current: 47,
    target: 240,
    unit: 'hrs',
    color: 'bg-activity-sleep',
  },
  {
    icon: Droplets,
    label: 'Drink Water',
    current: 108,
    target: 180,
    unit: 'L',
    color: 'bg-activity-hydration',
  },
  {
    icon: Brain,
    label: 'Mindfulness',
    current: 7,
    target: 10,
    unit: 'hrs',
    color: 'bg-activity-mindfulness',
  },
  {
    icon: PersonStanding,
    label: 'Stretching',
    current: 12,
    target: 20,
    unit: 'sessions',
    color: 'bg-activity-stretching',
  },
  {
    icon: Footprints,
    label: 'Daily Steps',
    current: 5600,
    target: 10000,
    unit: '/Day',
    color: 'bg-activity-walking',
  },
];

const EmptyState = () => (
  <div className="wellora-card animate-fade-in-up stagger-3 h-[280px] flex flex-col">
    <div className="flex items-center gap-2 mb-3">
      <Target className="w-4 h-4 text-muted-foreground/50" />
      <h3 className="text-base font-semibold text-foreground">Your Monthly Goals</h3>
    </div>
    
    <div className="flex-1 flex flex-col">
      {/* Empty progress bars */}
      <div className="space-y-2.5">
        {goals.slice(0, 4).map((goal) => {
          const Icon = goal.icon;
          return (
            <div key={goal.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground/30" />
                  <span className="text-xs font-medium text-muted-foreground/50">{goal.label}</span>
                </div>
              </div>
              
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-muted/30" style={{ width: '0%' }} />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Centered message */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs text-muted-foreground/60 text-center">
          Your progress will appear as you track activities.
        </p>
      </div>
    </div>
  </div>
);

export const MonthlyGoalsCard = () => {
  const { hasData, isLoading } = useUserHasData();

  // Show empty state for new users
  if (!isLoading && !hasData) {
    return <EmptyState />;
  }

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
            const progress = (goal.current / goal.target) * 100;
            
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
