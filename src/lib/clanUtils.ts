// Clan utility functions for Reddit-style community features

import { ClanPost, ClanPostSort } from '@/types/game';

/**
 * Clan hype callouts for war events
 */
export const CLAN_WAR_CALLOUTS = {
  victory: [
    "THIS WAS A COMPLETE TAKEOVER!",
    "THEY NEVER STOOD A CHANCE!",
    "ABSOLUTE DOMINATION!",
    "FLAWLESS VICTORY!",
    "TOTAL ANNIHILATION!",
  ],
  defeat: [
    "WE'LL COME BACK STRONGER!",
    "THIS ISN'T OVER!",
    "REVENGE WILL BE OURS!",
    "WE LEARN FROM DEFEAT!",
    "THE COMEBACK STARTS NOW!",
  ],
  close: [
    "DOWN TO THE WIRE!",
    "WHAT A BATTLE!",
    "EDGE OF YOUR SEAT!",
    "TOO CLOSE TO CALL!",
    "LEGENDARY MATCH!",
  ],
  strategy: [
    "A PERFECT STRATEGY!",
    "MASTERFUL COORDINATION!",
    "TACTICAL GENIUS!",
    "BRILLIANT EXECUTION!",
    "STRATEGIC SUPERIORITY!",
  ],
};

/**
 * Generate clan war callout based on context
 */
export function generateClanWarCallout(
  isVictory: boolean,
  scoreDiff: number,
  wasStrategy: boolean
): string {
  if (wasStrategy) {
    return CLAN_WAR_CALLOUTS.strategy[Math.floor(Math.random() * CLAN_WAR_CALLOUTS.strategy.length)];
  }
  
  if (Math.abs(scoreDiff) <= 2) {
    return CLAN_WAR_CALLOUTS.close[Math.floor(Math.random() * CLAN_WAR_CALLOUTS.close.length)];
  }
  
  if (isVictory) {
    return CLAN_WAR_CALLOUTS.victory[Math.floor(Math.random() * CLAN_WAR_CALLOUTS.victory.length)];
  }
  
  return CLAN_WAR_CALLOUTS.defeat[Math.floor(Math.random() * CLAN_WAR_CALLOUTS.defeat.length)];
}

/**
 * Calculate post score (upvotes - downvotes)
 */
export function calculatePostScore(post: ClanPost): number {
  return post.upvotes - post.downvotes;
}

/**
 * Calculate hot score for Reddit-style sorting
 * Based on Reddit's hot algorithm
 */
export function calculateHotScore(post: ClanPost): number {
  const score = calculatePostScore(post);
  const ageInHours = (Date.now() - post.timestamp) / (1000 * 60 * 60);
  
  // Reddit hot formula: score / (age + 2)^gravity
  const gravity = 1.8;
  const hotScore = score / Math.pow(ageInHours + 2, gravity);
  
  return hotScore;
}

/**
 * Sort clan posts based on sort type
 */
export function sortClanPosts(posts: ClanPost[], sortBy: ClanPostSort): ClanPost[] {
  const sorted = [...posts];
  
  switch (sortBy) {
    case 'hot':
      return sorted.sort((a, b) => {
        // Pinned posts always on top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        return calculateHotScore(b) - calculateHotScore(a);
      });
    
    case 'new':
      return sorted.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        return b.timestamp - a.timestamp;
      });
    
    case 'top':
      return sorted.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        return calculatePostScore(b) - calculatePostScore(a);
      });
    
    default:
      return sorted;
  }
}

/**
 * Calculate member reputation based on contributions
 */
export function calculateMemberReputation(
  upvotes: number,
  posts: number,
  wars: number,
  activity: number
): number {
  return (
    upvotes * 2 +
    posts * 5 +
    wars * 10 +
    activity * 1
  );
}

/**
 * Validate clan name
 */
