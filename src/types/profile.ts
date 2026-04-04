// Profile system type definitions

export type TierLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'legend';
export type AchievementCategory = 'combat' | 'social' | 'exploration' | 'creation' | 'special';
export type TechniqueStatus = 'owned' | 'locked' | 'exclusive';

export interface UserStatistics {
  userId: number;
  duelsWon: number;
  duelsLost: number;
  winRate: number;
  shapesCaptured: number;
  clanWars: number;
  bountiesClaimed: number;
  bountiesPlaced: number;
  powerScore: number;
  clanContribution: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActive: number;
}

export interface ReputationData {
  userId: number;
  cowardStars: number;
  betrayalHistory: string[];
  honorScore: number;
  trustRating: number;
  communityStanding: 'excellent' | 'good' | 'neutral' | 'poor' | 'notorious';
  warnings: number;
  commendations: number;
}

export interface TierProgress {
  currentTier: TierLevel;
  currentPoints: number;
  nextTierPoints: number;
  progressPercentage: number;
  tierBenefits: string[];
  nextTierBenefits: string[];
  promotionStatus: 'safe' | 'at-risk' | 'promotion-ready';
  demotionRisk: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: number;
  reward: {
    points?: number;
    currency?: { silver?: number; gold?: number };
    title?: string;
  };
}

export interface BattleHistoryEntry {
  id: string;
  timestamp: number;
  opponent: {
    id: number;
    username: string;
    faction: string;
  };
  result: 'win' | 'loss' | 'draw';
  pointsGained: number;
  pointsLost: number;
  shapesCaptured: number;
  duration: number;
  techniques: string[];
  mvpTechnique?: string;
}

export interface PerformanceTrend {
  period: 'daily' | 'weekly' | 'monthly';
  winRate: number;
  averagePoints: number;
  totalBattles: number;
  trend: 'improving' | 'stable' | 'declining';
  trendPercentage: number;
}

export interface TechniqueData {
  name: string;
  description: string;
  cost: number;
  status: TechniqueStatus;
  faction: string;
  tier: number;
  unlockRequirement?: {
    rank?: number;
    points?: number;
    achievement?: string;
  };
  usageCount: number;
  successRate: number;
  lastUsed?: number;
}

export interface ClanMembershipData {
  clanId: number;
  clanName: string;
  role: 'leader' | 'officer' | 'member';
  joinedAt: number;
  contribution: {
    wars: number;
    resources: number;
    posts: number;
    reputation: number;
  };
  permissions: {
    invite: boolean;
    kick: boolean;
    manageResources: boolean;
    declareWar: boolean;
    editSettings: boolean;
  };
}

export interface MangaCreationData {
  seriesId: number;
  title: string;
  status: 'draft' | 'published' | 'paused';
  totalEpisodes: number;
  totalViews: number;
  totalRevenue: number;
  averageRating: number;
  totalComments: number;
  followers: number;
  lastUpdated: number;
  analytics: {
    viewsThisWeek: number;
    revenueThisWeek: number;
    newFollowers: number;
    engagementRate: number;
  };
}

export interface ProfileSettings {
  userId: number;
  visibility: 'public' | 'friends' | 'private';
  showStats: boolean;
  showBattleHistory: boolean;
  showClan: boolean;
  allowMessages: boolean;
  allowFriendRequests: boolean;
  notificationPreferences: {
    battles: boolean;
    clan: boolean;
    social: boolean;
    manga: boolean;
  };
}

export interface RankChange {
  timestamp: number;
  oldRank: number;
  newRank: number;
  change: number;
  reason: 'battle-win' | 'battle-loss' | 'clan-war' | 'achievement' | 'decay';
}

export interface PointsHistory {
  timestamp: number;
  points: number;
  change: number;
  source: 'battle' | 'clan-war' | 'bounty' | 'achievement' | 'daily-bonus';
  description: string;
}

export interface DerivedMetrics {
  winRate: number;
  averagePointsPerBattle: number;
  shapesPerBattle: number;
  battleEfficiency: number;
  clanActivityScore: number;
  overallPowerScore: number;
  rankingVelocity: number; // How fast rank is changing
  consistencyScore: number;
}

