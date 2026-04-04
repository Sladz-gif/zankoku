# 🚀 Supabase Setup Guide for Zankoku

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Git installed

## 🛠️ Installation Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in/up with GitHub/Google
4. Create new organization (or use existing)
5. Create new project:
   - **Name**: `zankoku`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
   - **Pricing plan**: Free tier is fine for development

### 3. Get Your Supabase Credentials

After project creation, go to **Project Settings** → **API**:

Copy these values:
- **Project URL** (starts with `https://`)
- **anon public** key (starts with `eyJ...`)

### 4. Set Up Environment Variables

Create `.env` file in project root:

```bash
# Copy the template
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 5. Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **"New query"**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click **"Run"** to execute the schema

This will create all tables, indexes, policies, and triggers.

### 6. Set Up Storage Buckets

In Supabase dashboard, go to **Storage**:

Create these buckets:

1. **avatars** - Public bucket for user avatars
2. **manga** - Private bucket for manga content

For each bucket:
- Click **"New bucket"**
- Set bucket name
- Choose **Public** for avatars, **Private** for manga
- Click **"Save"**

### 7. Configure Storage Policies

Go to **Storage** → **Policies** and add these policies:

#### Avatars Bucket (Public)
```sql
-- Allow public access to avatar images
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );
```

#### Manga Bucket (Private)
```sql
-- Only authenticated users can access manga content
CREATE POLICY "Authenticated users can access manga" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'manga' AND 
    auth.role() = 'authenticated'
  );

-- Only manga creators can upload content
CREATE POLICY "Manga creators can upload content" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'manga' AND 
    auth.role() = 'authenticated'
  );
```

### 8. Test the Connection

Start your development server:

```bash
npm run dev
```

Navigate to the app and check the browser console for any Supabase connection errors.

### 9. Create First User Account

1. Navigate to the sign-up page
2. Create an account with email and password
3. Check Supabase dashboard → **Authentication** → **Users**
4. Verify your user appears in the list
5. Check **Database** → **profiles** table - you should see a profile created automatically

## 🔧 Database Schema Overview

### Core Tables

- **profiles** - User profiles linked to auth.users
- **currency** - User currency balances (bronze, silver, gold)
- **battles** - Battle game data
- **clans** - Clan management
- **posts** - Social feed posts
- **messages** - Private messaging
- **manga_series** - Manga publication platform
- **transactions** - Economic transactions

### Security Features

- **Row Level Security (RLS)** enabled on all user data
- **Authentication** handled by Supabase Auth
- **Storage policies** for file access control
- **API rate limiting** built-in

## 🚀 Deployment Considerations

### Production Setup

1. **Enable Row Level Security** - Already enabled in schema
2. **Set up custom domains** - In Supabase project settings
3. **Configure backups** - Enable in Supabase dashboard
4. **Set up monitoring** - Use Supabase logs and metrics

### Environment Variables for Production

```env
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key

# Additional production settings
VITE_IS_PRODUCTION=true
VITE_DEV_MODE=false
```

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your `.env` file has correct values
   - Ensure keys are copied without extra spaces

2. **"No rows returned" for profile**
   - Check if the trigger `handle_new_user` was created
   - Try creating a new user account

3. **Storage upload errors**
   - Verify storage buckets exist
   - Check storage policies are correctly set

4. **RLS policy violations**
   - Ensure user is authenticated
   - Check policy logic in SQL editor

### Debug Tools

- **Supabase Dashboard** - Monitor real-time requests
- **Browser Console** - Check for JavaScript errors
- **Network Tab** - Inspect API requests
- **SQL Editor** - Test database queries directly

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Next Steps

After setup is complete:

1. **Test user registration** flow
2. **Verify data persistence** by refreshing pages
3. **Test file uploads** for avatars and manga
4. **Check real-time features** with multiple browser tabs
5. **Monitor performance** and optimize queries

## 🆘 Support

If you encounter issues:

1. Check Supabase dashboard logs
2. Review browser console errors
3. Verify environment variables
4. Test database schema in SQL editor
5. Consult Supabase documentation

---

**Your Zankoku platform is now connected to Supabase!** 🎉

The complete database schema includes authentication, user management, battles, clans, manga platform, social features, and economy system - all ready for production use.
