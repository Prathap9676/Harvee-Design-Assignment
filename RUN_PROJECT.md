# How to Run the Project

## Quick Start Commands

### Step 1: Install Backend Dependencies
```bash
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### Step 3: Create .env File
Create a `.env` file in the root directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-67890
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4: Start MongoDB
Make sure MongoDB is running on your system.

### Step 5: Run the Project

**Option A: Run Both Together**
```bash
npm run dev:all
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

## Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

