import React from 'react';
import { AnimeFaction } from '@/types/game';

interface FactionBadgeProps {
  faction: AnimeFaction | 'mixed' | 'physical';
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
  physical: '#FFFFFF',
  mixed: '#6666AA'
};

const FACTION_NAMES: Record<string, string> = {
  naruto: 'Naruto',
  jjk: 'JJK',
  onepiece: 'One Piece',
  bleach: 'Bleach',
  blackclover: 'Black Clover',
  dragonball: 'Dragon Ball',
  demonslayer: 'Demon Slayer',
  hunterxhunter: 'Hunter x Hunter',
  physical: 'Physical',
  mixed: 'Mixed'
};

export const FactionBadge: React.FC<FactionBadgeProps> = ({ faction, size = 'md' }) => {
  const color = FACTION_COLORS[faction] || '#6666AA';
  const name = FACTION_NAMES[faction] || faction;
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center font-['Rajdhani'] font-semibold uppercase tracking-wider rounded ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 8px ${color}20`
      }}
    >
      {name}
    </span>
  );
};
