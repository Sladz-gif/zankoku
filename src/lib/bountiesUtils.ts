// Bounties system utility functions

import {
  EnhancedBounty,
  HunterReputation,
  HunterTier,
  BountyDifficulty,
  BountyHunt,
  AntiAbuseDetection,
  BountyRestrictions,
  HUNTER_TIER_THRESHOLDS,
  HUNTER_TIER_BENEFITS,
  BOUNTY_RESTRICTIONS,
  DIFFICULTY_MULTIPLIERS,
  CLAIM_REQUIREMENTS,
  ClaimRequirement
} from '@/types/bounties';

/**
 * Calculate bounty difficulty based on target stats
 */
export function calculateBountyDifficulty(
  targetRank: number,
  targetWinRate: number,
  targetPoints: number
): BountyDifficulty {
  let score = 0;
  
  // Rank contribution (lower rank = harder)
  if (targetRank <= 10) score += 50;
  else if (targetRank <= 50) score += 30;
  else if (targetRank <= 100) score += 20;
  else if (targetRank <= 500) score += 10;
  
  // Win rate contribution
  if (targetWinRate >= 0.8) score += 30;
  else if (targetWinRate >= 0.7) score += 20;
  else if (targetWinRate >= 0.6) score += 10;
  
  // Points contribution
  if (targetPoints >= 10000) score += 20;
  else if (targetPoints >= 5000) score += 10;
  
  if (score >= 80) return 'impossible';
  if (score >= 60) return 'extreme';
  if (score >= 40) return 'hard';
  if (score >= 20) return 'medium';
  return 'easy';
}

/**
 * Calculate platform fee
 */
export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * (BOUNTY_RESTRICTIONS.platformFeePercentage / 100));
}

/**
 * Calculate total escrow amount
 */
export function calculateEscrowAmount(reward: number): number {
  const fee = calculatePlatformFee(reward);
  return reward + fee;
}

/**
 * Determine hunter tier based on statistics
 */
export function determineHunterTier(
  totalClaimed: number,
  successRate: number,
  totalEarned: number
): HunterTier {
  const tiers: HunterTier[] = ['legendary', 'master', 'expert', 'skilled', 'apprentice', 'novice'];
  
  for (const tier of tiers) {
    const requirements = HUNTER_TIER_BENEFITS[tier].requirements;
    
    if (
      totalClaimed >= requirements.minClaimed &&
      successRate >= requirements.minSuccessRate &&
      totalEarned >= requirements.minEarned
    ) {
      return tier;
    }
  }
  
  return 'novice';
}

/**
 * Calculate hunter reputation score
 */
export function calculateHunterReputation(
  totalClaimed: number,
  successRate: number,
  totalEarned: number,
  currentStreak: number
): number {
  const claimScore = totalClaimed * 10;
  const successScore = successRate * 100;
  const earningsScore = totalEarned / 100;
  const streakBonus = currentStreak * 5;
  
  return Math.round(claimScore + successScore + earningsScore + streakBonus);
}

/**
 * Calculate reward with tier bonus
 */
export function calculateRewardWithBonus(
  baseReward: number,
  hunterTier: HunterTier
): number {
  const bonus = HUNTER_TIER_BENEFITS[hunterTier].rewardBonus;
  return Math.round(baseReward * (1 + bonus / 100));
}

/**
 * Validate bounty placement
 */
