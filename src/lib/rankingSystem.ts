import { ZankokuUser, AnimeFaction, Alignment } from '@/types/game';

export interface RankingFactors {
  points: number;
  duelsWon: number;
  duelsLost: number;
  shapesCaptured: number;
  clanWars: number;
  bountiesClaimed: number;
  cowardStars: number;
  bountyAmount: number;
  winRate: number;
  powerScore: number;
}

export interface RankingResult {
  user: ZankokuUser;
  rank: number;
  previousRank: number;
  rankChange: number;
  factors: RankingFactors;
  tier: RankingTier;
  pointsToNextRank: number;
  percentile: number;
}

export interface RankingTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
  benefits: string[];
}

export const RANKING_TIERS: RankingTier[] = [
  {
    name: 'UNRANKED',
    minPoints: 0,
    maxPoints: 999,
    color: '#666666',
    icon: '🥉',
    benefits: ['Basic arena access']
  },
  {
    name: 'BRONZE FIGHTER',
    minPoints: 1000,
    maxPoints: 2999,
    color: '#CD7F32',
    icon: '🥉',
    benefits: ['Bronze techniques', '10% Silver bonus']
  },
  {
    name: 'SILVER WARRIOR',
    minPoints: 3000,
    maxPoints: 5999,
    color: '#C0C0C0',
    icon: '🥈',
    benefits: ['Silver techniques', '20% Silver bonus', 'Clan access']
  },
  {
    name: 'GOLD ELITE',
    minPoints: 6000,
    maxPoints: 9999,
    color: '#FFD700',
    icon: '🥇',
    benefits: ['Gold techniques', '30% Gold bonus', 'Priority matchmaking']
  },
  {
    name: 'PLATINUM LEGEND',
    minPoints: 10000,
    maxPoints: 14999,
    color: '#E5E4E2',
    icon: '💎',
    benefits: ['Elite techniques', '50% all bonuses', 'Exclusive tournaments']
  },
  {
    name: 'DIAMOND MASTER',
    minPoints: 15000,
    maxPoints: 24999,
    color: '#B9F2FF',
    icon: '💠',
    benefits: ['Master techniques', '75% all bonuses', 'Mentor status']
  },
  {
    name: 'ZANKOKU SUPREME',
    minPoints: 25000,
    maxPoints: Infinity,
    color: '#FF6B35',
    icon: '👑',
    benefits: ['Supreme techniques', '100% all bonuses', 'Legendary status', 'Custom title']
  }
];

export class RankingSystem {
  static calculatePowerScore(user: ZankokuUser): number {
    const winRate = user.duelsWon + user.duelsLost > 0 
      ? user.duelsWon / (user.duelsWon + user.duelsLost) 
      : 0;
    
    const duelScore = user.duelsWon * 100 + winRate * 50;
    const shapeScore = user.shapesCaptured * 25;
    const clanScore = user.clanWars * 150;
    const bountyScore = user.bountiesClaimed * 200;
    const cowardPenalty = user.cowardStars * 100;
    const bountyTargetPenalty = user.bountyActive ? user.bountyAmount * 0.1 : 0;
    
    return Math.max(0, duelScore + shapeScore + clanScore + bountyScore - cowardPenalty - bountyTargetPenalty);
  }

  static calculateRankingFactors(user: ZankokuUser): RankingFactors {
    const winRate = user.duelsWon + user.duelsLost > 0 
      ? user.duelsWon / (user.duelsWon + user.duelsLost) 
      : 0;
    
    return {
      points: user.points,
      duelsWon: user.duelsWon,
      duelsLost: user.duelsLost,
      shapesCaptured: user.shapesCaptured,
      clanWars: user.clanWars,
      bountiesClaimed: user.bountiesClaimed,
      cowardStars: user.cowardStars,
      bountyAmount: user.bountyAmount,
      winRate,
      powerScore: this.calculatePowerScore(user)
    };
  }

  static getTier(points: number): RankingTier {
    return RANKING_TIERS.find(tier => 
      points >= tier.minPoints && points <= tier.maxPoints
    ) || RANKING_TIERS[0];
  }

