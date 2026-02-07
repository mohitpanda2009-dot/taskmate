# 03 — Features (MVP → Phase 2 → Phase 3)

---

## 🚀 MVP (Phase 1) — Launch Ready

### Authentication
- [ ] Phone number + OTP login (Supabase Auth / Firebase)
- [ ] Google Sign-In as secondary option
- [ ] Auto-detect phone number from device
- [ ] Profile creation: name, photo, city, role selection

### Onboarding (First-time only)
- [ ] 3 swipe screens explaining TaskMate
- [ ] Role selection: "I need tasks done" / "I want to earn" / "Both"
- [ ] Location permission request with explanation
- [ ] Basic profile setup (name, photo)
- [ ] Skip option for photo (can add later)

### Home Screen (Task Feed)
**For Task Doers:**
- [ ] List of available tasks nearby (sorted by distance + recency)
- [ ] Task card: title, ₹ amount, distance, category tag, time posted
- [ ] Category filter chips (horizontal scroll)
- [ ] Pull to refresh
- [ ] Empty state with helpful message

**For Task Creators:**
- [ ] My posted tasks with status (Open / Assigned / In Progress / Done)
- [ ] Floating "+" button to create task
- [ ] Quick stats: tasks posted, active tasks

### Create Task
- [ ] Task title (with suggestions: "Pick up from...", "Stand in line at...")
- [ ] Description (text area, optional but recommended)
- [ ] Category picker (predefined categories with icons)
- [ ] Location: auto-detect current OR pick on map OR type address
- [ ] Budget: ₹ amount input (show suggested range per category)
- [ ] Deadline: "Today", "Tomorrow", "This Week", or custom date/time
- [ ] Optional: Add photos (up to 3)
- [ ] Preview → Post button

### Task Detail Screen
- [ ] Full task info: description, location, budget, deadline, creator info
- [ ] Creator's profile card (name, rating, photo, tasks posted)
- [ ] "Accept Task" button (for doers)
- [ ] "Edit" / "Cancel" (for creator, if task is still open)
- [ ] Show number of applicants
- [ ] Location on mini map

### Task Application Flow
- [ ] Doer taps "Accept" or "Apply"
- [ ] Optional: Doer can send a message ("Main nearby hu, 10 min mein aa sakta hu")
- [ ] Creator sees list of applicants with ratings
- [ ] Creator accepts one → Task moves to "Assigned"
- [ ] Rejected applicants get notification

### Chat (Basic)
- [ ] Chat list: active conversations (per task)
- [ ] 1-on-1 chat: creator ↔ doer
- [ ] Text messages
- [ ] Send photos
- [ ] Share current location
- [ ] Task status updates shown in chat ("Task accepted", "Task completed")
- [ ] Real-time with Supabase Realtime

### Task Lifecycle
- [ ] States: Open → Assigned → In Progress → Completed → Rated
- [ ] Doer marks "Started" → Creator gets notification
- [ ] Doer marks "Completed" → Creator confirms (or disputes)
- [ ] Both rate each other after completion
- [ ] Cancel flow: Creator can cancel (before assignment), Doer can drop (with reason)

### Profile
- [ ] View/edit name, photo, bio, city
- [ ] Rating (⭐ average) + number of tasks
- [ ] Switch role toggle (Creator ↔ Doer)
- [ ] Task history: completed + cancelled
- [ ] Settings: language, notifications on/off
- [ ] Logout

### Notifications (In-App)
- [ ] Notification list screen
- [ ] Types: new applicant, task accepted, task completed, new message, task cancelled
- [ ] Unread badge on tab icon
- [ ] Tap to navigate to relevant screen

### Categories (Initial Set)
- 📦 Delivery & Pickup
- 📝 Form Filling & Submission
- 🧍 Standing in Line / Queue
- 🛒 Shopping & Errands
- 📄 Document Work
- 🔧 Small Repairs & Fixes
- 🚗 Driving / Drop-off
- 📸 Photo & Video
- 💻 Data Entry / Typing
- 🎯 Other

---

## 📈 Phase 2 — Growth Features

### Payments & Wallet
- [ ] In-app wallet (Razorpay/Cashfree integration)
- [ ] Creator: Add money via UPI/card
- [ ] Escrow: Budget held when task posted → released on completion
- [ ] Doer: Withdraw to bank/UPI (instant via UPI)
- [ ] Transaction history with filters
- [ ] Referral bonus credits

### Map & Location
- [ ] Map view for nearby tasks (Google Maps)
- [ ] Real-time location sharing during active tasks
- [ ] Live tracking for delivery tasks
- [ ] Geofence: Task completion verification (was doer at location?)
- [ ] Multi-location tasks (pickup from A, deliver to B)

### Push Notifications
- [ ] Firebase Cloud Messaging setup
- [ ] Smart notifications: new tasks nearby, task updates, chat messages
- [ ] Notification preferences (granular control)
- [ ] Quiet hours setting

### Ratings & Reviews
- [ ] 1-5 star rating + text review
- [ ] Both sides rate (creator rates doer, doer rates creator)
- [ ] Review badges: "Quick Completer", "Friendly", "Punctual"
- [ ] Public review history on profile
- [ ] Min rating threshold for premium tasks

### Enhanced Chat
- [ ] Voice messages
- [ ] Quick reply templates ("On my way", "Reached", "Done")
- [ ] Read receipts
- [ ] Phone call button (direct call, number hidden via proxy)
- [ ] Auto-translate messages (Hindi ↔ English)

### Search & Discovery
- [ ] Search tasks by keyword
- [ ] Saved/bookmarked tasks
- [ ] Task alerts: "Notify me when X category task appears"
- [ ] Recommended tasks (based on history + location)

### Bidding System
- [ ] Creator can enable bidding (instead of fixed price)
- [ ] Doers submit their price
- [ ] Creator picks best bid
- [ ] Show average bid amount

---

## 🏆 Phase 3 — Scale Features

### Verification & Trust
- [ ] Aadhaar-based KYC (DigiLocker API)
- [ ] Selfie verification (liveness check)
- [ ] "Verified" badge on profile
- [ ] Background check integration (for premium tasks)
- [ ] Trust score algorithm (combines rating, verification, history)

### Business Accounts
- [ ] Business profiles for shops/companies
- [ ] Bulk task posting
- [ ] Monthly invoicing
- [ ] Dedicated doer pool (favorite/regular doers)
- [ ] Business dashboard with analytics

### Dispute Resolution
- [ ] In-app dispute system
- [ ] Evidence submission (photos, chat logs)
- [ ] Mediation by TaskMate support
- [ ] Auto-resolution rules (time-based)
- [ ] Partial refund capability

### Advanced Features
- [ ] Task templates (repost same task easily)
- [ ] Recurring tasks ("Every Monday, pick up groceries")
- [ ] Multi-doer tasks ("Need 3 people for event setup")
- [ ] Urgent task premium (2x commission for instant match)
- [ ] Task insurance (for high-value items)

### Admin & Analytics
- [ ] Admin dashboard (web)
- [ ] User management, task moderation
- [ ] Revenue analytics, city-wise metrics
- [ ] Support ticket system
- [ ] Content moderation (auto-flag suspicious tasks)

### Social & Growth
- [ ] Referral program (₹50 for inviter + invitee)
- [ ] Share tasks on WhatsApp/Instagram
- [ ] Leaderboard: Top doers in city
- [ ] Community: Tips, success stories
- [ ] Doer levels: Bronze → Silver → Gold → Platinum (unlock perks)
