import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "sonner@2.0.3";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "../contexts/RouterContext";
import { motion, AnimatePresence } from "motion/react";
import { Store, ArrowLeft, Loader2, X, ChevronLeft, ChevronRight, Plus, Upload } from "lucide-react";
import { EraCoinPrice } from "../components/EraCoinPrice";
import eraCoinIcon from "figma:asset/724febc18db287bf1715ab2a9524f2f860196cfb.png";

interface ListingItem {
  id: number;
  name: string;
  description: string;
  weight: string;
  price: string;
  icon: string;
  pictures: string[];
  category: string;
  order_id: number | null;
  listedbyid: number;
}

export function ListingsPage() {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [pictureFiles, setPictureFiles] = useState<File[]>([]);

  const categories = [
    "Electronics",
    "Office Electronics",
    "Storages Furniture",
    "Kitchen Electronics",
    "Kitchenware",
    "Tables",
    "Seating",
    "Beds",
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("home");
      return;
    }

    const fetchListings = async () => {
      try {
        const response = await fetch(`https://eraswap.online/api/users/listings/${user?.id}`);
        const data = await response.json();
        setListings(data);
      } catch (error) {
        toast.error("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'pictures') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (type === 'icon') {
        setIconFile(files[0]);
      } else if (type === 'pictures') {
        setPictureFiles(Array.from(files));
      }
    }
  };

  const handleSaveNewItem = async () => {
    if (!iconFile || pictureFiles.length === 0) {
      toast.error("Please upload an icon and at least one picture.");
      return;
    }

    if (pictureFiles.length > 10) {
      toast.error("Maximum 10 pictures allowed.");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('weight', newItem.weight);
    formData.append('category', newItem.category);
    formData.append('listedbyid', user?.id.toString() || '');
    formData.append('icon', iconFile);
    pictureFiles.forEach((file) => formData.append('pictures', file));

    try {
      const response = await fetch(`https://eraswap.online/api/items/`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        toast.success("Listing added successfully!");
        setShowNewItemForm(false);
        // Reset form
        setNewItem({
          name: "",
          description: "",
          price: "",
          weight: "",
          category: "",
        });
        setIconFile(null);
        setPictureFiles([]);
        // Refresh listings
        const listingsResponse = await fetch(`https://eraswap.online/api/users/listings/${user?.id}`);
        const listingsData = await listingsResponse.json();
        setListings(listingsData);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add listing.");
      }
    } catch (error) {
      console.error("Error adding listing:", error);
      toast.error("An error occurred while adding the listing.");
    } finally {
      setSaving(false);
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
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-primary" />
              <h1 className="text-3xl">Your Listings</h1>
            </div>
            {/* Add New Item Button */}
            <motion.button
              onClick={() => setShowNewItemForm(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Save new Item
            </motion.button>
          </div>
          <p className="text-muted-foreground">Manage all your furniture listings</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-20">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl text-foreground mb-2">No listings yet</h2>
            <p className="text-muted-foreground">Start listing furniture to help others!</p>
          </div>
        )}

        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <motion.div
                key={item.id}
                className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-900"
                onClick={() => {
                  setSelectedItem(item);
                  setCurrentImageIndex(0);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* SOLD Overlay - Only on Image */}
                {item.order_id !== null && (
                  <div className="absolute top-0 left-0 right-0 h-48 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-lg transform rotate-[-15deg] shadow-2xl border-4 border-white">
                      <p className="text-3xl tracking-wider">SOLD</p>
                    </div>
                  </div>
                )}

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
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                    {item.order_id !== null && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                        Sold
                      </span>
                    )}
                    {item.order_id === null && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                        Available
                      </span>
                    )}
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
                className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* SOLD Overlay on Modal */}
                {selectedItem.order_id !== null && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center pointer-events-none">
                    <div className="bg-red-600 text-white px-12 py-6 rounded-lg transform rotate-[-15deg] shadow-2xl border-4 border-white">
                      <p className="text-5xl tracking-wider">SOLD</p>
                    </div>
                  </div>
                )}

                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-20">
                  <div>
                    <h3 className="text-xl">{selectedItem.name}</h3>
                    {selectedItem.order_id !== null && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded mt-1 inline-block">
                        Sold
                      </span>
                    )}
                  </div>
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

                    {selectedItem.weight && parseFloat(selectedItem.weight) > 0 && (
                      <div>
                        <h4 className="mb-2">Weight</h4>
                        <p className="text-muted-foreground">{selectedItem.weight} kg</p>
                      </div>
                    )}

                    <div>
                      <h4 className="mb-2">Status</h4>
                      {selectedItem.order_id !== null ? (
                        <p className="text-red-600 dark:text-red-400">
                          This item has been sold (Order #{selectedItem.order_id})
                        </p>
                      ) : (
                        <p className="text-green-600 dark:text-green-400">
                          This item is available for purchase
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Item Form */}
        <AnimatePresence>
          {showNewItemForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewItemForm(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-20">
                  <div>
                    <h3 className="text-xl">Add New Listing</h3>
                  </div>
                  <button
                    onClick={() => setShowNewItemForm(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                          type="text"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (EraCoin)</label>
                        <input
                          type="number"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                        <input
                          type="number"
                          value={newItem.weight}
                          onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select
                          value={newItem.category}
                          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'icon')}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pictures</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileChange(e, 'pictures')}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveNewItem}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          ) : (
                            <Plus className="w-5 h-5 mr-2" />
                          )}
                          Add Listing
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}