# 🚀 Supabase Real-Time Sync Setup - Quick Guide

## What You Need to Do

### Step 1️⃣: Create Supabase Account & Project
1. Visit **https://supabase.com**
2. Click **Sign Up** → Create account
3. Create a new **Project** (choose any region, e.g., US East)
4. Wait 2-3 minutes for initialization

### Step 2️⃣: Copy Your Credentials
After project is ready:
1. Go to **Settings (gear icon) → API**
2. Copy these two values:
   - **Project URL** (Example: `https://xxxxx.supabase.co`)
   - **anon public key** (Example: `eyJhbGciOiJIUzI1NiIsInR...`)

### Step 3️⃣: Create Database Tables
1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste this SQL and click **Run**:

```sql
CREATE TABLE portfolio_data (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE portfolio_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access" ON portfolio_data
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public backups" ON portfolio_backups
  FOR ALL USING (true) WITH CHECK (true);
```

### Step 4️⃣: Update Your Code
Replace `PLACEHOLDER` values with your real credentials:

**File: `admin/admin.js` (Line ~165)**
```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL';  // Replace this
const SUPABASE_KEY = 'YOUR_ANON_KEY';     // Replace this
```

**File: `index.html` (Line ~1070)**
```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL';  // Replace this
const SUPABASE_KEY = 'YOUR_ANON_KEY';     // Replace this
```

### Step 5️⃣: Test It! ✅
1. Go to **Admin Panel** → **Animations**
2. Change animation type
3. Click **"Save Changes"**
4. Open your main portfolio in a NEW browser/device
5. Changes should appear automatically! 🎉

---

## How It Works

| Action | Location | Result |
|--------|----------|--------|
| Click "Save Changes" | Admin | Saves to Supabase + localStorage |
| Click "Publish" | Admin | Saves to Supabase + localStorage |
| Page Load | Portfolio | Fetches from Supabase → updates all content |
| No internet | Portfolio | Falls back to localStorage |

---

## Troubleshooting

❌ **Changes not appearing?**
- Check browser console (F12 → Console tab)
- Verify Supabase URL and Key are correct
- Make sure you ran the SQL queries
- Wait 2-3 seconds after clicking Save

❌ **Getting CORS errors?**
- RLS policies are set correctly ✅
- Using public anon key (not secret key) ✅

❌ **Supabase not loading?**
- Check internet connection
- Try refreshing the page
- Check admin panel → Publish worked

---

## What's Next?

✅ All your settings now sync automatically
✅ Works on all devices in real-time
✅ Changes persist permanently

You're all set! 🎊
