# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Min 3 chars, alphabets only |
| email | string | Yes | Valid email, unique |
| phone | string | Yes | 10-15 digits, unique |
| password | string | Yes | Min 6 chars, must contain number |
| address | string | No | Max 150 chars |
| state | string | Yes | - |
| city | string | Yes | - |
| country | string | Yes | - |
| pincode | string | Yes | 4-10 digits |
| profile_image | file | No | jpg/png, max 2MB |

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "profile_image": "/uploads/profile-1234567890.jpg",
      "address": "123 Main St",
      "state": "California",
      "city": "Los Angeles",
      "country": "USA",
      "pincode": "12345",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Name must be at least 3 characters",
      "param": "name"
    }
  ]
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "john@example.com",  // OR "phone": "1234567890"
  "password": "password123"
}
```

**Response (200):**
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

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Access:** Public

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

**Note:** Refresh token rotation is implemented - a new refresh token is issued on each refresh.

---

### 4. Logout

**Endpoint:** `POST /api/auth/logout`

**Access:** Private

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Get Current User

**Endpoint:** `GET /api/auth/me`

**Access:** Private

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {...}
  }
}
```

---

## User Management Endpoints (Admin Only)

### 1. Get All Users

**Endpoint:** `GET /api/users`

**Access:** Admin Only

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page (max 100) |
| search | string | - | Search by name or email |
| state | string | - | Filter by state |
| city | string | - | Filter by city |
| sort | string | createdAt | Sort field (name, email, createdAt, state, city) |
| order | string | desc | Sort order (asc, desc) |

**Example:**
```
GET /api/users?page=1&limit=10&search=john&state=California&sort=name&order=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

### 2. Get User by ID

**Endpoint:** `GET /api/users/:id`

**Access:** Admin Only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {...}
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 3. Update User

**Endpoint:** `PUT /api/users/:id`

**Access:** Admin Only

**Content-Type:** `multipart/form-data`

**Request Body:** (All fields optional except those being updated)
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | No | Min 3 chars, alphabets only |
| email | string | No | Valid email, unique |
| phone | string | No | 10-15 digits, unique |
| address | string | No | Max 150 chars |
| state | string | No | - |
| city | string | No | - |
| country | string | No | - |
| pincode | string | No | 4-10 digits |
| profile_image | file | No | jpg/png, max 2MB |

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {...}
  }
}
```

---

### 4. Delete User

**Endpoint:** `DELETE /api/users/:id`

**Access:** Admin Only

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]  // Validation errors
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Token Expiration

- **Access Token:** 1 hour
- **Refresh Token:** 7 days

## Security Notes

- Passwords are hashed using bcrypt (salt rounds: 10)
- Passwords are never returned in API responses
- Refresh tokens are stored in database and rotated on each refresh
- All protected routes require valid JWT token
- Admin routes require admin role

