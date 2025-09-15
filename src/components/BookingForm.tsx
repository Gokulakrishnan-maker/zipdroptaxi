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
    { value: 'suv', label: 'SUV (6 Seats)', price: '₹19/km' },
    { value: 'etios', label: 'Etios (4 Seats)', price: '₹14/km' },
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
    <section id="booking" className="py-16 bg-gradient-to-r from-yellow-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Book Your Ride</h2>
          <p className="text-lg text-gray-600">
            Fast, reliable, and comfortable taxi booking in just a few clicks.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Pickup Location *
                </label>
                <input
                  type="text"
                  {...register('pickupLocation', { required: 'Pickup location is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter pickup location"
                />
                {errors.pickupLocation && (
                  <p className="mt-1 text-red-600 text-sm">{errors.pickupLocation.message}</p>
                )}
              </div>

              {/* Drop Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Drop Location *
                </label>
                <input
                  type="text"
                  {...register('dropLocation', { required: 'Drop location is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter drop location"
                />
                {errors.dropLocation && (
                  <p className="mt-1 text-red-600 text-sm">{errors.dropLocation.message}</p>
                )}
              </div>

              {/* Trip Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type *</label>
                <select
                  {...register('tripType', { required: 'Trip type is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select trip type</option>
                  <option value="one-way">One-way</option>
                  <option value="round-trip">Round-trip</option>
                </select>
                {errors.tripType && (
                  <p className="mt-1 text-red-600 text-sm">{errors.tripType.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Travel Date *
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'Travel date is required' })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
                {errors.date && (
                  <p className="mt-1 text-red-600 text-sm">{errors.date.message}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Travel Time *
                </label>
                <input
                  type="time"
                  {...register('time', { required: 'Travel time is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
                {errors.time && (
                  <p className="mt-1 text-red-600 text-sm">{errors.time.message}</p>
                )}
              </div>

              {/* Car Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Car className="inline h-4 w-4 mr-2" />
                  Select Car Type *
                </label>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {carTypes.map((car) => (
                    <label key={car.value} className="cursor-pointer group">
                      <input
                        type="radio"
                        {...register('carType', { required: 'Car type is required' })}
                        value={car.value}
                        className="sr-only peer"
                      />
                      <div className="border-2 border-gray-200 rounded-xl p-4 text-center transition-all peer-checked:border-yellow-500 peer-checked:bg-yellow-50 group-hover:border-yellow-400">
                        <div className="text-2xl mb-2">🚗</div>
                        <div className="font-semibold text-gray-900">{car.label}</div>
                        <div className="text-yellow-600 font-medium">{car.price}</div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline h-4 w-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit phone number'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-red-600 text-sm">{errors.phone.message}</p>
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
                className="w-full bg-yellow-400 text-gray-900 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Book Your Taxi Now'}
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              We’ll confirm your booking via call or WhatsApp within 30 minutes.
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
