/**
 * Eurostat SDMX-JSON Data Service
 * Fetches and processes municipal waste and population data
 */

// Configuration constants
const FURNITURE_WASTE_PERCENTAGE = 0.06; // 6% of municipal waste
const CO2_PER_KG_FURNITURE = 0.45; // kg CO2 per kg furniture waste
const ERASWAP_REDUCTION_RATE = 0.78; // 78% reduction
const CARS_CO2_PER_YEAR = 4.6; // tons CO2 per car per year
const TREE_CO2_ABSORPTION_PER_YEAR = 20; // kg CO2 per tree per year
const AVG_FURNITURE_WEIGHT_KG = 30; // average weight per furniture item

// Eurostat API endpoints with exact filters
const WASTE_API_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/env_wasmun?freq=A&wst_oper=GEN&unit=KG_HAB&time=2023';
const POPULATION_API_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?freq=A&age=TOTAL&sex=T&unit=NR&time=2023';

// Cache keys
const CACHE_KEY_WASTE = 'eurostat_waste_data_2023';
const CACHE_KEY_POPULATION = 'eurostat_population_data_2023';
const CACHE_KEY_PROCESSED = 'eurostat_processed_data_2023_v4'; // Updated version to force refresh
const CACHE_TIMESTAMP_KEY = 'eurostat_data_timestamp_v4'; // Updated version to force refresh
const CACHE_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

interface SDMXResponse {
  value: { [key: string]: number };
  dimension: {
    geo: {
      category: {
        index: { [code: string]: number };
        label: { [code: string]: string };
      };
    };
  };
}

interface CountryWasteData {
  code: string;
  name: string;
  wastePerCapita?: number; // kg per person per year
  population?: number; // total population
}

