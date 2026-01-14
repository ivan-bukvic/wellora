import { useDemoMode } from '@/hooks/useDemoMode';
import { useUserHasData } from '@/hooks/useUserHasData';

// Gentle wave data representing daily rhythm
const weekData = [
  { day: 'Mon', flow: 0.7, rest: 0.5 },
  { day: 'Tue', flow: 0.85, rest: 0.6 },
  { day: 'Wed', flow: 0.6, rest: 0.7 },
  { day: 'Thu', flow: 0.9, rest: 0.55 },
  { day: 'Fri', flow: 0.75, rest: 0.65 },
  { day: 'Sat', flow: 0.5, rest: 0.85 },
  { day: 'Sun', flow: 0.45, rest: 0.9 },
];

const EmptyState = () => {
  const chartWidth = 320;
  const chartHeight = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 20 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  return (
    <div className="wellora-card flex-1 animate-fade-in-up stagger-3">
      <h3 className="text-lg font-semibold text-foreground mb-1">Activity vs Rest Balance</h3>
      <p className="text-xs text-muted-foreground mb-5">A relative snapshot, not a performance score.</p>
      
      <div className="flex justify-center relative">
        <svg 
          width={chartWidth} 
          height={chartHeight} 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Subtle horizontal guide lines */}
          {[0.25, 0.5, 0.75].map((level) => (
            <line
              key={level}
              x1={padding.left}
              y1={padding.top + innerHeight * (1 - level)}
              x2={padding.left + innerWidth}
              y2={padding.top + innerHeight * (1 - level)}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.3"
            />
          ))}
          
          {/* Empty placeholder line */}
          <line
            x1={padding.left}
            y1={padding.top + innerHeight * 0.5}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight * 0.5}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.2"
          />
          
          {/* Day labels */}
          {weekData.map((d, i) => (
            <text
              key={d.day}
              x={padding.left + (i / (weekData.length - 1)) * innerWidth}
              y={chartHeight - 8}
              textAnchor="middle"
              className="text-[10px] fill-muted-foreground/50"
            >
              {d.day}
            </text>
          ))}
        </svg>
        
        {/* Overlay message */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground/70 text-center bg-card/80 px-4 py-2 rounded-lg">
            Your rhythm takes shape gradually.
          </p>
        </div>
      </div>
      
      {/* Subtle legend - muted */}
      <div className="flex justify-center gap-6 mt-4 opacity-40">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary opacity-70" />
          <span className="text-xs text-muted-foreground">Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warm" />
          <span className="text-xs text-muted-foreground">Rest</span>
        </div>
      </div>
    </div>
  );
};

export const WeeklyRhythmChart = () => {
  const { isDemoUser } = useDemoMode();
  const { hasData, isLoading } = useUserHasData();
  
  // Show empty state for new users
  if (!isLoading && !hasData) {
    return <EmptyState />;
  }
  
  const chartWidth = 320;
  const chartHeight = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 20 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  
  // Generate smooth curve path
  const generateSmoothPath = (data: typeof weekData, key: 'flow' | 'rest') => {
    const points = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * innerWidth,
      y: padding.top + innerHeight - d[key] * innerHeight,
    }));
    
    // Create smooth bezier curve
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const cpX = (current.x + next.x) / 2;
      
      path += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    
    return path;
  };
  
  // Generate area path (closed shape)
  const generateAreaPath = (data: typeof weekData, key: 'flow' | 'rest') => {
    const linePath = generateSmoothPath(data, key);
    const lastX = padding.left + innerWidth;
    const firstX = padding.left;
    const bottomY = padding.top + innerHeight;
    
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const flowPath = generateSmoothPath(weekData, 'flow');
  const restPath = generateSmoothPath(weekData, 'rest');
  const flowAreaPath = generateAreaPath(weekData, 'flow');
  const restAreaPath = generateAreaPath(weekData, 'rest');

  return (
    <div className="wellora-card flex-1 animate-fade-in-up stagger-3">
      <h3 className="text-lg font-semibold text-foreground mb-1">Activity vs Rest Balance</h3>
      <p className="text-xs text-muted-foreground mb-5">A relative snapshot, not a performance score.</p>
      
      <div className="flex justify-center">
        <svg 
          width={chartWidth} 
          height={chartHeight} 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Subtle horizontal guide lines */}
          {[0.25, 0.5, 0.75].map((level) => (
            <line
              key={level}
              x1={padding.left}
              y1={padding.top + innerHeight * (1 - level)}
              x2={padding.left + innerWidth}
              y2={padding.top + innerHeight * (1 - level)}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
            />
          ))}
          
          {/* Rest area fill - warm accent */}
          <path
            d={restAreaPath}
            fill="hsl(var(--warm))"
            opacity="0.25"
          />
          
          {/* Flow area fill - primary muted */}
          <path
            d={flowAreaPath}
            fill="hsl(var(--primary))"
            opacity="0.2"
          />
          
          {/* Rest curve - warm accent */}
          <path
            d={restPath}
            fill="none"
            stroke="hsl(var(--warm-muted))"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-700"
          />
          
          {/* Flow curve - primary soft */}
          <path
            d={flowPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-700"
          />
          
          {/* Subtle dots on flow line */}
          {weekData.map((d, i) => (
            <circle
              key={d.day}
              cx={padding.left + (i / (weekData.length - 1)) * innerWidth}
              cy={padding.top + innerHeight - d.flow * innerHeight}
              r="4"
              fill="hsl(var(--card))"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          ))}
          
          {/* Day labels */}
          {weekData.map((d, i) => (
            <text
              key={d.day}
              x={padding.left + (i / (weekData.length - 1)) * innerWidth}
              y={chartHeight - 8}
              textAnchor="middle"
              className="text-[10px] fill-muted-foreground"
            >
              {d.day}
            </text>
          ))}
        </svg>
      </div>
      
      {/* Subtle legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary opacity-70" />
          <span className="text-xs text-muted-foreground">Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warm" />
          <span className="text-xs text-muted-foreground">Rest</span>
        </div>
      </div>
    </div>
  );
};
