import { Circle, Footprints, Brain, Sparkles } from 'lucide-react';

const activities = [
  { name: 'Walking', color: 'hsl(var(--primary))', percent: 45, icon: Footprints },
  { name: 'Mindfulness', color: 'hsl(var(--chart-secondary))', percent: 28, icon: Brain },
  { name: 'Stretching', color: 'hsl(var(--chart-tertiary))', percent: 27, icon: Sparkles },
];

export const ActivityFrequencyChart = () => {
  const totalPercent = 73;
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (totalPercent / 100) * circumference;
  
  return (
    <div className="wellora-card animate-fade-in-up stagger-3">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-accent rounded-full"></div>
        <h3 className="text-lg font-semibold text-foreground">Activity Frequency</h3>
      </div>
      
      <div className="flex items-center justify-center">
        {/* Donut Chart */}
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="20"
            />
            
            {/* Progress segments */}
            {activities.reduce((acc, activity, index) => {
              const prevOffset = acc.offset;
              const segmentLength = (activity.percent / 100) * circumference;
              
              acc.elements.push(
                <circle
                  key={activity.name}
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke={activity.color}
                  strokeWidth="20"
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={-prevOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />
              );
              
              acc.offset += segmentLength;
              return acc;
            }, { elements: [] as JSX.Element[], offset: 0 }).elements}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-primary">{totalPercent}%</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: activity.color }}
              />
              <span className="text-sm text-muted-foreground">{activity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
