import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, User, Phone, Car, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface BookingFormData {
  pickupLocation: string;
  dropLocation: string;
  tripType: 'one-way' | 'round-trip';
  date: string;
  time: string;
  carType: string;
  name: string;
  phone: string;
}

const BookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<BookingFormData>();

  const tripType = watch('tripType');

  const carTypes = [
    { value: 'sedan', label: 'Sedan (4 Seats)', price: '₹14/km' },
    { value: 'etios', label: 'Etios (4 Seats)', price: '₹14/km' },
    { value: 'suv', label: 'SUV (6 Seats)', price: '₹19/km' },
    { value: 'innova', label: 'Innova (7 Seats)', price: '₹20/km' }
  ];

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/book', data);

      if (response.data.success) {
        setSubmitSuccess(true);
        setSubmitMessage('Booking request submitted successfully! We will contact you shortly.');

        // Open WhatsApp link if provided
        if (response.data.whatsappLink) {
          window.open(response.data.whatsappLink, '_blank');
        }

        reset();
      }
    } catch (error: any) {
      setSubmitSuccess(false);
      setSubmitMessage(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section with Booking Form */}
      <section id="home" className="relative bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 min-h-screen flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Tamil Nadu's Most Trusted<br />
                <span className="text-blue-600">One-Way Drop Taxi</span>
              </h1>

              <p className="text-xl text-gray-700 mb-8 max-w-xl">
                Safe, comfortable, and affordable taxi service across all major cities 
                in Tamil Nadu. Book your one-way drop taxi with transparent pricing 
                and professional drivers.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-800">24/7 Service</div>
                  <div className="text-sm text-gray-600">Available round the clock</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-800">Fixed Pricing</div>
                  <div className="text-sm text-gray-600">No hidden charges</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-800">Professional Drivers</div>
                  <div className="text-sm text-gray-600">Experienced & verified</div>
                </div>
              </div>
            </div>

            {/* Right Content - Booking Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Taxi Booking Form</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Trip Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Trip Type:</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('tripType', { required: 'Trip type is required' })}
                        value="one-way"
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">One Way</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('tripType', { required: 'Trip type is required' })}
                        value="round-trip"
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Round Trip</span>
                    </label>
                  </div>
                  {errors.tripType && (
                    <p className="mt-1 text-red-600 text-sm">{errors.tripType.message}</p>
                  )}
                </div>

                {/* Pickup and Drop Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location:</label>
                    <input
                      type="text"
                      {...register('pickupLocation', { required: 'Pickup location is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter a location"
                    />
                    {errors.pickupLocation && (
                      <p className="mt-1 text-red-600 text-sm">{errors.pickupLocation.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Drop Location:</label>
                    <input
                      type="text"
                      {...register('dropLocation', { required: 'Drop location is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter a location"
                    />
                    {errors.dropLocation && (
                      <p className="mt-1 text-red-600 text-sm">{errors.dropLocation.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter a valid 10-digit phone number'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-red-600 text-sm">{errors.phone.message}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date:</label>
                    <input
                      type="date"
                      {...register('date', { required: 'Travel date is required' })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    {errors.date && (
                      <p className="mt-1 text-red-600 text-sm">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Time:</label>
                    <input
                      type="time"
                      {...register('time', { required: 'Travel time is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    {errors.time && (
                      <p className="mt-1 text-red-600 text-sm">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-600 text-sm">{errors.name.message}</p>
                  )}
                </div>

                {/* Car Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Car Type:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {carTypes.map((car) => (
                      <label key={car.value} className="cursor-pointer group">
                        <input
                          type="radio"
                          {...register('carType', { required: 'Car type is required' })}
                          value={car.value}
                          className="sr-only peer"
                        />
                        <div className="border-2 border-gray-200 rounded-lg p-3 text-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 group-hover:border-blue-400">
                          <div className="text-lg mb-1">🚗</div>
                          <div className="font-semibold text-gray-900 text-sm">{car.label}</div>
                          <div className="text-blue-600 font-medium text-sm">{car.price}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.carType && (
                    <p className="mt-2 text-red-600 text-sm">{errors.carType.message}</p>
                  )}
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-4 rounded-lg flex items-center space-x-2 ${submitSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {submitSuccess ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <span>{submitMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Book Your Taxi Now'}
                </button>

                <div className="text-center text-sm text-gray-500">
                  We'll confirm your booking via call or WhatsApp within 30 minutes.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Tariff Details Section */}
      <section id="tariff" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tariff Details</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden charges. Choose the perfect car for your journey.
            </p>
          </div>

          {/* Tariff Tables */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* One Way Tariff */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">One Way Tariff</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-yellow-400">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Vehicle Type</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Rate/KM</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Driver Bata</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Additional Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-3 font-medium">SEDAN</td>
                      <td className="border border-gray-300 px-4 py-3">₹14/KM</td>
                      <td className="border border-gray-300 px-4 py-3">₹400</td>
                      <td className="border border-gray-300 px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">ETIOS</td>
                      <td className="border border-gray-300 px-4 py-3">₹14/KM</td>
                      <td className="border border-gray-300 px-4 py-3">₹400</td>
                      <td className="border border-gray-300 px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-3 font-medium">SUV</td>
                      <td className="border border-gray-300 px-4 py-3">₹19/KM</td>
                      <td className="border border-gray-300 px-4 py-3">₹400</td>
                      <td className="border border-gray-300 px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">INNOVA</td>
                      <td className="border border-gray-300 px-4 py-3">₹20/KM</td>
                      <td className="border border-gray-300 px-4 py-3">₹400</td>
                      <td className="border border-gray-300 px-4 py-3">One way Toll</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Drop Trip Terms */}
              <div className="mt-8 bg-white rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Drop Trip Terms</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Driver Bata: ₹400</li>
                  <li>• Waiting Charges: ₹100 per hour</li>
                  <li>• Minimum billing: 130 KM</li>
                  <li>• Hill station charges: ₹300</li>
                </ul>
              </div>
            </div>

            {/* Round Trip Tariff */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Round Trip Tariff</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-yellow-400">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Vehicle Type</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Rate/KM</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Driver Bata</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Additional Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-3 font-medium">SEDAN</td>
                      <td className="border border-gray-300 px-4 py-3">₹14/KM</td>
                      <td className="border border-gray-300 px-4 py-3">₹500/day</td>
                      <td className="border border-gray-300 px-4 py-3">Round trip Toll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">ETIOS</td>
                      <td className="border border-gray-300 px-4 py-3">₹14/KM</td>
                      <td className="border border-gray-300 px-4 py-3">₹500/day</td>
                      <td className="border border-gray-300 px-4 py-3">Round trip Toll</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-3 font-medium">SUV</td>
                      <td className="border border-gray-300 px-4 py-3">₹19/KM</td>
                      <td className="border border-gray-300 px-4 py-3">₹500/day</td>
                      <td className="border border-gray-300 px-4 py-3">Round trip Toll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">INNOVA</td>
                      <td className="border border-gray-300 px-4 py-3">₹20/KM</td>
                      <td className="border border-gray-300 px-4 py-3">₹500/day</td>
                      <td className="border border-gray-300 px-4 py-3">Round trip Toll</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Round Trip Terms */}
              <div className="mt-8 bg-white rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Round Trip Terms</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Driver Bata: ₹500 per day</li>
                  <li>• Minimum billing: 250 KM</li>
                  <li>• Bangalore pickup: 300kms minimum</li>
                  <li>• Any other state: 250kms minimum</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-yellow-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Additional Information</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Extra Charges:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Toll fees (as applicable)</li>
                  <li>• Inter-State Permit charges</li>
                  <li>• GST charges (if any)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Important Notes:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• 1 day = 1 calendar day (12 AM to 12 AM)</li>
                  <li>• Luggage policy at driver's discretion</li>
                  <li>• Taxis are passenger vehicles only</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookingForm;