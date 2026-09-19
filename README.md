# 🌐 CodeConnect — Backend REST API

The core backend service powering **CodeConnect**, a developer networking, code-snippet sharing, and collaboration platform. Built with **Node.js**, **Express.js**, and **MongoDB**, featuring secure JWT authentication, snippet management, and community interactions.

---

## 🚀 Key Features

- **🔐 User Authentication**: Secure user registration and login with bcrypt password hashing and JSON Web Tokens (JWT).
- **💻 Code Snippet Management**: Full CRUD operations for developer code snippets with language tags, titles, and syntax metadata.
- **💬 Social Interactions & Comments**: Dynamic comment threads on snippets for peer code reviews and collaboration.
- **🛡️ Secure Middleware**: Route protection guards (`authMiddleware`), request validation, and centralized error handling.
- **🧪 Automated Mock Seeding**: Utility script (`create-fake-data.js`) for rapid database population and local testing.

---

## 🏗️ Architecture & Data Models

| Model | Schema Fields & Purpose |
| :--- | :--- |
| **`User`** | Username, email, hashed password, avatar, bio, created timestamps |
| **`Snippet`** | Title, description, code content, programming language, author ref, tags, upvotes |
| **`Comment`** | Associated snippet ref, user author ref, comment body, timestamps |

---

## 📡 API Endpoint Overview

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new developer account
- `POST /api/auth/login` — Authenticate and receive a signed JWT token
- `GET /api/auth/me` — Fetch current authenticated user profile

### 💻 Code Snippets (`/api/snippets`)
- `GET /api/snippets` — Retrieve all public code snippets (with pagination/filters)
- `GET /api/snippets/:id` — Get detailed snippet with comments
- `POST /api/snippets` — Create a new code snippet (Protected)
- `PUT /api/snippets/:id` — Update an existing snippet (Author only)
- `DELETE /api/snippets/:id` — Delete a snippet (Author only)
- `POST /api/snippets/:id/comments` — Add a comment to a snippet

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) / [Mongoose ODM](https://mongoosejs.com/)
- **Security & Utilities**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`

---

## 📦 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/revanthbaspally6-cell/code-connect-backend.git
cd code-connect-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. (Optional) Seed Sample Data
```bash
node create-fake-data.js
```

### 5. Launch the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 👨‍💻 Author
- **Revanth Baspally** — [GitHub Profile](https://github.com/revanthbaspally6-cell)
