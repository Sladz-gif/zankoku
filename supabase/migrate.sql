-- ============================================
-- ZANKOKU - Supabase Migration Script
-- ============================================
-- Run this after schema.sql to populate initial data

-- ============================================
-- INSERT SAMPLE TECHNIQUES
-- ============================================

INSERT INTO public.techniques (name, description, anime_faction, technique_type, resource_cost, damage_multiplier, cooldown_seconds, requirements, is_active) VALUES
-- Naruto Techniques
('Rasengan', 'Spinning ball of chakra that creates devastating impact', 'naruto', 'basic', 20, 1.5, 5, ARRAY['rank: 500', 'faction: naruto'], true),
('Shadow Clone Jutsu', 'Create multiple clones of yourself', 'naruto', 'basic', 15, 1.0, 3, ARRAY['rank: 300', 'faction: naruto'], true),
('Chidori', 'Lightning-based piercing attack', 'naruto', 'advanced', 35, 2.0, 8, ARRAY['rank: 800', 'faction: naruto'], true),
('Susanoo', 'Massive avatar manifestation for ultimate defense', 'naruto', 'ultimate', 100, 3.0, 30, ARRAY['rank: 2000', 'faction: naruto'], true),

-- JJK Techniques
('Domain Expansion', 'Infinite void that traps opponents', 'jjk', 'ultimate', 80, 2.5, 25, ARRAY['rank: 1500', 'faction: jjk'], true),
('Cleave', 'Slash that adjusts to opponent toughness', 'jjk', 'basic', 25, 1.8, 6, ARRAY['rank: 600', 'faction: jjk'], true),
('Dismantle', 'Long-range slash attack', 'jjk', 'advanced', 30, 1.6, 7, ARRAY['rank: 700', 'faction: jjk'], true),
('Hollow Technique', 'Purple energy attack with maximum power', 'jjk', 'forbidden', 60, 2.8, 20, ARRAY['rank: 1200', 'faction: jjk'], true),

-- Bleach Techniques
('Bankai', 'Final release of soul reaper power', 'bleach', 'advanced', 40, 2.2, 15, ARRAY['rank: 900', 'faction: bleach'], true),
('Getsuga Tensho', 'Crescent moon energy blast', 'bleach', 'basic', 22, 1.7, 5, ARRAY['rank: 550', 'faction: bleach'], true),
('Senbonzakura', 'Thousand cherry blossom blades', 'bleach', 'advanced', 38, 2.0, 12, ARRAY['rank: 850', 'faction: bleach'], true),

-- One Piece Techniques
('Gomu Gomu no Pistol', 'Rubber punch attack', 'onepiece', 'basic', 18, 1.4, 4, ARRAY['rank: 400', 'faction: onepiece'], true),
('Gear Second', 'Enhanced speed and power mode', 'onepiece', 'advanced', 45, 2.3, 18, ARRAY['rank: 1000', 'faction: onepiece'], true),
('Haki', 'Spiritual energy for enhanced attacks', 'onepiece', 'basic', 28, 1.9, 8, ARRAY['rank: 650', 'faction: onepiece'], true),

-- Dragon Ball Techniques
('Kamehameha', 'Powerful energy wave attack', 'dragonball', 'advanced', 32, 2.1, 10, ARRAY['rank: 750', 'faction: dragonball'], true),
('Spirit Bomb', 'Energy gathered from all living things', 'dragonball', 'ultimate', 90, 3.5, 35, ARRAY['rank: 1800', 'faction: dragonball'], true),
('Instant Transmission', 'Instant teleportation technique', 'dragonball', 'basic', 12, 1.0, 2, ARRAY['rank: 250', 'faction: dragonball'], true),

