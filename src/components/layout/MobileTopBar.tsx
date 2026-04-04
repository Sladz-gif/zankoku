import { useState } from 'react';
import { Bell, MessageSquare, Menu } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';

interface MobileTopBarProps {
  onMenuToggle: () => void;
}

const MobileTopBar = ({ onMenuToggle }: MobileTopBarProps) => {
  const { currentUser, notifications, enhancedMessages } = useGame();
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = enhancedMessages.filter(m => 
    m.fromId !== currentUser?.id && !m.read
  ).length;

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
      style={{
        background: 'rgba(8, 8, 18, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="touch-target p-2 -ml-2"
          aria-label="Toggle menu"
        >
          <Menu size={20} style={{ color: 'var(--text-primary)' }} />
        </button>
        <div className="flex items-center gap-1">
          <span 
            className="font-black text-lg"
            style={{ 
              fontFamily: 'Orbitron, monospace',
              color: '#FF003C',
              textShadow: '0 0 10px rgba(255, 0, 60, 0.5)'
            }}
          >
            残酷
          </span>
          <span 
            className="font-bold text-sm tracking-wider"
            style={{ 
              fontFamily: 'Orbitron, monospace',
              color: 'var(--text-primary)'
            }}
          >
            ZANKOKU
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="touch-target relative p-2 -mr-2" aria-label="Notifications">
          <Bell size={20} style={{ color: 'var(--text-primary)' }} />
          {unreadNotificationsCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold badge-pop"
              style={{ 
                background: 'var(--neon-red)', 
                color: '#fff',
                minWidth: '20px',
                height: '20px'
              }}
            >
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Messages */}
        <button className="touch-target relative p-2 -mr-2" aria-label="Messages">
          <MessageSquare size={20} style={{ color: 'var(--text-primary)' }} />
          {unreadMessagesCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold badge-pop"
              style={{ 
                background: 'var(--neon-red)', 
                color: '#fff',
                minWidth: '20px',
                height: '20px'
              }}
            >
              {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        {currentUser && (
          <button 
            className="touch-target w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm btn-press"
            style={{ 
              background: `${factionColor}20`,
              border: `2px solid ${factionColor}`,
              color: factionColor,
              fontFamily: 'Orbitron, monospace'
            }}
            aria-label="Go to profile"
          >
            {currentUser.username[0]?.toUpperCase()}
          </button>
        )}
      </div>
    </header>
  );
};

export default MobileTopBar;
