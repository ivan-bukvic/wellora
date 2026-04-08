import { useState, useEffect } from 'react';
import { Sparkles, Footprints, Moon, Brain } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { supabase } from '@/integrations/supabase/client';
import { useLatestDataRange, getSevenDaysEndingAt } from '@/hooks/useLatestDataRange';
import { useUserProfile } from '@/context/UserProfileContext';

const ACTIVITY_TYPE_IDS = {
  walking: '038a9c76-4848-48a9-8245-2d2fefe85711',
  sleeping: 'e74434f7-3f12-4854-a66f-493f0fc1cb28',
  mindfulness: 'e363142a-a13c-45bd-9728-a1143a2b5d5a',
};

const SoftProgressRing = ({ progress }: { progress: number }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke="hsl(var(--primary) / 0.6)" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary/40" />
      </div>
    </div>
  );
};

const BalanceIcons = ({ active = true }: { active?: boolean }) => {
  const activities = [
    { icon: Footprints, label: 'Movement' },
    { icon: Moon, label: 'Rest' },
    { icon: Brain, label: 'Mindfulness' },
  ];
  return (
    <div className="flex items-center gap-3">
      {activities.map(({ icon: Icon, label }) => (
        <div key={label} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${active ? 'bg-primary/10' : 'bg-muted'}`}>
          <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-muted-foreground/50'}`} />
          <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-muted-foreground/50'}`}>{label}</span>
        </div>
      ))}
    </div>
  );
};

const ConsistencyCard = ({ consistencyLevel }: { consistencyLevel: number }) => {
  const getMessage = () => {
    if (consistencyLevel >= 70) return "You stayed consistent on most days this week";
    if (consistencyLevel >= 50) return "You're building consistency this week";
    return "Your rhythm is taking shape";
  };
  return (
    <div className="flex-1 p-5 rounded-2xl bg-muted/40 border border-border">
      <div className="flex items-start gap-4">
        <SoftProgressRing progress={consistencyLevel} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Weekly Consistency</h4>
          <p className="text-base font-medium text-foreground leading-snug">{getMessage()}</p>
        </div>
      </div>
    </div>
  );
};

const BalanceCard = ({ hasBalance }: { hasBalance: boolean }) => {
  return (
    <div className="flex-1 p-5 rounded-2xl bg-muted/40 border border-border">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Routine Balance</h4>
      <p className="text-base font-medium text-foreground leading-snug mb-4">
        {hasBalance ? "Good balance between movement, rest, and mindfulness" : "Your balance is emerging across activities"}
      </p>
      <BalanceIcons active={true} />
    </div>
  );
};

export const TotalActivityCard = () => {
  const { session, authLoading } = useUserProfile();
  const { currentMicroCopy } = useAIInsights();
  const { latestDate, isLoading: rangeLoading } = useLatestDataRange();
  const [consistencyLevel, setConsistencyLevel] = useState(65);
  const [hasBalance, setHasBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showingHistorical, setShowingHistorical] = useState(false);

  console.log('[DEBUG] TotalActivityCard initialized, authLoading:', authLoading, 'rangeLoading:', rangeLoading);

  useEffect(() => {
    console.log('[DEBUG] TotalActivityCard effect, authLoading:', authLoading, 'rangeLoading:', rangeLoading, 'userId:', session?.user?.id ?? 'none');

    if (authLoading || rangeLoading) return;

    if (!session?.user) {
      console.log('[DEBUG] TotalActivityCard: no session user');
      setIsLoading(false);
      return;
    }

    const userId = session.user.id;

    const fetchActivityData = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('date', sevenDaysAgo.toISOString().split('T')[0])
          .eq('completed', true);

        if (error) { console.error('[DEBUG] TotalActivityCard error:', error); setIsLoading(false); return; }

        let activeLogs = logs;
        let historical = false;

        if ((!logs || logs.length === 0) && latestDate) {
          console.log('[DEBUG] TotalActivityCard: falling back to latestDate', latestDate);
          const fallbackStart = getSevenDaysEndingAt(latestDate);
          const { data: fallbackLogs } = await supabase
            .from('activity_logs')
            .select('*')
            .eq('user_id', userId)
            .gte('date', fallbackStart)
            .lte('date', latestDate)
            .eq('completed', true);

          activeLogs = fallbackLogs || [];
          historical = true;
        }

        if (!activeLogs || activeLogs.length === 0) {
          console.log('[DEBUG] TotalActivityCard: Query returned 0 rows – possible causes: wrong table, user_id mismatch, or empty database');
        } else {
          console.log('[DEBUG] TotalActivityCard: processing', activeLogs.length, 'logs');
        }

        const uniqueDays = new Set(activeLogs?.map(l => l.date) || []);
        const consistency = Math.round((uniqueDays.size / 7) * 100);
        setConsistencyLevel(Math.max(consistency, 30));

        const hasWalking = activeLogs?.some(l => l.activity_type_id === ACTIVITY_TYPE_IDS.walking);
        const hasSleep = activeLogs?.some(l => l.activity_type_id === ACTIVITY_TYPE_IDS.sleeping);
        const hasMindfulness = activeLogs?.some(l => l.activity_type_id === ACTIVITY_TYPE_IDS.mindfulness);
        setHasBalance((hasWalking && hasSleep) || (hasSleep && hasMindfulness) || (hasWalking && hasMindfulness));
        setShowingHistorical(historical);
      } catch (err) {
        console.error('[DEBUG] TotalActivityCard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, [session, authLoading, latestDate, rangeLoading]);

  return (
    <div className="wellora-card animate-fade-in-up stagger-1">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Your Week at a Glance</h3>
        {showingHistorical && latestDate && (
          <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full ml-auto">
            From {new Date(latestDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <ConsistencyCard consistencyLevel={consistencyLevel} />
        <BalanceCard hasBalance={hasBalance} />
      </div>

      {currentMicroCopy && (
        <p className="mt-4 text-xs text-muted-foreground/70 italic pl-2 border-l border-border">{currentMicroCopy}</p>
      )}
    </div>
  );
};
