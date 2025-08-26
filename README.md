# 🎨 Adam Painter Booking System

A full-stack TypeScript application for booking painting services with smart painter assignment, conflict resolution, and intelligent time suggestions.

## 🚀 Live Demo
- **Frontend**: Deploy to Vercel using the DEPLOYMENT.md guide
- **API**: Deploy to Railway using the DEPLOYMENT.md guide

## ✨ Key Features

### Core Functionality
- 👥 **Dual Interface**: Customer booking portal + Painter availability management
- 🎯 **Smart Painter Assignment**: Automatic optimal painter selection with scoring algorithm
- ⏰ **Intelligent Time Suggestions**: Alternative time slots when no painters available
- 🚫 **Conflict Prevention**: No double-booking for painters or customers
- 📱 **Responsive Design**: Professional UI with Ant Design components

### Smart Algorithms
- **Painter Prioritization**: Efficiency score + workload balance + recency scoring
- **Time Conflict Detection**: Prevents overlapping and adjacent bookings
- **Same-Day Priority**: Suggestions prioritize same-day alternatives
- **Booking Validation**: Comprehensive error handling and user feedback

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Ant Design** for UI components
- **Vite** for fast development
- **Axios** for API communication
- **Day.js** for date handling

### Backend
- **Node.js + Express** with TypeScript
- **MongoDB + Mongoose** for data persistence
- **Professional Architecture**: Controllers, Services, Models, Types
- **Environment Configuration**: Production-ready deployment

### Deployment
- **Frontend**: Vercel (CDN + auto-deployment)
- **Backend**: Railway (serverless + auto-scaling)
- **Database**: MongoDB Atlas (cloud-hosted)

## 🎯 Demo Scenarios

### As a Customer:
1. Select "I'm a Customer"
2. Choose date and time range
3. Click "Request Booking" → System automatically assigns best painter
4. Try booking the same time again → See duplicate prevention
5. Try booking when no painters available → See intelligent suggestions

### As a Painter:
1. Select "I'm a Painter" and choose painter ID
2. Add your availability (date + time range)
3. View your current bookings
4. Test with multiple painters to see prioritization

### Smart Features Demo:
1. **Prioritization**: Book when multiple painters available → See algorithm choose optimal painter
2. **Suggestions**: Book impossible time → Get same-day alternatives
3. **Conflicts**: Try adjacent bookings → See prevention in action

## 📊 Business Logic

### Painter Selection Algorithm
```typescript
score = efficiency(0-100) + workload(0-50) + recency(0-30)
```
- **Efficiency**: How well the request fits painter's availability window
- **Workload**: Preference for painters with fewer existing bookings
- **Recency**: Slight preference for recently added availability

### Time Suggestion Logic
- Find all available slots from all painters
- Prioritize same-day suggestions (100x priority multiplier)
- Sort by time difference from requested slot
- Filter out customer's existing bookings

## 🚀 Local Development

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Yarn or npm

### Quick Start
```bash
# Install dependencies
yarn install

# Start both frontend and backend
yarn dev
```

### Individual Services
```bash
# Backend only (port 3001)
cd api && yarn dev

# Frontend only (port 5173)  
cd frontend && yarn dev

# Seed demo data
cd api && yarn seed
```

## 🔧 Environment Setup

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/adam-painter-booking
NODE_ENV=development
PORT=3001
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:3001
```

## 📝 API Endpoints

```
POST /booking-request      # Create booking request
GET  /bookings/me          # Get customer bookings
GET  /bookings/painter     # Get painter bookings
POST /availability         # Add painter availability
GET  /availability/me      # Get painter availability
```

## 🏆 Interview Highlights

- ✅ **Full-stack TypeScript** expertise
- ✅ **Smart algorithm** implementation 
- ✅ **Production deployment** experience
- ✅ **Clean architecture** patterns
- ✅ **Problem-solving** approach to complex booking logic
- ✅ **User experience** focus with intelligent suggestions

---

**Built with ❤️ for the Adam Painter Booking assignment**

**📖 See DEPLOYMENT.md for step-by-step deployment instructions**