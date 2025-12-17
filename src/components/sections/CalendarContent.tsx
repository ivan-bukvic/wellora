import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
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

  return (
    <div className="animate-fade-in-up">
      <p className="text-muted-foreground mb-8">View your wellness schedule and activity history</p>
      
      <div className="wellora-card">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={previousMonth}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: startingDay }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateKey = getDateKey(day);
            const dayData = calendarData[dateKey];
            const today = isToday(day);
            const future = isFuture(day);
            
            let statusColor = 'bg-muted';
            let statusIcon = null;
            
            if (isDemoUser && dayData && !future) {
              const completionRate = dayData.completed / dayData.total;
              if (completionRate >= 0.8) {
                statusColor = 'bg-success/20 border-success/30';
                statusIcon = <Check className="w-3 h-3 text-success" />;
              } else if (completionRate >= 0.4) {
                statusColor = 'bg-warning/20 border-warning/30';
              } else if (completionRate > 0) {
                statusColor = 'bg-destructive/10 border-destructive/20';
              }
            }

            return (
              <div 
                key={day}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer hover:shadow-soft ${
                  today ? 'bg-primary text-primary-foreground border-primary' : 
                  future ? 'bg-muted/30 text-muted-foreground border-transparent' :
                  `${statusColor} border`
                }`}
              >
                <span className={`text-sm font-medium ${today ? 'text-primary-foreground' : ''}`}>
                  {day}
                </span>
                {statusIcon && !today && (
                  <div className="mt-1">{statusIcon}</div>
                )}
                {isDemoUser && dayData && dayData.hasStreak && !today && !future && (
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1" title="Streak!" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        {isDemoUser && (
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/20 border border-success/30" />
              <span className="text-xs text-muted-foreground">80%+ complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning/20 border border-warning/30" />
              <span className="text-xs text-muted-foreground">40-80% complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive/10 border border-destructive/20" />
              <span className="text-xs text-muted-foreground">&lt;40% complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
          </div>
        )}
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
