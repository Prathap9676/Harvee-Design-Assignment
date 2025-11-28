# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed
- ✅ MongoDB installed and running
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd client
npm install
cd ..
```

### 2. Configure Environment

Create `.env` file in root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start MongoDB

**Windows:**
```bash
mongod
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

### 4. Run the Application

**Option A: Run Separately**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

**Option B: Run Together**
```bash
npm run dev:all
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 6. Create Admin User

1. Register a new user via the registration page
2. Open MongoDB shell:
```bash
mongo
use user-management
db.users.updateOne({email: "your-email@example.com"}, {$set: {role: "admin"}})
```

3. Login with your credentials
4. You should now have access to the admin dashboard

## Testing with Postman

1. Import `docs/postman-collection.json` into Postman
2. Set environment variable `base_url` to `http://localhost:5000`
3. Start testing endpoints

## Docker Setup (Optional)

```bash
docker-compose up -d
```

This will start:
- MongoDB container
- Backend server
- Frontend (production build)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`

### Port Already in Use
- Change PORT in `.env`
- Or kill process using the port

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and reinstall

### Image Upload Not Working
- Ensure `uploads/` directory exists
- Check file permissions

## Next Steps

1. Register your first user
2. Make user admin (via MongoDB)
3. Login and explore the dashboard
4. Test CRUD operations
5. Upload profile images

## Support

Refer to:
- `README.md` for detailed documentation
- `docs/API_DOCUMENTATION.md` for API details
- `docs/ARCHITECTURE.md` for system architecture

