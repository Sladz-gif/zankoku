-- ============================================
-- ZANKOKU - Complete Supabase Database Schema
-- ============================================
-- Covers: Authentication, Users, Battles, Clans, Manga, Social Features, Economy

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- AUTHENTICATION & USER MANAGEMENT
-- ============================================

-- Custom user profile linked to Supabase auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  anime_faction TEXT NOT NULL CHECK (anime_faction IN ('naruto', 'jjk', 'bleach', 'onepiece', 'dragonball', 'demonslayer', 'blackclover', 'hxh', 'physical', 'mixed')),
  alignment TEXT NOT NULL CHECK (alignment IN ('hero', 'villain', 'wanderer')),
  rank INTEGER DEFAULT 1000,
  points INTEGER DEFAULT 0,
  role_tag TEXT DEFAULT 'ROOKIE' CHECK (role_tag IN ('ROOKIE', 'BERSERKER', 'STRATEGIST', 'BOUNTY_HUNTER', 'LONE_WOLF', 'PHANTOM', 'GAMBLER', 'WAR_CHIEF', 'GHOST')),
  coward_stars INTEGER DEFAULT 0,
  betrayal_history TEXT[] DEFAULT '{}',
  bounty_active BOOLEAN DEFAULT false,
  bounty_amount INTEGER DEFAULT 0,
  country TEXT,
  country_flag TEXT,
  resource INTEGER DEFAULT 100,
  max_resource INTEGER DEFAULT 100,
  resource_last_refill TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  has_unlimited_resources BOOLEAN DEFAULT false,
  unlimited_type TEXT CHECK (unlimited_type IN ('weekly', 'monthly', 'season')),
  unlimited_expires_at TIMESTAMP WITH TIME ZONE,
  duels_won INTEGER DEFAULT 0,
  duels_lost INTEGER DEFAULT 0,
  shapes_captured INTEGER DEFAULT 0,
  clan_wars INTEGER DEFAULT 0,
  bounties_claimed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_online BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  ban_expires_at TIMESTAMP WITH TIME ZONE
);

-- Currency system
CREATE TABLE public.currency (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  bronze INTEGER DEFAULT 0,
  silver INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- CLAN SYSTEM
-- ============================================

CREATE TABLE public.clans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  tag TEXT UNIQUE NOT NULL,
  alignment TEXT NOT NULL CHECK (alignment IN ('hero', 'villain', 'wanderer')),
  primary_anime TEXT NOT NULL,
  members INTEGER DEFAULT 1,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  motto TEXT,
  description TEXT,
  leader_id UUID REFERENCES public.profiles(id),
  leader_title TEXT DEFAULT 'Leader',
  join_type TEXT DEFAULT 'open' CHECK (join_type IN ('open', 'approval', 'invite')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  disbanded_at TIMESTAMP WITH TIME ZONE
);

-- Add clan_id reference to profiles after clans table is created
ALTER TABLE public.profiles ADD COLUMN clan_id UUID REFERENCES public.clans(id);

CREATE TABLE public.clan_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.clan_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'officer', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reputation INTEGER DEFAULT 0,
  contributions INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clan_id, user_id)
);

CREATE TABLE public.clan_join_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.profiles(id),
  UNIQUE(clan_id, user_id)
);

CREATE TABLE public.clan_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'announcement' CHECK (type IN ('announcement', 'strategy', 'recruitment', 'war_declaration')),
  is_pinned BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BATTLE SYSTEM
-- ============================================

