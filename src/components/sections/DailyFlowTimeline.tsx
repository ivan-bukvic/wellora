import { Footprints, Moon, Droplets, Brain, PersonStanding, LucideProps } from 'lucide-react';
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
  hourOfDay: number; // 0-24 representing hour of day
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Walking: Footprints,
  Sleeping: Moon,
  Stretching: PersonStanding,
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

// Demo data representing today's flow with actual hours
const todayFlow: FlowActivity[] = [
  { name: 'Sleeping', time: '6:30 AM', duration: '7.5 hours', completed: true, hourOfDay: 6.5 },
  { name: 'Stretching', time: '7:00 AM', duration: '15 min', completed: true, hourOfDay: 7 },
  { name: 'Walking', time: '8:30 AM', duration: '30 min', completed: true, hourOfDay: 8.5 },
  { name: 'Hydration', time: '12:00 PM', duration: '4/8 glasses', completed: false, hourOfDay: 12 },
  { name: 'Mindfulness', time: '3:30 PM', duration: '10 min', completed: true, hourOfDay: 15.5 },
];

// Time scale configuration
const timeScale = {
  start: 6, // 6 AM
  end: 21, // 9 PM
  labels: [
    { hour: 6, label: '6 AM' },
    { hour: 9, label: '9 AM' },
    { hour: 12, label: '12 PM' },
    { hour: 15, label: '3 PM' },
    { hour: 18, label: '6 PM' },
    { hour: 21, label: '9 PM' },
  ],
};

const getPositionPercent = (hour: number) => {
  const range = timeScale.end - timeScale.start;
  return ((hour - timeScale.start) / range) * 100;
};

const DailyFlowTimeline = () => {
  const timelineY = 40; // Fixed Y position for the timeline (percentage)
  
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
      <div className="flex-1 flex flex-col px-6 pb-4">
        {/* Main timeline area */}
        <div className="relative flex-1" style={{ minHeight: '140px' }}>
          {/* Flow Line SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Gradient definition for the flow line */}
            <defs>
              <linearGradient id="flowLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
                <stop offset="15%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                <stop offset="85%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            
            {/* Main flow line - gentle wave */}
            <path
              d="M 0 40 
                 Q 60 36, 120 42 
                 Q 180 48, 240 38 
                 Q 300 32, 360 42 
                 Q 380 46, 400 40"
              stroke="url(#flowLineGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          
          {/* Vertical guide lines (dotted) */}
          {todayFlow.map((activity) => {
            const xPercent = getPositionPercent(activity.hourOfDay);
            return (
              <div
                key={`guide-${activity.name}`}
                className="absolute"
                style={{
                  left: `${xPercent}%`,
                  top: `${timelineY + 8}%`,
                  height: `${100 - timelineY - 8}%`,
                  width: '1px',
                  backgroundImage: 'linear-gradient(to bottom, hsl(var(--muted-foreground) / 0.15) 2px, transparent 2px)',
                  backgroundSize: '1px 6px',
                  transform: 'translateX(-50%)',
                }}
              />
            );
          })}
          
          {/* Activity Markers */}
          <TooltipProvider delayDuration={100}>
            {todayFlow.map((activity) => {
              const Icon = iconMap[activity.name];
              const activityColor = activityColorMap[activity.name];
              const xPercent = getPositionPercent(activity.hourOfDay);
              
              return (
                <div
                  key={activity.name}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${xPercent}%`,
                    top: `${timelineY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center
                          transition-all duration-200 hover:scale-110 hover:shadow-md
                          bg-card border-2 ${activity.completed ? '' : 'opacity-60'}
                          shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30`}
                        style={{
                          borderColor: activityColor,
                        }}
                      >
                        <Icon className="w-4 h-4 text-primary" />
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
                  
                  {/* Small time label below icon */}
                  <span className="mt-1.5 text-[9px] text-muted-foreground/60 font-medium whitespace-nowrap">
                    {activity.time.replace(' AM', '').replace(' PM', '')}
                  </span>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
        
        {/* Time axis labels */}
        <div className="relative h-5 mt-1">
          {timeScale.labels.map(({ hour, label }) => {
            const xPercent = getPositionPercent(hour);
            return (
              <span
                key={hour}
                className="absolute text-[10px] text-muted-foreground/40 font-medium transform -translate-x-1/2"
                style={{ left: `${xPercent}%` }}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyFlowTimeline;
