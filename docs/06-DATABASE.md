# 06 — Database Schema

> Using Supabase (PostgreSQL) with Row Level Security (RLS)

---

## Entity Relationship Overview

```
users ──┬── tasks (creator_id)
        │     ├── task_applications (task_id, doer_id)
        │     ├── chats (task_id, creator_id, doer_id)
        │     │     └── messages (chat_id, sender_id)
        │     ├── reviews (task_id, reviewer_id, reviewee_id)
        │     └── transactions (task_id, user_id)
        ├── notifications (user_id)
        └── wallet (user_id)
```

---

## Table: `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  
  -- Role & Status
  role VARCHAR(10) DEFAULT 'both' CHECK (role IN ('creator', 'doer', 'both')),
  active_role VARCHAR(10) DEFAULT 'doer' CHECK (active_role IN ('creator', 'doer')),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  
  -- Location
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_updated_at TIMESTAMPTZ,
  
  -- Stats (denormalized for performance)
  avg_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  tasks_created INTEGER DEFAULT 0,
  
  -- Wallet
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  
  -- Profile
  aadhaar_verified BOOLEAN DEFAULT false,
  google_id VARCHAR(255),
  fcm_token TEXT,
  language VARCHAR(5) DEFAULT 'hi',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_location ON users USING gist (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
CREATE INDEX idx_users_active ON users(is_active, is_banned);
```

---

## Table: `tasks`

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_doer_id UUID REFERENCES users(id),
  
  -- Task Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  
  -- Location
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  destination_address TEXT,         -- For delivery tasks
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  
  -- Budget & Time
  budget DECIMAL(10, 2) NOT NULL CHECK (budget > 0),
  is_bidding BOOLEAN DEFAULT false,
  deadline TIMESTAMPTZ,
  
  -- Status
  status VARCHAR(25) DEFAULT 'open' CHECK (status IN (
    'open', 'assigned', 'in_progress', 'pending_confirmation', 
    'completed', 'cancelled', 'disputed', 'expired'
  )),
  
  -- Media
  photos TEXT[] DEFAULT '{}',       -- Array of photo URLs
  
  -- Metrics
  application_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Cancellation
  cancelled_by UUID REFERENCES users(id),
  cancel_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_tasks_creator ON tasks(creator_id);
CREATE INDEX idx_tasks_doer ON tasks(assigned_doer_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_created ON tasks(created_at DESC);
CREATE INDEX idx_tasks_location ON tasks USING gist (
  ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)
);
CREATE INDEX idx_tasks_open ON tasks(status, created_at DESC) WHERE status = 'open';
```

---

## Table: `task_applications`

```sql
CREATE TABLE task_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  doer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  message TEXT,                     -- Doer's application message
  bid_amount DECIMAL(10, 2),        -- If bidding enabled
  
  status VARCHAR(15) DEFAULT 'pending' CHECK (status IN (
    'pending', 'accepted', 'rejected', 'withdrawn'
  )),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(task_id, doer_id)          -- One application per doer per task
);

CREATE INDEX idx_applications_task ON task_applications(task_id);
CREATE INDEX idx_applications_doer ON task_applications(doer_id);
CREATE INDEX idx_applications_status ON task_applications(task_id, status);
```

---

## Table: `chats`

```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id),
  doer_id UUID NOT NULL REFERENCES users(id),
  
  is_active BOOLEAN DEFAULT true,
  
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(task_id, creator_id, doer_id)
);

CREATE INDEX idx_chats_creator ON chats(creator_id);
CREATE INDEX idx_chats_doer ON chats(doer_id);
CREATE INDEX idx_chats_task ON chats(task_id);
CREATE INDEX idx_chats_recent ON chats(last_message_at DESC);
```

---

## Table: `messages`

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN (
    'text', 'image', 'location', 'system', 'voice', 'quick_reply'
  )),
  
  -- Media
  media_url TEXT,
  
  -- Location (for location messages)
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_chat ON messages(chat_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(chat_id, is_read) WHERE is_read = false;
```

---

## Table: `reviews`

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Badges (optional tags)
  badges TEXT[] DEFAULT '{}',       -- ['punctual', 'friendly', 'quick']
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(task_id, reviewer_id)      -- One review per person per task
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id, created_at DESC);
CREATE INDEX idx_reviews_task ON reviews(task_id);
```

---

## Table: `transactions`

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  
  type VARCHAR(20) NOT NULL CHECK (type IN (
    'credit', 'debit', 'escrow_hold', 'escrow_release', 
    'withdrawal', 'deposit', 'refund', 'commission', 'referral_bonus'
  )),
  
  amount DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2),     -- Snapshot of balance after transaction
  
  description TEXT,
  
  -- Payment gateway reference
  payment_ref VARCHAR(255),
  payment_method VARCHAR(20),       -- 'upi', 'card', 'wallet', 'bank'
  
  status VARCHAR(15) DEFAULT 'completed' CHECK (status IN (
    'pending', 'completed', 'failed', 'reversed'
  )),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_task ON transactions(task_id);
