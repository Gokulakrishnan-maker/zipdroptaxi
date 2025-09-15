import React from 'react';
import { MapPin, ArrowRight, Clock, Star } from 'lucide-react';

const Routes = () => {
  const popularRoutes = [
    {
      from: 'Mumbai',
      to: 'Pune',
      distance: '148 km',
      duration: '3h 30m',
      price: 'From ₹1,776',
      rating: 4.8,
      bookings: '500+ bookings'
    },
    {
      from: 'Delhi',
      to: 'Agra',
      distance: '233 km',
      duration: '4h 15m',
      price: 'From ₹2,796',
      rating: 4.9,
      bookings: '750+ bookings'
    },
    {
      from: 'Bangalore',
      to: 'Mysore',
      distance: '144 km',
      duration: '3h 20m',
      price: 'From ₹1,728',
      rating: 4.7,
      bookings: '400+ bookings'
    },
    {
      from: 'Chennai',
      to: 'Pondicherry',
      distance: '162 km',
      duration: '3h 45m',
      price: 'From ₹1,944',
      rating: 4.8,
      bookings: '350+ bookings'
    },
    {
      from: 'Hyderabad',
      to: 'Vijayawada',
      distance: '275 km',
      duration: '5h 10m',
      price: 'From ₹3,300',
      rating: 4.6,
      bookings: '200+ bookings'
    },
    {
      from: 'Kolkata',
      to: 'Darjeeling',
      distance: '563 km',
      duration: '10h 30m',
      price: 'From ₹6,756',
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
            Choose from our most popular intercity routes with guaranteed best prices. 
            Professional drivers and comfortable cars for all destinations.
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
                  <div className="text-sm text-gray-600">Starting price</div>
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
              We cover 500+ cities across India. Enter your custom route in our booking form 
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
      </div>
    </section>
  );
};

export default Routes;