import { Footprints, Moon, Droplets, Brain, PersonStanding, Plus, Check, Clock } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { generateDemoActivityLogs, demoTodayRoutine } from '@/data/demoData';
import { ActivityMixDonut } from '@/components/dashboard/ActivityMixDonut';

// Activity definitions with consistent colors
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
    iconColorClass: 'text-foreground/80'
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
      <p className="text-muted-foreground mb-8">Track and log your daily wellness activities</p>
      
      {/* A) Today's Routine - PRIMARY SECTION */}
      {isDemoUser && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Today's Routine</h2>
          <div className="grid grid-cols-5 gap-4">
            {todayRoutine.map((item) => {
              const Icon = iconMap[item.name];
              const colors = colorMap[item.name];
              
              return (
                <div 
                  key={item.name} 
                  className={`wellora-card p-5 transition-all ${
                    item.completed 
                      ? 'bg-success-light/40 border-success/20' 
                      : 'bg-warm-light/30 border-warm/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                    </div>
                    {item.completed ? (
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-success" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-warm/20 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-warm" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.duration || item.progress}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* B) Activity Mix - Donut Chart */}
      {isDemoUser && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Activity Mix</h2>
          <ActivityMixDonut />
        </div>
      )}

      {/* C) Available Activities - EXPLORATION SECTION */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Available Activities</h2>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.name} className="wellora-card hover:shadow-soft-lg cursor-pointer transition-all">
              <div className={`w-14 h-14 ${activity.colorClass} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={`w-7 h-7 ${activity.iconColorClass}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{activity.name}</h3>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              
              <button className="mt-4 flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                <Plus className="w-4 h-4" />
                Log Activity
              </button>
            </div>
          );
        })}
      </div>

      {/* D) Recent Activity Log - SECONDARY / QUIET */}
      {isDemoUser && activityLogs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-muted-foreground mb-4">Recent Activity Log</h2>
          <div className="wellora-card bg-muted/30 border-border/30">
            <div className="space-y-3">
              {activityLogs.slice(0, 5).map((log) => {
                const completedCount = log.activities.filter(a => a.completed).length;
                const date = new Date(log.date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <div key={log.date} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground">
                          {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-muted-foreground/70 text-xs">
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
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              activity.completed 
                                ? `${colors.bg}/60` 
                                : 'bg-muted/50'
                            }`}
                            title={`${activity.name}: ${activity.completed ? activity.duration : 'Not completed'}`}
                          >
                            <ActivityIcon className={`w-3.5 h-3.5 ${
                              activity.completed ? colors.iconColor : 'text-muted-foreground/50'
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
