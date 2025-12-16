import { Leaf } from "lucide-react";
import { motion } from "motion/react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <motion.div 
        className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center"
        whileHover={{ rotate: 720 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Leaf className="w-6 h-6 text-white" />
      </motion.div>
      <span className="hidden md:block text-xl font-semibold text-foreground">EraSwap</span>
    </div>
  );
}