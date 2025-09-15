import React from 'react';
import { Shield, Clock, Star, Headphones, MapPin, CreditCard } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Shield className="h-12 w-12 text-yellow-500" />,
      title: 'Safe & Secure',
      description: 'GPS tracking, verified drivers, and 24/7 monitoring for your safety.',
      features: ['Background verified drivers', 'Real-time GPS tracking', 'Emergency SOS button']
    },
    {
      icon: <Clock className="h-12 w-12 text-yellow-500" />,
      title: '24/7 Service',
      description: 'Available round the clock for all your travel needs.',
      features: ['Always available', 'Quick response time', 'Emergency bookings']
    },
    {
      icon: <Star className="h-12 w-12 text-yellow-500" />,
      title: 'Premium Fleet',
      description: 'Well-maintained cars with AC and comfortable seating.',
      features: ['Regular maintenance', 'AC & music system', 'Clean interiors']
    },
    {
      icon: <Headphones className="h-12 w-12 text-yellow-500" />,
      title: 'Customer Support',
      description: 'Dedicated support team to assist you throughout your journey.',
      features: ['Live chat support', 'Phone assistance', 'Trip monitoring']
    },
    {
      icon: <MapPin className="h-12 w-12 text-yellow-500" />,
      title: 'Wide Coverage',
      description: 'Service available across 500+ cities and towns.',
      features: ['Intercity travel', 'Local city rides', 'Airport transfers']
    },
    {
      icon: <CreditCard className="h-12 w-12 text-yellow-500" />,
      title: 'Best Rates',
      description: 'Competitive pricing with no hidden charges.',
      features: ['Transparent pricing', 'No surge charges', 'Multiple payment options']
    }
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our premium taxi service. We're committed to providing 
            safe, comfortable, and reliable transportation for all your travel needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Experience Premium Service?</h3>
          <p className="text-xl text-gray-800 mb-6 opacity-90">
            Book your taxi now and enjoy comfortable, safe travel with professional drivers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Book Your Ride
            </button>
            <a 
              href="tel:+1234567890"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call Now: +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;