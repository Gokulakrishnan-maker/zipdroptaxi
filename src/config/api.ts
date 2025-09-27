// Google Maps API Configuration
export const GOOGLE_MAPS_API_KEY = 'AIzaSyAotFoXiVJdw4lmgMw1p6C1-FjvF6H0ca0';


// API endpoints and configuration
export const API_CONFIG = {
  googleMaps: {
    apiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry'],
    region: 'IN',
    language: 'en'
  },
  
  // Distance Matrix API for fare calculation
  distanceMatrix: {
    baseUrl: 'https://maps.googleapis.com/maps/api/distancematrix/json',
    units: 'metric',
    mode: 'driving',
    origins: 'Coimbatore,Tamil Nadu,India',
    avoidHighways: false,
    avoidTolls: false
  },
  
  // Places API for location autocomplete
  places: {
    baseUrl: 'https://maps.googleapis.com/maps/api/place',
    types: 'establishment|geocode',
    componentRestrictions: { country: 'IN' },
    // Coimbatore bounds for better local suggestions
    bounds: {
      southwest: { lat: 10.8, lng: 76.8 },
      northeast: { lat: 11.2, lng: 77.2 }
    }
  }
};

// Fare calculation utilities
export const FARE_CONFIG = {
  baseFare: 50,
  perKmRate: {
    economy: 18,
    premium: 25,
    executive: 35
  },
  waitingCharges: 2, // per minute
  nightSurcharge: 0.25, // 25% between 11 PM - 5 AM
  acSurcharge: 3, // per km
  tollCharges: 'actual', // added to final fare
  driverAllowance: {
    outstation: 500, // per day for outstation trips
    overnight: 300 // if driver stays overnight
  }
};
