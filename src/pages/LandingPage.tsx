import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroStones from "@/assets/hero-stones.jpg";
import laurelWreath from "@/assets/laurel-wreath.png";
const LandingPage = () => {
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
              A <span className="font-['Playfair_Display',serif] italic text-primary/80 font-normal">calmer</span> way to notice how your days are flowing
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
      <section className="max-w-5xl mx-auto px-6 pt-[30px] pb-24 md:pt-[30px] md:pb-32 relative">
        {/* Ambient background blob */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none opacity-[0.06]" style={{
        background: 'radial-gradient(ellipse at center, hsl(var(--primary)) 0%, transparent 70%)'
      }} />
        
        {/* Eyebrow label */}
        <span className="text-[0.75rem] uppercase tracking-[0.25em] text-primary mb-6 block">
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
        <div className="space-y-4 text-[1.25rem] md:text-[1.4rem] leading-[1.85] text-muted-foreground/75 tracking-[0.005em]">
          <p>What's often missing isn't motivation or discipline.</p>
          <p>It's a simple way to see how activity and rest actually relate in everyday life.</p>
        </div>
        
        {/* The Invitation - Wellora line with soft highlight */}
        <div className="mt-5">
          <p className="text-[1.3rem] md:text-[1.45rem] leading-[1.75] text-foreground/80 font-medium">
            And that's where <span className="text-primary font-semibold">Wellora</span> comes in - 
            offering a quieter, more supportive way to notice those patterns.
          </p>
        </div>

        {/* A Different Approach - Creative Typography Section */}
        <div className="pt-20 mt-12 relative">
          {/* Decorative accent blob */}
          <div className="absolute -left-20 top-1/4 w-[300px] h-[200px] pointer-events-none opacity-[0.04] hidden md:block" style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--primary)) 0%, transparent 70%)'
        }} />

          {/* Eyebrow with accent bar */}
          <div className="flex items-center gap-3 mb-10">
            
            <span className="text-[0.8rem] uppercase tracking-[0.2em] text-primary font-medium">
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

          {/* Divider line */}
          <div className="w-full h-px bg-gradient-to-r from-border via-border/60 to-transparent mb-12"></div>

          {/* Two columns with visual contrast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            
            {/* Left column - "The Old Way" */}
            <div className="space-y-6">
              <h3 className="text-[1.35rem] md:text-[1.5rem] font-semibold text-foreground/80 tracking-tight">
                What most wellness tools ask
              </h3>
              <ul className="space-y-4 pl-1">
                <li className="flex items-start gap-3 text-[1.1rem] md:text-[1.2rem] text-muted-foreground/70 leading-relaxed">
                  <span className="text-muted-foreground/40 mt-0.5">·</span>
                  <span>Track everything, every day</span>
                </li>
                <li className="flex items-start gap-3 text-[1.1rem] md:text-[1.2rem] text-muted-foreground/70 leading-relaxed">
                  <span className="text-muted-foreground/40 mt-0.5">·</span>
                  <span>Compete with streaks and scores</span>
                </li>
                <li className="flex items-start gap-3 text-[1.1rem] md:text-[1.2rem] text-muted-foreground/70 leading-relaxed">
                  <span className="text-muted-foreground/40 mt-0.5">·</span>
                  <span>Optimise toward a number</span>
                </li>
              </ul>
            </div>

            {/* Right column - "The Wellora Way" */}
            <div className="space-y-6 md:pl-8 md:border-l md:border-primary/20">
              <h3 className="text-[1.35rem] md:text-[1.5rem] font-semibold text-primary tracking-tight">
                What Wellora does instead
              </h3>
              <ul className="space-y-4 pl-1">
                <li className="flex items-start gap-3 text-[1.1rem] md:text-[1.2rem] text-foreground/75 leading-relaxed">
                  <span className="text-primary/60 mt-0.5">·</span>
                  <span><span className="text-primary">Log</span> what feels natural</span>
                </li>
                <li className="flex items-start gap-3 text-[1.1rem] md:text-[1.2rem] text-foreground/75 leading-relaxed">
                  <span className="text-primary/60 mt-0.5">·</span>
                  <span><span className="text-primary">Notice</span> patterns over time</span>
                </li>
                <li className="flex items-start gap-3 text-[1.1rem] md:text-[1.2rem] text-foreground/75 leading-relaxed">
                  <span className="text-primary/60 mt-0.5">·</span>
                  <span><span className="text-primary">Reflect</span> without pressure</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Breath marker - visual pause after comparison */}
          <div className="flex items-center justify-start gap-2.5 pt-16 pb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/10"></span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-6 pt-8 pb-24 md:pt-10 md:pb-32">
        <div className="text-left space-y-10">
          {/* Eyebrow */}
          <span className="text-[1rem] text-primary uppercase tracking-wide">
            How it works
          </span>

          {/* Headline */}
          <h2 className="text-[2rem] md:text-[2.6rem] font-medium text-foreground leading-tight">
            A simple way to understand your{' '}
            <span className="font-['Playfair_Display',serif] italic text-primary/80 font-normal">
              rhythm
            </span>
          </h2>

          {/* Body paragraphs */}
          <div className="space-y-8 text-muted-foreground text-[1.15rem] md:text-[1.3rem] leading-relaxed">
            <p>
              <span className="text-foreground font-medium">Log</span><br />
              You gently record a few everyday signals - activity, rest, movement, sleep.<br />
              Nothing exhaustive. Nothing mandatory.
            </p>

            <p>
              <span className="text-foreground font-medium">Notice</span><br />
              Over time, patterns begin to appear.<br />
              Not charts to optimise - just relationships you can recognise.
            </p>

            <p>
              <span className="text-foreground font-medium">Reflect</span><br />
              Wellora helps you look back and make sense of those patterns, quietly.<br />
              No scores. No streaks. No pressure.
            </p>
          </div>

          {/* Closing line */}
          <p className="text-[1rem] text-muted-foreground/70 pt-4">
            This is not about doing more. It's about seeing more clearly.
          </p>
        </div>
      </section>
    </div>;
};
export default LandingPage;