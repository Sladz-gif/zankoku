// Profile utility functions

import { 
  UserStatistics, 
  ReputationData, 
  TierProgress, 
  TierLevel,
  DerivedMetrics,
  PromotionAlert,
  PerformanceTrend,
  BattleHistoryEntry,
  TIER_THRESHOLDS,
  TIER_BENEFITS,
  TIER_COLORS
} from '@/types/profile';

/**
 * Calculate win rate
 */
export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return (wins / total) * 100;
}

/**
 * Calculate power score based on multiple factors
 */
export function calculatePowerScore(stats: UserStatistics): number {
  const winRateWeight = stats.winRate * 0.3;
  const shapeWeight = (stats.shapesCaptured / 100) * 0.2;
  const clanWeight = (stats.clanWars * 10) * 0.15;
  const bountyWeight = (stats.bountiesClaimed * 20) * 0.15;
  const streakWeight = (stats.currentStreak * 5) * 0.1;
  const pointsWeight = (stats.totalPoints / 100) * 0.1;
  
  return Math.round(
    winRateWeight + shapeWeight + clanWeight + bountyWeight + streakWeight + pointsWeight
  );
}

/**
 * Calculate clan contribution score
 */
export function calculateClanContribution(
  clanWars: number,
  resourcesDonated: number,
  postsCreated: number,
  reputation: number
): number {
  return (clanWars * 50) + (resourcesDonated * 0.1) + (postsCreated * 10) + (reputation * 5);
}

/**
 * Determine current tier based on points
 */
export function getCurrentTier(points: number): TierLevel {
  const tiers = Object.entries(TIER_THRESHOLDS).sort((a, b) => b[1] - a[1]);
  
  for (const [tier, threshold] of tiers) {
    if (points >= threshold) {
      return tier as TierLevel;
    }
  }
  
  return 'bronze';
}

/**
 * Get next tier
 */
export function getNextTier(currentTier: TierLevel): TierLevel | null {
  const tiers: TierLevel[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'legend'];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex === -1 || currentIndex === tiers.length - 1) {
    return null;
  }
  
  return tiers[currentIndex + 1];
}

/**
 * Calculate tier progress
 */
export function calculateTierProgress(points: number, stats: UserStatistics): TierProgress {
  const currentTier = getCurrentTier(points);
  const nextTier = getNextTier(currentTier);
  
  const currentThreshold = TIER_THRESHOLDS[currentTier];
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : currentThreshold;
  
  const progressPoints = points - currentThreshold;
  const requiredPoints = nextThreshold - currentThreshold;
  const progressPercentage = nextTier ? (progressPoints / requiredPoints) * 100 : 100;
  
  const currentBenefits = TIER_BENEFITS[currentTier];
  const nextBenefits = nextTier ? TIER_BENEFITS[nextTier] : currentBenefits;
  
  // Determine promotion status
  let promotionStatus: 'safe' | 'at-risk' | 'promotion-ready' = 'safe';
  if (progressPercentage >= 90) {
    promotionStatus = 'promotion-ready';
  } else if (progressPercentage < 20) {
    promotionStatus = 'at-risk';
  }
  
  // Calculate demotion risk
  const demotionRisk = progressPercentage < 10 ? 80 : progressPercentage < 30 ? 40 : 10;
  
  return {
    currentTier,
    currentPoints: points,
    nextTierPoints: nextThreshold,
    progressPercentage: Math.min(100, progressPercentage),
    tierBenefits: currentBenefits.benefits,
    nextTierBenefits: nextBenefits.benefits,
    promotionStatus,
    demotionRisk
  };
}

/**
 * Generate promotion alert
 */
