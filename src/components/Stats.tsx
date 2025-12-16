import { TrendingDown, Users, Package, Leaf } from "lucide-react";
import { motion } from "motion/react";
import { CountUpStat } from "./CountUpStat";
import { FloatingIcon } from "./FloatingIcon";
import { InteractiveCard } from "./InteractiveCard";

export function Stats() {
  const stats = [
    {
      icon: TrendingDown,
      value: 2340,
      suffix: " tons",
      label: "Waste Prevented Annually",
      description: "Furniture waste diverted from landfills",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: Users,
      value: 15000,
      suffix: "+",
      label: "Active Students",
      description: "Contributing to sustainability",
      color: "from-blue-400 to-cyan-600"
    },
    {
      icon: Package,
      value: 8500,
      suffix: "+",
      label: "Items Exchanged",
      description: "Furniture finding new homes",
      color: "from-purple-400 to-pink-600"
    },
    {
      icon: Leaf,
      value: 78,
      suffix: "%",
      label: "CO₂ Reduction",
      description: "Compared to buying new furniture",
      color: "from-lime-400 to-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <InteractiveCard key={index}>
            <motion.div 
              className="bg-white rounded-lg p-6 shadow-md border border-gray-200 relative overflow-hidden group h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
            >
              {/* Animated gradient background on hover */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
              
              {/* Glowing effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-0 group-hover:opacity-20"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <FloatingIcon delay={index * 0.2}>
                    <motion.div 
                      className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-5 h-5 text-primary" />
                    </motion.div>
                  </FloatingIcon>
                  <motion.div 
                    className="text-2xl font-semibold text-primary"
                    whileHover={{ scale: 1.1 }}
                  >
                    <CountUpStat value={stat.value} suffix={stat.suffix} />
                  </motion.div>
                </div>
                <h4 className="text-foreground mb-1">{stat.label}</h4>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </motion.div>
          </InteractiveCard>
        );
      })}
    </div>
  );
}