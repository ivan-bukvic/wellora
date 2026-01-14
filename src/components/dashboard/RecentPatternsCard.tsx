import { Moon, Droplets, Brain, Eye } from 'lucide-react';
import { useUserHasData } from '@/hooks/useUserHasData';

const patterns = [
  {
    icon: Moon,
    text: 'Sleep has been more consistent.',
    bgColor: 'bg-activity-sleep',
  },
  {
    icon: Droplets,
    text: 'Hydration improved slightly.',
    bgColor: 'bg-activity-hydration',
  },
  {
    icon: Brain,
    text: 'Mindfulness stayed light but regular.',
    bgColor: 'bg-activity-mindfulness',
  },
];

const EmptyState = () => (
  <div className="wellora-card animate-fade-in-up stagger-1">
    <h3 className="text-base font-medium text-foreground mb-4">Recent patterns</h3>
    
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center mb-3">
        <Eye className="w-5 h-5 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-[200px]">
        Patterns emerge as you log activity over time.
      </p>
    </div>
  </div>
);

export const RecentPatternsCard = () => {
  const { hasData, isLoading } = useUserHasData();

  // Show empty state for new users
  if (!isLoading && !hasData) {
    return <EmptyState />;
  }

  return (
    <div className="wellora-card animate-fade-in-up stagger-1">
      <h3 className="text-base font-medium text-foreground mb-4">Recent patterns</h3>
      
      <div className="space-y-3">
        {patterns.map((pattern, index) => {
          const Icon = pattern.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${pattern.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">{pattern.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