export function validateClanName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Clan name cannot be empty' };
  }
  
  if (name.length < 3) {
    return { valid: false, error: 'Clan name must be at least 3 characters' };
  }
  
  if (name.length > 30) {
    return { valid: false, error: 'Clan name cannot exceed 30 characters' };
  }
  
  // Check for inappropriate content
  const inappropriate = ['fuck', 'shit', 'ass', 'damn'];
  const lowerName = name.toLowerCase();
  if (inappropriate.some(word => lowerName.includes(word))) {
    return { valid: false, error: 'Clan name contains inappropriate language' };
  }
  
  return { valid: true };
}

/**
 * Validate clan tag
 */
export function validateClanTag(tag: string): { valid: boolean; error?: string } {
  if (!tag || tag.trim().length === 0) {
    return { valid: false, error: 'Clan tag cannot be empty' };
  }
  
  if (tag.length < 2) {
    return { valid: false, error: 'Clan tag must be at least 2 characters' };
  }
  
  if (tag.length > 5) {
    return { valid: false, error: 'Clan tag cannot exceed 5 characters' };
  }
  
  // Only alphanumeric
  if (!/^[a-zA-Z0-9]+$/.test(tag)) {
    return { valid: false, error: 'Clan tag can only contain letters and numbers' };
  }
  
  return { valid: true };
}

/**
 * Validate clan rule
 */
export function validateClanRule(title: string, description: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Rule title cannot be empty' };
  }
  
  if (title.length > 50) {
    return { valid: false, error: 'Rule title cannot exceed 50 characters' };
  }
  
  if (!description || description.trim().length === 0) {
    return { valid: false, error: 'Rule description cannot be empty' };
  }
  
  if (description.length > 200) {
    return { valid: false, error: 'Rule description cannot exceed 200 characters' };
  }
  
  return { valid: true };
}

/**
 * Validate clan post
 */
export function validateClanPost(title: string, body: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Post title cannot be empty' };
  }
  
  if (title.length > 100) {
    return { valid: false, error: 'Post title cannot exceed 100 characters' };
  }
  
  if (body.length > 1000) {
    return { valid: false, error: 'Post body cannot exceed 1000 characters' };
  }
  
  return { valid: true };
}

/**
 * Get clan activity level based on post count and member count
 */
export function getClanActivityLevel(
  postCount: number,
  memberCount: number,
  ageInDays: number
): 'low' | 'medium' | 'high' | 'very_high' {
  const postsPerMemberPerDay = postCount / (memberCount * ageInDays);
  
  if (postsPerMemberPerDay >= 0.5) return 'very_high';
  if (postsPerMemberPerDay >= 0.2) return 'high';
  if (postsPerMemberPerDay >= 0.05) return 'medium';
  return 'low';
}

/**
 * Calculate clan growth rate
 */
export function calculateClanGrowth(
  currentMembers: number,
  previousMembers: number,
  daysElapsed: number
): number {
  if (previousMembers === 0) return 0;
  const growth = ((currentMembers - previousMembers) / previousMembers) * 100;
  return growth / daysElapsed; // Growth per day
}

/**
 * Determine if clan is trending
 */
export function isClanTrending(
  activityLevel: 'low' | 'medium' | 'high' | 'very_high',
  growthRate: number,
  recentWins: number
): boolean {
  return (
    (activityLevel === 'high' || activityLevel === 'very_high') &&
    growthRate > 5 && // Growing by 5% per day
    recentWins >= 2
  );
}

/**
 * Default leader titles
 */
export const DEFAULT_LEADER_TITLES = [
  'Clan Leader',
  'Chief',
  'Commander',
  'Dictator',
  'Overlord',
  'Warlord',
  'Supreme Leader',
  'Grand Master',
  'Shogun',
  'Emperor',
];

/**
 * Validate custom leader title
 */
export function validateLeaderTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Leader title cannot be empty' };
  }
  
  if (title.length > 20) {
    return { valid: false, error: 'Leader title cannot exceed 20 characters' };
  }
  
  return { valid: true };
}