```

---

## Table: `notifications`

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(30) NOT NULL CHECK (type IN (
    'task_applied', 'task_accepted', 'task_rejected', 
    'task_started', 'task_completed', 'task_cancelled',
    'new_message', 'payment_received', 'payment_sent',
    'review_received', 'system', 'promo'
  )),
  
  title VARCHAR(200) NOT NULL,
  body TEXT,
  
  -- Navigation data
  data JSONB DEFAULT '{}',          -- { "task_id": "...", "chat_id": "..." }
  
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

---

## Table: `categories`

```sql
CREATE TABLE categories (
  id VARCHAR(30) PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100) NOT NULL,
  icon VARCHAR(10),                 -- Emoji
  suggested_min_budget DECIMAL(10, 2),
  suggested_max_budget DECIMAL(10, 2),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Seed data
INSERT INTO categories (id, name_en, name_hi, icon, suggested_min_budget, suggested_max_budget, sort_order) VALUES
  ('delivery', 'Delivery & Pickup', 'डिलीवरी और पिकअप', '📦', 100, 500, 1),
  ('form_filling', 'Form Filling', 'फॉर्म भरना', '📝', 100, 400, 2),
  ('queue', 'Standing in Line', 'लाइन में खड़ा होना', '🧍', 200, 600, 3),
  ('shopping', 'Shopping & Errands', 'शॉपिंग और काम', '🛒', 150, 800, 4),
  ('documents', 'Document Work', 'दस्तावेज़ का काम', '📄', 200, 1000, 5),
  ('repairs', 'Small Repairs', 'छोटी मरम्मत', '🔧', 200, 1500, 6),
  ('driving', 'Driving / Drop-off', 'ड्राइविंग / ड्रॉप', '🚗', 200, 1000, 7),
  ('photo_video', 'Photo & Video', 'फोटो और वीडियो', '📸', 300, 2000, 8),
  ('data_entry', 'Data Entry / Typing', 'डाटा एंट्री / टाइपिंग', '💻', 100, 500, 9),
  ('other', 'Other', 'अन्य', '🎯', 100, 2000, 10);
```

---

## Table: `reports`

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  reported_task_id UUID REFERENCES tasks(id),
  
  reason VARCHAR(50) NOT NULL,      -- 'spam', 'fraud', 'harassment', 'inappropriate', 'other'
  description TEXT,
  
  status VARCHAR(15) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

---

## Supabase RLS Policies (Key ones)

```sql
-- Users can read their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Tasks: Anyone can read open tasks, creators can manage their own
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read open tasks" ON tasks FOR SELECT USING (status = 'open' OR creator_id = auth.uid() OR assigned_doer_id = auth.uid());
CREATE POLICY "Creators manage own tasks" ON tasks FOR ALL USING (creator_id = auth.uid());

-- Messages: Only chat participants can read
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chat participants read" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND (chats.creator_id = auth.uid() OR chats.doer_id = auth.uid()))
);

-- Notifications: Only own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
```

---

## Database Functions

```sql
-- Update user stats after review
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET
    avg_rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE reviewee_id = NEW.reviewee_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = NEW.reviewee_id)
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_insert
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Increment application count on task
CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tasks SET application_count = application_count + 1 WHERE id = NEW.task_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_insert
AFTER INSERT ON task_applications
FOR EACH ROW EXECUTE FUNCTION increment_application_count();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## PostGIS Setup (for location queries)

```sql
-- Enable PostGIS extension (Supabase supports this)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Find tasks within X km of a point
-- Usage: SELECT * FROM nearby_tasks(28.6139, 77.2090, 5);
CREATE OR REPLACE FUNCTION nearby_tasks(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km DECIMAL DEFAULT 5
)
RETURNS SETOF tasks AS $$
  SELECT * FROM tasks
  WHERE status = 'open'
  AND ST_DWithin(
    ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)::geography,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_km * 1000  -- Convert km to meters
  )
  ORDER BY 
    ST_Distance(
      ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    )
  ASC;
$$ LANGUAGE sql STABLE;
```
