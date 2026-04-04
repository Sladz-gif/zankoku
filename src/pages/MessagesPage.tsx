import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow, formatFullTimestamp } from '@/lib/sharedUtils';
import { getPresenceText } from '@/lib/messagingUtils';
import ConversationList from '@/components/messages/ConversationList';
import MessageBubble from '@/components/messages/MessageBubble';
import SpecialMessageCard from '@/components/messages/SpecialMessageCard';
import TypingIndicator from '@/components/messages/TypingIndicator';
import DateSeparator from '@/components/messages/DateSeparator';
import InputBar from '@/components/messages/InputBar';
import CinematicOverlay from '@/components/messages/CinematicOverlay';
import { 
  ArrowLeft, Phone, Video, MoreHorizontal, AlertTriangle, Swords, Target, Users, ExternalLink, Circle, MessageSquare
} from 'lucide-react';

const MessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { users, currentUser, enhancedMessages, userPresences, reactToMessage, deleteMessage, pinMessage, sendEnhancedMessage, triggerCinematic } = useGame();
  
  const [replyToMessage, setReplyToMessage] = useState<{ id: number; text: string; senderName: string } | undefined>();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const selectedUserId = userId ? parseInt(userId) : null;
  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : undefined;
  const userPresence = selectedUserId ? userPresences.find(p => p.userId === selectedUserId) : undefined;
  
  // Filter messages for this conversation
  const conversationMessages = React.useMemo(() => {
    if (!selectedUserId || !currentUser) return [];
    
    return enhancedMessages
      .filter(msg => 
        (msg.fromId === currentUser.id && msg.toId === selectedUserId) ||
        (msg.fromId === selectedUserId && msg.toId === currentUser.id)
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [enhancedMessages, selectedUserId, currentUser]);
  
  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);
  
  const handleReply = (messageId: number) => {
    const message = conversationMessages.find(m => m.id === messageId);
    if (message) {
      const sender = users.find(u => u.id === message.fromId);
      setReplyToMessage({
        id: messageId,
        text: message.text,
        senderName: sender?.username || 'Unknown'
      });
    }
  };
  
  const handleReact = (messageId: number, reaction: any) => {
    reactToMessage(messageId, reaction);
  };
  
  const handleDelete = (messageId: number, forBoth: boolean) => {
    deleteMessage(messageId, forBoth);
  };
  
  const handlePin = (messageId: number) => {
    pinMessage(messageId);
  };
  
  const handleClearReply = () => {
    setReplyToMessage(undefined);
  };
  
  const handleQuickAction = (action: 'duel' | 'clan_invite' | 'bounty' | 'alliance') => {
    if (!selectedUserId || !currentUser) return;
    
    switch (action) {
      case 'duel':
        handleDuelChallenge();
        break;
      case 'clan_invite':
        // Send clan invite message
        sendEnhancedMessage(selectedUserId, 'You have been invited to join our clan!', 'clan_invite', {
          clanId: 1,
          clanName: "Shadow Legion",
          role: 'member',
          status: 'pending'
        });
        triggerCinematic('CLAN INVITE SENT!', 'major');
        break;
      case 'bounty':
        handlePlaceBounty();
        break;
      case 'alliance':
        // Send alliance proposal
        sendEnhancedMessage(selectedUserId, 'I propose an alliance between us.', 'alliance_proposal', {
          terms: 'Mutual protection and shared resources',
          duration: '30 days',
          status: 'pending'
        });
        triggerCinematic('ALLIANCE OFFER SENT!', 'major');
        break;
    }
  };
  
  const handleGoBack = () => {
    navigate('/messages');
  };
  
  const handleViewProfile = () => {
    if (selectedUserId) {
      window.open(`/profile/${selectedUserId}`, '_blank');
    }
  };
  
  const handleDuelChallenge = () => {
    if (!selectedUserId || !currentUser) return;
    
    // Send duel challenge message
    const duelMessage = {
      id: Date.now(),
      fromId: currentUser.id,
      toId: selectedUserId,
      text: "I challenge you to a duel!",
      timestamp: Date.now(),
      read: false,
      status: 'sent' as const,
      type: 'duel_challenge' as const,
      intensity: 'legendary' as const,
      reactions: [],
      isPinned: false,
      isDeleted: false,
      deletedForBoth: false,
      metadata: {
        stakes: "500 points and rank position",
        rules: "No forbidden techniques",
        expiresAt: Date.now() + 3600000, // 1 hour
        status: 'pending' as const
      }
    };
    
    sendEnhancedMessage(selectedUserId, duelMessage.text, duelMessage.type);
    triggerCinematic('DUEL CHALLENGE SENT!', 'legendary');
  };
  
  const handlePlaceBounty = () => {
    if (!selectedUserId || !currentUser) return;
    
    // Send bounty placement message
    const bountyMessage = {
      id: Date.now(),
      fromId: currentUser.id,
      toId: selectedUserId,
      text: "A bounty has been placed on your head!",
      timestamp: Date.now(),
      read: false,
      status: 'sent' as const,
      type: 'threat' as const,
      intensity: 'critical' as const,
      reactions: [],
      isPinned: false,
      isDeleted: false,
      deletedForBoth: false,
      metadata: {
        severity: 'high' as const,
        reported: false,
        markedSerious: false,
        moderationFlags: []
      }
    };
    
    sendEnhancedMessage(selectedUserId, bountyMessage.text, bountyMessage.type);
    triggerCinematic('BOUNTY PLACED!', 'major');
  };
  
  const handleMoreOptions = () => {
    // TODO: Implement dropdown menu with options
    alert('More options coming soon: Clear Chat, Block User, Report User');
  };
  
  // Group messages by date and sender
  const groupedMessages = React.useMemo(() => {
    const groups: Array<{
      type: 'date' | 'message';
      data: any;
      date?: number;
      showHeader?: boolean;
      isGrouped?: boolean;
    }> = [];
    
    let lastDate: number | null = null;
    let lastSender: number | null = null;
    
    conversationMessages.forEach(message => {
      // Check if we need a date separator
      const messageDate = new Date(message.timestamp);
      messageDate.setHours(0, 0, 0, 0);
      const messageDateMs = messageDate.getTime();
      
      if (lastDate === null || messageDateMs !== lastDate) {
        groups.push({
          type: 'date',
          data: message.timestamp,
          date: messageDateMs
        });
        lastDate = messageDateMs;
        lastSender = null; // Reset sender when date changes
      }
      
      // Check if this is a new sender group
      const isNewSender = lastSender !== message.fromId;
      const timeDiff = message.timestamp - (groups[groups.length - 1]?.data?.timestamp || 0);
      const isGrouped = !isNewSender && timeDiff < 60000; // 1 minute
      
      groups.push({
        type: 'message',
        data: message,
        showHeader: isNewSender,
        isGrouped: !isGrouped
      });
      
      lastSender = message.fromId;
    });
    
    return groups;
  }, [conversationMessages]);
  
  // Check if user is typing
  const isTyping = userPresence?.isTyping && userPresence.typingTo === currentUser?.id;
  
  // Check for psychological warfare indicator
  const showPsychologicalIndicator = React.useMemo(() => {
    if (!currentUser || !selectedUserId) return false;
    
    const lastMessage = conversationMessages
      .filter(m => m.fromId === currentUser.id)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (!lastMessage || lastMessage.status !== 'read') return false;
    
    const timeSinceRead = Date.now() - lastMessage.timestamp;
    return timeSinceRead > 30000; // 30 seconds for demo
  }, [conversationMessages, currentUser, selectedUserId]);
  
  if (!selectedUserId) {
    // Conversations list view
    return (
      <div className="flex h-screen bg-gray-900">
        <div className="w-full max-w-md">
          <ConversationList />
        </div>
        
        {/* Empty state */}
        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="text-center">
            <div 
              className="text-6xl font-bold opacity-5 mb-8"
              style={{ fontFamily: 'serif' }}
            >
              残酷
            </div>
            <MessageSquare size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h2 
              className="text-xl font-bold mb-2"
              style={{ 
                fontFamily: 'Orbitron', 
                fontWeight: 700, 
                color: 'var(--text-muted)' 
              }}
            >
              Select a conversation
            </h2>
            <p 
              className="text-sm"
              style={{ 
                fontFamily: 'Rajdhani', 
                color: 'var(--text-secondary)' 
              }}
            >
              Or start a new one. Everything in Zankoku begins with a message.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const factionColor = selectedUser ? getFactionColor(selectedUser.anime) : '#6666AA';
  const presenceText = userPresence ? getPresenceText(
    userPresence.status,
    userPresence.lastSeen,
    userPresence.isTyping || false
  ) : 'Offline';
  
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile: Hide conversation list */}
      <div className="hidden md:block max-w-md">
        <ConversationList />
      </div>
      
      {/* Conversation view */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ 
            height: '64px',
            background: 'var(--bg-surface)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile back button */}
            <button 
              onClick={handleGoBack}
              className="md:hidden p-2 rounded-full transition-all duration-200"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-base)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-elevated)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ArrowLeft size={24} style={{ color: 'var(--text-primary)' }} />
            </button>
            
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ 
                  background: `${factionColor}20`, 
                  border: `2px solid ${factionColor}` 
                }}
              >
                {selectedUser?.username?.[0] || '?'}
              </div>
              
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0">
                <Circle 
                  size={10} 
                  fill="currentColor"
                  style={{ 
                    color: userPresence?.status === 'online' ? 'var(--neon-green)' : 
                           userPresence?.status === 'idle' ? 'var(--neon-yellow)' : 'var(--text-muted)' 
                  }} 
                />
              </div>
            </div>
            
            {/* User info */}
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="font-bold"
                  style={{ 
                    fontFamily: 'Orbitron', 
                    fontSize: '15px',
                    color: 'white' 
                  }}
                >
                  {selectedUser?.username || 'Unknown User'}
                </span>
                
                {/* Profile link */}
                <button 
                  onClick={handleViewProfile}
                  className="p-1.5 rounded-md transition-all duration-200"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-base)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="View profile"
                >
                  <ExternalLink size={16} style={{ color: 'var(--text-primary)' }} />
                </button>
              </div>
              
              {/* Role tag */}
              <div className="flex items-center gap-2">
                <span 
                  className="text-xs px-1 border-l-2"
                  style={{ 
                    fontFamily: 'Rajdhani',
                    color: 'var(--text-secondary)',
                    borderLeftColor: factionColor,
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}
                >
                  {selectedUser?.rank ? `RANK ${selectedUser.rank}` : 'FIGHTER'}
                </span>
                
                {/* Bounty warning */}
                {/* TODO: Check if user has bounty */}
                <AlertTriangle size={12} style={{ color: 'var(--neon-red)' }} />
              </div>
              
              {/* Presence status */}
              <div 
                className="text-xs"
                style={{ 
                  fontFamily: 'Rajdhani',
                  color: isTyping ? 'var(--neon-green)' : 'var(--text-muted)',
                  fontStyle: isTyping ? 'italic' : 'normal'
                }}
              >
                {presenceText}
              </div>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* TODO: Add bounty indicator */}
            
            <button 
              className="p-2.5 rounded-full transition-all duration-200"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--neon-red)20';
                e.currentTarget.style.borderColor = 'var(--neon-red)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-elevated)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={handleDuelChallenge}
              title="Challenge to Duel"
            >
              <Swords size={20} style={{ color: 'var(--text-primary)' }} />
            </button>
            
            <button 
              className="p-2.5 rounded-full transition-all duration-200"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--neon-orange)20';
                e.currentTarget.style.borderColor = 'var(--neon-orange)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-elevated)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={handlePlaceBounty}
              title="Place Bounty"
            >
              <Target size={20} style={{ color: 'var(--text-primary)' }} />
            </button>
            
            <button 
              className="p-2.5 rounded-full transition-all duration-200"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-base)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-elevated)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={handleMoreOptions}
              title="More Options"
            >
              <MoreHorizontal size={20} style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>
        </div>
        
        {/* Messages area */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${factionColor} transparent`
          }}
        >
          {groupedMessages.map((group, index) => {
            if (group.type === 'date') {
              return <DateSeparator key={`date-${index}`} timestamp={group.data} />;
            }
            
            const message = group.data;
            const isOwn = message.fromId === currentUser?.id;
            const replyToMsg = conversationMessages.find(m => m.id === message.replyTo);
            
            // Special message cards
            if (message.type !== 'text') {
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
                  <SpecialMessageCard message={message} isOwn={isOwn} />
                </div>
              );
            }
            
            // Regular message bubbles
            return (
              <MessageBubble
                key={message.id}
                message={message}
                replyToMessage={replyToMsg}
                showHeader={group.showHeader}
                isGrouped={group.isGrouped}
                onReply={handleReply}
                onReact={handleReact}
                onDelete={handleDelete}
                onPin={handlePin}
              />
            );
          })}
          
          {/* Typing indicator */}
          {isTyping && <TypingIndicator userId={selectedUserId} />}
          
          {/* Psychological warfare indicator */}
          {showPsychologicalIndicator && (
            <div className="text-center py-2">
              <span 
                className="text-xs italic"
                style={{ 
                  fontFamily: 'Rajdhani',
                  color: 'var(--text-muted)' 
                }}
              >
                Seen. No response.
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input bar */}
        <InputBar
          toUserId={selectedUserId}
          replyToMessage={replyToMessage}
          onClearReply={handleClearReply}
          onQuickAction={handleQuickAction}
        />
      </div>
      
      {/* Cinematic overlay */}
      <CinematicOverlay />
    </div>
  );
};

export default MessagesPage;
