import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

interface CountUpStatProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function CountUpStat({ value, suffix = "", duration = 2 }: CountUpStatProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!hasAnimated) {
      const controls = animate(count, value, {
        duration,
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });
      setHasAnimated(true);
      return controls.stop;
    }
  }, [hasAnimated, value, duration, count]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}
