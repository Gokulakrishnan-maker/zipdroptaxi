import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, User, Phone, Calendar, Clock } from "lucide-react";
import axios from "axios";
import { loadGoogleMapsAPI } from "../utils/googleMaps";

interface BookingFormData {
  pickupLocation: string;
  dropLocation: string;
  tripType: "one-way" | "round-trip";
  date: string;
  time: string;
  carType: string;
  name: string;
  phone: string;
}

const BookingForm = () => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [dropAutocomplete, setDropAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>();

  const tripType = watch("tripType");
  const phoneValue = watch("phone");

  // ✅ Phone validation
  const isPhoneValid = /^[0-9]{10}$/.test(phoneValue || "");

  const carTypes = [
    { value: "sedan", label: "Sedan (4 Seats)", price: "₹14/km" },
    { value: "etios", label: "Etios (4 Seats)", price: "₹14/km" },
    { value: "suv", label: "SUV (6 Seats)", price: "₹19/km" },
    { value: "innova", label: "Innova (7 Seats)", price: "₹20/km" },
  ];

  // Load Google Maps API on component mount
  React.useEffect(() => {
    const initMaps = async () => {
      try {
        await loadGoogleMapsAPI();
        setIsGoogleMapsLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
      }
    };
    initMaps();
  }, []);

  // Initialize autocomplete when Google Maps is loaded
  React.useEffect(() => {
    if (isGoogleMapsLoaded && window.google && window.google.maps) {
      const pickupInput = document.querySelector('input[name="pickupLocation"]') as HTMLInputElement;
      const dropInput = document.querySelector('input[name="dropLocation"]') as HTMLInputElement;

      if (pickupInput && !pickupAutocomplete) {
        const autocomplete = new google.maps.places.Autocomplete(pickupInput, {
          componentRestrictions: { country: 'IN' },
          types: ['establishment', 'geocode']
        });
        setPickupAutocomplete(autocomplete);
      }

      if (dropInput && !dropAutocomplete) {
        const autocomplete = new google.maps.places.Autocomplete(dropInput, {
          componentRestrictions: { country: 'IN' },
          types: ['establishment', 'geocode']
        });
        setDropAutocomplete(autocomplete);
      }
    }
  }, [isGoogleMapsLoaded, pickupAutocomplete, dropAutocomplete]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/book", data);

      if (response.data.success) {
        setSubmitSuccess(true);
        setSubmitMessage(
          "✅ Booking request submitted successfully! We will contact you shortly."
        );

        if (response.data.whatsappLink) {
          window.open(response.data.whatsappLink, "_blank");
        }

        reset();
      }
    } catch (error: any) {
      setSubmitSuccess(false);
      setSubmitMessage(
        error.response?.data?.message ||
          "❌ Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
                  <div className="text-2xl font-bold text-gray-800">
                    24/7 Service
                  </div>
                  <div className="text-sm text-gray-600">
                    Available round the clock
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-800">
                    Fixed Pricing
                  </div>
                  <div className="text-sm text-gray-600">No hidden charges</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-800">
                    Professional Drivers
                  </div>
                  <div className="text-sm text-gray-600">
                    Experienced & verified
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Booking Form */}
            <div className="bg-white p-6 rounded-lg shadow-xl backdrop-blur-sm bg-opacity-95">
              <h3 className="text-xl font-bold mb-4">Taxi Booking</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Trip Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Trip Type
                  </label>
                  <div className="flex space-x-4">
                    <label>
                      <input
                        type="radio"
                        {...register("tripType", {
                          required: "Trip type is required",
                        })}
                        value="one-way"
                      />{" "}
                      One Way
                    </label>
                    <label>
                      <input
                        type="radio"
                        {...register("tripType", {
                          required: "Trip type is required",
                        })}
                        value="round-trip"
                      />{" "}
                      Round Trip
                    </label>
                  </div>
                  {errors.tripType && (
                    <p className="text-red-500 text-sm">
                      {errors.tripType.message}
                    </p>
                  )}
                </div>

                {/* Pickup & Drop */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center border rounded px-3 py-2">
                    <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                      type="text"
                      {...register("pickupLocation", {
                        required: "Pickup location is required",
                      })}
                      placeholder="Pickup Location"
                      className="w-full outline-none"
                      name="pickupLocation"
                    />
                  </div>
                  <div className="flex items-center border rounded px-3 py-2">
                    <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                      type="text"
                      {...register("dropLocation", {
                        required: "Drop location is required",
                      })}
                      placeholder="Drop Location"
                      className="w-full outline-none"
                      name="dropLocation"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center border rounded px-3 py-2">
                  <Phone className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter valid 10-digit number",
                      },
                    })}
                    placeholder="Phone Number"
                    className="w-full outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm">
                    {errors.phone.message}
                  </p>
                )}

                {/* Show after phone valid */}
                {isPhoneValid && (
                  <>
                    {/* Name */}
                    <div className="flex items-center border rounded px-3 py-2">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <input
                        type="text"
                        {...register("name", {
                          required: "Name is required",
                        })}
                        placeholder="Full Name"
                        className="w-full outline-none"
                      />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center border rounded px-3 py-2">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <input
                          type="date"
                          {...register("date", {
                            required: "Travel date is required",
                          })}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full outline-none"
                        />
                      </div>
                      <div className="flex items-center border rounded px-3 py-2">
                        <Clock className="w-5 h-5 text-gray-500 mr-2" />
                        <input
                          type="time"
                          {...register("time", {
                            required: "Travel time is required",
                          })}
                          className="w-full outline-none"
                        />
                      </div>
                    </div>

                    {/* Car Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Car Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {carTypes.map((car) => (
                          <label
                            key={car.value}
                            className="border p-3 rounded cursor-pointer flex items-center"
                          >
                            <input
                              type="radio"
                              {...register("carType", {
                                required: "Car type is required",
                              })}
                              value={car.value}
                              className="mr-2"
                            />
                            {car.label} - {car.price}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      {isSubmitting ? "Submitting..." : "Book Now"}
                    </button>
                  </>
                )}
              </form>

              {/* Success/Error Message */}
              {submitMessage && (
                <p
                  className={`mt-4 text-sm font-medium ${
                    submitSuccess ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tariff Section */}
     <section id="tariff" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tariff Details
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden charges. Choose the perfect car
              for your journey.
            </p>
          </div>

          {/* Tariff Tables */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* One Way Tariff */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                One Way Tariff
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-yellow-400">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        Vehicle Type
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        Rate/KM
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        Driver Bata
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        Additional Charge
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border px-4 py-3 font-medium">SEDAN</td>
                      <td className="border px-4 py-3">₹14/KM</td>
                      <td className="border px-4 py-3">₹400</td>
                      <td className="border px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-4 py-3 font-medium">ETIOS</td>
                      <td className="border px-4 py-3">₹14/KM</td>
                      <td className="border px-4 py-3">₹400</td>
                      <td className="border px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border px-4 py-3 font-medium">SUV</td>
                      <td className="border px-4 py-3">₹19/KM</td>
                      <td className="border px-4 py-3">₹400</td>
                      <td className="border px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-4 py-3 font-medium">INNOVA</td>
                      <td className="border px-4 py-3">₹20/KM</td>
                      <td className="border px-4 py-3">₹400</td>
                      <td className="border px-4 py-3">One way Toll</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Drop Trip Terms */}
              <div className="mt-8 bg-white rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Drop Trip Terms
                </h4>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Round Trip Tariff
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-yellow-400">
                      <th className="border px-4 py-3 text-left font-semibold text-gray-900">
                        Vehicle Type
                      </th>
                      <th className="border px-4 py-3 text-left font-semibold text-gray-900">
                        Rate/KM
                      </th>
                      <th className="border px-4 py-3 text-left font-semibold text-gray-900">
                        Driver Bata
                      </th>
                      <th className="border px-4 py-3 text-left font-semibold text-gray-900">
                        Additional Charge
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border px-4 py-3 font-medium">SEDAN</td>
                      <td className="border px-4 py-3">₹14/KM</td>
                      <td className="border px-4 py-3">₹500/day</td>
                      <td className="border px-4 py-3">Round trip Toll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-4 py-3 font-medium">ETIOS</td>
                      <td className="border px-4 py-3">₹14/KM</td>
                      <td className="border px-4 py-3">₹500/day</td>
                      <td className="border px-4 py-3">Round trip Toll</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border px-4 py-3 font-medium">SUV</td>
                      <td className="border px-4 py-3">₹19/KM</td>
                      <td className="border px-4 py-3">₹500/day</td>
                      <td className="border px-4 py-3">Round trip Toll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-4 py-3 font-medium">INNOVA</td>
                      <td className="border px-4 py-3">₹20/KM</td>
                      <td className="border px-4 py-3">₹500/day</td>
                      <td className="border px-4 py-3">Round trip Toll</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Round Trip Terms */}
              <div className="mt-8 bg-white rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Round Trip Terms
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Driver Bata: ₹500 per day</li>
                  <li>• Minimum billing: 250 KM</li>
                  <li>• Bangalore pickup: 300kms minimum</li>
                  <li>• Any other state: 250kms minimum</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-yellow-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Additional Information
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Extra Charges:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Toll fees (as applicable)</li>
                  <li>• Inter-State Permit charges</li>
                  <li>• GST charges (if any)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Important Notes:
                </h4>
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
