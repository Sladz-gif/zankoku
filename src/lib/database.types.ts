export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          email: string
          bio: string | null
          avatar_url: string | null
          anime_faction: 'naruto' | 'jjk' | 'bleach' | 'onepiece' | 'dragonball' | 'demonslayer' | 'blackclover' | 'hxh' | 'physical' | 'mixed'
          alignment: 'hero' | 'villain' | 'wanderer'
          rank: number
          points: number
          role_tag: 'ROOKIE' | 'BERSERKER' | 'STRATEGIST' | 'BOUNTY_HUNTER' | 'LONE_WOLF' | 'PHANTOM' | 'GAMBLER' | 'WAR_CHIEF' | 'GHOST'
          coward_stars: number
          betrayal_history: string[]
          bounty_active: boolean
          bounty_amount: number
          country: string | null
          country_flag: string | null
          resource: number
          max_resource: number
          resource_last_refill: string
          has_unlimited_resources: boolean
          unlimited_type: 'weekly' | 'monthly' | 'season' | null
          unlimited_expires_at: string | null
          duels_won: number
          duels_lost: number
          shapes_captured: number
          clan_wars: number
          bounties_claimed: number
          clan_id: string | null
          created_at: string
          updated_at: string
          last_seen: string
          is_online: boolean
          is_banned: boolean
          ban_reason: string | null
          ban_expires_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at' | 'last_seen'>
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      currency: {
        Row: {
          id: string
          user_id: string
          bronze: number
          silver: number
          gold: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['currency']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['currency']['Row']>
      }
      clans: {
        Row: {
          id: string
          name: string
          tag: string
          alignment: 'hero' | 'villain' | 'wanderer'
          primary_anime: string
          members: number
          wins: number
          losses: number
          motto: string | null
          description: string | null
          leader_id: string | null
          leader_title: string
          join_type: 'open' | 'approval' | 'invite'
          created_at: string
          updated_at: string
          is_active: boolean
          disbanded_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['clans']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clans']['Row']>
      }
      clan_members: {
        Row: {
          id: string
          clan_id: string
          user_id: string
          role: 'leader' | 'officer' | 'member'
          joined_at: string
          reputation: number
          contributions: number
          last_active: string
        }
        Insert: Omit<Database['public']['Tables']['clan_members']['Row'], 'id' | 'joined_at' | 'last_active'>
        Update: Partial<Database['public']['Tables']['clan_members']['Row']>
      }
      battles: {
        Row: {
          id: string
          player1_id: string | null
          player2_id: string | null
          creator_id: string | null
          status: 'waiting' | 'active' | 'finished' | 'cancelled'
          battle_type: 'duel' | 'clan_war' | 'tournament'
          grid_size: number
          duel_type: 'square' | 'triangle' | 'mixed'
          stakes: string | null
          rules: string | null
          current_turn: number
          current_player_id: string | null
          winner_id: string | null
          loser_id: string | null
          prize_pool: number
          spectators: number
          max_spectators: number
          is_private: boolean
          password_hash: string | null
          started_at: string | null
          finished_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['battles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['battles']['Row']>
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          type: 'text' | 'image' | 'battle_result' | 'achievement'
          upvotes: number
          downvotes: number
          likes: number
          reposts: number
          shares: number
          bookmarks: number
          views: number
          is_pinned: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['posts']['Row']>
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          parent_id: string | null
          content: string
          likes: number
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['comments']['Row']>
      }
      messages: {
        Row: {
          id: string
          from_id: string
          to_id: string
          content: string
          type: 'text' | 'duel_challenge' | 'clan_invite' | 'threat' | 'alliance'
          status: 'sent' | 'delivered' | 'read' | 'failed'
          is_deleted_by_sender: boolean
          is_deleted_by_receiver: boolean
          metadata: Json | null
          created_at: string
          read_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Row']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'duel_challenge' | 'bounty_placed' | 'like' | 'comment' | 'followed' | 'rank_up' | 'role_earned' | 'war_declared' | 'repost' | 'clan_invite' | 'message' | 'system'
          from_user_id: string | null
          title: string
          content: string
          link: string | null
          is_read: boolean
          metadata: Json | null
          created_at: string
          read_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
      manga_series: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          author: string
          cover_url: string | null
          genre: string[]
          tags: string[]
          status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
          language: string
          age_rating: 'all' | 'teen' | 'mature' | 'adult'
          price_gold: number
          is_free: boolean
          total_episodes: number
          total_pages: number
          views: number
          likes: number
          bookmarks: number
          rating: number
          rating_count: number
          is_published: boolean
          is_featured: boolean
          featured_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['manga_series']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['manga_series']['Row']>
      }
      manga_episodes: {
        Row: {
          id: string
          series_id: string
          title: string
          description: string | null
          episode_number: number
          pages: number
          price_gold: number
          is_free: boolean
          views: number
          likes: number
          comments_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['manga_episodes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['manga_episodes']['Row']>
      }
      manga_pages: {
        Row: {
          id: string
          episode_id: string
          page_number: number
          image_url: string
          width: number | null
          height: number | null
          file_size: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['manga_pages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['manga_pages']['Row']>
      }
      manga_purchases: {
        Row: {
          id: string
          user_id: string
          series_id: string
          episode_id: string
          price_gold: number
          purchase_type: 'series' | 'episode' | 'subscription'
          transaction_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['manga_purchases']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['manga_purchases']['Row']>
      }
      user_library: {
        Row: {
          id: string
          user_id: string
          followed_creators: string[]
          purchased_series: string[]
          bookmarked_episodes: string[]
          reading_progress: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_library']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_library']['Row']>
      }
      manga_comments: {
        Row: {
          id: string
          series_id: string
          episode_id: string | null
          user_id: string
          parent_id: string | null
          content: string
          page_number: number | null
          likes: number
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['manga_comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['manga_comments']['Row']>
      }
      manga_reading_sessions: {
        Row: {
          id: string
          user_id: string
          series_id: string
          episode_id: string
          session_id: string
          start_time: string
          end_time: string | null
          pages_read: number[]
          duration_seconds: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['manga_reading_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['manga_reading_sessions']['Row']>
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'purchase' | 'sale' | 'refund' | 'reward' | 'bounty' | 'tournament' | 'subscription'
          amount: number
          currency_type: 'bronze' | 'silver' | 'gold'
          description: string | null
          reference_id: string | null
          reference_type: string | null
          payment_method: 'card' | 'momo' | 'wallet' | 'system' | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Row']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          type: 'unlimited_weekly' | 'unlimited_monthly' | 'unlimited_season' | 'creator_plus'
          price_gold: number
          duration_days: number
          starts_at: string
          expires_at: string
          is_active: boolean
          auto_renew: boolean
          cancelled_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['subscriptions']['Row']>
      }
      store_items: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'resource_refill' | 'technique_unlock' | 'cosmetic' | 'boost'
          price_bronze: number
          price_silver: number
          price_gold: number
          is_active: boolean
          is_limited: boolean
          stock_quantity: number | null
          image_url: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['store_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['store_items']['Row']>
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          item_id: string | null
          quantity: number
          total_price: number
          currency_type: 'bronze' | 'silver' | 'gold'
          payment_method: 'card' | 'momo' | 'wallet' | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['purchases']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['purchases']['Row']>
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          category: 'battle' | 'social' | 'clan' | 'manga' | 'economy' | 'special'
          requirement_type: 'count' | 'streak' | 'rank' | 'collection'
          requirement_value: number
          reward_bronze: number
          reward_silver: number
          reward_gold: number
          is_active: boolean
          is_secret: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['achievements']['Row']>
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          progress: number
          completed_at: string | null
          reward_claimed: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_achievements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_achievements']['Row']>
      }
      user_statistics: {
        Row: {
          id: string
          user_id: string
          total_playtime_seconds: number
          battles_played: number
          battles_won: number
          battles_lost: number
          win_rate: number
          highest_rank: number
          current_streak: number
          best_streak: number
          total_earned: number
          total_spent: number
          manga_read: number
          manga_created: number
          clan_wars_won: number
          bounties_completed: number
          last_updated: string
        }
        Insert: Omit<Database['public']['Tables']['user_statistics']['Row'], 'id' | 'last_updated'>
        Update: Partial<Database['public']['Tables']['user_statistics']['Row']>
      }
      bounties: {
        Row: {
          id: string
          target_id: string
          placed_by_id: string
          amount: number
          anonymous: boolean
          reason: string | null
          duration_hours: number
          expires_at: string
          status: 'active' | 'claimed' | 'expired' | 'cancelled'
          claim_requirement: 'any' | 'duel' | 'clan_war' | 'specific_technique'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bounties']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bounties']['Row']>
      }
      techniques: {
        Row: {
          id: string
          name: string
          description: string | null
          anime_faction: string
          technique_type: 'basic' | 'advanced' | 'forbidden' | 'ultimate'
          resource_cost: number
          damage_multiplier: number
          cooldown_seconds: number
          requirements: string[]
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['techniques']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['techniques']['Row']>
      }
      user_techniques: {
        Row: {
          id: string
          user_id: string
          technique_id: string
          unlocked_at: string
          uses_count: number
          mastery_level: number
        }
        Insert: Omit<Database['public']['Tables']['user_techniques']['Row'], 'id' | 'unlocked_at'>
        Update: Partial<Database['public']['Tables']['user_techniques']['Row']>
      }
      tournaments: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'duel' | 'clan' | 'manga' | 'special'
          format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss'
          max_participants: number | null
          entry_fee_gold: number
          prize_pool_gold: number
          starts_at: string | null
          ends_at: string | null
          registration_opens_at: string | null
          registration_closes_at: string | null
          status: 'upcoming' | 'registration' | 'in_progress' | 'completed' | 'cancelled'
          rules: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tournaments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tournaments']['Row']>
      }
      clan_join_requests: {
        Row: {
          id: string
          clan_id: string
          user_id: string
          message: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
          reviewed_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['clan_join_requests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clan_join_requests']['Row']>
      }
      clan_posts: {
        Row: {
          id: string
          clan_id: string
          user_id: string
          title: string | null
          content: string
          type: 'announcement' | 'strategy' | 'recruitment' | 'war_declaration'
          is_pinned: boolean
          upvotes: number
          downvotes: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clan_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clan_posts']['Row']>
      }
      clan_rules: {
        Row: {
          id: string
          clan_id: string
          title: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['clan_rules']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clan_rules']['Row']>
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['follows']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['follows']['Row']>
      }
      blocks: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          reason: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blocks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['blocks']['Row']>
      }
      post_reactions: {
        Row: {
          id: string
          post_id: string
          user_id: string
          reaction_type: 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'wow'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['post_reactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['post_reactions']['Row']>
      }
      message_threads: {
        Row: {
          id: string
          participant1_id: string
          participant2_id: string
          last_message_id: string | null
          last_message_at: string | null
          is_deleted_by_p1: boolean
          is_deleted_by_p2: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['message_threads']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['message_threads']['Row']>
      }
      battle_moves: {
        Row: {
          id: string
          battle_id: string
          player_id: string
          turn_number: number
          move_type: string
          shape_type: string | null
          position_x: number | null
          position_y: number | null
          technique_name: string | null
          resource_cost: number
          timestamp: string
        }
        Insert: Omit<Database['public']['Tables']['battle_moves']['Row'], 'id' | 'timestamp'>
        Update: Partial<Database['public']['Tables']['battle_moves']['Row']>
      }
      battle_history: {
        Row: {
          id: string
          user_id: string
          battle_id: string
          opponent_id: string
          result: 'win' | 'lose' | 'draw'
          points_gained: number
          points_lost: number
          duration_seconds: number | null
          techniques_used: string[]
          intensity_level: 'normal' | 'heated' | 'critical' | 'legendary'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['battle_history']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['battle_history']['Row']>
      }
      bounty_hunts: {
        Row: {
          id: string
          bounty_id: string
          hunter_id: string
          status: 'active' | 'completed' | 'abandoned' | 'failed'
          started_at: string
          completed_at: string | null
          battle_id: string | null
          result: 'win' | 'lose' | null
        }
        Insert: Omit<Database['public']['Tables']['bounty_hunts']['Row'], 'id' | 'started_at'>
        Update: Partial<Database['public']['Tables']['bounty_hunts']['Row']>
      }
      hunter_reputation: {
        Row: {
          id: string
          user_id: string
          total_hunts: number
          successful_hunts: number
          failed_hunts: number
          abandoned_hunts: number
          total_earned: number
          reputation_score: number
          hunter_rank: 'ROOKIE' | 'APPRENTICE' | 'HUNTER' | 'MASTER' | 'LEGEND'
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['hunter_reputation']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['hunter_reputation']['Row']>
      }
      tournament_participants: {
        Row: {
          id: string
          tournament_id: string
          user_id: string | null
          clan_id: string | null
          registered_at: string
          status: 'registered' | 'eliminated' | 'winner' | 'withdrawn'
        }
        Insert: Omit<Database['public']['Tables']['tournament_participants']['Row'], 'id' | 'registered_at'>
        Update: Partial<Database['public']['Tables']['tournament_participants']['Row']>
      }
      moderation_logs: {
        Row: {
          id: string
          moderator_id: string
          target_user_id: string
          action: 'ban' | 'unban' | 'warn' | 'delete_content' | 'suspend'
          reason: string | null
          evidence: Json | null
          duration_hours: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['moderation_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['moderation_logs']['Row']>
      }
      content_reports: {
        Row: {
          id: string
          reporter_id: string
          content_type: 'post' | 'comment' | 'message' | 'manga' | 'profile'
          content_id: string
          reason: string
          description: string | null
          status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['content_reports']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['content_reports']['Row']>
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string
          username: string
          anime_faction: 'naruto' | 'jjk' | 'bleach' | 'onepiece' | 'dragonball' | 'demonslayer' | 'blackclover' | 'hxh' | 'physical' | 'mixed'
          alignment: 'hero' | 'villain' | 'wanderer'
          rank: number
          points: number
          role_tag: 'ROOKIE' | 'BERSERKER' | 'STRATEGIST' | 'BOUNTY_HUNTER' | 'LONE_WOLF' | 'PHANTOM' | 'GAMBLER' | 'WAR_CHIEF' | 'GHOST'
          country_flag: string | null
          duels_won: number
          duels_lost: number
          bounties_claimed: number
          gold: number | null
          silver: number | null
          bronze: number | null
          win_rate: number
          last_seen: string
          is_online: boolean
        }
      }
      active_battles: {
        Row: {
          id: string
          status: 'waiting' | 'active' | 'finished' | 'cancelled'
          battle_type: 'duel' | 'clan_war' | 'tournament'
          grid_size: number
          prize_pool: number
          spectators: number
          created_at: string
          player1_username: string | null
          player1_faction: 'naruto' | 'jjk' | 'bleach' | 'onepiece' | 'dragonball' | 'demonslayer' | 'blackclover' | 'hxh' | 'physical' | 'mixed' | null
          player1_rank: number | null
          player2_username: string | null
          player2_faction: 'naruto' | 'jjk' | 'bleach' | 'onepiece' | 'dragonball' | 'demonslayer' | 'blackclover' | 'hxh' | 'physical' | 'mixed' | null
          player2_rank: number | null
        }
      }
      popular_manga: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          author: string
          cover_url: string | null
          genre: string[]
          tags: string[]
          status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
          language: string
          age_rating: 'all' | 'teen' | 'mature' | 'adult'
          price_gold: number
          is_free: boolean
          total_episodes: number
          total_pages: number
          views: number
          likes: number
          bookmarks: number
          rating: number
          rating_count: number
          is_published: boolean
          is_featured: boolean
          featured_until: string | null
          created_at: string
          updated_at: string
          creator_username: string | null
          creator_avatar: string | null
          avg_rating: number
          reader_count: number
        }
      }
    }
    Functions: {
      update_user_statistics: () => void
      update_manga_stats: () => void
      handle_new_user: () => void
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
