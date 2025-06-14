import { Location } from '../services/locationService.js';

// Sample data for locations
// In a production environment, this would be replaced with database queries
const SAMPLE_LOCATIONS = {
  countries: ['usa', 'uk', 'canada', 'france', 'germany', 'japan', 'australia', 'china', 'india', 'brazil', 'mexico', 'nigeria', 'vietnam'],
  
  regions: {
    'usa': ['california', 'new york', 'texas', 'florida', 'illinois', 'pennsylvania', 'ohio', 'georgia', 'north carolina', 'michigan'],
    'uk': ['england', 'scotland', 'wales', 'northern ireland'],
    'canada': ['ontario', 'quebec', 'british columbia', 'alberta', 'manitoba', 'saskatchewan'],
    'france': ['ile-de-france', 'provence-alpes-cote d\'azur', 'hauts-de-france', 'nouvelle-aquitaine', 'auvergne-rhone-alpes'],
    'germany': ['bavaria', 'north rhine-westphalia', 'baden-württemberg', 'lower saxony', 'hesse'],
    'japan': ['kanto', 'kansai', 'chubu', 'kyushu', 'tohoku', 'hokkaido'],
    'australia': ['new south wales', 'victoria', 'queensland', 'western australia', 'south australia'],
    'china': ['guangdong', 'jiangsu', 'shandong', 'zhejiang', 'henan', 'sichuan', 'hubei', 'fujian'],
    'india': ['maharashtra', 'tamil nadu', 'karnataka', 'uttar pradesh', 'gujarat', 'west bengal', 'telangana'],
    'brazil': ['sao paulo', 'rio de janeiro', 'minas gerais', 'bahia', 'parana', 'rio grande do sul'],
    'mexico': ['mexico city', 'jalisco', 'nuevo leon', 'guanajuato', 'chihuahua', 'baja california'],
    'nigeria': ['lagos', 'kano', 'abuja', 'rivers'],
    'vietnam': ['ho chi minh city', 'hanoi', 'da nang', 'can tho', 'hai phong']
  },
  
  cities: {
    'usa': {
      'california': ['los angeles', 'san francisco', 'san diego', 'san jose', 'sacramento'],
      'new york': ['new york', 'buffalo', 'rochester', 'yonkers', 'syracuse'],
      'texas': ['houston', 'san antonio', 'dallas', 'austin', 'fort worth'],
      'florida': ['miami', 'orlando', 'tampa', 'jacksonville', 'st. petersburg'],
      'illinois': ['chicago', 'aurora', 'naperville', 'joliet', 'rockford']
    },
    'uk': {
      'england': ['london', 'manchester', 'birmingham', 'liverpool', 'leeds'],
      'scotland': ['edinburgh', 'glasgow', 'aberdeen', 'dundee', 'inverness'],
      'wales': ['cardiff', 'swansea', 'newport', 'bangor', 'st davids'],
      'northern ireland': ['belfast', 'derry', 'lisburn', 'newry', 'armagh']
    },
    'canada': {
      'ontario': ['toronto', 'ottawa', 'mississauga', 'brampton', 'hamilton'],
      'quebec': ['montreal', 'quebec city', 'laval', 'gatineau', 'sherbrooke'],
      'british columbia': ['vancouver', 'victoria', 'surrey', 'burnaby', 'richmond']
    },
    'india': {
      'maharashtra': ['mumbai', 'pune', 'nagpur', 'thane', 'nashik'],
      'tamil nadu': ['chennai', 'coimbatore', 'madurai', 'tiruchirappalli', 'salem'],
      'karnataka': ['bangalore', 'mysore', 'hubli', 'mangalore', 'belgaum'],
      'uttar pradesh': ['lucknow', 'kanpur', 'agra', 'varanasi', 'meerut']
    }
    // Add more as needed
  }
};

/**
 * Get all available countries
 */
// Return raw country codes for API responses but display formatted names
export const getCountries = async (req, res) => {
  try {
    // Return the raw country codes (lowercase)
    const countries = SAMPLE_LOCATIONS.countries;
    
    // But also provide display names
    const displayNames = countries.map(country => 
      country.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
    
    res.json({
      codes: countries,
      displayNames: displayNames
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

/**
 * Get regions for a specific country
 */
export const getRegions = async (req, res) => {
  try {
    const { country } = req.query;
    
    if (!country) {
      return res.status(400).json({ error: 'Country parameter is required' });
    }
    
    const countryLower = country.toLowerCase();
    
    // In production, we would get this from the database
    // For example: const regions = await Location.distinct('region', { country: countryLower });
    
    const regions = SAMPLE_LOCATIONS.regions[countryLower] || [];
    
    // Format region names for display (capitalize)
    const formattedRegions = regions.map(region => 
      region.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
    
    res.json(formattedRegions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
};

/**
 * Get cities for a specific country and region
 */
export const getCities = async (req, res) => {
  try {
    const { country, region } = req.query;
    
    if (!country || !region) {
      return res.status(400).json({ error: 'Country and region parameters are required' });
    }
    
    const countryLower = country.toLowerCase();
    const regionLower = region.toLowerCase();
    
    // In production, we would get this from the database
    // For example: const cities = await Location.distinct('city', { country: countryLower, region: regionLower });
    
    const cities = SAMPLE_LOCATIONS.cities[countryLower]?.[regionLower] || [];
    
    // Format city names for display (capitalize)
    const formattedCities = cities.map(city => 
      city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
    
    res.json(formattedCities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

/**
 * Get location data
 * This is a wrapper around the getLocationData service
 */
export const getLocation = async (req, res) => {
  try {
    const { country, region, city } = req.query;
    
    if (!country) {
      return res.status(400).json({ error: 'Country parameter is required' });
    }
    
    const locationData = await getLocationData({
      country,
      region,
      city
    });
    
    res.json(locationData);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
};