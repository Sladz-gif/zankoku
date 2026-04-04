import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/sharedUtils';
import { isThreatMessage, detectMessageIntensity } from '@/lib/messagingUtils';
import { useClickOutside } from '@/hooks/useClickOutside';
import { 
  Send, Smile, Sparkles, Swords, Shield, Target, Users, X
} from 'lucide-react';

interface InputBarProps {
  toUserId: number;
  replyToMessage?: { id: number; text: string; senderName: string };
  onClearReply: () => void;
  onQuickAction: (action: 'duel' | 'clan_invite' | 'bounty' | 'alliance') => void;
}

const InputBar: React.FC<InputBarProps> = ({ 
  toUserId, 
  replyToMessage, 
  onClearReply,
  onQuickAction 
}) => {
  const { currentUser, sendEnhancedMessage, setTyping, triggerCinematic } = useGame();
  const [message, setMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const smileButtonRef = useRef<HTMLButtonElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const reactionPickerRef = useClickOutside({
    isOpen: showReactionPicker,
    onClose: () => setShowReactionPicker(false),
    excludeRefs: [smileButtonRef]
  });
  
  const quickActionsContainerRef = useClickOutside({
    isOpen: showQuickActions,
    onClose: () => setShowQuickActions(false),
    excludeRefs: [textareaRef]
  });
  
  const factionColor = getFactionColor(currentUser?.anime || 'physical');
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);
  
  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Send typing indicator
    setTyping(toUserId, true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(toUserId, false);
    }, 2000);
  };
  
  // Handle send message
  const handleSend = () => {
    if (!message.trim() || !currentUser) return;
    
    // Detect message type
    let messageType: 'text' | 'duel_challenge' | 'clan_invite' | 'threat' | 'alliance_proposal' | 'system' = 'text';
    if (isThreatMessage(message)) {
      messageType = 'threat';
    }
    
    // Send message
    sendEnhancedMessage(toUserId, message.trim(), messageType);
    
    // Clear input
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Clear reply
    if (replyToMessage) {
      onClearReply();
    }
    
    // Stop typing indicator
    setTyping(toUserId, false);
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Handle cinematic trigger
  const handleCinematic = () => {
    // Create a mock cinematic trigger
    const cinematicText = [
      'A LEGENDARY MOMENT APPROACHES...',
      'THE FATE OF BATTLES TO COME...',
      'DESTINY CALLS...',
      'LEGENDS ARE BORN IN FIRE...'
    ][Math.floor(Math.random() * 4)];
    
    triggerCinematic(cinematicText, 'legendary');
  };
  
  // Handle quick reaction
  const handleQuickReaction = (reaction: string) => {
    // For now, insert reaction text into input
    setMessage(prev => prev + ` [${reaction}]`);
    setShowReactionPicker(false);
    textareaRef.current?.focus();
  };
  
  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
      {/* Reply context */}
      {replyToMessage && (
        <div 
          className="px-4 py-2 border-l-3 m-4"
          style={{ 
            background: 'var(--bg-elevated)', 
            borderLeftColor: factionColor,
            borderLeftWidth: '3px'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani' }}>
                Replying to {replyToMessage.senderName}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani' }}>
                {replyToMessage.text.substring(0, 60)}{replyToMessage.text.length > 60 ? '...' : ''}
              </div>
            </div>
            <button onClick={onClearReply}>
              <X size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>
      )}
      
      {/* Quick actions bar */}
      {showQuickActions && (
        <div 
          ref={quickActionsContainerRef}
          className="flex gap-2 px-4 py-2"
        >
          <button
            onClick={() => onQuickAction('duel')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              fontFamily: 'Rajdhani',
              letterSpacing: '1px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
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
            onMouseDown={(e) => e.preventDefault()}
          >
            <Swords size={14} />
            DUEL
          </button>
          <button
            onClick={() => onQuickAction('clan_invite')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              fontFamily: 'Rajdhani',
              letterSpacing: '1px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--neon-blue)20';
              e.currentTarget.style.borderColor = 'var(--neon-blue)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Shield size={14} />
            INVITE
          </button>
          <button
            onClick={() => onQuickAction('bounty')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              fontFamily: 'Rajdhani',
              letterSpacing: '1px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
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
            onMouseDown={(e) => e.preventDefault()}
          >
            <Target size={14} />
            BOUNTY
          </button>
          <button
            onClick={() => onQuickAction('alliance')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              fontFamily: 'Rajdhani',
              letterSpacing: '1px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--neon-gold)20';
              e.currentTarget.style.borderColor = 'var(--neon-gold)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Users size={14} />
            ALLIANCE
          </button>
        </div>
      )}
      
      {/* Main input row */}
      <div className="flex items-center gap-2 p-3">
        <button
          ref={smileButtonRef}
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="p-2 rounded-full transition-all duration-200"
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
        >
          <Smile size={18} style={{ color: 'var(--text-primary)' }} />
        </button>
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowQuickActions(true)}
          onBlur={() => {
            setShowQuickActions(false);
            setTyping(toUserId, false);
          }}
          placeholder="Send a message..."
          className="flex-1 resize-none outline-none"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'Rajdhani',
            fontSize: '15px',
            minHeight: '24px',
            maxHeight: '120px'
          }}
          aria-label="Type a message"
        />
        
        <button
          onClick={handleCinematic}
          className="p-2 rounded-full transition-all duration-200"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--neon-purple)20';
            e.currentTarget.style.borderColor = 'var(--neon-purple)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-elevated)';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Trigger Cinematic"
        >
          <Sparkles size={18} style={{ color: 'var(--text-primary)' }} />
        </button>
        
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 rounded-full disabled:opacity-50 transition-all duration-200"
          style={{
            background: factionColor,
            color: 'white',
            boxShadow: message.trim() ? `0 2px 8px ${factionColor}50` : 'none'
          }}
          onMouseEnter={(e) => {
            if (message.trim()) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${factionColor}70`;
            }
          }}
          onMouseLeave={(e) => {
            if (message.trim()) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 2px 8px ${factionColor}50`;
            }
          }}
        >
          <Send size={20} />
        </button>
      </div>
      
      {/* Reaction picker */}
      {showReactionPicker && (
        <div 
          ref={reactionPickerRef}
          className="flex justify-center gap-2 p-2 border-t" 
          style={{ borderColor: 'var(--border)' }}
        >
          {[
            { emoji: '⚡', label: 'Power', color: 'var(--neon-yellow)' },
            { emoji: '🔥', label: 'Fire', color: 'var(--neon-orange)' },
            { emoji: '💀', label: 'Fatal', color: 'var(--neon-red)' },
            { emoji: '👁', label: 'Aware', color: 'var(--neon-blue)' },
            { emoji: '🌀', label: 'Illusion', color: 'var(--neon-purple)' },
            { emoji: '🛡', label: 'Defense', color: 'var(--neon-green)' },
            { emoji: '🗡', label: 'Attack', color: 'white' }
          ].map(({ emoji, label, color }) => (
            <button
              key={emoji}
              onClick={() => handleQuickReaction(label)}
              className="p-2 rounded hover:bg-gray-700"
              aria-label={`React with ${label}`}
            >
              <span style={{ fontSize: '20px' }}>{emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputBar;
