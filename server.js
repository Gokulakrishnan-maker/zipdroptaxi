import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create nodemailer transporter
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
  console.log('✅ Email transporter configured successfully');
} catch (error) {
  console.error('❌ Email configuration error:', error.message);
}

// Generate unique booking ID
const generateBookingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HRD${timestamp}${random}`;
};

// Get current date and time in Indian format
const getCurrentDateTime = () => {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  return now.toLocaleString('en-IN', options);
};

// Get car rate based on type
const getCarRate = (carType) => {
  const rates = {
    'sedan': '₹14/km',
    'etios': '₹14/km', 
    'suv': '₹19/km',
    'innova': '₹20/km'
  };
  return rates[carType] || '₹14/km';
};

// Send Telegram notification
const sendTelegramNotification = async (message) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.log('⚠️ Telegram bot token or chat ID not configured');
      return;
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    }, {
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ Telegram notification sent successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Telegram notification error:', error.response?.data || error.message);
  }
};

// Validate distance based on trip type
const validateDistance = (tripType, distance) => {
  const minDistance = tripType === 'one-way' ? 130 : 250;
  return distance >= minDistance;
};

// Generate WhatsApp link for enquiry
const generateEnquiryWhatsAppLink = (bookingDetails) => {
  const bookingId = generateBookingId();
  const currentTime = getCurrentDateTime();
  const rate = getCarRate(bookingDetails.carType);
  
  const message = `🚖 BOOKING ENQUIRY - happyRideDroptaxi

📋 Trip Details:
• Booking ID: ${bookingId}
• Name: ${bookingDetails.name}
• Phone: ${bookingDetails.phone}
• Trip Type: ${bookingDetails.tripType}
• From: ${bookingDetails.pickupLocation}
• To: ${bookingDetails.dropLocation}
• Date: ${bookingDetails.date}
• Time: ${bookingDetails.time}
• Distance: ${bookingDetails.estimation ? bookingDetails.estimation.distance + ' km' : 'Calculating...'}
• Duration: ${bookingDetails.estimation ? bookingDetails.estimation.duration : 'Calculating...'}
• Total Fare: ${bookingDetails.estimation ? '₹' + bookingDetails.estimation.totalFare : 'Calculating...'}
• Rate: ${rate}
• Vehicle: ${bookingDetails.carType.toUpperCase()}
• For Customer Intimation: Toll Gate, Permit, and Hill Station charges extra.

⏰ Enquiry Time: ${currentTime}

📞 Contact: +91 90875 20500`;

  const phoneNumber = '919087520500';
  return { 
    link: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
    bookingId 
  };
};

// Generate WhatsApp link for booking confirmation
const generateBookingWhatsAppLink = (bookingDetails, bookingId) => {
  const currentTime = getCurrentDateTime();
  const rate = getCarRate(bookingDetails.carType);
  
  const message = `🚖 BOOKING CONFIRMATION - happyRideDroptaxi

✅ CONFIRMED BOOKING

📋 Trip Details:
• Booking ID: ${bookingId}
• Name: ${bookingDetails.name}
• Phone: ${bookingDetails.phone}
• Trip Type: ${bookingDetails.tripType}
• From: ${bookingDetails.pickupLocation}
• To: ${bookingDetails.dropLocation}
• Date: ${bookingDetails.date}
• Time: ${bookingDetails.time}
• Distance: ${bookingDetails.estimation.distance} km
• Duration: ${bookingDetails.estimation.duration}
• Total Fare: ₹${bookingDetails.estimation.totalFare}
• Rate: ${rate}
• Vehicle: ${bookingDetails.carType.toUpperCase()}
• For Customer Intimation: Toll Gate, Permit, and Hill Station charges extra.

⏰ Confirmed Time: ${currentTime}

📞 Contact: +91 90875 20500`;

  const phoneNumber = '919087520500';
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

// Generate Telegram message for enquiry
const generateEnquiryTelegramMessage = (bookingDetails, bookingId) => {
  const currentTime = getCurrentDateTime();
  const rate = getCarRate(bookingDetails.carType);
  
  return `🚖 <b>BOOKING ENQUIRY</b> - happyRideDroptaxi

📋 <b>Trip Details:</b>
• Booking ID: ${bookingId}
• Name: ${bookingDetails.name}
• Phone: ${bookingDetails.phone}
• Trip Type: ${bookingDetails.tripType}
• From: ${bookingDetails.pickupLocation}
• To: ${bookingDetails.dropLocation}
• Date: ${bookingDetails.date}
• Time: ${bookingDetails.time}
• Distance: ${bookingDetails.estimation ? bookingDetails.estimation.distance + ' km' : 'Calculating...'}
• Duration: ${bookingDetails.estimation ? bookingDetails.estimation.duration : 'Calculating...'}
• Total Fare: ${bookingDetails.estimation ? '₹' + bookingDetails.estimation.totalFare : 'Calculating...'}
• Rate: ${rate}
• Vehicle: ${bookingDetails.carType.toUpperCase()}
• For Customer Intimation: Toll Gate, Permit, and Hill Station charges extra.

