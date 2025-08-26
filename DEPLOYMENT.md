# 🚀 Adam Painter Booking System - Deployment Guide

## Quick Demo Links (After Deployment)
- **Frontend**: `https://adam-painter-booking.vercel.app`
- **API**: `https://adam-painter-booking-api.railway.app`

## Architecture
- **Frontend**: React + TypeScript + Ant Design (Vercel)
- **Backend**: Node.js + Express + TypeScript (Railway)
- **Database**: MongoDB Atlas (Free tier)

## 1. Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/adam-painter-booking`

## 2. Backend Deployment (Railway)

1. Go to [Railway](https://railway.app) → "New Project" → "Deploy from GitHub repo"
2. Connect your GitHub account and select **the entire my-adam repository**
3. Railway will auto-detect the `railway.toml` config and deploy from the `api/` folder
4. Set environment variables in Railway dashboard:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/adam-painter-booking
   NODE_ENV=production
   ```
5. Deploy automatically triggers

## 3. Frontend Deployment (Vercel)

### Option A: Deploy API + Frontend on Vercel (Recommended)
1. Go to [Vercel](https://vercel.com) → "Add New" → "Project"
2. Import **the entire my-adam repository**
3. Vercel will auto-detect the `vercel.json` for the API
4. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/adam-painter-booking
   VITE_API_BASE=https://your-project-name.vercel.app
   ```
5. Deploy automatically

### Option B: Separate Frontend Deployment
1. Create a new GitHub repo with just the `frontend/` folder contents
2. Deploy that repo to Vercel
3. Set environment variable: `VITE_API_BASE=https://your-railway-api.up.railway.app`

## 4. Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/adam-painter-booking
NODE_ENV=production
PORT=3001
```

### Frontend (.env)
```
VITE_API_BASE=https://adam-painter-booking-api.railway.app
```

## 5. Testing the Deployment

1. **Open frontend URL**
2. **Test as Customer**: Book a painting service
3. **Test as Painter**: Add availability, view bookings
4. **Test Smart Features**: 
   - Smart painter prioritization
   - Time suggestions when no painters available
   - Duplicate booking prevention

## Features Demonstrated
✅ Smart painter selection with prioritization scoring
✅ Time conflict resolution with alternative suggestions  
✅ Customer duplicate booking prevention
✅ Real-time availability management
✅ Professional TypeScript architecture
✅ MongoDB data persistence
✅ Responsive Ant Design UI

## Interview Highlights
- **Full-stack TypeScript** implementation
- **Smart algorithms** for painter selection and suggestions
- **Production-ready** deployment on free tier
- **Clean architecture** with services, controllers, types
- **Error handling** and validation
- **Real-time updates** and conflict detection