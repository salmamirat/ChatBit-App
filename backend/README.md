# ChatBit — Backend API

Node.js + Express REST API + Socket.IO for the ChatBit mobile app.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: PostgreSQL (`pg`)
- **Auth**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Docs**: Scalar API Reference

## Project Structure

```
backend/
├── src/
│   ├── app.js                  # Entry point
│   ├── config/
│   │   ├── db.js               # PostgreSQL pool
│   │   └── socket.js           # Socket.IO setup
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── conversations.controller.js
│   │   └── messages.controller.js
│   ├── middlewares/
│   │   ├── auth.js             # JWT middleware
│   │   └── socketAuth.js       # Socket auth middleware
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── conversations.routes.js
│   │   └── messages.routes.js
│   └── socket/
│       └── handlers.js         # Socket.IO event handlers
├── schema.sql                  # Database schema
├── .env.example                # Environment variables template
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Setup environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup database

```bash
# Create the database
createdb chatbit_db

# Run the schema
psql -U your_user -d chatbit_db -f schema.sql
```

### 4. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000` by default.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/users` | Search users | ✅ |
| GET | `/api/users/:id` | Get user profile | ✅ |
| GET | `/api/conversations` | Get my conversations | ✅ |
| POST | `/api/conversations` | Create conversation | ✅ |
| GET | `/api/conversations/:id/messages` | Get messages | ✅ |
| POST | `/api/conversations/:id/messages` | Send message | ✅ |

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_conversation` | Client → Server | Join a conversation room |
| `send_message` | Client → Server | Send a message |
| `new_message` | Server → Client | Receive a new message |
| `typing` | Client → Server | Typing indicator |
| `user_typing` | Server → Client | Someone is typing |
