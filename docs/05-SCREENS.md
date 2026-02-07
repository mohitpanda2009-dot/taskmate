# 05 — Screen Specifications

---

## Navigation Structure

```
App
├── Auth Stack (unauthenticated)
│   ├── SplashScreen
│   ├── WelcomeScreen (onboarding slides)
│   ├── LoginScreen (phone input)
│   ├── OTPScreen (verify OTP)
│   └── ProfileSetupScreen (name, photo, role, city)
│
└── Main Shell (authenticated) — Bottom Navigation
    ├── Tab 1: Home
    │   ├── HomeScreen (task feed / my tasks)
    │   ├── TaskDetailScreen
    │   ├── ApplicantsScreen (creator sees applicants)
    │   └── SearchScreen (search tasks)
    │
    ├── Tab 2: Create Task
    │   └── CreateTaskScreen (form)
    │
    ├── Tab 3: Chat
    │   ├── ChatListScreen
    │   └── ChatRoomScreen
    │
    ├── Tab 4: Notifications
    │   └── NotificationsScreen
    │
    └── Tab 5: Profile
        ├── ProfileScreen
        ├── EditProfileScreen
        ├── WalletScreen
        ├── TaskHistoryScreen
        ├── SettingsScreen
        └── PublicProfileScreen (view other user's profile)
```

**Total Screens: 18**

---

## Screen 1: SplashScreen
- **Purpose:** Brand loading screen
- **Elements:** TaskMate logo (centered), tagline, loading indicator
- **Duration:** 1.5s, then auto-navigate
- **Logic:** Check auth state → route to appropriate screen

## Screen 2: WelcomeScreen (Onboarding)
- **Purpose:** First-time users learn about TaskMate
- **Elements:**
  - 3 horizontal swipe pages:
    1. Illustration + "Koi bhi chhota kaam, turant karwao" + subtext
    2. Illustration + "Apne time pe kamao, apni marzi se" + subtext
    3. Illustration + "Verified log, safe payments" + subtext
  - Page indicator dots
  - "Skip" (top right)
  - "Get Started" button (last page)
- **Notes:** Illustrations should feel Indian — auto rickshaws, chai stalls, office queues

## Screen 3: LoginScreen
- **Purpose:** Phone number entry
- **Elements:**
  - "Welcome to TaskMate" heading
  - Phone input: +91 prefix fixed, 10-digit number
  - "Send OTP" button (disabled until valid number)
  - Divider: "or"
  - "Continue with Google" button
  - Terms text: "By continuing, you agree to Terms & Privacy Policy"
- **Validation:** 10 digits, Indian number format

## Screen 4: OTPScreen
- **Purpose:** Verify phone via OTP
- **Elements:**
  - "Enter OTP" heading
  - Subtext: "Sent to +91 98XXX XXXXX" (with edit icon)
  - 6-digit OTP input (auto-focus, auto-submit on 6th digit)
  - Auto-read OTP from SMS (Android)
  - "Resend OTP" timer (30s countdown, then clickable)
  - Loading state on verify

## Screen 5: ProfileSetupScreen
- **Purpose:** One-time profile creation
- **Elements:**
  - Avatar: Tap to add photo (camera/gallery), skip option
  - Name input (required)
  - City: Auto-detect via GPS or dropdown of supported cities
  - Role selector: 3 options with illustrations
    - "Kaam karwana hai" (Creator) 
    - "Kaam karke kamana hai" (Doer)
    - "Dono" (Both) ← default selected
  - Location permission CTA with explanation
  - "Let's Go!" button

## Screen 6: HomeScreen
**Two views based on active role (toggle at top)**

### Doer View:
- **Top Bar:** "TaskMate" logo, role toggle, notification bell (badge)
- **Location Bar:** "📍 Lajpat Nagar, Delhi" (tap to change)
- **Category Chips:** Horizontal scroll — All, Delivery, Queue, Errands, Forms, etc.
- **Task Feed:** Vertical list of TaskCards
  - Each card: Title, ₹ amount (bold green), distance, category tag, time ago, creator avatar
  - Tap → TaskDetailScreen
- **Empty State:** "Koi task nahi mila nearby. Area badhayen?"
- **Pull to Refresh**

### Creator View:
- **Top Bar:** Same
- **Quick Stats:** "3 Active Tasks | 12 Completed"
- **My Tasks List:** Cards with status badges (Open, Assigned, In Progress, Done)
  - Tap → TaskDetailScreen
- **FAB:** "+" button (Create Task) — always visible

## Screen 7: TaskDetailScreen
- **Hero Section:** Category icon + Task title + Status badge
- **Info Cards:**
  - 💰 Budget: ₹300
  - 📍 Location: "Passport Seva Kendra" (tap to open maps)
  - ⏰ Deadline: "Today, 2:00 PM"
  - 📂 Category: "Standing in Line"
