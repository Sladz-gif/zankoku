import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow } from '@/lib/gameUtils';
import { Newspaper, User, Shield, Swords, Target, BookOpen, MessageSquare, ShoppingBag, Trophy, Bell, Coins, Zap, X, ChevronUp, Radio } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/feed', icon: Newspaper, label: 'Feed' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/clans', icon: Shield, label: 'Clans' },
  { path: '/battle', icon: Swords, label: 'Battle Lobby' },
  { path: '/bounties', icon: Target, label: 'Bounties' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/manga', icon: BookOpen, label: 'Manga' },
  { path: '/store', icon: ShoppingBag, label: 'Store' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/anime-news', icon: Radio, label: 'Anime News' },
];

const MOBILE_NAV = [
  { path: '/feed', icon: Newspaper, label: 'Feed' },
  { path: '/clans', icon: Shield, label: 'Clans' },
  { path: '/battle', icon: Swords, label: 'Battle' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
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
  variant?: 'desktop' | 'rail' | 'bottom';
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
      <aside 
        className="hidden lg:flex flex-col w-60 min-h-screen fixed left-0 top-0 z-40"
        style={{ 
          background: 'var(--bg-surface)', 
          borderRight: '1px solid var(--border)',
          padding: '20px 12px'
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <span 
            className="font-black text-xl"
            style={{ 
              fontFamily: 'Orbitron, monospace',
              color: '#FF003C', 
              textShadow: '0 0 20px rgba(255,0,60,0.5)' 
            }}
          >
            残酷
          </span>
          <span 
            className="font-bold text-base tracking-wider"
            style={{ 
              fontFamily: 'Orbitron, monospace',
              color: 'var(--text-primary)' 
            }}
          >
            ZANKOKU
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
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
                className="flex items-center gap-3 px-3 py-3 rounded-md font-semibold transition-all duration-200 relative touch-target btn-press"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  borderLeft: isActive ? `2px solid ${factionColor}` : '2px solid transparent',
                  minHeight: '44px'
                }}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span>{item.label}</span>
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
          <div 
            className="rounded-lg p-4"
            style={{ 
              background: 'var(--bg-elevated)', 
              border: '1px solid var(--border)' 
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ 
                  background: `${factionColor}20`, 
                  border: `2px solid ${factionColor}`, 
                  color: factionColor,
                  fontFamily: 'Orbitron, monospace'
                }}
              >
                {currentUser.username[0]?.toUpperCase()}
              </div>
              <div>
                <div 
                  className="font-bold text-sm"
                  style={{ 
                    fontFamily: 'Rajdhani, sans-serif',
                    color: 'var(--text-primary)' 
                  }}
                >
                  {currentUser.username}
                </div>
                <div 
                  className="text-xs"
                  style={{ 
                    fontFamily: 'Rajdhani, sans-serif',
                    color: 'var(--text-secondary)' 
                  }}
                >
                  Rank #{currentUser.rank}
                </div>
              </div>
            </div>
            
            {/* Currency Balances */}
            <div className="flex gap-2 mb-3">
              <div 
                className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{ 
                  background: 'var(--bg-elevated)', 
                  border: '1px solid #CD7F32' 
                }}
              >
                <Coins size={12} strokeWidth={1.5} style={{ color: '#CD7F32' }} />
                <span 
                  className="text-xs font-semibold"
                  style={{ 
                    fontFamily: 'Rajdhani, sans-serif',
                    color: '#CD7F32' 
                  }}
                >
                  {currentUser.currency.bronze}
                </span>
              </div>
              <div 
                className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{ 
                  background: 'var(--bg-elevated)', 
                  border: '1px solid #C0C0C0' 
                }}
              >
                <Coins size={12} strokeWidth={1.5} style={{ color: '#C0C0C0' }} />
                <span 
                  className="text-xs font-semibold"
                  style={{ 
                    fontFamily: 'Rajdhani, sans-serif',
                    color: '#C0C0C0' 
                  }}
                >
                  {currentUser.currency.silver}
                </span>
              </div>
              <div 
                className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{ 
                  background: 'var(--bg-elevated)', 
                  border: '1px solid #FFD700' 
                }}
              >
                <Coins size={12} strokeWidth={1.5} style={{ color: '#FFD700' }} />
                <span 
                  className="text-xs font-semibold"
                  style={{ 
                    fontFamily: 'Rajdhani, sans-serif',
                    color: '#FFD700' 
                  }}
                >
                  {currentUser.currency.gold}
                </span>
              </div>
            </div>
            
            {/* Resource Bar */}
            <NavLink to="/store/resources" className="block">
              <div className="h-1 rounded-full overflow-hidden cursor-pointer" style={{ background: 'var(--border)' }}>
                <div 
                  className="h-full rounded-full resource-bar"
                  style={{ 
                    width: `${currentUser.resource}%`, 
                    background: `linear-gradient(90deg, ${factionColor}, ${factionGlow})` 
                  }} 
                />
              </div>
            </NavLink>
          </div>
        )}
      </aside>
    );
  }

  // Tablet Icon Rail
  if (variant === 'rail') {
    return (
      <aside 
        className="hidden md:flex lg:hidden flex-col w-15 min-h-screen fixed left-0 top-0 z-40"
        style={{ 
          background: 'var(--bg-surface)', 
          borderRight: '1px solid var(--border)',
          padding: '20px 0',
          width: '60px'
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <span 
            className="font-black text-lg"
            style={{ 
              fontFamily: 'Orbitron, monospace',
              color: '#FF003C', 
              textShadow: '0 0 20px rgba(255,0,60,0.5)' 
            }}
          >
            残酷
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-2 px-2">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const showBadge = (item.path === '/notifications' && unreadNotificationsCount > 0) || 
                     (item.path === '/messages' && unreadMessagesCount > 0);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative group touch-target btn-press"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '6px',
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  borderLeft: isActive ? `2px solid ${factionColor}` : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                title={item.label}
              >
                <Icon 
                  size={20} 
                  strokeWidth={1.5} 
                  style={{ 
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' 
                  }} 
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
                
                {/* Tooltip */}
                <div 
                  className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Rajdhani, sans-serif'
                  }}
                >
                  {item.label}
                </div>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    );
  }

  // Mobile Bottom Navigation
  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2"
        style={{
          height: '64px',
          background: 'rgba(8, 8, 18, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.5)',
          paddingBottom: 'env(safe-area-inset-bottom, 6px)',
          paddingTop: '6px',
        }}
      >
        {MOBILE_NAV.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className="flex flex-col items-center gap-1 relative touch-target btn-press"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: isActive ? factionColor : 'var(--text-muted)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease',
                minHeight: '44px',
                justifyContent: 'center',
                padding: '2px',
              }}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span 
                className="text-[10px] font-semibold uppercase tracking-[1px]"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {item.label}
              </span>
              {isActive && (
                <span 
                  className="absolute -bottom-1 w-1 h-1 rounded-full" 
                  style={{ 
                    background: factionColor, 
                    boxShadow: `0 0 6px ${factionColor}` 
                  }} 
                />
              )}
            </NavLink>
          );
        })}
        
        {/* More Menu */}
        <button 
          className="flex flex-col items-center gap-1 relative touch-target btn-press"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            color: location.pathname === '/notifications' ? factionColor : 'var(--text-muted)',
            minHeight: '44px',
            justifyContent: 'center',
            padding: '2px',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
        >
          <div className="relative">
            <Bell size={22} strokeWidth={1.5} />
            {unreadNotificationsCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold badge-pop"
                style={{ 
                  background: 'var(--neon-red)', 
                  color: '#fff'
                }}
              >
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </div>
          <span 
            className="text-[10px] font-semibold uppercase tracking-[1px]"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Alerts
          </span>
        </button>
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
          <div 
            className="md:hidden fixed bottom-16 left-0 right-0 z-50 rounded-t-2xl max-h-[70vh] overflow-y-auto"
            style={{
              background: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-active)',
              padding: '20px 16px',
              paddingBottom: 'env(safe-area-inset-bottom, 20px)'
            }}
          >
            {/* Handle */}
            <div 
              className="w-8 h-1 rounded-full mx-auto mb-4"
              style={{ background: 'var(--border)' }}
            />
            
            {/* Menu Items */}
            <div className="space-y-2">
              {MORE_MENU_ITEMS.map(item => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const showBadge = (item.path === '/notifications' && unreadNotificationsCount > 0);
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-md touch-target btn-press"
                    style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-elevated)' : 'transparent',
                      minHeight: '44px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                    <span className="font-semibold">{item.label}</span>
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
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
