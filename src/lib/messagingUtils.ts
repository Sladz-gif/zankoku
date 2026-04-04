// Messaging system utility functions

import { 
  EnhancedMessage, 
  MessageIntensity, 
  MessageType, 
  PlayerBehavior, 
  PlayerBehaviorProfile,
  INTENSITY_KEYWORDS,
  CINEMATIC_TRIGGERS,
  IntensityKeywords
} from '@/types/messaging';

/**
 * Detect message intensity based on content and context
 */
export function detectMessageIntensity(
  text: string,
  type: MessageType,
  senderBehavior?: PlayerBehavior
): MessageIntensity {
  const lowerText = text.toLowerCase();
  
  // Special message types have elevated intensity
  if (type === 'duel_challenge') return 'critical';
  if (type === 'threat') return 'heated';
  if (type === 'alliance_proposal') return 'heated';
  
  // Check for legendary keywords
  const hasLegendary = INTENSITY_KEYWORDS.legendary.some(keyword => 
    lowerText.includes(keyword)
  );
  if (hasLegendary) return 'legendary';
  
  // Check for critical keywords
  const hasCritical = INTENSITY_KEYWORDS.critical.some(keyword => 
    lowerText.includes(keyword)
  );
  if (hasCritical) return 'critical';
  
  // Check for heated keywords
  const hasHeated = INTENSITY_KEYWORDS.heated.some(keyword => 
    lowerText.includes(keyword)
  );
  if (hasHeated) return 'heated';
  
  // Hostile players send heated messages by default
  if (senderBehavior === 'hostile') return 'heated';
  
  return 'normal';
}

/**
 * Analyze player behavior based on messaging patterns
 */
export function analyzePlayerBehavior(
  userId: number,
  messages: EnhancedMessage[]
): PlayerBehaviorProfile {
  const userMessages = messages.filter(m => m.fromId === userId);
  
  const threatCount = userMessages.filter(m => m.type === 'threat').length;
  const allianceCount = userMessages.filter(m => m.type === 'alliance_proposal').length;
  const duelChallenges = userMessages.filter(m => m.type === 'duel_challenge');
  
  const acceptedChallenges = duelChallenges.filter(m => 
    m.metadata && 'status' in m.metadata && m.metadata.status === 'accepted'
  ).length;
  
  const ignoredChallenges = duelChallenges.filter(m => 
    m.metadata && 'status' in m.metadata && (m.metadata.status === 'expired' || m.metadata.status === 'declined')
  ).length;
  
  // Determine behavior
  let behavior: PlayerBehavior = 'neutral';
  
  if (threatCount >= 5) {
    behavior = 'hostile';
  } else if (allianceCount >= 3) {
    behavior = 'trusted';
  } else if (ignoredChallenges >= 3) {
    behavior = 'avoidant';
  }
  
  return {
    userId,
    behavior,
    threatCount,
    allianceCount,
    ignoredChallenges,
    acceptedChallenges,
    lastUpdated: Date.now()
  };
}

/**
 * Check if message contains threat keywords
 */
