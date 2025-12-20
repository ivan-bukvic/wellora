const DayInMotionVisual = () => {
  return (
    <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-muted/20 to-primary/3">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* === ORIENTATION LAYER: Subtle street-like contours === */}
        
        {/* Horizontal pathway hints */}
        <path
          d="M 0 80 Q 60 78, 120 82 T 200 78 T 280 84 T 400 80"
          stroke="hsl(201 30% 85%)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />
        <path
          d="M 0 160 Q 80 158, 150 164 T 250 156 T 350 162 T 400 158"
          stroke="hsl(201 25% 88%)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.2"
        />
        <path
          d="M 0 230 Q 50 232, 100 228 T 200 234 T 320 226 T 400 230"
          stroke="hsl(201 20% 90%)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        
        {/* Vertical pathway hints */}
        <path
          d="M 80 0 Q 78 50, 84 100 T 78 180 T 82 260 T 80 300"
          stroke="hsl(201 25% 87%)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        <path
          d="M 200 0 Q 198 60, 204 120 T 196 200 T 202 280 T 200 300"
          stroke="hsl(201 20% 89%)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />
        <path
          d="M 320 0 Q 318 40, 324 90 T 316 160 T 322 240 T 320 300"
          stroke="hsl(201 25% 86%)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.17"
        />
        
        {/* Soft block-like shapes at intersections */}
        <rect 
          x="65" y="145" width="30" height="30" rx="6"
          fill="hsl(201 20% 92%)"
          opacity="0.2"
        />
        <rect 
          x="185" y="65" width="28" height="28" rx="5"
          fill="hsl(201 15% 93%)"
          opacity="0.15"
        />
        <rect 
          x="305" y="145" width="32" height="32" rx="6"
          fill="hsl(201 18% 91%)"
          opacity="0.18"
        />
        <rect 
          x="185" y="215" width="26" height="26" rx="5"
          fill="hsl(201 15% 94%)"
          opacity="0.12"
        />
        
        {/* Curved intersection corners */}
        <path
          d="M 70 80 Q 80 80, 80 90"
          stroke="hsl(201 22% 88%)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />
        <path
          d="M 195 160 Q 200 160, 200 165"
          stroke="hsl(201 20% 89%)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.12"
        />
        <path
          d="M 315 230 Q 320 230, 320 240"
          stroke="hsl(201 18% 90%)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.14"
        />

        {/* === PRIMARY MOTION PATH: Dominant directional curve === */}
        
        {/* Motion path glow/halo */}
        <path
          d="M 30 240 Q 80 200, 130 180 T 200 140 T 280 100 T 370 70"
          stroke="hsl(201 90% 73%)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />
        
        {/* Main motion path - thicker start, thinner end for progression */}
        <path
          d="M 30 240 Q 80 200, 130 180 T 200 140 T 280 100 T 370 70"
          stroke="hsl(201 90% 58%)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        
        {/* Motion path inner highlight */}
        <path
          d="M 35 235 Q 85 198, 132 178 T 200 142 T 278 102 T 365 75"
          stroke="hsl(201 90% 70%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        
        {/* Direction indicator - small arrow/chevron at end */}
        <path
          d="M 358 78 L 370 70 L 362 82"
          stroke="hsl(201 90% 58%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.7"
        />

        {/* === ACTIVITY NODES: Anchored at intersections === */}
        
        {/* Node 1 - Start point (Walking - soft green) */}
        <circle cx="30" cy="240" r="10" fill="hsl(80 25% 80%)" opacity="0.3" />
        <circle cx="30" cy="240" r="6" fill="hsl(80 30% 70%)" opacity="0.5" />
        <circle cx="30" cy="240" r="3" fill="hsl(80 35% 60%)" opacity="0.8" />
        
        {/* Node 2 - Near first intersection (Hydration - primary blue) */}
        <circle cx="80" cy="200" r="8" fill="hsl(201 70% 80%)" opacity="0.25" />
        <circle cx="80" cy="200" r="5" fill="hsl(201 80% 70%)" opacity="0.5" />
        <circle cx="80" cy="200" r="2.5" fill="hsl(201 90% 58%)" opacity="0.8" />
        
        {/* Node 3 - Mid intersection (Sleep - lavender) */}
        <circle cx="165" cy="155" r="9" fill="hsl(270 50% 85%)" opacity="0.25" />
        <circle cx="165" cy="155" r="5.5" fill="hsl(270 55% 78%)" opacity="0.45" />
        <circle cx="165" cy="155" r="3" fill="hsl(270 60% 70%)" opacity="0.7" />
        
        {/* Node 4 - Upper intersection (Stretching - orange) */}
        <circle cx="240" cy="120" r="7" fill="hsl(32 60% 78%)" opacity="0.25" />
        <circle cx="240" cy="120" r="4" fill="hsl(32 65% 68%)" opacity="0.5" />
        <circle cx="240" cy="120" r="2" fill="hsl(32 70% 58%)" opacity="0.75" />
        
        {/* Node 5 - Near end (Mindfulness - soft yellow) */}
        <circle cx="320" cy="85" r="8" fill="hsl(43 60% 85%)" opacity="0.25" />
        <circle cx="320" cy="85" r="5" fill="hsl(43 65% 78%)" opacity="0.45" />
        <circle cx="320" cy="85" r="2.5" fill="hsl(43 70% 70%)" opacity="0.7" />
        
        {/* End point marker */}
        <circle cx="370" cy="70" r="6" fill="hsl(201 90% 73%)" opacity="0.3" />
        <circle cx="370" cy="70" r="3.5" fill="hsl(201 90% 58%)" opacity="0.7" />
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