  static calculateRankings(users: ZankokuUser[]): RankingResult[] {
    // Sort users by multiple factors
    const sortedUsers = [...users].sort((a, b) => {
      // Primary: Points
      if (b.points !== a.points) return b.points - a.points;
      
      // Secondary: Power Score
      const aPower = this.calculatePowerScore(a);
      const bPower = this.calculatePowerScore(b);
      if (bPower !== aPower) return bPower - aPower;
      
      // Tertiary: Win Rate (minimum 10 duels)
      const aWinRate = a.duelsWon + a.duelsLost >= 10 
        ? a.duelsWon / (a.duelsWon + a.duelsLost) 
        : 0;
      const bWinRate = b.duelsWon + b.duelsLost >= 10 
        ? b.duelsWon / (b.duelsWon + b.duelsLost) 
        : 0;
      if (bWinRate !== aWinRate) return bWinRate - aWinRate;
      
      // Quaternary: Total duels (experience)
      const aTotalDuels = a.duelsWon + a.duelsLost;
      const bTotalDuels = b.duelsWon + b.duelsLost;
      return bTotalDuels - aTotalDuels;
    });

    return sortedUsers.map((user, index) => {
      const rank = index + 1;
      const factors = this.calculateRankingFactors(user);
      const tier = this.getTier(user.points);
      
      // Calculate percentile
      const percentile = ((users.length - rank) / users.length) * 100;
      
      // Calculate points to next rank
      const nextTier = RANKING_TIERS.find(t => t.minPoints > user.points);
      const pointsToNextRank = nextTier ? nextTier.minPoints - user.points : 0;
      
      return {
        user,
        rank,
        previousRank: user.rank, // Store current rank as previous for comparison
        rankChange: user.rank - rank, // Positive means moved up
        factors,
        tier,
        pointsToNextRank,
        percentile
      };
    });
  }

  static updateUserRank(user: ZankokuUser, newRank: number): ZankokuUser {
    const rankChange = user.rank - newRank;
    
    // Create rank change notification if significant
    if (Math.abs(rankChange) >= 5) {
      // This would trigger a notification in a real system
      console.log(`${user.username} ranked ${rankChange > 0 ? 'up' : 'down'} from ${user.rank} to ${newRank}`);
    }
    
    return {
      ...user,
      rank: newRank
    };
  }

  static getRankDistribution(users: ZankokuUser[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    RANKING_TIERS.forEach(tier => {
      distribution[tier.name] = 0;
    });
    
    users.forEach(user => {
      const tier = this.getTier(user.points);
      distribution[tier.name]++;
    });
    
    return distribution;
  }

  static getTopByFaction(users: ZankokuUser[], faction: AnimeFaction, limit: number = 10): RankingResult[] {
    const factionUsers = users.filter(u => u.anime === faction);
    return this.calculateRankings(factionUsers).slice(0, limit);
  }

  static getTopByAlignment(users: ZankokuUser[], alignment: Alignment, limit: number = 10): RankingResult[] {
    const alignmentUsers = users.filter(u => u.alignment === alignment);
    return this.calculateRankings(alignmentUsers).slice(0, limit);
  }

  static getRankProgress(user: ZankokuUser): {
    currentTier: RankingTier;
    nextTier: RankingTier | null;
    progressPercent: number;
    pointsInCurrentTier: number;
    pointsNeededForNextTier: number;
  } {
    const currentTier = this.getTier(user.points);
    const nextTier = RANKING_TIERS.find(t => t.minPoints > user.points) || null;
    
    const pointsInCurrentTier = user.points - currentTier.minPoints;
    const pointsNeededForNextTier = nextTier 
      ? nextTier.minPoints - currentTier.minPoints 
      : currentTier.maxPoints - currentTier.minPoints;
    
    const progressPercent = pointsNeededForNextTier > 0 
      ? (pointsInCurrentTier / pointsNeededForNextTier) * 100 
      : 100;
    
    return {
      currentTier,
      nextTier,
      progressPercent,
      pointsInCurrentTier,
      pointsNeededForNextTier
    };
  }

  static shouldDemote(user: ZankokuUser): boolean {
    // Demote if user has high coward stars and low win rate
    const winRate = user.duelsWon + user.duelsLost > 0 
      ? user.duelsWon / (user.duelsWon + user.duelsLost) 
      : 0;
    
    return user.cowardStars >= 5 && winRate < 0.3 && user.duelsWon + user.duelsLost >= 20;
  }

  static shouldPromote(user: ZankokuUser): boolean {
    // Promote if user has exceptional performance
    const winRate = user.duelsWon + user.duelsLost > 0 
      ? user.duelsWon / (user.duelsWon + user.duelsLost) 
      : 0;
    
    return winRate > 0.8 && user.duelsWon >= 50 && user.cowardStars === 0;
  }
}
