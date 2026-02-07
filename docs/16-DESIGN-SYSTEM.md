# 16 — Design System

---

## Brand Identity

### Name: **TaskMate**
- "Task" = clear purpose
- "Mate" = friendly, like a buddy who helps
- Hinglish-friendly (Indians already use "mate")

### Tagline Options
- "Chhote kaam, achi kamai" (primary)
- "Kaam dhundo, kaam karwao"
- "India's task marketplace"

### Logo Direction
- Simple, modern wordmark
- Incorporate a checkmark (✓) or handshake element
- Orange/teal color scheme (energetic, Indian-feeling)

---

## Color Palette

### Primary Colors
```
Orange (Primary):     #FF6B35  — Energy, action, India-warm
Teal (Secondary):     #00BFA5  — Trust, growth, fresh
```

### Supporting Colors
```
Dark Gray (Text):     #1A1A2E  — Headlines, primary text
Medium Gray:          #6B7280  — Secondary text
Light Gray:           #F3F4F6  — Backgrounds, cards
White:                #FFFFFF  — Card backgrounds
```

### Status Colors
```
Success Green:        #10B981  — Completed, payment received
Warning Yellow:       #F59E0B  — Pending, attention needed
Error Red:            #EF4444  — Failed, cancelled, errors
Info Blue:            #3B82F6  — Information, tips
```

### Budget/Money
```
Money Green:          #059669  — ₹ amounts (bold, always visible)
```

---

## Typography

### Font: **Poppins** (Google Fonts)
- Clean, modern, excellent Hindi rendering
- Good readability on small screens
- Free, widely available

### Scale
```
Heading 1:    24px, Bold (600)      — Screen titles
Heading 2:    20px, SemiBold (600)  — Section headers
Heading 3:    18px, SemiBold (600)  — Card titles
Body:         16px, Regular (400)   — Main content
Body Small:   14px, Regular (400)   — Secondary text
Caption:      12px, Regular (400)   — Timestamps, labels
Budget:       20px, Bold (700)      — ₹ amounts
```

### Hindi Typography
- Same Poppins (supports Devanagari)
- Fallback: Noto Sans Devanagari
- Slightly larger size for Hindi (16px body → 17px)

---

## Spacing System (8px grid)

```
xs:   4px    — Tight spacing
sm:   8px    — Between related elements
md:   16px   — Between sections
lg:   24px   — Between major sections
xl:   32px   — Page padding
xxl:  48px   — Between screen sections
```

---

## Component Specs

### Task Card
```
┌─────────────────────────────────┐
│  📦 Delivery & Pickup           │  ← Category chip (top-left)
│                                 │
│  Passport office se document    │  ← Title (Heading 3, max 2 lines)
│  pick karna hai                 │
│                                 │
│  📍 1.2 km  •  ⏰ 2 hrs ago    │  ← Meta info (Caption, gray)
│                                 │
│  ₹300                   👤 ⭐4.5│  ← Budget (bold green) + Creator
└─────────────────────────────────┘
- Card: White bg, 12px border radius, subtle shadow
- Padding: 16px
- Tap: Ripple effect → TaskDetail
```

### Category Chip
```
┌──────────────────┐
│  📦 Delivery     │
└──────────────────┘
- Active: Orange bg (#FF6B35), white text
- Inactive: Light gray bg (#F3F4F6), dark text
- Height: 36px
- Border radius: 18px (pill)
- Horizontal scroll, 8px gap
```

### Button (Primary)
```
┌──────────────────────────┐
│      Post Task           │
└──────────────────────────┘
- Background: Orange (#FF6B35)
- Text: White, 16px, SemiBold
- Height: 52px
- Border radius: 12px
- Full width (with 16px horizontal margin)
- Disabled: 50% opacity
- Loading: Circular progress indicator
```

### Input Field
```
┌──────────────────────────┐
│  Kya kaam hai?           │  ← Placeholder (gray)
└──────────────────────────┘
- Border: 1px #E5E7EB, 12px radius
- Focus border: 2px Orange
- Height: 52px (single line), auto-expand (multiline)
- Padding: 16px horizontal
- Error state: Red border + error text below
```

### Avatar
```
- Small: 32x32px (chat list, comments)
- Medium: 48x48px (task card, applicant list)  
- Large: 80x80px (profile screen)
- Shape: Circle
- Fallback: First letter of name on colored bg
```

### Status Badge
```
Open:        Green outline, green text
Assigned:    Orange bg, white text
In Progress: Blue bg, white text
Completed:   Green bg, white text ✓
Cancelled:   Red bg, white text ✗
```

### Chat Bubble
```
Sent (right):     Orange bg (#FF6B35), white text
Received (left):  Light gray bg (#F3F4F6), dark text
System:           Centered, smaller, italic, light text
```

### Bottom Navigation
```
- 5 tabs: Home, Create, Chat, Notifications, Profile
- Active: Orange icon + label
- Inactive: Gray icon + label
- Create tab: Larger icon or FAB-style
- Notification tab: Red badge for unread count
```

---

## Animations

### Micro-interactions
- **Task posted:** Confetti/success animation (Lottie)
- **Task accepted:** Checkmark animation
- **Payment received:** Money rain animation (small, tasteful)
- **Pull to refresh:** Custom TaskMate loading animation
- **Screen transitions:** Shared element (task card → detail)

### Loading States
- **Shimmer:** For lists (task feed, chat list)
- **Skeleton:** Card-shaped placeholders
- **Spinner:** For actions (posting, paying)

---

## Icons
- Use **Lucide Icons** or **Iconsax** (modern, consistent)
- Category icons: Emoji (for familiarity in Indian context)
- Tab bar: Outlined (inactive), Filled (active)

---

## Dark Mode (Phase 2)
- Dark background: #1A1A2E
- Card background: #2D2D44
- Text: #E5E7EB (primary), #9CA3AF (secondary)
- Orange stays the same (good contrast on dark)

---

## Responsive Design
- **Target screens:** 5-6.5 inch (most Indian phones)
- **Min width:** 320px (older devices)
- **Safe areas:** Respect notch, home indicator
- **Text scaling:** Support system font size (accessibility)
- **RTL:** Not needed (Hindi is LTR)

---

## Accessibility
- Minimum touch target: 48x48px
- Color contrast ratio: 4.5:1 minimum
- Screen reader labels on all interactive elements
- Large text option support
- No color-only indicators (use icons + color)
