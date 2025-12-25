import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background font-['Source_Sans_3',sans-serif] relative">
      {/* Subtle blue fade at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(var(--primary) / 0.04), transparent)'
        }}
      />

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 py-6">
        {/* Logo */}
        <span className="text-xl font-medium text-foreground tracking-tight">
          Wellora
        </span>

        {/* CTA */}
        <Link to="/auth">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground hover:bg-transparent font-normal"
          >
            Explore the app
          </Button>
        </Link>
      </header>

      {/* Hero Content */}
      <main className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Headline */}
          <h1 className="text-[2.5rem] md:text-[3.25rem] font-semibold text-foreground leading-tight max-w-3xl">
            A <span className="text-primary">calmer</span> way to notice how your days are flowing
          </h1>

          {/* Subheadline */}
          <p className="text-[1.2rem] text-muted-foreground font-normal leading-relaxed max-w-xl">
            Wellora helps you gently track activity and rest, so patterns become visible over time - without pressure or noise.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col items-center space-y-3 pt-4">
            <Link to="/auth">
              <Button 
                className="bg-primary text-white hover:bg-primary/90 px-8 py-3 h-auto text-base font-medium rounded-lg"
              >
                Explore the app
              </Button>
            </Link>

            {/* Micro-copy */}
            <span className="text-sm text-muted-foreground/70 font-normal">
              No credit card. Just clarity.
            </span>
          </div>
        </div>
      </main>

      {/* Validation Section */}
      <section className="max-w-2xl mx-auto px-6 py-24 md:py-32">
        <div className="text-left space-y-8">
          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
            Most wellness tools don't fail - they just ask too much
          </h2>

          {/* Body copy */}
          <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              You try to log everything.<br />
              Steps, sleep, water, moods, goals.
            </p>

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
    </div>
  );
};

export default LandingPage;
