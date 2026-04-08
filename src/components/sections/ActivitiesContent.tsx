import { useState, useEffect } from 'react';
import { Footprints, Moon, Droplets, Brain, Check, Clock, PersonStanding, LucideProps } from 'lucide-react';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/context/UserProfileContext';
import DailyFlowTimeline from './DailyFlowTimeline';
import LogActivityModal from '@/components/activities/LogActivityModal';

const activities = [
  { icon: Footprints, name: 'Walking', description: 'Track your daily steps', color: 'bg-activity-walking' },
  { icon: Moon, name: 'Sleeping', description: 'Monitor your sleep quality', color: 'bg-activity-sleep' },
  { icon: PersonStanding, name: 'Stretching', description: 'Keep your body flexible', color: 'bg-activity-stretching' },
  { icon: Droplets, name: 'Hydration', description: 'Stay hydrated throughout the day', color: 'bg-activity-hydration' },
  { icon: Brain, name: 'Mindfulness', description: 'Practice mental wellness', color: 'bg-activity-mindfulness' },
];

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Walking: Footprints,
  Sleeping: Moon,
  Stretching: PersonStanding,
  Hydration: Droplets,
  Mindfulness: Brain,
};

const activityColors: Record<string, { bg: string; bgMuted: string; bgActive: string; bgInactive: string; text: string; textMuted: string }> = {
  Walking: { bg: 'bg-activity-walking', bgMuted: 'bg-activity-walking-muted', bgActive: 'bg-activity-walking/20', bgInactive: 'bg-muted/40', text: 'text-activity-walking', textMuted: 'text-muted-foreground/60' },
  Sleeping: { bg: 'bg-activity-sleep', bgMuted: 'bg-activity-sleep-muted', bgActive: 'bg-activity-sleep/20', bgInactive: 'bg-muted/40', text: 'text-activity-sleep', textMuted: 'text-muted-foreground/60' },
  Stretching: { bg: 'bg-activity-stretching', bgMuted: 'bg-activity-stretching-muted', bgActive: 'bg-activity-stretching/20', bgInactive: 'bg-muted/40', text: 'text-activity-stretching', textMuted: 'text-muted-foreground/60' },
  Hydration: { bg: 'bg-activity-hydration', bgMuted: 'bg-activity-hydration-muted', bgActive: 'bg-activity-hydration/20', bgInactive: 'bg-muted/40', text: 'text-activity-hydration', textMuted: 'text-muted-foreground/60' },
  Mindfulness: { bg: 'bg-activity-mindfulness', bgMuted: 'bg-activity-mindfulness-muted', bgActive: 'bg-activity-mindfulness/20', bgInactive: 'bg-muted/40', text: 'text-activity-mindfulness', textMuted: 'text-muted-foreground/60' },
};

