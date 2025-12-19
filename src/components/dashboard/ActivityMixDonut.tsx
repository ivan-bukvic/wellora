import { Footprints, Moon, Droplets, Brain, PersonStanding } from 'lucide-react';

const activities = [
  { name: 'Walking', icon: Footprints, color: 'hsl(var(--activity-walking))' },
  { name: 'Sleeping', icon: Moon, color: 'hsl(var(--activity-sleep))' },
  { name: 'Hydration', icon: Droplets, color: 'hsl(var(--activity-hydration))' },
  { name: 'Mindfulness', icon: Brain, color: 'hsl(var(--activity-mindfulness))' },
  { name: 'Stretching', icon: PersonStanding, color: 'hsl(var(--activity-stretching))' },
];

export const ActivityMixDonut = () => {
  const total = activities.length;
  const segmentAngle = 360 / total;
  const gap = 8; // Gap between segments in degrees
  const actualSegment = segmentAngle - gap;
  
  const size = 220;
  const strokeWidth = 40;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate segment length for each activity
  const segmentLength = (actualSegment / 360) * circumference;
  const gapLength = (gap / 360) * circumference;

  return (
    <div className="wellora-card animate-fade-in-up">
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              const startAngle = index * segmentAngle;
              const offset = (startAngle / 360) * circumference;
              
              return (
                <circle
                  key={activity.name}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={activity.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          
          {/* Icons positioned around the donut */}
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            // Position icons in the middle of each segment
            const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
            const iconRadius = radius; // Position on the donut itself
            const iconX = center + iconRadius * Math.cos(angle);
            const iconY = center + iconRadius * Math.sin(angle);
            
            return (
              <div
                key={activity.name}
                className="absolute flex items-center justify-center"
                style={{
                  left: iconX - 12,
                  top: iconY - 12,
                  width: 24,
                  height: 24,
                }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: 'white' }}
                >
                  <Icon className="w-3.5 h-3.5 text-foreground/70" />
                </div>
              </div>
            );
          })}
        </div>
        
        <p className="text-sm text-muted-foreground mt-4 text-center">
          A gentle snapshot of how your activities are distributed.
        </p>
      </div>
    </div>
  );
};
