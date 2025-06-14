//this is api/services/locationService.js file 
import fetch from 'node-fetch';
import mongoose from 'mongoose';

// Schema for caching location data
const locationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  region: { type: String },
  city: { type: String },
  population: Number,
  gdpPerCapita: Number,
  urbanizationRate: Number,
  marketTier: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

// Create a TTL index to refresh data periodically (e.g., every 30 days)
locationSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 2592000 });

// Create a compound index for efficient lookups
locationSchema.index({ country: 1, region: 1, city: 1 });

export const Location = mongoose.model('Location', locationSchema);

// Market tier definitions
const MARKET_TIERS = {
  TIER_1: 1, // Major global markets
  TIER_2: 2, // Developed urban centers
  TIER_3: 3, // Emerging urban markets
  TIER_4: 4, // Developing markets
  TIER_5: 5  // Frontier markets
};

// Map of known major cities to their market tiers
const MAJOR_CITIES = {
  'new york': { country: 'usa', tier: MARKET_TIERS.TIER_1 },
  'london': { country: 'uk', tier: MARKET_TIERS.TIER_1 },
  'tokyo': { country: 'japan', tier: MARKET_TIERS.TIER_1 },
  'paris': { country: 'france', tier: MARKET_TIERS.TIER_1 },
  'berlin': { country: 'germany', tier: MARKET_TIERS.TIER_2 },
  // Add more known cities as needed
};

// Map countries to default market tiers
const COUNTRY_TIERS = {
  'usa': MARKET_TIERS.TIER_1,
  'canada': MARKET_TIERS.TIER_1,
  'uk': MARKET_TIERS.TIER_1,
  'germany': MARKET_TIERS.TIER_1,
  'france': MARKET_TIERS.TIER_1,
  'japan': MARKET_TIERS.TIER_1,
  'australia': MARKET_TIERS.TIER_1,
  'china': MARKET_TIERS.TIER_2,
  'india': MARKET_TIERS.TIER_3,
  'brazil': MARKET_TIERS.TIER_3,
  'mexico': MARKET_TIERS.TIER_3,
  'vietnam': MARKET_TIERS.TIER_4,
  'nigeria': MARKET_TIERS.TIER_4,
  'north korea': MARKET_TIERS.TIER_5,
  // Add more countries as needed
};

/**
 * Get location data from the database or external sources
 * @param {Object} location - Location object with country, region, and city
 * @returns {Promise<Object>} Location data with market tier information
 */
export async function getLocationData(location) {
  if (!location || !location.country) {
    return { marketTier: MARKET_TIERS.TIER_3 }; // Default to mid-tier
  }

  const { country, region, city } = location;
  const countryLower = country.toLowerCase();
  const cityLower = city?.toLowerCase();

  try {
    // Step 1: Check if we have this exact location cached in the database
    let locationData = await Location.findOne({
      country: countryLower,
      ...(region && { region: region.toLowerCase() }),
      ...(city && { city: cityLower })
    });

    if (locationData) {
      return {
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
        population: locationData.population,
        gdpPerCapita: locationData.gdpPerCapita,
        urbanizationRate: locationData.urbanizationRate,
        marketTier: locationData.marketTier
      };
    }

    // Step 2: If not in database, try to determine the market tier
    let marketTier;
    let populationData = null;
    let gdpData = null;

    // Check if it's a known major city
    if (cityLower && MAJOR_CITIES[cityLower]) {
      marketTier = MAJOR_CITIES[cityLower].tier;
    } 
    // Check if we know the country's default tier
    else if (COUNTRY_TIERS[countryLower]) {
      marketTier = COUNTRY_TIERS[countryLower];
      
      // If it's a city, adjust tier based on city status (assuming capital or major city is one tier higher)
      if (cityLower && isMajorCity(cityLower, countryLower)) {
        marketTier = Math.max(1, marketTier - 1); // Move up one tier, but not above Tier 1
      }
    } 
    // Default fallback
    else {
      marketTier = MARKET_TIERS.TIER_3; // Default to mid-tier for unknown locations
    }

    // Step 3: Try to get additional data from external APIs
    try {
      // This would be replaced with actual API calls
      // For example, World Bank API for country GDP data
      if (countryLower) {
        const data = await fetchCountryData(countryLower);
        if (data) {
          gdpData = data.gdpPerCapita;
          populationData = data.population;
        }
      }
    } catch (apiError) {
      console.error('API fetch error:', apiError);
      // Continue with what we have
    }

    // Step 4: Save this location to the database for future use
    locationData = new Location({
      country: countryLower,
      region: region?.toLowerCase(),
      city: cityLower,
      population: populationData,
      gdpPerCapita: gdpData,
      marketTier: marketTier,
      lastUpdated: new Date()
    });

    await locationData.save();

    // Return the location data
    return {
      country: countryLower,
      region: region?.toLowerCase(),
      city: cityLower,
      population: populationData,
      gdpPerCapita: gdpData,
      marketTier: marketTier
    };
  } catch (error) {
    console.error('Error retrieving location data:', error);
    // Return default values in case of error
    return {
      marketTier: COUNTRY_TIERS[countryLower] || MARKET_TIERS.TIER_3
    };
  }
}

/**
 * Simple check if a city is a major/capital city in a country
 * In production, this would be replaced with a more comprehensive database
 */
function isMajorCity(city, country) {
  const majorCities = {
    'usa': ['washington', 'los angeles', 'chicago', 'houston', 'miami'],
    'uk': ['london', 'manchester', 'birmingham', 'edinburgh', 'glasgow'],
    'india': ['new delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata'],
    // Add more countries and their major cities
  };
  
  return majorCities[country]?.includes(city) || false;
}

/**
 * Fetch country data from external APIs
 * This is a placeholder that would be replaced with actual API calls
 */
async function fetchCountryData(country) {
  try {
    // This would be an actual API call in production
    // For example:
    // const response = await fetch(`https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.PCAP.CD?format=json`);
    // const data = await response.json();
    
    // For now, returning sample data
    const sampleData = {
      'usa': { gdpPerCapita: 63543.58, population: 331449281 },
      'india': { gdpPerCapita: 1927.71, population: 1393409038 },
      'germany': { gdpPerCapita: 41071.31, population: 83900473 },
      'nigeria': { gdpPerCapita: 2097.09, population: 211400708 },
      // Add more sample data as needed
    };
    
    return sampleData[country] || { gdpPerCapita: 10000, population: 1000000 };
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}


// Add connection check before DB operations
async function checkConnection() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}
