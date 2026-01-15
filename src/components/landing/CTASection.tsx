import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section className="max-w-[1164px] mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
      <div
        ref={sectionRef}
        className="relative rounded-2xl md:rounded-3xl overflow-hidden"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        }}
      >
        {/* Subtle gradient background */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.10) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
              linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 60%)
            `,
          }}
        />
        
        {/* Soft border */}
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-primary/15 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-12 md:px-16 md:py-20 text-center">
          {/* Headline */}
          <h2 className="text-xl sm:text-2xl md:text-[2.2rem] lg:text-[2.8rem] font-medium text-primary/80 font-['Playfair_Display',serif] italic leading-tight mb-4 md:mb-5">
            A gentler way to notice your days
          </h2>

          {/* Supporting text */}
          <p className="text-sm sm:text-base md:text-[1.1rem] lg:text-[1.25rem] text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10">
            Wellora helps you reflect on activity and rest so patterns can emerge naturally, without pressure or noise.
          </p>

          {/* CTA Button */}
          <Link to="/auth?mode=signup" className="inline-block w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 px-8 md:px-10 py-3 md:py-3.5 h-auto text-base md:text-[1.1rem] font-medium rounded-xl transition-colors duration-300 min-h-[48px]"
            >
              Explore the app
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
