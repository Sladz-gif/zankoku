import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, timeAgo } from '@/lib/gameUtils';
import { Swords, AlertTriangle, Target, Flame, UserPlus, MessageCircle, Heart, Repeat2, EyeOff, Award, TrendingUp, Skull, CheckCircle, Bell, ArrowLeft } from 'lucide-react';

const ICON_MAP: Record<string, { Icon: any; color: string }> = {
  duel_challenge: { Icon: Swords, color: '#FF003C' },
  bounty_placed: { Icon: AlertTriangle, color: '#FF003C' },
  bounty_claimed: { Icon: Target, color: '#FFD700' },
  war_declared: { Icon: Flame, color: '#FF6B00' },
  followed: { Icon: UserPlus, color: '#00C8FF' },
  comment: { Icon: MessageCircle, color: '#00C8FF' },
  like: { Icon: Heart, color: '#FF6B8A' },
  repost: { Icon: Repeat2, color: '#00FF88' },
  spy_detected: { Icon: EyeOff, color: '#8B00FF' },
  role_earned: { Icon: Award, color: '#FFD700' },
  rank_up: { Icon: TrendingUp, color: '#00FF88' },
  betrayed: { Icon: Skull, color: '#FF003C' },
};

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, users, currentUser } = useGame();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(() => window.innerWidth >= 768 && window.innerWidth < 1024);
  
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  // Demo notifications with proper navigation
  const demoNotifications = [
    {
      id: 1,
      type: 'duel_challenge',
      text: 'from the battle lobby challenged you to a duel!',
      timestamp: Date.now() - 1000 * 60 * 2,
      read: false,
      fromUserId: 1,
      link: '/game',
      anime: 'naruto'
    },
    {
      id: 2,
      type: 'duel_challenge',
      text: 'is waiting in the battle lobby for your duel response',
      timestamp: Date.now() - 1000 * 60 * 8,
      read: false,
      fromUserId: 2,
      link: '/game',
      anime: 'jjk'
    },
    {
      id: 3,
      type: 'duel_challenge',
      text: 'sent you a duel challenge from the battle arena',
      timestamp: Date.now() - 1000 * 60 * 12,
      read: false,
      fromUserId: 3,
      link: '/game',
      anime: 'onepiece'
    },
    {
      id: 4,
      type: 'duel_challenge',
      text: 'wants to battle you in the training grounds',
      timestamp: Date.now() - 1000 * 60 * 20,
      read: false,
      fromUserId: 4,
      link: '/game',
      anime: 'demonslayer'
    },
    {
      id: 5,
      type: 'duel_challenge',
      text: 'from the battle lobby accepted your duel request',
      timestamp: Date.now() - 1000 * 60 * 25,
      read: false,
      fromUserId: 5,
      link: '/game',
      anime: 'blackclover'
    },
    {
      id: 6,
      type: 'followed',
      text: 'started following you',
      timestamp: Date.now() - 1000 * 60 * 30,
      read: true,
      fromUserId: 6,
      link: '/feed',
      anime: 'dragonball'
    },
    {
      id: 7,
      type: 'comment',
      text: 'commented on your post: "Amazing technique!"',
      timestamp: Date.now() - 1000 * 60 * 45,
      read: true,
      fromUserId: 7,
      link: '/feed',
      anime: 'hxh'
    },
    {
      id: 8,
      type: 'like',
      text: 'liked your post "Epic Battle Showcase"',
      timestamp: Date.now() - 1000 * 60 * 60,
      read: true,
      fromUserId: 8,
      link: '/feed',
      anime: 'naruto'
    },
    {
      id: 9,
      type: 'bounty_claimed',
      text: 'You successfully claimed the bounty on PhantomMage',
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      read: true,
      fromUserId: null,
      link: '/bounties',
      anime: null
    },
    {
      id: 10,
      type: 'war_declared',
      text: 'Shadow Clan declared war on your clan!',
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
      read: true,
      fromUserId: null,
      link: '/clans',
      anime: null
    },
    {
      id: 11,
      type: 'rank_up',
      text: 'You reached Rank 5! New abilities unlocked.',
      timestamp: Date.now() - 1000 * 60 * 60 * 5,
      read: true,
      fromUserId: null,
      link: '/profile',
      anime: null
    },
    {
      id: 12,
      type: 'role_earned',
      text: 'You earned the "Duel Master" role!',
      timestamp: Date.now() - 1000 * 60 * 60 * 8,
      read: true,
      fromUserId: null,
      link: '/profile',
      anime: null
    }
  ];

  // Demo users
  const demoUsers = [
    { id: 1, username: 'NarutoUzumaki', anime: 'naruto' as const },
    { id: 2, username: 'GojoSatoru', anime: 'jjk' as const },
    { id: 3, username: 'LuffyCaptain', anime: 'onepiece' as const },
    { id: 4, username: 'IchigoKurosaki', anime: 'demonslayer' as const },
    { id: 5, username: 'AstaBlack', anime: 'blackclover' as const },
    { id: 6, username: 'GokuSaiyan', anime: 'dragonball' as const },
    { id: 7, username: 'KilluaZoldyck', anime: 'hxh' as const },
    { id: 8, username: 'SasukeUchiha', anime: 'naruto' as const }
  ];

  // Use demo notifications if real ones are empty
  const allNotifications = notifications.length > 0 ? notifications : demoNotifications;
  const allUsers = users.length > 0 ? users : demoUsers;

  // Responsive state management
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getUser = (id: number) => allUsers.find(u => u.id === id) || (currentUser?.id === id ? currentUser : null);

  const unreadCount = allNotifications.filter(n => !n.read).length;

  // Group notifications
  const now = Date.now();
  const today = allNotifications.filter(n => now - n.timestamp < 86400000);
  const yesterday = allNotifications.filter(n => now - n.timestamp >= 86400000 && now - n.timestamp < 86400000 * 2);
  const thisWeek = allNotifications.filter(n => now - n.timestamp >= 86400000 * 2 && now - n.timestamp < 86400000 * 7);

  const handleClick = (n: typeof allNotifications[0]) => {
    // Navigate to the appropriate page
    if (n.link) {
      navigate(n.link);
    }
  };

  const handleMarkAllRead = () => {
    // For demo purposes, this would mark all as read
    console.log('Mark all notifications as read');
  };

  const renderGroup = (title: string, items: typeof notifications) => {
    if (items.length === 0) return null;
    
    return (
      <div style={{
        marginBottom: isMobile ? '20px' : '24px'
      }}>
        <h3 style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: isMobile ? '3px' : '4px',
          textTransform: 'uppercase',
          marginBottom: isMobile ? '12px' : '16px'
        }}>
          {title}
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '8px' : '12px'
        }}>
          {items.map((n, i) => {
            const { Icon, color } = ICON_MAP[n.type] || { Icon: AlertTriangle, color: '#6666AA' };
            const fromUser = n.fromUserId ? getUser(n.fromUserId) : null;
            
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: isMobile ? '12px' : '16px',
                  padding: isMobile ? '12px' : '16px',
                  borderRadius: '12px',
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${!n.read ? `${color}30` : 'var(--border)'}`,
                  borderLeft: !n.read ? `3px solid ${color}` : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  WebkitTapHighlightColor: 'transparent',
                  animation: `staggerIn 0.4s ease-out ${i * 50}ms both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                <div style={{
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: `${color}20`,
                  border: `1px solid ${color}40`
                }}>
                  <Icon 
                    size={isMobile ? 16 : 18} 
                    strokeWidth={1.5} 
                    style={{ color }} 
                  />
                </div>
                
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <p style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: isMobile ? '14px' : '15px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                    wordBreak: 'break-word'
                  }}>
                    {fromUser && (
                      <span style={{ 
                        color: getFactionColor(fromUser.anime),
                        fontWeight: 700
                      }}>
                        {fromUser.username}
                      </span>
                    )}
                    {fromUser ? ` ${n.text.split(fromUser.username)[1] || n.text}` : ` ${n.text}`}
                  </p>
                  <span style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: isMobile ? '12px' : '13px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.5px'
                  }}>
                    {timeAgo(n.timestamp)}
                  </span>
                </div>
                
                {!n.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '4px',
                    background: color,
                    boxShadow: `0 0 8px ${color}40`
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'var(--bg-base)',
    padding: isMobile ? '16px' : isTablet ? '24px' : '32px',
    maxWidth: isMobile ? '100%' : isTablet ? '768px' : '1024px',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: isMobile ? '24px' : '32px',
    padding: isMobile ? '0 4px' : '0'
  };

  const titleStyle = {
    fontFamily: 'Orbitron, monospace',
    fontSize: isMobile ? '20px' : isTablet ? '24px' : '28px',
    fontWeight: 900,
    color: 'var(--text-primary)',
    letterSpacing: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const markAllButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: isMobile ? '8px 12px' : '10px 16px',
    background: `${factionColor}15`,
    border: `1px solid ${factionColor}30`,
    borderRadius: '8px',
    color: factionColor,
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '60px 20px' : '80px 40px',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes staggerIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Header */}
      <div style={headerStyle}>
        <div style={titleStyle}>
          NOTIFICATIONS
          {unreadCount > 0 && (
            <span style={{
              background: 'var(--neon-purple)',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: 700,
              fontFamily: 'Orbitron, monospace'
            }}>
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {allNotifications.length === 0 ? (
        <div style={emptyStateStyle}>
          <Bell 
            size={isMobile ? 48 : 64} 
            style={{ 
              color: 'var(--text-muted)', 
              opacity: 0.3,
              marginBottom: isMobile ? '16px' : '24px'
            }} 
          />
          <h2 style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: isMobile ? '18px' : '20px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: isMobile ? '12px' : '16px'
          }}>
            No Notifications
          </h2>
          <p style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: isMobile ? '14px' : '16px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '320px'
          }}>
            The silence before the storm. New notifications will appear here.
          </p>
        </div>
      ) : (
        <>
          {renderGroup('TODAY', today)}
          {renderGroup('YESTERDAY', yesterday)}
          {renderGroup('THIS WEEK', thisWeek)}
        </>
      )}
    </div>
  );
};

export default Notifications;
