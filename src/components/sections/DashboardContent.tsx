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
  <div className="col-span-12 flex flex-col items-center justify-center py-12 md:py-16 text-center px-4">
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
      <SearchX className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground/50" />
    </div>
    <h3 className="text-base md:text-lg font-medium text-foreground mb-2">No matches found</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Try searching for sleep, mindfulness, hydration, or activity.
    </p>
  </div>
);

const DashboardContent = ({ visibleCards, hasNoMatches, isSearching }: DashboardContentProps) => {
  // Show empty state when searching with no matches
  if (hasNoMatches) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
        <NoMatchesEmptyState />
      </div>
    );
  }

  const showCard = (cardId: CardId) => visibleCards.has(cardId);

  // Check if any cards in a group are visible
  const hasLeftColumnContent = showCard('aiInsight') || showCard('totalActivity') || showCard('weeklyRhythmChart') || showCard('chartInsight');
  const hasRightColumnContent = showCard('weeklyRhythmStrips') || showCard('recentPatterns') || showCard('monthlyGoals');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
      {/* Left Column - Main Content */}
      {hasLeftColumnContent && (
        <div className={`${hasLeftColumnContent && hasRightColumnContent ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4 md:space-y-6`}>
          {showCard('aiInsight') && <AIInsightCard />}
          {showCard('totalActivity') && <TotalActivityCard />}
          
          {/* Bottom Section - Visual Chart + Companion Card */}
          {(showCard('weeklyRhythmChart') || showCard('chartInsight')) && (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {showCard('weeklyRhythmChart') && <WeeklyRhythmChart />}
              {showCard('chartInsight') && <ChartInsightCard />}
            </div>
          )}
        </div>
      )}
      
      {/* Right Column - Rhythm & Patterns */}
      {hasRightColumnContent && (
        <div className={`${hasLeftColumnContent && hasRightColumnContent ? 'lg:col-span-4' : 'lg:col-span-12'} space-y-4`}>
          {showCard('weeklyRhythmStrips') && <WeeklyRhythmStrips />}
          {showCard('recentPatterns') && <RecentPatternsCard />}
          {showCard('monthlyGoals') && <MonthlyGoalsCard />}
        </div>
      )}
    </div>
  );
};

export default DashboardContent;