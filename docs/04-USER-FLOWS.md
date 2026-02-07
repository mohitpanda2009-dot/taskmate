# 04 — User Flows

---

## Flow 1: First-Time User (Onboarding)

```
App Open
  ↓
Splash Screen (1.5s)
  ↓
[Check: Is user logged in?]
  ├─ YES → Home Screen
  └─ NO → Welcome Screen
        ↓
      Swipe 1: "Koi bhi chhota kaam, turant karwao"
      Swipe 2: "Apne time pe kamao, apni marzi se"
      Swipe 3: "Verified log, safe payments"
        ↓
      "Get Started" button
        ↓
      Login Screen
        ↓
      Enter Phone Number
        ↓
      OTP Screen (auto-read OTP)
        ↓
      [Check: Is profile complete?]
        ├─ YES → Home Screen
        └─ NO → Profile Setup
              ↓
            Enter Name
            Upload Photo (optional, skip)
            Select City (auto-detect or pick)
            Select Role:
              □ "Main kaam karwana chahta hu" (Creator)
              □ "Main kaam karke kamana chahta hu" (Doer)
              □ "Dono" (Both)
              ↓
            Location Permission
              ├─ Allowed → Save + Go to Home
              └─ Denied → Show why needed, continue anyway
                    ↓
                  Home Screen 🎉
```

## Flow 2: Task Creator — Post a Task

```
Home Screen (Creator View)
  ↓
Tap "+" FAB (Create Task)
  ↓
Create Task Screen
  ├─ Enter Title: "Passport office mein line lagao"
  ├─ Select Category: 🧍 Standing in Line
  ├─ Add Description (optional): "Token lena hai window 3 se, documents de dunga"
  ├─ Set Location: [Auto-detect] or [Pick on Map] or [Type Address]
  │     → "Passport Seva Kendra, Lajpat Nagar"
  ├─ Set Budget: ₹300 (suggested range shown: ₹200-₹500)
  ├─ Set Deadline: "Today, before 2 PM"
  └─ Add Photos (optional): Upload document photo
        ↓
      Preview Screen
        ↓
      "Post Task" button
        ↓
      [Task Created — Status: OPEN]
        ↓
      Success Animation + "Your task is live!"
        ↓
      Back to Home (task appears in "My Tasks")
```

## Flow 3: Task Doer — Find & Accept a Task

```
Home Screen (Doer View)
  ↓
Browse task feed (sorted: nearest first)
  ↓
[Optional] Filter by category, distance, pay range
  ↓
Tap on Task Card: "Passport office mein line lagao — ₹300"
  ↓
Task Detail Screen
  ├─ Full description
  ├─ Location on map (1.2 km away)
  ├─ Creator: "Rajesh K. ⭐4.5 (12 tasks)"
  ├─ Budget: ₹300
  ├─ Deadline: Today, 2 PM
  └─ 2 others have applied
        ↓
      "Apply for Task" button
        ↓
      [Optional] Add message: "Main 10 min mein pahunch sakta hu"
        ↓
      [Application Sent — Status: PENDING]
        ↓
      "You'll be notified when the creator responds"
```

## Flow 4: Creator Accepts an Applicant

```
Creator gets notification: "3 people applied for your task"
  ↓
Tap notification → Task Detail (Creator View)
  ↓
See applicant list:
  ├─ Aman K. ⭐4.8 (25 tasks) — "Main 10 min mein aa sakta hu"
  ├─ Raju P. ⭐4.2 (8 tasks) — "Available hu"
  └─ Sunita D. ⭐4.6 (15 tasks) — "Nearby hu"
        ↓
      Tap on Aman → See full profile
        ↓
      "Accept Aman" button
        ↓
      Confirm: "Aman ko task assign karna chahte ho?"
        ↓
      [Task Status: ASSIGNED]
        ↓
      Chat opens automatically between Creator ↔ Aman
        ↓
      Other applicants notified: "Someone else was selected"
```

## Flow 5: Task Execution (Creator ↔ Doer)

