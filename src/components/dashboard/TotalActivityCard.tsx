import { Sparkles, Footprints, Moon, Brain } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useUserHasData } from '@/hooks/useUserHasData';

// Soft circular progress indicator (no numbers)
const SoftProgressRing = ({ progress }: { progress: number }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        {/* Background ring */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="4"
        />
        {/* Progress ring */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary) / 0.6)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary/40" />
      </div>
    </div>
  );
};

// Activity icons row for balance visualization
const BalanceIcons = ({ active = true }: { active?: boolean }) => {
  const activities = [
    { icon: Footprints, label: 'Movement' },
    { icon: Moon, label: 'Rest' },
    { icon: Brain, label: 'Mindfulness' },
  ];

  return (
    <div className="flex items-center gap-3">
      {activities.map(({ icon: Icon, label }) => (
        <div 
          key={label}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${
            active ? 'bg-primary/10' : 'bg-muted'
          }`}
        >
          <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-muted-foreground/50'}`} />
          <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-muted-foreground/50'}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

// Empty state for consistency card
const ConsistencyEmptyState = () => (
  <div className="flex-1 p-5 rounded-2xl bg-muted/40 border border-border">
    <div className="flex items-start gap-4">
      <SoftProgressRing progress={0} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Weekly Consistency</h4>
        <p className="text-sm text-muted-foreground/70 leading-snug">
          Your consistency patterns will appear here over time.
        </p>
      </div>
    </div>
  </div>
);

// Empty state for balance card
const BalanceEmptyState = () => (
  <div className="flex-1 p-5 rounded-2xl bg-muted/40 border border-border">
    <h4 className="text-sm font-medium text-muted-foreground mb-3">Routine Balance</h4>
    <p className="text-sm text-muted-foreground/70 leading-snug mb-4">
      Your routine balance takes shape as you log activities.
    </p>
    <BalanceIcons active={false} />
  </div>
);

// Consistency card
const ConsistencyCard = () => {
  const { isDemoUser } = useDemoMode();
  // For demo, show ~75% consistency. Real users would calculate from actual data.
  const consistencyLevel = isDemoUser ? 75 : 65;

  return (
    <div className="flex-1 p-5 rounded-2xl bg-muted/40 border border-border">
      <div className="flex items-start gap-4">
        <SoftProgressRing progress={consistencyLevel} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Weekly Consistency</h4>
          <p className="text-base font-medium text-foreground leading-snug">
            You stayed consistent on most days this week
          </p>
        </div>
      </div>
    </div>
  );
};

// Balance card
const BalanceCard = () => {
  return (
    <div className="flex-1 p-5 rounded-2xl bg-muted/40 border border-border">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Routine Balance</h4>
      <p className="text-base font-medium text-foreground leading-snug mb-4">
        Good balance between movement, rest, and mindfulness
      </p>
      <BalanceIcons active={true} />
    </div>
  );
};

export const TotalActivityCard = () => {
  const { currentMicroCopy } = useAIInsights();
  const { hasData, isLoading } = useUserHasData();

  // Show empty state for new users
  const showEmptyState = !isLoading && !hasData;

  return (
    <div className="wellora-card animate-fade-in-up stagger-1">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Your Week at a Glance</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {showEmptyState ? (
          <>
            <ConsistencyEmptyState />
            <BalanceEmptyState />
          </>
        ) : (
          <>
            <ConsistencyCard />
            <BalanceCard />
          </>
        )}
      </div>

      {/* Optional AI micro-copy - only show when user has data */}
      {!showEmptyState && currentMicroCopy && (
        <p className="mt-4 text-xs text-muted-foreground/70 italic pl-2 border-l border-border">
          {currentMicroCopy}
        </p>
      )}
    </div>
  );
};
