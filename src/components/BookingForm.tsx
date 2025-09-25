import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, User, Phone, Calendar, Clock } from 'lucide-react'; 
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

  const { register, handleSubmit, watch, formState: { errors }, reset } =
    useForm<BookingFormData>();

  const tripType = watch('tripType');
  const phoneValue = watch('phone'); // 👈 watch phone field

  // Phone number validation (10 digits)
  const isPhoneValid = /^[0-9]{10}$/.test(phoneValue || '');

  const carTypes = [
    { value: 'sedan', label: 'Sedan (4 Seats)', price: '₹14/km' },
    { value: 'etios', label: 'Etios (4 Seats)', price: '₹14/km' },
    { value: 'suv', label: 'SUV (6 Seats)', price: '₹19/km' },
    { value: 'innova', label: 'Innova (7 Seats)', price: '₹20/km' },
  ];

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/book', data);

      if (response.data.success) {
        setSubmitSuccess(true);
        setSubmitMessage(
          'Booking request submitted successfully! We will contact you shortly.'
        );

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
    <section className="min-h-screen flex items-center bg-gray-100 py-10">
      <div className="container mx-auto max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Taxi Booking</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Trip Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Trip Type</label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  {...register('tripType', { required: 'Trip type is required' })}
                  value="one-way"
                />{' '}
                One Way
              </label>
              <label>
                <input
                  type="radio"
                  {...register('tripType', { required: 'Trip type is required' })}
                  value="round-trip"
                />{' '}
                Round Trip
              </label>
            </div>
            {errors.tripType && (
              <p className="text-red-500 text-sm">{errors.tripType.message}</p>
            )}
          </div>

          {/* Pickup & Drop */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center border rounded px-3 py-2">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                {...register('pickupLocation', {
                  required: 'Pickup location is required',
                })}
                placeholder="Pickup Location"
                className="w-full outline-none"
              />
            </div>
            <div className="flex items-center border rounded px-3 py-2">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                {...register('dropLocation', {
                  required: 'Drop location is required',
                })}
                placeholder="Drop Location"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-center border rounded px-3 py-2">
            <Phone className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="tel"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Enter valid 10-digit number',
                },
              })}
              placeholder="Phone Number"
              className="w-full outline-none"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          {/* 👇 Rest of the form only shows when phone is valid */}
          {isPhoneValid && (
            <>
              {/* Name */}
              <div className="flex items-center border rounded px-3 py-2">
                <User className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Full Name"
                  className="w-full outline-none"
                />
              </div>

              {/* Date & Time with icons */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center border rounded px-3 py-2">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="date"
                    {...register('date', { required: 'Travel date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full outline-none"
                  />
                </div>

                <div className="flex items-center border rounded px-3 py-2">
                  <Clock className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="time"
                    {...register('time', { required: 'Travel time is required' })}
                    className="w-full outline-none"
                  />
                </div>
              </div>

              {/* Car Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Car Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {carTypes.map((car) => (
                    <label key={car.value} className="border p-3 rounded cursor-pointer">
                      <input
                        type="radio"
                        {...register('carType', {
                          required: 'Car type is required',
                        })}
                        value={car.value}
                        className="mr-2"
                      />
                      {car.label} - {car.price}
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {isSubmitting ? 'Submitting...' : 'Book Now'}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