-- Demon Slayer Techniques
('Water Breathing', 'Flowing water sword techniques', 'demonslayer', 'basic', 20, 1.5, 5, ARRAY['rank: 500', 'faction: demonslayer'], true),
('Thunder Breathing', 'Lightning-fast sword attacks', 'demonslayer', 'advanced', 42, 2.4, 16, ARRAY['rank: 1100', 'faction: demonslayer'], true),
('Hinokami Kagura', 'Fire god dance technique', 'demonslayer', 'ultimate', 85, 3.2, 28, ARRAY['rank: 1600', 'faction: demonslayer'], true),

-- Black Clover Techniques
('Anti Magic', 'Cancel and deflect magic attacks', 'blackclover', 'basic', 24, 1.6, 6, ARRAY['rank: 580', 'faction: blackclover'], true),
('Demon Light Sword', 'Anti-magic sword transformation', 'blackclover', 'advanced', 48, 2.6, 20, ARRAY['rank: 1200', 'faction: blackclover'], true),

-- HxH Techniques
('Nen', 'Life energy manipulation system', 'hxh', 'basic', 16, 1.3, 3, ARRAY['rank: 350', 'faction: hxh'], true),
('Rock Paper Scissors', 'Versatile attack technique', 'hxh', 'advanced', 36, 2.0, 11, ARRAY['rank: 800', 'faction: hxh'], true),

-- Physical Techniques
('Iron Fist', 'Pure physical strength attack', 'physical', 'basic', 15, 1.2, 2, ARRAY['rank: 200', 'faction: physical'], true),
('Body Enhancement', 'Physical ability boost', 'physical', 'advanced', 35, 1.8, 12, ARRAY['rank: 700', 'faction: physical'], true),

-- Mixed Techniques
('Adaptation', 'Learn and counter opponent techniques', 'mixed', 'advanced', 40, 2.0, 14, ARRAY['rank: 900', 'faction: mixed'], true),
('Fusion Dance', 'Combine power with ally', 'mixed', 'ultimate', 75, 2.9, 22, ARRAY['rank: 1400', 'faction: mixed'], true);

-- ============================================
-- INSERT SAMPLE ACHIEVEMENTS
-- ============================================

INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, reward_bronze, reward_silver, reward_gold, is_active, is_secret) VALUES
-- Battle Achievements
('First Victory', 'Win your first battle', '⚔️', 'battle', 'count', 1, 10, 5, 1, true, false),
('Warrior Spirit', 'Win 10 battles', '🗡️', 'battle', 'count', 10, 50, 25, 5, true, false),
('Battle Master', 'Win 100 battles', '👑', 'battle', 'count', 100, 200, 100, 20, true, false),
('Unstoppable Force', 'Win 10 battles in a row', '🔥', 'battle', 'streak', 10, 100, 50, 10, true, false),
('Perfect Victory', 'Win without taking damage', '🛡️', 'battle', 'count', 1, 75, 35, 7, true, false),

-- Social Achievements
('Social Butterfly', 'Get 100 followers', '🦋', 'social', 'count', 100, 30, 15, 3, true, false),
('Influencer', 'Get 1000 followers', '📱', 'social', 'count', 1000, 150, 75, 15, true, false),
('Content Creator', 'Create 50 posts', '✍️', 'social', 'count', 50, 40, 20, 4, true, false),
('Popular', 'Get a post with 100 likes', '❤️', 'social', 'count', 1, 60, 30, 6, true, false),

-- Clan Achievements
('Clan Founder', 'Create a successful clan', '🏰', 'clan', 'count', 1, 100, 50, 10, true, false),
('Clan Leader', 'Lead a clan to 50 members', '👥', 'clan', 'count', 50, 200, 100, 20, true, false),
('War Commander', 'Win 10 clan wars', '⚔️', 'clan', 'count', 10, 150, 75, 15, true, false),
('Alliance Builder', 'Form alliances with 5 clans', '🤝', 'clan', 'count', 5, 80, 40, 8, true, false),

