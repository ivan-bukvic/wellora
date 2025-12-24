import { Moon, Droplets, Brain } from 'lucide-react';

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

export const RecentPatternsCard = () => {
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
