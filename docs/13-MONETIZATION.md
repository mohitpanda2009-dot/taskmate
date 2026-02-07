# 13 — Monetization & Revenue Model

---

## Revenue Streams

### 1. Commission on Tasks (Primary — Phase 2+)
- **10% commission** on each completed task
- Deducted from task budget before paying doer
- Example: ₹300 task → ₹30 to TaskMate, ₹270 to doer
- Higher-value tasks (₹1000+): 8% commission
- First 3 tasks: 0% commission (new user incentive)

**Projected Revenue (at scale):**
- 1,000 tasks/day × ₹300 avg × 10% = ₹30,000/day = ₹9L/month

### 2. Featured Tasks (Phase 2)
- Creators pay ₹20-₹50 to "boost" their task
- Boosted tasks appear at top of feed with "⚡ Promoted" badge
- 3x more visibility, faster doer matching
- Similar to OLX/Quikr "Top Ad" model

### 3. Urgent Task Premium (Phase 2)
- "Urgent" tag: ₹50 extra
- Task gets priority in feed + push notifications to nearby doers
- Higher acceptance rate (doers see ₹ premium)

### 4. TaskMate Plus (Subscription — Phase 3)
**For Creators:**
- ₹99/month or ₹799/year
- Benefits:
  - Reduced commission (5% instead of 10%)
  - Priority support
  - Featured tasks included (2/month)
  - Verified badge
  - Access to "Trusted Doers" pool

**For Doers:**
- ₹49/month or ₹399/year
- Benefits:
  - Early access to new tasks (30-second head start)
  - Priority in applicant list
  - Higher withdrawal limits
  - Skill badges on profile
  - Insurance on tasks

### 5. Business Accounts (Phase 3)
- ₹999/month for businesses
- Bulk task posting
- Dedicated doer pool
- Monthly invoicing
- Analytics dashboard
- API access for task automation

### 6. Advertising (Phase 3, careful)
- Sponsored task categories (e.g., "Powered by Dunzo" for delivery)
- Banner ads on home feed (minimal, non-intrusive)
- Local business promotions in relevant categories
- **Rule:** Ads should feel useful, not annoying

---

## Pricing Strategy for India

### Key Principles
1. **Free to start** — No barriers to first task
2. **Commission-based** — We earn when users earn
3. **Low subscription** — ₹49-₹99/month (chai ke paise)
4. **No hidden fees** — Transparent pricing page
5. **Festival offers** — Diwali, Holi discounts on subscriptions

### Competitive Pricing
| Service | Their Cut | Our Cut |
|---------|-----------|---------|
| Urban Company | 15-25% | — |
| Dunzo | ₹35+ delivery fee | — |
| Swiggy (delivery partner) | ~₹15-25/delivery | — |
| **TaskMate** | **10%** | **Lower than all** |

---

## Phase 1 (MVP) — No Monetization
- Zero commission
- Direct payment between users
- Focus: Product-market fit, user acquisition
- Funding: Bootstrap / personal funds
- Duration: 3-6 months

## Phase 2 — Commission + Boost
- Enable wallet + escrow
- 10% commission on tasks
- Task boosting feature
- Urgent premium
- Target: Break-even

## Phase 3 — Subscription + Scale
- TaskMate Plus subscriptions
- Business accounts
- Careful advertising
- Target: Profitability

---

## Unit Economics (Target)

| Metric | Value |
|--------|-------|
| Average task value | ₹300 |
| Commission rate | 10% |
| Revenue per task | ₹30 |
| CAC (Cost to acquire user) | ₹50-₹100 |
| LTV (Lifetime value) | ₹500-₹1,500 |
| Tasks per active user/month | 3-5 |
| Revenue per user/month | ₹90-₹150 |
| Gross margin | 70%+ (after payment gateway fees) |

### Break-even Calculation
- Fixed costs: ₹50K/month (Supabase Pro + server + domain)
- Variable: Razorpay fee 2% per transaction
- Need: ~1,700 tasks/month at ₹300 avg to cover ₹50K
- That's ~57 tasks/day — achievable with 500 active users
