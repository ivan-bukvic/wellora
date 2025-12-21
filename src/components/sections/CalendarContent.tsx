import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { generateDemoCalendarData } from '@/data/demoData';

const CalendarContent = () => {
  const { isDemoUser } = useDemoMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarData = isDemoUser ? generateDemoCalendarData() : {};

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isFuture = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate > today;
  };

  // Get mood/intensity word based on completion rate
  const getMoodWord = (completionRate: number): string => {
    if (completionRate >= 0.8) return 'Balanced';
    if (completionRate >= 0.6) return 'Active';
    if (completionRate >= 0.3) return 'Light';
    return 'Rest-focused';
  };

  // Get subtle accent color based on completion rate
  const getAccentColor = (completionRate: number) => {
    if (completionRate >= 0.8) return 'text-success/70';
    if (completionRate >= 0.4) return 'text-warning/70';
    if (completionRate > 0) return 'text-destructive/50';
    return 'text-muted-foreground/50';
  };

  // Get subtle underline color
  const getUnderlineColor = (completionRate: number) => {
    if (completionRate >= 0.8) return 'bg-success/30';
    if (completionRate >= 0.4) return 'bg-warning/30';
    if (completionRate > 0) return 'bg-destructive/20';
    return 'bg-muted';
  };

  return (
    <div className="animate-fade-in-up h-full flex flex-col">
      <p className="text-muted-foreground mb-4">View your wellness schedule and activity history</p>
      
      <div className="wellora-card p-4 sm:p-5 flex-1 flex flex-col">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-1">
            <button 
              onClick={previousMonth}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Flex grow to fill available space */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 flex-1 auto-rows-fr">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: startingDay }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-0" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateKey = getDateKey(day);
            const dayData = calendarData[dateKey];
            const today = isToday(day);
            const future = isFuture(day);
            
            const completed = dayData?.completed ?? 0;
            const total = dayData?.total ?? 5;
            const completionRate = total > 0 ? completed / total : 0;
            const hasData = isDemoUser && dayData && !future;

            return (
              <div 
                key={day}
                className={`
                  rounded-xl flex flex-col p-1.5 sm:p-2 transition-all cursor-pointer min-h-0
                  ${today 
                    ? 'bg-primary/[0.08] border border-primary/40 shadow-sm' 
                    : future 
                      ? 'bg-muted/20 border border-transparent' 
                      : hasData 
                        ? 'bg-card border border-border/50 hover:shadow-sm'
                        : 'bg-muted/30 border border-transparent'
                  }
                `}
              >
                {/* Day number - top left */}
                <span className={`text-xs font-medium leading-none ${
                  today 
                    ? 'text-primary font-semibold' 
                    : future 
                      ? 'text-muted-foreground/50' 
                      : 'text-foreground'
                }`}>
                  {day}
                </span>
                
                {/* Mood word and completion - center */}
                {hasData && (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-0 gap-0.5">
                    <span className={`text-[9px] sm:text-[10px] font-medium leading-tight ${getAccentColor(completionRate)}`}>
                      {getMoodWord(completionRate)}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-muted-foreground/60 leading-tight">
                      {Math.round(completionRate * 100)}%
                    </span>
                  </div>
                )}
                
                {/* Future placeholder */}
                {future && (
                  <div className="flex-1 flex items-center justify-center min-h-0">
                    <span className="text-[8px] text-muted-foreground/40">—</span>
                  </div>
                )}
                
                {/* No data placeholder for non-demo */}
                {!isDemoUser && !future && (
                  <div className="flex-1 flex items-center justify-center min-h-0">
                    <span className="text-[8px] text-muted-foreground/40">—</span>
                  </div>
                )}
                
                {/* Subtle underline accent - bottom */}
                {hasData && (
                  <div className={`w-full h-0.5 rounded-full mt-auto ${getUnderlineColor(completionRate)}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state for non-demo users */}
      {!isDemoUser && (
        <div className="mt-4 text-center text-muted-foreground text-sm">
          <p>Start logging activities to see your progress on the calendar</p>
        </div>
      )}
    </div>
  );
};

export default CalendarContent;