⏰ Enquiry Time: ${currentTime}

📞 Contact: +91 90875 20500`;
};

// Generate Telegram message for booking confirmation
const generateBookingTelegramMessage = (bookingDetails, bookingId) => {
  const currentTime = getCurrentDateTime();
  const rate = getCarRate(bookingDetails.carType);
  
  return `🚖 <b>BOOKING CONFIRMATION</b> - happyRideDroptaxi

✅ <b>CONFIRMED BOOKING</b>

📋 <b>Trip Details:</b>
• Booking ID: ${bookingId}
• Name: ${bookingDetails.name}
• Phone: ${bookingDetails.phone}
• Trip Type: ${bookingDetails.tripType}
• From: ${bookingDetails.pickupLocation}
• To: ${bookingDetails.dropLocation}
• Date: ${bookingDetails.date}
• Time: ${bookingDetails.time}
• Distance: ${bookingDetails.estimation.distance} km
• Duration: ${bookingDetails.estimation.duration}
• Total Fare: ₹${bookingDetails.estimation.totalFare}
• Rate: ${rate}
• Vehicle: ${bookingDetails.carType.toUpperCase()}
• For Customer Intimation: Toll Gate, Permit, and Hill Station charges extra.

⏰ Confirmed Time: ${currentTime}

📞 Contact: +91 90875 20500`;
};

// Send notifications for enquiry
const sendEnquiryNotifications = async (bookingData) => {
  console.log('📧 Starting enquiry notifications...');
  const { name, email, phone, pickupLocation, dropLocation, carType, date, time, tripType, estimation } = bookingData;
  const currentTime = getCurrentDateTime();
  const rate = getCarRate(carType);
  const { link: whatsappLink, bookingId } = generateEnquiryWhatsAppLink(bookingData);

  const results = {
    email: { admin: false, customer: false },
    telegram: false,
    whatsappLink,
    bookingId
  };

  // Admin email for enquiry
  const adminMailOptions = {
    from: process.env.GMAIL_USER,
    to: 'happyridedroptaxi@gmail.com',
    subject: `🚖 New Booking Enquiry - ${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
        <div style="background: #FBBF24; padding: 20px; text-align: center;">
          <h1 style="color: #1F2937; margin: 0;">🚖 BOOKING ENQUIRY</h1>
          <p style="color: #1F2937; margin: 5px 0 0 0; font-weight: bold;">happyRideDroptaxi</p>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">📋 Trip Details:</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Booking ID:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${bookingId}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Name:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Phone:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${phone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Trip Type:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tripType}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• From:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${pickupLocation}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• To:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${dropLocation}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Date:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${date}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Time:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${time}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Distance:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${estimation ? estimation.distance + ' km' : 'Calculating...'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Duration:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${estimation ? estimation.duration : 'Calculating...'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Total Fare:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${estimation ? '₹' + estimation.totalFare : 'Calculating...'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Rate:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${rate}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Vehicle:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${carType.toUpperCase()}</td></tr>
          </table>
          <p style="background: #fef3c7; padding: 10px; border-radius: 5px; margin: 15px 0;"><strong>For Customer Intimation:</strong> Toll Gate, Permit, and Hill Station charges extra.</p>
          <p style="margin: 20px 0;"><strong>⏰ Enquiry Time:</strong> ${currentTime}</p>
          <p style="margin: 20px 0;"><strong>📞 Contact:</strong> +91 90875 20500</p>
        </div>
      </div>
    `
  };

  // Customer confirmation email for enquiry
  const customerMailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: `🚖 Booking Enquiry Received - ${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
        <div style="background: #FBBF24; padding: 20px; text-align: center;">
          <h1 style="color: #1F2937; margin: 0;">🚖 BOOKING ENQUIRY</h1>
          <p style="color: #1F2937; margin: 5px 0 0 0; font-weight: bold;">happyRideDroptaxi</p>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for your enquiry with Happy Ride Drop Taxi! We have received your request and will contact you shortly with the final quote.</p>
          
          <h3 style="color: #1F2937;">📋 Your Trip Details:</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>• Booking ID:</strong> ${bookingId}</p>
            <p><strong>• Name:</strong> ${name}</p>
            <p><strong>• Phone:</strong> ${phone}</p>
            <p><strong>• Trip Type:</strong> ${tripType}</p>
            <p><strong>• From:</strong> ${pickupLocation}</p>
            <p><strong>• To:</strong> ${dropLocation}</p>
            <p><strong>• Date:</strong> ${date}</p>
            <p><strong>• Time:</strong> ${time}</p>
            <p><strong>• Distance:</strong> ${estimation ? estimation.distance + ' km' : 'Calculating...'}</p>
            <p><strong>• Duration:</strong> ${estimation ? estimation.duration : 'Calculating...'}</p>
            <p><strong>• Total Fare:</strong> ${estimation ? '₹' + estimation.totalFare : 'Calculating...'}</p>
            <p><strong>• Rate:</strong> ${rate}</p>
            <p><strong>• Vehicle:</strong> ${carType.toUpperCase()}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0;"><strong>For Customer Intimation:</strong> Toll Gate, Permit, and Hill Station charges extra.</p>
          </div>
          
          <p><strong>⏰ Enquiry Time:</strong> ${currentTime}</p>
          
          <p>Our team will call you at <strong>${phone}</strong> within 30 minutes to provide the final quote.</p>
          
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

  // Send emails with error handling
  try {
    if (transporter) {
      await transporter.sendMail(adminMailOptions);
      results.email.admin = true;
      console.log('✅ Admin enquiry email sent');
      
      await transporter.sendMail(customerMailOptions);
      results.email.customer = true;
      console.log('✅ Customer enquiry email sent');
    } else {
      console.log('⚠️ Email transporter not available');
    }
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
  }

  // Send Telegram notification
  try {
    const telegramMessage = generateEnquiryTelegramMessage(bookingData, bookingId);
    await sendTelegramNotification(telegramMessage);
    results.telegram = true;
  } catch (error) {
    console.error('❌ Telegram enquiry error:', error.message);
  }

  console.log('📧 Enquiry notifications completed:', results);
  return { whatsappLink, telegramLink: `https://t.me/happyridedroptaxi_bot`, bookingId, results };
};

// Send notifications for booking confirmation
const sendBookingNotifications = async (bookingData, bookingId) => {
  console.log('📧 Starting booking confirmation notifications...');
  const { name, email, phone, pickupLocation, dropLocation, carType, date, time, tripType, estimation } = bookingData;
  const currentTime = getCurrentDateTime();
  const rate = getCarRate(carType);

  const results = {
    email: { admin: false, customer: false },
    telegram: false
  };

  // Admin email for booking confirmation
  const adminMailOptions = {
    from: process.env.GMAIL_USER,
    to: 'happyridedroptaxi@gmail.com',
    subject: `✅ Booking Confirmed - ${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
        <div style="background: #10B981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚖 BOOKING CONFIRMATION</h1>
          <p style="color: white; margin: 5px 0 0 0; font-weight: bold;">happyRideDroptaxi</p>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">✅ CONFIRMED BOOKING</p>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">📋 Trip Details:</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Booking ID:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${bookingId}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Name:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Phone:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${phone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Trip Type:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tripType}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• From:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${pickupLocation}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• To:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${dropLocation}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Date:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${date}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Time:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${time}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Distance:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${estimation.distance} km</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Duration:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${estimation.duration}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Total Fare:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">₹${estimation.totalFare}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Rate:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${rate}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">• Vehicle:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${carType.toUpperCase()}</td></tr>
          </table>
          <p style="background: #fef3c7; padding: 10px; border-radius: 5px; margin: 15px 0;"><strong>For Customer Intimation:</strong> Toll Gate, Permit, and Hill Station charges extra.</p>
          <p style="margin: 20px 0;"><strong>⏰ Confirmed Time:</strong> ${currentTime}</p>
          <p style="margin: 20px 0;"><strong>📞 Contact:</strong> +91 90875 20500</p>
        </div>
      </div>
    `
  };

  // Customer confirmation email for booking
  const customerMailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: `✅ Booking Confirmed - ${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
        <div style="background: #10B981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚖 BOOKING CONFIRMATION</h1>
          <p style="color: white; margin: 5px 0 0 0; font-weight: bold;">happyRideDroptaxi</p>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">✅ CONFIRMED BOOKING</p>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>🎉 Congratulations! Your booking has been confirmed with Happy Ride Drop Taxi. Our team will contact you shortly to finalize the details.</p>
          
          <h3 style="color: #1F2937;">📋 Your Trip Details:</h3>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>• Booking ID:</strong> ${bookingId}</p>
            <p><strong>• Name:</strong> ${name}</p>
            <p><strong>• Phone:</strong> ${phone}</p>
            <p><strong>• Trip Type:</strong> ${tripType}</p>
            <p><strong>• From:</strong> ${pickupLocation}</p>
            <p><strong>• To:</strong> ${dropLocation}</p>
            <p><strong>• Date:</strong> ${date}</p>
            <p><strong>• Time:</strong> ${time}</p>
            <p><strong>• Distance:</strong> ${estimation.distance} km</p>
            <p><strong>• Duration:</strong> ${estimation.duration}</p>
            <p><strong>• Total Fare:</strong> ₹${estimation.totalFare}</p>
            <p><strong>• Rate:</strong> ${rate}</p>
            <p><strong>• Vehicle:</strong> ${carType.toUpperCase()}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0;"><strong>For Customer Intimation:</strong> Toll Gate, Permit, and Hill Station charges extra.</p>
          </div>
          
          <p><strong>⏰ Confirmed Time:</strong> ${currentTime}</p>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #166534; margin: 0 0 10px 0;">✅ What happens next?</h4>
            <p style="margin: 5px 0; color: #166534;">📞 Our team will call you within 15 minutes</p>
            <p style="margin: 5px 0; color: #166534;">🚗 Driver details will be shared 2 hours before pickup</p>
            <p style="margin: 5px 0; color: #166534;">📱 You'll receive live tracking information</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="tel:+919087520500" style="background: #FBBF24; color: #1F2937; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">📞 Call Us: +91 90875 20500</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Thank you for choosing Happy Ride Drop Taxi!<br>
            Happy Ride Drop Taxi Team
          </p>
        </div>
      </div>
    `
  };

  // Send emails with error handling
  try {
    if (transporter) {
      await transporter.sendMail(adminMailOptions);
      results.email.admin = true;
      console.log('✅ Admin confirmation email sent');
      
      await transporter.sendMail(customerMailOptions);
      results.email.customer = true;
      console.log('✅ Customer confirmation email sent');
    } else {
      console.log('⚠️ Email transporter not available');
    }
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
  }

  // Send Telegram notification
  try {
    const telegramMessage = generateBookingTelegramMessage(bookingData, bookingId);
    await sendTelegramNotification(telegramMessage);
    results.telegram = true;
  } catch (error) {
    console.error('❌ Telegram confirmation error:', error.message);
  }

  // Generate notification links
  const whatsappLink = generateBookingWhatsAppLink(bookingData, bookingId);

  console.log('📧 Confirmation notifications completed:', results);
  return { whatsappLink, telegramLink: `https://t.me/happyridedroptaxi_bot`, results };
};

