const DayInMotionVisual = () => {
  return (
    <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* === ORGANIC STREET LAYER: Irregular, city-inspired topology === */}
        
        {/* Primary meandering street - gentle S-curve */}
        <path
          d="M -20 95 Q 45 88, 95 102 Q 150 118, 195 98 Q 255 72, 320 88 Q 380 102, 440 78"
          stroke="hsl(210 15% 88%)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        
        {/* Secondary winding path - crosses at angle */}
        <path
          d="M 35 -10 Q 52 45, 68 95 Q 78 135, 62 175 Q 48 218, 72 265 Q 88 298, 95 340"
          stroke="hsl(210 12% 89%)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.28"
        />
        
        {/* Tertiary curved street */}
        <path
          d="M -15 185 Q 55 172, 115 195 Q 168 215, 225 188 Q 278 162, 340 182 Q 395 198, 440 175"
          stroke="hsl(210 10% 90%)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />
        
        {/* Diagonal connector - shallow angle */}
        <path
          d="M 125 -15 Q 148 42, 162 98 Q 175 148, 158 198 Q 142 252, 168 310"
          stroke="hsl(210 12% 88%)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.22"
        />
        
        {/* Another organic diagonal */}
        <path
          d="M 285 -20 Q 268 55, 282 115 Q 298 178, 272 235 Q 252 285, 278 340"
          stroke="hsl(210 10% 89%)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.2"
        />
        
        {/* Small curved side street */}
        <path
          d="M -10 268 Q 48 252, 98 272 Q 142 288, 185 265"
          stroke="hsl(210 8% 91%)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        
        {/* Upper curved connector */}
        <path
          d="M 195 -10 Q 212 35, 198 78 Q 185 118, 215 155"
          stroke="hsl(210 10% 90%)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.2"
        />
        
        {/* Soft curved alley */}
        <path
          d="M 350 120 Q 378 145, 365 182 Q 352 218, 385 255 Q 408 285, 420 320"
          stroke="hsl(210 8% 91%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        
        {/* Small organic path near bottom */}
        <path
          d="M 220 235 Q 258 248, 295 232 Q 328 218, 365 242"
          stroke="hsl(210 10% 90%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />

        {/* === PRIMARY MOTION PATH: Recorded, organic trace === */}
        
        {/* Motion path - subtle, organic, with faded ends */}
        <defs>
          <linearGradient id="pathFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(201 60% 65%)" stopOpacity="0.15" />
            <stop offset="12%" stopColor="hsl(201 60% 60%)" stopOpacity="0.55" />
            <stop offset="50%" stopColor="hsl(201 55% 58%)" stopOpacity="0.65" />
            <stop offset="88%" stopColor="hsl(201 60% 60%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(201 60% 65%)" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        
        {/* Main recorded path - gentle organic curve */}
        <path
          d="M 42 248 Q 68 225, 95 208 Q 135 182, 168 168 Q 212 150, 248 138 Q 298 122, 345 98 Q 372 85, 388 72"
          stroke="url(#pathFade)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* === ACTIVITY NODES: Small, soft, natural placement === */}
        
        {/* Node 1 - Start area (Walking - muted green) */}
        <circle cx="52" cy="238" r="5" fill="hsl(90 18% 82%)" opacity="0.4" />
        <circle cx="52" cy="238" r="2.5" fill="hsl(90 22% 72%)" opacity="0.6" />
        
        {/* Node 2 - Early path (Hydration - muted blue) */}
        <circle cx="112" cy="195" r="4.5" fill="hsl(201 35% 82%)" opacity="0.35" />
        <circle cx="112" cy="195" r="2" fill="hsl(201 40% 70%)" opacity="0.55" />
        
        {/* Node 3 - Mid intersection (Sleep - muted lavender) */}
        <circle cx="185" cy="160" r="5" fill="hsl(270 25% 85%)" opacity="0.35" />
        <circle cx="185" cy="160" r="2.5" fill="hsl(270 30% 75%)" opacity="0.5" />
        
        {/* Node 4 - Upper section (Stretching - muted warm) */}
        <circle cx="275" cy="128" r="4" fill="hsl(35 35% 82%)" opacity="0.35" />
        <circle cx="275" cy="128" r="2" fill="hsl(35 40% 72%)" opacity="0.5" />
        
        {/* Node 5 - Near end (Mindfulness - muted yellow) */}
        <circle cx="358" cy="88" r="4.5" fill="hsl(48 30% 85%)" opacity="0.3" />
        <circle cx="358" cy="88" r="2" fill="hsl(48 35% 75%)" opacity="0.45" />
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