-- Manga Achievements
('Manga Creator', 'Publish your first manga series', '📚', 'manga', 'count', 1, 50, 25, 5, true, false),
('Prolific Writer', 'Publish 10 manga series', '✍️', 'manga', 'count', 10, 200, 100, 20, true, false),
('Bestseller', 'Get 1000 manga views', '📖', 'manga', 'count', 1000, 100, 50, 10, true, false),
('Fan Favorite', 'Get 100 manga likes', '⭐', 'manga', 'count', 100, 60, 30, 6, true, false),

-- Economy Achievements
('Coin Collector', 'Accumulate 1000 gold coins', '💰', 'economy', 'count', 1000, 25, 12, 2, true, false),
('Fortune Hunter', 'Accumulate 10000 gold coins', '💎', 'economy', 'count', 10000, 150, 75, 15, true, false),
('Smart Investor', 'Make 100 profitable transactions', '📈', 'economy', 'count', 100, 80, 40, 8, true, false),
('Market Master', 'Reach rank 500', '🏆', 'economy', 'rank', 500, 100, 50, 10, true, false),

-- Special Achievements
('Early Adopter', 'Join in the first month', '🌟', 'special', 'count', 1, 500, 250, 50, true, false),
('Bug Hunter', 'Report and help fix a bug', '🐛', 'special', 'count', 1, 75, 35, 7, true, false),
('Community Hero', 'Help 10 new players', '🦸', 'special', 'count', 10, 100, 50, 10, true, false),
('Legendary Status', 'Achieve all other achievements', '🌈', 'special', 'collection', 20, 1000, 500, 100, true, true);

-- ============================================
-- INSERT SAMPLE STORE ITEMS
-- ============================================

INSERT INTO public.store_items (name, description, type, price_bronze, price_silver, price_gold, is_active, metadata) VALUES
-- Resource Refills
('Resource Refill - Small', 'Refill 50 resources', 'resource_refill', 100, 50, 5, true, '{"amount": 50}'),
('Resource Refill - Medium', 'Refill 150 resources', 'resource_refill', 250, 125, 12, true, '{"amount": 150}'),
('Resource Refill - Large', 'Refill 300 resources', 'resource_refill', 500, 250, 25, true, '{"amount": 300}'),
('Resource Refill - Ultimate', 'Refill 500 resources', 'resource_refill', 800, 400, 40, true, '{"amount": 500}'),

-- Technique Unlocks
('Basic Technique Pack', 'Unlock 3 random basic techniques', 'technique_unlock', 0, 200, 20, true, '{"count": 3, "rarity": "basic"}'),
('Advanced Technique Pack', 'Unlock 2 random advanced techniques', 'technique_unlock', 0, 500, 50, true, '{"count": 2, "rarity": "advanced"}'),
('Ultimate Technique Pack', 'Unlock 1 random ultimate technique', 'technique_unlock', 0, 1000, 100, true, '{"count": 1, "rarity": "ultimate"}'),

-- Unlimited Resources
('Unlimited Resources - Week', 'Unlimited resources for 7 days', 'boost', 0, 0, 50, true, '{"duration": 7, "type": "unlimited"}'),
('Unlimited Resources - Month', 'Unlimited resources for 30 days', 'boost', 0, 0, 150, true, '{"duration": 30, "type": "unlimited"}'),
('Unlimited Resources - Season', 'Unlimited resources for 90 days', 'boost', 0, 0, 400, true, '{"duration": 90, "type": "unlimited"}'),

-- Cosmetics
('Avatar Frame - Bronze', 'Bronze avatar frame', 'cosmetic', 500, 0, 0, true, '{"type": "avatar_frame", "tier": "bronze"}'),
('Avatar Frame - Silver', 'Silver avatar frame', 'cosmetic', 0, 1000, 0, true, '{"type": "avatar_frame", "tier": "silver"}'),
('Avatar Frame - Gold', 'Gold avatar frame', 'cosmetic', 0, 0, 200, true, '{"type": "avatar_frame", "tier": "gold"}'),
('Title - Elite Warrior', 'Special title for your profile', 'cosmetic', 0, 0, 100, true, '{"type": "title", "name": "Elite Warrior"}'),
('Title - Battle Master', 'Special title for your profile', 'cosmetic', 0, 0, 250, true, '{"type": "title", "name": "Battle Master"}'),

