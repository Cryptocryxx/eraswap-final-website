import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "sonner@2.0.3";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "../contexts/RouterContext";
import { motion, AnimatePresence } from "motion/react";
import { Package, ArrowLeft, Loader2, X, ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import eraCoinIcon from "figma:asset/724febc18db287bf1715ab2a9524f2f860196cfb.png";

interface OrderItem {
  id: number;
  name: string;
  description: string;
  price: string;
  icon: string;
  pictures: string[];
  category: string;
  order_id: number;
}

interface Order {
  id: number;
  timestamp: string;
  user_id: number;
  items: OrderItem[];
}

export function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [emissionsData, setEmissionsData] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("home");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://eraswap.online/api/orders/user/${user?.id}`);
        const data = await response.json();
        setOrders(data);
        
        // Fetch emissions data for each order
        const emissionsPromises = data.map(async (order: Order) => {
          try {
            const emissionsResponse = await fetch(
              `https://eraswap.online/api/users/${user?.id}/emmissions/${order.id}`
            );
            if (emissionsResponse.ok) {
              const emissionsData = await emissionsResponse.json();
              return { orderId: order.id, co2: emissionsData.totalEmmissions || 0 };
            }
          } catch (error) {
            console.error(`Failed to fetch emissions for order ${order.id}`, error);
          }
          return { orderId: order.id, co2: 0 };
        });

        const emissionsResults = await Promise.all(emissionsPromises);
        const emissionsMap: Record<number, number> = {};
        emissionsResults.forEach(result => {
          emissionsMap[result.orderId] = result.co2;
        });
        setEmissionsData(emissionsMap);
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated, navigate]);

  const nextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === selectedItem.pictures.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItem.pictures.length - 1 : prev - 1
      );
    }
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
          
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Your Orders</h1>
          </div>
          <p className="text-muted-foreground">View all your furniture orders</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Start browsing furniture to make your first order!</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h3 className="text-lg mb-1">
                    Order from {new Date(order.timestamp).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {order.items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedItem(item);
                        setCurrentImageIndex(0);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={`https://eraswap.online${item.icon}`}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="mb-1">{item.name}</h4>
                        <div className="mb-2">
                          <div className="flex items-center gap-1.5">
                            <img 
                              src={eraCoinIcon} 
                              alt="EraCoin" 
                              className="w-5 h-5 inline-block"
                            />
                            <span className="text-primary text-lg">{item.price}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Total Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Total:</span>
                    <div className="flex items-center gap-1.5">
                      <img 
                        src={eraCoinIcon} 
                        alt="EraCoin" 
                        className="w-6 h-6 inline-block"
                      />
                      <span className="text-2xl text-primary">
                        {order.items.reduce((sum, item) => sum + parseFloat(item.price), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* CO2 Saved */}
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                    <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-muted-foreground">CO₂ Saved:</span>
                    <span className="text-green-600 dark:text-green-400">
                      {emissionsData[order.id] !== undefined 
                        ? `${emissionsData[order.id].toFixed(2)} kg`
                        : <Loader2 className="w-4 h-4 animate-spin inline-block" />
                      }
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                  <h3 className="text-xl">{selectedItem.name}</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Image Gallery */}
                  <div className="relative mb-6">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={`https://eraswap.online${selectedItem.pictures[currentImageIndex]}`}
                        alt={`${selectedItem.name} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {selectedItem.pictures.length > 1 && (
                      <>
                        <button
                          onClick={previousImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {selectedItem.pictures.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? "bg-white w-8"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <img 
                          src={eraCoinIcon} 
                          alt="EraCoin" 
                          className="w-8 h-8 inline-block"
                        />
                        <span className="text-3xl text-primary">{selectedItem.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
                    </div>

                    <div>
                      <h4 className="mb-2">Description</h4>
                      <p className="text-muted-foreground">{selectedItem.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}