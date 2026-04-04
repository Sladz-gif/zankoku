import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, timeAgo } from '@/lib/gameUtils';
import { Swords, AlertTriangle, Target, Flame, UserPlus, MessageCircle, Heart, Repeat2, EyeOff, Award, TrendingUp, Skull, CheckCircle } from 'lucide-react';

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
  const { notifications, markNotificationRead, markAllNotificationsRead, users, currentUser } = useGame();
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  const getUser = (id: number) => users.find(u => u.id === id) || (currentUser?.id === id ? currentUser : null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Group notifications
  const now = Date.now();
  const today = notifications.filter(n => now - n.timestamp < 86400000);
  const yesterday = notifications.filter(n => now - n.timestamp >= 86400000 && now - n.timestamp < 86400000 * 2);
  const thisWeek = notifications.filter(n => now - n.timestamp >= 86400000 * 2 && now - n.timestamp < 86400000 * 7);

  const handleClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    if (n.link) navigate(n.link);
  };

  const renderGroup = (title: string, items: typeof notifications) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="font-display text-xs font-bold tracking-widest mb-3" style={{ color: '#333355', letterSpacing: '4px' }}>{title}</h3>
        <div className="space-y-2">
          {items.map((n, i) => {
            const { Icon, color } = ICON_MAP[n.type] || { Icon: AlertTriangle, color: '#6666AA' };
            const fromUser = n.fromUserId ? getUser(n.fromUserId) : null;
            return (
              <button key={n.id} onClick={() => handleClick(n)}
                className="w-full flex items-start gap-3 p-4 rounded-lg transition-all hover:brightness-110 text-left stagger-item"
                style={{
                  animationDelay: `${i * 30}ms`,
                  background: '#080812',
                  border: `1px solid ${!n.read ? `${color}30` : '#1A1A2E'}`,
                  borderLeft: !n.read ? `3px solid ${color}` : '3px solid transparent',
                }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                  <Icon size={16} strokeWidth={1.5} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm" style={{ color: '#E8E8FF' }}>
                    {fromUser && <span style={{ color: getFactionColor(fromUser.anime) }}>{fromUser.username}</span>}
                    {fromUser ? ` ${n.text.split(fromUser.username)[1] || n.text}` : ` ${n.text}`}
                  </p>
                  <span className="font-body text-xs" style={{ color: '#333355' }}>{timeAgo(n.timestamp)}</span>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: '#FF003C' }} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="page-enter max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold tracking-wider" style={{ color: '#E8E8FF' }}>NOTIFICATIONS</h1>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded font-body text-xs font-semibold"
            style={{ background: `${factionColor}15`, color: factionColor }}>
            <CheckCircle size={14} strokeWidth={1.5} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-body text-sm italic" style={{ color: '#333355' }}>The silence before the storm.</p>
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
