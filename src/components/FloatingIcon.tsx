import { motion } from "motion/react";
import { ReactNode } from "react";

interface FloatingIconProps {
  children: ReactNode;
  delay?: number;
}

export function FloatingIcon({ children, delay = 0 }: FloatingIconProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
