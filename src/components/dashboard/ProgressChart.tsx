import { TrendingUp } from 'lucide-react';

const data = [
  { month: 'Jan', value: 4 },
  { month: 'Feb', value: 6 },
  { month: 'Mar', value: 5 },
  { month: 'Apr', value: 8 },
  { month: 'May', value: 7 },
  { month: 'Jun', value: 10 },
  { month: 'Jul', value: 9 },
];

const maxValue = 12;

export const ProgressChart = () => {
  const width = 320;
  const height = 160;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = height - padding - (d.value / maxValue) * chartHeight;
    return { x, y, ...d };
  });
  
  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    
    // Smooth curve
    const prev = points[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
  
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;
  
  // Find the highest point for the badge
  const highestPoint = points.reduce((max, p) => p.value > max.value ? p : max, points[0]);
  
  return (
    <div className="wellora-card animate-fade-in-up stagger-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Wellness Progress</h3>
        <TrendingUp className="w-5 h-5 text-success" />
      </div>
      
      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10, 12].map((val) => {
            const y = height - padding - (val / maxValue) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-muted-foreground"
                >
                  {val}
                </text>
              </g>
            );
          })}
          
          {/* Area fill */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#areaGradient)" />
          
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Second line (lighter) */}
          <path
            d={points.map((p, i) => {
              const offset = Math.sin(i * 0.8) * 15;
              const y = Math.min(height - padding, Math.max(padding, p.y + offset));
              if (i === 0) return `M ${p.x} ${y}`;
              const prev = points[i - 1];
              const prevY = Math.min(height - padding, Math.max(padding, prev.y + Math.sin((i-1) * 0.8) * 15));
              const cpX = (prev.x + p.x) / 2;
              return `C ${cpX} ${prevY}, ${cpX} ${y}, ${p.x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="hsl(var(--chart-tertiary))"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="hsl(var(--card))"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          ))}
          
          {/* Highlight badge */}
          <g transform={`translate(${highestPoint.x - 20}, ${highestPoint.y - 35})`}>
            <rect
              x="0"
              y="0"
              width="40"
              height="24"
              rx="12"
              fill="hsl(var(--primary))"
            />
            <text
              x="20"
              y="16"
              textAnchor="middle"
              className="text-xs fill-primary-foreground font-medium"
            >
              78%
            </text>
          </g>
          
          {/* X-axis labels */}
          {points.map((point) => (
            <text
              key={point.month}
              x={point.x}
              y={height - 4}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {point.month}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
