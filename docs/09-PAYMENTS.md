# 09 — Payments & Wallet System

---

## Payment Philosophy
- **UPI-first** — 90%+ of Indian users prefer UPI
- **Escrow model** — Money is safe for both sides
- **Instant payouts** — Doers get paid fast (UPI instant)
- **Transparent fees** — No hidden charges

---

## Payment Flow

### When Creator Posts a Task (Phase 2+)

```
Creator creates task with budget ₹300
  ↓
"Pay ₹300 to post task"
  ↓
Payment options: UPI / Card / Wallet balance
  ↓
[If UPI] → Razorpay payment sheet → UPI app opens → Pay
[If Wallet] → Deduct from wallet balance
  ↓
₹300 moved to ESCROW (held by TaskMate)
  ↓
Task goes live
```

### When Task is Completed

```
Doer marks complete → Creator confirms
  ↓
Escrow releases:
  ├─ ₹270 → Doer's wallet (90%)
  └─ ₹30  → TaskMate commission (10%)
  ↓
Doer gets notification: "₹270 credited! 🎉"
  ↓
Doer can withdraw anytime
```

### Withdrawal (Doer)

```
Doer → Wallet → "Withdraw ₹500"
  ↓
Enter UPI ID: "aman@paytm"
  ↓
Confirm withdrawal
  ↓
Razorpay Payout API → Instant UPI transfer
  ↓
"₹500 sent to aman@paytm" ✅
```

---

## MVP (Phase 1) — No In-App Payments

In MVP, payments happen **outside the app**:
- Creator and Doer agree on price in chat
- Payment via cash / direct UPI between them
- TaskMate doesn't take commission yet
- Task completion is honor-based (creator confirms)

**Why:** Faster to launch, no Razorpay integration needed, test product-market fit first.

---

## Phase 2 — Full Payment Integration

### Wallet System

```
┌─────────────────────────────────┐
│         User Wallet             │
│                                 │
│  Balance: ₹1,250               │
│                                 │
│  [Add Money]  [Withdraw]        │
│                                 │
│  Recent Transactions:           │
│  +₹300  Task: Line standing    │
│  -₹500  Posted: Delivery task  │
│  +₹500  Refund: Task cancelled │
│  -₹1000 Withdrawn to UPI      │
└─────────────────────────────────┘
```

### Transaction Types

| Type | Direction | Description |
|------|-----------|-------------|
| `deposit` | + | User adds money to wallet |
| `withdrawal` | - | User withdraws to bank/UPI |
| `escrow_hold` | - | Budget held when posting task |
| `escrow_release` | + | Doer receives payment |
| `commission` | - | TaskMate's cut |
| `refund` | + | Task cancelled, money returned |
| `referral_bonus` | + | Referral reward credited |

### Escrow via Razorpay Route

Razorpay Route allows **split payments**:

```
Creator pays ₹300 via Razorpay
  ↓
Razorpay holds ₹300 in Route
  ↓
On completion:
  Route transfers ₹270 → Doer's linked account
  Route transfers ₹30 → TaskMate's account
```

**Alternative (simpler):** Use TaskMate's own escrow:
1. Creator pays → Money goes to TaskMate's Razorpay account
2. On completion → TaskMate triggers payout to Doer via Razorpay Payouts API
3. Commission stays with TaskMate

---

## Commission Structure

| Task Budget | Commission | Creator Pays | Doer Gets |
|-------------|------------|--------------|-----------|
| ₹100-₹299 | 10% | ₹100-₹299 | ₹90-₹269 |
| ₹300-₹999 | 10% | ₹300-₹999 | ₹270-₹899 |
| ₹1000+ | 8% | ₹1000+ | ₹920+ |

- Commission decreases for higher-value tasks (incentivize bigger tasks)
- First 3 tasks: 0% commission (onboarding incentive)
- Subscription users: Reduced commission (5%)

---

## Razorpay Integration Details

### APIs Needed
1. **Payment Gateway** — Collect payments from creators
2. **Payouts API** — Send money to doers (UPI/bank)
3. **Route (optional)** — Split payments
4. **Webhooks** — Payment confirmations

### Flutter Integration
```dart
// razorpay_flutter package
Razorpay _razorpay = Razorpay();

// Open payment
var options = {
  'key': 'rzp_live_xxxxx',
  'amount': 30000, // ₹300 in paise
  'name': 'TaskMate',
  'description': 'Task: Passport line standing',
  'prefill': {
    'contact': '+919876543210',
  },
  'method': {
    'upi': true,
    'card': true,
    'netbanking': true,
    'wallet': false,
  },
};
_razorpay.open(options);
```

### Webhook Flow
```
Razorpay → POST /webhook/payment
  ↓
Supabase Edge Function:
  1. Verify webhook signature
  2. Update transaction status
  3. Move money to escrow
  4. Update task status
  5. Send notification to creator
```

---

## Security

- All payment operations via **server-side Edge Functions** (never client-side)
- Razorpay webhook signature verification
- Double-entry bookkeeping in transactions table
- Rate limiting on withdrawal requests
- KYC required for withdrawals above ₹5,000/day
- Fraud detection: flag unusual patterns (multiple quick withdrawals, new accounts with high transactions)

---

## Refund Policy

| Scenario | Refund |
|----------|--------|
| Creator cancels before assignment | 100% refund |
| Creator cancels after assignment | 100% refund (doer gets small compensation ₹50) |
| Task expired (no one accepted) | 100% refund |
| Dispute resolved in creator's favor | 100% refund |
| Dispute resolved in doer's favor | Doer gets full payment |
| Dispute — mutual fault | 50% refund to creator, 50% to doer |
