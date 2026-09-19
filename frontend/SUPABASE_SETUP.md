# Supabase Setup Instructions

## 1. Get Your Supabase Credentials

After creating your Supabase project and running the SQL queries:

1. Go to **Settings → API**
2. Copy your:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (looks like: `eyJhbGc...`)

## 2. Update Your Credentials

### In `admin/admin.js` (Line 165-166):
```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL'; // Replace with your URL
const SUPABASE_KEY = 'YOUR_ANON_KEY'; // Replace with your key
```

### In `index.html` (Line 1050-1051 approximately):
```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
```

## 3. Add Supabase Library

Both files need the Supabase JS library. Add this to the `<head>` section if not already there:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js/dist/umd/index.min.js"></script>
```

## 4. How It Works

- **Admin Panel**: When you click "Save Changes" or "Publish", data is saved to Supabase
- **Main Website**: On page load, fetches latest data from Supabase
- **All Devices**: Changes sync automatically when anyone visits the site

## 5. Test It

1. Update your Supabase credentials in both files
2. Go to admin panel → change an animation → click "Save Changes"
3. Open portfolio in another device/browser
4. Changes should appear automatically!

## Troubleshooting

If data doesn't sync:
- Check browser console (F12) for errors
- Verify your Supabase URL and key are correct
- Make sure SQL tables were created
- Check Supabase RLS policies allow public access
