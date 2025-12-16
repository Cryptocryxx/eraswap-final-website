import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "sonner@2.0.3";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "../contexts/RouterContext";
import { motion } from "motion/react";
import { User, ArrowLeft, Loader2, Save, Lock, X, Coins, ShoppingCart } from "lucide-react";
import eraCoinIcon from "figma:asset/724febc18db287bf1715ab2a9524f2f860196cfb.png";

interface UserProfile {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  birthday: string;
}

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    birthday: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [eraCoins, setEraCoins] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("home");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://eraswap.online/api/users/profile/${user?.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Profile data:", data); // Debug log
          setProfile({
            username: data.username || "",
            firstname: data.firstName || "",
            lastname: data.lastName || "",
            email: data.email || "",
            birthday: data.birthday ? data.birthday.split('T')[0] : "", // Format date for input
          });
          // Set EraCoins from the "coins" field in the API response
          if (data.coins !== undefined) {
            setEraCoins(data.coins);
          }
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const body: any = {
        username: profile.username,
        firstName: profile.firstname,
        lastName: profile.lastname,
        email: profile.email,
        birthday: profile.birthday,
      };

      // Only include password if it's been changed
      if (showPasswordForm && oldPassword && newPassword) {
        body.oldPassword = oldPassword;
        body.newPassword = newPassword;
      }

      const response = await fetch(`https://eraswap.online/api/users/profile/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setOldPassword(""); // Clear password fields after successful update
        setNewPassword("");
        setShowPasswordForm(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />
      <Toaster position="top-center" richColors />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
          
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Your Profile</h1>
          </div>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Profile Form */}
        {!loading && (
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm mb-2 text-foreground">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={profile.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="firstname" className="block text-sm mb-2 text-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  value={profile.firstname}
                  onChange={(e) => handleInputChange("firstname", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastname" className="block text-sm mb-2 text-foreground">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  value={profile.lastname}
                  onChange={(e) => handleInputChange("lastname", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Birthday */}
              <div>
                <label htmlFor="birthday" className="block text-sm mb-2 text-foreground">
                  Birthday
                </label>
                <input
                  type="date"
                  id="birthday"
                  value={profile.birthday}
                  onChange={(e) => handleInputChange("birthday", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Password Reset Section */}
        {!loading && (
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-xl">Password</h2>
              </div>
              {showPasswordForm && (
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setOldPassword("");
                    setNewPassword("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {!showPasswordForm ? (
              <motion.button
                onClick={() => setShowPasswordForm(true)}
                className="w-full bg-gray-100 dark:bg-gray-800 text-foreground py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Lock className="w-5 h-5" />
                Reset Password
              </motion.button>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!oldPassword || !newPassword) {
                    toast.error("Please fill in both password fields");
                    return;
                  }

                  setSaving(true);
                  try {
                    const body = {
                      username: profile.username,
                      firstname: profile.firstname,
                      lastname: profile.lastname,
                      email: profile.email,
                      birthday: profile.birthday,
                      password: newPassword,
                    };

                    const response = await fetch(`https://eraswap.online/api/users/profile/${user?.id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(body),
                    });

                    if (response.ok) {
                      toast.success("Password updated successfully!");
                      setOldPassword("");
                      setNewPassword("");
                      setShowPasswordForm(false);
                    } else {
                      const errorData = await response.json();
                      toast.error(errorData.message || "Failed to update password");
                    }
                  } catch (error) {
                    toast.error("An error occurred while updating password");
                  } finally {
                    setSaving(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="oldPassword" className="block text-sm mb-2 text-foreground">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm mb-2 text-foreground">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        )}

        {/* EraCoins Section */}
        {!loading && (
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <img src={eraCoinIcon} alt="EraCoin" className="w-6 h-6" />
              <h2 className="text-xl">Your EraCoins</h2>
            </div>

            {/* Current Balance */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
              <div className="flex items-center gap-2">
                <img src={eraCoinIcon} alt="EraCoin" className="w-10 h-10" />
                <span className="text-4xl text-primary">{eraCoins.toLocaleString()}</span>
              </div>
            </div>

            {/* Buy EraCoins */}
            <div>
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Buy EraCoins
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                Exchange Rate: €1 = 100 EraCoins
              </p>

              {/* Custom Amount Input */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="euroAmount" className="block text-sm mb-2 text-foreground">
                    Amount in Euros (€)
                  </label>
                  <input
                    type="number"
                    id="euroAmount"
                    min="1"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount in €"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>

                {/* EraCoins Calculation Display */}
                {customAmount && parseFloat(customAmount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg p-4 border border-primary/20"
                  >
                    <p className="text-sm text-muted-foreground mb-2">You will receive:</p>
                    <div className="flex items-center gap-2">
                      <img src={eraCoinIcon} alt="EraCoin" className="w-8 h-8" />
                      <span className="text-3xl text-primary">
                        {(parseFloat(customAmount) * 100).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">EraCoins</span>
                    </div>
                  </motion.div>
                )}

                {/* Purchase Button */}
                <motion.button
                  onClick={async () => {
                    const euros = parseFloat(customAmount);
                    if (!euros || euros <= 0) {
                      toast.error("Please enter a valid amount");
                      return;
                    }

                    setSaving(true);
                    const eraCoinsAmount = Math.floor(euros * 100);
                    
                    try {
                      const response = await fetch(`https://eraswap.online/api/users/${user?.id}/coins`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          amount: eraCoinsAmount,
                        }),
                      });

                      if (response.ok) {
                        toast.success(`Successfully purchased ${eraCoinsAmount.toLocaleString()} EraCoins!`);
                        setEraCoins(prev => prev + eraCoinsAmount);
                        setCustomAmount("");
                      } else {
                        const errorData = await response.json();
                        toast.error(errorData.message || "Failed to purchase EraCoins");
                      }
                    } catch (error) {
                      console.error("Error purchasing EraCoins:", error);
                      toast.error("An error occurred while purchasing EraCoins");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving || !customAmount || parseFloat(customAmount) <= 0}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: (saving || !customAmount || parseFloat(customAmount) <= 0) ? 1 : 1.02 }}
                  whileTap={{ scale: (saving || !customAmount || parseFloat(customAmount) <= 0) ? 1 : 0.98 }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {customAmount && parseFloat(customAmount) > 0
                        ? `Purchase for €${parseFloat(customAmount).toFixed(2)}`
                        : "Enter amount to purchase"}
                    </>
                  )}
                </motion.button>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                EraCoins can be used to purchase furniture on the EraSwap marketplace
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}