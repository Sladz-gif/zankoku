-- ============================================
-- ENABLE SUPABASE REALTIME FOR ZANKOKU
-- ============================================

-- Enable Realtime for all tables
-- This allows live updates without page refresh

-- Drop existing publications if they exist
DROP PUBLICATION IF EXISTS profiles;
DROP PUBLICATION IF EXISTS posts;
DROP PUBLICATION IF EXISTS clans;
DROP PUBLICATION IF EXISTS clan_members;
DROP PUBLICATION IF EXISTS clan_posts;
DROP PUBLICATION IF EXISTS bounties;
DROP PUBLICATION IF EXISTS comments;
DROP PUBLICATION IF EXISTS currency;
DROP PUBLICATION IF EXISTS messages;
DROP PUBLICATION IF EXISTS notifications;

-- Create publications for realtime
CREATE PUBLICATION profiles FOR TABLE profiles;
CREATE PUBLICATION posts FOR TABLE posts;
CREATE PUBLICATION clans FOR TABLE clans;
CREATE PUBLICATION clan_members FOR TABLE clan_members;
CREATE PUBLICATION clan_posts FOR TABLE clan_posts;
CREATE PUBLICATION bounties FOR TABLE bounties;
CREATE PUBLICATION comments FOR TABLE comments;
CREATE PUBLICATION currency FOR TABLE currency;
CREATE PUBLICATION messages FOR TABLE messages;
CREATE PUBLICATION notifications FOR TABLE notifications;

-- Add Row Level Security (RLS) policies for realtime access

-- Profiles RLS policy for realtime
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Posts RLS policy for realtime
CREATE POLICY "Users can view all posts" ON public.posts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Clans RLS policy for realtime  
CREATE POLICY "Users can view all clans" ON public.clans
    FOR SELECT USING (auth.role() = 'authenticated');

-- Comments RLS policy for realtime
CREATE POLICY "Users can view all comments" ON public.comments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Bounties RLS policy for realtime
CREATE POLICY "Users can view all bounties" ON public.bounties
    FOR SELECT USING (auth.role() = 'authenticated');

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.posts TO authenticated;
GRANT ALL ON public.clans TO authenticated;
GRANT ALL ON public.clan_members TO authenticated;
GRANT ALL ON public.clan_posts TO authenticated;
GRANT ALL ON public.bounties TO authenticated;
GRANT ALL ON public.comments TO authenticated;
GRANT ALL ON public.currency TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.notifications TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clans_wins_members ON public.clans(wins DESC, members DESC);
CREATE INDEX IF NOT EXISTS idx_bounties_amount_created ON public.bounties(amount DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id_created ON public.comments(post_id, created_at DESC);
