# 📝 Todo App Backend

A full-featured REST API backend for a Todo application built with Node.js, Express, and EJS for server-side rendering. Features user authentication, admin panel, and complete CRUD operations.

# API Routes

## 👤 User Authentication & Profile
**Base Route:** `/api/users`  

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/signup` | Register a new user account | NO |
| POST   | `/login` | Log in and receive an access token | NO |
| POST   | `/logout` | Log out the current user | NO
| POST   | `/forgot-password` | Send a password reset link via email | NO
| PATCH  | `/:username` | Update user profile information | YES |
| PATCH  | `/:username/password` | Reset or change user password | YES |

---

## 📝 Todo Management
**Base Route:** `/api/users/:username/todo`  
_All Todo routes require the user to be logged in._

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/` | Retrieve all todos for the user | YES|
| POST   | `/` | Create a new todo item | YES|
| DELETE | `/` | Delete all todo items | YES |
| GET    | `/:id` | Retrieve a specific todo by ID | YES |
| PATCH  | `/:id` | Update a todo's content | YES |
| PATCH  | `/:id/status` | Update a todo's completion status | YES |
| DELETE | `/:id` | Delete a specific todo item | YES | 

---

## 🌐 App Routes
**Base Route:** `/`  

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| ALL    | `/` | General application routes | NO|


## ✨ Features

- 🔐 **User Authentication** - JWT-based login/signup system
- 👑 **Admin Panel** - Admin user management and oversight
- 📋 **Todo Management** - Complete CRUD operations for todos

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



## 🔧 Technologies Used

- **Backend Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Database:** File-based JSON storage
- **Environment Management:** dotenv

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
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
