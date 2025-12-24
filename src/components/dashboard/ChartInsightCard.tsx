import { Sparkles } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';

export const ChartInsightCard = () => {
  const { currentMicroCopy } = useAIInsights();

  return (
    <div className="wellora-card flex-1 animate-fade-in-up stagger-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-warm" />
        <h4 className="text-sm font-medium text-muted-foreground">What we noticed</h4>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-3">
        <p className="text-base text-foreground leading-relaxed">
          Activity and rest felt balanced this week.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          Consistency was stronger earlier in the week.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Designed to support reflection, not optimization.
        </p>
      </div>
      
      {/* Optional AI micro-copy */}
      {currentMicroCopy && (
        <p className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground/70 italic">
          {currentMicroCopy}
        </p>
      )}
    </div>
  );
};
