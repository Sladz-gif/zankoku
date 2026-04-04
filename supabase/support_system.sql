-- ============================================
-- ZANKOKU - Support System Migration
-- ============================================
-- Run this after schema.sql to add support donation tracking

-- ============================================
-- SUPPORT DONATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.support_donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
  donation_type VARCHAR(20) DEFAULT 'one_time' CHECK (donation_type IN ('one_time', 'monthly', 'annual')),
  payment_method VARCHAR(50) NOT NULL, -- 'card', 'momo', 'paypal', etc.
  payment_provider VARCHAR(50), -- 'stripe', 'momo_mtn', 'momo_vodafone', etc.
  transaction_id VARCHAR(255) UNIQUE, -- External transaction ID
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  message TEXT, -- Optional supporter message
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- SUPPORT TIER DEFINITIONS
-- ============================================

CREATE TABLE IF NOT EXISTS public.support_tiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  emoji VARCHAR(10),
  min_amount DECIMAL(10,2) NOT NULL,
  max_amount DECIMAL(10,2),
  color VARCHAR(20), -- Theme color for the tier
  benefits TEXT[], -- Array of benefits
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SUPPORTER STATISTICS
-- ============================================

CREATE TABLE IF NOT EXISTS public.supporter_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_donations DECIMAL(10,2) DEFAULT 0,
  donation_count INTEGER DEFAULT 0,
  first_donation_date TIMESTAMP WITH TIME ZONE,
  last_donation_date TIMESTAMP WITH TIME ZONE,
  current_tier UUID REFERENCES public.support_tiers(id),
  is_monthly_supporter BOOLEAN DEFAULT false,
  is_top_supporter BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SUPPORT MILESTONES & ACHIEVEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.support_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  threshold DECIMAL(10,2) NOT NULL, -- Minimum total donation amount
  reward_type VARCHAR(50), -- 'badge', 'title', 'feature', etc.
  reward_data JSONB, -- Reward details
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_support_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.support_milestones(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

-- ============================================
-- INSERT SUPPORT TIERS
-- ============================================

INSERT INTO public.support_tiers (name, display_name, description, emoji, min_amount, max_amount, color, benefits, sort_order) VALUES
('coffee', 'Coffee Supporter', 'Buy us a coffee to keep the developers fueled!', '☕', 5.00, 9.99, 'orange', 
 ARRAY['Special thanks on supporters page', 'Coffee supporter badge'], 1),
('snack', 'Snack Supporter', 'Help us grab a snack during long coding sessions!', '🍕', 10.00, 24.99, 'red',
 ARRAY['All previous benefits', 'Snack supporter badge', 'Priority feature consideration'], 2),
('meal', 'Meal Supporter', 'Treat us to a meal - you''re awesome!', '🍔', 25.00, 49.99, 'yellow',
 ARRAY['All previous benefits', 'Meal supporter badge', 'Discord supporter role', 'Beta access to new features'], 3),
('supporter', 'Elite Supporter', 'Your support makes a huge difference!', '⭐', 50.00, 99.99, 'purple',
 ARRAY['All previous benefits', 'Elite supporter badge', 'Exclusive discord channel', 'Early access to all updates'], 4),
('champion', 'Zankoku Champion', 'You''re a true champion of Zankoku!', '👑', 100.00, NULL, 'pink',
 ARRAY['All previous benefits', 'Champion badge', 'VIP supporter status', 'Direct developer access', 'Custom profile flair'], 5)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- INSERT SUPPORT MILESTONES
-- ============================================

INSERT INTO public.support_milestones (name, description, threshold, reward_type, reward_data, icon) VALUES
('First Support', 'Made your first support donation!', 5.00, 'badge', '{"title": "First Supporter", "color": "#00FF88"}', '🎉'),
('Generous Supporter', 'Donated $50 or more total', 50.00, 'badge', '{"title": "Generous", "color": "#FFD700"}', '💝'),
('Elite Champion', 'Donated $100 or more total', 100.00, 'badge', '{"title": "Elite Champion", "color": "#FF1493"}', '🏆'),
('Monthly Supporter', 'Set up monthly donations', 0.00, 'badge', '{"title": "Monthly Hero", "color": "#00BFFF"}', '🔄'),
('Long-term Supporter', 'Supported for 6+ months', 0.00, 'badge', '{"title": "Loyal", "color": "#9370DB"}', '⏰')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_support_donations_user_id ON public.support_donations(user_id);
CREATE INDEX IF NOT EXISTS idx_support_donations_status ON public.support_donations(status);
CREATE INDEX IF NOT EXISTS idx_support_donations_created_at ON public.support_donations(created_at);
CREATE INDEX IF NOT EXISTS idx_supporter_stats_total_donations ON public.supporter_stats(total_donations DESC);
CREATE INDEX IF NOT EXISTS idx_user_support_milestones_user_id ON public.user_support_milestones(user_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.support_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supporter_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_support_milestones ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Support donations policies
CREATE POLICY "Users can view own donations" ON public.support_donations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own donations" ON public.support_donations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own donations" ON public.support_donations
  FOR UPDATE USING (auth.uid() = user_id);

-- Supporter stats policies
CREATE POLICY "Users can view own stats" ON public.supporter_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.supporter_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- User milestones policies
CREATE POLICY "Users can view own milestones" ON public.user_support_milestones
  FOR SELECT USING (auth.uid() = user_id);

-- Public read policies for support tiers and milestones
CREATE POLICY "Support tiers are publicly viewable" ON public.support_tiers
  FOR SELECT USING (true);

CREATE POLICY "Support milestones are publicly viewable" ON public.support_milestones
  FOR SELECT USING (true);

-- ============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================

-- Update supporter stats when donation is completed
CREATE OR REPLACE FUNCTION public.update_supporter_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total donations and count
  INSERT INTO public.supporter_stats (user_id, total_donations, donation_count, first_donation_date, last_donation_date)
  VALUES (
    NEW.user_id,
    NEW.amount,
    1,
    NEW.created_at,
    NEW.created_at
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_donations = supporter_stats.total_donations + NEW.amount,
    donation_count = supporter_stats.donation_count + 1,
    last_donation_date = NEW.created_at,
    updated_at = NOW();

  -- Update current tier based on total donations
  UPDATE public.supporter_stats 
  SET current_tier = (
    SELECT id 
    FROM public.support_tiers 
    WHERE is_active = true 
    AND (max_amount IS NULL OR total_donations + NEW.amount <= max_amount)
    ORDER BY min_amount DESC 
    LIMIT 1
  ),
  updated_at = NOW()
  WHERE user_id = NEW.user_id;

  -- Check for new milestones
  INSERT INTO public.user_support_milestones (user_id, milestone_id, earned_at)
  SELECT 
    NEW.user_id,
    milestone.id,
    NOW()
  FROM public.support_milestones milestone
  WHERE milestone.is_active = true
  AND (
    (milestone.threshold <= (SELECT COALESCE(total_donations, 0) + NEW.amount FROM public.supporter_stats WHERE user_id = NEW.user_id))
    OR (milestone.name = 'Monthly Supporter' AND NEW.donation_type = 'monthly')
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.user_support_milestones 
    WHERE user_id = NEW.user_id AND milestone_id = milestone.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_support_donation_completed
  AFTER INSERT ON public.support_donations
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION public.update_supporter_stats();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Support leaderboard view
CREATE OR REPLACE VIEW public.support_leaderboard AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  ss.total_donations,
  ss.donation_count,
  ss.current_tier,
  st.display_name as tier_name,
  st.emoji as tier_emoji,
  st.color as tier_color,
  ss.last_donation_date,
  p.created_at as user_joined_date
FROM public.profiles p
JOIN public.supporter_stats ss ON p.id = ss.user_id
LEFT JOIN public.support_tiers st ON ss.current_tier = st.id
WHERE ss.total_donations > 0
ORDER BY ss.total_donations DESC, ss.last_donation_date DESC;

-- Recent donations view
CREATE OR REPLACE VIEW public.recent_donations AS
SELECT 
  sd.id,
  sd.amount,
  sd.currency,
  sd.donation_type,
  sd.status,
  sd.is_anonymous,
  sd.created_at,
  sd.completed_at,
  p.username,
  p.avatar_url,
  CASE 
    WHEN sd.is_anonymous THEN true 
    ELSE false 
  END as hide_identity
FROM public.support_donations sd
JOIN public.profiles p ON sd.user_id = p.id
WHERE sd.status = 'completed'
ORDER BY sd.completed_at DESC;

-- ============================================
-- COMPLETION
-- ============================================

-- Support system migration completed successfully!
-- Tables: support_donations, support_tiers, supporter_stats, support_milestones, user_support_milestones
-- Views: support_leaderboard, recent_donations
-- Triggers: update_supporter_stats
-- RLS: Enabled with appropriate policies