export function generatePromotionAlert(
  tierProgress: TierProgress,
  stats: UserStatistics
): PromotionAlert | null {
  const { currentTier, progressPercentage, currentPoints, nextTierPoints } = tierProgress;
  const nextTier = getNextTier(currentTier);
  
  if (!nextTier) return null;
  
  const pointsNeeded = nextTierPoints - currentPoints;
  const nextRequirements = TIER_BENEFITS[nextTier].requirements;
  
  // Promotion ready
  if (progressPercentage >= 90) {
    const meetsWinRate = !nextRequirements.minWinRate || stats.winRate >= nextRequirements.minWinRate * 100;
    const meetsBattles = !nextRequirements.minBattles || (stats.duelsWon + stats.duelsLost) >= nextRequirements.minBattles;
    
    if (meetsWinRate && meetsBattles) {
      return {
        type: 'promotion',
        tier: nextTier,
        message: `You're ready for promotion to ${nextTier.toUpperCase()}!`,
        pointsNeeded: Math.max(0, pointsNeeded),
        recommendations: ['Keep up the great performance!', 'Win your next battle to secure promotion']
      };
    } else {
      const recommendations: string[] = [];
      if (!meetsWinRate) {
        recommendations.push(`Improve win rate to ${(nextRequirements.minWinRate! * 100).toFixed(0)}%`);
      }
      if (!meetsBattles) {
        recommendations.push(`Complete ${nextRequirements.minBattles! - (stats.duelsWon + stats.duelsLost)} more battles`);
      }
      
      return {
        type: 'warning',
        tier: nextTier,
        message: 'Close to promotion but requirements not met',
        pointsNeeded,
        recommendations
      };
    }
  }
  
  // Demotion risk
  if (progressPercentage < 10) {
    return {
      type: 'demotion',
      tier: currentTier,
      message: `Risk of demotion from ${currentTier.toUpperCase()}!`,
      pointsNeeded: Math.round((nextTierPoints - currentPoints) * 0.2),
      timeframe: '7 days',
      recommendations: [
        'Win battles to gain points',
        'Participate in clan wars',
        'Complete daily challenges',
        'Avoid consecutive losses'
      ]
    };
  }
  
  return null;
}

/**
 * Calculate derived metrics
 */
export function calculateDerivedMetrics(
  stats: UserStatistics,
  battleHistory: BattleHistoryEntry[]
): DerivedMetrics {
  const totalBattles = stats.duelsWon + stats.duelsLost;
  const winRate = calculateWinRate(stats.duelsWon, stats.duelsLost);
  
  const averagePointsPerBattle = totalBattles > 0 
    ? stats.totalPoints / totalBattles 
    : 0;
  
  const shapesPerBattle = totalBattles > 0 
    ? stats.shapesCaptured / totalBattles 
    : 0;
  
  // Battle efficiency: shapes captured per win
  const battleEfficiency = stats.duelsWon > 0 
    ? stats.shapesCaptured / stats.duelsWon 
    : 0;
  
  // Clan activity score
  const clanActivityScore = calculateClanContribution(
    stats.clanWars,
    0, // Would come from clan data
    0, // Would come from clan data
    0  // Would come from clan data
  );
  
  const overallPowerScore = calculatePowerScore(stats);
  
  // Ranking velocity: how fast rank is changing (based on recent history)
  const recentBattles = battleHistory.slice(0, 10);
  const recentWins = recentBattles.filter(b => b.result === 'win').length;
  const rankingVelocity = recentWins > 5 ? 1 : recentWins < 3 ? -1 : 0;
  
  // Consistency score: based on streak and win rate stability
  const consistencyScore = Math.min(100, (stats.currentStreak * 10) + (winRate * 0.5));
  
  return {
    winRate,
    averagePointsPerBattle,
    shapesPerBattle,
    battleEfficiency,
    clanActivityScore,
    overallPowerScore,
    rankingVelocity,
    consistencyScore
  };
}

/**
 * Analyze performance trend
 */
export function analyzePerformanceTrend(
  battleHistory: BattleHistoryEntry[],
  period: 'daily' | 'weekly' | 'monthly'
): PerformanceTrend {
  const now = Date.now();
  const periodMs = {
    daily: 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000,
    monthly: 30 * 24 * 60 * 60 * 1000
  }[period];
  
  const recentBattles = battleHistory.filter(b => now - b.timestamp < periodMs);
  const previousBattles = battleHistory.filter(b => 
    b.timestamp < (now - periodMs) && 
    b.timestamp >= (now - periodMs * 2)
  );
  
  const recentWins = recentBattles.filter(b => b.result === 'win').length;
  const recentTotal = recentBattles.length;
  const recentWinRate = recentTotal > 0 ? (recentWins / recentTotal) * 100 : 0;
  
  const previousWins = previousBattles.filter(b => b.result === 'win').length;
  const previousTotal = previousBattles.length;
  const previousWinRate = previousTotal > 0 ? (previousWins / previousTotal) * 100 : 0;
  
  const recentPoints = recentBattles.reduce((sum, b) => sum + b.pointsGained - b.pointsLost, 0);
  const averagePoints = recentTotal > 0 ? recentPoints / recentTotal : 0;
  
  const trendPercentage = previousWinRate > 0 
    ? ((recentWinRate - previousWinRate) / previousWinRate) * 100 
    : 0;
  
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (trendPercentage > 10) trend = 'improving';
  else if (trendPercentage < -10) trend = 'declining';
  
  return {
    period,
    winRate: recentWinRate,
    averagePoints,
    totalBattles: recentTotal,
    trend,
    trendPercentage
  };
}

