# 🎨 Adam Painter Booking System v2.0

A full-stack booking system with **smart painter prioritization**, **TypeScript**, **React**, **MongoDB**, and **Ant Design**.

## 🚀 Quick Start

```bash
# Install all dependencies
yarn install:all

# Run both API and Frontend
yarn dev

# Or run individually
yarn dev:api      # API only
yarn dev:frontend # Frontend only
```

## 📦 Project Structure

```
adam-painter-booking-system/
├── api/                    # TypeScript Express API
│   ├── src/
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── services/       # Business logic & prioritization
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript interfaces
│   │   └── config/         # Database configuration
│   └── dist/               # Built JavaScript (production)
├── frontend/               # React + TypeScript + Ant Design
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.tsx         # Main application
└── assignment.pdf          # Original requirements
```

## 🎯 Key Features

### ✨ Smart Painter Prioritization
When multiple painters are available, the system intelligently selects the best one:
- **Efficiency Score** (100 pts): Prefers tight availability windows
- **Workload Balance** (50 pts): Distributes work fairly  
- **Recency Score** (30 pts): Rewards active painters

### 🖥️ Multi-Painter Interface
- **Painter Selection**: Choose from 4 painters (🎨🖌️🖍️🖊️)
- **Availability Management**: Add time slots for each painter
- **Booking Overview**: View assigned bookings per painter

### 🔄 Smart Suggestions
- **Alternative Times**: When requested slot unavailable
- **One-Click Booking**: Book suggested times instantly
- **Visual Feedback**: Clear success/error messages

## 📋 Available Scripts

### 🏠 Root Commands
```bash
yarn dev           # Run both API & Frontend with colored logs
yarn build         # Build both projects for production
yarn start         # Start both in production mode
yarn clean         # Clean build artifacts
yarn type-check    # TypeScript validation
yarn lint          # Run linting on both projects
```

### ⚙️ API Commands
```bash
cd api
yarn dev           # Development with hot reload
yarn build         # Build TypeScript to JavaScript
yarn start         # Run production build
yarn start:prod    # Production mode with NODE_ENV
yarn type-check    # TypeScript validation only
yarn clean         # Remove dist folder
```

### 🎨 Frontend Commands  
```bash
cd frontend
yarn dev           # Development server with --host
yarn build         # Build for production
yarn start         # Preview production build
yarn lint          # ESLint with TypeScript
yarn lint:fix      # Auto-fix linting issues
yarn type-check    # TypeScript validation only
```

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | API health check |
| `/availability` | POST | Create painter availability |
| `/availability/me` | GET | Get painter's availability |
| `/booking-request` | POST | Request booking (with smart selection) |
| `/bookings/me` | GET | Get customer bookings |
| `/bookings/painter` | GET | Get painter bookings |

## 🧪 Testing the Prioritization

1. **Open Frontend**: http://localhost:5173
2. **Create Multiple Painters** with different availability:
   - Painter 1: Tight window (10am-12pm)  
   - Painter 2: Wide window (8am-6pm)
3. **Make Customer Booking**: Request 10am-12pm
4. **Watch Selection**: Check server logs for prioritization decision

## 🔧 Environment Setup

### Prerequisites
- **Node.js** ≥16.0.0  
- **Yarn** ≥1.22.0
- **MongoDB** running locally

### Environment Variables
Create `.env` in `api/` folder:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/adam-painter-booking
```

## 🏗️ Architecture

- **Backend**: Express + TypeScript + MongoDB + Smart Prioritization
- **Frontend**: React + TypeScript + Ant Design + Axios  
- **Database**: MongoDB with Mongoose ODM
- **Development**: Hot reload for both API and frontend
- **Build**: Production-ready TypeScript compilation

## 📊 Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Express.js, TypeScript, MongoDB, Mongoose |
| **Frontend** | React 19, TypeScript, Ant Design, Vite |
| **Development** | ts-node-dev, ESLint, Concurrently |
| **Deployment** | Node.js build, Static files |

## 🎉 Assignment Features Completed

✅ **Core Requirements**: Painter availability, customer booking, automatic assignment  
✅ **UI Requirements**: Clean React interface with Ant Design  
✅ **API Requirements**: All specified endpoints implemented  
✅ **Bonus 1**: Smart time suggestions when unavailable  
✅ **Bonus 2**: Intelligent painter prioritization with scoring  

---

🎨 **Adam Painter Booking System v2.0** - Built with TypeScript, Smart Prioritization, and Modern React!