import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, timeAgo } from '@/lib/gameUtils';
import { FACTION_NAMES } from '@/types/game';
import { Search, Plus, Send, ArrowLeft, AlertTriangle, Circle } from 'lucide-react';

const Messages = () => {
  const { currentUser, users, messages, sendMessage } = useGame();
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState<number | null>(userId ? Number(userId) : null);
  const [msgText, setMsgText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  if (!currentUser) return null;

  const getUser = (id: number) => users.find(u => u.id === id) || (currentUser.id === id ? currentUser : null);

  // Get unique conversations
  const convos = Array.from(new Set(
    messages
      .filter(m => m.fromId === currentUser.id || m.toId === currentUser.id)
      .map(m => m.fromId === currentUser.id ? m.toId : m.fromId)
  )).map(uid => {
    const userMsgs = messages.filter(m =>
      (m.fromId === currentUser.id && m.toId === uid) || (m.fromId === uid && m.toId === currentUser.id)
    );
    const last = userMsgs[userMsgs.length - 1];
    const unread = userMsgs.filter(m => m.fromId === uid && !m.read).length;
    return { userId: uid, lastMsg: last, unread };
  }).sort((a, b) => (b.lastMsg?.timestamp || 0) - (a.lastMsg?.timestamp || 0));

  const handleSend = () => {
    if (!msgText.trim() || !selectedUser) return;
    sendMessage(selectedUser, msgText.trim());
    setMsgText('');
  };

  const chatUser = selectedUser ? getUser(selectedUser) : null;
  const chatMessages = selectedUser ? messages.filter(m =>
    (m.fromId === currentUser.id && m.toId === selectedUser) || (m.fromId === selectedUser && m.toId === currentUser.id)
  ).sort((a, b) => a.timestamp - b.timestamp) : [];

  if (selectedUser && chatUser) {
    const chatColor = getFactionColor(chatUser.anime);
    return (
      <div className="page-enter max-w-2xl mx-auto p-4 md:p-6 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 rounded-t-lg" style={{ background: '#080812', border: '1px solid #1A1A2E', borderBottom: 'none' }}>
          <button onClick={() => setSelectedUser(null)} className="shrink-0" style={{ color: '#6666AA' }}>
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold relative"
            style={{ background: `${chatColor}20`, border: `2px solid ${chatColor}`, color: chatColor }}>
            {chatUser.username[0]}
            <Circle size={8} fill="#00FF88" strokeWidth={0} className="absolute -bottom-0.5 -right-0.5" />
          </div>
          <div className="flex-1">
            <div className="font-body text-sm font-bold flex items-center gap-2" style={{ color: '#E8E8FF' }}>
              {chatUser.username}
              <span className="px-1 py-0.5 rounded font-body" style={{ background: `${chatColor}15`, color: chatColor, fontSize: '9px' }}>
                {FACTION_NAMES[chatUser.anime]}
              </span>
              {chatUser.bountyActive && <AlertTriangle size={12} style={{ color: '#FF003C' }} />}
            </div>
            <div className="font-body text-xs" style={{ color: '#6666AA' }}>{chatUser.roleTag || 'Online'}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#050510' }}>
          {chatMessages.map(m => {
            const isMine = m.fromId === currentUser.id;
            const bubbleColor = isMine ? factionColor : chatColor;
            return (
              <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[70%] px-4 py-2.5 rounded-xl font-body text-sm"
                  style={{
                    background: isMine ? `${bubbleColor}20` : '#0D0D1A',
                    border: `1px solid ${isMine ? `${bubbleColor}40` : '#1A1A2E'}`,
                    color: '#E8E8FF',
                    boxShadow: `0 0 10px ${bubbleColor}10`,
                  }}>
                  {m.text}
                  <div className="font-body mt-1" style={{ color: '#333355', fontSize: '10px' }}>{timeAgo(m.timestamp)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex gap-2 p-4 rounded-b-lg" style={{ background: '#080812', border: '1px solid #1A1A2E', borderTop: 'none' }}>
          <input value={msgText} onChange={e => setMsgText(e.target.value)}
            className="flex-1 rounded-lg font-body text-sm focus:outline-none"
            style={{ background: '#0D0D1A', border: `1px solid ${factionColor}30`, color: '#E8E8FF', padding: '12px 16px' }}
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}
            className="p-3 rounded-lg"
            style={{ background: `${factionColor}20`, color: factionColor }}>
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    );
  }

  // Conversations list
  const filteredUsers = searchQuery
    ? users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="page-enter max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold tracking-wider" style={{ color: '#E8E8FF' }}>MESSAGES</h1>
        <button className="p-2 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E', color: factionColor }}>
          <Plus size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#333355' }} />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg font-body text-sm focus:outline-none"
          style={{ background: '#080812', border: '1px solid #1A1A2E', color: '#E8E8FF' }}
          placeholder="Search users..."
        />
      </div>

      {searchQuery && filteredUsers.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden" style={{ border: '1px solid #1A1A2E' }}>
          {filteredUsers.map(u => {
            const uColor = getFactionColor(u.anime);
            return (
              <button key={u.id} onClick={() => { setSelectedUser(u.id); setSearchQuery(''); }}
                className="w-full flex items-center gap-3 p-3 hover:brightness-110 transition-all"
                style={{ background: '#080812' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold"
                  style={{ background: `${uColor}20`, border: `1px solid ${uColor}`, color: uColor }}>{u.username[0]}</div>
                <span className="font-body text-sm" style={{ color: '#E8E8FF' }}>{u.username}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Conversations */}
      <div className="space-y-2">
        {convos.map((c, i) => {
          const user = getUser(c.userId);
          if (!user) return null;
          const uColor = getFactionColor(user.anime);
          return (
            <button key={c.userId} onClick={() => setSelectedUser(c.userId)}
              className="w-full flex items-center gap-3 p-4 rounded-lg transition-all hover:brightness-110 stagger-item"
              style={{ animationDelay: `${i * 50}ms`, background: '#080812', border: `1px solid ${c.unread > 0 ? `${factionColor}30` : '#1A1A2E'}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-bold shrink-0 relative"
                style={{ background: `${uColor}20`, border: `2px solid ${uColor}`, color: uColor }}>
                {user.username[0]}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>{user.username}</span>
                  <span className="font-body text-xs" style={{ color: '#333355' }}>{c.lastMsg ? timeAgo(c.lastMsg.timestamp) : ''}</span>
                </div>
                <p className="font-body text-xs truncate" style={{ color: '#6666AA' }}>
                  {c.lastMsg?.text || 'No messages yet'}
                </p>
              </div>
              {c.unread > 0 && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: '#FF003C', color: '#fff' }}>
                  {c.unread}
                </span>
              )}
            </button>
          );
        })}
        {convos.length === 0 && (
          <p className="font-body text-sm text-center py-8" style={{ color: '#6666AA' }}>No conversations yet. Search for a user to start one.</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
