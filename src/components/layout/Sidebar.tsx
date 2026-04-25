import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow } from '@/lib/gameUtils';
import { Newspaper, User, Shield, Swords, Target, BookOpen, MessageSquare, ShoppingBag, Trophy, Bell, Coins, Zap, X, ChevronUp, Radio, Heart, School } from 'lucide-react';
import SupportSidebar from './SupportSidebar';

const NAV_ITEMS = [
  { path: '/feed', icon: Newspaper, label: 'Feed' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/clans', icon: Shield, label: 'Clans' },
  { path: '/battle-lobby', icon: Swords, label: 'Battle Lobby' },
  { path: '/bounties', icon: Target, label: 'Bounties' },
  { path: '/messages', icon: MessageSquare, label: 'Chat' },
  { path: '/manga', icon: BookOpen, label: 'Manga' },
  { path: '/store', icon: ShoppingBag, label: 'Store' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/anime-news', icon: Radio, label: 'Anime News' },
];

const MOBILE_NAV = [
  { path: '/feed', icon: Newspaper, label: 'Feed' },
  { path: '/clans', icon: Shield, label: 'Clans' },
  { path: '/battle-lobby', icon: Swords, label: 'Battle' },
  { path: '/messages', icon: MessageSquare, label: 'Chat' },
];

const MORE_MENU_ITEMS = [
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/bounties', icon: Target, label: 'Bounties' },
  { path: '/manga', icon: BookOpen, label: 'Manga' },
  { path: '/store', icon: ShoppingBag, label: 'Store' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/notifications', icon: Bell, label: 'Alerts' },
  { path: '/anime-news', icon: Radio, label: 'Anime News' },
];

interface SidebarProps {
  variant?: 'desktop' | 'rail' | 'bottom' | 'mobile';
}

const Sidebar = ({ variant = 'desktop' }: SidebarProps) => {
  const { currentUser, notifications, enhancedMessages } = useGame();
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';
  const factionGlow = currentUser ? getFactionGlow(currentUser.anime) : '#BF5FFF';
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = enhancedMessages.filter(m => 
    m.fromId !== currentUser?.id && !m.read
  ).length;

  // Desktop Sidebar
  if (variant === 'desktop') {
    return (
      <aside className="app-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-kanji">残酷</span>
          <span className="sidebar-logo-text">ZANKOKU</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const showBadge = (item.path === '/notifications' && unreadNotificationsCount > 0) || 
                     (item.path === '/messages' && unreadMessagesCount > 0);
            const badgeCount = item.path === '/notifications' ? unreadNotificationsCount : unreadMessagesCount;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="sidebar-label">{item.label}</span>
                {showBadge && (
                  <span 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold badge-pop"
                    style={{ 
                      background: 'var(--neon-red)', 
                      color: '#fff',
                      minWidth: '20px',
                      height: '20px'
                    }}
                  >
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        {currentUser && (
          <div className="sidebar-footer">
            <div className="sidebar-user-row">
              <div 
                className="sidebar-avatar"
                style={{ 
                  background: `${factionColor}20`, 
                  borderColor: factionColor, 
                  color: factionColor
                }}
              >
                {currentUser.username[0]?.toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-username">{currentUser.username}</div>
                <div className="sidebar-rank">Rank #{currentUser.rank}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    );
  }

  // Tablet Icon Rail
  if (variant === 'rail') {
    return (
      <aside className="app-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-kanji">残酷</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const showBadge = (item.path === '/notifications' && unreadNotificationsCount > 0) || 
                     (item.path === '/messages' && unreadMessagesCount > 0);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon 
                  size={20} 
                  strokeWidth={1.5} 
                />
                {showBadge && (
                  <span 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold badge-pop"
                    style={{ 
                      background: 'var(--neon-red)', 
                      color: '#fff'
                    }}
                  >
                    {item.path === '/notifications' ? 
                      (unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount) :
                      (unreadMessagesCount > 9 ? '9+' : unreadMessagesCount)
                    }
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
        
        {/* Support Zankoku - tablet rail */}
        <div className="flex justify-center px-2 py-2 border-t border-[#1A1A2E]">
          <a
            href="/support"
            className="w-11 h-11 flex items-center justify-center rounded-full text-[#8B00FF] transition-colors hover:bg-[rgba(139,0,255,0.1)] -webkit-tap-highlight-color-transparent"
            title="Support Zankoku"
          >
            <Heart size={18} />
          </a>
        </div>
      </aside>
    );
  }

  // Mobile Sidebar (slide-out)
  if (variant === 'mobile') {
    return (
      <aside className="app-sidebar mobile-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-kanji">残酷</span>
          <span className="sidebar-logo-text">ZANKOKU</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const showBadge = (item.path === '/notifications' && unreadNotificationsCount > 0) || 
                     (item.path === '/messages' && unreadMessagesCount > 0);
            const badgeCount = item.path === '/notifications' ? unreadNotificationsCount : unreadMessagesCount;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="sidebar-label">{item.label}</span>
                {showBadge && (
                  <span 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold badge-pop"
                    style={{ 
                      background: 'var(--neon-red)', 
                      color: '#fff',
                      minWidth: '20px',
                      height: '20px'
                    }}
                  >
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        {currentUser && (
          <div className="sidebar-footer">
            <div className="sidebar-user-row">
              <div 
                className="sidebar-avatar"
                style={{ 
                  background: `${factionColor}20`, 
                  borderColor: factionColor, 
                  color: factionColor
                }}
              >
                {currentUser.username[0]?.toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-username">{currentUser.username}</div>
                <div className="sidebar-rank">Rank #{currentUser.rank}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    );
  }

  // Mobile Bottom Navigation
  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {MOBILE_NAV.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span className="bottom-nav-label">{item.label}</span>
              {isActive && <span className="bottom-nav-dot" />}
            </NavLink>
          );
        })}
        
        {/* Notifications */}
        <NavLink 
          to="/notifications" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="relative">
            <Bell size={22} strokeWidth={1.5} />
            {unreadNotificationsCount > 0 && (
              <span className="notification-dot" />
            )}
          </div>
          <span className="bottom-nav-label">Alerts</span>
          {location.pathname === '/notifications' && <span className="bottom-nav-dot" />}
        </NavLink>
      </nav>

      {/* More Menu Bottom Sheet */}
      {isMoreMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          
          {/* Bottom Sheet */}
          <div className={`bottom-drawer ${isMoreMenuOpen ? 'open' : ''}`}>
            {/* Handle */}
            <div className="bottom-drawer-handle" />
            
            {/* Menu Items */}
            {MORE_MENU_ITEMS.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const showBadge = (item.path === '/notifications' && unreadNotificationsCount > 0);
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="bottom-drawer-item"
                >
                  <Icon size={20} strokeWidth={1.5} />
                  <span>{item.label}</span>
                  {showBadge && (
                    <span 
                      className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ 
                        background: 'var(--neon-red)', 
                        color: '#fff' 
                      }}
                    >
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
