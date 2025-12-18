import { Target, Moon, Droplets, Brain, Footprints } from 'lucide-react';

const goals = [
  {
    icon: Moon,
    label: 'Sleep',
    current: 47,
    target: 240,
    unit: 'hrs',
    color: 'bg-secondary',
  },
  {
    icon: Droplets,
    label: 'Drink Water',
    current: 108,
    target: 180,
    unit: 'L',
    color: 'bg-accent',
  },
  {
    icon: Brain,
    label: 'Mindfulness',
    current: 7,
    target: 10,
    unit: 'hrs',
    color: 'bg-warm',
  },
  {
    icon: Footprints,
    label: 'Daily Steps',
    current: 5600,
    target: 10000,
    unit: '/Day',
    color: 'bg-primary',
  },
];

export const MonthlyGoalsCard = () => {
  return (
    <div className="wellora-card animate-fade-in-up stagger-3">
      <div className="flex items-center gap-2 mb-5">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Your Monthly Goals</h3>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const progress = (goal.current / goal.target) * 100;
          
          return (
            <div key={goal.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{goal.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              
              <div className="goal-progress">
                <div 
                  className={`goal-progress-fill ${goal.color}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
