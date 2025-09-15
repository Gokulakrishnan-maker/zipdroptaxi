import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Chennai',
      rating: 5,
      text: 'Excellent service! The driver was professional and the car was clean and comfortable. Booked for Chennai to Madurai trip and it was smooth throughout.',
      trip: 'Chennai → Madurai',
      date: 'December 2024'
    },
    {
      name: 'Priya Sharma',
      location: 'Coimbatore',
      rating: 5,
      text: 'Best taxi service I have used. Transparent pricing with clear breakdown of charges. The driver reached on time and was very courteous. Highly recommend!',
      trip: 'Coimbatore → Chennai',
      date: 'November 2024'
    },
    {
      name: 'Amit Patel',
      location: 'Salem',
      rating: 5,
      text: 'Professional service with great customer support. The booking process was simple and they kept me updated throughout the journey. Will definitely use again.',
      trip: 'Salem → Chennai',
      date: 'December 2024'
    },
    {
      name: 'Sneha Reddy',
      location: 'Madurai',
      rating: 5,
      text: 'Amazing experience! Clean car, experienced driver, and reasonable pricing. The 24/7 customer support was very helpful when I had questions.',
      trip: 'Madurai → Coimbatore',
      date: 'November 2024'
    },
    {
      name: 'Vikram Singh',
      location: 'Chennai',
      rating: 5,
      text: 'Zip Drop Taxi exceeded my expectations. The Innova was spacious and perfect for our family trip. Driver was knowledgeable about the route and very helpful.',
      trip: 'Chennai → Thanjavur',
      date: 'December 2024'
    },
    {
      name: 'Ravi Gupta',
      location: 'Pondicherry',
      rating: 5,
      text: 'Outstanding service for long distance travel. Comfortable seats, AC working perfectly, and the driver took proper rest breaks. Felt safe throughout the journey.',
      trip: 'Pondicherry → Bangalore',
      date: 'November 2024'
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read reviews from our satisfied customers who have experienced our premium taxi service.
            Their feedback motivates us to maintain the highest standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="h-8 w-8 text-yellow-400" />
                {renderStars(testimonial.rating)}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Trip Info */}
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Trip:</span>
                  <span className="text-sm text-yellow-600 font-medium">{testimonial.trip}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-semibold text-gray-700">Date:</span>
                  <span className="text-sm text-gray-600">{testimonial.date}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                <p className="text-gray-600">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-lg">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg">Support Available</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Thousands of Satisfied Customers</h3>
          <p className="text-gray-600 mb-8">Experience our premium service and see why customers choose us again and again.</p>
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-colors"
          >
            Book Your Taxi Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;