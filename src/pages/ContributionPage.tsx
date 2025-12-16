import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "sonner@2.0.3";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "../contexts/RouterContext";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, Leaf, Trees, Cloud, Sun, Sparkles } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  verified: boolean;
  firstName: string;
  lastName: string;
  birthday: string;
  coins: number;
  level: number;
  exp: string;
  role: string;
}

export function ContributionPage() {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [furnitureSaved, setFurnitureSaved] = useState<number>(0);
  const [co2Reduced, setCo2Reduced] = useState<number>(0);
  const [furnitureRecycled, setFurnitureRecycled] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("home");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://eraswap.online/api/users/profile/${user?.id}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchImpactData = async () => {
      try {
        // Fetch Furniture Saved (orders/user/:userid/items length)
        const ordersResponse = await fetch(`https://eraswap.online/api/orders/user/${user?.id}/items`);
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          console.log(ordersData)
          setFurnitureSaved(Array.isArray(ordersData.items) ? ordersData.items.length : 0);
        }

        // Fetch CO2 Reduced
        const emissionsResponse = await fetch(`https://eraswap.online/api/users/${user?.id}/emmissions`);
        if (emissionsResponse.ok) {
          const emissionsData = await emissionsResponse.json();
          console.log(emissionsData)
          setCo2Reduced(emissionsData.totalEmmissions || 0);
        }

        // Fetch Furniture Recycled (listings)
        const listingsResponse = await fetch(`https://eraswap.online/api/users/listings/${user?.id}`);
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json();
          setFurnitureRecycled(Array.isArray(listingsData) ? listingsData.length : 0);
        }
      } catch (error) {
        console.error("Failed to load impact data:", error);
      }
    };

    fetchProfile();
    fetchImpactData();
  }, [user, isAuthenticated, navigate]);

  // Calculate exp progress in current level
  const calculateLevelProgress = (level: number, exp: number) => {
    const currentLevelMax = Math.floor(1000 * Math.pow(1.5, level - 1));
    const nextLevelMax = Math.floor(1000 * Math.pow(1.5, level));
    const prevLevelMax = level > 1 ? Math.floor(1000 * Math.pow(1.5, level - 2)) : 0;
    
    const currentLevelExp = exp - prevLevelMax;
    const requiredExp = nextLevelMax - prevLevelMax;
    
    return {
      current: currentLevelExp,
      required: requiredExp,
      percentage: (currentLevelExp / requiredExp) * 100
    };
  };

  // Render background based on level
  const renderEcoSystem = (level: number) => {
    // Color palettes for different levels
    const getSkyColors = (level: number) => {
      if (level <= 2) {
        return { top: "#4a4a4a", bottom: "#6b5b4f" }; // Dark, polluted
      } else if (level <= 4) {
        return { top: "#5a5a5a", bottom: "#7d6e5f" }; // Slightly lighter
      } else if (level <= 6) {
        return { top: "#7d9db5", bottom: "#a8c5d8" }; // Getting clearer
      } else if (level <= 8) {
        return { top: "#87ceeb", bottom: "#b0e0e6" }; // Clear blue
      } else {
        return { top: "#4da6ff", bottom: "#87ceeb" }; // Beautiful clear sky
      }
    };

    const getGroundColor = (level: number) => {
      if (level <= 2) return "#3d3d3d"; // Dark, dirty
      if (level <= 4) return "#5a5240"; // Brown dirt
      if (level <= 6) return "#7a8450"; // Grass starting
      if (level <= 8) return "#6b8e23"; // Green grass
      return "#2d5016"; // Rich green
    };

    const skyColors = getSkyColors(level);
    const groundColor = getGroundColor(level);
    
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky - painted gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${skyColors.top}, ${skyColors.bottom})`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Sun/Moon */}
        {level >= 5 ? (
          <motion.div
            className="absolute top-16 right-20 w-24 h-24 rounded-full bg-yellow-300 shadow-lg shadow-yellow-400/50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        ) : (
          <motion.div
            className="absolute top-16 right-20 w-20 h-20 rounded-full bg-gray-400/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Clouds - more clouds at higher levels */}
        {level >= 3 && (
          <>
            {[...Array(Math.min(Math.floor((level - 2) / 2), 4))].map((_, i) => (
              <motion.div
                key={`cloud-${i}`}
                className="absolute flex items-center"
                style={{
                  left: `${15 + i * 20}%`,
                  top: `${10 + (i % 2) * 15}%`,
                }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: level >= 5 ? 0.9 : 0.4 }}
                transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
              >
                {/* Cloud made of circles */}
                <div className={`${level >= 5 ? 'bg-white' : 'bg-gray-500'} w-16 h-10 rounded-full`} />
                <div className={`${level >= 5 ? 'bg-white' : 'bg-gray-500'} w-20 h-12 rounded-full -ml-6`} />
                <div className={`${level >= 5 ? 'bg-white' : 'bg-gray-500'} w-14 h-9 rounded-full -ml-6`} />
              </motion.div>
            ))}
          </>
        )}

        {/* Buildings/City silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-64">
          {/* Building 1 */}
          <motion.div
            className="absolute bottom-0 left-[10%] w-20 h-40 bg-gray-700"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-3 gap-1 p-2">
              {[...Array(9)].map((_, i) => (
                <div
                  key={`b1-window-${i}`}
                  className={`w-4 h-4 ${level >= 6 ? 'bg-yellow-300/60' : 'bg-gray-600/30'}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Building 2 */}
          <motion.div
            className="absolute bottom-0 left-[25%] w-24 h-48 bg-gray-600"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-4 gap-1 p-2">
              {[...Array(16)].map((_, i) => (
                <div
                  key={`b2-window-${i}`}
                  className={`w-4 h-4 ${level >= 6 ? 'bg-yellow-300/60' : 'bg-gray-500/30'}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Building 3 */}
          <motion.div
            className="absolute bottom-0 right-[20%] w-28 h-52 bg-gray-700"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="grid grid-cols-4 gap-1 p-2">
              {[...Array(20)].map((_, i) => (
                <div
                  key={`b3-window-${i}`}
                  className={`w-4 h-4 ${level >= 6 ? 'bg-yellow-300/60' : 'bg-gray-600/30'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Ground/Street */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ backgroundColor: groundColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />

        {/* Trash elements for low levels */}
        {level <= 4 && (
          <div className="absolute bottom-0 left-0 right-0 h-32">
            {[...Array(Math.max(8 - level * 2, 2))].map((_, i) => {
              return (
                <motion.div
                  key={`trash-${i}`}
                  className="absolute"
                  style={{
                    left: `${10 + i * 11}%`,
                    bottom: `${4 + (i % 3) * 2}px`,
                  }}
                  initial={{ opacity: 0, scale: 0, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08, type: "spring" }}
                >
                  {/* Trash bag */}
                  <svg width="32" height="40" viewBox="0 0 32 40" style={{ transform: `rotate(${(i * 15) % 30 - 15}deg)` }}>
                    {/* Main bag body */}
                    <ellipse cx="16" cy="28" rx="12" ry="12" fill="#1a1a1a" opacity="0.8" />
                    <path 
                      d="M4 28 Q4 18, 6 15 L26 15 Q28 18, 28 28" 
                      fill="#2d2d2d" 
                      opacity="0.9"
                    />
                    <path 
                      d="M6 15 L8 12 L24 12 L26 15" 
                      fill="#1a1a1a" 
                      opacity="0.7"
                    />
                    
                    {/* Bag tie/knot */}
                    <ellipse cx="16" cy="12" rx="2" ry="3" fill="#3a3a3a" opacity="0.8" />
                    
                    {/* Highlights and creases */}
                    <ellipse cx="12" cy="22" rx="3" ry="4" fill="#3a3a3a" opacity="0.4" />
                    <ellipse cx="20" cy="26" rx="2" ry="3" fill="#3a3a3a" opacity="0.3" />
                    
                    {/* Shadow */}
                    <ellipse cx="16" cy="39" rx="10" ry="2" fill="#000000" opacity="0.2" />
                  </svg>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pollution/smoke for low levels */}
        {level <= 3 && (
          <div className="absolute inset-0">
            {[...Array(4 - level)].map((_, i) => (
              <motion.div
                key={`smoke-${i}`}
                className="absolute w-32 h-32 rounded-full bg-gray-900/20 blur-2xl"
                style={{
                  left: `${20 + i * 25}%`,
                  top: `${30 + i * 10}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        )}

        {/* Dead tree for low levels */}
        {level <= 2 && (
          <div className="absolute bottom-32 left-0 right-0">
            <motion.div
              className="absolute"
              style={{ left: '75%' }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <svg width="60" height="100" viewBox="0 0 60 100">
                {/* Main trunk */}
                <rect x="26" y="50" width="8" height="50" fill="#4a3f35" />
                
                {/* Bare branches - no leaves */}
                <line x1="30" y1="55" x2="18" y2="48" stroke="#4a3f35" strokeWidth="3" />
                <line x1="18" y1="48" x2="12" y2="52" stroke="#4a3f35" strokeWidth="2" />
                <line x1="18" y1="48" x2="14" y2="42" stroke="#4a3f35" strokeWidth="2" />
                
                <line x1="30" y1="60" x2="42" y2="52" stroke="#4a3f35" strokeWidth="3" />
                <line x1="42" y1="52" x2="48" y2="48" stroke="#4a3f35" strokeWidth="2" />
                <line x1="42" y1="52" x2="46" y2="56" stroke="#4a3f35" strokeWidth="2" />
                
                <line x1="30" y1="68" x2="20" y2="65" stroke="#4a3f35" strokeWidth="2.5" />
                <line x1="20" y1="65" x2="16" y2="68" stroke="#4a3f35" strokeWidth="1.5" />
                
                <line x1="30" y1="72" x2="38" y2="68" stroke="#4a3f35" strokeWidth="2.5" />
                <line x1="38" y1="68" x2="42" y2="70" stroke="#4a3f35" strokeWidth="1.5" />
                
                {/* Top branches */}
                <line x1="30" y1="50" x2="24" y2="42" stroke="#4a3f35" strokeWidth="2" />
                <line x1="30" y1="50" x2="36" y2="44" stroke="#4a3f35" strokeWidth="2" />
              </svg>
            </motion.div>
          </div>
        )}

        {/* Trees - more trees at higher levels */}
        {level >= 4 && (
          <div className="absolute bottom-32 left-0 right-0">
            {[...Array(Math.min(level - 2, 8))].map((_, i) => (
              <motion.div
                key={`tree-${i}`}
                className="absolute"
                style={{ left: `${5 + i * 11}%` }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <svg width="50" height="80" viewBox="0 0 50 80">
                  {/* Tree trunk */}
                  <rect x="20" y="50" width="10" height="30" fill="#6b4423" />
                  
                  {/* Tree foliage - layered triangular shapes */}
                  <ellipse cx="25" cy="25" rx="18" ry="22" fill={level >= 7 ? '#2d5016' : '#4a6b2a'} />
                  <ellipse cx="15" cy="35" rx="12" ry="15" fill={level >= 7 ? '#3d6b26' : '#5a7b3a'} />
                  <ellipse cx="35" cy="35" rx="12" ry="15" fill={level >= 7 ? '#3d6b26' : '#5a7b3a'} />
                  <ellipse cx="25" cy="40" rx="15" ry="18" fill={level >= 7 ? '#4d7b36' : '#6a8b4a'} />
                  
                  {/* Highlights */}
                  <ellipse cx="20" cy="22" rx="5" ry="6" fill={level >= 7 ? '#4d7b36' : '#6a8b4a'} opacity="0.6" />
                  <ellipse cx="30" cy="28" rx="4" ry="5" fill={level >= 7 ? '#5d8b46' : '#7a9b5a'} opacity="0.5" />
                </svg>
              </motion.div>
            ))}
          </div>
        )}

        {/* Flowers for high levels */}
        {level >= 8 && (
          <div className="absolute bottom-32 left-0 right-0">
            {[...Array(Math.min((level - 6) * 2, 10))].map((_, i) => {
              const flowerColors = [
                { petal: '#ff69b4', center: '#ffd700' }, // Pink with yellow center
                { petal: '#ff6b9d', center: '#ff1493' }, // Hot pink
                { petal: '#da70d6', center: '#ff69b4' }, // Orchid
                { petal: '#ff4500', center: '#ffd700' }, // Orange red
                { petal: '#ff69b4', center: '#ff8c00' }, // Pink with orange center
              ];
              
              const color = flowerColors[i % 5];
              
              return (
                <motion.div
                  key={`flower-${i}`}
                  className="absolute"
                  style={{
                    left: `${8 + i * 8}%`,
                    bottom: `${5 + (i % 3) * 8}px`,
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2 + i * 0.08, type: "spring", stiffness: 150 }}
                >
                  <svg width="24" height="32" viewBox="0 0 24 32">
                    {/* Stem */}
                    <path d="M12 18 Q10 24, 12 32" stroke="#2d5016" strokeWidth="1.5" fill="none" />
                    
                    {/* Leaf */}
                    <ellipse cx="8" cy="24" rx="3" ry="2" fill="#4d7b36" transform="rotate(-30 8 24)" />
                    
                    {/* Flower petals - 5 petals in circle */}
                    {[0, 72, 144, 216, 288].map((angle, idx) => (
                      <ellipse
                        key={`petal-${i}-${idx}`}
                        cx="12"
                        cy="12"
                        rx="3.5"
                        ry="5"
                        fill={color.petal}
                        transform={`rotate(${angle} 12 12) translate(0 -5)`}
                        opacity="0.9"
                      />
                    ))}
                    
                    {/* Flower center */}
                    <circle cx="12" cy="12" r="3" fill={color.center} />
                    <circle cx="12" cy="12" r="2" fill={color.center} opacity="0.7" />
                  </svg>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Birds for high levels */}
        {level >= 7 && (
          <>
            {[...Array(Math.min(level - 5, 5))].map((_, i) => (
              <motion.div
                key={`bird-${i}`}
                className="absolute text-gray-800"
                style={{
                  left: `${30 + i * 15}%`,
                  top: `${20 + (i % 2) * 10}%`,
                }}
                animate={{
                  x: [0, 20, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <svg width="20" height="12" viewBox="0 0 20 12">
                  <path
                    d="M2 8 Q6 2, 10 6 Q14 2, 18 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </motion.div>
            ))}
          </>
        )}

        {/* Sparkles/stars for very high levels */}
        {level >= 9 && (
          <div className="absolute inset-0">
            {[...Array(level - 7)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 40}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navigation />
        <div className="text-center py-20">
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
      </div>
    );
  }

  const progress = calculateLevelProgress(profile.level, parseInt(profile.exp));
  const chartData = [
    { name: "Current", value: progress.current },
    { name: "Remaining", value: progress.required - progress.current }
  ];

  // Badge system for each level
  const getLevelBadge = (level: number): string => {
    const badges: { [key: number]: string } = {
      1: "🌱 Seedling",
      2: "🌿 Sprout",
      3: "🍃 Green Starter",
      4: "🌾 Eco Apprentice",
      5: "🌻 Nature Friend",
      6: "🌳 Tree Hugger",
      7: "🌲 Forest Guardian",
      8: "🌍 Earth Protector",
      9: "♻️ Eco Champion",
      10: "🏆 Sustainability Master"
    };
    return badges[level] || `Level ${level}`;
  };

  // Get reward for next level
  const getNextLevelReward = (nextLevel: number): string => {
    const badge = getLevelBadge(nextLevel);
    if (nextLevel === 3) return `${badge} + 50 EraCoins`;
    if (nextLevel === 5) return `${badge} + 100 EraCoins`;
    if (nextLevel === 10) return `${badge} + 500 EraCoins`;
    return badge;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />
      <Toaster position="top-center" richColors />

      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>
          
          <h1 className="text-3xl mb-2">Your Contribution</h1>
          <p className="text-muted-foreground">Track your environmental impact</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Eco System Visualization */}
          <motion.div
            className="bg-gradient-to-b from-sky-100 via-green-50 to-green-200 dark:from-sky-900 dark:via-green-900 dark:to-green-800 rounded-lg p-8 relative overflow-hidden min-h-[500px]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eco System Animation */}
            <div className="absolute inset-0">
              {renderEcoSystem(profile.level)}
            </div>

            {/* Center - Pie Chart */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              >
                <ResponsiveContainer width={250} height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#86C232" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center background circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full bg-green-200" />
                
                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-5xl text-primary">{profile.level}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Stats */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
              <h3 className="text-xl mb-4">Profile</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-foreground">{profile.firstName} {profile.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="text-foreground">@{profile.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coins Earned</p>
                  <p className="text-primary text-2xl">{profile.coins}</p>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
              <h3 className="text-xl mb-4">Level Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Current Level</span>
                    <span className="text-primary">Level {profile.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {progress.required - progress.current} XP to Level {profile.level + 1}
                  </p>
                </div>

                {/* Next Level */}
                {profile.level < 10 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Next Level</p>
                    <motion.div
                      className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg">Level {profile.level + 1}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{getNextLevelReward(profile.level + 1)}</p>
                    </motion.div>
                  </div>
                )}
                
                {/* Current Badge */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Badge</p>
                  <motion.div
                    className="p-4 bg-accent/10 rounded-lg border-2 border-accent/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <p className="text-lg">{getLevelBadge(profile.level)}</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
              <h3 className="text-xl mb-4">Your Impact</h3>
              <div className="space-y-3">
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="text-muted-foreground">Furniture Saved</span>
                  <span className="text-primary text-xl">{furnitureSaved}</span>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <span className="text-muted-foreground">CO₂ Reduced</span>
                  <span className="text-primary text-xl">{co2Reduced.toFixed(0)} kg</span>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <span className="text-muted-foreground">Furniture Recycled</span>
                  <span className="text-primary text-xl">{furnitureRecycled}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}