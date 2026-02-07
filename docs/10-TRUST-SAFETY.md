# 10 — Trust & Safety

---

## Trust Layers

### Layer 1: Phone Verification (MVP)
- Every user verifies phone via OTP
- One account per phone number
- Phone number hidden from other users (show only after task acceptance)

### Layer 2: Profile & Ratings (MVP)
- Public profile with name, photo, city
- Star rating (1-5) from completed tasks
- Review text visible to others
- Task completion count displayed
- "Member since" date

### Layer 3: ID Verification (Phase 3)
- Aadhaar verification via DigiLocker API
- Selfie with liveness check (to prevent fake profiles)
- "Verified ✅" badge on profile
- Required for:
  - Tasks above ₹1,000
  - Withdrawals above ₹5,000/day
  - "Trusted Doer" status

### Layer 4: Trust Score (Phase 3)
Algorithm combining:
- Verification level (phone only: 30pts, Aadhaar: 70pts, selfie: 100pts)
- Average rating (weighted by recency)
- Task completion rate
- Response time
- Account age
- No of completed tasks
- Dispute history

---

## Safety Features

### For All Users
- **In-app chat only** — No need to share personal phone number until task accepted
- **Report user** — Flag inappropriate behavior
- **Block user** — Prevent future interactions
- **Emergency button** — Quick access to local police (100) and emergency contacts
- **Task verification** — Photos of completed work

### For Women Doers (Special)
- **Women-only tasks** — Creators can specify "Women preferred" (opt-in by doers)
- **Neighborhood mode** — Only show tasks within 2km
- **Share live location** — With emergency contacts during active task
- **Safety timer** — If task runs 2x expected time, auto-check "Are you safe?"
- **Verified creators only** — Option to only see tasks from verified creators

### For Creators
- **Doer verification visible** — See if doer is Aadhaar-verified
- **Rating threshold** — Set minimum doer rating for your task
- **Escrow protection** — Money safe until you confirm completion
- **Cancel anytime** — Before task starts, full refund

---

## Moderation

### Automated
- **Content filter** — Block profanity, hate speech in task titles/descriptions
- **Spam detection** — Flag duplicate tasks, suspicious posting patterns
- **Fake account detection** — Multiple accounts from same device/IP
- **Price anomaly** — Flag tasks with unreasonably low/high budgets

### Manual (Admin)
- Review flagged content
- Handle disputes
- Ban/suspend users
- Verify KYC documents

---

## Dispute Resolution

### Flow
```
Either party raises dispute
  ↓
Dispute screen: Select reason + upload evidence
  ├─ Creator: "Task not completed properly"
  ├─ Creator: "Doer didn't show up"
  ├─ Doer: "Creator not responding"
  ├─ Doer: "Task was different than described"
  └─ Other
      ↓
Evidence: Chat screenshots, photos, location data
  ↓
[Auto-resolution attempt]
  If clear-cut (e.g., doer never marked 'started') → Auto-resolve
  ↓
[Manual review]
  TaskMate support reviews within 24-48 hours
  ↓
Resolution:
  ├─ Full refund to creator
  ├─ Full payment to doer
  ├─ Partial refund (split)
  └─ Task cancelled, no penalty
```

### Penalties
| Offense | Consequence |
|---------|-------------|
| First cancellation | Warning |
| Repeated cancellations (>3/month) | Temporary suspension (24h) |
| No-show | Rating penalty + warning |
| Fake task posting | Account suspension |
| Harassment | Immediate ban |
| Fraud/scam | Permanent ban + police report |
| Fake reviews | Reviews removed + warning |

---

## Data Privacy

- Minimal data collection (only what's needed)
- Phone numbers hidden between users (proxy calling in Phase 2)
- Location shared only during active tasks
- Chat history retained for 90 days (for disputes), then auto-deleted
- User can request data deletion (GDPR-style, even though not mandatory in India yet)
- No selling user data to third parties. Ever.

---

## Aadhaar Integration (Phase 3)

### DigiLocker API Flow
```
User taps "Verify with Aadhaar"
  ↓
Redirect to DigiLocker
  ↓
User authenticates with DigiLocker
  ↓
DigiLocker returns:
  - Name (verify matches profile)
  - Date of birth
  - Address (city verification)
  - Photo (compare with selfie)
  ↓
Store: verified=true, aadhaar_verified=true
DO NOT store: Aadhaar number, full address
```

### Why Aadhaar?
- Most widely accepted ID in India
- DigiLocker makes it paperless
- Builds massive trust: "This person is real"
- Required by RBI for payment wallets above ₹10K
