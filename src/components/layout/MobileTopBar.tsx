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
    <header className="mobile-top-bar">
      {/* Left: Logo */}
      <div className="mobile-top-bar-left">
        <button
          onClick={onMenuToggle}
          className="mobile-top-bar-icon-btn"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div className="mobile-top-bar-logo">
          <span className="sidebar-logo-kanji">残酷</span>
          <span className="sidebar-logo-text hidden sm:block">ZANKOKU</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="mobile-top-bar-right">
        {/* User Avatar */}
        {currentUser && (
          <button 
            className="mobile-top-bar-avatar"
            style={{ 
              background: `${factionColor}20`,
              borderColor: factionColor,
              color: factionColor
            }}
            aria-label="Go to profile"
            onClick={() => window.location.href = '/profile'}
          >
            {currentUser.username[0]?.toUpperCase()}
          </button>
        )}
      </div>
    </header>
  );
};

export default MobileTopBar;
