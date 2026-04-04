import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { MessageCircle, Send, Users, Bell, Star, Shield, Swords, BookOpen, Trophy, Target } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'system' | 'battle' | 'clan' | 'manga' | 'friend';
  read: boolean;
}

const MessagesSidebar = () => {
  const { currentUser, notifications } = useGame();
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize empty messages array
  useEffect(() => {
    setMessages([]);
  }, []);

  const unreadCount = messages.filter(m => !m.read).length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Bell size={14} className="text-blue-400" />;
      case 'battle': return <Swords size={14} className="text-red-400" />;
      case 'clan': return <Shield size={14} className="text-green-400" />;
      case 'manga': return <BookOpen size={14} className="text-orange-400" />;
      case 'friend': return <Users size={14} className="text-purple-400" />;
      default: return <MessageCircle size={14} className="text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return '#3B82F6';
      case 'battle': return '#EF4444';
      case 'clan': return '#10B981';
      case 'manga': return '#F59E0B';
      case 'friend': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="h-full flex flex-col bg-zankoku-dark border-l border-zankoku-purple" style={{ background: '#0D0D1A', borderLeft: '1px solid #8B00FF' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ background: '#1A1A2E', borderColor: '#8B00FF40' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-purple-400" />
            <h3 className="font-display text-sm font-bold" style={{ color: '#E8E8FF' }}>CHAT</h3>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: '#FF003C', color: '#FFFFFF' }}>
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'messages' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <MessageCircle size={12} className="inline mr-1" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all relative ${
              activeTab === 'notifications' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Bell size={12} className="inline mr-1" />
            Alerts
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'messages' && (
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-3">
              {messages.map((message, idx) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg transition-all hover:scale-[1.02] ${
                    !message.read ? 'border-l-4' : ''
                  }`}
                  style={{ 
                    background: '#1A1A2E', 
                    borderLeft: !message.read ? `4px solid ${getTypeColor(message.type)}` : '1px solid #2D3748'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(message.type)}
                      <span className="font-display text-sm font-bold" style={{ color: '#E8E8FF' }}>
                        {message.sender}
                      </span>
                      {!message.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <span className="text-xs" style={{ color: '#6666AA' }}>
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: '#E8E8FF', lineHeight: '1.4' }}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell size={32} className="mx-auto mb-3 text-gray-500" />
                  <p className="text-sm" style={{ color: '#6666AA' }}>No new notifications</p>
                </div>
              ) : (
                notifications.map((notification, idx) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg transition-all hover:scale-[1.02] ${
                      !notification.read ? 'border-l-4' : ''
                    }`}
                    style={{ 
                      background: '#1A1A2E', 
                      borderLeft: !notification.read ? `4px solid #FFD700` : '1px solid #2D3748'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-400" />
                        <span className="font-display text-sm font-bold" style={{ color: '#E8E8FF' }}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs" style={{ color: '#6666AA' }}>
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: '#E8E8FF', lineHeight: '1.4' }}>
                      {notification.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Status */}
      {currentUser && (
        <div className="p-4 border-t" style={{ background: '#1A1A2E', borderColor: '#8B00FF40' }}>
          <div className="text-center">
            <div className="font-display text-sm font-bold mb-1" style={{ color: '#E8E8FF' }}>
              {currentUser.username}
            </div>
            <div className="text-xs" style={{ color: '#6666AA' }}>
              Rank #{currentUser.rank} • {currentUser.points} Points
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <div className="text-center">
                <div className="text-xs" style={{ color: '#6666AA' }}>Battles</div>
                <div className="font-display text-sm font-bold" style={{ color: '#FF003C' }}>
                  {currentUser.duelsWon + currentUser.duelsLost}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs" style={{ color: '#6666AA' }}>Win Rate</div>
                <div className="font-display text-sm font-bold" style={{ color: '#00FF88' }}>
                  {currentUser.duelsWon > 0 ? Math.round((currentUser.duelsWon / (currentUser.duelsWon + currentUser.duelsLost)) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesSidebar;
