import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}

// Fades and lifts its children in the first time they scroll into view
const Reveal = ({ children, delay = 0, className, as = "div" }: RevealProps) => {
  const reduceMotion = useReducedMotion();
  const Tag = as;
  const MotionTag = motion[as];

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
