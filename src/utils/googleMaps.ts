import { API_CONFIG } from '../config/api';

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

let isGoogleMapsLoaded = false;
let googleMapsPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  if (isGoogleMapsLoaded) {
    return Promise.resolve();
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      isGoogleMapsLoaded = true;
      resolve();
      return;
    }

    // Create callback function
    window.initGoogleMaps = () => {
      isGoogleMapsLoaded = true;
      resolve();
    };

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_CONFIG.googleMaps.apiKey}&libraries=${API_CONFIG.googleMaps.libraries.join(',')}&callback=initGoogleMaps&region=${API_CONFIG.googleMaps.region}&language=${API_CONFIG.googleMaps.language}`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export const calculateDistance = (
  origin: google.maps.LatLng | string,
  destination: google.maps.LatLng | string
): Promise<{ distance: number; duration: number }> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps API not loaded'));
      return;
    }

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      if (status === google.maps.DistanceMatrixStatus.OK && response) {
        const element = response.rows[0].elements[0];
        if (element.status === 'OK') {
          resolve({
            distance: element.distance.value / 1000, // Convert to km
            duration: element.duration.value / 60 // Convert to minutes
          });
        } else {
          reject(new Error('Could not calculate distance'));
        }
      } else {
        reject(new Error('Distance Matrix request failed'));
      }
    });
  });
};