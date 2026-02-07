# 08 — Tech Stack Decisions

---

## Overview

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | Flutter (Dart) | Single codebase for Android + iOS, great performance, huge Indian dev community |
| **Backend** | Supabase | PostgreSQL + Auth + Realtime + Storage + Edge Functions — all-in-one, free tier generous |
| **Database** | PostgreSQL (via Supabase) | Relational, PostGIS for location, RLS for security, battle-tested |
| **Auth** | Supabase Auth | Phone OTP, Google Sign-In, session management built-in |
| **Real-time** | Supabase Realtime | WebSocket subscriptions for chat + live updates, no separate server needed |
| **Storage** | Supabase Storage | Photos, profile pics, task images — S3-compatible, CDN included |
| **Maps** | Google Maps Flutter | Best map data for India, Places API for address autocomplete |
| **Payments** | Razorpay | India-first, UPI + cards + netbanking, escrow via Route, great docs |
| **Push Notifs** | Firebase Cloud Messaging (FCM) | Free, reliable, both platforms, works with Supabase |
| **Analytics** | Mixpanel or Firebase Analytics | Event tracking, funnels, retention |
| **Crash Reporting** | Firebase Crashlytics | Free, real-time crash reports |
| **CI/CD** | GitHub Actions + Fastlane | Automated builds, Play Store deployment |

---

## Why Flutter (Not React Native)

| Factor | Flutter | React Native |
|--------|---------|-------------|
| **Performance** | Near-native, Skia rendering | Bridge overhead, Hermes helps but not same |
| **UI Consistency** | Pixel-perfect on both platforms | Platform-dependent rendering |
| **Hot Reload** | ✅ Excellent | ✅ Good |
| **Indian Community** | Massive, lots of Hindi tutorials | Large but more fragmented |
| **Supabase SDK** | Official, well-maintained | Official, also good |
| **Build Size** | ~15-20 MB (acceptable) | ~10-15 MB (slightly smaller) |
| **Future** | Google-backed, growing fast | Meta-backed, stable |

**Decision:** Flutter wins on performance + UI consistency + Supabase integration.

---

## Why Supabase (Not Firebase)

| Factor | Supabase | Firebase |
|--------|----------|---------|
| **Database** | PostgreSQL (relational, SQL) | Firestore (NoSQL, limited queries) |
| **Location Queries** | PostGIS native | Geohash workarounds |
| **Pricing** | Generous free tier, predictable scaling | Free tier good, but reads/writes can spike costs |
| **Real-time** | Built-in on all tables | Built-in (Firestore) |
| **Auth** | Phone OTP, Google, Magic Link | Phone OTP, Google, many more |
| **Self-host** | Can self-host anytime | Vendor locked |
| **SQL** | Full PostgreSQL power | NoSQL only |
| **RLS** | Row Level Security (database level) | Security rules (application level) |

**Decision:** Supabase wins on relational data model (TaskMate has lots of relationships), PostGIS for location, and SQL flexibility. Also: no vendor lock-in.

---

## Why Razorpay (Not Cashfree/PayU)

| Factor | Razorpay | Cashfree | PayU |
|--------|----------|----------|------|
| **UPI** | ✅ Excellent | ✅ Good | ✅ Good |
| **Escrow/Route** | ✅ Razorpay Route (split payments) | ✅ Cashgram | ❌ Limited |
| **Flutter SDK** | ✅ Official | ✅ Official | ⚠️ Community |
| **Documentation** | 🏆 Best in India | Good | Average |
| **Brand Trust** | Most recognized | Growing | Established |
| **Pricing** | 2% per transaction | 1.75% | 2% |

**Decision:** Razorpay for brand recognition, Route for escrow/split payments, and best Flutter SDK.

---

## Architecture

