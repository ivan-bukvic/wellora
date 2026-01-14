import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useUserHasData } from '@/hooks/useUserHasData';
import { WeeklySummarySheet } from './WeeklySummarySheet';

const EmptyState = () => (
  <div className="ai-insight-card relative overflow-hidden animate-fade-in-up opacity-80">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
    </div>
    
    <div className="relative flex items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white/60" />
          </div>
          <span className="text-sm font-medium text-white/60">Weekly Reflection</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-white/80">
          Reflections will appear once there's something to reflect on.
        </h3>
        <p className="text-white/60 text-sm max-w-md">
          As you log activities, gentle insights will emerge here.
        </p>
      </div>
    </div>
  </div>
);

export const AIInsightCard = () => {
  const { data, isLoading } = useAIInsights();
  const { hasData, isLoading: dataLoading } = useUserHasData();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Show empty state for new users with no data
  if (!dataLoading && !hasData) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="ai-insight-card relative overflow-hidden animate-fade-in-up">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white/80">Weekly Reflection</span>
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-white">
              {isLoading ? 'Gathering your week...' : data.heroInsight}
            </h3>
            <p className="text-white/80 text-sm max-w-md">
              Gentle reflections based on your recent activity.
            </p>
          </div>
          
          <button 
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white text-[#7FC8F8] rounded-xl font-medium hover:bg-white/90 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Decorative Illustration */}
        <div className="absolute right-32 top-1/2 -translate-y-1/2 opacity-20">
          
        </div>
      </div>
      
      <WeeklySummarySheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        data={data} 
      />
    </>
  );
};
