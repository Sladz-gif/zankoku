// Bounties system type definitions

export type BountyStatus = 'active' | 'claimed' | 'expired' | 'cancelled';
export type HunterTier = 'novice' | 'apprentice' | 'skilled' | 'expert' | 'master' | 'legendary';
export type BountyDifficulty = 'easy' | 'medium' | 'hard' | 'extreme' | 'impossible';
export type ClaimRequirement = 'single-win' | 'best-of-3' | 'best-of-5' | 'ranked-match';

export interface EnhancedBounty {
  id: number;
  placerId: number;
  targetId: number;
  amount: number;
  reason: string;
  status: BountyStatus;
  difficulty: BountyDifficulty;
  claimRequirement: ClaimRequirement;
  createdAt: number;
  expiresAt: number;
  claimedBy?: number;
  claimedAt?: number;
  platformFee: number;
  escrowAmount: number;
  hunterCount: number; // Number of hunters pursuing
  viewCount: number;
  featured: boolean;
  metadata: {
    targetRank: number;
    targetFaction: string;
    targetWinRate: number;
    minHunterRank?: number;
    maxAttempts?: number;
  };
}

export interface HunterReputation {
  userId: number;
  tier: HunterTier;
  reputation: number;
  totalClaimed: number;
  totalEarned: number;
  successRate: number;
  averageReward: number;
  currentStreak: number;
  longestStreak: number;
  activeBounties: number;
  failedAttempts: number;
  badges: string[];
  rank: number; // Leaderboard rank
  lastClaim?: number;
}

export interface BountyHunt {
  id: string;
  bountyId: number;
  hunterId: number;
  targetId: number;
  status: 'pursuing' | 'completed' | 'failed' | 'abandoned';
  startedAt: number;
  completedAt?: number;
  battlesWon: number;
  battlesLost: number;
  remainingAttempts: number;
  progress: number; // Percentage
  lastBattle?: number;
}

export interface BountyPlacement {
  userId: number;
  activeBounties: number;
  totalPlaced: number;
  totalSpent: number;
  successfulClaims: number;
  expiredBounties: number;
  cancelledBounties: number;
  lastPlacement: number;
  cooldownUntil?: number;
}

export interface BountyRestrictions {
  minRank: number;
  maxActiveBounties: number;
  minReward: number;
  maxReward: number;
  minDuration: number; // milliseconds
  maxDuration: number;
  cooldownPeriod: number;
  platformFeePercentage: number;
  canTargetSelf: boolean;
  canTargetClanmates: boolean;
}

export interface AntiAbuseDetection {
  userId: number;
  suspiciousActivity: boolean;
  flags: {
    collusion: boolean;
    winTrading: boolean;
    multiAccount: boolean;
    rapidPlacement: boolean;
    selfTargeting: boolean;
  };
  violations: number;
  lastViolation?: number;
  banned: boolean;
  banExpiry?: number;
}

export interface BountyEscrow {
  bountyId: number;
  amount: number;
  platformFee: number;
  totalLocked: number;
  placerId: number;
  status: 'locked' | 'released' | 'refunded';
  lockedAt: number;
  releasedAt?: number;
}

export interface HunterStatistics {
  userId: number;
  totalHunts: number;
  successfulHunts: number;
  failedHunts: number;
  abandonedHunts: number;
  totalEarned: number;
  averageReward: number;
  highestReward: number;
  fastestClaim: number; // Time in ms
  currentStreak: number;
  longestStreak: number;
  favoriteTargets: { userId: number; count: number }[];
  preferredDifficulty: BountyDifficulty;
}

export interface BountyLeaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: {
    rank: number;
    userId: number;
    username: string;
    tier: HunterTier;
    claimed: number;
    earned: number;
    successRate: number;
    streak: number;
  }[];
  lastUpdated: number;
}

