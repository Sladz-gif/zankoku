// Feed utility functions for text processing, content moderation, and social features

/**
 * Battle hype callouts based on game state
 */
export const BATTLE_CALLOUTS = {
  comeback: [
    "THIS SHOULDN'T BE POSSIBLE!",
    "HE TURNED IT AROUND!",
    "IMPOSSIBLE COMEBACK!",
    "FROM THE BRINK OF DEFEAT!",
    "THE TABLES HAVE TURNED!",
  ],
  domination: [
    "TOTAL DOMINATION!",
    "ABSOLUTE DESTRUCTION!",
    "OVERWHELMING POWER!",
    "NO MERCY!",
    "COMPLETE ANNIHILATION!",
  ],
  close: [
    "DOWN TO THE WIRE!",
    "EVERY MOVE COUNTS!",
    "TOO CLOSE TO CALL!",
    "EDGE OF YOUR SEAT!",
    "NAIL-BITING FINISH!",
  ],
  technique: [
    "TECHNIQUE MASTERY!",
    "PERFECT EXECUTION!",
    "FLAWLESS TECHNIQUE!",
    "UNSTOPPABLE FORCE!",
    "LEGENDARY SKILL!",
  ],
};

/**
 * Technique-specific hype callouts
 */
export const TECHNIQUE_CALLOUTS: Record<string, string> = {
  'Domain Expansion': "THERE'S NO ESCAPE!",
  'Shadow Clone Jutsu': "THEY'RE EVERYWHERE!",
  "Conqueror's Haki": "KNEEL BEFORE POWER!",
  'Bankai': "WITNESS TRUE POWER!",
  'Black Flash': "CRITICAL HIT!",
  'Rasengan': "DEVASTATING IMPACT!",
  'Kamehameha': "OVERWHELMING ENERGY!",
  'Gear Second': "BLINDING SPEED!",
  'Flame Breathing': "BURNING PASSION!",
  'Nen Mastery': "ABSOLUTE CONTROL!",
  'Mana Zone': "TOTAL CONTROL!",
  'Spirit Bomb': "ULTIMATE TECHNIQUE!",
};

/**
 * Generate battle hype callout based on context
 */
export function generateBattleCallout(
  isVictory: boolean,
  scoreDiff: number,
  techniquesUsed: string[]
): string {
  // Comeback (won from behind)
  if (isVictory && scoreDiff < -3) {
    return BATTLE_CALLOUTS.comeback[Math.floor(Math.random() * BATTLE_CALLOUTS.comeback.length)];
  }
  
  // Domination (won by large margin)
  if (isVictory && scoreDiff > 5) {
    return BATTLE_CALLOUTS.domination[Math.floor(Math.random() * BATTLE_CALLOUTS.domination.length)];
  }
  
  // Close match
  if (Math.abs(scoreDiff) <= 2) {
    return BATTLE_CALLOUTS.close[Math.floor(Math.random() * BATTLE_CALLOUTS.close.length)];
  }
  
  // Technique-focused
  if (techniquesUsed.length >= 3) {
    return BATTLE_CALLOUTS.technique[Math.floor(Math.random() * BATTLE_CALLOUTS.technique.length)];
  }
  
  // Default
  return isVictory ? "VICTORY ACHIEVED!" : "DEFEATED IN BATTLE!";
}

/**
 * Parse text for @mentions
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Parse text for #hashtags
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1].toLowerCase());
  }
  
  return [...new Set(hashtags)]; // Remove duplicates
}

/**
 * Parse text into segments for rendering with links
 */
export type TextSegment = 
  | { type: 'text'; content: string }
  | { type: 'mention'; username: string; raw: string }
  | { type: 'hashtag'; hashtag: string; raw: string }
  | { type: 'url'; url: string };

export function parseTextSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  
  // Combined regex for mentions, hashtags, and URLs
  const regex = /(@\w+)|(#\w+)|(https?:\/\/[^\s]+)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }
    
    const fullMatch = match[0];
    
    if (fullMatch.startsWith('@')) {
      // Mention
      segments.push({
        type: 'mention',
        username: fullMatch.substring(1),
        raw: fullMatch
      });
    } else if (fullMatch.startsWith('#')) {
      // Hashtag
      segments.push({
        type: 'hashtag',
        hashtag: fullMatch.substring(1).toLowerCase(),
        raw: fullMatch
      });
    } else {
      // URL
      segments.push({
        type: 'url',
        url: fullMatch
      });
    }
    
    lastIndex = match.index + fullMatch.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }
  
  return segments.length > 0 ? segments : [{ type: 'text', content: text }];
}

/**
 * Basic profanity filter
 */
const PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'piss', 'dick', 'cock',
  'pussy', 'fag', 'bastard', 'slut', 'whore', 'nigger', 'nigga', 'retard',
];

export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_LIST.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

export function filterProfanity(text: string): string {
  let filtered = text;
  PROFANITY_LIST.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
}

/**
 * Calculate engagement score for trending
 */
export function calculateEngagementScore(post: {
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  views: number;
  timestamp: number;
}): number {
  const ageInHours = (Date.now() - post.timestamp) / (1000 * 60 * 60);
  const ageFactor = Math.max(0, 1 - (ageInHours / 24)); // Decay over 24 hours
  
  const engagementScore = (
    post.likes * 2 +
    post.comments * 3 +
    post.reposts * 4 +
    post.shares * 2 +
    post.views * 0.1
  );
  
  return engagementScore * ageFactor;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
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
 * Generate post URL
 */
export function getPostUrl(postId: number): string {
  return `${window.location.origin}/post/${postId}`;
}

/**
 * Rate limiting for posting
 */
const postTimestamps: number[] = [];
const MAX_POSTS_PER_MINUTE = 5;

export function canPost(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Remove old timestamps
  while (postTimestamps.length > 0 && postTimestamps[0] < oneMinuteAgo) {
    postTimestamps.shift();
  }
  
  return postTimestamps.length < MAX_POSTS_PER_MINUTE;
}

export function recordPost(): void {
  postTimestamps.push(Date.now());
}

/**
 * Validate post content
 */
export function validatePost(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Post cannot be empty' };
  }
  
  if (text.length > 500) {
    return { valid: false, error: 'Post cannot exceed 500 characters' };
  }
  
  if (containsProfanity(text)) {
    return { valid: false, error: 'Post contains inappropriate language' };
  }
  
  if (!canPost()) {
    return { valid: false, error: 'You are posting too quickly. Please wait a moment.' };
  }
  
  return { valid: true };
}
