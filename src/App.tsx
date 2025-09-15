import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import Services from './components/Services';
import Routes from './components/Routes';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

function App() {
  return (
    <div className="App">
      {/* SEO Meta Tags */}
      <title>Zip Drop Taxi - Premium Outstation Taxi Service | Book Now</title>
      
      <Header />
      <Hero />
      <BookingForm />
      <Services />
      <Routes />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default App;