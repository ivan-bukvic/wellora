import { Droplets, Brain, Footprints, Moon, PersonStanding } from 'lucide-react';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const activities = [
  {
    name: 'Walking',
    icon: Footprints,
    activeColor: 'bg-activity-walking/40',
    inactiveColor: 'bg-activity-walking/[0.08]',
    pattern: [true, true, false, true, true, false, false],
  },
  {
    name: 'Sleep',
    icon: Moon,
    activeColor: 'bg-activity-sleep/40',
    inactiveColor: 'bg-activity-sleep/[0.08]',
    pattern: [true, true, true, true, true, false, false],
  },
  {
    name: 'Hydration',
    icon: Droplets,
    activeColor: 'bg-activity-hydration/40',
    inactiveColor: 'bg-activity-hydration/[0.08]',
    pattern: [false, true, true, false, true, false, false],
  },
  {
    name: 'Stretching',
    icon: PersonStanding,
    activeColor: 'bg-activity-stretching/40',
    inactiveColor: 'bg-activity-stretching/[0.08]',
    pattern: [true, false, true, false, true, false, false],
  },
  {
    name: 'Mindfulness',
    icon: Brain,
    activeColor: 'bg-activity-mindfulness/40',
    inactiveColor: 'bg-activity-mindfulness/[0.08]',
    pattern: [true, true, false, true, true, false, false],
  },
];

export const WeeklyRhythmStrips = () => {
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
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.name} className="flex items-center gap-1.5">
              <div className="w-[72px] flex items-center gap-1 flex-shrink-0">
                <Icon className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-[10px] text-muted-foreground">{activity.name}</span>
              </div>
              <div className="flex-1 flex justify-between gap-0.5">
                {activity.pattern.map((active, i) => (
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
