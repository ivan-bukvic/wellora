import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WordCycle from "@/components/landing/WordCycle";
import heroStones from "@/assets/hero-stones.jpg";
import laurelWreath from "@/assets/laurel-wreath.png";
import welloraLogo from "@/assets/wellora-logo.svg";
import howItWorksLogHero from "@/assets/how-it-works-log-hero.png";
import howItWorksNotice from "@/assets/how-it-works-notice.png";
import howItWorksReflect from "@/assets/how-it-works-reflect.png";
import { Pencil, Eye, Sparkles } from "lucide-react";

const LandingPage = () => {
  // Scroll animation for comparison cards - asymmetric reveal
  const leftCardRef = useRef<HTMLDivElement>(null);
  const comparisonSectionRef = useRef<HTMLDivElement>(null);
  const [leftCardVisible, setLeftCardVisible] = useState(false);
  const [rightCardVisible, setRightCardVisible] = useState(false);

  // Left card observer - triggers at 22% visibility (early reveal)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !leftCardVisible) {
            setLeftCardVisible(true);
          }
        });
      },
      { threshold: 0.22 }
    );

    if (leftCardRef.current) {
      observer.observe(leftCardRef.current);
    }

    return () => observer.disconnect();
  }, [leftCardVisible]);

  // Right card observer - triggers when 100% of section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !rightCardVisible) {
            setRightCardVisible(true);
          }
        });
      },
      { threshold: 1.0 }
    );

    if (comparisonSectionRef.current) {
      observer.observe(comparisonSectionRef.current);
    }

    return () => observer.disconnect();
  }, [rightCardVisible]);
  return <div className="min-h-screen bg-background font-['Source_Sans_3',sans-serif] relative">
      {/* Subtle blue fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none" style={{
      background: 'linear-gradient(to top, hsl(var(--primary) / 0.04), transparent)'
    }} />

      {/* Header - transparent, floats over hero */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 py-6 relative z-20 bg-transparent">
        {/* Logo */}
        <span className="text-[1.44rem] font-medium text-foreground tracking-tight">
          Wellora
        </span>

        {/* CTA */}
        <Link to="/auth">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-transparent font-normal">
            Explore the app
          </Button>
        </Link>
      </header>

      {/* Hero Section - extends behind header */}
      <section className="relative overflow-hidden pt-[60px] -mt-[60px]">
        {/* Top fade overlay - white dissolving into hero */}
        <div className="absolute top-0 left-0 right-0 h-[80px] z-10 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)'
      }} />
        {/* Ambient stones - positioned in true negative space, outside content wrapper */}
        <div className="absolute pointer-events-none hidden md:block z-0" style={{
        right: '-8%',
        bottom: '100px',
        width: '72%',
        height: '100%'
      }}>
          <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroStones})`,
          backgroundPosition: 'right top',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.32,
          filter: 'saturate(0.6) contrast(0.9)',
          // Layered directional fades: left (strong), right (seamless to corner), bottom (strong), top (subtle)
          maskImage: `
                linear-gradient(to right, transparent 0%, black 35%),
                linear-gradient(to left, transparent 0%, black 20%),
                linear-gradient(to top, transparent 0%, transparent 5%, black 40%),
                linear-gradient(to bottom, transparent 0%, black 20%)
              `,
          maskComposite: 'intersect',
          WebkitMaskImage: `
                linear-gradient(to right, transparent 0%, black 35%),
                linear-gradient(to left, transparent 0%, black 20%),
                linear-gradient(to top, transparent 0%, transparent 5%, black 40%),
                linear-gradient(to bottom, transparent 0%, black 20%)
              `,
          WebkitMaskComposite: 'source-in'
        }} />
        </div>

        {/* Hero Content - separate from image, maintains its own margins */}
        <main className="max-w-5xl mx-auto px-6 pt-24 md:pt-32 pb-0 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Headline */}
            <h1 className="text-[3.15rem] md:text-[4.1rem] font-semibold text-foreground leading-tight max-w-3xl">
              A <WordCycle /> way to notice how your days are flowing
            </h1>

            {/* Subheadline */}
            <p className="text-[1.38rem] text-muted-foreground font-normal leading-relaxed max-w-xl">
              Wellora helps you gently track activity and rest, so patterns become visible over time - without pressure or noise.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col items-center pt-2">
              <Link to="/auth">
                <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-3 h-auto text-[1.15rem] font-medium rounded-lg">
                  Explore the app
                </Button>
              </Link>
            </div>

            {/* Micro-copy */}
            <p className="text-muted-foreground/70 text-[1.55rem] font-normal pt-16 md:pt-20">
              <span>Informed by behavioural psychology</span>
              <span className="mx-2">·</span>
              <span className="italic">Gentle by design.</span>
            </p>

            {/* Validation Badge */}
            <div className="relative inline-flex items-center justify-center pt-3 pb-8 md:pb-10">
              {/* Text overlaid on laurel */}
              <p className="absolute left-1/2 -translate-x-1/2 top-[34px] z-10 text-muted-foreground text-[0.9rem] font-medium tracking-wide text-center leading-tight">
                Scientifically<br />Validated
              </p>
              {/* Laurel as base layer */}
              <img src={laurelWreath} alt="Laurel wreath" className="w-[150px] h-auto mt-[25px]" style={{
              opacity: 0.75,
              filter: 'brightness(0) saturate(100%) invert(88%) sepia(25%) saturate(500%) hue-rotate(335deg) brightness(1.02)'
            }} />
            </div>
          </div>
        </main>
      </section>

      {/* The Pattern Section - Exhale Typography */}
      <section className="max-w-[1164px] mx-auto px-6 pt-[30px] pb-10 md:pt-[30px] md:pb-12 relative">
        {/* Ambient background blob */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none opacity-[0.06]" style={{
        background: 'radial-gradient(ellipse at center, hsl(var(--primary)) 0%, transparent 70%)'
      }} />
        
        {/* Eyebrow label */}
        <span className="text-[1rem] uppercase tracking-wide text-primary mb-6 block">
          The pattern
        </span>
        
        {/* Headline with decorative flow */}
        <div className="relative mb-10">
          {/* Decorative curved line */}
          
        <h2 className="text-[2rem] md:text-[2.6rem] leading-[1.15] font-semibold text-foreground">
          <span className="text-foreground">Most wellness tools don't fail</span>
          <span className="text-foreground"> - they just ask too much</span>
        </h2>
        </div>
        
        {/* The Pressure block - tight, compressed, claustrophobic */}
        <div className="pl-5 border-l-2 border-primary/20 space-y-1.5 text-[1.05rem] md:text-[1.15rem] leading-[1.45] text-foreground/75">
          <p>You try to log everything.</p>
          <p>Steps, sleep, water, moods, goals.</p>
          <p>Over time, it starts to feel like work - more numbers, more reminders, more pressure.</p>
        </div>
        
        {/* Breath marker - visual pause */}
        <div className="flex items-center justify-start gap-2.5 py-10 pl-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/15"></span>
        </div>
        
        {/* The Release block - spacious, airy, open */}
        <div className="space-y-2 text-[1.25rem] md:text-[1.4rem] leading-[1.85] text-muted-foreground/75 tracking-[0.005em]">
          <p>What's often missing isn't motivation or discipline.</p>
          <p>It's a simple way to see how activity and rest actually relate in everyday life.</p>
        </div>
        
        {/* The Invitation - Wellora line with soft highlight */}
        <div className="mt-3">
          <p className="text-[1.3rem] md:text-[1.45rem] leading-[1.75] text-foreground/80 font-medium">
            And that's where <span className="text-primary font-semibold">Wellora</span> comes in - 
            offering a quieter, more supportive way to notice those patterns.
          </p>
        </div>

        {/* A Different Approach - Creative Typography Section */}
        <div className="pt-12 mt-8 relative">
          {/* Decorative accent blob */}
          <div className="absolute -left-20 top-1/4 w-[300px] h-[200px] pointer-events-none opacity-[0.04] hidden md:block" style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--primary)) 0%, transparent 70%)'
        }} />

          {/* Eyebrow with accent bar */}
          <div className="flex items-center gap-3 mb-10">
            
            <span className="text-[1rem] uppercase tracking-wide text-primary font-medium">
              A different approach
            </span>
          </div>

          {/* Main headline with mixed typography */}
          <div className="mb-12">
            <h2 className="text-[2rem] md:text-[2.6rem] leading-[1.15] font-semibold text-foreground">
              Less tracking,
              <br />
              <span className="font-['Playfair_Display',serif] italic text-primary/80 font-normal">
                more understanding
              </span>
            </h2>
          </div>

          {/* Two comparison cards - vertical stack layout */}
          <div ref={comparisonSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12">
            
            {/* Left card - "The Old Way" */}
            <div 
              ref={leftCardRef}
              className="group relative flex flex-col p-6 md:p-8 rounded-xl border border-border/40 bg-gradient-to-br from-muted/30 to-transparent backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:border-border/60"
              style={{
                opacity: leftCardVisible ? 1 : 0,
                transform: leftCardVisible ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 900ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)',
              }}
            >
              {/* Subtle corner accent - soft gradient glow */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-foreground/[0.02] to-transparent rounded-tl-xl blur-sm" />
              
              {/* Light streak decoration */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -top-1/2 -left-1/2 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent rotate-45" />
              </div>
              
              {/* Centered Title - single line */}
              <div className="text-center mb-6">
                <h3 className="font-['Source_Sans_3',sans-serif] text-[1.5rem] md:text-[1.75rem] font-semibold text-foreground/70 leading-tight">
                  What most wellness tools ask
                </h3>
              </div>
              
              {/* Separator line */}
              <div className="flex justify-center mb-6">
                <div className="w-[65%] h-px bg-border/50" />
              </div>
              
              {/* Left-aligned bullet list */}
              <div className="pl-4 md:pl-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-[1.15rem] md:text-[1.3rem] text-foreground/70 leading-relaxed">
                    <span className="text-foreground/50 mt-0.5 text-xl">·</span>
                    <span>Track everything, every day</span>
                  </li>
                  <li className="flex items-start gap-3 text-[1.15rem] md:text-[1.3rem] text-foreground/70 leading-relaxed">
                    <span className="text-foreground/50 mt-0.5 text-xl">·</span>
                    <span>Compete with streaks and scores</span>
                  </li>
                  <li className="flex items-start gap-3 text-[1.15rem] md:text-[1.3rem] text-foreground/70 leading-relaxed">
                    <span className="text-foreground/50 mt-0.5 text-xl">·</span>
                    <span>Optimise toward a number</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right card - "The Wellora Way" */}
            <div 
              className="group relative flex flex-col p-6 md:p-8 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] to-transparent backdrop-blur-md transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:border-primary/40"
              style={{
                opacity: rightCardVisible ? 1 : 0,
                transform: rightCardVisible ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 1300ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 1300ms cubic-bezier(0.22, 0.61, 0.36, 1)',
              }}
            >
              {/* Ambient glow behind card */}
              <div className="absolute -inset-3 bg-primary/[0.08] rounded-2xl blur-2xl animate-breathe pointer-events-none" />
              
              {/* Inner glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02] rounded-xl pointer-events-none" />
              
              {/* Subtle corner accent - soft gradient glow with brand color */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/[0.12] to-transparent rounded-tl-xl blur-md" />
              
              {/* Light streak decoration */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-primary/[0.04] to-transparent rotate-45 group-hover:via-primary/[0.08] transition-all duration-500" />
              </div>
              
              {/* Subtle background logo - brand anchor */}
              <img src={welloraLogo} alt="" aria-hidden="true" className="absolute bottom-4 right-4 w-24 md:w-32 opacity-[0.08] rotate-[3deg] pointer-events-none select-none brightness-0 invert" style={{
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
            }} />
              
              {/* Centered Title - single line */}
              <div className="relative text-center mb-6">
                <h3 className="font-['Source_Sans_3',sans-serif] text-[1.55rem] md:text-[1.8rem] font-semibold text-primary leading-tight">
                  What Wellora does instead
                </h3>
              </div>
              
              {/* Separator line */}
              <div className="relative flex justify-center mb-6">
                <div className="w-[65%] h-px bg-primary/25" />
              </div>
              
              {/* Left-aligned bullet list */}
              <div className="relative pl-4 md:pl-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-[1.2rem] md:text-[1.35rem] text-foreground/80 leading-relaxed">
                    <span className="text-primary/50 mt-0.5 text-xl">·</span>
                    <span><span className="text-primary">Log</span> what feels natural</span>
                  </li>
                  <li className="flex items-start gap-3 text-[1.2rem] md:text-[1.35rem] text-foreground/80 leading-relaxed">
                    <span className="text-primary/50 mt-0.5 text-xl">·</span>
                    <span><span className="text-primary">Notice</span> patterns over time</span>
                  </li>
                  <li className="flex items-start gap-3 text-[1.2rem] md:text-[1.35rem] text-foreground/80 leading-relaxed">
                    <span className="text-primary/50 mt-0.5 text-xl">·</span>
                    <span><span className="text-primary">Reflect</span> without pressure</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Breath markers below each card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 pb-2">
            {/* Left card dots - neutral foreground */}
            <div className="flex items-center justify-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/50"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/[0.44]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/[0.38]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/[0.32]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/[0.26]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/20"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/[0.14]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/[0.08]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/[0.03]"></span>
            </div>

            {/* Right card dots - primary blue */}
            <div className="flex items-center justify-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/[0.44]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/[0.38]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/[0.32]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/[0.26]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/[0.14]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/[0.08]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/[0.03]"></span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        {/* Section Header - keeps current width */}
        <div className="max-w-[1164px] mx-auto px-6">
          <div className="pt-16 md:pt-24 pb-8 md:pb-12">
            {/* Eyebrow */}
            <span className="text-[1rem] text-primary uppercase tracking-wide font-medium block mb-6">
              How it works
            </span>

            {/* Headline */}
            <h2 className="text-[2rem] md:text-[2.6rem] font-semibold text-foreground leading-tight">
              A simple way to understand your{' '}
              <span className="font-['Playfair_Display',serif] italic text-primary/80 font-normal">
                rhythm
              </span>
            </h2>
          </div>
        </div>

        {/* Steps Container - breaks out of parent constraints */}
        <div className="w-full relative">
          <div className="max-w-[1560px] mx-auto px-8 md:px-12 lg:px-16 relative">
            {/* Continuous vertical rail */}
            <div className="absolute left-[calc(24px+3rem)] lg:left-[calc(24px+4rem)] w-0.5 bg-primary/30 hidden md:block" style={{
            transform: 'translateX(-50%)',
            top: '0',
            bottom: '6rem'
          }} />

          {/* Step 1: Log Activity */}
          <div className="min-h-[60vh] md:min-h-[75vh] flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-[48px_1fr_50%] gap-8 md:gap-0 items-center w-full">
              {/* Column 1: Circle */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-primary" />
                </div>
              </div>
              {/* Column 2: Text */}
              <div className="md:pl-[80px]">
                <div className="flex items-center gap-5 md:block">
                  <div className="md:hidden relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                      Log activity
                    </h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Record a few everyday signals - activity, rest, movement, sleep. Nothing exhaustive. Nothing mandatory.
                    </p>
                  </div>
                </div>
              </div>
              {/* Column 3: Screenshot with decorative frames */}
              <div className="hidden md:block relative">
                {/* Frame 1: Primary blue, offset top-right */}
                <div className="absolute rounded-xl border-2 border-primary/40 pointer-events-none" style={{
                  top: '-12px',
                  right: '-12px',
                  width: '100%',
                  height: '100%',
                  maxWidth: '416px',
                  marginLeft: 'auto'
                }} />
                {/* Frame 2: Faded primary blue, offset bottom-left */}
                <div className="absolute rounded-xl border-2 border-primary/20 pointer-events-none" style={{
                  top: '12px',
                  right: '12px',
                  width: '100%',
                  height: '100%',
                  maxWidth: '416px',
                  marginLeft: 'auto'
                }} />
                {/* Actual screenshot */}
                <img src={howItWorksLogHero} alt="Log activity interface" className="relative z-10 rounded-xl shadow-lg w-full max-w-[416px] ml-auto" />
              </div>
            </div>
          </div>

          {/* Step 2: Notice Patterns - Flipped layout (screenshot left, text right) */}
          <div className="min-h-[60vh] md:min-h-[75vh] flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-[48px_1fr] gap-8 md:gap-0 items-center w-full">
              {/* Column 1: Circle - fixed position */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
              </div>
              {/* Column 2: Content wrapper (screenshot + text) - flipped order */}
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 md:pl-[80px]">
                {/* Screenshot first (left side on desktop) */}
                <div className="hidden md:block relative md:w-[55%]">
                  {/* Frame 1: Primary blue, offset top-left (mirrored) */}
                  <div className="absolute rounded-xl border-2 border-primary/40 pointer-events-none" style={{
                    top: '-12px',
                    left: '-12px',
                    width: '100%',
                    height: '100%',
                    maxWidth: '624px',
                    marginRight: 'auto'
                  }} />
                  {/* Frame 2: Faded primary blue, offset bottom-right (mirrored) */}
                  <div className="absolute rounded-xl border-2 border-primary/20 pointer-events-none" style={{
                    top: '12px',
                    left: '12px',
                    width: '100%',
                    height: '100%',
                    maxWidth: '624px',
                    marginRight: 'auto'
                  }} />
                  {/* Actual screenshot */}
                  <img src={howItWorksNotice} alt="Pattern recognition interface" className="relative z-10 rounded-xl shadow-lg w-full max-w-[624px] mr-auto" />
                </div>
                {/* Text second (right side on desktop) */}
                <div className="md:w-[45%] md:pl-[40px]">
                  <div className="flex items-center gap-5 md:block">
                    <div className="md:hidden relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                        Notice patterns
                      </h3>
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Over time, patterns begin to appear. Not charts to optimise - just relationships you can recognise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Reflect Over Time */}
          <div className="min-h-[60vh] md:min-h-[75vh] flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-[48px_1fr_55%] gap-8 md:gap-0 items-center w-full">
              {/* Column 1: Circle */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
              </div>
              {/* Column 2: Text */}
              <div className="md:pl-[80px]">
                <div className="flex items-center gap-5 md:block">
                  <div className="md:hidden relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                      Reflect over time
                    </h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      A weekly summary with gentle AI insights. Nothing loud. Just enough to support what's working.
                    </p>
                  </div>
                </div>
              </div>
              {/* Column 3: Screenshot with decorative frames */}
              <div className="hidden md:block relative">
                {/* Frame 1: Primary blue, offset top-right */}
                <div className="absolute rounded-xl border-2 border-primary/40 pointer-events-none" style={{
                  top: '-12px',
                  right: '-12px',
                  width: '100%',
                  height: '100%',
                  maxWidth: '624px',
                  marginLeft: 'auto'
                }} />
                {/* Frame 2: Faded primary blue, offset bottom-left */}
                <div className="absolute rounded-xl border-2 border-primary/20 pointer-events-none" style={{
                  top: '12px',
                  right: '12px',
                  width: '100%',
                  height: '100%',
                  maxWidth: '624px',
                  marginLeft: 'auto'
                }} />
                {/* Actual screenshot */}
                <img src={howItWorksReflect} alt="Reflection and insights interface" className="relative z-10 rounded-xl shadow-lg w-full max-w-[624px] ml-auto" />
              </div>
            </div>
          </div>

          {/* Closing line */}
          
        </div>
        </div>
      </section>
    </div>;
};
export default LandingPage;