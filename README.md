# Happy Ride Drop Taxi - Premium Outstation Taxi Service

A complete taxi booking website built with React, Tailwind CSS, Node.js, and Express.

## Features

### Frontend
- 🎨 Modern, responsive design with Tailwind CSS
- 📱 Mobile-first approach with smooth animations
- 🚕 Complete booking form with validation
- ⭐ Testimonials and reviews section
- 📊 Pricing and popular routes
- 💬 WhatsApp integration with floating button
- 🔍 SEO optimized with meta tags and structured data

### Backend
- 🚀 Express.js API server
- 📧 Email notifications with Nodemailer
- ✅ Booking validation (130km one-way, 250km round-trip)
- 💬 WhatsApp link generation
- 🛡️ CORS enabled for cross-origin requests

### Key Sections
1. **Hero Section** - Eye-catching banner with CTA
2. **Booking Form** - Complete form with distance validation
3. **Services** - Why choose us section
4. **Popular Routes** - Pre-defined city routes
5. **Pricing** - Transparent car type pricing
6. **Testimonials** - Customer reviews and ratings
7. **Contact** - Multiple contact methods and FAQs

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory:

```env
GMAIL_USER=happyridedroptaxi@gmail.com
GMAIL_PASS=your-app-password
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
PORT=5000
```

### 2. Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `.env` file

### 3. Telegram Bot Setup
1. Create a Telegram bot:
   - Message @BotFather on Telegram
   - Send `/newbot` command
   - Follow instructions to create your bot
   - Copy the bot token
2. Get your chat ID:
   - Add your bot to a group or get your personal chat ID
   - Use @userinfobot to get your chat ID
   - Add both values to `.env` file

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application

**Development (Both frontend and backend):**
```bash
npm run dev:full
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### 5. WhatsApp Configuration
Update the phone number in:
- `server.js` (line 32)
- `src/components/WhatsAppFloat.tsx` (line 6)

Replace `919087520500` with your actual WhatsApp number.

## API Endpoints

### POST /api/book
Booking submission endpoint that:
- Validates required fields
- Checks minimum distance requirements
- Sends admin notification email
- Sends customer confirmation email
- Returns WhatsApp link for instant contact

### GET /api/health
Health check endpoint for server status.

## Validation Rules

- **One-way trips**: Minimum 130 km required
- **Round-trip**: Minimum 250 km required
- **Phone**: 10-digit number validation
- **Email**: Valid email format required
- **All fields**: Required field validation

## Car Types & Pricing

- **Etios**: ₹11/km (4 seater)
- **Sedan**: ₹12/km (4 seater) - Most Popular
- **SUV**: ₹15/km (6 seater)
- **Innova**: ₹16/km (7 seater)

*All prices include fuel, driver allowance, toll, and parking*

## SEO Features

- Complete meta tags for search engines
- Open Graph tags for social sharing
- Twitter Card integration
- Schema.org structured data for local business
- Canonical URLs and sitemap ready
- Mobile-friendly and fast loading

## Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer with Gmail SMTP
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Validation**: Built-in form validation

## Production Deployment

### Frontend Build
```bash
npm run build
```

### Environment Variables for Production
Ensure all environment variables are set in your hosting platform:
- `GMAIL_USER`
- `GMAIL_PASS`
- `PORT`

### Hosting Recommendations
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, Railway, or any Node.js hosting
- Update API endpoints in frontend for production URLs

## Contact Information

Update these details in the code:
- Phone numbers throughout the application
- Email addresses for admin and contact
- Office address in contact section
- Social media links in footer

## License

This project is licensed under the MIT License.