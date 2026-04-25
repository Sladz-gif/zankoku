import { useState } from 'react';
import { Bell, Check, X, Users, Trophy, Target, MessageCircle, Shield } from 'lucide-react';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'clan_invite' | 'bounty' | 'duel' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: JSX.Element;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      title: 'New Like',
      message: 'NinjaMaster liked your post "Epic Battle Showcase"',
      time: '2m ago',
      read: false,
      icon: <Trophy size={16} />
    },
    {
      id: 2,
      type: 'comment',
      title: 'New Comment',
      message: 'DragonSlayer commented: "Amazing technique usage!"',
      time: '15m ago',
      read: false,
      icon: <MessageCircle size={16} />
    },
    {
      id: 3,
      type: 'follow',
      title: 'New Follower',
      message: 'PirateKing started following you',
      time: '1h ago',
      read: true,
      icon: <Users size={16} />
    },
    {
      id: 4,
      type: 'clan_invite',
      title: 'Clan Invitation',
      message: 'Shadow Warriors invited you to join their clan',
      time: '2h ago',
      read: true,
      icon: <Shield size={16} />
    },
    {
      id: 5,
      type: 'bounty',
      title: 'Bounty Completed',
      message: 'You successfully claimed the bounty on PhantomMage',
      time: '3h ago',
      read: true,
      icon: <Target size={16} />
    },
    {
      id: 6,
      type: 'duel',
      title: 'Duel Challenge',
      message: 'CursedSorcerer challenged you to a duel',
      time: '5h ago',
      read: true,
      icon: <Trophy size={16} />
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="notifications-title">
          NOTIFICATIONS
          {unreadCount > 0 && (
            <span style={{ 
              background: 'var(--neon-red)', 
              color: 'white', 
              padding: '2px 6px', 
              borderRadius: '10px', 
              fontSize: '11px',
              marginLeft: '8px'
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <button className="mark-all-read-btn" onClick={markAllAsRead}>
          <Check size={14} style={{ marginRight: '4px' }} />
          Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <div className="empty-state-title">NO NOTIFICATIONS</div>
          <div className="empty-state-body">
            You're all caught up! New notifications will appear here.
          </div>
        </div>
      ) : (
        <>
          <div className="notification-group-label">TODAY</div>
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-icon-wrap">
                {notification.icon}
              </div>
              <div className="notification-content">
                <div className="notification-text">{notification.message}</div>
                <div className="notification-time">{notification.time}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
