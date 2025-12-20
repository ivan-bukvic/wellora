import { Footprints, Moon, Droplets, Brain, LucideProps } from 'lucide-react';
import YogaMoonIcon from '@/components/icons/YogaMoonIcon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FlowActivity {
  name: string;
  time: string;
  duration: string;
  completed: boolean;
  position: number; // 0-100 representing position on timeline
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Walking: Footprints,
  Sleeping: Moon,
  Stretching: YogaMoonIcon,
  Hydration: Droplets,
  Mindfulness: Brain,
};

const activityColorMap: Record<string, string> = {
  Walking: 'hsl(var(--activity-walking))',
  Sleeping: 'hsl(var(--activity-sleep))',
  Stretching: 'hsl(var(--activity-stretching))',
  Hydration: 'hsl(var(--activity-hydration))',
  Mindfulness: 'hsl(var(--activity-mindfulness))',
};

const activityBgMap: Record<string, string> = {
  Walking: 'bg-activity-walking',
  Sleeping: 'bg-activity-sleep',
  Stretching: 'bg-activity-stretching',
  Hydration: 'bg-activity-hydration',
  Mindfulness: 'bg-activity-mindfulness',
};

// Demo data representing today's flow
const todayFlow: FlowActivity[] = [
  { name: 'Sleeping', time: '6:30 AM', duration: '7.5 hours', completed: true, position: 8 },
  { name: 'Stretching', time: '7:00 AM', duration: '15 min', completed: true, position: 20 },
  { name: 'Walking', time: '8:30 AM', duration: '30 min', completed: true, position: 35 },
  { name: 'Hydration', time: '12:00 PM', duration: '4/8 glasses', completed: false, position: 55 },
  { name: 'Mindfulness', time: '3:30 PM', duration: '10 min', completed: true, position: 75 },
];

const DailyFlowTimeline = () => {
  return (
    <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden flex flex-col" style={{ background: 'linear-gradient(to bottom right, hsl(var(--primary) / 0.03), hsl(var(--background)), hsl(var(--primary) / 0.02))' }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-base font-semibold text-foreground">Today's Flow</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          A gentle timeline of how your day unfolded
        </p>
      </div>
      
      {/* Timeline Container */}
      <div className="flex-1 flex items-center px-6 pb-6">
        <div className="relative w-full h-24">
          {/* Flow Line SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 80"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Gradient definition for the flow line - soft, calming brand blue */}
            <defs>
              <linearGradient id="flowLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
                <stop offset="10%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.32" />
                <stop offset="90%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            
            {/* Main flow line - gentle organic curve */}
            <path
              d="M 0 40 
                 Q 50 35, 100 42 
                 Q 150 50, 200 38 
                 Q 250 28, 300 42 
                 Q 350 52, 400 40"
              stroke="url(#flowLineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          
          {/* Activity Markers */}
          <TooltipProvider delayDuration={100}>
            {todayFlow.map((activity) => {
              const Icon = iconMap[activity.name];
              const bgClass = activityBgMap[activity.name];
              
              // Calculate Y position based on the curve path
              // Approximate the curve: y = 40 + sin-like wave
              const x = activity.position;
              const normalizedX = (x / 100) * 400;
              // Simple approximation of the curve's Y at this X position
              let yOffset = 0;
              if (normalizedX <= 100) {
                yOffset = 40 + ((normalizedX - 50) / 50) * -5;
              } else if (normalizedX <= 200) {
                yOffset = 35 + ((normalizedX - 100) / 100) * 7;
              } else if (normalizedX <= 300) {
                yOffset = 42 + ((normalizedX - 200) / 100) * -14;
              } else {
                yOffset = 28 + ((normalizedX - 300) / 100) * 14;
              }
              
              // Convert to percentage for positioning
              const yPercent = (yOffset / 80) * 100;
              
              return (
                <Tooltip key={activity.name}>
                  <TooltipTrigger asChild>
                    <button
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 
                        w-8 h-8 rounded-full flex items-center justify-center
                        transition-all duration-200 hover:scale-110 hover:shadow-md
                        ${bgClass} ${activity.completed ? 'opacity-90' : 'opacity-60'}
                        shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      style={{
                        left: `${activity.position}%`,
                        top: `${yPercent}%`,
                      }}
                    >
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="bg-card border-border/50 shadow-soft px-3 py-2"
                    sideOffset={8}
                  >
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{activity.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      <p className="text-xs text-primary font-medium mt-0.5">{activity.duration}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
      
      {/* Subtle time indicators */}
      <div className="absolute bottom-3 left-6 right-6 flex justify-between pointer-events-none">
        <span className="text-[10px] text-muted-foreground/50">Morning</span>
        <span className="text-[10px] text-muted-foreground/50">Afternoon</span>
        <span className="text-[10px] text-muted-foreground/50">Evening</span>
      </div>
    </div>
  );
};

export default DailyFlowTimeline;