/**
 * Calculate reputation score
 */
export function calculateReputationScore(data: ReputationData): number {
  let score = 100; // Start at 100
  
  // Penalties
  score -= data.cowardStars * 10;
  score -= data.betrayalHistory.length * 15;
  score -= data.warnings * 5;
  
  // Bonuses
  score += data.commendations * 10;
  score += data.honorScore * 0.5;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Determine community standing
 */
export function determineCommunityStanding(reputationScore: number): ReputationData['communityStanding'] {
  if (reputationScore >= 90) return 'excellent';
  if (reputationScore >= 70) return 'good';
  if (reputationScore >= 40) return 'neutral';
  if (reputationScore >= 20) return 'poor';
  return 'notorious';
}

/**
 * Get tier color
 */
export function getTierColor(tier: TierLevel): string {
  return TIER_COLORS[tier];
}

/**
 * Format large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Calculate achievement progress percentage
 */
export function calculateAchievementProgress(current: number, max: number): number {
  return Math.min(100, (current / max) * 100);
}

/**
 * Check if technique is unlockable
 */
export function isTechniqueUnlockable(
  technique: { unlockRequirement?: { rank?: number; points?: number; achievement?: string } },
  userRank: number,
  userPoints: number,
  completedAchievements: string[]
): boolean {
  if (!technique.unlockRequirement) return true;
  
  const { rank, points, achievement } = technique.unlockRequirement;
  
  if (rank && userRank > rank) return false;
  if (points && userPoints < points) return false;
  if (achievement && !completedAchievements.includes(achievement)) return false;
  
  return true;
}

/**
 * Calculate technique success rate
 */
export function calculateTechniqueSuccessRate(
  usageCount: number,
  successCount: number
): number {
  if (usageCount === 0) return 0;
  return (successCount / usageCount) * 100;
}

/**
 * Get rank change description
 */
export function getRankChangeDescription(
  oldRank: number,
  newRank: number
): { direction: 'up' | 'down' | 'same'; change: number; description: string } {
  const change = oldRank - newRank; // Positive = rank improved (lower number)
  
  if (change > 0) {
    return {
      direction: 'up',
      change,
      description: `Climbed ${change} rank${change > 1 ? 's' : ''}!`
    };
  } else if (change < 0) {
    return {
      direction: 'down',
      change: Math.abs(change),
      description: `Dropped ${Math.abs(change)} rank${Math.abs(change) > 1 ? 's' : ''}`
    };
  } else {
    return {
      direction: 'same',
      change: 0,
      description: 'Rank unchanged'
    };
  }
}

/**
 * Validate profile data
 */
export function validateProfileData(data: {
  username?: string;
  bio?: string;
  country?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.username !== undefined) {
    if (data.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }
    if (data.username.length > 20) {
      errors.push('Username must be less than 20 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
  }
  
  if (data.bio !== undefined && data.bio.length > 200) {
    errors.push('Bio must be less than 200 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculate streak bonus
 */
export function calculateStreakBonus(streak: number): number {
  if (streak >= 10) return 50;
  if (streak >= 5) return 25;
  if (streak >= 3) return 10;
  return 0;
}

/**
 * Get tier icon
 */
export function getTierIcon(tier: TierLevel): string {
  const icons: Record<TierLevel, string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '💠',
    master: '👑',
    grandmaster: '⚡',
    legend: '🔥'
  };
  return icons[tier];
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate time until next tier
 */
export function estimateTimeToNextTier(
  currentPoints: number,
  nextTierPoints: number,
  averagePointsPerDay: number
): string {
  if (averagePointsPerDay <= 0) return 'Unknown';
  
  const pointsNeeded = nextTierPoints - currentPoints;
  const daysNeeded = Math.ceil(pointsNeeded / averagePointsPerDay);
  
  if (daysNeeded < 1) return 'Less than a day';
  if (daysNeeded === 1) return '1 day';
  if (daysNeeded < 7) return `${daysNeeded} days`;
  if (daysNeeded < 30) return `${Math.ceil(daysNeeded / 7)} weeks`;
  return `${Math.ceil(daysNeeded / 30)} months`;
}
