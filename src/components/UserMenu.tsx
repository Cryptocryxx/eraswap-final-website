import { useState, useRef, useEffect } from "react";
import { User, Package, Award, LogOut, Store, UserCog } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AuthDialog } from "./AuthDialog";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "../contexts/RouterContext";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative" ref={menuRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 hover:from-primary/20 hover:to-accent/20 dark:hover:from-primary/30 dark:hover:to-accent/30 flex items-center justify-center transition-colors border border-primary/20 dark:border-primary/30"
          aria-label="User menu"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="w-5 h-5 text-foreground dark:text-accent" />
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {isAuthenticated ? (
                <>
                  {/* Username Display */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-muted-foreground">Logged in as</p>
                    <p className="font-medium text-foreground dark:text-gray-200">{user?.username}</p>
                  </div>

                  {/* Your Orders */}
                  <motion.a
                    href="/orders"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("orders");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-foreground dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 dark:hover:from-primary/10 dark:hover:to-accent/10 transition-all border-b border-gray-100 dark:border-gray-800 flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <Package className="w-4 h-4" />
                    Your Orders
                  </motion.a>

                  {/* Your Contribution */}
                  <motion.a
                    href="/contribution"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("contribution");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-foreground dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 dark:hover:from-primary/10 dark:hover:to-accent/10 transition-all border-b border-gray-100 dark:border-gray-800 flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <Award className="w-4 h-4" />
                    Your Contribution
                  </motion.a>

                  {/* Your Listings */}
                  <motion.a
                    href="/listings"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("listings");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-foreground dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 dark:hover:from-primary/10 dark:hover:to-accent/10 transition-all border-b border-gray-100 dark:border-gray-800 flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <Store className="w-4 h-4" />
                    Your Listings
                  </motion.a>

                  {/* Profile */}
                  <motion.a
                    href="/profile"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("profile");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-foreground dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 dark:hover:from-primary/10 dark:hover:to-accent/10 transition-all border-b border-gray-100 dark:border-gray-800 flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <UserCog className="w-4 h-4" />
                    Profile
                  </motion.a>

                  {/* Logout */}
                  <motion.button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      setAuthMode("login");
                      setAuthDialogOpen(true);
                    }}
                    className="w-full px-4 py-3 text-left text-foreground dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 dark:hover:from-primary/10 dark:hover:to-accent/10 transition-all border-b border-gray-100 dark:border-gray-800"
                    whileHover={{ x: 5 }}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      setAuthMode("register");
                      setAuthDialogOpen(true);
                    }}
                    className="w-full px-4 py-3 text-left text-foreground dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 dark:hover:from-primary/10 dark:hover:to-accent/10 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    Register
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        defaultMode={authMode}
      />
    </>
  );
}