const ActivitiesContent = () => {
  const { session, authLoading } = useUserProfile();
  const { groupedLogs, todayRoutine, routineDate, isLoading } = useActivityLogs();

  // === DEBUG: Session-aware raw data fetch ===
  useEffect(() => {
    console.log('[DEBUG] ActivitiesContent debug probe running, authLoading:', authLoading, 'userId:', session?.user?.id ?? 'none');

    if (authLoading) return;
    if (!session?.user) {
      console.log('[DEBUG] ActivitiesContent: no session user for debug probe');
      return;
    }

    const debugFetch = async () => {
      const userId = session.user.id;
      console.log('[DEBUG] ActivitiesContent: fetching raw logs for user', userId);

      const { data: rawLogs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .limit(5);

      if (!rawLogs || rawLogs.length === 0) {
        console.log('[DEBUG] ActivitiesContent raw: Query returned 0 rows – possible causes: wrong table, user_id mismatch, or empty database');
      } else {
        console.log('[DEBUG] ActivitiesContent raw logs (no filter):', rawLogs.length, 'rows');
      }
      if (error) console.error('[DEBUG] ActivitiesContent raw error:', error);

      const { data: userLogs, error: userErr } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(5);

      if (!userLogs || userLogs.length === 0) {
        console.log('[DEBUG] ActivitiesContent user-filtered: Query returned 0 rows – possible causes: wrong table, user_id mismatch, or empty database');
      } else {
        console.log('[DEBUG] ActivitiesContent user-filtered logs:', userLogs.length, 'rows, dates:', userLogs.map(l => l.date));
      }
      if (userErr) console.error('[DEBUG] ActivitiesContent user-filtered error:', userErr);
    };
    debugFetch();
  }, [session, authLoading]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActivityType, setActiveActivityType] = useState<string | null>(null);
  const [logActivityForm, setLogActivityForm] = useState<Record<string, string>>({});
  const [openNonce, setOpenNonce] = useState(0);

  const handleOpenLogModal = (activityType: string) => {
    setLogActivityForm({});
    setActiveActivityType(activityType);
    setOpenNonce((n) => n + 1);
    setIsModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setLogActivityForm({});
    setIsModalOpen(false);
    setActiveActivityType(null);
  };

  const handleSaveLogModal = async () => {
    console.log('Saving activity:', activeActivityType, logActivityForm);
    setLogActivityForm({});
    handleCloseLogModal();
  };

  const handleLogFieldChange = (name: string, value: string) => {
    setLogActivityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasRoutineData = todayRoutine.some(item => item.completed || item.progress);
  const today = new Date().toISOString().split('T')[0];
  const isShowingHistorical = routineDate !== today && hasRoutineData;

  return (
    <div className="animate-fade-in-up">
      <p className="text-muted-foreground mb-8">Track and log your daily wellness activities</p>
      
      {!isLoading && (
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-1">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {isShowingHistorical 
                  ? `Last Recorded Activity · ${new Date(routineDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : "Today's Routine"
                }
              </h2>
              <div className="wellora-card p-5" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.025), hsl(var(--primary) / 0.015))', borderColor: 'hsl(var(--primary) / 0.12)' }}>
                <div className="space-y-3">
                  {todayRoutine.map((item, index) => {
                    const Icon = iconMap[item.name];
                    const colors = activityColors[item.name];
                    const isCompleted = item.completed;
                    const isInProgress = !isCompleted && item.progress;
                    
                    return (
                      <div key={item.name}>
                        <div 
                          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                            isCompleted 
                              ? 'bg-success/8 border border-success/20' 
                              : isInProgress 
                                ? 'bg-warning/8 border border-warning/20'
                                : 'bg-muted/20 border border-border/20'
                          }`}
                        >
                          <div className="w-10 h-10 bg-muted/40 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Icon className={`w-5 h-5 ${colors.text} opacity-80`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.duration || item.progress || 'Not logged yet'}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center">
                                <Check className="w-4 h-4 text-success" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-warning/15 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-warning" />
                              </div>
                            )}
                          </div>
                        </div>
                        {index < todayRoutine.length - 1 && <div className="h-1" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <h2 className="text-lg font-semibold text-foreground mb-4 opacity-0">Placeholder</h2>
              <div className="wellora-card p-0 h-[calc(100%-2rem)] overflow-hidden border-border/40">
                <DailyFlowTimeline />
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-foreground mb-4">Available Activities</h2>
      <div className="grid grid-cols-6 gap-6">
        {activities.slice(0, 3).map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.name} className="col-span-2 wellora-card hover:shadow-soft-lg cursor-pointer transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${activity.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{activity.name}</h3>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpenLogModal(activity.name)}
                className="text-primary text-sm font-medium hover:underline flex-shrink-0"
              >
                + Log Activity
              </button>
            </div>
          );
        })}
        {activities.slice(3, 5).map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.name} className="col-span-3 wellora-card hover:shadow-soft-lg cursor-pointer transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${activity.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{activity.name}</h3>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpenLogModal(activity.name)}
                className="text-primary text-sm font-medium hover:underline flex-shrink-0"
              >
                + Log Activity
              </button>
            </div>
          );
        })}
      </div>

      {!isLoading && groupedLogs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity Log</h2>
          <div className="wellora-card">
            <div className="space-y-4">
              {groupedLogs.slice(0, 7).map((log) => {
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
                        const colors = activityColors[activity.name];
                        return (
                          <div 
                            key={activity.name}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              activity.completed 
                                ? colors.bgActive
                                : colors.bgInactive
                            }`}
                            title={`${activity.name}: ${activity.completed ? activity.duration : 'Not completed'}`}
                          >
                            <ActivityIcon className={`w-4 h-4 ${activity.completed ? colors.text : colors.textMuted}`} />
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

      {isModalOpen && activeActivityType && (
        <LogActivityModal
          key={`${activeActivityType}-${openNonce}`}
          isOpen={true}
          onClose={handleCloseLogModal}
          onSave={handleSaveLogModal}
          onChange={handleLogFieldChange}
          values={logActivityForm}
          activityName={activeActivityType}
        />
      )}
    </div>
  );
};

export default ActivitiesContent;
