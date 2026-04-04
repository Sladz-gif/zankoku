import React from 'react';
import { FactionBadge } from './FactionBadge';
import { RoleTag } from './RoleTag';
import { AnimeFaction } from '@/types/game';

interface UserRowProps {
  userId: number;
  username: string;
  avatar: number;
  faction: AnimeFaction | 'physical';
  roleTag?: string;
  factionColor: string;
  actionButton?: React.ReactNode;
  onClick?: () => void;
}

export const UserRow: React.FC<UserRowProps> = ({
  username,
  avatar,
  faction,
  roleTag,
  factionColor,
  actionButton,
  onClick
}) => {
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-active)] transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center font-['Orbitron'] font-bold text-sm"
        style={{
          background: `linear-gradient(135deg, ${factionColor}40, ${factionColor}20)`,
          border: `2px solid ${factionColor}`,
          boxShadow: `0 0 12px ${factionColor}40`,
          color: factionColor
        }}
      >
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-['Rajdhani'] font-bold text-[var(--text-primary)] truncate">
            {username}
          </span>
          {roleTag && <RoleTag tag={roleTag} size="sm" />}
        </div>
        <FactionBadge faction={faction} size="sm" />
      </div>
      {actionButton && (
        <div onClick={(e) => e.stopPropagation()}>
          {actionButton}
        </div>
      )}
    </div>
  );
};
