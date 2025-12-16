import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Section } from "./components/Section";
import { Stats } from "./components/Stats";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { AnimatedButton } from "./components/AnimatedButton";
import { FloatingIcon } from "./components/FloatingIcon";
import { ParallaxImage } from "./components/ParallaxImage";
import { RevealText } from "./components/RevealText";
import { InteractiveCard } from "./components/InteractiveCard";
import { WorldCO2Map } from "./components/WorldCO2Map";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RouterProvider, useRouter } from "./contexts/RouterContext";
import { Recycle, Lightbulb, Home, Users, Mail, Phone, MapPin, Download, Sparkles, MousePointer2, ShoppingBag, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { Toaster } from "sonner@2.0.3";
import { OrdersPage } from "./pages/OrdersPage";
import { ContributionPage } from "./pages/ContributionPage";
import { ListingsPage } from "./pages/ListingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { DownloadPage } from "./pages/DownloadPage";

function AppContent() {
  const { currentPage, navigate } = useRouter();

  if (currentPage === "orders") {
    return <OrdersPage />;
  }

  if (currentPage === "contribution") {
    return <ContributionPage />;
  }

  if (currentPage === "listings") {
    return <ListingsPage />;
  }

  if (currentPage === "profile") {
    return <ProfilePage />;
  }

  if (currentPage === "download") {
    return <DownloadPage />;
  }

  return (
    <>
      <Navigation />
      <Toaster position="top-center" richColors />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Goal & Motivation Section - Combined */}
        <Section id="goal" title="Goal" bgColor="bg-gray-50">
          <div className="container mx-auto pb-16">
            {/* Goal Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <InteractiveCard>
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-lg bg-white shadow-sm"
                    whileHover={{ backgroundColor: "rgba(134, 194, 50, 0.05)" }}
                  >
                    <FloatingIcon>
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Recycle className="w-5 h-5 text-primary" />
                      </div>
                    </FloatingIcon>
                    <div>
                      <h3 className="text-xl mb-2">Reduce Furniture Waste</h3>
                      <RevealText className="text-muted-foreground">
                        Every year, thousands of tons of perfectly usable furniture end up in landfills when students move out. 
                        EraSwap connects those leaving furniture behind with those who need it, creating a circular economy.
                      </RevealText>
                    </div>
                  </motion.div>
                </InteractiveCard>
                
                <motion.div 
                  className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-6 rounded-lg border border-primary/20 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <p className="text-foreground relative z-10">
                    <strong className="text-primary flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Did you know?
                    </strong> 
                    The average student generates 640kg of furniture waste when moving out. Together, we can change that.
                  </p>
                </motion.div>
              </motion.div>
              
              <ParallaxImage
                src="https://images.unsplash.com/photo-1645520718652-9342896b0eec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZ1cm5pdHVyZSUyMHJlY3ljbGluZ3xlbnwxfHx8fDE3NjI5NTAzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Sustainable furniture"
                className="rounded-lg shadow-xl h-full"
              />
            </div>

            {/* Motivation Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1589803010842-41cdf85bf0f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwbW92aW5nfGVufDF8fHx8MTc2Mjk1MDMzNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Student moving"
                className="rounded-lg shadow-lg h-80"
              />
              <ParallaxImage
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwZnVybml0dXJlfGVufDF8fHx8MTc2Mjg5MDU2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Bedroom furniture"
                className="rounded-lg shadow-lg h-80"
              />
            </div>
            
            <motion.div 
              className="max-w-3xl mx-auto space-y-4 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl text-foreground">Why Students Need EraSwap</h3>
              <RevealText className="text-muted-foreground">
                Moving is expensive and time-consuming. Students often leave behind perfectly good furniture simply because 
                it's too difficult to transport or sell. Meanwhile, new students arriving need affordable furniture to set up their homes.
              </RevealText>
              <RevealText className="text-muted-foreground" delay={0.2}>
                EraSwap bridges this gap by providing a local marketplace specifically designed for the student community. 
                Find what you need, list what you're leaving behind, and contribute to a more sustainable future.
              </RevealText>
              <div className="flex justify-center gap-8 pt-6">
                {[
                  { value: "60%", label: "Cost Savings vs New" },
                  { value: "95%", label: "User Satisfaction" },
                  { value: "24h", label: "Average Listing Time" }
                ].map((stat, index) => (
                  <InteractiveCard key={index}>
                    <motion.div 
                      className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 shadow-md"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div 
                        className="text-3xl text-primary mb-2"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {stat.value}
                      </motion.div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  </InteractiveCard>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>
        
        {/* Live Data - Global CO2 Impact */}
        <Section id="live-data" title="Live Data" bgColor="bg-white" headerPosition="center-left">
          <div className="container mx-auto pb-16">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <motion.h3 
                className="text-2xl text-foreground mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Global Furniture Waste Impact
              </motion.h3>
              <RevealText className="text-muted-foreground text-lg">
                Explore real-time data on CO₂ emissions from furniture waste around the world. 
                Click on any country to see detailed statistics and understand the global impact.
              </RevealText>
            </div>
            <WorldCO2Map />
          </div>
        </Section>
        
        {/* The App Section - Featured */}
        <Section id="the-app" title="The App" highlighted bgColor="bg-gradient-to-b from-gray-50 to-white" headerPosition="center">
          <div className="container mx-auto px-4 pb-16">
            <motion.div 
              className="max-w-4xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl text-foreground mb-4">How It Works</h3>
              <RevealText className="text-muted-foreground text-lg">
                Navigate through your virtual apartment, discover furniture, and connect with sellers — all in three simple steps.
              </RevealText>
            </motion.div>
            
            {/* Step-by-step guide */}
            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: "Browse Virtual Rooms",
                  desc: "Enter the virtual apartment and explore different rooms. Click on furniture items to see what's available in your area.",
                  icon: MousePointer2,
                  image: "https://images.unsplash.com/photo-1666467831470-8f26f983391f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcm9vbSUyMGdhbWUlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY1MjI2OTcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
                  highlight: "Interactive 3D apartment interface"
                },
                {
                  step: 2,
                  title: "View Item Details",
                  desc: "See photos, prices, condition, and location of available furniture. Filter by distance, price range, and room type.",
                  icon: ShoppingBag,
                  image: "https://images.unsplash.com/photo-1746289761805-901ea1e02747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzY1MjI2OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
                  highlight: "Detailed product listings"
                },
                {
                  step: 3,
                  title: "Connect & Coordinate",
                  desc: "Message sellers directly, arrange pickup times, and complete your sustainable furniture swap with verified students.",
                  icon: MessageCircle,
                  image: "https://images.unsplash.com/photo-1729860648275-7d13c852f576?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBzaG9wcGluZyUyMGFwcCUyMHNjcmVlbnxlbnwxfHx8fDE3NjUyMjY5NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
                  highlight: "Secure in-app messaging"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <InteractiveCard>
                      <motion.div
                        className="relative rounded-xl overflow-hidden shadow-2xl bg-white"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ImageWithFallback
                          src={step.image}
                          alt={step.title}
                          className="w-full h-80 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg">
                            {step.step}
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center gap-2 text-white text-sm">
                            <step.icon className="w-4 h-4" />
                            <span>{step.highlight}</span>
                          </div>
                        </div>
                      </motion.div>
                    </InteractiveCard>
                  </div>
                  
                  <div className={`space-y-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <FloatingIcon delay={index * 0.2}>
                          <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                            <step.icon className="w-7 h-7 text-primary" />
                          </div>
                        </FloatingIcon>
                        <div>
                          <div className="text-sm text-primary">Step {step.step}</div>
                          <h4 className="text-xl text-foreground">{step.title}</h4>
                        </div>
                      </div>
                      <RevealText className="text-muted-foreground text-lg" delay={0.1}>
                        {step.desc}
                      </RevealText>
                      
                      {step.step === 1 && (
                        <motion.div
                          className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="text-sm text-foreground">
                            <strong className="text-primary">Pro Tip:</strong> Use the room navigation to quickly jump between kitchen, bedroom, living room, and bathroom areas.
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Features grid */}
            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {[
                { icon: Home, title: "Browse by Room", desc: "Kitchen, bedroom, living room & more" },
                { icon: MapPin, title: "Local Matches", desc: "Find furniture near your location" },
                { icon: Users, title: "Direct Contact", desc: "Connect with sellers instantly" }
              ].map((feature, index) => (
                <InteractiveCard key={index}>
                  <motion.div 
                    className="text-center p-6 rounded-lg bg-white shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <FloatingIcon delay={index * 0.3}>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                    </FloatingIcon>
                    <h4 className="mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </motion.div>
                </InteractiveCard>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedButton 
                variant="primary" 
                className="text-lg shadow-lg" 
                onClick={() => navigate('download')}
              >
                <Download className="w-5 h-5" />
                Download App
              </AnimatedButton>
            </motion.div>
          </div>
        </Section>
        
        {/* Community Section */}
        <Section id="community" title="Community" bgColor="bg-white" headerPosition="center-right">
          <div className="container mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl text-foreground">Join Our Growing Community</h3>
                <p className="text-muted-foreground">
                  EraSwap is more than just a marketplace—it's a community of students committed to making a difference. 
                  Share tips, connect with neighbors, and be part of the solution.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Verified student community members",
                    "Safe and secure transactions",
                    "Rating and review system",
                    "Local pickup coordination"
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 5, backgroundColor: "rgba(134, 194, 50, 0.1)" }}
                    >
                      <motion.div 
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      />
                      <p className="text-foreground">{item}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="bg-accent/10 p-6 rounded-lg border border-accent/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-foreground">
                    "EraSwap helped me furnish my entire apartment for less than $200. Plus, I met amazing people in my building!" 
                    <span className="block mt-2 text-sm text-muted-foreground">— Sarah K., Engineering Student</span>
                  </p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.03, rotate: 2 }}
              >
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1681011130080-46e470a7c96f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzaGFyaW5nfGVufDF8fHx8MTc2Mjk1MDMzNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Community"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </Section>
        
        {/* Contact Section */}
        <Section id="contact" title="Contact" bgColor="bg-gray-50">
          <div className="container mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div 
                className="rounded-lg overflow-hidden shadow-lg h-96"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1639751787355-bbc3ed1fd639?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwZnVybml0dXJlfGVufDF8fHx8MTc2Mjk0MDg5Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Contact us"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <h3 className="text-2xl text-foreground mb-4">Get in Touch</h3>
                  <p className="text-muted-foreground">
                    Have questions or suggestions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Mail, text: "support@eraswap.com" },
                    { icon: Phone, text: "+1 (555) 123-4567" },
                    { icon: MapPin, text: "Campus Hub, University District" }
                  ].map((contact, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center gap-3 text-muted-foreground"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 5, color: "#61892F" }}
                    >
                      <FloatingIcon delay={index * 0.2}>
                        <contact.icon className="w-5 h-5 text-primary" />
                      </FloatingIcon>
                      <span>{contact.text}</span>
                    </motion.div>
                  ))}
                </div>

                <form className="space-y-4 pt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <label htmlFor="name" className="block mb-2 text-foreground">Name</label>
                    <motion.input
                      id="name"
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Your name"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <label htmlFor="email" className="block mb-2 text-foreground">Email</label>
                    <motion.input
                      id="email"
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="your.email@university.edu"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <label htmlFor="message" className="block mb-2 text-foreground">Message</label>
                    <motion.textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                  <AnimatedButton variant="primary" className="w-full">
                    Send Message
                  </AnimatedButton>
                </form>
              </motion.div>
            </div>
          </div>
        </Section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">EraSwap</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting students, reducing waste, building sustainable communities.
              </p>
            </div>
            
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><motion.a href="#goal" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Our Goal</motion.a></li>
                <li><motion.a href="#motivation" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Why EraSwap</motion.a></li>
                <li><motion.a href="#the-app" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>The App</motion.a></li>
                <li><motion.a href="#community" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Community</motion.a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Help Center</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Safety Tips</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Terms of Service</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Privacy Policy</motion.a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Instagram</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Facebook</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>Twitter</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition-colors" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>LinkedIn</motion.a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 EraSwap. All rights reserved. Making student living sustainable, one swap at a time.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <AppContent />
          </div>
        </RouterProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}