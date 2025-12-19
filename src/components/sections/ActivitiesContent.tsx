import { Footprints, Moon, Droplets, Brain, PersonStanding, Plus, Check, Clock } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { generateDemoActivityLogs, demoTodayRoutine } from '@/data/demoData';
import { ActivityMixDonut } from '@/components/dashboard/ActivityMixDonut';

// Activity definitions with consistent colors - Order: Walking, Sleeping, Stretching, Hydration, Mindfulness
const activities = [
  { 
    icon: Footprints, 
    name: 'Walking', 
    description: 'Track your daily steps', 
    colorClass: 'bg-activity-walking',
    iconColorClass: 'text-foreground/80'
  },
  { 
    icon: Moon, 
    name: 'Sleeping', 
    description: 'Monitor your sleep quality', 
    colorClass: 'bg-activity-sleep',
    iconColorClass: 'text-foreground/80'
  },
  { 
    icon: PersonStanding, 
    name: 'Stretching', 
    description: 'Keep your body flexible', 
    colorClass: 'bg-activity-stretching',
    iconColorClass: 'text-white'
  },
  { 
    icon: Droplets, 
    name: 'Hydration', 
    description: 'Stay hydrated throughout the day', 
    colorClass: 'bg-activity-hydration',
    iconColorClass: 'text-foreground/80'
  },
  { 
    icon: Brain, 
    name: 'Mindfulness', 
    description: 'Practice mental wellness', 
    colorClass: 'bg-activity-mindfulness',
    iconColorClass: 'text-foreground/80',
    fullWidth: true
  },
];

const iconMap: Record<string, typeof Footprints> = {
  Walking: Footprints,
  Sleeping: Moon,
  Stretching: PersonStanding,
  Hydration: Droplets,
  Mindfulness: Brain,
};

const colorMap: Record<string, { bg: string; iconColor: string }> = {
  Walking: { bg: 'bg-activity-walking', iconColor: 'text-foreground/80' },
  Sleeping: { bg: 'bg-activity-sleep', iconColor: 'text-foreground/80' },
  Stretching: { bg: 'bg-activity-stretching', iconColor: 'text-white' },
  Hydration: { bg: 'bg-activity-hydration', iconColor: 'text-foreground/80' },
  Mindfulness: { bg: 'bg-activity-mindfulness', iconColor: 'text-foreground/80' },
};

const ActivitiesContent = () => {
  const { isDemoUser } = useDemoMode();
  const activityLogs = isDemoUser ? generateDemoActivityLogs() : [];
  const todayRoutine = isDemoUser ? demoTodayRoutine : [];

  return (
    <div className="animate-fade-in-up">
      <p className="text-muted-foreground mb-6">Track and log your daily wellness activities</p>
      
      {/* TOP SECTION: 50/50 Split Layout */}
      {isDemoUser && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* LEFT: Today's Routine */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Today's Routine</h2>
            <div className="space-y-3">
              {todayRoutine.map((item) => {
                const Icon = iconMap[item.name];
                const colors = colorMap[item.name];
                
                return (
                  <div 
                    key={item.name} 
                    className={`rounded-[20px] p-4 transition-all border ${
                      item.completed 
                        ? 'bg-success-light/30 border-success/15' 
                        : 'bg-warm-light/20 border-warm/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.duration || item.progress}
                        </p>
                      </div>
                      {item.completed ? (
                        <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-success" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-warm/50 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Activity Mix Chart */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Activity Mix</h2>
            <ActivityMixDonut />
          </div>
        </div>
      )}

      {/* AVAILABLE ACTIVITIES - 2-column grid, Mindfulness spans both */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Available Activities</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const isFullWidth = activity.fullWidth;
          
          return (
            <div 
              key={activity.name} 
              className={`wellora-card p-5 hover:shadow-soft-lg cursor-pointer transition-all ${
                isFullWidth ? 'col-span-2' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${activity.colorClass} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${activity.iconColorClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground mb-1">{activity.name}</h3>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline flex-shrink-0 mt-1">
                  <Plus className="w-4 h-4" />
                  Log Activity
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT ACTIVITY LOG - Subdued */}
      {isDemoUser && activityLogs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-medium text-muted-foreground mb-3">Recent Activity Log</h2>
          <div className="rounded-2xl bg-muted/20 border border-border/20 p-4">
            <div className="space-y-2">
              {activityLogs.slice(0, 4).map((log) => {
                const completedCount = log.activities.filter(a => a.completed).length;
                const date = new Date(log.date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <div key={log.date} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground">
                          {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-muted-foreground/60 text-xs">
                          {completedCount}/5 completed
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {log.activities.map((activity) => {
                        const ActivityIcon = iconMap[activity.name];
                        const colors = colorMap[activity.name];
                        return (
                          <div 
                            key={activity.name}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                              activity.completed 
                                ? `${colors.bg}/50` 
                                : 'bg-muted/40'
                            }`}
                            title={`${activity.name}: ${activity.completed ? activity.duration : 'Not completed'}`}
                          >
                            <ActivityIcon className={`w-3 h-3 ${
                              activity.completed ? colors.iconColor : 'text-muted-foreground/40'
                            }`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesContent;
