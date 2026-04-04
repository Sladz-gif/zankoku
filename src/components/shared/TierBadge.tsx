import React from 'react';
import { Crown } from 'lucide-react';

interface TierBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'legend';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const TIER_COLORS: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
  master: '#8B00FF',
  grandmaster: '#FF003C',
  legend: '#FFD700'
};

const TIER_NAMES: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
  master: 'Master',
  grandmaster: 'Grandmaster',
  legend: 'Legend'
};

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = 'md', showIcon = false }) => {
  const color = TIER_COLORS[tier];
  const name = TIER_NAMES[tier];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-['Orbitron'] font-bold uppercase rounded ${sizeClasses[size]} ${tier === 'legend' ? 'legend-pulse' : ''}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}60`,
        boxShadow: `0 0 12px ${color}40`
      }}
    >
      {showIcon && tier === 'legend' && (
        <Crown size={iconSizes[size]} strokeWidth={2} />
      )}
      {name}
    </div>
  );
};
