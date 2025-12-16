import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  highlighted?: boolean;
  bgColor?: string;
  headerPosition?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
}

export function Section({ id, title, children, highlighted = false, bgColor = "bg-white" }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Animate header from left (0%) to right (100%) based on scroll progress through the section
  const headerPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.7, 1, 1, 0.7]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.95, 1, 1, 0.95]
  );

  return (
    <section ref={ref} id={id} className={`${bgColor} dark:bg-gray-950 scroll-mt-16 relative min-h-screen transition-colors duration-300`}>
      {/* Sticky header container */}
      <div className="sticky top-16 z-40 py-4">
        <div className="container mx-auto px-4">
          <div className="relative h-16 flex items-center">
            <motion.div 
              className="absolute inset-0 flex items-center"
              style={{ opacity, scale }}
            >
              {/* Full width line container */}
              <div className="w-full h-0.5 relative flex items-center">
                {/* Background line */}
                <div className={`absolute inset-0 ${highlighted ? "bg-primary/20" : "bg-muted-foreground/20"}`} />
                
                {/* Active line (left side) */}
                <motion.div 
                  className={`absolute left-0 h-full ${highlighted ? "bg-primary" : "bg-muted-foreground/40"}`}
                  style={{ 
                    width: headerPosition,
                  }}
                />
              </div>
              
              {/* Header badge - moves from left to right */}
              <motion.div
                className="absolute flex items-center pointer-events-auto"
                style={{ 
                  left: headerPosition,
                  x: "-50%"
                }}
              >
                <motion.div
                  className={`px-8 py-3 rounded-lg whitespace-nowrap ${
                    highlighted 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg border-2 border-primary/30" 
                      : "bg-white dark:bg-primary/90 text-foreground dark:text-white shadow-xl border-2 border-gray-200 dark:border-primary/50"
                  } relative overflow-hidden`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Animated shimmer effect */}
                  {highlighted && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  
                  <span className="relative z-10 text-xl">{title}</span>
                  
                  {/* Arrow indicator */}
                  <motion.div 
                    className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${
                      highlighted ? "border-t-accent" : "border-t-white dark:border-t-primary"
                    }`}
                    animate={{ 
                      y: [0, 3, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Section content */}
      <div className="relative">
        {children}
      </div>
    </section>
  );
}