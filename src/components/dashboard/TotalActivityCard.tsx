import { TrendingUp, Footprints } from 'lucide-react';

interface StatCardProps {
  variant?: 'primary' | 'default';
  period: string;
  value: string;
  unit: string;
  change: string;
  positive?: boolean;
}

const MiniChart = ({ variant }: { variant: 'primary' | 'default' }) => {
  const color = variant === 'primary' ? 'rgba(255,255,255,0.5)' : 'hsl(var(--primary))';
  
  return (
    <svg width="80" height="40" viewBox="0 0 80 40" fill="none" className="ml-auto">
      <path
        d="M0 35 L10 30 L20 32 L30 25 L40 28 L50 20 L60 15 L70 10 L80 5"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StatCard = ({ variant = 'default', period, value, unit, change, positive = true }: StatCardProps) => {
  const isPrimary = variant === 'primary';
  
  return (
    <div className={`stat-card ${isPrimary ? 'primary' : ''} flex-1`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
          isPrimary ? 'bg-white/20' : 'bg-primary/10'
        }`}>
          <Footprints className={`w-3.5 h-3.5 ${isPrimary ? 'text-white' : 'text-primary'}`} />
        </div>
        <span className={`text-sm font-medium ${isPrimary ? 'text-white/80' : 'text-muted-foreground'}`}>
          {period}
        </span>
        <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
          isPrimary 
            ? 'bg-white/20 text-white' 
            : positive 
              ? 'bg-success-light text-success' 
              : 'bg-destructive/10 text-destructive'
        }`}>
          {change}
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-3xl font-bold ${isPrimary ? 'text-white' : 'text-foreground'}`}>
            {value}
          </p>
          <p className={`text-sm ${isPrimary ? 'text-white/70' : 'text-muted-foreground'}`}>
            {unit}
          </p>
        </div>
        <MiniChart variant={variant} />
      </div>
    </div>
  );
};

export const TotalActivityCard = () => {
  return (
    <div className="wellora-card animate-fade-in-up stagger-1">
      <div className="flex items-center gap-2 mb-5">
        <Footprints className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Total Activity</h3>
      </div>
      
      <div className="flex gap-4">
        <StatCard
          variant="primary"
          period="This Month"
          value="56"
          unit="activities"
          change="+7.0"
          positive
        />
        <StatCard
          variant="default"
          period="This Week"
          value="19"
          unit="activities"
          change="+2.8"
          positive
        />
      </div>
    </div>
  );
};
