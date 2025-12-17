import { Footprints, Moon, StretchHorizontal, Droplets, Brain, Plus, Check, Clock } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { generateDemoActivityLogs, demoTodayRoutine } from '@/data/demoData';

const activities = [
  { icon: Footprints, name: 'Walking', description: 'Track your daily steps', color: 'bg-primary' },
  { icon: Moon, name: 'Sleeping', description: 'Monitor your sleep quality', color: 'bg-secondary' },
  { icon: StretchHorizontal, name: 'Stretching', description: 'Keep your body flexible', color: 'bg-accent' },
  { icon: Droplets, name: 'Hydration', description: 'Stay hydrated throughout the day', color: 'bg-primary' },
  { icon: Brain, name: 'Mindfulness', description: 'Practice mental wellness', color: 'bg-warning' },
];

const iconMap: Record<string, typeof Footprints> = {
  Walking: Footprints,
  Sleeping: Moon,
  Stretching: StretchHorizontal,
  Hydration: Droplets,
  Mindfulness: Brain,
};

const ActivitiesContent = () => {
  const { isDemoUser } = useDemoMode();
  const activityLogs = isDemoUser ? generateDemoActivityLogs() : [];
  const todayRoutine = isDemoUser ? demoTodayRoutine : [];

  return (
    <div className="animate-fade-in-up">
      <p className="text-muted-foreground mb-8">Track and log your daily wellness activities</p>
      
      {/* Today's Routine - Only for demo user */}
      {isDemoUser && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Today's Routine</h2>
          <div className="grid grid-cols-5 gap-4">
            {todayRoutine.map((item) => {
              const Icon = iconMap[item.name];
              return (
                <div 
                  key={item.name} 
                  className={`wellora-card p-4 ${item.completed ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${item.completed ? 'text-success' : 'text-warning'}`} />
                    {item.completed ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Clock className="w-4 h-4 text-warning" />
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

      {/* Activity Cards */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Available Activities</h2>
      <div className="grid grid-cols-3 gap-6">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.name} className="wellora-card hover:shadow-soft-lg cursor-pointer transition-all">
              <div className={`w-14 h-14 ${activity.color} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7 text-primary-foreground" />
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

      {/* Recent Activity Log - Only for demo user */}
      {isDemoUser && activityLogs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity Log</h2>
          <div className="wellora-card">
            <div className="space-y-4">
              {activityLogs.slice(0, 7).map((log) => {
                const completedCount = log.activities.filter(a => a.completed).length;
                const date = new Date(log.date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <div key={log.date} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {completedCount}/5 activities completed
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {log.activities.map((activity) => {
                        const ActivityIcon = iconMap[activity.name];
                        return (
                          <div 
                            key={activity.name}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              activity.completed ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                            }`}
                            title={`${activity.name}: ${activity.completed ? activity.duration : 'Not completed'}`}
                          >
                            <ActivityIcon className="w-4 h-4" />
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
