import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  const handleBookNow = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-flex items-center bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Available 24/7
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Premium <span className="text-gray-900">Taxi Service</span><br />
              for Your Journey
            </h1>

            <p className="text-xl text-white mb-8 opacity-90 max-w-xl">
              Experience comfortable, safe, and reliable taxi service with professional drivers. 
              Book now for outstation trips with guaranteed best rates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button 
                onClick={handleBookNow}
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-lg"
              >
                <span>Book Your Ride</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <a 
                href="tel:+1234567890"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-lg"
              >
                <span>📞 Call Now</span>
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="text-white">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Available</div>
              </div>
              <div className="text-white">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-90">Cities</div>
              </div>
              <div className="text-white">
                <div className="text-3xl font-bold">5★</div>
                <div className="text-sm opacity-90">Rating</div>
              </div>
              <div className="text-white">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-90">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Service Highlights */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Zip Drop Taxi?</h3>
              
              <div className="space-y-4">
                {[
                  { icon: '🚗', title: 'Premium Cars', desc: 'Well-maintained fleet with AC' },
                  { icon: '👨‍✈️', title: 'Professional Drivers', desc: 'Experienced & verified drivers' },
                  { icon: '💰', title: 'Best Rates', desc: 'Competitive pricing guaranteed' },
                  { icon: '🛡️', title: 'Safe & Secure', desc: '24/7 support & GPS tracking' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                <p className="text-center text-gray-800 font-medium">
                  🎉 Special Offer: Book now and get <span className="text-yellow-600 font-bold">10% OFF</span> on your first ride!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white opacity-20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;