CREATE TABLE public.battles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player1_id UUID REFERENCES public.profiles(id),
  player2_id UUID REFERENCES public.profiles(id),
  creator_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished', 'cancelled')),
  battle_type TEXT DEFAULT 'duel' CHECK (battle_type IN ('duel', 'clan_war', 'tournament')),
  grid_size INTEGER DEFAULT 4,
  duel_type TEXT DEFAULT 'square' CHECK (duel_type IN ('square', 'triangle', 'mixed')),
  stakes TEXT,
  rules TEXT,
  current_turn INTEGER DEFAULT 1,
  current_player_id UUID REFERENCES public.profiles(id),
  winner_id UUID REFERENCES public.profiles(id),
  loser_id UUID REFERENCES public.profiles(id),
  prize_pool INTEGER DEFAULT 0,
  spectators INTEGER DEFAULT 0,
  max_spectators INTEGER DEFAULT 100,
  is_private BOOLEAN DEFAULT false,
  password_hash TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.battle_moves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  battle_id UUID REFERENCES public.battles(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.profiles(id),
  turn_number INTEGER NOT NULL,
  move_type TEXT NOT NULL, -- 'place_shape', 'use_technique', 'forbidden_technique'
  shape_type TEXT, -- 'circle', 'triangle', 'square'
  position_x INTEGER,
  position_y INTEGER,
  technique_name TEXT,
  resource_cost INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.battle_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  battle_id UUID REFERENCES public.battles(id),
  opponent_id UUID REFERENCES public.profiles(id),
  result TEXT CHECK (result IN ('win', 'lose', 'draw')),
  points_gained INTEGER DEFAULT 0,
  points_lost INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  techniques_used TEXT[],
  intensity_level TEXT CHECK (intensity_level IN ('normal', 'heated', 'critical', 'legendary')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TECHNIQUES & ABILITIES
-- ============================================

CREATE TABLE public.techniques (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  anime_faction TEXT NOT NULL,
  technique_type TEXT DEFAULT 'basic' CHECK (technique_type IN ('basic', 'advanced', 'forbidden', 'ultimate')),
  resource_cost INTEGER DEFAULT 10,
  damage_multiplier DECIMAL DEFAULT 1.0,
  cooldown_seconds INTEGER DEFAULT 0,
  requirements TEXT[], -- Required rank, points, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_techniques (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  technique_id UUID REFERENCES public.techniques(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uses_count INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 1 CHECK (mastery_level BETWEEN 1 AND 5),
  UNIQUE(user_id, technique_id)
);

-- ============================================
-- BOUNTY SYSTEM
-- ============================================

CREATE TABLE public.bounties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  target_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  placed_by_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  anonymous BOOLEAN DEFAULT false,
  reason TEXT,
  duration_hours INTEGER DEFAULT 72,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'expired', 'cancelled')),
  claim_requirement TEXT DEFAULT 'any' CHECK (claim_requirement IN ('any', 'duel', 'clan_war', 'specific_technique')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.bounty_hunts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bounty_id UUID REFERENCES public.bounties(id) ON DELETE CASCADE,
  hunter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  battle_id UUID REFERENCES public.battles(id),
  result TEXT CHECK (result IN ('win', 'lose'))
);

CREATE TABLE public.hunter_reputation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_hunts INTEGER DEFAULT 0,
  successful_hunts INTEGER DEFAULT 0,
  failed_hunts INTEGER DEFAULT 0,
  abandoned_hunts INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  hunter_rank TEXT DEFAULT 'ROOKIE' CHECK (hunter_rank IN ('ROOKIE', 'APPRENTICE', 'HUNTER', 'MASTER', 'LEGEND')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SOCIAL FEATURES
-- ============================================

CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'battle_result', 'achievement')),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  reposts INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id), -- For nested replies
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.post_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'love', 'laugh', 'angry', 'sad', 'wow')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

CREATE TABLE public.blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id),
  CHECK(blocker_id != blocked_id)
);

-- ============================================
-- MESSAGING SYSTEM
-- ============================================

CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'duel_challenge', 'clan_invite', 'threat', 'alliance')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  is_deleted_by_sender BOOLEAN DEFAULT false,
  is_deleted_by_receiver BOOLEAN DEFAULT false,
  metadata JSONB, -- For additional message data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.message_threads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_id UUID REFERENCES public.messages(id),
  last_message_at TIMESTAMP WITH TIME ZONE,
  is_deleted_by_p1 BOOLEAN DEFAULT false,
  is_deleted_by_p2 BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant1_id, participant2_id),
  CHECK(participant1_id < participant2_id) -- Ensure consistent ordering
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('duel_challenge', 'bounty_placed', 'like', 'comment', 'followed', 'rank_up', 'role_earned', 'war_declared', 'repost', 'clan_invite', 'message', 'system')),
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- MANGA PLATFORM
-- ============================================