export interface BountyNotification {
  id: string;
  userId: number;
  type: 'bounty-placed' | 'hunter-accepted' | 'bounty-claimed' | 'bounty-expired' | 'hunt-progress' | 'tier-promotion';
  bountyId?: number;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export interface HunterTierBenefits {
  tier: HunterTier;
  rewardBonus: number; // Percentage
  priorityNotifications: boolean;
  exclusiveBounties: boolean;
  maxActiveBounties: number;
  badge: string;
  color: string;
  requirements: {
    minClaimed: number;
    minSuccessRate: number;
    minEarned: number;
  };
}

export const HUNTER_TIER_THRESHOLDS: Record<HunterTier, number> = {
  novice: 0,
  apprentice: 5,
  skilled: 15,
  expert: 40,
  master: 100,
  legendary: 250
};

export const HUNTER_TIER_BENEFITS: Record<HunterTier, HunterTierBenefits> = {
  novice: {
    tier: 'novice',
    rewardBonus: 0,
    priorityNotifications: false,
    exclusiveBounties: false,
    maxActiveBounties: 2,
    badge: '🔰',
    color: '#6666AA',
    requirements: { minClaimed: 0, minSuccessRate: 0, minEarned: 0 }
  },
  apprentice: {
    tier: 'apprentice',
    rewardBonus: 5,
    priorityNotifications: false,
    exclusiveBounties: false,
    maxActiveBounties: 3,
    badge: '⚔️',
    color: '#00C8FF',
    requirements: { minClaimed: 5, minSuccessRate: 0.5, minEarned: 500 }
  },
  skilled: {
    tier: 'skilled',
    rewardBonus: 10,
    priorityNotifications: true,
    exclusiveBounties: false,
    maxActiveBounties: 5,
    badge: '🎯',
    color: '#FFD700',
    requirements: { minClaimed: 15, minSuccessRate: 0.6, minEarned: 2000 }
  },
  expert: {
    tier: 'expert',
    rewardBonus: 15,
    priorityNotifications: true,
    exclusiveBounties: true,
    maxActiveBounties: 7,
    badge: '💀',
    color: '#FF6B00',
    requirements: { minClaimed: 40, minSuccessRate: 0.7, minEarned: 10000 }
  },
  master: {
    tier: 'master',
    rewardBonus: 25,
    priorityNotifications: true,
    exclusiveBounties: true,
    maxActiveBounties: 10,
    badge: '👑',
    color: '#8B00FF',
    requirements: { minClaimed: 100, minSuccessRate: 0.75, minEarned: 50000 }
  },
  legendary: {
    tier: 'legendary',
    rewardBonus: 50,
    priorityNotifications: true,
    exclusiveBounties: true,
    maxActiveBounties: 15,
    badge: '⚡',
    color: '#FF003C',
    requirements: { minClaimed: 250, minSuccessRate: 0.8, minEarned: 200000 }
  }
};

export const BOUNTY_RESTRICTIONS: BountyRestrictions = {
  minRank: 100, // Must be top 100 to place bounties
  maxActiveBounties: 3,
  minReward: 50,
  maxReward: 10000,
  minDuration: 24 * 60 * 60 * 1000, // 24 hours
  maxDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
  cooldownPeriod: 60 * 60 * 1000, // 1 hour
  platformFeePercentage: 10,
  canTargetSelf: false,
  canTargetClanmates: false
};

export const DIFFICULTY_MULTIPLIERS: Record<BountyDifficulty, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  extreme: 3.0,
  impossible: 5.0
};

export const CLAIM_REQUIREMENTS: Record<ClaimRequirement, { wins: number; description: string }> = {
  'single-win': { wins: 1, description: 'Win 1 battle' },
  'best-of-3': { wins: 2, description: 'Win 2 out of 3 battles' },
  'best-of-5': { wins: 3, description: 'Win 3 out of 5 battles' },
  'ranked-match': { wins: 1, description: 'Win 1 ranked battle' }
};
