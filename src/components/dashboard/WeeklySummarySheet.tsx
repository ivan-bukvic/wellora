import { Sparkles, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { AIInsightData } from '@/hooks/useAIInsights';

interface WeeklySummarySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AIInsightData;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case 'improving':
      return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    case 'inconsistent':
      return <TrendingDown className="w-4 h-4 text-amber-500" />;
    case 'steady':
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const statusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'improving':
      return 'Improving';
    case 'inconsistent':
      return 'Inconsistent';
    case 'steady':
    default:
      return 'Steady';
  }
};

export const WeeklySummarySheet = ({ open, onOpenChange, data }: WeeklySummarySheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg">Your week in review</SheetTitle>
              <SheetDescription className="text-sm">
                A calm look at your recent patterns
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Weekly Summary */}
          {data.weeklySummary.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Summary
              </h4>
              <ul className="space-y-2.5">
                {data.weeklySummary.slice(0, 4).map((line, index) => (
                  <li 
                    key={index} 
                    className="text-sm text-foreground leading-relaxed pl-4 border-l-2 border-primary/30"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Indicators */}
          {data.indicators.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Activity Patterns
              </h4>
              <div className="space-y-2">
                {data.indicators.slice(0, 3).map((indicator, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm font-medium capitalize">
                      {indicator.activity}
                    </span>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={indicator.status} />
                      <span className="text-xs text-muted-foreground">
                        {statusLabel(indicator.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Micro insights */}
          {data.microCopyCandidates.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Small Observations
              </h4>
              <div className="space-y-2">
                {data.microCopyCandidates.slice(0, 2).map((copy, index) => (
                  <p 
                    key={index}
                    className="text-sm text-muted-foreground italic"
                  >
                    "{copy}"
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {data.weeklySummary.length === 0 && data.indicators.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                Keep tracking your activities to see insights here.
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
