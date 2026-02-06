# Taskmate Backend API

Production-quality REST API + real-time WebSocket server for the Taskmate micro-task marketplace.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | PostgreSQL + Sequelize ORM |
| Auth | Firebase Admin SDK (Phone OTP) + JWT |
| Real-time | Socket.io 4 |
| Validation | express-validator |
| Security | helmet, cors, express-rate-limit |

## Project Structure

```
backend/
├── app.js                 # Express app setup, middleware, routes
├── server.js              # HTTP server + Socket.io boot
├── config/
│   ├── database.js        # Sequelize config (dev/test/prod)
│   ├── firebase.js        # Firebase Admin SDK init
│   └── socket.js          # Socket.io handlers
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── taskController.js
│   ├── chatController.js
│   ├── notificationController.js
│   ├── reviewController.js
│   └── walletController.js
├── middleware/
│   ├── auth.js            # JWT authenticate / optionalAuth
│   ├── errorHandler.js    # Global error handler
│   └── validate.js        # express-validator wrapper
├── models/
│   ├── index.js           # Sequelize init + associations
│   ├── User.js
│   ├── Task.js
│   ├── TaskApplication.js
│   ├── Chat.js
│   ├── Message.js
│   ├── Review.js
│   ├── Transaction.js
│   └── Notification.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── tasks.js
│   ├── chats.js
│   ├── notifications.js
│   ├── reviews.js
│   └── wallet.js
├── utils/
│   ├── ApiError.js        # Custom error class
│   ├── apiResponse.js     # Standardized JSON responses
│   ├── helpers.js         # Haversine, pagination, etc.
│   └── notifications.js   # Create + emit notifications
├── .env.example
├── .gitignore
├── .sequelizerc
└── package.json
```

## Setup

### 1. Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14
- (Optional) Firebase project for phone OTP auth

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

Key variables:
| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host (default: localhost) |
| `DB_PORT` | PostgreSQL port (default: 5432) |
| `DB_NAME` | Database name (default: taskmate) |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `FIREBASE_PROJECT_ID` | Firebase project ID (optional for dev) |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase private key |

### 4. Create the database

```bash
createdb taskmate
# or
npx sequelize-cli db:create
```

### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server auto-syncs database tables in development mode. For production, use Sequelize migrations.

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/send-otp` | Initiate OTP flow |
| POST | `/verify-otp` | Verify OTP + get JWT |
| POST | `/refresh-token` | Refresh access token |

### Users (`/api/users`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/me` | Current user profile |
| PUT | `/me` | Update profile |
| POST | `/onboarding` | Complete onboarding |
| GET | `/:id` | Public user profile |

### Tasks (`/api/tasks`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create task |
| GET | `/` | List tasks (filters: category, status, nearby, budget, search) |
| GET | `/my` | My created tasks |
| GET | `/:id` | Task details |
| PUT | `/:id` | Update task |
| DELETE | `/:id` | Cancel task (refunds escrow) |
| POST | `/:id/apply` | Apply for task (doer) |
| GET | `/:id/applications` | List applications (creator) |
| PUT | `/:id/applications/:appId` | Accept/reject application |
| POST | `/:id/complete` | Mark complete (doer) |
| POST | `/:id/confirm` | Confirm + release payment (creator) |

### Chats (`/api/chats`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List my chats |
| GET | `/:id/messages` | Get messages (paginated) |
| POST | `/:id/messages` | Send message |

### Notifications (`/api/notifications`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List notifications (paginated) |
| PUT | `/:id/read` | Mark as read |
| PUT | `/read-all` | Mark all as read |

### Reviews (`/api/reviews`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create review |
| GET | `/user/:id` | Get user's reviews |

### Wallet (`/api/wallet`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/balance` | Wallet balance |
| GET | `/transactions` | Transaction history |
| POST | `/add-funds` | Add funds (payment gateway placeholder) |

## Real-time Events (Socket.io)

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `chat:join` | `{ chatId }` | Join a chat room |
| `chat:leave` | `{ chatId }` | Leave a chat room |
| `chat:typing` | `{ chatId }` | Broadcast typing indicator |
| `chat:stopTyping` | `{ chatId }` | Stop typing indicator |
| `message:read` | `{ chatId, messageId }` | Read receipt |
| `task:watch` | `{ taskId }` | Watch task updates |
| `task:unwatch` | `{ taskId }` | Stop watching |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `message:new` | `{ message }` | New message in chat |
| `chat:newMessage` | `{ chatId, message }` | New message notification |
| `chat:typing` | `{ chatId, userId, userName }` | User is typing |
| `chat:stopTyping` | `{ chatId, userId }` | User stopped typing |
| `message:read` | `{ chatId, messageId, readBy }` | Message read |
| `notification` | `{ id, type, title, body, ... }` | Push notification |
| `user:online` | `{ userId }` | User came online |
| `user:offline` | `{ userId }` | User went offline |
| `task:new` | `{ task }` | New task posted |
| `task:updated` | `{ taskId, status }` | Task status changed |
| `task:cancelled` | `{ taskId }` | Task cancelled |
| `task:confirmed` | `{ taskId }` | Task confirmed |

### Socket.io Authentication

Connect with JWT token:
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'your-jwt-access-token' }
});
```

## Development Mode

Without Firebase credentials, the auth endpoints run in **mock mode** — OTP verification is skipped and any phone number is accepted. This makes local development easy.

## Task Lifecycle

```
Creator adds funds to wallet
  → Creator posts task (budget held in escrow)
    → Doers apply
      → Creator accepts one application
        → Chat opens between creator & doer
          → Doer marks task complete
            → Creator confirms completion
              → Payment released to doer's wallet
```

## Response Format

All endpoints return consistent JSON:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

Paginated responses:
```json
{
  "success": true,
  "message": "Success",
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title must be 3-200 characters" }
  ]
}
```
