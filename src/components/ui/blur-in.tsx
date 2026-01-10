"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurInProps {
  word: string;
  className?: string;
  variant?: {
    hidden: { filter: string; opacity: number };
    visible: { filter: string; opacity: number };
  };
  duration?: number;
  delay?: number;
  inView?: boolean;
}

const BlurIn = ({ 
  word, 
  className, 
  variant, 
  duration = 1,
  delay = 0,
  inView = true 
}: BlurInProps) => {
  const defaultVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <motion.span
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration, delay }}
      variants={combinedVariants}
      className={cn(className)}
    >
      {word}
    </motion.span>
  );
};

export { BlurIn };