export function validateBountyPlacement(
  placerId: number,
  targetId: number,
  amount: number,
  duration: number,
  placerRank: number,
  placerClanId: number | null,
  targetClanId: number | null,
  activeBounties: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check self-targeting
  if (placerId === targetId && !BOUNTY_RESTRICTIONS.canTargetSelf) {
    errors.push('Cannot place bounty on yourself');
  }
  
  // Check clan targeting
  if (
    placerClanId !== null &&
    placerClanId === targetClanId &&
    !BOUNTY_RESTRICTIONS.canTargetClanmates
  ) {
    errors.push('Cannot place bounty on clanmates');
  }
  
  // Check rank requirement
  if (placerRank > BOUNTY_RESTRICTIONS.minRank) {
    errors.push(`Must be rank ${BOUNTY_RESTRICTIONS.minRank} or better to place bounties`);
  }
  
  // Check active bounties limit
  if (activeBounties >= BOUNTY_RESTRICTIONS.maxActiveBounties) {
    errors.push(`Maximum ${BOUNTY_RESTRICTIONS.maxActiveBounties} active bounties allowed`);
  }
  
  // Check reward amount
  if (amount < BOUNTY_RESTRICTIONS.minReward) {
    errors.push(`Minimum reward is ${BOUNTY_RESTRICTIONS.minReward}`);
  }
  if (amount > BOUNTY_RESTRICTIONS.maxReward) {
    errors.push(`Maximum reward is ${BOUNTY_RESTRICTIONS.maxReward}`);
  }
  
  // Check duration
  if (duration < BOUNTY_RESTRICTIONS.minDuration) {
    errors.push('Bounty duration too short');
  }
  if (duration > BOUNTY_RESTRICTIONS.maxDuration) {
    errors.push('Bounty duration too long');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check if user is on cooldown
 */
export function isOnCooldown(lastPlacement: number): boolean {
  const cooldownEnd = lastPlacement + BOUNTY_RESTRICTIONS.cooldownPeriod;
  return Date.now() < cooldownEnd;
}

/**
 * Calculate cooldown remaining
 */
export function getCooldownRemaining(lastPlacement: number): number {
  const cooldownEnd = lastPlacement + BOUNTY_RESTRICTIONS.cooldownPeriod;
  const remaining = cooldownEnd - Date.now();
  return Math.max(0, remaining);
}

/**
 * Format cooldown time
 */
export function formatCooldownTime(milliseconds: number): string {
  const minutes = Math.ceil(milliseconds / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Check if bounty has expired
 */
export function isBountyExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

/**
 * Calculate time remaining for bounty
 */
export function getBountyTimeRemaining(expiresAt: number): number {
  return Math.max(0, expiresAt - Date.now());
}

/**
 * Format bounty expiration time
 */
export function formatExpirationTime(expiresAt: number): string {
  const remaining = getBountyTimeRemaining(expiresAt);
  
  if (remaining === 0) return 'Expired';
  
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Calculate hunt progress
 */
export function calculateHuntProgress(
  battlesWon: number,
  requirement: ClaimRequirement
): number {
  const needed = CLAIM_REQUIREMENTS[requirement].wins;
  return Math.min(100, (battlesWon / needed) * 100);
}

/**
 * Check if hunt is complete
 */
export function isHuntComplete(
  battlesWon: number,
  requirement: ClaimRequirement
): boolean {
  const needed = CLAIM_REQUIREMENTS[requirement].wins;
  return battlesWon >= needed;
}

/**
 * Detect collusion between users
 */
export function detectCollusion(
  userId1: number,
  userId2: number,
  recentBattles: { player1: number; player2: number; winner: number; timestamp: number }[]
): boolean {
  // Check for suspicious patterns in recent battles
  const battlesBetween = recentBattles.filter(
    b => (b.player1 === userId1 && b.player2 === userId2) || 
         (b.player1 === userId2 && b.player2 === userId1)
  );
  
  if (battlesBetween.length < 5) return false;
  
  // Check for alternating wins (win trading)
  let alternatingWins = 0;
  for (let i = 1; i < battlesBetween.length; i++) {
    if (battlesBetween[i].winner !== battlesBetween[i - 1].winner) {
      alternatingWins++;
    }
  }
  
  // If more than 70% of battles alternate winners, flag as suspicious
  const alternatingRate = alternatingWins / (battlesBetween.length - 1);
  return alternatingRate > 0.7;
}

/**
 * Detect rapid bounty placement (potential abuse)
 */
export function detectRapidPlacement(
  placements: { timestamp: number }[],
  timeWindow: number = 3600000 // 1 hour
): boolean {
  const now = Date.now();
  const recentPlacements = placements.filter(p => now - p.timestamp < timeWindow);
  
  // Flag if more than 5 bounties placed in 1 hour
  return recentPlacements.length > 5;
}

/**
 * Detect multi-account abuse
 */
export function detectMultiAccount(
  userId: number,
  suspectedAltId: number,
  commonPatterns: {
    sameIP: boolean;
    similarNames: boolean;
    frequentInteraction: boolean;
    suspiciousTransfers: boolean;
  }
): boolean {
  let suspicionScore = 0;
  
  if (commonPatterns.sameIP) suspicionScore += 40;
  if (commonPatterns.similarNames) suspicionScore += 20;
  if (commonPatterns.frequentInteraction) suspicionScore += 20;
  if (commonPatterns.suspiciousTransfers) suspicionScore += 20;
  
  return suspicionScore >= 60;
}

/**
 * Calculate anti-abuse score
 */
export function calculateAbuseScore(detection: AntiAbuseDetection): number {
  let score = 0;
  
  if (detection.flags.collusion) score += 30;
  if (detection.flags.winTrading) score += 30;
  if (detection.flags.multiAccount) score += 25;
  if (detection.flags.rapidPlacement) score += 10;
  if (detection.flags.selfTargeting) score += 5;
  
  score += detection.violations * 10;
  
  return Math.min(100, score);
}

/**
 * Sort bounties by various criteria
 */
export function sortBounties(
  bounties: EnhancedBounty[],
  sortBy: 'reward' | 'difficulty' | 'expiration' | 'newest'
): EnhancedBounty[] {
  const sorted = [...bounties];
  
  switch (sortBy) {
    case 'reward':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'difficulty':
      const difficultyOrder = { impossible: 5, extreme: 4, hard: 3, medium: 2, easy: 1 };
      return sorted.sort((a, b) => difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]);
    case 'expiration':
      return sorted.sort((a, b) => a.expiresAt - b.expiresAt);
    case 'newest':
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    default:
      return sorted;
  }
}

/**
 * Filter bounties by criteria
 */
export function filterBounties(
  bounties: EnhancedBounty[],
  filters: {
    difficulty?: BountyDifficulty[];
    faction?: string[];
    minReward?: number;
    maxReward?: number;
    minRank?: number;
    maxRank?: number;
  }
): EnhancedBounty[] {
  return bounties.filter(bounty => {
    if (filters.difficulty && !filters.difficulty.includes(bounty.difficulty)) {
      return false;
    }
    
    if (filters.faction && !filters.faction.includes(bounty.metadata.targetFaction)) {
      return false;
    }
    
    if (filters.minReward && bounty.amount < filters.minReward) {
      return false;
    }
    
    if (filters.maxReward && bounty.amount > filters.maxReward) {
      return false;
    }
    
    if (filters.minRank && bounty.metadata.targetRank > filters.minRank) {
      return false;
    }
    
    if (filters.maxRank && bounty.metadata.targetRank < filters.maxRank) {
      return false;
    }
    
    return true;
  });
}

/**
 * Calculate success rate
 */
export function calculateSuccessRate(successful: number, total: number): number {
  if (total === 0) return 0;
  return (successful / total) * 100;
}

/**
 * Get tier color
 */
export function getHunterTierColor(tier: HunterTier): string {
  return HUNTER_TIER_BENEFITS[tier].color;
}

/**
 * Get tier badge
 */
export function getHunterTierBadge(tier: HunterTier): string {
  return HUNTER_TIER_BENEFITS[tier].badge;
}

/**
 * Calculate leaderboard rank
 */
export function calculateLeaderboardRank(
  userId: number,
  allHunters: HunterReputation[]
): number {
  const sorted = [...allHunters].sort((a, b) => b.reputation - a.reputation);
  const index = sorted.findIndex(h => h.userId === userId);
  return index === -1 ? allHunters.length : index + 1;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: BountyDifficulty): string {
  const colors: Record<BountyDifficulty, string> = {
    easy: '#00FF88',
    medium: '#FFD700',
    hard: '#FF6B00',
    extreme: '#FF003C',
    impossible: '#8B00FF'
  };
  return colors[difficulty];
}

/**
 * Calculate estimated claim time
 */
export function estimateClaimTime(
  difficulty: BountyDifficulty,
  hunterSuccessRate: number
): string {
  const baseTime = {
    easy: 1,
    medium: 3,
    hard: 6,
    extreme: 12,
    impossible: 24
  }[difficulty];
  
  const adjustedTime = baseTime / (hunterSuccessRate || 0.5);
  
  if (adjustedTime < 1) return 'Less than 1 hour';
  if (adjustedTime < 24) return `~${Math.round(adjustedTime)} hours`;
  const days = Math.round(adjustedTime / 24);
  return `~${days} day${days > 1 ? 's' : ''}`;
}

/**
 * Validate hunt attempt
 */
export function canAttemptHunt(
  hunterId: number,
  bounty: EnhancedBounty,
  hunterRank: number,
  activeHunts: number,
  hunterTier: HunterTier
): { canAttempt: boolean; reason?: string } {
  // Check if bounty is expired
  if (isBountyExpired(bounty.expiresAt)) {
    return { canAttempt: false, reason: 'Bounty has expired' };
  }
  
  // Check if bounty is still active
  if (bounty.status !== 'active') {
    return { canAttempt: false, reason: 'Bounty is no longer active' };
  }
  
  // Check rank requirement
  if (bounty.metadata.minHunterRank && hunterRank > bounty.metadata.minHunterRank) {
    return { canAttempt: false, reason: `Requires rank ${bounty.metadata.minHunterRank} or better` };
  }
  
  // Check active hunts limit
  const maxActive = HUNTER_TIER_BENEFITS[hunterTier].maxActiveBounties;
  if (activeHunts >= maxActive) {
    return { canAttempt: false, reason: `Maximum ${maxActive} active hunts for your tier` };
  }
  
  return { canAttempt: true };
}

/**
 * Generate bounty notification message
 */
export function generateNotificationMessage(
  type: 'bounty-placed' | 'hunter-accepted' | 'bounty-claimed' | 'bounty-expired',
  data: { targetName?: string; hunterName?: string; amount?: number }
): string {
  switch (type) {
    case 'bounty-placed':
      return `A bounty of ${data.amount} has been placed on ${data.targetName}!`;
    case 'hunter-accepted':
      return `${data.hunterName} has accepted your bounty!`;
    case 'bounty-claimed':
      return `${data.hunterName} has claimed the bounty on ${data.targetName}!`;
    case 'bounty-expired':
      return `Your bounty on ${data.targetName} has expired`;
    default:
      return 'Bounty notification';
  }
}
