// Real-time messaging system type definitions

export type MessageIntensity = 'normal' | 'heated' | 'critical' | 'legendary';
export type MessageType = 'text' | 'duel_challenge' | 'clan_invite' | 'threat' | 'alliance_proposal' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type PresenceStatus = 'online' | 'idle' | 'offline';
export type PlayerBehavior = 'neutral' | 'hostile' | 'trusted' | 'avoidant';
export type AnimeReaction = '🔥' | '⚡' | '💀' | '👁' | '🌀' | '🛡' | '🗡';

export interface EnhancedMessage {
  id: number;
  fromId: number;
  toId: number;
  text: string;
  timestamp: number;
  read: boolean;
  status: MessageStatus;
  type: MessageType;
  intensity: MessageIntensity;
  reactions: MessageReaction[];
  replyTo?: number; // Message ID being replied to
  isPinned: boolean;
  isDeleted: boolean;
  deletedForBoth: boolean;
  metadata?: DuelChallengeMetadata | ClanInviteMetadata | ThreatMetadata | AllianceMetadata;
}

export interface MessageReaction {
  userId: number;
  reaction: AnimeReaction;
  timestamp: number;
}

export interface DuelChallengeMetadata {
  stakes: string;
  rules: string;
  expiresAt: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  acceptedAt?: number;
}

export interface ClanInviteMetadata {
  clanId: number;
  clanName: string;
  role: 'member' | 'officer';
  status: 'pending' | 'accepted' | 'declined';
}

export interface ThreatMetadata {
  severity: 'low' | 'medium' | 'high';
  reported: boolean;
  markedSerious: boolean;
  moderationFlags: string[];
}

export interface AllianceMetadata {
  terms: string;
  duration: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  counterTerms?: string;
}

export interface TypingIndicator {
  userId: number;
  conversationWith: number;
  timestamp: number;
}

export interface UserPresence {
  userId: number;
  status: PresenceStatus;
  lastSeen: number;
  isTyping: boolean;
  typingTo?: number;
}

export interface PlayerBehaviorProfile {
  userId: number;
  behavior: PlayerBehavior;
  threatCount: number;
  allianceCount: number;
  ignoredChallenges: number;
  acceptedChallenges: number;
  lastUpdated: number;
}

export interface ConversationState {
  userId: number;
  otherUserId: number;
  openCount: number; // How many times they've opened this chat
  lastOpened: number;
  messagesRead: number;
  messagesSent: number;
}

export interface CinematicTrigger {
  id: string;
  text: string;
  intensity: 'minor' | 'major' | 'legendary';
  duration: number;
  timestamp: number;
}

export interface MessageAction {
  type: 'reply' | 'copy' | 'delete_me' | 'delete_both' | 'forward' | 'react' | 'pin' | 'report';
  messageId: number;
  data?: any;
}

export interface QuickAction {
  type: 'duel' | 'clan_invite' | 'bounty' | 'alliance';
  targetUserId: number;
  data: any;
}

export interface IntensityKeywords {
  heated: string[];
  critical: string[];
  legendary: string[];
}

export const INTENSITY_KEYWORDS: IntensityKeywords = {
  heated: ['fight', 'battle', 'challenge', 'weak', 'pathetic', 'coward', 'scared'],
  critical: ['destroy', 'crush', 'annihilate', 'death', 'kill', 'end', 'finished', 'dead'],
  legendary: ['legendary', 'ultimate', 'final', 'fate', 'destiny', 'god', 'demon', 'king', 'emperor']
};

export const ANIME_REACTIONS: { emoji: AnimeReaction; name: string; description: string }[] = [
  { emoji: '🔥', name: 'Power', description: 'Rage / Power' },
  { emoji: '⚡', name: 'Speed', description: 'Speed / Quick' },
  { emoji: '💀', name: 'Fatal', description: 'Fatal Intent' },
  { emoji: '👁', name: 'Aware', description: 'Awareness' },
  { emoji: '🌀', name: 'Illusion', description: 'Illusion / Mind' },
  { emoji: '🛡', name: 'Defense', description: 'Defense / Guard' },
  { emoji: '🗡', name: 'Attack', description: 'Attack Intent' }
];

export const CINEMATIC_TRIGGERS: Record<string, string[]> = {
  duel_accepted: [
    'A CHALLENGE HAS BEEN ACCEPTED!',
    'THE BATTLE BEGINS!',
    'NO TURNING BACK NOW.',
    'THIS IS IT.'
  ],
  threat_sent: [
    'THE HUNT BEGINS.',
    'THIS WON\'T END PEACEFULLY.',
    'YOU JUST MADE A MISTAKE.',
    'THEY\'RE COMING FOR YOU.'
  ],
  alliance_formed: [
    'AN ALLIANCE HAS BEEN FORGED.',
    'TOGETHER, UNSTOPPABLE.',
    'THE BALANCE SHIFTS.',
    'A NEW POWER RISES.'
  ],
  challenge_declined: [
    'COWARD.',
    'THEY RAN.',
    'FEAR WINS.',
    'OPPORTUNITY LOST.'
  ]
};
