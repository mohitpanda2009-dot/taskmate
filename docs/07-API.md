# 07 — API Design

> Using Supabase (PostgREST + Edge Functions). Most CRUD is handled by Supabase client SDK directly. Edge Functions handle complex business logic.

---

## Direct Supabase Queries (via SDK)

These use `supabase.from('table').select/insert/update/delete` directly from Flutter:

### Auth
- `supabase.auth.signInWithOtp(phone)` — Send OTP
- `supabase.auth.verifyOtp(phone, token)` — Verify OTP
- `supabase.auth.signInWithOAuth('google')` — Google Sign-In
- `supabase.auth.signOut()` — Logout

### Users
- `GET /users?id=eq.{id}` — Get user profile
- `PATCH /users?id=eq.{id}` — Update profile
- `GET /users?id=eq.{id}&select=*,reviews(*)` — Profile + reviews

### Tasks
- `GET /rpc/nearby_tasks` — Get nearby open tasks (PostGIS function)
- `GET /tasks?creator_id=eq.{id}` — My posted tasks
- `GET /tasks?assigned_doer_id=eq.{id}` — My assigned tasks
- `GET /tasks?id=eq.{id}&select=*,creator:users!creator_id(*),applications:task_applications(*)` — Task detail with creator + applications
- `POST /tasks` — Create task
- `PATCH /tasks?id=eq.{id}` — Update task (status, details)

### Task Applications
- `POST /task_applications` — Apply for task
- `GET /task_applications?task_id=eq.{id}&select=*,doer:users(*)` — Get applicants
- `PATCH /task_applications?id=eq.{id}` — Accept/reject

### Chat
- `GET /chats?or=(creator_id.eq.{id},doer_id.eq.{id})&select=*,messages(*)` — My chats
- `GET /messages?chat_id=eq.{id}&order=created_at.asc` — Chat messages
- `POST /messages` — Send message

### Notifications
- `GET /notifications?user_id=eq.{id}&order=created_at.desc` — My notifications
- `PATCH /notifications?id=eq.{id}` — Mark as read
- `PATCH /notifications?user_id=eq.{id}&is_read=eq.false` — Mark all read

### Reviews
- `POST /reviews` — Submit review
- `GET /reviews?reviewee_id=eq.{id}` — User's reviews

### Transactions
- `GET /transactions?user_id=eq.{id}&order=created_at.desc` — Transaction history

---

## Supabase Realtime Subscriptions

```dart
// Chat messages - real-time
supabase.channel('chat:${chatId}')
  .onPostgresChanges(
    event: PostgresChangeEvent.insert,
    schema: 'public',
    table: 'messages',
    filter: PostgresChangeFilter(
      type: PostgresChangeFilterType.eq,
      column: 'chat_id',
      value: chatId,
    ),
    callback: (payload) {
      // New message received
    },
  )
  .subscribe();

// Task status changes
supabase.channel('task:${taskId}')
  .onPostgresChanges(
    event: PostgresChangeEvent.update,
    schema: 'public',
    table: 'tasks',
    filter: PostgresChangeFilter(
      type: PostgresChangeFilterType.eq,
      column: 'id', 
      value: taskId,
    ),
    callback: (payload) {
      // Task status changed
    },
  )
  .subscribe();

// New notifications
supabase.channel('notifications:${userId}')
  .onPostgresChanges(
    event: PostgresChangeEvent.insert,
    schema: 'public',
    table: 'notifications',
    filter: PostgresChangeFilter(
      type: PostgresChangeFilterType.eq,
      column: 'user_id',
      value: userId,
    ),
    callback: (payload) {
      // New notification
    },
  )
  .subscribe();
```

---

## Edge Functions (Complex Business Logic)

### `POST /functions/v1/accept-application`
Handles task assignment (multiple DB operations):
```json
// Request
{
  "application_id": "uuid",
  "task_id": "uuid"
}

// Logic:
// 1. Update application status → 'accepted'
// 2. Reject all other applications
// 3. Update task: status → 'assigned', assigned_doer_id
// 4. Create chat between creator and doer
// 5. Send notification to doer: "You got the task!"
// 6. Send notification to rejected applicants
// 7. Return chat_id

// Response
{
  "success": true,
  "chat_id": "uuid",
  "task": { ... }
}
```

### `POST /functions/v1/complete-task`
Handles task completion flow:
```json
// Request
{
  "task_id": "uuid",
  "completed_by": "creator" | "doer"
}

// Logic (if completed_by = "doer"):
// 1. Update task: status → 'pending_confirmation'
// 2. Notify creator: "Doer says task is done"

// Logic (if completed_by = "creator" — confirmation):
// 1. Update task: status → 'completed', completed_at
// 2. Release escrow payment to doer
// 3. Deduct commission
// 4. Create transaction records
// 5. Notify both: "Task completed!"
// 6. Prompt for rating

// Response
{
  "success": true,
  "task_status": "completed",
  "payment": {
    "doer_received": 270,
    "commission": 30
  }
}
```

### `POST /functions/v1/cancel-task`
```json
// Request
{
  "task_id": "uuid",
  "reason": "string"
}

// Logic:
// 1. Check if cancellation is allowed (based on status)
// 2. Update task: status → 'cancelled'
// 3. Refund escrow to creator (if payment was held)
// 4. Notify doer (if assigned)
// 5. Update cancellation stats
// 6. Re-open task for other applicants (optional)

// Response
{
  "success": true,
  "refund_amount": 300
}
```

### `POST /functions/v1/create-payment`
```json
// Request
{
  "task_id": "uuid",
  "amount": 300,
  "method": "upi" | "card"
}

// Logic:
// 1. Create Razorpay order
// 2. Return order_id for client-side payment
// 3. Webhook handles payment confirmation

// Response
{
  "order_id": "order_xxxx",
  "amount": 30000,  // paise
  "currency": "INR"
}
```

### `POST /functions/v1/webhook/razorpay`
```json
// Razorpay sends payment confirmation
// Logic:
// 1. Verify signature
// 2. Update transaction: status → 'completed'
// 3. Move to escrow
// 4. Activate task
```

### `POST /functions/v1/send-push`
```json
// Internal function (called by other functions)
{
  "user_id": "uuid",
  "title": "Task accepted! 🎉",
  "body": "Aman ne aapka task accept kiya",
  "data": { "task_id": "uuid", "screen": "task_detail" }
}

// Logic:
// 1. Get user's FCM token
// 2. Send via Firebase Admin SDK
// 3. Also create in-app notification
```

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task nahi mila",
    "details": "The task may have been deleted or expired"
  }
}
```

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Login required |
| `FORBIDDEN` | 403 | Not allowed |
| `NOT_FOUND` | 404 | Resource not found |
| `TASK_EXPIRED` | 410 | Task has expired |
| `ALREADY_APPLIED` | 409 | Already applied to this task |
| `TASK_FULL` | 409 | Task already assigned |
| `INSUFFICIENT_BALANCE` | 402 | Wallet balance too low |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Something broke |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Auth (OTP) | 5 requests / 10 min |
| Create task | 10 / hour |
| Send message | 60 / min |
| Apply for task | 20 / hour |
| General API | 100 / min |
