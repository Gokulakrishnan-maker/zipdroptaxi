import React from 'react';
import { MapPin, ArrowRight, Clock, Star } from 'lucide-react';

const Routes = () => {
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Chennai Taxi */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Chennai Taxi</h4>
              <ul className="space-y-2">
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Chennai to Coimbatore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Chennai to Bangalore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Chennai to Erode Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Chennai to Madurai Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Chennai to Pondicherry Taxi</a></li>
              </ul>
            </div>

            {/* Coimbatore Taxi */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Coimbatore Taxi</h4>
              <ul className="space-y-2">
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Coimbatore to Chennai Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Coimbatore to Bangalore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Coimbatore to Madurai Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Coimbatore to Erode Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Coimbatore to Pondicherry Taxi</a></li>
              </ul>
            </div>

            {/* Bangalore Taxi */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Bangalore Taxi</h4>
              <ul className="space-y-2">
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Bangalore to Chennai Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Bangalore to Coimbatore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Bangalore to Madurai Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Bangalore to Erode Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Bangalore to Pondicherry Taxi</a></li>
              </ul>
            </div>

            {/* Erode Taxi */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Erode Taxi</h4>
              <ul className="space-y-2">
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Erode to Chennai Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Erode to Coimbatore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Erode to Madurai Drop Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Erode to Pondicherry Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Erode to Bangalore Taxi</a></li>
              </ul>
            </div>

            {/* Madurai Taxi */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Madurai Taxi</h4>
              <ul className="space-y-2">
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Madurai to Chennai Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Madurai to Coimbatore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Madurai to Erode Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Madurai to Bangalore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Madurai to Pondicherry Taxi</a></li>
              </ul>
            </div>

            {/* Pondicherry Taxi */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Pondicherry Taxi</h4>
              <ul className="space-y-2">
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Pondicherry to Chennai Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Pondicherry to Coimbatore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Pondicherry to Bangalore Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Pondicherry to Erode Taxi</a></li>
                <li><a href="#booking" className="text-yellow-600 hover:text-yellow-700">Pondicherry to Madurai Taxi</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Routes;