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
  }, [setValue]);

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
                  <div className="text-2xl font-bold text-gray