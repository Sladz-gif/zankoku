import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow, getRelativeTime, formatTimestamp } from '@/lib/sharedUtils';
import { isThreatMessage } from '@/lib/messagingUtils';
import { useClickOutside } from '@/hooks/useClickOutside';
import { 
  MessageSquare, Plus, Search, Circle, AlertTriangle, Swords, Shield, Skull, Users, X
} from 'lucide-react';

interface Conversation {
  userId: number;
  username: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: number;
  lastMessageType: 'text' | 'duel_challenge' | 'clan_invite' | 'threat' | 'alliance_proposal' | 'system';
  isOnline: boolean;
  unreadCount: number;
  hasBounty: boolean;
  faction: string;
}

const ConversationList: React.FC = () => {
  const navigate = useNavigate();
  const { enhancedMessages, users, currentUser, userPresences } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const modalContainerRef = useClickOutside({
    isOpen: showNewMessageModal,
    onClose: () => setShowNewMessageModal(false)
  });
  
  // Derive conversations from messages
  const conversations = useMemo(() => {
    if (!currentUser) return [];
    
    // Group messages by conversation partner
    const messageGroups = enhancedMessages.reduce((acc, message) => {
      const partnerId = message.fromId === currentUser.id ? message.toId : message.fromId;
      if (!acc[partnerId]) {
        acc[partnerId] = [];
      }
      acc[partnerId].push(message);
      return acc;
    }, {} as Record<number, typeof enhancedMessages>);
    
    // Create conversation objects
    const convs: Conversation[] = Object.entries(messageGroups).map(([partnerId, messages]) => {
      const partner = users.find(u => u.id === parseInt(partnerId));
      const presence = userPresences.find(p => p.userId === parseInt(partnerId));
      
      // Sort messages by timestamp
      const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);
      const lastMessage = sortedMessages[0];
      
      // Count unread messages
      const unreadCount = messages.filter(m => 
        m.fromId === parseInt(partnerId) && !m.read
      ).length;
      
      return {
        userId: parseInt(partnerId),
        username: partner?.username || `User ${partnerId}`,
        avatar: partner?.username?.[0] || '?',
        lastMessage: lastMessage.text,
        lastMessageTime: lastMessage.timestamp,
        lastMessageType: lastMessage.type as any,
        isOnline: presence?.status === 'online',
        unreadCount,
        hasBounty: false, // TODO: Check bounties
        faction: partner?.anime || 'physical'
      };
    });
    
    // Sort by most recent message
    return convs.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  }, [enhancedMessages, users, currentUser, userPresences]);
  
  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    
    return conversations.filter(conv => 
      conv.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);
  
  const handleConversationClick = (userId: number) => {
    navigate(`/messages/${userId}`);
  };
  
  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'duel_challenge':
        return <Swords size={12} style={{ color: 'var(--neon-red)' }} />;
      case 'clan_invite':
        return <Shield size={12} style={{ color: 'var(--neon-blue)' }} />;
      case 'threat':
        return <Skull size={12} style={{ color: 'var(--neon-red)' }} />;
      case 'alliance_proposal':
        return <Users size={12} style={{ color: 'var(--neon-gold)' }} />;
      default:
        return null;
    }
  };
  
  const getMessageTypeText = (type: string) => {
    switch (type) {
      case 'duel_challenge':
        return 'Duel challenge';
      case 'clan_invite':
        return 'Clan invite';
      case 'threat':
        return 'Threat received';
      case 'alliance_proposal':
        return 'Alliance offer';
      default:
        return '';
    }
  };
  
  const getLastMessagePreview = (conv: Conversation) => {
    if (conv.lastMessageType !== 'text') {
      const icon = getMessageTypeIcon(conv.lastMessageType);
      const text = getMessageTypeText(conv.lastMessageType);
      return (
        <div className="flex items-center gap-1">
          {icon}
          <span style={{ color: conv.lastMessageType === 'threat' ? 'var(--neon-red)' : 'var(--text-secondary)' }}>
            {text}
          </span>
        </div>
      );
    }
    
    const isFromCurrentUser = false; // TODO: Track sender
    const prefix = isFromCurrentUser ? 'You: ' : '';
    const truncated = conv.lastMessage.substring(0, 45) + (conv.lastMessage.length > 45 ? '...' : '');
    
    return (
      <span style={{ color: 'var(--text-secondary)' }}>
        {prefix}{truncated}
      </span>
    );
  };
  
  return (
    <div className="w-full max-w-md h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 
          className="text-lg font-bold"
          style={{ 
            fontFamily: 'Orbitron', 
            fontWeight: 700, 
            color: 'white' 
          }}
        >
          MESSAGES
        </h1>
        <button 
          onClick={() => setShowNewMessageModal(true)}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <Plus size={18} style={{ color: 'var(--text-primary)' }} />
        </button>
      </div>
      
      {/* Search bar */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="relative">
          <Search 
            size={16} 
            className="absolute left-3 top-2.5" 
            style={{ color: 'var(--text-muted)' }} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full pl-10 pr-4 py-2 rounded-md text-sm"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'Rajdhani'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5"
            >
              <X size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageSquare size={32} style={{ color: 'var(--text-muted)' }} />
            <div 
              className="mt-4 text-sm"
              style={{ 
                fontFamily: 'Rajdhani', 
                color: 'var(--text-muted)' 
              }}
            >
              No conversations yet.
            </div>
            <div 
              className="text-xs mt-2"
              style={{ 
                fontFamily: 'Rajdhani', 
                color: 'var(--text-secondary)' 
              }}
            >
              Challenge someone to a duel. Start a war. Make an ally.
            </div>
          </div>
        ) : (
          filteredConversations.map(conv => {
            const factionColor = getFactionColor(conv.faction);
            const factionGlow = getFactionGlow(conv.faction);
            
            return (
              <div
                key={conv.userId}
                onClick={() => handleConversationClick(conv.userId)}
                className="flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer border-b transition-colors duration-150"
                style={{ 
                  borderColor: 'var(--border)',
                  borderLeft: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeftColor = factionColor;
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeftColor = 'transparent';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Avatar */}
                <div className="relative">
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ 
                      background: `${factionColor}20`, 
                      border: `2px solid ${factionColor}` 
                    }}
                  >
                    {conv.avatar}
                  </div>
                  
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0">
                    <Circle 
                      size={10} 
                      fill="currentColor"
                      style={{ 
                        color: conv.isOnline ? 'var(--neon-green)' : 
                               conv.isOnline ? 'var(--neon-yellow)' : 'var(--text-muted)' 
                      }} 
                    />
                  </div>
                  
                  {/* Unread badge */}
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1">
                      <Circle 
                        size={18} 
                        fill="currentColor"
                        className="flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ color: 'var(--neon-red)' }}
                      >
                        {conv.unreadCount}
                      </Circle>
                    </div>
                  )}
                </div>
                
                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-bold text-sm"
                        style={{ 
                          fontFamily: 'Rajdhani', 
                          color: 'var(--text-primary)' 
                        }}
                      >
                        {conv.username}
                      </span>
                      
                      {/* Bounty warning */}
                      {conv.hasBounty && (
                        <AlertTriangle 
                          size={12} 
                          style={{ color: 'var(--neon-red)' }} 
                        />
                      )}
                    </div>
                    
                    <span 
                      className="text-xs"
                      style={{ 
                        fontFamily: 'Rajdhani', 
                        color: 'var(--text-muted)' 
                      }}
                    >
                      {formatTimestamp(conv.lastMessageTime)}
                    </span>
                  </div>
                  
                  {/* Last message preview */}
                  <div className="mt-1">
                    {getLastMessagePreview(conv)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* TODO: New Message Modal */}
      {showNewMessageModal && (
        <div 
          ref={modalContainerRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div 
            ref={modalRef}
            className="max-w-md w-full mx-4 p-6 rounded-lg"
            style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-active)' 
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-lg font-bold"
                style={{ fontFamily: 'Orbitron', color: 'white' }}
              >
                SEND MESSAGE
              </h2>
              <button onClick={() => setShowNewMessageModal(false)}>
                <X size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search 
                size={16} 
                className="absolute left-3 top-2.5" 
                style={{ color: 'var(--text-muted)' }} 
              />
              <input
                type="text"
                placeholder="Find a fighter by username"
                className="w-full pl-10 pr-4 py-2 rounded-md text-sm"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Rajdhani'
                }}
              />
            </div>
            
            <div className="text-center py-8">
              <MessageSquare size={32} style={{ color: 'var(--text-muted)' }} />
              <div 
                className="mt-4 text-sm"
                style={{ 
                  fontFamily: 'Rajdhani', 
                  color: 'var(--text-muted)' 
                }}
              >
                No fighters found
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