- **Description:** Full text
- **Photos:** Horizontal scroll if any
- **Creator Card:** Avatar, name, ⭐ rating, tasks count
- **Action Buttons (context-dependent):**
  - Doer: "Apply for Task" (if open) / "Chat with Creator" (if assigned to me)
  - Creator: "View Applicants" (if open) / "Chat with Doer" / "Cancel Task" / "Confirm Complete"
- **Applicant Count:** "4 people applied"

## Screen 8: ApplicantsScreen (Creator Only)
- **Purpose:** See and select from applicants
- **Elements:**
  - List of applicant cards:
    - Avatar, name, ⭐ rating, tasks completed
    - Their message (if any)
    - "Accept" / "Reject" buttons
  - Tap on applicant → PublicProfileScreen

## Screen 9: CreateTaskScreen
- **Purpose:** Post a new task
- **Form Fields:**
  1. Title (text input, placeholder: "Kya kaam hai?")
  2. Category (horizontal chips or dropdown with icons)
  3. Description (multiline, placeholder: "Detail mein batao...")
  4. Location (3 options):
     - "Current Location" (auto-detect)
     - "Pick on Map" (opens map picker)
     - "Type Address" (text + Google Places autocomplete)
  5. Budget (₹ input, show suggested range based on category)
  6. Deadline picker: "Today" / "Tomorrow" / "This Week" / Custom
  7. Photos (optional, up to 3, camera/gallery)
- **Bottom:** "Preview Task" → Preview modal → "Post Task"
- **Validation:** Title + Category + Location + Budget required

## Screen 10: ChatListScreen
- **Purpose:** All active conversations
- **Elements:**
  - Search bar (search by task/name)
  - Chat list items:
    - Avatar, Name, Task title (small), Last message preview, Time, Unread count badge
  - Sort: Most recent first
  - Empty State: "Koi chat nahi hai. Task accept karo ya post karo!"

## Screen 11: ChatRoomScreen
- **Purpose:** 1-on-1 messaging
- **Top Bar:** User name, task title (tap for task detail), call button
- **Chat Area:**
  - Message bubbles (sent = right/blue, received = left/gray)
  - System messages (centered, light): "Task assigned", "Task completed"
  - Photo messages (tap to fullscreen)
  - Location messages (mini map preview, tap to open)
- **Input Bar:**
  - Text input (multiline expand)
  - Attach button (photo, location)
  - Send button
- **Quick Replies:** Expandable tray — "On my way", "Pahunch gaya", "Ho gaya"
- **Task Actions:** Sticky bar at top — "Start Task" / "Mark Complete" (context-based)

## Screen 12: NotificationsScreen
- **Purpose:** All notifications
- **Elements:**
  - Notification items:
    - Icon (by type), Title, Description, Time
    - Unread: highlighted background
    - Tap: Navigate to relevant screen
  - Types: task_applied, task_accepted, task_completed, message, payment, system
  - "Mark all as read" option
  - Empty State: "All caught up! 🎉"

## Screen 13: ProfileScreen
- **Purpose:** User's own profile
- **Elements:**
  - Avatar (large), Name, City
  - ⭐ Rating (avg) + "X reviews"
  - Stats: "Y tasks completed" | "Z tasks posted"
  - Role: Current active role
  - Verified badge (if verified)
  - Menu Items:
    - 📝 Edit Profile
    - 💰 Wallet
    - 📋 Task History
    - ⚙️ Settings
    - 📞 Help & Support
    - 🚪 Logout
  - "Share Profile" button

## Screen 14: EditProfileScreen
- **Fields:** Avatar (changeable), Name, Bio (short), City, Phone (read-only)
- **Save button**

## Screen 15: WalletScreen
- **Balance Card:** "₹1,250" (large)
- **Action Buttons:** "Add Money" | "Withdraw"
- **Transaction List:** Recent transactions with type icon, description, amount (+/-), date
- **Tap on transaction:** Detail modal

## Screen 16: TaskHistoryScreen
- **Tabs:** "Completed" | "Cancelled" | "All"
- **Task cards:** Title, ₹, date, status, rating given
- **Filters:** Date range, role (as creator/as doer)

## Screen 17: SettingsScreen
- **Language:** Hindi / English toggle
- **Notifications:** Master toggle + granular (tasks, chat, payments)
- **Location:** Auto-detect on/off, preferred area
- **Account:** Delete account, Deactivate
- **About:** Version, Terms, Privacy, Licenses

## Screen 18: PublicProfileScreen
- **Purpose:** View another user's profile
- **Elements:** Avatar, Name, City, ⭐ Rating, Reviews list, Tasks completed count, Verified badge, "Report User" option
