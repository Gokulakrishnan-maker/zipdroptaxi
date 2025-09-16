import React from 'react';
import { Phone } from 'lucide-react';

const PhoneFloat = () => {
  const handlePhoneClick = () => {
    window.open('tel:+1234567890', '_self');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={handlePhoneClick}
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 animate-pulse"
        aria-label="Call us now"
      >
        <Phone className="h-6 w-6" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-16 left-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Call us now
        <div className="absolute top-full left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default PhoneFloat;