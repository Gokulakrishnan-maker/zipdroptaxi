import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      details: '+91 90875 20500',
      subtext: 'Available 24/7',
      action: 'tel:+919087520500'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      details: 'happyridedroptaxi@gmail.com',
      subtext: 'Support team',
      action: 'mailto:happyridedroptaxi@gmail.com'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'WhatsApp',
      details: '+91 90875 20500',
      subtext: 'Chat with us',
      action: 'https://wa.me/919087520500'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Office',
      details: '123 Business Street',
      subtext: 'Chennai, Tamil Nadu 600001',
      action: null
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', time: '9:00 AM - 8:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 6:00 PM' },
    { day: 'Sunday', time: '10:00 AM - 5:00 PM' },
    { day: 'Taxi Service', time: '24/7 Available' }
  ];

  const faqs = [
    {
      question: 'How do I book a taxi?',
      answer: 'You can book through our website form, call us directly, or message us on WhatsApp. We provide instant confirmation.'
    },
    {
      question: 'What is included in the price?',
      answer: 'Our prices include fuel, driver allowance, toll charges, parking fees, and taxes. No hidden charges.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel up to 2 hours before your trip without any charges. After that, minimal cancellation fees apply.'
    },
    {
      question: 'Do you provide interstate travel?',
      answer: 'Yes, we provide intercity and interstate taxi services across 500+ cities with experienced drivers.'
    }
  ];

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Need assistance with your booking or have questions? We're here to help 24/7. 
            Contact us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <div className="text-yellow-600">{info.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{info.title}</h4>
                      {info.action ? (
                        <a 
                          href={info.action}
                          className="text-yellow-600 hover:text-yellow-700 font-medium"
                          {...(info.action.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-gray-700 font-medium">{info.details}</p>
                      )}
                      <p className="text-sm text-gray-600">{info.subtext}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Hours */}
            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                Office Hours
              </h4>
              <div className="space-y-3">
                {officeHours.map((hours, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{hours.day}</span>
                    <span className={`font-medium ${hours.day === 'Taxi Service' ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {hours.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h3>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Quick Contact CTA */}
            <div className="mt-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg p-6 text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Need Immediate Assistance?</h4>
              <p className="text-gray-800 mb-6">
                Our customer support team is available 24/7 to help with bookings and queries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+919087520500"
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </a>
                <a 
                  href="https://wa.me/919087520500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-16 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-red-800 mb-2">Emergency Contact</h3>
          <p className="text-red-700 mb-4">
            For urgent assistance during your trip or emergency situations:
          </p>
          <a 
            href="tel:+919087520500"
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span>Emergency Hotline: +91 90875 20500</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;