export function isThreatMessage(text: string): boolean {
  const threatKeywords = [
    'kill', 'destroy', 'crush', 'annihilate', 'end you', 'dead',
    'hunt', 'target', 'coming for', 'watch your back', 'regret'
  ];
  
  const lowerText = text.toLowerCase();
  return threatKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Calculate threat severity
 */
export function calculateThreatSeverity(text: string): 'low' | 'medium' | 'high' {
  const lowerText = text.toLowerCase();
  
  const highSeverityKeywords = ['kill', 'death', 'dead', 'destroy', 'annihilate'];
  const mediumSeverityKeywords = ['hunt', 'crush', 'end', 'finished', 'target'];
  
  if (highSeverityKeywords.some(k => lowerText.includes(k))) return 'high';
  if (mediumSeverityKeywords.some(k => lowerText.includes(k))) return 'medium';
  return 'low';
}

/**
 * Get cinematic trigger text for event
 */
export function getCinematicTrigger(eventType: keyof typeof CINEMATIC_TRIGGERS): string {
  const triggers = CINEMATIC_TRIGGERS[eventType];
  return triggers[Math.floor(Math.random() * triggers.length)];
}

/**
 * Sort messages by priority (intensity-based)
 */
export function sortMessagesByPriority(messages: EnhancedMessage[]): EnhancedMessage[] {
  const intensityWeight = {
    legendary: 4,
    critical: 3,
    heated: 2,
    normal: 1
  };
  
  return [...messages].sort((a, b) => {
    // Pinned messages first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then by intensity
    const weightDiff = intensityWeight[b.intensity] - intensityWeight[a.intensity];
    if (weightDiff !== 0) return weightDiff;
    
    // Finally by timestamp
    return b.timestamp - a.timestamp;
  });
}

/**
 * Check if user is watching conversation (opened multiple times without replying)
 */
export function isUserWatching(
  openCount: number,
  lastOpened: number,
  messagesSent: number,
  messagesRead: number
): boolean {
  const timeSinceOpen = Date.now() - lastOpened;
  const hasReadWithoutReply = messagesRead > messagesSent;
  const openedMultipleTimes = openCount >= 3;
  const recentlyOpened = timeSinceOpen < 300000; // 5 minutes
  
  return hasReadWithoutReply && openedMultipleTimes && recentlyOpened;
}

/**
 * Generate presence status text
 */
export function getPresenceText(
  status: 'online' | 'idle' | 'offline',
  lastSeen: number,
  isTyping: boolean
): string {
  if (isTyping) return 'typing...';
  if (status === 'online') return 'Online';
  if (status === 'idle') return 'Watching...';
  
  const timeSince = Date.now() - lastSeen;
  const minutes = Math.floor(timeSince / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `Last seen ${days}d ago`;
  if (hours > 0) return `Last seen ${hours}h ago`;
  if (minutes > 0) return `Last seen ${minutes}m ago`;
  return 'Just now';
}

/**
 * Validate message action
 */
export function canPerformAction(
  action: 'delete_both' | 'pin' | 'report',
  messageOwnerId: number,
  currentUserId: number,
  isModerator: boolean = false
): boolean {
  switch (action) {
    case 'delete_both':
      return messageOwnerId === currentUserId;
    case 'pin':
      return true; // Anyone can pin in their own conversation
    case 'report':
      return messageOwnerId !== currentUserId; // Can't report own messages
    default:
      return false;
  }
}

/**
 * Extract keywords for intensity detection
 */
export function extractIntensityKeywords(text: string): string[] {
  const lowerText = text.toLowerCase();
  const allKeywords = [
    ...INTENSITY_KEYWORDS.heated,
    ...INTENSITY_KEYWORDS.critical,
    ...INTENSITY_KEYWORDS.legendary
  ];
  
  return allKeywords.filter(keyword => lowerText.includes(keyword));
}

/**
 * Calculate message notification weight
 */
export function calculateNotificationWeight(
  intensity: MessageIntensity,
  type: MessageType,
  isFromBlocked: boolean
): number {
  if (isFromBlocked) return 0;
  
  const intensityWeight = {
    legendary: 10,
    critical: 7,
    heated: 5,
    normal: 3
  };
  
  const typeWeight = {
    duel_challenge: 5,
    threat: 4,
    alliance_proposal: 3,
    clan_invite: 3,
    system: 2,
    text: 1
  };
  
  return intensityWeight[intensity] + typeWeight[type];
}

/**
 * Format message for display with reply context
 */
export function formatMessageWithReply(
  message: EnhancedMessage,
  replyToMessage?: EnhancedMessage
): { text: string; hasReply: boolean; replyText?: string } {
  if (!message.replyTo || !replyToMessage) {
    return { text: message.text, hasReply: false };
  }
  
  return {
    text: message.text,
    hasReply: true,
    replyText: replyToMessage.text.substring(0, 50) + (replyToMessage.text.length > 50 ? '...' : '')
  };
}

/**
 * Check if duel challenge has expired
 */
export function isDuelChallengeExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

/**
 * Calculate time remaining for duel challenge
 */
export function getDuelTimeRemaining(expiresAt: number): string {
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return 'Expired';
  
  const minutes = Math.floor(remaining / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

/**
 * Generate quick action data
 */
export function generateQuickActionData(
  actionType: 'duel' | 'clan_invite' | 'bounty' | 'alliance',
  targetUserId: number,
  currentUserId: number
): any {
  switch (actionType) {
    case 'duel':
      return {
        stakes: 'Ranked match',
        rules: 'Best of 3',
        expiresAt: Date.now() + 3600000 // 1 hour
      };
    case 'clan_invite':
      return {
        role: 'member'
      };
    case 'bounty':
      return {
        amount: 100,
        anonymous: false
      };
    case 'alliance':
      return {
        terms: 'Mutual support in battles',
        duration: '7 days'
      };
    default:
      return {};
  }
}

/**
 * Detect if message should trigger cinematic overlay
 */
export function shouldTriggerCinematic(
  type: MessageType,
  intensity: MessageIntensity,
  metadata?: any
): boolean {
  if (type === 'duel_challenge' && metadata?.status === 'accepted') return true;
  if (type === 'threat' && intensity === 'critical') return true;
  if (type === 'alliance_proposal' && metadata?.status === 'accepted') return true;
  if (intensity === 'legendary') return true;
  
  return false;
}

/**
 * Get intensity color for UI
 */
export function getIntensityColor(intensity: MessageIntensity): string {
  switch (intensity) {
    case 'legendary':
      return '#FFD700'; // Gold
    case 'critical':
      return '#FF003C'; // Red
    case 'heated':
      return '#FF6B00'; // Orange
    case 'normal':
    default:
      return '#6666AA'; // Default purple
  }
}

/**
 * Copy message text to clipboard
 */
export async function copyMessageToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Format conversation state for psychological indicators
 */
export function getPsychologicalIndicator(
  hasRead: boolean,
  hasReplied: boolean,
  openCount: number,
  timeSinceRead: number
): string | null {
  if (!hasRead) return null;
  
  if (hasRead && !hasReplied && timeSinceRead > 300000) {
    return 'Seen... no response.';
  }
  
  if (openCount >= 3 && !hasReplied) {
    return "They're thinking...";
  }
  
  return null;
}
