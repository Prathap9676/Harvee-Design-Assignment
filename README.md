# User Management System

A full-stack User Management System built with MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, CRUD operations, and an admin dashboard.

## Features

- ✅ User Registration with validation
- ✅ Login with Email/Phone
- ✅ JWT Token-Based Authentication (Access + Refresh tokens)
- ✅ Refresh Token Rotation
- ✅ CRUD Operations for Users
- ✅ Admin Panel (Web-based Dashboard)
- ✅ Image Upload Support (Profile Images)
- ✅ Search & Filter Functionality
- ✅ Pagination & Sorting
- ✅ Role-based Access Control (RBAC)
- ✅ Input Validation (Frontend & Backend)
- ✅ Error Handling
- ✅ Security Middleware (Helmet, CORS)

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, React Router
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator

## Project Structure

```
user-management-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   └── Dashboard/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB models
│   └── User.js
├── routes/                 # API routes
│   ├── auth.js
│   └── users.js
├── middleware/             # Custom middleware
│   ├── auth.js
│   └── upload.js
├── utils/                  # Utility functions
│   └── generateToken.js
├── uploads/                # Uploaded images
├── server.js               # Express server
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd user-management-system
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Environment Variables

Create a `.env` file in the root directory:

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

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
# or
brew services start mongodb-community
```

## Running the Application

### Development Mode

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

#### Option 2: Run Both Together

```bash
npm run dev:all
```

### Production Mode

**Build Frontend:**
```bash
cd client
npm run build
cd ..
```

**Start Server:**
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Users (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users (with pagination, search, filter) | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

### Query Parameters for GET /api/users

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search by name or email
- `state` - Filter by state
- `city` - Filter by city
- `sort` - Sort field (name, email, createdAt, state, city)
- `order` - Sort order (asc, desc)

## API Documentation

### Register User

**Request:**
```http
POST /api/auth/register
Content-Type: multipart/form-data

name: John Doe
email: john@example.com
phone: 1234567890
password: password123
address: 123 Main St (optional)
state: California
city: Los Angeles
country: USA
pincode: 12345
profile_image: [file] (optional, jpg/png, max 2MB)
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      ...
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",  // or "phone": "1234567890"
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

## Validation Rules

### User Registration

- **name**: Minimum 3 characters, alphabets only
- **email**: Valid email format, unique
- **phone**: 10-15 digits, unique
- **password**: Minimum 6 characters, must contain at least one number
- **address**: Optional, maximum 150 characters
- **state**: Required
- **city**: Required
- **country**: Required
- **pincode**: 4-10 digits
- **profile_image**: Optional, jpg/png, maximum 2MB

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT tokens for authentication
- Refresh token rotation
- Protected routes with middleware
- Role-based access control (Admin/User)
- Input validation (frontend & backend)
- CORS configuration
- Helmet.js for security headers
- No sensitive data in API responses

## Creating Admin User

To create an admin user, you can either:

1. **Using MongoDB Shell:**
```javascript
use user-management
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

2. **Using API (after registration):**
Register a user first, then update the role in MongoDB.

## Docker Support

### Using Docker Compose

```bash
docker-compose up -d
```

This will start:
- MongoDB container
- Backend server
- Frontend (production build)

### Manual Docker Build

```bash
# Build backend image
docker build -t user-management-backend .

# Run backend
docker run -p 5000:5000 user-management-backend
```

## Testing

### Postman Collection

Import the Postman collection from `docs/postman-collection.json` to test all API endpoints.

### Manual Testing

1. Register a new user
2. Login with credentials
3. Access admin dashboard (user must have admin role)
4. Test CRUD operations

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check MONGODB_URI in `.env` file
- Verify MongoDB port (default: 27017)

### Port Already in Use

- Change PORT in `.env` file
- Or kill the process using the port

### Image Upload Issues

- Ensure `uploads/` directory exists
- Check file size (max 2MB)
- Verify file type (jpg/png only)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Author

Developed as part of assignment submission.

## Notes

- Ensure `node_modules` is excluded when submitting (already in `.gitignore`)
- All sensitive data is excluded from API responses
- Refresh tokens are rotated on each refresh for enhanced security
- Images are stored locally in `uploads/` directory (can be configured for cloud storage)

