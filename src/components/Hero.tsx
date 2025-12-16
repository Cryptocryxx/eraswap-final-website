import { ArrowRight, Sparkles, Download } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedBackground } from "./AnimatedBackground";
import { AnimatedButton } from "./AnimatedButton";
import { ParticleBackground } from "./ParticleBackground";
import { GradientText } from "./GradientText";
import { useRouter } from "../contexts/RouterContext";

export function Hero() {
  const { navigate } = useRouter();
  
  const handleScrollToApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector('#the-app');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-16 pb-16 relative overflow-hidden transition-colors duration-300">
      <AnimatedBackground />
      <ParticleBackground />
      
      {/* Decorative circles */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center gap-8 max-w-5xl mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Sustainable Living Made Easy</span>
          </motion.div>
          
          <motion.h1 
            className="text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-3xl md:text-4xl lg:text-5xl mb-2">
              Move In Smart. Move Out Sustainable
            </div>
            <div className="text-4xl md:text-5xl lg:text-6xl">
              <GradientText>EraSwap</GradientText>
            </div>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect with students leaving their apartments and discover quality furniture waiting for a new home. 
            Save money, reduce waste, and build a sustainable community.
          </motion.p>
          
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AnimatedButton variant="primary" onClick={() => navigate('download')}>
              <Download className="w-5 h-5" />
              Download Now
            </AnimatedButton>
            <AnimatedButton variant="secondary" onClick={handleScrollToApp}>
              How It Works
            </AnimatedButton>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {[
              { value: "15K+", label: "Users" },
              { value: "8.5K+", label: "Items" },
              { value: "78%", label: "CO₂ Saved" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="text-2xl font-semibold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}