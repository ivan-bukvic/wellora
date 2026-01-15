import { SearchX } from 'lucide-react';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { TotalActivityCard } from '@/components/dashboard/TotalActivityCard';
import { WeeklyRhythmChart } from '@/components/dashboard/WeeklyRhythmChart';
import { ChartInsightCard } from '@/components/dashboard/ChartInsightCard';
import { WeeklyRhythmStrips } from '@/components/dashboard/WeeklyRhythmStrips';
import { RecentPatternsCard } from '@/components/dashboard/RecentPatternsCard';
import { MonthlyGoalsCard } from '@/components/dashboard/MonthlyGoalsCard';
import { CardId } from '@/hooks/useDashboardSearch';

interface DashboardContentProps {
  visibleCards: Set<CardId>;
  hasNoMatches: boolean;
  isSearching: boolean;
}

const NoMatchesEmptyState = () => (
  <div className="col-span-12 flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
      <SearchX className="w-7 h-7 text-muted-foreground/50" />
    </div>
    <h3 className="text-lg font-medium text-foreground mb-2">No matches found</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Try searching for sleep, mindfulness, hydration, or activity.
    </p>
  </div>
);

const DashboardContent = ({ visibleCards, hasNoMatches, isSearching }: DashboardContentProps) => {
  // Show empty state when searching with no matches
  if (hasNoMatches) {
    return (
      <div className="grid grid-cols-12 gap-6 items-start">
        <NoMatchesEmptyState />
      </div>
    );
  }

  const showCard = (cardId: CardId) => visibleCards.has(cardId);

  // Check if any cards in a group are visible
  const hasLeftColumnContent = showCard('aiInsight') || showCard('totalActivity') || showCard('weeklyRhythmChart') || showCard('chartInsight');
  const hasRightColumnContent = showCard('weeklyRhythmStrips') || showCard('recentPatterns') || showCard('monthlyGoals');

  // Adjust layout when only one column has content
  const leftColSpan = hasLeftColumnContent && hasRightColumnContent ? 'col-span-8' : hasLeftColumnContent ? 'col-span-12' : 'hidden';
  const rightColSpan = hasLeftColumnContent && hasRightColumnContent ? 'col-span-4' : hasRightColumnContent ? 'col-span-12' : 'hidden';

  return (
    <div className="grid grid-cols-12 gap-6 items-start">
      {/* Left Column - Main Content */}
      {hasLeftColumnContent && (
        <div className={`${leftColSpan} space-y-6`}>
          {showCard('aiInsight') && <AIInsightCard />}
          {showCard('totalActivity') && <TotalActivityCard />}
          
          {/* Bottom Section - Visual Chart + Companion Card */}
          {(showCard('weeklyRhythmChart') || showCard('chartInsight')) && (
            <div className="flex gap-6">
              {showCard('weeklyRhythmChart') && <WeeklyRhythmChart />}
              {showCard('chartInsight') && <ChartInsightCard />}
            </div>
          )}
        </div>
      )}
      
      {/* Right Column - Rhythm & Patterns */}
      {hasRightColumnContent && (
        <div className={`${rightColSpan} space-y-4`}>
          {showCard('weeklyRhythmStrips') && <WeeklyRhythmStrips />}
          {showCard('recentPatterns') && <RecentPatternsCard />}
          {showCard('monthlyGoals') && <MonthlyGoalsCard />}
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
