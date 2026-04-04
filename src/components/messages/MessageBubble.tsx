import React, { memo, useState, useRef } from 'react';
import { EnhancedMessage, AnimeReaction } from '@/types/messaging';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow } from '@/lib/sharedUtils';
import { detectMessageIntensity } from '@/lib/messagingUtils';
import { useClickOutside } from '@/hooks/useClickOutside';
import { 
  Check, CheckCheck, AlertCircle, Pin, Crown, Smile, CornerDownRight, Trash2, MoreHorizontal,
  Zap, Flame, Skull, Eye, Layers, Shield, Sword
} from 'lucide-react';

interface MessageBubbleProps {
  message: EnhancedMessage;
  replyToMessage?: EnhancedMessage;
  showHeader: boolean;
  isGrouped: boolean;
  onReply: (messageId: number) => void;
  onReact: (messageId: number, reaction: AnimeReaction) => void;
  onDelete: (messageId: number, forBoth: boolean) => void;
  onPin: (messageId: number) => void;
}

const MessageBubble = memo(({ 
  message, 
  replyToMessage, 
  showHeader, 
  isGrouped,
  onReply,
  onReact,
  onDelete,
  onPin
}: MessageBubbleProps) => {
  const { currentUser } = useGame();
  const [showHoverActions, setShowHoverActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const smileButtonRef = useRef<HTMLButtonElement>(null);
  
  const reactionPickerRef = useClickOutside({
    isOpen: showReactionPicker,
    onClose: () => setShowReactionPicker(false),
    excludeRefs: [smileButtonRef]
  });
  
  const isOwn = message.fromId === currentUser?.id;
  const factionColor = getFactionColor(currentUser?.anime || 'physical');
  const factionGlow = getFactionGlow(currentUser?.anime || 'physical');
  
  // Detect intensity for styling
  const intensity = detectMessageIntensity(message.text, message.type);
  const isLegendary = intensity === 'legendary';
  const isCritical = intensity === 'critical';
  const isHeated = intensity === 'heated';
  
  // Get intensity styling
  const getIntensityStyle = () => {
    if (isLegendary) {
      return {
        borderColor: 'var(--neon-gold)',
        boxShadow: '0 0 16px rgba(255, 215, 0, 0.5)',
        animation: 'pulse-border 2s infinite'
      };
    }
    if (isCritical) {
      return {
        borderColor: 'var(--neon-red)',
        boxShadow: '0 0 12px rgba(255, 0, 60, 0.3)',
        borderWidth: '1.5px'
      };
    }
    if (isHeated) {
      return {
        borderColor: 'var(--neon-orange)',
        boxShadow: '0 0 8px rgba(255, 107, 0, 0.2)'
      };
    }
    return {};
  };
  
  // Get status icon
  const getStatusIcon = () => {
    if (!isOwn) return null;
    
    switch (message.status) {
      case 'sent':
        return <Check size={12} style={{ color: 'var(--text-muted)' }} />;
      case 'delivered':
        return <CheckCheck size={12} style={{ color: 'var(--text-muted)' }} />;
      case 'read':
        return <CheckCheck size={12} style={{ color: 'var(--neon-blue)' }} />;
      default:
        return null;
    }
  };
  
  // Reaction icons mapping
  const reactionIcons = {
    '🔥': Flame,
    '⚡': Zap,
    '💀': Skull,
    '👁': Eye,
    '🌀': Layers,
    '🛡': Shield,
    '🗡': Sword
  };
  
  const handleReaction = (reaction: AnimeReaction) => {
    onReact(message.id, reaction);
    setShowReactionPicker(false);
  };
  
  return (
    <div 
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : 'mt-4'}`}
      onMouseEnter={() => setShowHoverActions(true)}
      onMouseLeave={() => setShowHoverActions(false)}
    >
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Header for grouped messages */}
        {showHeader && !isOwn && (
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: `${factionColor}20`, border: `2px solid ${factionColor}` }}
            >
              {message.fromId.toString()[0]}
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              User {message.fromId}
            </span>
          </div>
        )}
        
        {/* Reply context */}
        {message.replyTo && replyToMessage && (
          <div className="mb-2 p-2 rounded-l border-l-3" 
            style={{ 
              background: 'var(--bg-base)', 
              borderLeftColor: factionColor,
              borderLeftWidth: '3px'
            }}>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Replying to User {replyToMessage.fromId}
            </div>
            <div className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {replyToMessage.text}
            </div>
          </div>
        )}
        
        {/* Hover actions bar */}
        {showHoverActions && (
          <div 
            className="absolute flex gap-3 p-1 rounded-md border"
            style={{ 
              background: 'var(--bg-elevated)', 
              borderColor: 'var(--border)',
              transform: 'translateY(-100%)',
              top: '-8px',
              [isOwn ? 'right' : 'left']: 0
            }}
          >
            <button 
              ref={smileButtonRef}
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              aria-label="Add reaction"
              className="p-1 rounded hover:bg-gray-700"
            >
              <Smile size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button 
              onClick={() => onReply(message.id)}
              aria-label="Reply"
              className="p-1 rounded hover:bg-gray-700"
            >
              <CornerDownRight size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button 
              onClick={() => onPin(message.id)}
              aria-label="Pin message"
              className="p-1 rounded hover:bg-gray-700"
            >
              <Pin size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button 
              onClick={() => onDelete(message.id, false)}
              aria-label="Delete message"
              className="p-1 rounded hover:bg-gray-700"
            >
              <Trash2 size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        )}
        
        {/* Reaction picker */}
        {showReactionPicker && (
          <div 
            ref={reactionPickerRef}
            className="absolute flex gap-2 p-2 rounded-md border"
            style={{ 
              background: 'var(--bg-elevated)', 
              borderColor: 'var(--border)',
              transform: 'translateY(-100%)',
              top: '-8px',
              [isOwn ? 'right' : 'left']: 0
            }}
          >
            {Object.entries(reactionIcons).map(([emoji, Icon]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji as AnimeReaction)}
                className="p-1 rounded hover:bg-gray-700"
                aria-label={`React with ${emoji}`}
              >
                <Icon size={16} style={{ 
                  color: emoji === '🔥' ? 'var(--neon-orange)' :
                         emoji === '⚡' ? 'var(--neon-yellow)' :
                         emoji === '💀' ? 'var(--neon-red)' :
                         emoji === '👁' ? 'var(--neon-blue)' :
                         emoji === '🌀' ? 'var(--neon-purple)' :
                         emoji === '🛡' ? 'var(--neon-green)' :
                         'white'
                }} />
              </button>
            ))}
          </div>
        )}
        
        {/* Message bubble */}
        <div 
          className="relative p-3 rounded-2xl"
          style={{
            background: isOwn ? `${factionColor}25` : 'var(--bg-elevated)',
            border: `1px solid ${isOwn ? `${factionColor}50` : 'var(--border-active)'}`,
            borderRadius: isOwn ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            boxShadow: isOwn ? `0 0 12px ${factionColor}15` : 'none',
            ...getIntensityStyle()
          }}
        >
          {/* Legendary crown indicator */}
          {isLegendary && (
            <Crown 
              size={12} 
              style={{ 
                color: 'var(--neon-gold)', 
                position: 'absolute', 
                top: '4px', 
                right: '4px' 
              }} 
            />
          )}
          
          {/* Pinned indicator */}
          {message.isPinned && (
            <Pin 
              size={12} 
              style={{ 
                color: 'var(--neon-gold)', 
                position: 'absolute', 
                top: '4px', 
                right: isLegendary ? '20px' : '4px' 
              }} 
            />
          )}
          
          {/* Message text */}
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {message.text}
          </p>
          
          {/* Status indicator for own messages */}
          {isOwn && getStatusIcon() && (
            <div className="absolute bottom-1 right-1">
              {getStatusIcon()}
            </div>
          )}
        </div>
        
        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {Object.entries(
              message.reactions.reduce((acc, reaction) => {
                acc[reaction.reaction] = (acc[reaction.reaction] || 0) + 1;
                return acc;
              }, {} as Record<AnimeReaction, number>)
            ).map(([reaction, count]) => {
              const Icon = reactionIcons[reaction];
              const hasUserReacted = message.reactions.some(r => r.reaction === reaction && r.userId === currentUser?.id);
              
              return (
                <button
                  key={reaction}
                  onClick={() => handleReaction(reaction as AnimeReaction)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    hasUserReacted ? 'bg-opacity-20' : ''
                  }`}
                  style={{
                    background: hasUserReacted ? `${factionColor}20` : 'var(--bg-elevated)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <Icon size={12} style={{ 
                    color: reaction === '🔥' ? 'var(--neon-orange)' :
                           reaction === '⚡' ? 'var(--neon-yellow)' :
                           reaction === '💀' ? 'var(--neon-red)' :
                           reaction === '👁' ? 'var(--neon-blue)' :
                           reaction === '🌀' ? 'var(--neon-purple)' :
                           reaction === '🛡' ? 'var(--neon-green)' :
                           'white'
                  }} />
                  <span style={{ color: 'var(--text-primary)' }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
        
        {/* Timestamp for last message in group */}
        {!isGrouped && (
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {new Date(message.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
            })}
          </div>
        )}
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
