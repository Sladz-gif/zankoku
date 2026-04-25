# Vercel Environment Variables Setup

## 🚨 Required Environment Variables

Your deployment is failing because these environment variables are missing in Vercel:

### Supabase Configuration
Add these to your Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://ieqbuwuppvasrlnybjoe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcWJ1d3VwcHZhc3Jsbnliam9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTE4MzIsImV4cCI6MjA5MDcyNzgzMn0.M2gTj0ubvo53ipd2_vWkG1rYNiPiFpv8klJwIKz6ynI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcWJ1d3VwcHZhc3Jsbnliam9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE1MTgzMiwiZXhwIjoyMDkwNzI3ODMyfQ.amv1kdMoFjUN2mM8JxRTw7M9U1mf8abkSzVjZfHcL78
```

## ⚙️ Setup Steps

### 1. Go to Vercel Dashboard
- Visit [vercel.com](https://vercel.com)
- Go to your project
- Navigate to **Settings** → **Environment Variables**

### 2. Add Environment Variables
For each variable:
1. Click **Add New**
2. Enter the **Name** (exact case-sensitive)
3. Enter the **Value** from above
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**

### 3. Redeploy
After adding all variables:
- Go to **Deployments** tab
- Click **Redeploy** on your latest deployment
- Or push a new commit to trigger automatic deployment

## 🔍 What Was Fixed

The error `supabaseUrl is required` occurred because:
- `.env` files are ignored by Vercel (see `.vercelignore`)
- Code used `import.meta.env.VITE_SUPABASE_URL!` which throws error when undefined
- No fallback values were provided

## ✅ Current Status

I've added fallback values to the code, so the app will work even without environment variables, but for production you should still add them to Vercel for proper configuration.

## 🚀 After Setup

Once environment variables are configured:
1. Your app will connect to your Supabase database
2. Authentication will work properly
3. Real-time features will function
4. All database operations will work correctly

## 📱 Testing

After deployment:
1. Visit your app
2. Try signing up/in
3. Check browser console for any remaining errors
4. Test post creation and other features

## 🆘 Troubleshooting

If you still see errors:
1. Verify variable names are **exactly** as shown (case-sensitive)
2. Ensure all environments (Production/Preview/Development) are selected
3. Check Vercel deployment logs for specific error messages
4. Make sure to redeploy after adding variables
