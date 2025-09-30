import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create nodemailer transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Validate distance based on trip type
const validateDistance = (tripType, distance) => {
  const minDistance = tripType === 'one-way' ? 130 : 250;
  return distance >= minDistance;
};

// Generate WhatsApp link
const generateWhatsAppLink = (bookingDetails) => {
  const message = `New Taxi Booking:
📍 From: ${bookingDetails.pickupLocation}
📍 To: ${bookingDetails.dropLocation}
🚗 Car Type: ${bookingDetails.carType}
📅 Date: ${bookingDetails.date}
⏰ Time: ${bookingDetails.time}
👤 Name: ${bookingDetails.name}
📞 Phone: ${bookingDetails.phone}
🛣️ Trip: ${bookingDetails.tripType}`;
  
  const phoneNumber = '919087520500'; // Replace with actual WhatsApp number
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

// Booking API endpoint
app.post('/api/book', async (req, res) => {
  try {
    const bookingData = req.body;
    const { pickupLocation, dropLocation, tripType, distance, name, email, phone, date, time, carType } = bookingData;

    // Validate required fields
    if (!pickupLocation || !dropLocation || !tripType || !distance || !name || !email || !phone || !date || !time || !carType) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate distance
    if (!validateDistance(tripType, distance)) {
      let minDistance = tripType === 'one-way' ? 130 : 250;
      let message = `Minimum ${minDistance} km required for ${tripType} trips`;
      
      // Special message for Bangalore
      if (tripType === 'round-trip' && (pickupLocation.toLowerCase().includes('bangalore') || dropLocation.toLowerCase().includes('bangalore'))) {
        minDistance = 300;
        message = `Minimum 300 km required for Bangalore pickup round trips`;
      }
      
      return res.status(400).json({
        success: false,
        message: message
      });
    }

    // Admin email
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: 'happyridedroptaxi@gmail.com', // Replace with actual admin email
      subject: 'New Taxi Booking Request - Happy Ride Drop Taxi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #FBBF24; padding: 20px; text-align: center;">
            <h1 style="color: #1F2937; margin: 0;">🚕 New Booking Request</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1F2937;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Customer Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${phone}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${email}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Pickup Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${pickupLocation}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Drop Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${dropLocation}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Trip Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tripType}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Distance:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${distance} km</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${date}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${time}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Car Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${carType}</td></tr>
            </table>
          </div>
        </div>
      `
    };

    // Customer confirmation email
    const customerMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Booking Confirmation - Happy Ride Drop Taxi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #FBBF24; padding: 20px; text-align: center;">
            <h1 style="color: #1F2937; margin: 0;">🚕 Happy Ride Drop Taxi</h1>
            <p style="color: #1F2937; margin: 10px 0 0 0;">Booking Confirmation</p>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for choosing Happy Ride Drop Taxi! We have received your booking request and will contact you shortly to confirm the details.</p>
            
            <h3 style="color: #1F2937;">Your Trip Details:</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📍 From:</strong> ${pickupLocation}</p>
              <p><strong>📍 To:</strong> ${dropLocation}</p>
              <p><strong>🚗 Car Type:</strong> ${carType}</p>
              <p><strong>📅 Date:</strong> ${date}</p>
              <p><strong>⏰ Time:</strong> ${time}</p>
              <p><strong>🛣️ Trip Type:</strong> ${tripType}</p>
              <p><strong>📏 Distance:</strong> ${distance} km</p>
            </div>
            
            <p>Our team will call you at <strong>${phone}</strong> within 30 minutes to confirm your booking and provide the final quote.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="tel:+919087520500" style="background: #FBBF24; color: #1F2937; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">📞 Call Us: +91 90875 20500</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Best regards,<br>
              Happy Ride Drop Taxi Team
            </p>
          </div>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    // Generate WhatsApp link
    const whatsappLink = generateWhatsAppLink(bookingData);

    res.json({
      success: true,
      message: 'Booking request submitted successfully!',
      whatsappLink
    });

  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});