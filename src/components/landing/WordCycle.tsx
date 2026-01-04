import { useState, useEffect } from "react";

const words = ["calmer", "gentler", "quieter"];
const DISPLAY_DURATION = 4000; // 4 seconds per word
const FADE_DURATION = 1000; // 1 second crossfade

const WordCycle = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className="relative inline-block font-['Playfair_Display',serif] italic text-primary/80 font-medium text-[3.4rem] md:text-[4.4rem]"
      // Fixed dimensions prevent layout shift; margins for symmetric spacing; transform for optical lift
      style={{ width: "2.8em", height: "1.2em", marginLeft: "0.25em", marginRight: "0.25em", transform: "translateY(-1px)" }}
    >
      {words.map((word, index) => (
        <span
          key={word}
          className="absolute left-0 top-0 transition-opacity duration-1000 ease-linear"
          style={{
            opacity: index === activeIndex ? 1 : 0,
          }}
          aria-hidden={index !== activeIndex}
        >
          {word}
        </span>
      ))}
      {/* Invisible text for baseline alignment */}
      <span className="invisible">{words[0]}</span>
    </span>
  );
};

export default WordCycle;
