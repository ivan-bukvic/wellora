const data = [
  { day: 'Mon', hours: 0.5 },
  { day: 'Tue', hours: 2.2 },
  { day: 'Wed', hours: 1.2 },
  { day: 'Thu', hours: 2.5 },
  { day: 'Fri', hours: 1.8 },
];

const maxHours = 2.5;

export const ActivityDurationChart = () => {
  return (
    <div className="wellora-card animate-fade-in-up stagger-2">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-primary rounded-full"></div>
        <h3 className="text-lg font-semibold text-foreground">Duration of Activities</h3>
      </div>
      
      <div className="flex gap-4">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-muted-foreground h-40">
          <span>2.5 Hrs</span>
          <span>2 Hrs</span>
          <span>1.5 Hrs</span>
          <span>1 Hrs</span>
          <span>30 Min</span>
          <span>10 Min</span>
        </div>
        
        {/* Chart bars */}
        <div className="flex-1 flex items-end gap-3 h-40 border-l border-b border-border/50 pl-4 pb-2">
          {data.map((item) => {
            const heightPercent = Math.max((item.hours / maxHours) * 100, 5);
            
            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full">
                <div className="flex-1 flex items-end w-full justify-center">
                  <div 
                    className="w-full max-w-10 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-700 hover:from-primary-dark hover:to-primary cursor-pointer"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex gap-4 mt-2">
        <div className="w-12"></div>
        <div className="flex-1 flex gap-3 pl-4">
          {data.map((item) => (
            <div key={item.day} className="flex-1 text-center text-xs text-muted-foreground">
              {item.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
