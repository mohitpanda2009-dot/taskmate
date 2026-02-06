# Taskmate — App Plan

## Concept
A micro-task marketplace connecting two types of users:
- **Task Creator** — needs small tasks done (form filling, delivery, standing in line, etc.)
- **Task Doer** — earns money by completing those tasks

Taskmate is the bridge between them.

---

## User Flow

### Auth Flow
1. Splash Screen → Login / Sign Up (Phone OTP or Google)
2. First-time → Onboarding (choose role, set profile, location)
3. Returning → Straight to Home

### Role System
- Users can be **both** creator and doer (toggle role)
- Or pick one during onboarding

---

## App Tabs (5 Bottom Tabs)

### 1. 🏠 Home
**For Task Doers:**
- Nearby available tasks (map + list view)
- Filter by: category, distance, pay range
- Task cards: title, pay (₹), distance, time, category tag
- Pull to refresh

**For Task Creators:**
- My posted tasks + status (open, in-progress, completed)
- Quick "Create Task" button

### 2. ➕ Create Task
- Task title & description
- Category picker (delivery, form filling, standing in line, pickup, etc.)
- Location (pickup/destination if delivery)
- Budget (₹) — fixed or bidding
- Deadline / time window
- Photos (optional)
- Post Task button

### 3. 💬 Chat
- List of active conversations
- Real-time messaging between creator ↔ doer
- Per-task chat threads
- Share location, photos
- Task status updates in chat

### 4. 🔔 Notifications
- New task matches (for doers)
- Task accepted/completed alerts (for creators)
- Payment received/sent
- Chat messages
- Ratings & reviews
- System announcements

### 5. 👤 Profile
- Name, photo, phone
- Rating & reviews
- Wallet / earnings
- Task history (created + completed)
- KYC/verification status
- Settings (language, notifications, etc.)
- Logout

---

## Onboarding (One-time flow, not a tab)
- Welcome screens (swipe)
- Select role: Task Creator / Task Doer / Both
- Location permission
- Profile setup (name, photo)
- Aadhaar/ID verification (optional for trust)

---

## Key Features

### Task Lifecycle
```
Creator posts task → Doers see it → Doer accepts →
Chat opens → Doer completes → Creator confirms →
Payment released → Both rate each other
```

### Payments
- In-app wallet (UPI integration)
- Creator loads wallet → posts task with budget
- Payment held in escrow → released on completion
- Doer can withdraw to bank/UPI

### Trust & Safety
- Ratings & reviews (both sides)
- ID verification
- Report/block system
- Task dispute resolution

### Location
- Geolocation-based task matching
- Live tracking for delivery tasks
- Map view for nearby tasks

---

## Tech Stack (Suggested)

| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | React Native (iOS + Android)|
| Backend     | Node.js + Express           |
| Database    | PostgreSQL + Redis          |
| Real-time   | Socket.io (chat + updates)  |
| Auth        | Firebase Auth (Phone OTP)   |
| Maps        | Google Maps API             |
| Payments    | Razorpay / Cashfree         |
| Storage     | AWS S3 / Cloudinary         |
| Push Notifs | Firebase Cloud Messaging    |
| Hosting     | AWS / Railway / Render      |

---

## Database — Core Tables

- **users** — id, name, phone, email, role, avatar, rating, wallet_balance, location, verified, created_at
- **tasks** — id, creator_id, title, description, category, budget, status (open/assigned/in_progress/completed/cancelled), location, deadline, created_at
- **task_applications** — id, task_id, doer_id, message, status (pending/accepted/rejected), created_at
- **chats** — id, task_id, creator_id, doer_id, created_at
- **messages** — id, chat_id, sender_id, text, media_url, read, created_at
- **reviews** — id, task_id, reviewer_id, reviewee_id, rating, comment, created_at
- **transactions** — id, user_id, task_id, type (credit/debit), amount, status, created_at
- **notifications** — id, user_id, type, title, body, read, data_json, created_at

---

## Categories (Initial)
- 📝 Form Filling / Submission
- 📦 Delivery / Pickup
- 🧍 Standing in Line / Queue
- 🛒 Shopping / Errands
- 📄 Document Work
- 🔧 Small Repairs
- 🚗 Driving / Drop-off
- 📸 Photo/Video Task
- 🎯 Other

---

## MVP Scope (Phase 1)
1. Auth (phone OTP)
2. Onboarding flow
3. Home feed (list tasks)
4. Create task
5. Accept task
6. Basic chat
7. Task completion flow
8. Basic profile
9. Notifications (in-app)

## Phase 2
- Payments integration
- Map view + live tracking
- Push notifications
- Ratings & reviews
- Wallet system

## Phase 3
- ID verification
- Dispute resolution
- Admin dashboard
- Analytics
