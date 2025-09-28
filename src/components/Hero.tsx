import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, MapPin, ArrowRight, User, Phone, Mail, Car, MessageCircle } from 'lucide-react';
import AnalogClock from './AnalogClock';
import { calculateFare } from '../utils/fareCalculator';
import { loadGoogleMapsAPI } from '../utils/googleMaps';
import { 
  sendBookingEnquiryNotifications, 
  sendBookingConfirmationNotifications, 
  BookingEnquiry, 
  generateBookingId, 
  formatWhatsAppConfirmationMessage 
} from '../utils/notifications';

const Hero = () => {
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    from: '',
    to: '',
    date: '',
    time: '',
    passengers: '1',
    tripType: 'oneway'
  });

  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [showEstimation, setShowEstimation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState<any>(null);
  const [tripDetails, setTripDetails] = useState<{
    distance: string;
    duration: string;
    fare: number;
    selectedCar: string;
    driverAllowance: number;
    vehicleRate: number;
  } | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const vehicles = [
    { name: 'SEDAN', rate: 14, image: '🚗' },
    { name: 'ETIOS', rate: 14, image: '🚗' },
    { name: 'SUV', rate: 19, image: '🚙' },
    { name: 'INNOVA', rate: 20, image: '🚐' }
  ];

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        await loadGoogleMapsAPI();
        setIsGoogleMapsLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
      }
    };

    initializeGoogleMaps();
  }, []);

  useEffect(() => {
    if (isGoogleMapsLoaded && fromInputRef.current && toInputRef.current) {
      fromAutocompleteRef.current = new google.maps.places.Autocomplete(fromInputRef.current, {
        componentRestrictions: { country: 'IN' },
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(10.8, 76.8),
          new google.maps.LatLng(11.2, 77.2)
        ),
        strictBounds: false,
        types: ['establishment', 'geocode']
      });

      toAutocompleteRef.current = new google.maps.places.Autocomplete(toInputRef.current, {
        componentRestrictions: { country: 'IN' },
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(8.0, 76.0),
          new google.maps.LatLng(13.5, 80.3)
        ),
        strictBounds: false,
        types: ['establishment', 'geocode']
      });

      fromAutocompleteRef.current.addListener('place_changed', () => {
        const place = fromAutocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          setBookingForm(prev => ({
            ...prev,
            from: place.formatted_address || place.name || ''
          }));
        }
      });

      toAutocompleteRef.current.addListener('place_changed', () => {
        const place = toAutocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          setBookingForm(prev => ({
            ...prev,
            to: place.formatted_address || place.name || ''
          }));
        }
      });
    }
  }, [isGoogleMapsLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle.name);
    
    // Generate booking ID for enquiry
    const bookingId = generateBookingId();
    
    // Calculate distance and fare
    if (isGoogleMapsLoaded && fromAutocompleteRef.current && toAutocompleteRef.current) {
      const fromPlace = fromAutocompleteRef.current.getPlace();
      const toPlace = toAutocompleteRef.current.getPlace();
      
      if (fromPlace.geometry?.location && toPlace.geometry?.location) {
        try {
          const service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix({
            origins: [fromPlace.geometry.location],
            destinations: [toPlace.geometry.location],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
          }, (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK && response) {
              const distance = response.rows[0].elements[0].distance;
              const duration = response.rows[0].elements[0].duration;
              if (distance) {
                const distanceKm = distance.value / 1000;
                
                // Apply minimum distance billing
                let effectiveDistance = distanceKm;
                let driverAllowance = 400;
                
                if (bookingForm.tripType === 'oneway') {
                  // One way: minimum 130 KM
                  effectiveDistance = Math.max(distanceKm, 130);
                  driverAllowance = 400;
                } else {
                  // Round trip: minimum 250 KM (actual distance × 2)
                  const roundTripDistance = distanceKm * 2;
                  effectiveDistance = Math.max(roundTripDistance, 250);
                  driverAllowance = 500;
                }
                
                const fare = Math.round((effectiveDistance * vehicle.rate) + driverAllowance);
                
                setTripDetails({
                  distance: bookingForm.tripType === 'oneway' 
                    ? `${Math.round(distanceKm)} KM (Min: 130 KM)`
                    : `${Math.round(distanceKm * 2)} KM (Min: 250 KM)`,
                  duration: duration ? `${Math.round(duration.value / 3600)} hours ${Math.round((duration.value % 3600) / 60)} mins` : 'Calculating...',
                  fare: fare,
                  selectedCar: vehicle.name,
                  driverAllowance: driverAllowance,
                  vehicleRate: vehicle.rate
                });
                
                // Auto-send enquiry notifications (Email + WhatsApp)
                const enquiryData: BookingEnquiry = {
                  tripType: bookingForm.tripType,
                  from: bookingForm.from,
                  to: bookingForm.to,
                  date: bookingForm.date,
                  time: bookingForm.time,
                  passengers: bookingForm.passengers,
                  fareEstimate: fare,
                  bookingId: bookingId,
                  vehicleType: vehicle.name,
                  customerName: bookingForm.customerName,
                  customerPhone: bookingForm.customerPhone,
                  customerEmail: bookingForm.customerEmail,
                  tripDistance: bookingForm.tripType === 'oneway' 
                    ? `${Math.round(distanceKm)} KM (Min: 130 KM)`
                    : `${Math.round(distanceKm * 2)} KM (Min: 250 KM)`,
                  tripDuration: duration ? `${Math.round(duration.value / 3600)} hours ${Math.round((duration.value % 3600) / 60)} mins` : 'Calculating...',
                  vehicleRate: vehicle.rate,
                  driverAllowance: driverAllowance
                };

                console.log('📧📱 Auto-sending enquiry notifications (Email + WhatsApp)...');
                sendBookingEnquiryNotifications(enquiryData).then(() => {
                  console.log('✅ Enquiry sent to 1waytaxi team via Email + WhatsApp + Telegram');
                  // Show user feedback
                  alert('📧📱 Booking enquiry sent! 1waytaxi team has been notified via Email, WhatsApp & Telegram and will contact you shortly.');
                }).catch(console.error);
                
                setShowEstimation(true);
              }
            }
          });
        } catch (error) {
          console.error('Error calculating fare:', error);
        }
      }
    }
  };

  const handleGetEstimation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.customerName || !bookingForm.customerPhone || !bookingForm.from || !bookingForm.to || !bookingForm.date || !bookingForm.time) {
      console.log('Please fill in all required fields and select a vehicle.');
      return;
    }

    // Find selected vehicle details
    const selectedVehicleData = vehicles.find(v => v.name === selectedVehicle);
    if (selectedVehicleData) {
      handleVehicleSelect(selectedVehicleData);
    }
  };

  const handleConfirmBooking = () => {
    const confirmationBookingId = generateBookingId();
    
    const bookingData: BookingEnquiry = {
      tripType: bookingForm.tripType,
      from: bookingForm.from,
      to: bookingForm.to,
      date: bookingForm.date,
      time: bookingForm.time,
      passengers: bookingForm.passengers,
      fareEstimate: tripDetails?.fare,
      bookingId: confirmationBookingId,
      vehicleType: tripDetails?.selectedCar || selectedVehicle,
      customerName: bookingForm.customerName,
      customerPhone: bookingForm.customerPhone,
      customerEmail: bookingForm.customerEmail,
      tripDistance: tripDetails?.distance || 'To be calculated',
      tripDuration: tripDetails?.duration || 'To be calculated',
      vehicleRate: tripDetails?.vehicleRate || 14,
      driverAllowance: tripDetails?.driverAllowance || 400
    };

    // Set success state immediately
    setSuccessBookingData(bookingData);
    setShowSuccessMessage(true);
    setShowEstimation(false);

    console.log('📧 Auto-sending confirmation notifications...');
    
    // Send business notifications (Email + Telegram + WhatsApp to business)
    sendBookingConfirmationNotifications(bookingData).then(() => {
      console.log('✅ Business confirmation notifications sent');
    }).catch(console.error);
    
    // Send customer WhatsApp confirmation with proper timing
    if (bookingData.customerPhone) {
      console.log('📱 Sending customer WhatsApp confirmation...');
      
      // First send business WhatsApp (immediate)
      setTimeout(() => {
        const businessMessage = formatWhatsAppConfirmationMessage(bookingData);
        const businessWhatsAppUrl = `https://wa.me/917418332789?text=${businessMessage}`;
        window.open(businessWhatsAppUrl, '_blank');
        console.log('✅ Business WhatsApp tab opened');
        
        // Then send customer WhatsApp (after 1 second)
        setTimeout(() => {
          const customerMessage = formatCustomerWhatsAppConfirmationMessage(bookingData);
          const customerPhone = bookingData.customerPhone!.replace(/\D/g, '');
          const businessWhatsAppUrl = `https://wa.me/917418332789?text=${businessMessage}`;
          const customerWhatsAppUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(customerMessage)}`;

          
          window.open(customerWhatsAppUrl, '_blank');
          console.log('✅ Customer WhatsApp tab opened for:', formattedPhone);
          console.log('📱 Customer will receive booking confirmation on WhatsApp');
        }, 1000);
      }, 500);
    } else {
      console.log('⚠️ No customer phone provided for WhatsApp');
    }
  };

  const handleGoHome = () => {
    setShowSuccessMessage(false);
    setSuccessBookingData(null);
    setShowEstimation(false);
    setSelectedVehicle('');
    setTripDetails(null);
    setBookingForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      from: '',
      to: '',
      date: '',
      time: '',
      passengers: '1',
      tripType: 'oneway'
    });
  };

  const handleWhatsAppBooking = () => {
    console.log('📱 Manual WhatsApp booking triggered...');
    if (successBookingData) {
      const message = formatWhatsAppConfirmationMessage(successBookingData);
      const whatsappUrl = `https://wa.me/917418332789?text=${message}`;
      window.open(whatsappUrl, '_blank');
      console.log('✅ WhatsApp tab opened manually');
    } else {
      console.error('❌ No booking data available for WhatsApp');
    }
  };

  return (
    <>
      <Helmet>
        <title>1waytaxi - Book Taxi Services in Tamil Nadu, Kerala & Karnataka | 24/7 Reliable Cab Service</title>
        <meta name="description" content="Book 1waytaxi for safe, reliable taxi service across Tamil Nadu. 24/7 availability, transparent pricing, professional drivers. Call +91 7810095200 for local & outstation trips." />
        <meta name="keywords" content="1waytaxi, taxi booking Tamil Nadu, Coimbatore taxi, outstation taxi, local cab service, airport transfer, 24/7 taxi service, reliable taxi booking" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://1waytaxi.com/" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="1waytaxi - Book Taxi Services in Tamil Nadu, Kerala & Karnataka" />
        <meta property="og:description" content="Safe, reliable taxi service across Tamil Nadu. 24/7 availability, transparent pricing, professional drivers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://1waytaxi.com/" />
        <meta property="og:site_name" content="1waytaxi" />
        <meta property="og:image" content="https://1waytaxi.com/image.png" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="1waytaxi - Reliable Taxi Service Tamil Nadu" />
        <meta name="twitter:description" content="Book safe, reliable taxi service across Tamil Nadu. 24/7 availability with transparent pricing." />
        <meta name="twitter:image" content="https://1waytaxi.com/image.png" />
        
        {/* Local Business Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "1waytaxi",
            "description": "Professional taxi service across Tamil Nadu with 24/7 availability, transparent pricing, and reliable drivers",
            "url": "https://1waytaxi.com",
            "telephone": "+91-7418332789",
            "email": "1waytaxi.booking@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Coimbatore",
              "addressRegion": "Tamil Nadu",
              "addressCountry": "India"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "11.0168",
              "longitude": "76.9558"
            },
            "areaServed": [
              {
                "@type": "State",
                "name": "Tamil Nadu"
              }
            ],
            "serviceType": "Taxi Service",
            "priceRange": "₹₹",
            "openingHours": "Mo-Su 00:00-23:59",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Taxi Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Local Taxi Service",
                    "description": "Local taxi service within Coimbatore and nearby areas"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Outstation Taxi Service",
                    "description": "Outstation taxi service across Tamil Nadu and neighboring states"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Airport Transfer",
                    "description": "Airport pickup and drop service to/from Coimbatore Airport"
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>
      
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 via-pink-500 to-red-500 opacity-70"></div>
      
      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400/15 rounded-full blur-2xl animate-ping"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-yellow-300/40 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-pink-300/50 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-blue-300/40 rounded-full animate-float-delayed"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Book - 1waytaxi Services in 
              <span className="text-yellow-300 drop-shadow-lg">TamilNadu, Kerala & Karnataka </span>
            </h1>
           <div className="flex flex-col sm:flex-row gap-6">
              <a href="https://wa.me/917418332789" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-2xl text-center backdrop-blur-sm">
                WhatsApp Us
              </a>
              <a href="tel:+917418332789" className="border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-purple-600 transition-all text-center backdrop-blur-sm">
                Call +91 7418332789
              </a>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 max-w-md mx-auto">
            {!showEstimation && !showSuccessMessage && (
              <>
                
                <div className="space-y-4">
                  {/* Pickup Address */}
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Pickup Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                      <input
                        ref={fromInputRef}
                        type="text"
                        name="from"
                        placeholder="Pickup Location"
                        value={bookingForm.from}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Drop Address */}
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Drop Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
                      <input
                        ref={toInputRef}
                        type="text"
                        name="to"
                        placeholder="Drop Location"
                        value={bookingForm.to}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Name and Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                        <input
                          type="text"
                          name="customerName"
                          placeholder="Full Name"
                          value={bookingForm.customerName}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                        <input
                          type="tel"
                          name="customerPhone"
                          placeholder="Mobile Number"
                          value={bookingForm.customerPhone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm">Pickup Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                        <input
                          type="date"
                          name="date"
                          value={bookingForm.date}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm">Pickup Time</label>
                      <AnalogClock
                        value={bookingForm.time}
                        onChange={(time) => setBookingForm(prev => ({ ...prev, time }))}
                        placeholder="Select Time"
                      />
                    </div>
                  </div>

                  {/* Trip Type Selection */}
                  <div>
                    <label className="block text-white font-semibold mb-3 text-sm">Trip Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        className={`bg-white/10 backdrop-blur-sm border-2 rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-white/20 ${
                          bookingForm.tripType === 'oneway' ? 'border-orange-400 bg-orange-400/20' : 'border-white/30'
                        }`}
                        onClick={() => setBookingForm(prev => ({ ...prev, tripType: 'oneway' }))}
                      >
                        <div className="text-white font-bold text-sm mb-1">One Way</div>
                        <div className="text-white/80 text-xs">Min: 130 KM</div>
                        <div className="text-white/80 text-xs">Driver Bata: ₹400</div>
                      </div>
                      <div 
                        className={`bg-white/10 backdrop-blur-sm border-2 rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-white/20 ${
                          bookingForm.tripType === 'roundtrip' ? 'border-orange-400 bg-orange-400/20' : 'border-white/30'
                        }`}
                        onClick={() => setBookingForm(prev => ({ ...prev, tripType: 'roundtrip' }))}
                      >
                        <div className="text-white font-bold text-sm mb-1">Round Trip</div>
                        <div className="text-white/80 text-xs">Min: 250 KM</div>
                        <div className="text-white/80 text-xs">Driver Bata: ₹500</div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Selection */}
                  <div>
                    <label className="block text-white font-semibold mb-3 text-sm">Select Vehicle</label>
                    <div className="grid grid-cols-2 gap-2">
                      {vehicles.map((vehicle, index) => (
                        <div 
                          key={index}
                          className={`bg-white/10 backdrop-blur-sm border-2 rounded-lg p-3 text-center cursor-pointer transition-all hover:bg-white/20 ${
                            selectedVehicle === vehicle.name ? 'border-orange-400 bg-orange-400/20' : 'border-white/30'
                          }`}
                          onClick={() => setSelectedVehicle(vehicle.name)}
                        >
                          <div className="text-2xl mb-1">{vehicle.image}</div>
                          <div className="text-white font-bold text-xs mb-1">{vehicle.rate}₹/KM</div>
                          <div className="text-white text-xs font-semibold">{vehicle.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleGetEstimation}
                    disabled={!selectedVehicle}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
                      selectedVehicle 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 shadow-2xl hover:scale-105' 
                        : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Get Estimation
                  </button>
                </div>
              </>
            )}

            {/* Trip Estimation */}
            {showEstimation && tripDetails && !showSuccessMessage && (
              <div className="text-center text-white">
                <h3 className="text-lg font-bold mb-4">
                  {bookingForm.tripType === 'oneway' ? 'One Way' : 'Round Trip'} estimation for {bookingForm.from.split(',')[0]} to {bookingForm.to.split(',')[0]}
                </h3>
                
                <div className="mb-6">
                  <h2 className="text-4xl font-bold mb-4">Fare ₹{tripDetails.fare.toLocaleString()}</h2>
                  
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Total Distance:</span> {tripDetails.distance}</p>
                    <p><span className="font-semibold">Total Duration:</span> {tripDetails.duration}</p>
                    <p><span className="font-semibold">Selected Car:</span> {tripDetails.selectedCar}</p>
                    <p><span className="font-semibold">Driver Batta:</span> ₹{tripDetails.driverAllowance}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-3 mb-4">
                  <p className="text-yellow-200 text-sm italic">
                    Note: Above estimation is exclusive of Toll Gate and State Permit Etc. 
                    {bookingForm.tripType === 'oneway' ? 'Minimum billing: 130 KM' : 'Minimum billing: 250 KM'}
                  </p>
                </div>
                
                <button
                  onClick={handleConfirmBooking}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg"
                >
                  Confirm Booking
                </button>
              </div>
            )}

            {/* Success Message */}
            {showSuccessMessage && successBookingData && (
              <div className="text-center text-white">
                <div className="bg-green-500 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-200 mb-4">Thanks for booking 1waytaxi! 🎉</p>
                <p className="text-yellow-300 text-sm mb-4">
                  📧📱 1waytaxi team has been notified via Email, WhatsApp & Telegram
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 text-left">
                  <h4 className="font-semibold mb-3">Booking Details:</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Booking ID:</span> {successBookingData.bookingId}</p>
                    <p><span className="font-medium">From:</span> {successBookingData.from.split(',')[0]}</p>
                    <p><span className="font-medium">To:</span> {successBookingData.to.split(',')[0]}</p>
                    <p><span className="font-medium">Date & Time:</span> {successBookingData.date} {successBookingData.time}</p>
                    <p><span className="font-medium">Vehicle:</span> {successBookingData.vehicleType}</p>
                    <p><span className="font-medium">Fare:</span> ₹{successBookingData.fareEstimate}</p>
                    <p><span className="font-medium">Customer:</span> {successBookingData.customerName}</p>
                    <p><span className="font-medium">Phone:</span> {successBookingData.customerPhone}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleGoHome}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Home
                  </button>
                  <button
                    onClick={handleWhatsAppBooking}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Send WhatsApp Again</span>
                  </button>
                </div>
                
                <div className="text-center text-xs text-gray-300 mt-4">
                  <p>Our team will contact you shortly at {successBookingData.customerPhone}</p>
                  <p className="text-green-400 font-semibold mt-2">✅ 1waytaxi team has been notified!</p>
                  <p className="text-yellow-300 mt-1">📱 WhatsApp confirmation sent to you and our team</p>
                  <p className="text-blue-300 mt-1">💬 Check your WhatsApp for booking confirmation!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default Hero;
