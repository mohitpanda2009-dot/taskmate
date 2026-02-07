# 11 — Notification Strategy

---

## Notification Channels

| Channel | When | Priority |
|---------|------|----------|
| **In-App** | Always (MVP) | All notifications |
| **Push (FCM)** | Phase 2 | Important updates |
| **SMS** | Phase 3 | Critical only (payment, security) |
| **WhatsApp Business API** | Phase 3 | Task updates, marketing |

---

## Notification Types & Templates

### Task Lifecycle

| Event | In-App Title | Push Title | Push Body |
|-------|-------------|------------|-----------|
| New applicant | "Naya application!" | "📋 Kisi ne apply kiya" | "{name} ne aapke task ke liye apply kiya" |
| Task accepted | "Task mil gaya! 🎉" | "✅ Task accepted!" | "{creator} ne aapko select kiya — chat karo!" |
| Task rejected | "Next time 💪" | — (no push for rejection) | — |
| Task started | "Task shuru ho gaya" | "🚀 Task started" | "{doer} ne task shuru kiya" |
| Task completed | "Task complete! ✅" | "🎉 Kaam ho gaya!" | "₹{amount} aapke wallet mein — rating do" |
| Task cancelled | "Task cancel ho gaya" | "❌ Task cancelled" | "{name} ne task cancel kiya" |
| Task expired | "Task expire ho gaya" | "⏰ Task expired" | "Kisi ne accept nahi kiya — repost karo?" |

### Chat

| Event | Push Title | Push Body |
|-------|------------|-----------|
| New message | "{name}" | "{message_preview}" (truncated 50 chars) |
| Photo received | "{name}" | "📷 Photo bheji" |
| Location shared | "{name}" | "📍 Location share kiya" |

### Payments

| Event | Push Title | Push Body |
|-------|------------|-----------|
| Payment received | "💰 ₹{amount} credited!" | "Task '{title}' ka payment aa gaya" |
| Withdrawal success | "✅ ₹{amount} sent" | "UPI transfer successful — {upi_id}" |
| Withdrawal failed | "❌ Transfer failed" | "₹{amount} wapas wallet mein — retry karo" |
| Escrow held | "🔒 ₹{amount} hold" | "Task post hone pe escrow mein gaya" |

### Social

| Event | Push Title | Push Body |
|-------|------------|-----------|
| New review | "⭐ Naya review!" | "{name} ne {rating}⭐ diya — '{comment}'" |
| Profile verified | "✅ Verified!" | "Aapka profile verify ho gaya" |

### System

| Event | Push Title | Push Body |
|-------|------------|-----------|
| Welcome | "Welcome to TaskMate! 🎉" | "Pehla task post karo ya kamana shuru karo" |
| Nearby task | "📍 Naya task nearby!" | "'{title}' — ₹{budget} — {distance} away" |
| Inactive reminder | "Kahan ho? 👋" | "Naye tasks aa rahe hain — check karo" |

---

## Push Notification Rules

### Do Send Push When:
- Task is accepted/completed/cancelled (important state change)
- New chat message (if user not in chat screen)
- Payment received/failed
- Nearby high-value task (>₹500, within 2km)

### Don't Send Push When:
- User is actively in the app (use in-app only)
- Late night (11 PM - 7 AM) unless urgent
- User has disabled that notification type
- More than 5 pushes in an hour (batch them)

### Smart Notifications:
- **Batch similar:** "3 new messages from Rajesh" instead of 3 separate pushes
- **Priority:** Payment > Task status > Chat > Promotional
- **Location-based:** Only send "nearby task" if user has GPS active
- **Frequency cap:** Max 10 pushes/day per user

---

## Quiet Hours
- Default: 11 PM - 7 AM (no push except payment/security)
- User configurable in settings
- Urgent notifications (security alerts) bypass quiet hours

---

## FCM Implementation

### Setup
```dart
// Firebase messaging initialization
FirebaseMessaging messaging = FirebaseMessaging.instance;

// Request permission (iOS)
NotificationSettings settings = await messaging.requestPermission(
  alert: true,
  badge: true,
  sound: true,
);

// Get FCM token
String? token = await messaging.getToken();
// Save to Supabase: users.fcm_token
```

### Token Management
- Save FCM token on login/app start
- Update on token refresh
- Clear on logout
- Handle multiple devices (array of tokens per user)

### Notification Handling
```dart
// Foreground: Show in-app banner
FirebaseMessaging.onMessage.listen((message) {
  showInAppNotification(message);
});

// Background/Terminated: Navigate on tap
FirebaseMessaging.onMessageOpenedApp.listen((message) {
  navigateToScreen(message.data);
});
```

---

## Notification Settings (User Control)

```
Notifications Settings:
├── 🔔 All Notifications: ON/OFF (master toggle)
├── Task Updates: ON ← Can't turn off (critical)
├── Chat Messages: ON/OFF
├── Nearby Tasks: ON/OFF
├── Payment Alerts: ON ← Can't turn off (critical)  
├── Reviews: ON/OFF
├── Promotional: ON/OFF
└── Quiet Hours: 11 PM - 7 AM (editable)
```

---

## In-App Notification Design

### Notification Item
```
┌─────────────────────────────────────┐
│  ✅ Task accepted!              2m  │
│  Aman ne aapka task accept kiya.   │
│  Tap to chat.                       │
└─────────────────────────────────────┘
│  (unread = highlighted background)  │
```

### Floating Banner (when app is open)
```
┌─────────────────────────────────────┐
│  💬 Rajesh: "On my way!"    [View] │
└─────────────────────────────────────┘
- Appears at top for 3 seconds
- Swipe up to dismiss
- Tap to navigate
```
