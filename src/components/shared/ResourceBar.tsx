import React from 'react';
import { Zap } from 'lucide-react';
import { AnimeFaction } from '@/types/game';

interface ResourceBarProps {
  current: number;
  max: number;
  faction: AnimeFaction | 'physical';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const FACTION_COLORS: Record<string, string> = {
  naruto: '#FF6B00',
  jjk: '#8B00FF',
  onepiece: '#00C8FF',
  bleach: '#00FF88',
  blackclover: '#FFD700',
  dragonball: '#FF4400',
  demonslayer: '#FF1744',
  hunterxhunter: '#76FF03',
  physical: '#FFFFFF'
};

export const ResourceBar: React.FC<ResourceBarProps> = ({ 
  current, 
  max, 
  faction, 
  onClick,
  size = 'md'
}) => {
  const color = FACTION_COLORS[faction] || '#FFFFFF';
  const percentage = (current / max) * 100;

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <div 
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <Zap size={iconSizes[size]} strokeWidth={1.5} style={{ color }} />
      <div className="flex-1 min-w-[80px]">
        <div 
          className={`w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden ${sizeClasses[size]}`}
          style={{ border: `1px solid ${color}30` }}
        >
          <div
            className={`${sizeClasses[size]} transition-all duration-300 ease-out`}
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}80`
            }}
          />
        </div>
      </div>
      <span className="text-xs font-['Rajdhani'] font-semibold" style={{ color }}>
        {current}/{max}
      </span>
    </div>
  );
};