export interface ProcessedCountryData {
  name: string;
  shortName: string;
  co2: number; // tons CO2 from furniture waste per year
  furniture: number; // estimated furniture items discarded per year
  population: number; // population in millions
  perCapita: number; // kg CO2 per person per year
  reduction: number; // tons CO2 saved with EraSwap
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(): boolean {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return false;
  
  const cacheAge = Date.now() - parseInt(timestamp, 10);
  return cacheAge < CACHE_DURATION_MS;
}

/**
 * Get cached data if available and valid
 */
function getCachedData(): ProcessedCountryData[] | null {
  if (!isCacheValid()) {
    return null;
  }
  
  const cached = localStorage.getItem(CACHE_KEY_PROCESSED);
  if (!cached) return null;
  
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

/**
 * Cache processed data
 */
function cacheData(data: ProcessedCountryData[]): void {
  localStorage.setItem(CACHE_KEY_PROCESSED, JSON.stringify(data));
  localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
}

/**
 * Parse SDMX-JSON response and build country lookup
 */
function parseSDMXResponse(response: SDMXResponse): Map<string, { name: string; value: number }> {
  const result = new Map<string, { name: string; value: number }>();
  
  // Build lookup from geo index to country code
  const geoIndex = response.dimension.geo.category.index;
  const geoLabels = response.dimension.geo.category.label;
  const values = response.value;
  
  // Create reverse lookup: position -> country code
  const positionToCode = new Map<number, string>();
  Object.entries(geoIndex).forEach(([code, position]) => {
    positionToCode.set(position, code);
  });
  
  // Map values to countries
  Object.entries(values).forEach(([position, value]) => {
    const posNum = parseInt(position, 10);
    const code = positionToCode.get(posNum);
    
    if (code && geoLabels[code]) {
      result.set(code, {
        name: geoLabels[code],
        value: value
      });
    }
  });
  
  return result;
}

/**
 * Fetch waste data from Eurostat
 */
async function fetchWasteData(): Promise<Map<string, { name: string; value: number }>> {
  const response = await fetch(WASTE_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch waste data: ${response.statusText}`);
  }
  
  const data: SDMXResponse = await response.json();
  return parseSDMXResponse(data);
}

/**
 * Fetch population data from Eurostat
 */
async function fetchPopulationData(): Promise<Map<string, { name: string; value: number }>> {
  const response = await fetch(POPULATION_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch population data: ${response.statusText}`);
  }
  
  const data: SDMXResponse = await response.json();
  return parseSDMXResponse(data);
}

/**
 * Calculate CO2 emissions and other metrics for a country
 */
function calculateMetrics(
  wastePerCapitaKg: number,
  population: number
): {
  totalMunicipalWasteKg: number;
  furnitureWasteKg: number;
  co2EmissionsTons: number;
  co2WithEraSwapTons: number;
  co2SavedTons: number;
  furnitureItemsDiscarded: number;
  perCapitaCO2Kg: number;
} {
  // Total municipal waste in kg per year
  const totalMunicipalWasteKg = population * wastePerCapitaKg;
  
  // Furniture waste (6% of total)
  const furnitureWasteKg = totalMunicipalWasteKg * FURNITURE_WASTE_PERCENTAGE;
  
  // CO2 emissions from furniture waste
  const co2EmissionsKg = furnitureWasteKg * CO2_PER_KG_FURNITURE;
  const co2EmissionsTons = co2EmissionsKg / 1000;
  
  // With EraSwap (22% remaining after 78% reduction)
  const co2WithEraSwapTons = co2EmissionsTons * (1 - ERASWAP_REDUCTION_RATE);
  
  // CO2 saved
  const co2SavedTons = co2EmissionsTons * ERASWAP_REDUCTION_RATE;
  
  // Furniture items discarded
  const furnitureItemsDiscarded = Math.round(furnitureWasteKg / AVG_FURNITURE_WEIGHT_KG);
  
  // Per capita CO2
  const perCapitaCO2Kg = (co2EmissionsTons * 1000) / population;
  
  return {
    totalMunicipalWasteKg,
    furnitureWasteKg,
    co2EmissionsTons,
    co2WithEraSwapTons,
    co2SavedTons,
    furnitureItemsDiscarded,
    perCapitaCO2Kg
  };
}

/**
 * Get country short name from code
 */
function getShortName(code: string): string {
  const shortNames: { [key: string]: string } = {
    'AT': 'AT', 'BE': 'BE', 'BG': 'BG', 'CY': 'CY', 'CZ': 'CZ', 'DE': 'DE',
    'DK': 'DK', 'EE': 'EE', 'EL': 'GR', 'ES': 'ES', 'FI': 'FI', 'FR': 'FR',
    'HR': 'HR', 'HU': 'HU', 'IE': 'IE', 'IT': 'IT', 'LT': 'LT', 'LU': 'LU',
    'LV': 'LV', 'MT': 'MT', 'NL': 'NL', 'PL': 'PL', 'PT': 'PT', 'RO': 'RO',
    'SE': 'SE', 'SI': 'SI', 'SK': 'SK', 'UK': 'UK'
  };
  return shortNames[code] || code;
}

/**
 * Main function to fetch and process Eurostat data
 */
export async function fetchEurostatData(): Promise<ProcessedCountryData[]> {
  // Check cache first
  const cached = getCachedData();
  if (cached) {
    console.log('Using cached Eurostat data');
    return cached;
  }
  
  console.log('Fetching fresh Eurostat data...');
  
  // Codes to exclude (EU aggregates and non-country entities)
  const excludedCodes = new Set([
    'EU', 'EU27_2020', 'EU28', 'EU27', 'EA', 'EA19', 'EA20', 
    'EFTA', 'EEA', 'EEA30_2007', 'EEA31',
    // Additional countries to exclude
    'EL', 'GR', 'RO', 'CZ', 'TR', 'BG', 'EE', 'CY', 'AL', 'MK', 
    'SI', 'SL', 'LT', 'FI', 'RS', 'HR'
  ]);
  
  try {
    // Fetch both datasets in parallel
    const [wasteData, populationData] = await Promise.all([
      fetchWasteData(),
      fetchPopulationData()
    ]);
    
    // Combine data and calculate metrics
    const processedData: ProcessedCountryData[] = [];
    
    // Iterate through waste data
    wasteData.forEach((waste, code) => {
      // Skip EU aggregates and non-country entities
      if (excludedCodes.has(code)) {
        return;
      }
      
      const population = populationData.get(code);
      
      // Skip if we don't have both waste and population data
      if (!population || !waste.value || !population.value) {
        return;
      }
      
      const metrics = calculateMetrics(waste.value, population.value);
      
      processedData.push({
        name: waste.name,
        shortName: getShortName(code),
        co2: Math.round(metrics.co2EmissionsTons),
        furniture: metrics.furnitureItemsDiscarded,
        population: parseFloat((population.value / 1_000_000).toFixed(1)), // Convert to millions
        perCapita: parseFloat(metrics.perCapitaCO2Kg.toFixed(1)),
        reduction: Math.round(metrics.co2SavedTons)
      });
    });
    
    // Sort by CO2 emissions (descending)
    processedData.sort((a, b) => b.co2 - a.co2);
    
    // Remove the last 4 countries with lowest emissions
    const filteredData = processedData.slice(0, -4);
    
    // Cache the processed data
    cacheData(filteredData);
    
    console.log(`Processed ${filteredData.length} countries from Eurostat (excluded 4 lowest emitters)`);
    return filteredData;
    
  } catch (error) {
    console.error('Error fetching Eurostat data:', error);
    
    // Return fallback data if API fails
    return getFallbackData();
  }
}

/**
 * Fallback data in case API fails
 */
function getFallbackData(): ProcessedCountryData[] {
  return [
    {
      name: "Germany",
      shortName: "DE",
      co2: 320000,
      furniture: 2100000,
      population: 83,
      perCapita: 3.9,
      reduction: 249600
    },
    {
      name: "United Kingdom",
      shortName: "UK",
      co2: 285000,
      furniture: 1800000,
      population: 67,
      perCapita: 4.3,
      reduction: 222300
    },
    {
      name: "France",
      shortName: "FR",
      co2: 245000,
      furniture: 1600000,
      population: 65,
      perCapita: 3.8,
      reduction: 191100
    },
    {
      name: "Italy",
      shortName: "IT",
      co2: 218000,
      furniture: 1500000,
      population: 60,
      perCapita: 3.6,
      reduction: 170040
    },
    {
      name: "Spain",
      shortName: "ES",
      co2: 192000,
      furniture: 1300000,
      population: 47,
      perCapita: 4.1,
      reduction: 149760
    },
    {
      name: "Poland",
      shortName: "PL",
      co2: 178000,
      furniture: 1250000,
      population: 38,
      perCapita: 4.7,
      reduction: 138840
    },
    {
      name: "Netherlands",
      shortName: "NL",
      co2: 95000,
      furniture: 680000,
      population: 17.5,
      perCapita: 5.4,
      reduction: 74100
    },
    {
      name: "Sweden",
      shortName: "SE",
      co2: 89000,
      furniture: 640000,
      population: 10.4,
      perCapita: 8.6,
      reduction: 69420
    },
    {
      name: "Greece",
      shortName: "GR",
      co2: 92000,
      furniture: 650000,
      population: 10.7,
      perCapita: 8.6,
      reduction: 71760
    },
    {
      name: "Portugal",
      shortName: "PT",
      co2: 82000,
      furniture: 580000,
      population: 10.3,
      perCapita: 8.0,
      reduction: 63960
    }
  ];
}

/**
 * Clear cached data (useful for manual refresh)
 */
export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY_WASTE);
  localStorage.removeItem(CACHE_KEY_POPULATION);
  localStorage.removeItem(CACHE_KEY_PROCESSED);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}