```
[Task Status: ASSIGNED]
  ↓
Chat opens:
  System: "Task assigned! Chat karo aur details share karo."
  Creator: "Location ye hai, token window 3 se lena"
  Creator: [Shares photo of documents]
  Doer: "Theek hai, nikal raha hu"
  ↓
Doer taps "Start Task" button in chat/task screen
  ↓
[Task Status: IN_PROGRESS]
  Creator gets notification: "Aman ne task start kiya"
  ↓
During task:
  Doer: "Pahunch gaya, line mein hu"
  Doer: [Shares location]
  Doer: "Token mil gaya — number 47"
  Doer: [Shares photo of token]
  ↓
Doer taps "Mark Complete"
  ↓
[Task Status: PENDING_CONFIRMATION]
  Creator gets notification: "Aman says task is done"
  ↓
Creator reviews:
  ├─ "Confirm Complete" → Task COMPLETED ✅
  └─ "Dispute" → Opens dispute flow
```

## Flow 6: Task Completion & Rating

```
[Task Status: COMPLETED]
  ↓
Payment released (escrow → doer wallet)
  ↓
Rating Screen (for Creator):
  "Aman ne kaam kaisa kiya?"
  ⭐⭐⭐⭐⭐
  [Optional review text]
  "Quick and professional!"
  → Submit
  ↓
Rating Screen (for Doer):
  "Rajesh ke saath experience kaisa raha?"
  ⭐⭐⭐⭐⭐
  [Optional review text]
  "Clear instructions diye, easy task"
  → Submit
  ↓
Both profiles updated with new ratings
  ↓
Home Screen (back to browsing)
```

## Flow 7: Chat Flow

```
Chat List Screen
  ↓
Shows active chats (grouped by task)
  ├─ "Passport task — Rajesh" (2 new messages)
  ├─ "Delivery task — Priya" (done ✓)
  └─ Empty state if no chats
        ↓
      Tap on chat
        ↓
      Chat Room:
        ├─ Text messages
        ├─ Photo sharing (camera/gallery)
        ├─ Location sharing (current location pin)
        ├─ System messages (task status changes)
        ├─ Quick replies: "On my way", "Reached", "Done"
        └─ Call button (proxy number, hides real number)
```

## Flow 8: Cancel / Drop Task

### Creator Cancels (Before Assignment)
```
Task Detail → "Cancel Task"
  → Reason: "Ab zaroorat nahi" / "Budget change" / "Other"
  → Task Status: CANCELLED
  → Applicants notified
  → No penalty
```

### Creator Cancels (After Assignment)
```
Task Detail → "Cancel Task"
  → Warning: "Doer has already accepted. Cancel?"
  → Reason required
  → Task Status: CANCELLED
  → Doer notified + gets small compensation (if enabled)
  → Creator gets a soft warning on profile
```

### Doer Drops Task
```
Chat/Task → "Drop Task"
  → Reason: "Emergency", "Can't reach location", "Other"
  → Task goes back to OPEN
  → Creator notified
  → Doer's reliability score affected (minor)
  → Other applicants can re-apply
```

## Flow 9: Wallet & Payments (Phase 2)

```
Profile → Wallet
  ↓
Wallet Screen:
  Balance: ₹1,250
  ├─ "Add Money" → UPI / Card → Amount → Pay
  ├─ "Withdraw" → Enter UPI ID → Amount → Confirm → Instant transfer
  └─ "History" → All transactions
        ├─ +₹300 — Task: Passport line (completed)
        ├─ -₹500 — Task: Delivery posted (escrow)
        ├─ +₹500 — Refund: Task cancelled
        └─ -₹1250 — Withdrawn to UPI
```

## Edge Cases & Error States

### No Tasks Nearby
```
Home Feed → Empty State:
  🔍 "Abhi koi task nahi hai nearby"
  "Distance badhao ya baad mein check karo"
  [Button: "Expand Search Area"]
```

### Poor Network
```
Any action → Network error
  → Show cached data if available
  → Toast: "Slow internet. Retry?"
  → Queue actions for when network returns
```

### Task Expired
```
Doer opens old task → 
  "Ye task expire ho gaya hai"
  [Button: "Browse Other Tasks"]
```

### Duplicate Task
```
Creator tries to post similar task →
  "Aapka ek similar task already active hai"
  [Show existing task]
  [Button: "Post Anyway" / "Go to Existing"]
```
