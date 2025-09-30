// Google Maps utility functions
export const initializeAutocomplete = (
  inputElement: HTMLInputElement,
  onPlaceSelected: (place: string) => void
) => {
  if (!window.google || !window.google.maps) {
    console.warn('Google Maps API not loaded');
    return null;
  }

  const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
    types: ['(cities)'],
    componentRestrictions: { country: 'in' }
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      onPlaceSelected(place.formatted_address);
    }
  });

  return autocomplete;
};

export const calculateDistance = (
  origin: string,
  destination: string
): Promise<{ distance: number; duration: string }> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      // Fallback to mock calculation
      const mockDistance = Math.floor(Math.random() * 400) + 100;
      const duration = Math.floor(mockDistance / 60 * 60);
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      resolve({
        distance: mockDistance,
        duration: durationStr
      });
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();
    
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC
    }, (response, status) => {
      if (status === window.google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status === 'OK') {
        const element = response.rows[0].elements[0];
        const distance = Math.round(element.distance.value / 1000); // Convert to km
        const duration = element.duration.text;
        
        resolve({ distance, duration });
      } else {
        // Fallback to mock calculation
        const mockDistance = Math.floor(Math.random() * 400) + 100;
        const duration = Math.floor(mockDistance / 60 * 60);
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        
        resolve({
          distance: mockDistance,
          duration: durationStr
        });
      }
    });
  });
};