import React from 'react';
import { Check, Car, Users, Fuel, Shield } from 'lucide-react';

const Pricing = () => {
  const carTypes = [
    {
      name: 'Etios',
      price: '₹11',
      image: '🚗',
      features: [
        '4 Seater',
        'AC & Music',
        'Fuel Included',
        'Driver Allowance',
        'Toll & Parking'
      ],
      popular: false
    },
    {
      name: 'Sedan',
      price: '₹12',
      image: '🚙',
      features: [
        '4 Seater',
        'AC & Music',
        'Fuel Included',
        'Driver Allowance',
        'Toll & Parking',
        'Premium Comfort'
      ],
      popular: true
    },
    {
      name: 'SUV',
      price: '₹15',
      image: '🚐',
      features: [
        '6 Seater',
        'AC & Music',
        'Fuel Included',
        'Driver Allowance',
        'Toll & Parking',
        'Extra Luggage Space'
      ],
      popular: false
    },
    {
      name: 'Innova',
      price: '₹16',
      image: '🚌',
      features: [
        '7 Seater',
        'AC & Music',
        'Fuel Included',
        'Driver Allowance',
        'Toll & Parking',
        'Premium SUV Experience'
      ],
      popular: false
    }
  ];

  const additionalInfo = [
    {
      icon: <Fuel className="h-6 w-6 text-yellow-500" />,
      title: 'Fuel Included',
      description: 'No extra charges for fuel consumption'
    },
    {
      icon: <Users className="h-6 w-6 text-yellow-500" />,
      title: 'Driver Allowance',
      description: 'Driver food & accommodation included'
    },
    {
      icon: <Car className="h-6 w-6 text-yellow-500" />,
      title: 'Toll & Parking',
      description: 'All toll charges and parking fees covered'
    },
    {
      icon: <Shield className="h-6 w-6 text-yellow-500" />,
      title: 'No Hidden Charges',
      description: 'Transparent pricing with no surprises'
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect car for your journey. All prices are per kilometer with no hidden charges.
            Fuel, driver allowance, toll, and parking included.
          </p>
        </div>

        {/* Car Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {carTypes.map((car, index) => (
            <div 
              key={index} 
              className={`relative bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                car.popular ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''
              }`}
            >
              {car.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{car.image}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{car.name}</h3>
                <div className="text-4xl font-bold text-yellow-600">{car.price}<span className="text-lg text-gray-600">/km</span></div>
              </div>

              <ul className="space-y-3">
                {car.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  car.popular
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Book {car.name}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {additionalInfo.map((info, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-600">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Examples */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Sample Pricing</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <h4 className="font-bold text-gray-900 mb-2">Mumbai to Pune</h4>
              <p className="text-gray-600 mb-2">148 km • Sedan</p>
              <p className="text-2xl font-bold text-yellow-600">₹1,776</p>
              <p className="text-sm text-gray-600 mt-2">All inclusive</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <h4 className="font-bold text-gray-900 mb-2">Delhi to Agra</h4>
              <p className="text-gray-600 mb-2">233 km • SUV</p>
              <p className="text-2xl font-bold text-yellow-600">₹3,495</p>
              <p className="text-sm text-gray-600 mt-2">All inclusive</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <h4 className="font-bold text-gray-900 mb-2">Round Trip</h4>
              <p className="text-gray-600 mb-2">500 km • Innova</p>
              <p className="text-2xl font-bold text-yellow-600">₹8,000</p>
              <p className="text-sm text-gray-600 mt-2">All inclusive</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              * Prices may vary based on route, season, and availability. Final quote provided after booking confirmation.
            </p>
            <button
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Get Your Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;