-- Boosts
('Double Points - 1 Hour', 'Double battle points for 1 hour', 'boost', 200, 100, 10, true, '{"duration": 1, "type": "double_points"}'),
('Double Points - 6 Hours', 'Double battle points for 6 hours', 'boost', 1000, 500, 50, true, '{"duration": 6, "type": "double_points"}'),
('Double Points - 24 Hours', 'Double battle points for 24 hours', 'boost', 3000, 1500, 150, true, '{"duration": 24, "type": "double_points"}'),
('Experience Boost - 1 Hour', '50% more experience for 1 hour', 'boost', 150, 75, 7, true, '{"duration": 1, "type": "exp_boost", "multiplier": 1.5}'),
('Experience Boost - 6 Hours', '50% more experience for 6 hours', 'boost', 750, 375, 37, true, '{"duration": 6, "type": "exp_boost", "multiplier": 1.5}');

-- ============================================
-- CREATE ADMIN FUNCTIONS
-- ============================================

-- Function to grant admin privileges
CREATE OR REPLACE FUNCTION public.grant_admin(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Update user profile with admin flag (add admin_role column if needed)
  -- This is a placeholder - implement based on your admin system
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create sample tournament
CREATE OR REPLACE FUNCTION public.create_sample_tournament()
RETURNS UUID AS $$
DECLARE
  tournament_id UUID;
BEGIN
  INSERT INTO public.tournaments (
    name, 
    description, 
    type, 
    format, 
    max_participants, 
    entry_fee_gold, 
    prize_pool_gold,
    starts_at,
    ends_at,
    registration_opens_at,
    registration_closes_at,
    status
  ) VALUES (
    'Zankoku Championship 2024',
    'Annual tournament to determine the strongest warrior',
    'duel',
    'single_elimination',
    64,
    50,
    3200,
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '14 days',
    NOW(),
    NOW() + INTERVAL '5 days',
    'upcoming'
  ) RETURNING id INTO tournament_id;
  
  RETURN tournament_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CREATE SAMPLE TUTORIAL DATA
-- ============================================

-- Create tutorial clan
INSERT INTO public.clans (
  name, 
  tag, 
  alignment, 
  primary_anime, 
  members, 
  wins, 
  losses, 
  motto, 
  description, 
  leader_title,
  join_type
) VALUES (
  'Tutorial Clan',
  'TUT',
  'hero',
  'mixed',
  1,
  0,
  0,
  'Learning together, growing stronger',
  'A clan for new players to learn the basics and make friends',
  'Sensei',
  'open'
);

-- ============================================
-- PERFORMANCE OPTIMIZATIONS
-- ============================================

-- Create partial indexes for better performance
CREATE INDEX idx_profiles_online_ranked ON public.profiles(is_online, rank DESC) WHERE is_online = true;
CREATE INDEX idx_battles_active_created ON public.battles(status, created_at DESC) WHERE status IN ('waiting', 'active');
CREATE INDEX idx_manga_published_views ON public.manga_series(is_published, views DESC) WHERE is_published = true;
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read, created_at DESC) WHERE is_read = false;

-- Create function to update user statistics
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_statistics SET
    battles_played = battles_played + 1,
    last_updated = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for battle history
CREATE TRIGGER battle_history_stats
  AFTER INSERT ON public.battle_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats();

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- Log completion (for verification)
DO $$
BEGIN
  RAISE NOTICE 'Zankoku database migration completed successfully!';
  RAISE NOTICE 'Inserted % techniques', (SELECT COUNT(*) FROM public.techniques);
  RAISE NOTICE 'Inserted % achievements', (SELECT COUNT(*) FROM public.achievements);
  RAISE NOTICE 'Inserted % store items', (SELECT COUNT(*) FROM public.store_items);
  RAISE NOTICE 'Database is ready for production use!';
END $$;