export interface PromotionAlert {
  type: 'promotion' | 'demotion' | 'warning';
  tier: TierLevel;
  message: string;
  pointsNeeded?: number;
  timeframe?: string;
  recommendations: string[];
}

export interface TierBenefit {
  tier: TierLevel;
  benefits: string[];
  unlocks: {
    techniques?: string[];
    features?: string[];
    rewards?: string[];
  };
  requirements: {
    minPoints: number;
    minWinRate?: number;
    minBattles?: number;
  };
}

export const TIER_THRESHOLDS: Record<TierLevel, number> = {
  bronze: 0,
  silver: 1000,
  gold: 2500,
  platinum: 5000,
  diamond: 10000,
  master: 20000,
  grandmaster: 40000,
  legend: 100000
};

export const TIER_COLORS: Record<TierLevel, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
  master: '#8B00FF',
  grandmaster: '#FF00FF',
  legend: '#FF6B00'
};

export const TIER_BENEFITS: Record<TierLevel, TierBenefit> = {
  bronze: {
    tier: 'bronze',
    benefits: ['Access to basic techniques', 'Standard matchmaking'],
    unlocks: { techniques: [], features: ['Basic Profile'], rewards: [] },
    requirements: { minPoints: 0 }
  },
  silver: {
    tier: 'silver',
    benefits: ['Unlock advanced techniques', 'Priority matchmaking', '+10% XP bonus'],
    unlocks: { techniques: ['Advanced Strike'], features: ['Custom Avatar'], rewards: ['Silver Badge'] },
    requirements: { minPoints: 1000, minWinRate: 0.4 }
  },
  gold: {
    tier: 'gold',
    benefits: ['Unlock elite techniques', 'VIP matchmaking', '+25% XP bonus', 'Clan creation'],
    unlocks: { techniques: ['Elite Combo', 'Power Surge'], features: ['Custom Banner', 'Clan Creation'], rewards: ['Gold Badge'] },
    requirements: { minPoints: 2500, minWinRate: 0.5, minBattles: 50 }
  },
  platinum: {
    tier: 'platinum',
    benefits: ['Unlock master techniques', 'Tournament access', '+50% XP bonus', 'Custom title'],
    unlocks: { techniques: ['Master Strike', 'Ultimate Defense'], features: ['Custom Title', 'Tournament Entry'], rewards: ['Platinum Badge'] },
    requirements: { minPoints: 5000, minWinRate: 0.55, minBattles: 100 }
  },
  diamond: {
    tier: 'diamond',
    benefits: ['Unlock legendary techniques', 'Ranked tournaments', '+75% XP bonus', 'Exclusive cosmetics'],
    unlocks: { techniques: ['Legendary Assault', 'Diamond Shield'], features: ['Exclusive Skins', 'Ranked Play'], rewards: ['Diamond Badge'] },
    requirements: { minPoints: 10000, minWinRate: 0.6, minBattles: 200 }
  },
  master: {
    tier: 'master',
    benefits: ['Unlock forbidden techniques', 'Pro tournaments', '+100% XP bonus', 'Mentor status'],
    unlocks: { techniques: ['Forbidden Art', 'Master Domain'], features: ['Mentor Badge', 'Pro Tournaments'], rewards: ['Master Badge'] },
    requirements: { minPoints: 20000, minWinRate: 0.65, minBattles: 500 }
  },
  grandmaster: {
    tier: 'grandmaster',
    benefits: ['Unlock ultimate techniques', 'Championship access', '+150% XP bonus', 'Hall of Fame'],
    unlocks: { techniques: ['Ultimate Technique', 'Grandmaster Seal'], features: ['Hall of Fame Entry', 'Championships'], rewards: ['Grandmaster Badge'] },
    requirements: { minPoints: 40000, minWinRate: 0.7, minBattles: 1000 }
  },
  legend: {
    tier: 'legend',
    benefits: ['All techniques unlocked', 'Legend tournaments', '+200% XP bonus', 'Immortalized'],
    unlocks: { techniques: ['All Techniques'], features: ['Legend Status', 'Immortal Badge'], rewards: ['Legend Badge', 'Eternal Glory'] },
    requirements: { minPoints: 100000, minWinRate: 0.75, minBattles: 2000 }
  }
};
