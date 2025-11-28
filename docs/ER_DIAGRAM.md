# Entity Relationship Diagram

## Database Schema

### User Entity

```
┌─────────────────────────────────────────┐
│              USER                       │
├─────────────────────────────────────────┤
│ _id: ObjectId (PK)                     │
│ name: String (required, min 3)         │
│ email: String (required, unique)       │
│ phone: String (required, unique)        │
│ password: String (hashed, required)    │
│ profile_image: String (optional)        │
│ address: String (optional, max 150)     │
│ state: String (required)                │
│ city: String (required)                 │
│ country: String (required)               │
│ pincode: String (required, 4-10 digits) │
│ role: String (enum: user/admin)         │
│ refreshToken: String (optional)          │
│ createdAt: Date                         │
│ updatedAt: Date                         │
└─────────────────────────────────────────┘
```

## Relationships

Currently, the system has a single entity (User). Future relationships could include:

- User → Posts (One-to-Many)
- User → Comments (One-to-Many)
- User → Roles (Many-to-Many) - if implementing more granular RBAC

## Indexes

```
User Collection Indexes:
- email: Unique Index
- phone: Unique Index
- state: Regular Index (for filtering)
- city: Regular Index (for filtering)
- createdAt: Regular Index (for sorting)
```

## Data Flow Diagram

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ HTTP Request
     │ (with JWT Token)
     │
┌────▼─────────────┐
│  Express Server  │
│  (Middleware)    │
└────┬─────────────┘
     │
     ├───► Auth Middleware (JWT Validation)
     │
     ├───► Role Check (Admin/User)
     │
     ├───► Validation Middleware
     │
     └───► Route Handler
            │
            │ Query/Update
            │
     ┌──────▼──────┐
     │   MongoDB   │
     │  Database   │
     └─────────────┘
```

## Authentication Flow Diagram

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Register/Login
     │
┌────▼─────────────┐
│  Auth Controller  │
└────┬─────────────┘
     │
     ├───► Validate Input
     │
     ├───► Check Credentials
     │
     ├───► Generate Tokens
     │     ├── Access Token (1h)
     │     └── Refresh Token (7d)
     │
     └───► Store Refresh Token in DB
            │
     ┌──────▼──────┐
     │   MongoDB   │
     └─────────────┘
```

## CRUD Operations Flow

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ Request (with JWT)
     │
┌────▼─────────────┐
│  Users Controller│
└────┬─────────────┘
     │
     ├───► Verify Token
     │
     ├───► Check Admin Role
     │
     ├───► Validate Input
     │
     ├───► Apply Filters/Pagination
     │
     └───► Query MongoDB
            │
     ┌──────▼──────┐
     │   MongoDB   │
     └─────────────┘
```

## File Upload Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ Multipart Form Data
     │
┌────▼─────────────┐
│  Multer          │
│  Middleware      │
└────┬─────────────┘
     │
     ├───► Validate File Type
     │
     ├───► Validate File Size
     │
     ├───► Generate Unique Filename
     │
     └───► Save to uploads/
            │
     ┌──────▼──────┐
     │ File System │
     └─────────────┘
            │
            └───► Store Path in MongoDB
```

## System Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              CLIENT LAYER                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Login   │  │ Register │  │ Dashboard│     │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
                    │
                    │ HTTP/REST API
                    │
┌─────────────────────────────────────────────────┐
│            API LAYER (Express)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   Auth   │  │  Users   │  │  Upload  │     │
│  │  Routes  │  │  Routes   │  │ Middleware│    │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   JWT    │  │  Role    │  │ Validate│     │
│  │ Middleware│ │  Check   │  │ Middleware│    │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
                    │
                    │ Mongoose ODM
                    │
┌─────────────────────────────────────────────────┐
│            DATA LAYER (MongoDB)                 │
│  ┌──────────┐                                  │
│  │  Users   │                                  │
│  │ Collection│                                 │
│  └──────────┘                                  │
└─────────────────────────────────────────────────┘
```

## Security Layers

```
Request
  │
  ├──► CORS Check
  │
  ├──► Helmet Security Headers
  │
  ├──► Rate Limiting (optional)
  │
  ├──► JWT Token Validation
  │
  ├──► Role-Based Authorization
  │
  ├──► Input Validation
  │
  └──► Business Logic
```

