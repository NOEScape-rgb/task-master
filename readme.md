# 📝 Todo App Backend

A full-featured REST API backend for a Todo application built with Node.js, Express, and EJS for server-side rendering. Features user authentication, admin panel, and complete CRUD operations.

## ✨ Features

- 🔐 **User Authentication** - JWT-based login/signup system
- 👑 **Admin Panel** - Admin user management and oversight
- 📋 **Todo Management** - Complete CRUD operations for todos
- 🔒 **Role-based Access Control** - User and admin permissions
- 🎨 **Server-side Rendering** - EJS templates for web interface
- 📁 **File-based Storage** - JSON file database system
- 🛡️ **Security** - Password hashing with bcrypt

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with:
   PORT=....
   SECRET_KEY="....."
   EXPIRES_IN="...."
   SECRET_ADMIN_KEY="....."
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/
```

### 🔑 Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 👤 User Endpoints

### Register User
```http
POST /api/users/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "securePassword123"
}
```

### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}
```

### Update User Profile
```http
PATCH /api/users/:username
Authorization: Bearer <token>
Content-Type: application/json

{
  "newUsername": "john_updated",
  "email": "john.new@example.com"
}
```

### Reset Password
```http
PATCH /api/users/:username/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "newSecurePassword123"
}
```

---

## 👑 Admin Endpoints

### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin_user",
  "password": "adminPassword123"
}
```

### Create Admin (Admin Only)
```http
POST /api/admin
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "new_admin",
  "email": "admin@example.com",
  "password": "adminPassword123"
}
```

### Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

### Get All Admins (Admin Only)
```http
GET /api/admin
Authorization: Bearer <admin-token>
```

### Delete User (Admin Only)
```http
DELETE /api/admin/user/:username
Authorization: Bearer <admin-token>
```

### Delete Admin (Admin Only)
```http
DELETE /api/admin/admin/:username
Authorization: Bearer <admin-token>
```

---

## 📋 Todo Endpoints

### Create Todo
```http
POST /api/users/:username/todo
Authorization: Bearer <token>
Content-Type: application/json

{
  "todoName": "Complete project",
  "todoDescription": "Finish the todo app backend",
  "dueDate": "2024-12-31"
}
```

### Get All Todos
```http
GET /api/users/:username/todo
Authorization: Bearer <token>
```

### Get Single Todo
```http
GET /api/users/:username/todo/:id
Authorization: Bearer <token>
```

### Update Todo
```http
PATCH /api/users/:username/todo/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "todoName": "Updated task name",
  "todoDescription": "Updated description",
  "dueDate": "2024-12-25"
}
```

### Update Todo Status
```http
PATCH /api/users/:username/todo/:id/status
Authorization: Bearer <token>
```

### Delete Todo
```http
DELETE /api/users/:username/todo/:id
Authorization: Bearer <token>
```

### Delete All Todos
```http
DELETE /api/users/:username/todo
Authorization: Bearer <token>
```

---

## 🏗️ Project Structure

```
todo-app-backend/
├── 📁 controllers/          # Request handlers
│   ├── adminControllers.js
│   ├── appControllers.js
│   ├── todoControllers.js
│   └── userControllers.js
├── 📁 data/                 # JSON database files
│   ├── adminData.json
│   ├── mainData.json
│   └── usersData.json
├── 📁 middlewares/          # Custom middleware
│   └── authMiddleware.js
├── 📁 public/               # Static assets
├── 📁 routes/               # API routes
│   ├── adminRoutes.js
│   ├── appRoutes.js
│   ├── index.js
│   ├── todoRoutes.js
│   └── userRoutes.js
├── 📁 services/             # Business logic
│   ├── adminServices.js
│   ├── todoServices.js
│   └── userServices.js
├── 📁 utils/                # Utility functions
│   └── jwt.js
├── 📁 views/                # EJS templates
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── readme.md
└── server.js               # Entry point
```

## 🔧 Technologies Used

- **Backend Framework:** Express.js
- **Template Engine:** EJS
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Database:** File-based JSON storage
- **Environment Management:** dotenv

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Protected routes with middleware
- Input validation and sanitization

## 📝 Response Format

All API responses follow this structure:

```json
{
  "isStatus": true,
  "msg": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "isStatus": false,
  "msg": "Error message",
  "data": null
}
```

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `500` - Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Muhammad Junaid**
https://muhammadjunaid.dev

---

⭐ **Star this repo if you found it helpful!**