// Enquiry API endpoint
app.post('/api/enquiry', async (req, res) => {
  try {
    console.log('📝 Received enquiry request');
    const enquiryData = req.body;
    const { pickupLocation, dropLocation, tripType, name, email, phone, date, time, carType } = enquiryData;

    // Validate required fields
    if (!pickupLocation || !dropLocation || !tripType || !name || !email || !phone || !date || !time || !carType) {
      console.log('❌ Validation failed - missing fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required',
        missingFields: {
          pickupLocation: !pickupLocation,
          dropLocation: !dropLocation,
          tripType: !tripType,
          name: !name,
          email: !email,
          phone: !phone,
          date: !date,
          time: !time,
          carType: !carType
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      });
    }

    console.log('✅ Validation passed, sending notifications...');
    // Send notifications
    const { whatsappLink, telegramLink, bookingId, results } = await sendEnquiryNotifications(enquiryData);

    console.log('✅ Enquiry processed successfully:', bookingId);
    res.json({
      success: true,
      message: 'Enquiry submitted successfully!',
      whatsappLink,
      telegramLink,
      bookingId,
      notificationResults: results
    });

  } catch (error) {
    console.error('❌ Error processing enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message
    });
  }
});

// Booking API endpoint
app.post('/api/book', async (req, res) => {
  try {
    console.log('📝 Received booking confirmation request');
    const bookingData = req.body;
    const { pickupLocation, dropLocation, tripType, name, email, phone, date, time, carType, estimation, bookingId } = bookingData;

    // Validate required fields
    if (!pickupLocation || !dropLocation || !tripType || !name || !email || !phone || !date || !time || !carType) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate distance if estimation provided
    if (estimation && !validateDistance(tripType, estimation.distance)) {
      let minDistance = tripType === 'one-way' ? 130 : 250;
      let message = `Minimum ${minDistance} km required for ${tripType} trips`;
      
      return res.status(400).json({
        success: false,
        message: message
      });
    }

    console.log('✅ Booking validation passed, sending notifications...');
    // Send notifications
    const { whatsappLink, telegramLink, results } = await sendBookingNotifications(bookingData, bookingId);

    console.log('✅ Booking confirmed successfully:', bookingId);
    res.json({
      success: true,
      message: 'Booking confirmed successfully!',
      whatsappLink,
      telegramLink,
      bookingId,
      notificationResults: results
    });

  } catch (error) {
    console.error('❌ Error processing booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message
    });
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

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email configured: ${!!process.env.GMAIL_USER}`);
  console.log(`📱 Telegram configured: ${!!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)}`);
});