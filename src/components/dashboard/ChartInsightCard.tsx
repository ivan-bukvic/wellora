import { Sparkles } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useUserHasData } from '@/hooks/useUserHasData';

const EmptyState = () => (
  <div className="wellora-card flex-1 animate-fade-in-up stagger-4 flex flex-col">
    <div className="flex items-center gap-2 mb-4">
      <Sparkles className="w-4 h-4 text-muted-foreground/50" />
      <h4 className="text-sm font-medium text-muted-foreground">What we noticed</h4>
    </div>
    
    <div className="flex-1 flex flex-col justify-center">
      <p className="text-sm text-muted-foreground/70 leading-relaxed">
        Insights emerge as you log activity and rest.
      </p>
    </div>
    
    {/* Footer: design philosophy */}
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Designed to support reflection, not optimization.
      </p>
    </div>
  </div>
);

export const ChartInsightCard = () => {
  const { data, currentMicroCopy } = useAIInsights();
  const { hasData, isLoading } = useUserHasData();

  // Show empty state for new users
  if (!isLoading && !hasData) {
    return <EmptyState />;
  }

  return (
    <div className="wellora-card flex-1 animate-fade-in-up stagger-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-warm" />
        <h4 className="text-sm font-medium text-muted-foreground">What we noticed</h4>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-3">
        {data.weeklySummary.slice(0, 2).map((insight, index) => (
          <p key={index} className="text-base text-foreground leading-relaxed">
            {insight}
          </p>
        ))}
        {currentMicroCopy && (
          <p className="text-base text-foreground leading-relaxed">
            {currentMicroCopy}
          </p>
        )}
      </div>
      
      {/* Footer: design philosophy */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Designed to support reflection, not optimization.
        </p>
      </div>
    </div>
  );
};
