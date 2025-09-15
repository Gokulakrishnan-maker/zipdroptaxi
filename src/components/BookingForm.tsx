import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, User, Phone, Mail, Car, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface BookingFormData {
  pickupLocation: string;
  dropLocation: string;
  tripType: 'one-way' | 'round-trip';
  distance: number;
  date: string;
  time: string;
  carType: string;
  name: string;
  phone: string;
  email: string;
}

const BookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<BookingFormData>();

  const tripType = watch('tripType');
  const distance = watch('distance');

  const carTypes = [
    { value: 'sedan', label: 'Sedan (4 Seats)', price: '₹12/km' },
    { value: 'suv', label: 'SUV (6 Seats)', price: '₹15/km' },
    { value: 'etios', label: 'Etios (4 Seats)', price: '₹11/km' },
    { value: 'innova', label: 'Innova (7 Seats)', price: '₹16/km' }
  ];

  const validateDistance = (distance: number, tripType: string) => {
    const minDistance = tripType === 'one-way' ? 130 : 250;
    return distance >= minDistance || `Minimum ${minDistance} km required for ${tripType} trips`;
  };

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
    <section id="booking" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Taxi</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in your travel details and get instant confirmation. Professional service guaranteed.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Pickup Location *
                </label>
                <input
                  type="text"
                  {...register('pickupLocation', { required: 'Pickup location is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter pickup location"
                />
                {errors.pickupLocation && (
                  <p className="mt-1 text-red-600 text-sm">{errors.pickupLocation.message}</p>
                )}
              </div>

              {/* Drop Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Drop Location *
                </label>
                <input
                  type="text"
                  {...register('dropLocation', { required: 'Drop location is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter drop location"
                />
                {errors.dropLocation && (
                  <p className="mt-1 text-red-600 text-sm">{errors.dropLocation.message}</p>
                )}
              </div>

              {/* Trip Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Type *</label>
                <select
                  {...register('tripType', { required: 'Trip type is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="">Select trip type</option>
                  <option value="one-way">One-way (Min 130 km)</option>
                  <option value="round-trip">Round-trip (Min 250 km)</option>
                </select>
                {errors.tripType && (
                  <p className="mt-1 text-red-600 text-sm">{errors.tripType.message}</p>
                )}
              </div>

              {/* Distance */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Distance (km) *
                </label>
                <input
                  type="number"
                  {...register('distance', { 
                    required: 'Distance is required',
                    min: { value: 1, message: 'Distance must be positive' },
                    validate: (value) => validateDistance(value, tripType)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter distance in km"
                />
                {errors.distance && (
                  <p className="mt-1 text-red-600 text-sm">{errors.distance.message}</p>
                )}
                {tripType && distance && (
                  <p className="mt-1 text-sm text-gray-600">
                    Minimum required: {tripType === 'one-way' ? '130 km' : '250 km'}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Travel Date *
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'Travel date is required' })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                {errors.date && (
                  <p className="mt-1 text-red-600 text-sm">{errors.date.message}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Travel Time *
                </label>
                <input
                  type="time"
                  {...register('time', { required: 'Travel time is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                {errors.time && (
                  <p className="mt-1 text-red-600 text-sm">{errors.time.message}</p>
                )}
              </div>

              {/* Car Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Car className="inline h-4 w-4 mr-2" />
                  Select Car Type *
                </label>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {carTypes.map((car) => (
                    <label key={car.value} className="cursor-pointer">
                      <input
                        type="radio"
                        {...register('carType', { required: 'Car type is required' })}
                        value={car.value}
                        className="sr-only"
                      />
                      <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-yellow-400 transition-colors peer-checked:border-yellow-500 peer-checked:bg-yellow-50">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🚗</div>
                          <div className="font-semibold text-gray-900">{car.label}</div>
                          <div className="text-yellow-600 font-medium">{car.price}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.carType && (
                  <p className="mt-2 text-red-600 text-sm">{errors.carType.message}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-red-600 text-sm">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div className={`mt-6 p-4 rounded-lg flex items-center space-x-2 ${submitSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitSuccess ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span>{submitMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-400 text-gray-900 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Book Your Taxi Now'}
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              By booking, you agree to our terms and conditions. We'll contact you within 30 minutes to confirm your booking.
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;