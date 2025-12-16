import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export function AnimatedButton({ children, variant = "primary", onClick, className = "" }: AnimatedButtonProps) {
  const baseStyles = variant === "primary"
    ? "bg-primary text-white hover:bg-primary/90"
    : "bg-white text-foreground hover:bg-gray-50 border border-gray-200";

  return (
    <motion.button
      onClick={onClick}
      className={`px-8 py-4 rounded-lg transition-all shadow-md relative overflow-hidden ${baseStyles} ${className}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
