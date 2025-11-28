# Architecture Documentation

## System Architecture

```
┌─────────────────┐
│   React Client  │
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST API
         │
┌────────▼────────┐
│  Express Server │
│   (Port 5000)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│MongoDB│ │Uploads│
│(27017)│ │Folder │
└───────┘ └───────┘
```

## Component Architecture

### Backend Structure

```
Backend/
├── server.js              # Entry point, Express app setup
├── models/
│   └── User.js           # MongoDB User schema
├── routes/
│   ├── auth.js           # Authentication routes
│   └── users.js          # User CRUD routes
├── middleware/
│   ├── auth.js           # JWT authentication & authorization
│   └── upload.js         # Multer file upload configuration
└── utils/
    └── generateToken.js  # JWT token generation utilities
```

### Frontend Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── PrivateRoute.js
│   │   └── Dashboard/
│   │       ├── Dashboard.js
│   │       ├── UserList.js
│   │       └── UserModal.js
│   ├── utils/
│   │   ├── api.js        # Axios instance with interceptors
│   │   └── auth.js       # Auth utility functions
│   └── App.js            # Main app component with routing
```

## Data Flow

### Authentication Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT tokens (access + refresh)
   ↓
4. Tokens stored in localStorage (client)
   ↓
5. Access token sent with each request
   ↓
6. Server validates token on protected routes
   ↓
7. If token expired, client uses refresh token
   ↓
8. Server issues new tokens (refresh token rotation)
```

### CRUD Operations Flow

```
1. Admin requests user list
   ↓
2. Request includes JWT token
   ↓
3. Middleware validates token & role
   ↓
4. Server queries MongoDB
   ↓
5. Server applies filters, pagination, sorting
   ↓
6. Response sent to client
   ↓
7. React components update UI
```

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String (min 3, alphabets only),
  email: String (unique, lowercase),
  phone: String (10-15 digits, unique),
  password: String (hashed with bcrypt),
  profile_image: String (path/url),
  address: String (max 150 chars, optional),
  state: String (required),
  city: String (required),
  country: String (required),
  pincode: String (4-10 digits),
  role: String (enum: ['user', 'admin'], default: 'user'),
  refreshToken: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Layers

1. **Password Security**
   - Bcrypt hashing (10 salt rounds)
   - Never returned in API responses

2. **Authentication**
   - JWT tokens (access + refresh)
   - Token expiration (1h access, 7d refresh)
   - Refresh token rotation

3. **Authorization**
   - Role-based access control (RBAC)
   - Middleware protection on routes
   - Admin-only endpoints

4. **Input Validation**
   - Frontend validation (React)
   - Backend validation (express-validator)
   - MongoDB schema validation

5. **Security Headers**
   - Helmet.js for security headers
   - CORS configuration
   - Rate limiting (can be added)

## API Design Patterns

### RESTful Design
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes (200, 201, 400, 401, 403, 404, 500)

### Response Format
```json
{
  "success": boolean,
  "message": string,
  "data": object,
  "errors": array (optional)
}
```

### Error Handling
- Consistent error format
- Validation error details
- User-friendly messages
- No sensitive data exposure

## File Upload Architecture

```
1. Client sends multipart/form-data
   ↓
2. Multer middleware processes file
   ↓
3. File validation (type, size)
   ↓
4. File saved to uploads/ directory
   ↓
5. File path stored in database
   ↓
6. File served via static route (/uploads)
```

## State Management

- **Client State:** React useState hooks
- **Auth State:** localStorage (tokens, user data)
- **Server State:** MongoDB database

## Scalability Considerations

1. **Database Indexing**
   - Email and phone fields indexed (unique)
   - Consider indexes on state, city for filtering

2. **File Storage**
   - Currently local storage
   - Can be migrated to S3/Cloudinary

3. **Caching**
   - Can add Redis for token blacklisting
   - Can cache user lists

4. **Load Balancing**
   - Stateless API design
   - Can scale horizontally

## Deployment Architecture

### Development
```
React Dev Server (3000) → Express Server (5000) → MongoDB (27017)
```

### Production (Docker)
```
Nginx (80) → React Build
           → Express API (5000) → MongoDB (27017)
```

## Technology Choices Rationale

1. **MongoDB:** Flexible schema, easy to scale, JSON-like documents
2. **Express.js:** Fast, minimal, large ecosystem
3. **React:** Component-based, great for admin dashboards
4. **JWT:** Stateless authentication, scalable
5. **Multer:** Standard file upload solution for Express
6. **bcryptjs:** Industry-standard password hashing