CREATE TABLE public.manga_series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  cover_url TEXT,
  genre TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus', 'cancelled')),
  language TEXT DEFAULT 'en',
  age_rating TEXT DEFAULT 'teen' CHECK (age_rating IN ('all', 'teen', 'mature', 'adult')),
  price_gold INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  total_episodes INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.manga_episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES public.manga_series(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  episode_number INTEGER NOT NULL,
  pages INTEGER DEFAULT 0,
  price_gold INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(series_id, episode_number)
);

CREATE TABLE public.manga_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  episode_id UUID REFERENCES public.manga_episodes(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(episode_id, page_number)
);

CREATE TABLE public.manga_purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  series_id UUID REFERENCES public.manga_series(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.manga_episodes(id) ON DELETE CASCADE,
  price_gold INTEGER NOT NULL,
  purchase_type TEXT CHECK (purchase_type IN ('series', 'episode', 'subscription')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, series_id, episode_id)
);

CREATE TABLE public.user_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  followed_creators UUID[] DEFAULT '{}',
  purchased_series UUID[] DEFAULT '{}',
  bookmarked_episodes UUID[] DEFAULT '{}',
  reading_progress JSONB DEFAULT '{}', -- {series_id: {episode_id: page_number, last_read: timestamp}}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.manga_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES public.manga_series(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.manga_episodes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.manga_comments(id), -- For replies
  content TEXT NOT NULL,
  page_number INTEGER, -- Comment on specific page
  likes INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.manga_reading_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  series_id UUID REFERENCES public.manga_series(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.manga_episodes(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  pages_read INTEGER[] DEFAULT '{}',
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ECONOMY & TRANSACTIONS
-- ============================================

CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'sale', 'refund', 'reward', 'bounty', 'tournament', 'subscription')),
  amount INTEGER NOT NULL,
  currency_type TEXT NOT NULL CHECK (currency_type IN ('bronze', 'silver', 'gold')),
  description TEXT,
  reference_id UUID, -- Link to related record (purchase, bounty, etc.)
  reference_type TEXT,
  payment_method TEXT CHECK (payment_method IN ('card', 'momo', 'wallet', 'system')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('unlimited_weekly', 'unlimited_monthly', 'unlimited_season', 'creator_plus')),
  price_gold INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  auto_renew BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STORE & CONTENT
-- ============================================

CREATE TABLE public.store_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('resource_refill', 'technique_unlock', 'cosmetic', 'boost')),
  price_bronze INTEGER DEFAULT 0,
  price_silver INTEGER DEFAULT 0,
  price_gold INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_limited BOOLEAN DEFAULT false,
  stock_quantity INTEGER,
  image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.store_items(id),
  quantity INTEGER DEFAULT 1,
  total_price INTEGER NOT NULL,
  currency_type TEXT NOT NULL CHECK (currency_type IN ('bronze', 'silver', 'gold')),
  payment_method TEXT CHECK (payment_method IN ('card', 'momo', 'wallet')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS & PROGRESSION
-- ============================================

CREATE TABLE public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT CHECK (category IN ('battle', 'social', 'clan', 'manga', 'economy', 'special')),
  requirement_type TEXT CHECK (requirement_type IN ('count', 'streak', 'rank', 'collection')),
  requirement_value INTEGER NOT NULL,
  reward_bronze INTEGER DEFAULT 0,
  reward_silver INTEGER DEFAULT 0,
  reward_gold INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_secret BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE public.user_statistics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_playtime_seconds INTEGER DEFAULT 0,
  battles_played INTEGER DEFAULT 0,
  battles_won INTEGER DEFAULT 0,
  battles_lost INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0.0,
  highest_rank INTEGER DEFAULT 1000,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  manga_read INTEGER DEFAULT 0,
  manga_created INTEGER DEFAULT 0,
  clan_wars_won INTEGER DEFAULT 0,
  bounties_completed INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TOURNAMENTS & EVENTS
-- ============================================

CREATE TABLE public.tournaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('duel', 'clan', 'manga', 'special')),
  format TEXT CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')),
  max_participants INTEGER,
  entry_fee_gold INTEGER DEFAULT 0,
  prize_pool_gold INTEGER DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  registration_opens_at TIMESTAMP WITH TIME ZONE,
  registration_closes_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'registration', 'in_progress', 'completed', 'cancelled')),
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.tournament_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'eliminated', 'winner', 'withdrawn')),
  UNIQUE(tournament_id, user_id),
  UNIQUE(tournament_id, clan_id)
);

