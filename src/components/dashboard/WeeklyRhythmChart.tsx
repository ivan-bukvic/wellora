import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLatestDataRange, getWeekDatesFor } from '@/hooks/useLatestDataRange';

// Gentle wave data representing daily rhythm
interface DayData {
  day: string;
  flow: number;
  rest: number;
}

// Activity type IDs
const ACTIVITY_TYPE_IDS = {
  walking: '038a9c76-4848-48a9-8245-2d2fefe85711',
  sleeping: 'e74434f7-3f12-4854-a66f-493f0fc1cb28',
  stretching: '1f244fe2-03a7-45b8-8da8-5ecd8868821f',
  hydration: 'd3942123-3739-459f-ac0d-04f8de531dc7',
  mindfulness: 'e363142a-a13c-45bd-9728-a1143a2b5d5a',
};

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Get dates for the current week (Monday to Sunday)
const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.toISOString().split('T')[0];
  });
};

const computeWeekData = (logs: any[], weekDates: string[]): DayData[] => {
  return weekDates.map((date, index) => {
    const dayLogs = logs?.filter(l => l.date === date) || [];
    
    const walkingLog = dayLogs.find(l => l.activity_type_id === ACTIVITY_TYPE_IDS.walking);
    const stretchingLog = dayLogs.find(l => l.activity_type_id === ACTIVITY_TYPE_IDS.stretching);
    const mindfulnessLog = dayLogs.find(l => l.activity_type_id === ACTIVITY_TYPE_IDS.mindfulness);
    const sleepLog = dayLogs.find(l => l.activity_type_id === ACTIVITY_TYPE_IDS.sleeping);
    
    let flowScore = 0.3;
    if (walkingLog) flowScore += 0.25;
    if (stretchingLog) flowScore += 0.2;
    if (mindfulnessLog) flowScore += 0.25;
    
    let restScore = 0.3;
    if (sleepLog?.sleep_duration_hours) {
      const hours = sleepLog.sleep_duration_hours;
      if (hours >= 8) restScore = 0.95;
      else if (hours >= 7) restScore = 0.8;
      else if (hours >= 6) restScore = 0.6;
      else restScore = 0.4;
    }

    return {
      day: dayNames[index],
      flow: Math.min(flowScore, 1),
      rest: restScore,
    };
  });
};

export const WeeklyRhythmChart = () => {
  const { latestDate, isLoading: rangeLoading } = useLatestDataRange();
  const [weekData, setWeekData] = useState<DayData[]>(
    dayNames.map(day => ({ day, flow: 0.5, rest: 0.5 }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showingHistorical, setShowingHistorical] = useState(false);
  const [historicalLabel, setHistoricalLabel] = useState('');

  useEffect(() => {
    if (rangeLoading) return;

    const fetchWeeklyData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoading(false); return; }

        // Try current week first
        const weekDates = getWeekDates();
        
        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .in('date', weekDates)
          .eq('completed', true);

        if (error) { console.error('Error fetching weekly data:', error); setIsLoading(false); return; }

        const hasCurrentData = logs && logs.length > 0;

        if (hasCurrentData) {
          setWeekData(computeWeekData(logs, weekDates));
          setShowingHistorical(false);
        } else if (latestDate) {
          // Fallback to the week containing the latest data
          const fallbackWeek = getWeekDatesFor(latestDate);
          const { data: fallbackLogs } = await supabase
            .from('activity_logs')
            .select('*')
            .eq('user_id', user.id)
            .in('date', fallbackWeek)
            .eq('completed', true);

          if (fallbackLogs && fallbackLogs.length > 0) {
            setWeekData(computeWeekData(fallbackLogs, fallbackWeek));
            setShowingHistorical(true);
            const d = new Date(fallbackWeek[0] + 'T00:00:00');
            setHistoricalLabel(`Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
          }
        }
      } catch (err) {
        console.error('Error in weekly rhythm fetch:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, [latestDate, rangeLoading]);
  
  const chartWidth = 320;
  const chartHeight = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 20 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  
  const generateSmoothPath = (data: DayData[], key: 'flow' | 'rest') => {
    const points = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * innerWidth,
      y: padding.top + innerHeight - d[key] * innerHeight,
    }));
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const cpX = (current.x + next.x) / 2;
      path += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };
  
  const generateAreaPath = (data: DayData[], key: 'flow' | 'rest') => {
    const linePath = generateSmoothPath(data, key);
    const lastX = padding.left + innerWidth;
    const firstX = padding.left;
    const bottomY = padding.top + innerHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const flowPath = generateSmoothPath(weekData, 'flow');
  const restPath = generateSmoothPath(weekData, 'rest');
  const flowAreaPath = generateAreaPath(weekData, 'flow');
  const restAreaPath = generateAreaPath(weekData, 'rest');

  return (
    <div className="wellora-card flex-1 animate-fade-in-up stagger-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-foreground">Activity vs Rest Balance</h3>
        {showingHistorical && (
          <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{historicalLabel}</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-5">A relative snapshot, not a performance score.</p>
      
      <div className="flex justify-center">
        <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
          {[0.25, 0.5, 0.75].map((level) => (
            <line key={level} x1={padding.left} y1={padding.top + innerHeight * (1 - level)} x2={padding.left + innerWidth} y2={padding.top + innerHeight * (1 - level)} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          ))}
          <path d={restAreaPath} fill="hsl(var(--warm))" opacity="0.25" />
          <path d={flowAreaPath} fill="hsl(var(--primary))" opacity="0.2" />
          <path d={restPath} fill="none" stroke="hsl(var(--warm-muted))" strokeWidth="3" strokeLinecap="round" className="transition-all duration-700" />
          <path d={flowPath} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="transition-all duration-700" />
          {weekData.map((d, i) => (
            <circle key={d.day} cx={padding.left + (i / (weekData.length - 1)) * innerWidth} cy={padding.top + innerHeight - d.flow * innerHeight} r="4" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" className="transition-all duration-300" />
          ))}
          {weekData.map((d, i) => (
            <text key={d.day} x={padding.left + (i / (weekData.length - 1)) * innerWidth} y={chartHeight - 8} textAnchor="middle" className="text-[10px] fill-muted-foreground">{d.day}</text>
          ))}
        </svg>
      </div>
      
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary opacity-70" />
          <span className="text-xs text-muted-foreground">Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warm" />
          <span className="text-xs text-muted-foreground">Rest</span>
        </div>
      </div>
    </div>
  );
};
