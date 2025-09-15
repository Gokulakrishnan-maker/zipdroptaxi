import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Book Now', href: '#booking' },
    { name: 'Services', href: '#services' },
    { name: 'Popular Routes', href: '#routes' }
  ];

  const services = [
    'Outstation Taxi',
    'Local City Rides',
    'Airport Transfer',
    'Corporate Travel',
    'Wedding Transportation',
    'Tour Packages'
  ];

  const policies = [
    'Terms & Conditions',
    'Privacy Policy',
    'Refund Policy',
    'Cancellation Policy'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-yellow-400 p-2 rounded-lg">
                <span className="text-2xl">🚕</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Zip Drop Taxi</h3>
                <p className="text-gray-400 text-sm">Your Trusted Travel Partner</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Premium taxi service provider offering safe, comfortable, and reliable transportation 
              across 500+ cities. Available 24/7 with professional drivers and well-maintained vehicles.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-bold mt-8 mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  • {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-yellow-400 mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+1234567890" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    +1 (234) 567-890
                  </a>
                  <p className="text-sm text-gray-400">Available 24/7</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-yellow-400 mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:info@zipdroptaxi.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    info@zipdroptaxi.com
                  </a>
                  <p className="text-sm text-gray-400">Customer Support</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-400 mt-1" />
                <div>
                  <p className="font-semibold">Office Address</p>
                  <p className="text-gray-300">
                    123 Business Street<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Policies & Legal */}
          <div>
            <h4 className="text-xl font-bold mb-6">Legal & Policies</h4>
            <ul className="space-y-3">
              {policies.map((policy, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    {policy}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h5 className="font-bold mb-3">Business Hours</h5>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Mon-Fri: 9:00 AM - 8:00 PM</p>
                <p>Saturday: 9:00 AM - 6:00 PM</p>
                <p>Sunday: 10:00 AM - 5:00 PM</p>
                <p className="text-yellow-400 font-semibold">Taxi Service: 24/7</p>
              </div>
            </div>

            <div className="mt-8 bg-yellow-400 text-gray-900 p-4 rounded-lg text-center">
              <p className="font-bold text-sm">Emergency Hotline</p>
              <a href="tel:+1234567890" className="font-bold">+1 (234) 567-890</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} Zip Drop Taxi. All rights reserved. | Designed with ❤️ for better travel experience.
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-400">
              <span>Licensed Taxi Service Provider</span> | <span>GST: 123456789</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;