import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { TotalActivityCard } from '@/components/dashboard/TotalActivityCard';
import { WeeklyRhythmChart } from '@/components/dashboard/WeeklyRhythmChart';
import { ChartInsightCard } from '@/components/dashboard/ChartInsightCard';
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
        
        {/* Your Week at a Glance */}
        <TotalActivityCard />
        
        {/* Bottom Section - Visual Chart + Companion Card */}
        <div className="flex gap-6">
          <WeeklyRhythmChart />
          <ChartInsightCard />
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