-- ============================================
-- ADMIN & MODERATION
-- ============================================

CREATE TABLE public.moderation_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('ban', 'unban', 'warn', 'delete_content', 'suspend')),
  reason TEXT,
  evidence JSONB,
  duration_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.content_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT CHECK (content_type IN ('post', 'comment', 'message', 'manga', 'profile')),
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users & Profiles
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_anime_faction ON public.profiles(anime_faction);
CREATE INDEX idx_profiles_rank ON public.profiles(rank DESC);
CREATE INDEX idx_profiles_points ON public.profiles(points DESC);
CREATE INDEX idx_profiles_clan_id ON public.profiles(clan_id);
CREATE INDEX idx_profiles_last_seen ON public.profiles(last_seen DESC);
CREATE INDEX idx_profiles_is_online ON public.profiles(is_online) WHERE is_online = true;

-- Battles
CREATE INDEX idx_battles_status ON public.battles(status);
CREATE INDEX idx_battles_created_at ON public.battles(created_at DESC);
CREATE INDEX idx_battles_player1_id ON public.battles(player1_id);
CREATE INDEX idx_battles_player2_id ON public.battles(player2_id);
CREATE INDEX idx_battles_creator_id ON public.battles(creator_id);

-- Social
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_likes ON public.posts(likes DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

-- Manga
CREATE INDEX idx_manga_series_creator_id ON public.manga_series(creator_id);
CREATE INDEX idx_manga_series_genre ON public.manga_series USING GIN(genre);
CREATE INDEX idx_manga_series_views ON public.manga_series(views DESC);
CREATE INDEX idx_manga_series_rating ON public.manga_series(rating DESC);
CREATE INDEX idx_manga_series_is_featured ON public.manga_series(is_featured) WHERE is_featured = true;
CREATE INDEX idx_manga_episodes_series_id ON public.manga_episodes(series_id);
CREATE INDEX idx_manga_episodes_published_at ON public.manga_episodes(published_at DESC);

-- Economy
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_currency_user_id ON public.currency(user_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Messages
CREATE INDEX idx_messages_from_id ON public.messages(from_id);
CREATE INDEX idx_messages_to_id ON public.messages(to_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_message_threads_participant1_id ON public.message_threads(participant1_id);
CREATE INDEX idx_message_threads_participant2_id ON public.message_threads(participant2_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manga_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manga_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles are publicly viewable" ON public.profiles
  FOR SELECT USING (true);

-- Currency policies
CREATE POLICY "Users can view own currency" ON public.currency
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own currency" ON public.currency
  FOR UPDATE USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Posts are publicly viewable" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are publicly viewable" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = from_id OR auth.uid() = to_id);

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = from_id);

CREATE POLICY "Users can update own sent messages" ON public.messages
  FOR UPDATE USING (auth.uid() = from_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Manga policies
CREATE POLICY "Manga series are publicly viewable" ON public.manga_series
  FOR SELECT USING (is_published = true);

CREATE POLICY "Creators can view own manga" ON public.manga_series
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert own manga" ON public.manga_series
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own manga" ON public.manga_series
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own manga" ON public.manga_series
  FOR DELETE USING (auth.uid() = creator_id);

-- Manga episodes policies
CREATE POLICY "Published episodes are publicly viewable" ON public.manga_episodes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.manga_series 
      WHERE id = series_id AND is_published = true
    )
  );

CREATE POLICY "Creators can manage own episodes" ON public.manga_episodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.manga_series 
      WHERE id = series_id AND creator_id = auth.uid()
    )
  );

-- User library policies
CREATE POLICY "Users can view own library" ON public.user_library
  FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Achievements are publicly viewable" ON public.achievements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id);

