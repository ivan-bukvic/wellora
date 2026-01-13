import { useRef, useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Wellora?",
    answer:
      "Wellora is a gentle way to notice how activity, rest, and daily habits show up over time. It is designed for reflection, not optimization.",
  },
  {
    question: "Do I need to log everything every day?",
    answer:
      "No. You can log as little or as often as feels natural. There are no streaks, reminders, or penalties for skipping days.",
  },
  {
    question: "What kind of activities can I track?",
    answer:
      "You can track everyday signals like movement, rest, sleep, hydration, mindfulness, and anything else that feels meaningful to you.",
  },
  {
    question: "Does Wellora give scores or recommendations?",
    answer:
      "No. Wellora does not score your behavior or tell you what to improve. It helps patterns become visible so you can draw your own conclusions.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Your data is private and belongs to you. Wellora is designed with privacy and simplicity in mind.",
  },
  {
    question: "Is Wellora meant to replace other health apps?",
    answer:
      "Not necessarily. Wellora works well on its own or alongside other tools, offering a calmer, more reflective perspective.",
  },
];

const FAQSection = () => {
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

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="max-w-[1164px] mx-auto px-6 pt-16 md:pt-24 pb-16 md:pb-24"
    >
      {/* Eyebrow */}
      <span className="text-[1rem] text-primary uppercase tracking-wide font-medium block mb-6">
        Questions
      </span>

      {/* Headline */}
      <h2 className="text-[2rem] md:text-[2.6rem] font-semibold text-foreground leading-tight mb-4">
        Frequently asked{" "}
        <span className="font-['Playfair_Display',serif] italic text-primary/80 font-normal ml-[3px]">
          questions
        </span>
      </h2>

      {/* Subtitle */}
      <p className="text-[1.1rem] text-muted-foreground mb-12 md:mb-16">
        Everything you need to know about Wellora.
      </p>

      {/* FAQ Accordion */}
      <div
        className="max-w-3xl"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
        }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="group border border-border/40 rounded-xl px-6 py-1 bg-card hover:border-border/60 hover:bg-card/80 transition-all duration-300 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/[0.02]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 600ms ease-out ${100 + index * 60}ms, transform 600ms ease-out ${100 + index * 60}ms`,
              }}
            >
              <AccordionTrigger className="text-[1.05rem] md:text-[1.15rem] font-medium text-foreground hover:no-underline py-5 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-300">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[1rem] md:text-[1.05rem] text-muted-foreground leading-relaxed pb-5 pt-0">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