```
┌─────────────────────────────┐
│         Flutter App          │
│  ┌───────────────────────┐  │
│  │  State: Riverpod/Bloc │  │
│  │  Navigation: GoRouter │  │
│  │  HTTP: Supabase SDK   │  │
│  │  Maps: google_maps    │  │
│  │  Pay: razorpay_flutter│  │
│  └───────────────────────┘  │
└─────────────┬───────────────┘
              │ HTTPS / WSS
              ▼
┌─────────────────────────────┐
│         Supabase             │
│  ┌──────────┐ ┌──────────┐  │
│  │ Auth     │ │ Realtime │  │
│  │ (OTP,   │ │ (Chat,   │  │
│  │  Google) │ │  Updates)│  │
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │PostgreSQL│ │ Storage  │  │
│  │ +PostGIS │ │ (Photos) │  │
│  └──────────┘ └──────────┘  │
│  ┌──────────────────────┐   │
│  │   Edge Functions     │   │
│  │ (Task logic, notifs, │   │
│  │  payment webhooks)   │   │
│  └──────────────────────┘   │
└─────────────┬───────────────┘
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Razorpay│ │  FCM   │ │ Google │
│(Pay)   │ │(Push)  │ │ Maps   │
└────────┘ └────────┘ └────────┘
```

---

## State Management: Riverpod

**Why Riverpod (not Bloc, not Provider):**
- Compile-safe, no BuildContext required
- Better testability
- Code generation support
- Provider-like simplicity with more power
- Growing as Flutter community standard

---

## Key Flutter Packages

```yaml
dependencies:
  # Core
  flutter_riverpod: ^2.x        # State management
  go_router: ^13.x               # Navigation
  
  # Supabase
  supabase_flutter: ^2.x         # Auth + DB + Realtime + Storage
  
  # UI
  google_maps_flutter: ^2.x      # Maps
  cached_network_image: ^3.x     # Image caching
  shimmer: ^3.x                  # Loading skeletons
  lottie: ^2.x                   # Animations
  
  # Payment
  razorpay_flutter: ^1.x         # Payments
  
  # Utilities
  geolocator: ^10.x              # GPS location
  geocoding: ^2.x                # Address ↔ coordinates
  image_picker: ^1.x             # Camera/gallery
  url_launcher: ^6.x             # Open links
  share_plus: ^7.x               # Share to WhatsApp etc.
  intl: ^0.18.x                  # i18n, date formatting
  timeago: ^3.x                  # "2 hours ago"
  
  # Push Notifications
  firebase_messaging: ^14.x      # FCM
  flutter_local_notifications: ^16.x  # Local notifs
  
  # Storage
  shared_preferences: ^2.x       # Local key-value
  hive: ^2.x                     # Local database (offline cache)
```

---

## Folder Structure

```
lib/
├── main.dart
├── app.dart                      # MaterialApp + GoRouter
├── config/
│   ├── supabase_config.dart
│   ├── theme.dart
│   ├── constants.dart
│   └── routes.dart
├── models/
│   ├── user_model.dart
│   ├── task_model.dart
│   ├── chat_model.dart
│   ├── message_model.dart
│   ├── notification_model.dart
│   ├── transaction_model.dart
│   └── category_model.dart
├── providers/
│   ├── auth_provider.dart
│   ├── task_provider.dart
│   ├── chat_provider.dart
│   ├── notification_provider.dart
│   ├── wallet_provider.dart
│   └── location_provider.dart
├── services/
│   ├── auth_service.dart
│   ├── task_service.dart
│   ├── chat_service.dart
│   ├── notification_service.dart
│   ├── wallet_service.dart
│   ├── location_service.dart
│   └── storage_service.dart
├── screens/
│   ├── auth/
│   ├── home/
│   ├── create/
│   ├── chat/
│   ├── notifications/
│   └── profile/
├── widgets/
│   ├── task_card.dart
│   ├── category_chip.dart
│   ├── chat_bubble.dart
│   ├── avatar_widget.dart
│   ├── rating_stars.dart
│   ├── status_badge.dart
│   ├── custom_button.dart
│   ├── loading_shimmer.dart
│   └── empty_state.dart
├── utils/
│   ├── helpers.dart
│   ├── validators.dart
│   ├── formatters.dart
│   └── extensions.dart
└── l10n/
    ├── app_en.arb
    └── app_hi.arb
```

---

## Environment & Deployment

### Development
- Supabase local dev (supabase CLI)
- Flutter hot reload
- Android Emulator / Physical device

### Staging
- Supabase project (free tier)
- Internal testing track (Play Console)
- TestFlight (iOS)

### Production
- Supabase Pro plan (when scaling)
- Play Store (Android) — primary
- App Store (iOS) — secondary, after Android validates
- CDN for static assets
