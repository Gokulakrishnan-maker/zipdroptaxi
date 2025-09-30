import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, User, Phone, Calendar, Clock, Calculator, CheckCircle } from "lucide-react";
import { initializeAutocomplete, calculateDistance } from '../utils/googleMaps';

interface BookingFormData {
  pickupLocation: string;
  dropLocation: string;
  tripType: "one-way" | "round-trip";
  date: string;
  time: string;
  carType: string;
  name: string;
  phone: string;
  email: string;
}

interface EstimationData {
  distance: number;
  duration: string;
  baseFare: number;
  totalFare: number;
  carType: string;
  tripType: string;
  bookingId?: string;
}

const BookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showEstimation, setShowEstimation] = useState(false);
  const [estimationData, setEstimationData] = useState<EstimationData | null>(null);
  const [bookingStep, setBookingStep] = useState<'form' | 'estimation' | 'confirmed'>('form');

  // Initialize Google Places autocomplete when component mounts
  React.useEffect(() => {
    const initAutocomplete = () => {
      const pickupInput = document.querySelector('input[name="pickupLocation"]') as HTMLInputElement;
      const dropInput = document.querySelector('input[name="dropLocation"]') as HTMLInputElement;
      
      if (pickupInput && dropInput && window.google) {
        initializeAutocomplete(pickupInput, (place) => {
          setValue('pickupLocation', place);
        });
        
        initializeAutocomplete(dropInput, (place) => {
          setValue('dropLocation', place);
        });
      }
    };

    // Wait for Google Maps to load
    if (window.google) {
      initAutocomplete();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          initAutocomplete();
          clearInterval(checkGoogle);
        }
      }, 100);
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<BookingFormData>();

  const tripType = watch("tripType");
  const phoneValue = watch("phone");
  const carType = watch("carType");

  // ✅ Phone validation
  const isPhoneValid = /^[0-9]{10}$/.test(phoneValue || "");

  const carTypes = [
    { value: "sedan", label: "Sedan (4 Seats)", price: "₹14/km", rate: 14 },
    { value: "etios", label: "Etios (4 Seats)", price: "₹14/km", rate: 14 },
    { value: "suv", label: "SUV (6 Seats)", price: "₹19/km", rate: 19 },
    { value: "innova", label: "Innova (7 Seats)", price: "₹20/km", rate: 20 },
  ];

  const calculateEstimation = async (data: BookingFormData): Promise<EstimationData> => {
    try {
      // Try to get real distance using Google Maps
      const distanceData = await calculateDistance(data.pickupLocation, data.dropLocation);
      const distance = distanceData.distance;
      const duration = distanceData.duration;
      
      const selectedCar = carTypes.find(car => car.value === data.carType);
      const rate = selectedCar?.rate || 14;
      
      const driverBata = data.tripType === 'one-way' ? 400 : 500;
      const baseFare = distance * rate;
      const totalFare = baseFare + driverBata;

      return {
        distance,
        duration,
        baseFare,
        totalFare,
        carType: data.carType,
        tripType: data.tripType
      };
    } catch (error) {
      console.log('Using fallback distance calculation');
      // Fallback to mock calculation
      const mockDistance = Math.floor(Math.random() * 400) + 130;
      const mockDuration = Math.floor(mockDistance / 60);
      const hours = Math.floor(mockDuration);
      const minutes = Math.floor((mockDuration % 1) * 60);
      const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      const selectedCar = carTypes.find(car => car.value === data.carType);
      const rate = selectedCar?.rate || 14;
      
      const driverBata = data.tripType === 'one-way' ? 400 : 500;
      const baseFare = mockDistance * rate;
      const totalFare = baseFare + driverBata;

      return {
        distance: mockDistance,
        duration,
        baseFare,
        totalFare,
        carType: data.carType,
        tripType: data.tripType
      };
    }
  };

  const onGetEstimation = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitSuccess(false);

    try {
      console.log('📝 Submitting estimation request');
      
      // Calculate estimation
      const estimation = await calculateEstimation(data);
      setEstimationData(estimation);
      
      // Send enquiry to server
      const enquiryData = {
        ...data,
        estimation,
        type: 'enquiry'
      };

      console.log('📡 Sending to API...');
      const response = await fetch("/api/enquiry", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enquiryData)
      });
      
      let responseData;
      try {
        const responseText = await response.text();
        if (responseText) {
          responseData = JSON.parse(responseText);
        } else {
          throw new Error('Empty response from server');
        }
      } catch (jsonError) {
        console.error('❌ JSON parsing error:', jsonError);
        throw new Error('Invalid response from server');
      }
      
      console.log('✅ API Response received:', responseData);

      if (responseData.success) {
        // Store booking ID for confirmation step
        setEstimationData(prev => prev ? {...prev, bookingId: responseData.bookingId} : {...estimation, bookingId: responseData.bookingId});
        setBookingStep('estimation');
        setSubmitMessage(`✅ Estimation calculated! Booking ID: ${responseData.bookingId}. Review details below.`);
        setSubmitSuccess(true);
      } else {
        setSubmitSuccess(false);
        setSubmitMessage(responseData.message || "❌ Failed to get estimation. Please try again.");
      }
    } catch (error: any) {
      console.error('❌ Estimation error:', error);
      setSubmitSuccess(false);
      
      let errorMessage = "❌ Something went wrong. Please try again.";
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = "❌ Server is not running. Please contact support.";
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmBooking = async () => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const formData = getValues();
      const bookingData = {
        ...formData,
        estimation: estimationData,
        type: 'booking',
        bookingId: estimationData?.bookingId
      };

      console.log('📡 Confirming booking...');
      const response = await fetch("/api/book", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      let responseData;
      try {
        const responseText = await response.text();
        if (responseText) {
          responseData = JSON.parse(responseText);
        } else {
          throw new Error('Empty response from server');
        }
      } catch (jsonError) {
        console.error('❌ JSON parsing error:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (responseData.success) {
        setBookingStep('confirmed');
        setSubmitSuccess(true);
        setSubmitMessage(
          `🎉 Booking confirmed! Booking ID: ${responseData.bookingId}. Notifications sent via WhatsApp, Email, and Telegram.`
        );

        // Open WhatsApp if link provided
        if (responseData.whatsappLink) {
          window.open(responseData.whatsappLink, "_blank");
        }

        // Reset form after 5 seconds
        setTimeout(() => {
          reset();
          setBookingStep('form');
          setEstimationData(null);
          setSubmitMessage("");
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitSuccess(false);
        setSubmitMessage(responseData.message || "❌ Failed to confirm booking. Please try again.");
      }
    } catch (error: any) {
      console.error('❌ Booking confirmation error:', error);
      setSubmitSuccess(false);
      
      let errorMessage = "❌ Something went wrong. Please try again.";
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = "❌ Server is not running. Please contact support.";
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBookingStep('form');
    setEstimationData(null);
    setSubmitMessage("");
    setSubmitSuccess(false);
    reset();
  };

  return (
    <>
      {/* Hero + Booking Form */}
      <section
        id="home"
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="text-white">Tamil Nadu's Most Trusted</span> <br />
                <span className="text-yellow-400">One-Way Drop Taxi</span>
              </h1>
              <p className="text-xl text-white mb-8 max-w-xl">
                Safe, comfortable, and affordable taxi service across all major
                cities in Tamil Nadu. Book your one-way drop taxi with
                transparent pricing and professional drivers.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-900">₹14/km</div>
                  <p className="text-sm text-gray-600">Starting From</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-900">Safe</div>
                  <p className="text-sm text-gray-600">& Reliable</p>
                </div>
              </div>
            </div>

            {/* Right Content - Booking Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Your Taxi</h2>
                <p className="text-gray-600">Get instant quotes and book your ride</p>
              </div>

              {bookingStep === 'form' && (
                <form onSubmit={handleSubmit(onGetEstimation)} className="space-y-6">
                  {/* Trip Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="one-way"
                          {...register("tripType", { required: "Trip type is required" })}
                          className="text-yellow-500"
                        />
                        <span>One Way</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="round-trip"
                          {...register("tripType", { required: "Trip type is required" })}
                          className="text-yellow-500"
                        />
                        <span>Round Trip</span>
                      </label>
                    </div>
                    {errors.tripType && (
                      <p className="text-red-500 text-sm mt-1">{errors.tripType.message}</p>
                    )}
                  </div>

                  {/* Pickup Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      {...register("pickupLocation", { required: "Pickup location is required" })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter pickup city"
                    />
                    {errors.pickupLocation && (
                      <p className="text-red-500 text-sm mt-1">{errors.pickupLocation.message}</p>
                    )}
                  </div>

                  {/* Drop Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Drop Location
                    </label>
                    <input
                      type="text"
                      {...register("dropLocation", { required: "Drop location is required" })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter destination city"
                    />
                    {errors.dropLocation && (
                      <p className="text-red-500 text-sm mt-1">{errors.dropLocation.message}</p>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Date
                      </label>
                      <input
                        type="date"
                        {...register("date", { required: "Date is required" })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Time
                      </label>
                      <input
                        type="time"
                        {...register("time", { required: "Time is required" })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                      {errors.time && (
                        <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Car Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Type
                    </label>
                    <select
                      {...register("carType", { required: "Car type is required" })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">Select car type</option>
                      {carTypes.map((car) => (
                        <option key={car.value} value={car.value}>
                          {car.label} - {car.price}
                        </option>
                      ))}
                    </select>
                    {errors.carType && (
                      <p className="text-red-500 text-sm mt-1">{errors.carType.message}</p>
                    )}
                  </div>

                  {/* Personal Details */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline h-4 w-4 mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline h-4 w-4 mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone", { 
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Please enter a valid 10-digit phone number"
                          }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter 10-digit phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email address"
                          }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 text-gray-900 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                        <span>Getting Estimation...</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="h-5 w-5" />
                        <span>Get Estimation</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {bookingStep === 'estimation' && estimationData && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Estimation Ready!</h3>
                    <p className="text-gray-600">Review your trip details and confirm booking</p>
                  </div>

                  {/* Estimation Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Trip Estimation</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-semibold ml-2">{estimationData.distance} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold ml-2">{estimationData.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Base Fare:</span>
                        <span className="font-semibold ml-2">₹{estimationData.baseFare}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Driver Bata:</span>
                        <span className="font-semibold ml-2">₹{estimationData.tripType === 'one-way' ? '400' : '500'}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Fare:</span>
                        <span className="text-2xl font-bold text-yellow-600">₹{estimationData.totalFare}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        * Toll charges, permits, and hill station charges extra
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={resetForm}
                      className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Modify Details
                    </button>
                    <button
                      onClick={onConfirmBooking}
                      disabled={isSubmitting}
                      className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Confirming...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {bookingStep === 'confirmed' && (
                <div className="text-center space-y-6">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600">Your taxi has been booked successfully. We'll contact you shortly.</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold">
                      Booking ID: {estimationData?.bookingId}
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Save this ID for future reference
                    </p>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {submitMessage && (
                <div className={`mt-6 p-4 rounded-lg ${submitSuccess ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                  <p className="text-sm font-medium">{submitMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Booking</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book your taxi in just a few clicks. Get instant quotes and confirm your ride with our easy booking process.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookingForm;