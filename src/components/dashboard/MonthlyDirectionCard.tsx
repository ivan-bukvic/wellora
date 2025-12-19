import { Compass } from 'lucide-react';

const data = [
  { week: 1, value: 4 },
  { week: 2, value: 5 },
  { week: 3, value: 4.5 },
  { week: 4, value: 6 },
];

export const MonthlyDirectionCard = () => {
  const width = 280;
  const height = 80;
  const padding = 16;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = 8;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = height - padding - (d.value / maxValue) * chartHeight;
    return { x, y, ...d };
  });
  
  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
  
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;
  
  return (
    <div className="wellora-card animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-base font-medium text-foreground">Monthly Direction</h3>
      </div>
      
      <div className="relative mb-2">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="directionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path d={areaD} fill="url(#directionGradient)" />
          
          <path
            d={pathD}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>
      
      <p className="text-xs text-muted-foreground/70 italic">
        A gentle overview of recent patterns.
      </p>
    </div>
  );
};
