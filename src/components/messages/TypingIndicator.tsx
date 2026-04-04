import React from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/sharedUtils';

interface TypingIndicatorProps {
  userId: number;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userId }) => {
  const { users, currentUser } = useGame();
  
  const typingUser = users.find(u => u.id === userId);
  if (!typingUser || !currentUser) return null;
  
  const factionColor = getFactionColor(typingUser.anime);
  
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Avatar */}
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
        style={{ background: `${factionColor}20`, border: `2px solid ${factionColor}` }}
      >
        {typingUser.username[0]}
      </div>
      
      {/* Typing bubble */}
      <div 
        className="px-3 py-2 rounded-2xl"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-active)',
          borderRadius: '4px 16px 16px 16px'
        }}
      >
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
