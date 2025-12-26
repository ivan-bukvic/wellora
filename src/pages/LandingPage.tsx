import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroAmbient from "@/assets/hero-ambient.jpg";

const LandingPage = () => {
  return <div className="min-h-screen bg-background font-['Source_Sans_3',sans-serif] relative">
      {/* Hero ambient background - subtle diagonal fade */}
      <div 
        className="absolute top-0 left-0 right-0 h-[80vh] pointer-events-none overflow-hidden"
        style={{
          background: `url(${heroAmbient}) top left / cover no-repeat`,
          opacity: 0.08,
          filter: 'blur(2px) saturate(0.4)',
          maskImage: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 70%)',
        }}
      />
      
      {/* Subtle blue fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none" style={{
      background: 'linear-gradient(to top, hsl(var(--primary) / 0.04), transparent)'
    }} />

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 py-6">
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

      {/* Hero Content */}
      <main className="max-w-5xl mx-auto px-6 pt-24 md:pt-32 pb-24">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Headline */}
          <h1 className="text-[2.875rem] md:text-[3.74rem] font-semibold text-foreground leading-tight max-w-3xl">
            A <span className="text-primary">calmer</span> way to notice how your days are flowing
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
          <p className="text-muted-foreground/70 text-[1.55rem] font-normal pt-16 md:pt-20 pb-24 md:pb-32">
            <span>Informed by behavioural psychology</span>
            <span className="mx-2">·</span>
            <span className="italic">Gentle by design.</span>
          </p>
        </div>
      </main>

      {/* Validation Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 md:pt-20 md:pb-32">
        <div className="text-left space-y-8">
          {/* Headline */}
          <h2 className="text-[1.73rem] md:text-[2.16rem] font-medium text-foreground leading-tight">
            Most wellness tools don't fail - they just ask too much
          </h2>

          {/* Body copy */}
          <div className="space-y-6 text-muted-foreground text-[1.15rem] md:text-[1.3rem] leading-relaxed">
            <p>
              You try to log everything.<br />
              Steps, sleep, water, moods, goals.
            </p>
          </div>

          {/* Comparison */}
          <div className="pt-10 pb-4">
            {/* Framing label */}
            <span className="text-[0.86rem] uppercase tracking-widest text-muted-foreground/60 mb-6 block">
              A different approach
            </span>

            {/* Two-column grid with flow marker */}
            <div className="grid grid-cols-1 md:grid-cols-2 relative">
              {/* Subtle vertical flow marker between columns */}
              <svg className="hidden md:block absolute left-1/2 -top-2 -translate-x-1/2 h-[calc(100%+1rem)] w-4" viewBox="0 0 16 200" preserveAspectRatio="none" fill="none">
                <path d="M8 0 C 9 50, 7 100, 8 150 C 9 175, 7 190, 8 200" stroke="hsl(var(--primary) / 0.17)" strokeWidth="1" strokeLinecap="round" />
              </svg>

              {/* Left column */}
              <div className="py-6 pr-10">
                <h3 className="text-[1.44rem] md:text-[1.55rem] font-semibold text-foreground/90 mb-5">
                  What most wellness tools ask
                </h3>
                <div className="space-y-5 text-muted-foreground text-[1.15rem] md:text-[1.3rem] leading-relaxed">
                  <p>Track everything, every day</p>
                  <p>Compete with streaks and scores</p>
                  <p>Optimise toward a number</p>
                </div>
              </div>

              {/* Right column */}
              <div className="py-6 pl-10">
                <h3 className="text-[1.44rem] md:text-[1.55rem] font-semibold text-foreground/90 mb-5">
                  What Wellora does instead
                </h3>
                <div className="space-y-5 text-muted-foreground text-[1.15rem] md:text-[1.3rem] leading-relaxed">
                  <p>Log what feels natural</p>
                  <p>Notice patterns over time</p>
                  <p>Reflect without pressure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining body copy */}
          <div className="space-y-6 text-muted-foreground text-[1.15rem] md:text-[1.3rem] leading-relaxed">
            <p>
              Over time, it starts to feel like work - more numbers, more reminders, more pressure.
            </p>

            <p>
              What's often missing isn't motivation or discipline.<br />
              It's a simple way to see how activity and rest actually relate in everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 md:pt-20 md:pb-32">
        <div className="text-left space-y-10">
          {/* Eyebrow */}
          <span className="text-[1rem] text-muted-foreground/70 uppercase tracking-wide">
            How it works
          </span>

          {/* Headline */}
          <h2 className="text-[1.73rem] md:text-[2.16rem] font-medium text-foreground leading-tight">
            A simple way to understand your rhythm
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