import { Droplets, Brain, Footprints, Moon, PersonStanding } from 'lucide-react';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const activities = [
  {
    name: 'Walking',
    icon: Footprints,
    color: 'bg-activity-walking',
    mutedColor: 'bg-activity-walking-muted',
    pattern: [true, true, false, true, true, false, false],
  },
  {
    name: 'Sleep',
    icon: Moon,
    color: 'bg-activity-sleep',
    mutedColor: 'bg-activity-sleep-muted',
    pattern: [true, true, true, true, true, false, false],
  },
  {
    name: 'Hydration',
    icon: Droplets,
    color: 'bg-activity-hydration',
    mutedColor: 'bg-activity-hydration-muted',
    pattern: [false, true, true, false, true, false, false],
  },
  {
    name: 'Stretching',
    icon: PersonStanding,
    color: 'bg-activity-stretching',
    mutedColor: 'bg-activity-stretching-muted',
    pattern: [true, false, true, false, true, false, false],
  },
  {
    name: 'Mindfulness',
    icon: Brain,
    color: 'bg-activity-mindfulness',
    mutedColor: 'bg-activity-mindfulness-muted',
    pattern: [true, true, false, true, true, false, false],
  },
];

export const WeeklyRhythmStrips = () => {
  return (
    <div className="wellora-card animate-fade-in-up">
      <h3 className="text-base font-medium text-foreground mb-1">Your weekly rhythm</h3>
      <p className="text-xs text-muted-foreground mb-4">A gentle view of how your habits showed up.</p>
      
      {/* Day headers */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-20 flex-shrink-0" />
        <div className="flex-1 flex justify-between px-0.5">
          {days.map((day, i) => (
            <span key={i} className="text-[10px] text-muted-foreground w-5 text-center">{day}</span>
          ))}
        </div>
      </div>
      
      {/* Activity rows */}
      <div className="space-y-2">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.name} className="flex items-center gap-2">
              <div className="w-20 flex items-center gap-1.5 flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">{activity.name}</span>
              </div>
              <div className="flex-1 flex justify-between gap-1">
                {activity.pattern.map((active, i) => (
                  <div
                    key={i}
                    className={`h-5 flex-1 rounded-md transition-all ${
                      active ? activity.color : activity.mutedColor
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
