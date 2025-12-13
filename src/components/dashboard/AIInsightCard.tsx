import { Sparkles, ArrowRight } from 'lucide-react';

export const AIInsightCard = () => {
  return (
    <div className="ai-insight-card relative overflow-hidden animate-fade-in-up">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-primary-foreground/80">AI Insight</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-primary-foreground">
            You've been very consistent this week
          </h3>
          <p className="text-primary-foreground/80 text-sm max-w-md">
            Great balance between activity and rest. Your mindfulness sessions have improved your sleep quality by 15%.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-5 py-3 bg-primary-foreground text-primary rounded-xl font-medium hover:bg-primary-foreground/90 transition-colors">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Decorative Illustration */}
      <div className="absolute right-32 top-1/2 -translate-y-1/2 opacity-20">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="2" />
          <circle cx="60" cy="60" r="10" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};