-- User statistics policies
CREATE POLICY "Users can view own statistics" ON public.user_statistics
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Function to update user statistics
CREATE OR REPLACE FUNCTION public.update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_statistics SET
    total_playtime_seconds = total_playtime_seconds + EXTRACT(EPOCH FROM (NOW() - last_updated)),
    battles_played = battles_played + 1,
    last_updated = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update manga series stats
CREATE OR REPLACE FUNCTION public.update_manga_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.manga_series SET
    views = views + 1,
    updated_at = NOW()
  WHERE id = NEW.series_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.email, 'user_' || substr(NEW.id::text, 1, 8) || '@example.com')
  );
  
  INSERT INTO public.currency (user_id, bronze, silver, gold)
  VALUES (NEW.id, 100, 50, 10);
  
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_library (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.id,
  p.username,
  p.anime_faction,
  p.alignment,
  p.rank,
  p.points,
  p.role_tag,
  p.country_flag,
  p.duels_won,
  p.duels_lost,
  p.bounties_claimed,
  c.gold,
  c.silver,
  c.bronze,
  CASE 
    WHEN p.duels_won + p.duels_lost > 0 
    THEN ROUND((p.duels_won::decimal / (p.duels_won + p.duels_lost)) * 100, 2)
    ELSE 0
  END as win_rate,
  p.last_seen,
  p.is_online
FROM public.profiles p
LEFT JOIN public.currency c ON p.id = c.user_id
WHERE p.is_banned = false
ORDER BY p.points DESC;

-- Active battles view
CREATE OR REPLACE VIEW public.active_battles AS
SELECT 
  b.id,
  b.status,
  b.battle_type,
  b.grid_size,
  b.prize_pool,
  b.spectators,
  b.created_at,
  p1.username as player1_username,
  p1.anime_faction as player1_faction,
  p1.rank as player1_rank,
  p2.username as player2_username,
  p2.anime_faction as player2_faction,
  p2.rank as player2_rank
FROM public.battles b
JOIN public.profiles p1 ON b.player1_id = p1.id
JOIN public.profiles p2 ON b.player2_id = p2.id
WHERE b.status IN ('waiting', 'active')
ORDER BY b.created_at DESC;

-- Popular manga view
CREATE OR REPLACE VIEW public.popular_manga AS
SELECT 
  ms.*,
  p.username as creator_username,
  p.avatar_url as creator_avatar,
  COALESCE(AVG(CAST(rating as decimal)), 0) as avg_rating,
  COUNT(DISTINCT uc.user_id) as reader_count
FROM public.manga_series ms
JOIN public.profiles p ON ms.creator_id = p.id
LEFT JOIN public.manga_purchases uc ON ms.id = uc.series_id
LEFT JOIN public.manga_comments mc ON ms.id = mc.series_id
WHERE ms.is_published = true
GROUP BY ms.id, p.username, p.avatar_url
ORDER BY ms.views DESC, ms.likes DESC;

-- ============================================
-- SAMPLE DATA (Optional - for development)
-- ============================================

-- Insert sample techniques
INSERT INTO public.techniques (name, description, anime_faction, technique_type, resource_cost) VALUES
('Domain Expansion', 'Infinite void technique that traps opponents', 'jjk', 'ultimate', 100),
('Bankai', 'Final release of soul reaper power', 'bleach', 'advanced', 50),
('Rasengan', 'Spinning ball of chakra', 'naruto', 'basic', 20),
('Kamehameha', 'Energy wave attack', 'dragonball', 'advanced', 40),
('Iron Will', 'Physical fighting enhancement', 'physical', 'basic', 15);

-- Insert sample achievements
INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, reward_gold) VALUES
('First Victory', 'Win your first battle', 'battle', 'count', 1, 10),
('Bounty Hunter', 'Claim your first bounty', 'battle', 'count', 1, 25),
('Manga Creator', 'Publish your first manga series', 'manga', 'count', 1, 50),
('Social Butterfly', 'Get 100 followers', 'social', 'count', 100, 30),
('Clan Leader', 'Create a successful clan', 'clan', 'count', 1, 100);

-- ============================================
-- FINAL SETUP
-- ============================================

-- Create admin user (you'll need to set this up manually through Supabase dashboard)
-- This would be done after the first user signs up

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
