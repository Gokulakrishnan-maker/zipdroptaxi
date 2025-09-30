import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <span className="text-2xl">🚕</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Happy Ride Drop Taxi</h1>
              <p className="text-sm text-gray-600">Your Trusted Travel Partner</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-yellow-500 font-medium transition-colors">Home</a>
            <a href="#booking" className="text-gray-700 hover:text-yellow-500 font-medium transition-colors">Book Now</a>
            <a href="#services" className="text-gray-700 hover:text-yellow-500 font-medium transition-colors">Services</a>
            <a href="#routes" className="text-gray-700 hover:text-yellow-500 font-medium transition-colors">Routes</a>
            <a href="#pricing" className="text-gray-700 hover:text-yellow-500 font-medium transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-700 hover:text-yellow-500 font-medium transition-colors">Reviews</a>
            <a href="#contact" className="text-gray-700 hover:text-yellow-500 font-medium transition-colors">Contact</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="tel:+919087520500"
              className="bg-yellow-400 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <a href="#home" className="text-gray-700 hover:text-yellow-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Home</a>
              <a href="#booking" className="text-gray-700 hover:text-yellow-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Book Now</a>
              <a href="#services" className="text-gray-700 hover:text-yellow-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Services</a>
              <a href="#routes" className="text-gray-700 hover:text-yellow-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Routes</a>
              <a href="#pricing" className="text-gray-700 hover:text-yellow-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-yellow-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-yellow-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">Contact</a>
              <div className="pt-4 border-t border-gray-200">
                <a 
                  href="tel:+919087520500"
                  className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
