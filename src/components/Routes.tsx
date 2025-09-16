import React from 'react';
import { MapPin, ArrowRight, Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';

const Routes = () => {
  const [expandedCity, setExpandedCity] = React.useState<string | null>(null);

  const popularRoutes = [
    {
      from: 'Chennai',
      to: 'Madurai',
      distance: '458 km',
      duration: '7h 30m',
      price: 'From ₹6,812',
      rating: 4.8,
      bookings: '500+ bookings'
    },
    {
      from: 'Chennai',
      to: 'Coimbatore',
      distance: '500 km',
      duration: '8h',
      price: 'From ₹7,400',
      rating: 4.9,
      bookings: '750+ bookings'
    },
    {
      from: 'Madurai',
      to: 'Chennai',
      distance: '458 km',
      duration: '7h 30m',
      price: 'From ₹6,812',
      rating: 4.7,
      bookings: '400+ bookings'
    },
    {
      from: 'Chennai',
      to: 'Salem',
      distance: '340 km',
      duration: '5h 30m',
      price: 'From ₹5,160',
      rating: 4.8,
      bookings: '350+ bookings'
    },
    {
      from: 'Chennai',
      to: 'Tiruchirappalli',
      distance: '320 km',
      duration: '5h',
      price: 'From ₹4,880',
      rating: 4.6,
      bookings: '200+ bookings'
    },
    {
      from: 'Chennai',
      to: 'Thanjavur',
      distance: '350 km',
      duration: '6h',
      price: 'From ₹5,300',
      rating: 4.9,
      bookings: '150+ bookings'
    }
  ];

  const handleBookRoute = (from: string, to: string) => {
    // Auto-fill the booking form
    const pickupInput = document.querySelector('input[name="pickupLocation"]') as HTMLInputElement;
    const dropInput = document.querySelector('input[name="dropLocation"]') as HTMLInputElement;
    
    if (pickupInput) pickupInput.value = from;
    if (dropInput) dropInput.value = to;
    
    // Scroll to booking form
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="routes" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Routes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most booked taxi routes across Tamil Nadu with transparent pricing and professional service.
            All routes available for both one-way and round-trip bookings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularRoutes.map((route, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Route Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6">
                <div className="flex items-center justify-between text-gray-900">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5" />
                    <span className="font-bold text-lg">{route.from}</span>
                  </div>
                  <ArrowRight className="h-6 w-6" />
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg">{route.to}</span>
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{route.distance}</div>
                    <div className="text-sm text-gray-600">Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 flex items-center justify-center space-x-1">
                      <Clock className="h-5 w-5" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>

                {/* Rating and Bookings */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{route.rating}</span>
                    <span className="text-gray-600 text-sm">Rating</span>
                  </div>
                  <div className="text-sm text-gray-600">{route.bookings}</div>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-yellow-600">{route.price}</div>
                  <div className="text-sm text-gray-600">Base fare (+ extras)</div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleBookRoute(route.from, route.to)}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Book This Route
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Route CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Don't see your route?</h3>
            <p className="text-gray-600 mb-6">
              We cover all major cities across Tamil Nadu and neighboring states. Enter your custom route in our booking form 
              and get instant quotes for any destination.
            </p>
            <button 
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Book Custom Route
            </button>
          </div>
        </div>

        {/* Outstation City Cabs */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Outstation City Cabs</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                city: 'Chennai',
                routes: [
                  { destination: 'Coimbatore', distance: '500 km', duration: '8h', price: '₹7,400', popular: 'Kovai Kutralam Falls, Marudamalai Temple' },
                  { destination: 'Bangalore', distance: '350 km', duration: '6h', price: '₹5,250', popular: 'Lalbagh Garden, Cubbon Park, Palace' },
                  { destination: 'Erode', distance: '400 km', duration: '7h', price: '₹6,000', popular: 'Bhavani Sangameshwarar Temple, Kodiveri Dam' },
                  { destination: 'Madurai', distance: '458 km', duration: '7h 30m', price: '₹6,812', popular: 'Meenakshi Temple, Thirumalai Nayakkar Palace' },
                  { destination: 'Pondicherry', distance: '160 km', duration: '3h', price: '₹2,400', popular: 'French Quarter, Auroville, Beach Promenade' }
                ]
              },
              {
                city: 'Coimbatore',
                routes: [
                  { destination: 'Chennai', distance: '500 km', duration: '8h', price: '₹7,400', popular: 'Marina Beach, Fort St. George, Express Avenue' },
                  { destination: 'Bangalore', distance: '360 km', duration: '6h', price: '₹5,400', popular: 'Lalbagh Garden, Cubbon Park, Palace' },
                  { destination: 'Madurai', distance: '220 km', duration: '3h 30m', price: '₹3,300', popular: 'Meenakshi Temple, Thirumalai Nayakkar Palace' },
                  { destination: 'Erode', distance: '90 km', duration: '1h 30m', price: '₹1,350', popular: 'Bhavani Sangameshwarar Temple, Kodiveri Dam' },
                  { destination: 'Pondicherry', distance: '380 km', duration: '6h', price: '₹5,700', popular: 'French Quarter, Auroville, Beach Promenade' }
                ]
              },
              {
                city: 'Bangalore',
                routes: [
                  { destination: 'Chennai', distance: '350 km', duration: '6h', price: '₹5,250', popular: 'Marina Beach, Fort St. George, Express Avenue' },
                  { destination: 'Coimbatore', distance: '360 km', duration: '6h', price: '₹5,400', popular: 'Kovai Kutralam Falls, Marudamalai Temple' },
                  { destination: 'Madurai', distance: '470 km', duration: '8h', price: '₹7,050', popular: 'Meenakshi Temple, Thirumalai Nayakkar Palace' },
                  { destination: 'Erode', distance: '280 km', duration: '5h', price: '₹4,200', popular: 'Bhavani Sangameshwarar Temple, Kodiveri Dam' },
                  { destination: 'Pondicherry', distance: '320 km', duration: '5h 30m', price: '₹4,800', popular: 'French Quarter, Auroville, Beach Promenade' }
                ]
              },
              {
                city: 'Erode',
                routes: [
                  { destination: 'Chennai', distance: '400 km', duration: '7h', price: '₹6,000', popular: 'Marina Beach, Fort St. George, Express Avenue' },
                  { destination: 'Coimbatore', distance: '90 km', duration: '1h 30m', price: '₹1,350', popular: 'Kovai Kutralam Falls, Marudamalai Temple' },
                  { destination: 'Madurai', distance: '200 km', duration: '3h', price: '₹3,000', popular: 'Meenakshi Temple, Thirumalai Nayakkar Palace' },
                  { destination: 'Pondicherry', distance: '320 km', duration: '5h', price: '₹4,800', popular: 'French Quarter, Auroville, Beach Promenade' },
                  { destination: 'Bangalore', distance: '280 km', duration: '5h', price: '₹4,200', popular: 'Lalbagh Garden, Cubbon Park, Palace' }
                ]
              },
              {
                city: 'Madurai',
                routes: [
                  { destination: 'Chennai', distance: '458 km', duration: '7h 30m', price: '₹6,812', popular: 'Marina Beach, Fort St. George, Express Avenue' },
                  { destination: 'Coimbatore', distance: '220 km', duration: '3h 30m', price: '₹3,300', popular: 'Kovai Kutralam Falls, Marudamalai Temple' },
                  { destination: 'Erode', distance: '200 km', duration: '3h', price: '₹3,000', popular: 'Bhavani Sangameshwarar Temple, Kodiveri Dam' },
                  { destination: 'Bangalore', distance: '470 km', duration: '8h', price: '₹7,050', popular: 'Lalbagh Garden, Cubbon Park, Palace' },
                  { destination: 'Pondicherry', distance: '380 km', duration: '6h', price: '₹5,700', popular: 'French Quarter, Auroville, Beach Promenade' }
                ]
              },
              {
                city: 'Pondicherry',
                routes: [
                  { destination: 'Chennai', distance: '160 km', duration: '3h', price: '₹2,400', popular: 'Marina Beach, Fort St. George, Express Avenue' },
                  { destination: 'Coimbatore', distance: '380 km', duration: '6h', price: '₹5,700', popular: 'Kovai Kutralam Falls, Marudamalai Temple' },
                  { destination: 'Bangalore', distance: '320 km', duration: '5h 30m', price: '₹4,800', popular: 'Lalbagh Garden, Cubbon Park, Palace' },
                  { destination: 'Erode', distance: '320 km', duration: '5h', price: '₹4,800', popular: 'Bhavani Sangameshwarar Temple, Kodiveri Dam' },
                  { destination: 'Madurai', distance: '380 km', duration: '6h', price: '₹5,700', popular: 'Meenakshi Temple, Thirumalai Nayakkar Palace' }
                ]
              }
            ].map((cityData, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedCity(expandedCity === cityData.city ? null : cityData.city)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-gray-900">{cityData.city} Taxi</h4>
                    {expandedCity === cityData.city ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>

                {expandedCity === cityData.city && (
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      {cityData.routes.map((route, routeIndex) => (
                        <div key={routeIndex} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-900">
                              {cityData.city} to {route.destination}
                            </h5>
                            <span className="text-lg font-bold text-yellow-600">{route.price}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
                            <div>📍 Distance: {route.distance}</div>
                            <div>⏱️ Duration: {route.duration}</div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Popular attractions:</span> {route.popular}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => {
                              const pickupInput = document.querySelector('input[name="pickupLocation"]') as HTMLInputElement;
                              const dropInput = document.querySelector('input[name="dropLocation"]') as HTMLInputElement;
                              
                              if (pickupInput) pickupInput.value = cityData.city;
                              if (dropInput) dropInput.value = route.destination;
                              
                              document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-sm"
                          >
                            Book This Route
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Routes;