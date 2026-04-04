import React from 'react';
import { Swords, Skull, Compass } from 'lucide-react';
import { Alignment } from '@/types/game';

interface AlignmentIconProps {
  alignment: Alignment;
  size?: number;
}

export const AlignmentIcon: React.FC<AlignmentIconProps> = ({ alignment, size = 18 }) => {
  const icons = {
    hero: Swords,
    villain: Skull,
    wanderer: Compass
  };

  const colors = {
    hero: 'var(--neon-blue)',
    villain: 'var(--neon-red)',
    wanderer: 'var(--neon-purple)'
  };

  const Icon = icons[alignment];
  const color = colors[alignment];

  return (
    <Icon
      size={size}
      strokeWidth={1.5}
      style={{ color }}
    />
  );
};
