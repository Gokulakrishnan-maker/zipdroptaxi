declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              types?: string[];
              componentRestrictions?: { country: string };
            }
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
              geometry?: {
                location: {
                  lat: () => number;
                  lng: () => number;
                };
              };
            };
          };
        };
        DistanceMatrixService: new () => {
          getDistanceMatrix: (
            options: {
              origins: string[];
              destinations: string[];
              travelMode: string;
              unitSystem: number;
            },
            callback: (response: any, status: string) => void
          ) => void;
        };
        DistanceMatrixStatus: {
          OK: string;
        };
        TravelMode: {
          DRIVING: string;
        };
        UnitSystem: {
          METRIC: number;
        };
      };
    };
  }
}

export {};