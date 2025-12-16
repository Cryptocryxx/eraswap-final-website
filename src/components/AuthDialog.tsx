import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { AnimatedButton } from "./AnimatedButton";
import { Mail, Lock, User, Calendar, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "register";
}

export function AuthDialog({ open, onOpenChange, defaultMode = "login" }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register" | "verify">(defaultMode);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const { login } = useAuth();
  
  // Sync mode with defaultMode when it changes
  useEffect(() => {
    if (open) {
      setMode(defaultMode);
    }
  }, [defaultMode, open]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthday: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine if identifier is email or username
      const isEmail = loginIdentifier.includes("@");
      const body = {
        [isEmail ? "email" : "username"]: loginIdentifier,
        password: loginPassword
      };

      const response = await fetch("https://eraswap.online/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data from API response
        console.log("Login response data:", data);
        
        // Extract userId and username from response - API returns nested user object
        const userId = data.user?.id || data.userId || data.id;
        const username = data.user?.username || data.username;
        
        if (!userId || !username) {
          console.error("Missing userId or username in response:", data);
          toast.error("Login error: Invalid response from server", {
            icon: <AlertCircle className="w-5 h-5 text-destructive" />,
          });
          setLoading(false);
          return;
        }
        
        login(userId, username);
        
        toast.success("Login successful! Welcome back to EraSwap.", {
          icon: <CheckCircle className="w-5 h-5 text-primary" />,
        });
        
        onOpenChange(false);
        // Reset form
        setLoginIdentifier("");
        setLoginPassword("");
      } else if (response.status === 409) {
        // Email not yet verified - go to verification page
        toast.error("Email not verified. Please verify your email first.", {
          icon: <AlertCircle className="w-5 h-5 text-destructive" />,
        });
        // Extract email from identifier if it's an email, otherwise use from response if available
        const email = loginIdentifier.includes("@") ? loginIdentifier : data.email || "";
        if (email) {
          setVerificationEmail(email);
        }
        setMode("verify");
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.", {
          icon: <AlertCircle className="w-5 h-5 text-destructive" />,
        });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", {
        icon: <AlertCircle className="w-5 h-5 text-destructive" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match!", {
        icon: <AlertCircle className="w-5 h-5 text-destructive" />,
      });
      return;
    }

    // Validate all fields are filled
    if (!registerData.username || !registerData.email || !registerData.password || 
        !registerData.firstName || !registerData.lastName || !registerData.birthday) {
      toast.error("Please fill in all fields.", {
        icon: <AlertCircle className="w-5 h-5 text-destructive" />,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://eraswap.online/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          birthday: registerData.birthday
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Please check your email for verification code.", {
          icon: <CheckCircle className="w-5 h-5 text-primary" />,
        });
        setVerificationEmail(registerData.email);
        setMode("verify");
      } else if (response.status === 408) {
        // Email already registered - go to login page
        toast.error("This email is already registered. Please log in instead.", {
          icon: <AlertCircle className="w-5 h-5 text-destructive" />,
        });
        setMode("login");
        // Pre-fill the login identifier with the email
        setLoginIdentifier(registerData.email);
      } else {
        toast.error(data.message || "Registration failed. Please try again.", {
          icon: <AlertCircle className="w-5 h-5 text-destructive" />,
        });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", {
        icon: <AlertCircle className="w-5 h-5 text-destructive" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 5) {
      toast.error("Please enter a valid 5-digit code.", {
        icon: <AlertCircle className="w-5 h-5 text-destructive" />,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://eraswap.online/api/users/verify", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Email verified successfully! You can now log in.", {
          icon: <CheckCircle className="w-5 h-5 text-primary" />,
        });
        // Reset to login mode
        setMode("login");
        setVerificationCode("");
        // Reset register form
        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          birthday: ""
        });
      } else {
        toast.error(data.message || "Verification failed. Please check your code.", {
          icon: <AlertCircle className="w-5 h-5 text-destructive" />,
        });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", {
        icon: <AlertCircle className="w-5 h-5 text-destructive" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset mode to default when closing
      setTimeout(() => setMode(defaultMode), 200);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === "login" && "Welcome Back to EraSwap"}
            {mode === "register" && "Join EraSwap"}
            {mode === "verify" && "Verify Your Email"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "login" && "Log in to continue your sustainable furniture journey"}
            {mode === "register" && "Create an account to start swapping furniture"}
            {mode === "verify" && "Enter the 5-digit code sent to your email"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLogin}
              className="space-y-4 mt-4"
            >
              <div className="space-y-2">
                <label htmlFor="login-identifier" className="text-sm">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-identifier"
                    type="text"
                    placeholder="Enter your email or username"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
              </motion.div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-sm text-primary hover:underline"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </motion.form>
          )}

          {mode === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleRegister}
              className="space-y-4 mt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@university.edu"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="birthday" className="text-sm">
                  Birthday
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="birthday"
                    type="date"
                    value={registerData.birthday}
                    onChange={(e) => setRegisterData({ ...registerData, birthday: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </motion.div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-sm text-primary hover:underline"
                >
                  Already have an account? Log in
                </button>
              </div>
            </motion.form>
          )}

          {mode === "verify" && (
            <motion.form
              key="verify"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleVerification}
              className="space-y-6 mt-4"
            >
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to <strong>{verificationEmail}</strong>
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-center block">
                  Verification Code
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={5}
                    value={verificationCode}
                    onChange={(value) => setVerificationCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 5-digit code from your email
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Verify Email
                    </>
                  )}
                </button>
              </motion.div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Back to registration
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}