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

## 3. Frontend Deployment (GitHub Pages)

**Automatic deployment with GitHub Actions:**

1. **Push your code** to GitHub (main/master branch)
2. **Enable GitHub Pages**:
   - Go to your GitHub repo → Settings → Pages
   - Source: "GitHub Actions"
3. **GitHub Actions will automatically**:
   - Build the frontend with your Railway API URL
   - Deploy to GitHub Pages
4. **Your app will be live at**: `https://yourusername.github.io/my-adam/`

**Manual Setup (if needed):**
- The deployment is configured in `.github/workflows/deploy.yml`  
- API URL is hardcoded as: `https://myadam-production-0869.up.railway.app`
- Builds from `frontend/` folder automatically

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