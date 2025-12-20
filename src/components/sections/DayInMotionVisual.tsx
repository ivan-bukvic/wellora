const DayInMotionVisual = () => {
  return (
    <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-light/40 via-primary-light/20 to-muted/30">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Primary flowing path */}
        <path
          d="M -20 180 Q 80 120, 160 160 T 280 130 T 420 180"
          stroke="hsl(201 90% 73%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        
        {/* Secondary subtle path */}
        <path
          d="M -30 220 Q 60 260, 140 200 T 260 230 T 430 200"
          stroke="hsl(201 90% 73%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        
        {/* Tertiary background path */}
        <path
          d="M -10 100 Q 100 60, 200 90 T 350 70 T 440 110"
          stroke="hsl(201 90% 80%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />

        {/* Activity nodes along primary path - desaturated, subtle */}
        {/* Walking - soft green */}
        <circle cx="80" cy="140" r="6" fill="hsl(80 29% 75%)" opacity="0.5" />
        <circle cx="80" cy="140" r="3" fill="hsl(80 29% 65%)" opacity="0.7" />
        
        {/* Sleep - lavender */}
        <circle cx="160" cy="160" r="5" fill="hsl(270 70% 85%)" opacity="0.5" />
        <circle cx="160" cy="160" r="2.5" fill="hsl(270 70% 75%)" opacity="0.7" />
        
        {/* Hydration - primary blue */}
        <circle cx="220" cy="145" r="7" fill="hsl(201 90% 80%)" opacity="0.5" />
        <circle cx="220" cy="145" r="4" fill="hsl(201 90% 73%)" opacity="0.8" />
        
        {/* Stretching - orange */}
        <circle cx="280" cy="130" r="5" fill="hsl(32 80% 70%)" opacity="0.45" />
        <circle cx="280" cy="130" r="2.5" fill="hsl(32 80% 60%)" opacity="0.65" />
        
        {/* Mindfulness - soft yellow */}
        <circle cx="350" cy="155" r="6" fill="hsl(43 80% 82%)" opacity="0.45" />
        <circle cx="350" cy="155" r="3" fill="hsl(43 80% 75%)" opacity="0.65" />
        
        {/* Additional ambient dots for rhythm */}
        <circle cx="40" cy="170" r="2" fill="hsl(201 90% 73%)" opacity="0.3" />
        <circle cx="120" cy="150" r="2.5" fill="hsl(201 90% 73%)" opacity="0.25" />
        <circle cx="190" cy="155" r="2" fill="hsl(201 90% 73%)" opacity="0.3" />
        <circle cx="250" cy="140" r="2" fill="hsl(201 90% 73%)" opacity="0.2" />
        <circle cx="320" cy="145" r="2.5" fill="hsl(201 90% 73%)" opacity="0.25" />
        
        {/* Soft ambient shapes for depth */}
        <ellipse cx="100" cy="80" rx="40" ry="25" fill="hsl(201 90% 85%)" opacity="0.15" />
        <ellipse cx="300" cy="250" rx="50" ry="30" fill="hsl(201 90% 85%)" opacity="0.12" />
        <ellipse cx="380" cy="60" rx="30" ry="20" fill="hsl(43 80% 88%)" opacity="0.1" />
      </svg>
      
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h3 className="text-base font-semibold text-foreground mb-1.5">Your Day in Motion</h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          A visual snapshot of today's activity
        </p>
      </div>
    </div>
  );
};

export default DayInMotionVisual;
