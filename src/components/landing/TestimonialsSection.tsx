import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  stars?: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "Wellora helped me notice patterns without making me feel watched by my own data. I log when it feels natural, and over time things quietly start to make sense.",
    name: "Anna Kovačević",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    stars: 5,
  },
  {
    quote: "I have tried habit trackers before, but they always turned into pressure. This feels different. It feels like observing instead of judging.",
    name: "Mark Lewis",
    role: "Freelance Writer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    quote: "What surprised me most is how little I need to do for insights to appear. I am not chasing streaks anymore. I am just paying attention.",
    name: "Elena Rossi",
    role: "UX Researcher",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    stars: 5,
  },
  {
    quote: "Wellora fits into my day instead of reshaping it. I log a few things, reflect later, and that is enough. It feels respectful of my time.",
    name: "David Nguyen",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    quote: "Seeing activity and rest together changed how I think about balance. There is no score telling me I failed. Just context.",
    name: "Sophie Martin",
    role: "Wellness Coach",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    stars: 4,
  },
  {
    quote: "This is the first app that made me slow down instead of optimize. The insights feel gentle, not demanding.",
    name: "Jonas Weber",
    role: "Creative Strategist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Define varied heights for editorial feel
  const cardVariants = [
    "min-h-[280px]", // Card 1 - medium
    "min-h-[320px]", // Card 2 - tall
    "min-h-[260px]", // Card 3 - short
    "min-h-[300px]", // Card 4 - medium-tall
    "min-h-[270px]", // Card 5 - medium
    "min-h-[310px]", // Card 6 - tall
  ];

  return (
    <section ref={sectionRef} className="max-w-[1164px] mx-auto px-6 pt-16 md:pt-24 pb-16 md:pb-24">
      {/* Eyebrow */}
      <span className="text-[1rem] text-primary uppercase tracking-wide font-medium block mb-6">
        What people are saying
      </span>

      {/* Headline */}
      <h2 className="text-[2rem] md:text-[2.6rem] font-semibold text-foreground leading-tight mb-12 md:mb-16">
        Real experiences,{" "}
        <span className="font-['Playfair_Display',serif] italic text-primary/80 font-normal">
          quietly shared
        </span>
      </h2>

      {/* Testimonial Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.name}
            className={`
              group relative flex flex-col justify-between p-6 md:p-7
              rounded-2xl border border-border/40 bg-card
              shadow-sm hover:shadow-md transition-all duration-300
              hover:translate-y-[-2px] hover:border-border/60
              ${cardVariants[index]}
            `}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 700ms ease-out ${100 + index * 80}ms, transform 700ms ease-out ${100 + index * 80}ms`,
            }}
          >
            {/* Optional Stars */}
            {testimonial.stars && (
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-warm text-warm"
                  />
                ))}
              </div>
            )}

            {/* Quote */}
            <p className="text-[1.05rem] md:text-[1.1rem] leading-relaxed text-foreground/80 flex-1">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/30">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {testimonial.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[0.95rem] font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-[0.85rem] text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
