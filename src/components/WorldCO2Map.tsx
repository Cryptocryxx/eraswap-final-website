import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingDown, Leaf, Recycle, Globe, Loader2 } from "lucide-react";
import { fetchEurostatData, clearCache, type ProcessedCountryData } from "../services/eurostatService";

interface CountryData {
  name: string;
  shortName: string;
  co2: number;
  furniture: number;
  population: number;
  perCapita: number;
  reduction: number;
}

const impactData = [
  { category: "CO₂ Saved", value: 78, color: "#86C232" },
  { category: "Still Emitted", value: 22, color: "#969C76" }
];

export function WorldCO2Map() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [view, setView] = useState<'bar' | 'comparison' | 'impact'>('bar');
  const [showReduction, setShowReduction] = useState(true);
  const [loading, setLoading] = useState(true);
  const [countryData, setCountryData] = useState<ProcessedCountryData[]>([]);

  // Fetch Eurostat data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchEurostatData();
        setCountryData(data);
      } catch (error) {
        console.error("Error loading Eurostat data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const totalCO2 = countryData.reduce((sum, country) => sum + country.co2, 0);
  const totalReduction = countryData.reduce((sum, country) => sum + country.reduction, 0);
  
  // Portugal-specific data (EraSwap is only implemented in Portugal)
  const portugalData = countryData.find(c => c.shortName === 'PT');
  const portugalReduction = portugalData?.reduction || 0;

  // Create comparison data for bar chart
  // EraSwap is only implemented in Portugal
  const comparisonData = countryData.map(country => ({
    ...country,
    withEraSwap: country.shortName === 'PT' ? country.co2 * 0.22 : 0 // Only show reduction for Portugal
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading live Eurostat data...</p>
        </div>
      </div>
    );
  }

  if (countryData.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-gradient-to-br from-[#61892F] to-[#86C232] rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Globe className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{formatNumber(totalCO2)}</div>
          <div className="text-sm opacity-90">CO₂ from Discarded Furniture (tons/year)</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#466B8A] to-[#466B8A] rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Recycle className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{formatNumber(portugalReduction)}</div>
          <div className="text-sm opacity-90">Portugal&apos;s Furniture Waste CO₂ Reduction</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#FF7A21] to-[#FF7A21] rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Leaf className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">78%</div>
          <div className="text-sm opacity-90">Reduction with EraSwap</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#B33D54] to-[#B33D54] rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TrendingDown className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{countryData.length}</div>
          <div className="text-sm opacity-90">European Countries</div>
        </motion.div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-3 justify-center">
        <motion.button
          onClick={() => setView('bar')}
          className={`px-6 py-2 rounded-lg transition-all ${
            view === 'bar'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Country Rankings
        </motion.button>
        <motion.button
          onClick={() => setView('impact')}
          className={`px-6 py-2 rounded-lg transition-all ${
            view === 'impact'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Impact Breakdown
        </motion.button>
      </div>

      {/* Main Visualization Area */}
      <motion.div
        key={view}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
      >
        {view === 'bar' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-foreground">CO₂ Emissions from Furniture Waste by Country</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showReduction}
                  onChange={(e) => setShowReduction(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-muted-foreground">Show EraSwap Impact</span>
              </label>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="shortName" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number) => formatNumber(value) + ' tons'}
                  labelFormatter={(label) => {
                    const country = countryData.find(c => c.shortName === label);
                    return country?.name || label;
                  }}
                />
                <Bar
                  dataKey="co2"
                  fill="#AC3933"
                  radius={[8, 8, 0, 0]}
                  onClick={(data) => setSelectedCountry(data as CountryData)}
                  className="cursor-pointer"
                  name="Current Emissions"
                />
                {showReduction && (
                  <Bar
                    dataKey="withEraSwap"
                    fill="#86C232"
                    radius={[8, 8, 0, 0]}
                    onClick={(data) => setSelectedCountry(data as CountryData)}
                    className="cursor-pointer"
                    name="With EraSwap (78% reduction)"
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {showReduction ? (
                <span>Red bars show current emissions for all countries. Green bar shows Portugal&apos;s reduced emissions with EraSwap (currently implemented only in PT)</span>
              ) : (
                <span>Toggle &apos;Show EraSwap Impact&apos; to see Portugal&apos;s reduction</span>
              )}
            </div>
          </div>
        )}

        {view === 'impact' && (
          <div>
            <h3 className="text-2xl mb-6 text-foreground">EraSwap Environmental Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impactData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-sm text-muted-foreground">
                  Potential CO₂ Reduction with EraSwap
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#D7F4CF' }}>
                  <div className="text-sm text-muted-foreground">Portugal CO₂ Saved Annually</div>
                  <div className="text-3xl" style={{ color: '#61892F' }}>
                    {formatNumber(portugalReduction)} tons
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#CAE0A9' }}>
                  <div className="text-sm text-muted-foreground">Equivalent to</div>
                  <div className="text-2xl" style={{ color: '#466B8A' }}>
                    {formatNumber(Math.round(portugalReduction / 4.6))} cars off the road
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#BCFFE8' }}>
                  <div className="text-sm text-muted-foreground">Trees Saved</div>
                  <div className="text-2xl" style={{ color: '#61892F' }}>
                    {formatNumber(Math.round((portugalReduction * 1000) / 20))} trees/year
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Interactive Country Cards */}
      <div>
        <h3 className="text-xl mb-4 text-foreground">Country Details - Click to Explore</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {countryData.map((country, index) => (
            <motion.div
              key={country.shortName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCountry(country)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedCountry?.shortName === country.shortName
                  ? 'bg-primary text-white shadow-xl scale-105'
                  : 'bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-102'
              }`}
            >
              <div className={`text-2xl mb-1 ${
                country.shortName === 'PT' 
                  ? 'font-extrabold text-green-600 dark:text-green-400' 
                  : 'font-bold'
              }`}>
                {country.shortName}
              </div>
              <div className="text-sm opacity-80">{country.name}</div>
              <div className="text-xs mt-2 opacity-70">
                {(country.co2 / 1000).toFixed(0)}K tons CO₂
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Country Detail Panel */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-primary/10 to-green-500/10 rounded-xl p-8 overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl text-foreground">{selectedCountry.name}</h3>
              <motion.button
                onClick={() => setSelectedCountry(null)}
                className="text-muted-foreground hover:text-foreground transition-colors text-2xl"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-sm text-muted-foreground mb-2">CO₂ from Discarded Furniture</div>
                <div className="text-3xl mb-2" style={{ color: '#AC3933' }}>
                  {formatNumber(selectedCountry.co2)}
                </div>
                <div className="text-xs text-muted-foreground">tons per year</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-sm text-muted-foreground mb-2">Furniture Items Discarded</div>
                <div className="text-3xl mb-2" style={{ color: '#FF7A21' }}>
                  {formatNumber(selectedCountry.furniture)}
                </div>
                <div className="text-xs text-muted-foreground">items per year</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-sm text-muted-foreground mb-2">Per Capita CO₂ Emissions</div>
                <div className="text-3xl mb-2" style={{ color: '#B33D54' }}>
                  {selectedCountry.perCapita.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">kg CO₂ per person</div>
              </div>
            </div>

            <div className="mt-6 p-6 bg-green-500/20 rounded-lg border-2 border-green-500">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-500" />
                <h4 className="text-lg text-foreground">
                  {selectedCountry.shortName === 'PT' ? 'With EraSwap (Active)' : 'Potential with EraSwap'}
                </h4>
              </div>
              <div className="text-4xl text-green-600 dark:text-green-500 mb-2">
                {formatNumber(selectedCountry.reduction)} tons
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedCountry.shortName === 'PT' 
                  ? 'Actual CO₂ reduction per year through EraSwap implementation in Portugal'
                  : 'CO₂ reduction potential per year (78% reduction through furniture reuse and circular economy)'
                }
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Source Citation */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-muted-foreground text-center">
          <span className="font-semibold">Datenquelle:</span> Eurostat (European Statistical Office) - Municipal waste by waste management operations (env_wasmun) und Bevölkerungsdaten (demo_pjan), 2023. 
          CO₂-Berechnungen basieren auf 6% Möbelanteil am Hausmüll und 0,45 kg CO₂/kg Möbelabfall. 
          EraSwap-Reduktion: 78% durch Wiederverwendung und Kreislaufwirtschaft.
        </p>
      </div>
    </div>
  );
}