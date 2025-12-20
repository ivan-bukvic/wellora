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
        
        {/* Small curved connector between streets */}
        <path
          d="M 68 95 Q 88 98, 95 102"
          stroke="hsl(210 8% 91%)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.2"
        />
        
        {/* Connector from first street down to third */}
        <path
          d="M 115 195 Q 128 155, 162 98"
          stroke="hsl(210 10% 90%)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        
        {/* Short curved alley */}
        <path
          d="M 225 188 Q 248 155, 282 115"
          stroke="hsl(210 8% 91%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        
        {/* Lower connecting path */}
        <path
          d="M 62 175 Q 85 182, 115 195"
          stroke="hsl(210 10% 90%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />
        
        {/* Upper right connector */}
        <path
          d="M 282 115 Q 305 100, 320 88"
          stroke="hsl(210 8% 91%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />

        {/* === PRIMARY MOTION PATH: Following street network === */}
        
        {/* Motion path gradient - fades at ends */}
        <defs>
          <linearGradient id="routeFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(201 45% 65%)" stopOpacity="0.1" />
            <stop offset="8%" stopColor="hsl(201 50% 58%)" stopOpacity="0.45" />
            <stop offset="50%" stopColor="hsl(201 45% 55%)" stopOpacity="0.55" />
            <stop offset="92%" stopColor="hsl(201 50% 58%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(201 45% 65%)" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        
        {/* 
          Route path - follows the street network:
          1. Starts on lower-left area of third street
          2. Follows third street northeast
          3. Takes connector up to diagonal street
          4. Follows diagonal to first street intersection
          5. Follows first street to upper right
        */}
        <path
          d="M 55 172 
             Q 55 172, 115 195 
             Q 128 155, 162 98
             Q 175 108, 195 98
             Q 255 72, 320 88"
          stroke="url(#routeFade)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* === ACTIVITY NODES: At junctions along the route === */}
        
        {/* Node 1 - Route start, on third street (Walking - muted green) */}
        <circle cx="55" cy="172" r="4.5" fill="hsl(90 15% 84%)" opacity="0.35" />
        <circle cx="55" cy="172" r="2" fill="hsl(90 20% 72%)" opacity="0.5" />
        
        {/* Node 2 - Junction of third street and connector (Hydration - muted blue) */}
        <circle cx="115" cy="195" r="5" fill="hsl(201 30% 84%)" opacity="0.3" />
        <circle cx="115" cy="195" r="2.5" fill="hsl(201 35% 70%)" opacity="0.45" />
        
        {/* Node 3 - Junction of connector and diagonal/first street (Sleep - muted lavender) */}
        <circle cx="162" cy="98" r="5" fill="hsl(270 20% 86%)" opacity="0.3" />
        <circle cx="162" cy="98" r="2.5" fill="hsl(270 25% 76%)" opacity="0.42" />
        
        {/* Node 4 - Along first street curve (Stretching - muted warm) */}
        <circle cx="195" cy="98" r="4" fill="hsl(35 30% 84%)" opacity="0.3" />
        <circle cx="195" cy="98" r="2" fill="hsl(35 35% 74%)" opacity="0.4" />
        
        {/* Node 5 - Near route end on first street (Mindfulness - muted gold) */}
        <circle cx="320" cy="88" r="4.5" fill="hsl(48 25% 86%)" opacity="0.28" />
        <circle cx="320" cy="88" r="2" fill="hsl(48 30% 76%)" opacity="0.38" />
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
