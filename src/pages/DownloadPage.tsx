import { motion } from "motion/react";
import { Download, Apple, MonitorDown, Check, ArrowLeft } from "lucide-react";
import { useRouter } from "../contexts/RouterContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { AuthDialog } from "../components/AuthDialog";

export function DownloadPage() {
  const { navigate } = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const features = [
    "Browse furniture by room categories",
    "Explore the city",
    "Achieve new levels",
    "Buy Furniture",
    "Collect Trash",
    "See how your impact improves the world"
  ];

  const handleDownload = (platform: 'mac' | 'windows') => {
    if (!isAuthenticated || !user) {
      // Prompt user to log in before allowing download
      setAuthOpen(true);
      return;
    }

    const downloadUrls = {
      mac: `https://eraswap.online/api/build/mac/${user.id}`,
      windows: `https://eraswap.online/api/build/windows/${user.id}`
    };

    window.location.href = downloadUrls[platform];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7F4CF] via-white to-[#BCFFE8]">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-2xl" style={{ color: '#61892F' }}>EraSwap</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#61892F] to-[#86C232] rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <Download className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl mb-4" style={{ color: '#61892F' }}>
              Download EraSwap
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Join the sustainable furniture revolution
            </p>
            <p className="text-gray-500">
              Available for macOS and Windows — you must be logged in to download
            </p>
          </motion.div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* macOS Download Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center">
                  <Apple className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl">macOS</h2>
                  <p className="text-sm text-gray-500">For Mac computers</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>macOS 11.0 or later</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Apple Silicon & Intel supported</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Size: ~323.7 MB</span>
                </div>
              </div>

              <motion.button
                onClick={() => handleDownload('mac')}
                className="w-full py-4 rounded-xl text-white font-semibold shadow-lg transition-all"
                style={{ backgroundColor: '#61892F' }}
                whileHover={{ scale: 1.02, backgroundColor: '#86C232' }}
                whileTap={{ scale: 0.98 }}
                disabled={!isAuthenticated}
              >
                <div className="flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  <span>Download for Mac</span>
                </div>
              </motion.button>

              {!isAuthenticated ? (
                <p className="text-sm text-center text-red-600 mt-4">
                  Please <button onClick={() => setAuthOpen(true)} className="underline font-medium">log in</button> to download the app.
                </p>
              ) : (
                <p className="text-xs text-center text-gray-400 mt-4">
                  Version 1.0.0 • Updated December 2024
                </p>
              )}
            </motion.div>

            {/* Windows Download Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0078D4] to-[#00BCF2] rounded-2xl flex items-center justify-center">
                  <MonitorDown className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl">Windows</h2>
                  <p className="text-sm text-gray-500">For PC</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Windows 10 or later</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>64-bit version</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Size: ~283.8 MB</span>
                </div>
              </div>

              <motion.button
                onClick={() => handleDownload('windows')}
                className="w-full py-4 rounded-xl text-white font-semibold shadow-lg transition-all"
                style={{ backgroundColor: '#61892F' }}
                whileHover={{ scale: 1.02, backgroundColor: '#86C232' }}
                whileTap={{ scale: 0.98 }}
                disabled={!isAuthenticated}
              >
                <div className="flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  <span>Download for Windows</span>
                </div>
              </motion.button>

              {!isAuthenticated ? (
                <p className="text-sm text-center text-red-600 mt-4">
                  Please <button onClick={() => setAuthOpen(true)} className="underline font-medium">log in</button> to download the app.
                </p>
              ) : (
                <p className="text-xs text-center text-gray-400 mt-4">
                  Version 1.0.0 • Updated December 2024
                </p>
              )}
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h3 className="text-2xl mb-6 text-center" style={{ color: '#61892F' }}>
              What's included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D7F4CF' }}>
                    <Check className="w-5 h-5" style={{ color: '#61892F' }} />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500">
              By downloading EraSwap, you agree to our Terms of Service and Privacy Policy
            </p>
            {/* Auth dialog for login/register */}
            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode="login" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}