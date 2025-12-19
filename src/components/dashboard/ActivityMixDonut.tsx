import { Footprints, Moon, Droplets, Brain, PersonStanding } from 'lucide-react';

const activities = [
  { name: 'Walking', icon: Footprints, color: 'hsl(var(--activity-walking))' },
  { name: 'Sleeping', icon: Moon, color: 'hsl(var(--activity-sleep))' },
  { name: 'Hydration', icon: Droplets, color: 'hsl(var(--activity-hydration))' },
  { name: 'Mindfulness', icon: Brain, color: 'hsl(var(--activity-mindfulness))' },
  { name: 'Stretching', icon: PersonStanding, color: 'hsl(var(--activity-stretching))' },
];

// Helper to create arc path with rounded ends
const createArcPath = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  thickness: number
): string => {
  const innerRadius = radius - thickness / 2;
  const outerRadius = radius + thickness / 2;
  
  // Convert angles to radians
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);
  
  // Calculate points
  const outerStartX = cx + outerRadius * Math.cos(startRad);
  const outerStartY = cy + outerRadius * Math.sin(startRad);
  const outerEndX = cx + outerRadius * Math.cos(endRad);
  const outerEndY = cy + outerRadius * Math.sin(endRad);
  
  const innerStartX = cx + innerRadius * Math.cos(startRad);
  const innerStartY = cy + innerRadius * Math.sin(startRad);
  const innerEndX = cx + innerRadius * Math.cos(endRad);
  const innerEndY = cy + innerRadius * Math.sin(endRad);
  
  // Determine if the arc is greater than 180 degrees
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  
  // Create rounded ends by calculating semicircle paths
  const capRadius = thickness / 2;
  
  // Build the path
  const path = [
    // Move to outer start
    `M ${outerStartX} ${outerStartY}`,
    // Outer arc
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
    // End cap (semicircle)
    `A ${capRadius} ${capRadius} 0 0 1 ${innerEndX} ${innerEndY}`,
    // Inner arc (reverse direction)
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
    // Start cap (semicircle)
    `A ${capRadius} ${capRadius} 0 0 1 ${outerStartX} ${outerStartY}`,
    'Z'
  ].join(' ');
  
  return path;
};

export const ActivityMixDonut = () => {
  const total = activities.length;
  const segmentAngle = 360 / total; // 72 degrees per segment
  const gap = 12; // Gap between segments in degrees
  const actualSegment = segmentAngle - gap; // 60 degrees per segment
  
  const size = 200;
  const thickness = 38;
  const radius = (size / 2) - 10; // Leave some padding
  const center = size / 2;

  return (
    <div className="wellora-card h-full flex flex-col">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {activities.map((activity, index) => {
              const startAngle = index * segmentAngle + gap / 2;
              const endAngle = startAngle + actualSegment;
              const path = createArcPath(center, center, radius, startAngle, endAngle, thickness);
              
              return (
                <path
                  key={activity.name}
                  d={path}
                  fill={activity.color}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          
          {/* Icons positioned on each segment */}
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            // Position icons in the middle of each segment
            const midAngle = index * segmentAngle + segmentAngle / 2;
            const angleRad = (midAngle - 90) * (Math.PI / 180);
            const iconX = center + radius * Math.cos(angleRad);
            const iconY = center + radius * Math.sin(angleRad);
            
            return (
              <div
                key={activity.name}
                className="absolute flex items-center justify-center"
                style={{
                  left: iconX - 11,
                  top: iconY - 11,
                  width: 22,
                  height: 22,
                }}
              >
                <div 
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-sm bg-white/90"
                >
                  <Icon className="w-3 h-3 text-foreground/70" />
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
