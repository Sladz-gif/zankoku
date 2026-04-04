import React from 'react';
import { RankingSystem, RANKING_TIERS } from '@/lib/rankingSystem';
import { ZankokuUser } from '@/types/game';
import { Trophy, TrendingUp, Target, Zap, Shield, Crown } from 'lucide-react';

interface RankingProgressProps {
  user: ZankokuUser;
  showDetails?: boolean;
  compact?: boolean;
}

const RankingProgress: React.FC<RankingProgressProps> = ({ 
  user, 
  showDetails = true, 
  compact = false 
}) => {
  const progress = RankingSystem.getRankProgress(user);
  const factors = RankingSystem.calculateRankingFactors(user);
  const currentTierIndex = RANKING_TIERS.findIndex(t => t.name === progress.currentTier.name);
  const shouldPromote = RankingSystem.shouldPromote(user);
  const shouldDemote = RankingSystem.shouldDemote(user);

  const getTierIcon = (tierName: string) => {
    const tier = RANKING_TIERS.find(t => t.name === tierName);
    return tier?.icon || '🥉';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'hsl(var(--bg-elevated))' }}>
        <span className="text-2xl">{progress.currentTier.icon}</span>
        <div className="flex-1">
          <div className="font-body font-bold text-sm" style={{ color: progress.currentTier.color }}>
            {progress.currentTier.name}
          </div>
          <div className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
            {user.points.toLocaleString()} pts • Rank #{user.rank}
          </div>
        </div>
        {progress.nextTier && (
          <div className="text-right">
            <div className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
              {progress.pointsNeededForNextTier - progress.pointsInCurrentTier} to {progress.nextTier.name}
            </div>
            <div className="w-16 h-1 bg-gray-700 rounded-full mt-1">
              <div 
                className="h-1 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${progress.progressPercent}%`,
                  backgroundColor: progress.nextTier.color 
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Tier Display */}
      <div className="p-4 rounded-lg border" style={{ 
        background: `${progress.currentTier.color}08`,
        borderColor: `${progress.currentTier.color}30`,
        boxShadow: `0 0 20px ${progress.currentTier.color}15`
      }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{progress.currentTier.icon}</span>
          <div>
            <h3 className="font-display font-bold text-lg" style={{ color: progress.currentTier.color }}>
              {progress.currentTier.name}
            </h3>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              {user.points.toLocaleString()} points • Rank #{user.rank}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {progress.nextTier && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                Progress to {progress.nextTier.name}
              </span>
              <span className="font-body text-xs" style={{ color: progress.currentTier.color }}>
                {Math.round(progress.progressPercent)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                style={{ 
                  width: `${progress.progressPercent}%`,
                  background: `linear-gradient(90deg, ${progress.currentTier.color}, ${progress.nextTier.color})`
                }}
              >
                {progress.progressPercent > 10 && (
                  <span className="text-xs font-bold text-white">
                    {progress.pointsNeededForNextTier - progress.pointsInCurrentTier}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                {progress.currentTier.minPoints.toLocaleString()}
              </span>
              <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                {progress.nextTier.minPoints.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {showDetails && (
        <>
          {/* Ranking Factors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'hsl(var(--bg-elevated))' }}>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={14} style={{ color: '#FFD700' }} />
                <span className="font-body text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  WIN RATE
                </span>
              </div>
              <div className="font-display font-bold text-lg" style={{ color: '#FFD700' }}>
                {(factors.winRate * 100).toFixed(1)}%
              </div>
              <div className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
                {factors.duelsWon}W / {factors.duelsLost}L
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'hsl(var(--bg-elevated))' }}>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} style={{ color: '#FF6B35' }} />
                <span className="font-body text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  POWER SCORE
                </span>
              </div>
              <div className="font-display font-bold text-lg" style={{ color: '#FF6B35' }}>
                {factors.powerScore.toLocaleString()}
              </div>
              <div className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
                Overall strength
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'hsl(var(--bg-elevated))' }}>
              <div className="flex items-center gap-2 mb-1">
                <Target size={14} style={{ color: '#00C8FF' }} />
                <span className="font-body text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  SHAPES
                </span>
              </div>
              <div className="font-display font-bold text-lg" style={{ color: '#00C8FF' }}>
                {factors.shapesCaptured}
              </div>
              <div className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
                Territories captured
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'hsl(var(--bg-elevated))' }}>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} style={{ color: '#8B00FF' }} />
                <span className="font-body text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  CLAN WARS
                </span>
              </div>
              <div className="font-display font-bold text-lg" style={{ color: '#8B00FF' }}>
                {factors.clanWars}
              </div>
              <div className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
                Battles fought
              </div>
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="p-4 rounded-lg" style={{ background: 'hsl(var(--bg-elevated))' }}>
            <h4 className="font-body font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: progress.currentTier.color }}>
              <Crown size={14} />
              TIER BENEFITS
            </h4>
            <ul className="space-y-1">
              {progress.currentTier.benefits.map((benefit, index) => (
                <li key={index} className="font-body text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: progress.currentTier.color }} />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Promotion/Demotion Warnings */}
          {shouldPromote && (
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-400" />
                <span className="font-body text-sm font-semibold text-green-400">
                  ELIGIBLE FOR PROMOTION
                </span>
              </div>
              <p className="font-body text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Your exceptional performance has been noted!
              </p>
            </div>
          )}

          {shouldDemote && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-red-400 rotate-180" />
                <span className="font-body text-sm font-semibold text-red-400">
                  DEMOTION WARNING
                </span>
              </div>
              <p className="font-body text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Improve your performance to maintain your rank.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RankingProgress;
