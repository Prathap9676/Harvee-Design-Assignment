# Quick Start Guide - Run the Project

## Current Status
✅ Backend dependencies installed
✅ .env file created
🔄 Backend server starting (running in background)
⏳ Frontend dependencies need to be installed

## Steps to Complete Setup

### Step 1: Install Frontend Dependencies
Open a **NEW terminal window** and run:
```bash
cd client
npm install
```

This will take 2-5 minutes. Wait for it to complete.

### Step 2: Start Frontend (After Step 1 completes)
In the same terminal, run:
```bash
npm start
```

The React app will open automatically at http://localhost:3000

### Step 3: Verify Backend is Running
Check if backend is running at http://localhost:5000/api/health

If not, open another terminal and run:
```bash
npm run dev
```

## Important: MongoDB Must Be Running!

Before the backend can work, make sure MongoDB is running:

**Windows:**
- Open Services and start MongoDB
- Or run: `mongod` in a terminal

**Check if MongoDB is running:**
```bash
mongosh
# or
mongo
```

If it connects, MongoDB is running!

## Access Points

- **Frontend (React):** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## First Time Setup

1. **Register a user** at http://localhost:3000/register
2. **Make user admin** (in MongoDB):
   ```javascript
   mongosh
   use user-management
   db.users.updateOne({email: "your-email@example.com"}, {$set: {role: "admin"}})
   ```
3. **Login** at http://localhost:3000/login
4. **Access Admin Dashboard**

## Troubleshooting

### Backend not starting?
- Check if MongoDB is running
- Check if port 5000 is available
- Check .env file exists

### Frontend not starting?
- Make sure you ran `npm install` in the client folder
- Check if port 3000 is available

### MongoDB connection error?
- Start MongoDB service
- Check MONGODB_URI in .env file

## Alternative: Run Both Together

If you have both dependencies installed, you can run:
```bash
npm run dev:all
```

This starts both backend and frontend together!

