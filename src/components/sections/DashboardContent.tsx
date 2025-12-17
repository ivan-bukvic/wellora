import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { TotalActivityCard } from '@/components/dashboard/TotalActivityCard';
import { ActivityDurationChart } from '@/components/dashboard/ActivityDurationChart';
import { ActivityFrequencyChart } from '@/components/dashboard/ActivityFrequencyChart';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { AchievementsCard } from '@/components/dashboard/AchievementsCard';
import { MonthlyGoalsCard } from '@/components/dashboard/MonthlyGoalsCard';

const DashboardContent = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column - Main Content */}
      <div className="col-span-8 space-y-6">
        {/* AI Insight Card */}
        <AIInsightCard />
        
        {/* Total Activity Stats */}
        <TotalActivityCard />
        
        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          <ActivityDurationChart />
          <ActivityFrequencyChart />
        </div>
      </div>
      
      {/* Right Column - Progress & Achievements */}
      <div className="col-span-4 space-y-6">
        <ProgressChart />
        <AchievementsCard />
        <MonthlyGoalsCard />
      </div>
    </div>
  );
};

export default DashboardContent;
