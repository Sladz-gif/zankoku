export type Alignment = 'hero' | 'villain' | 'wanderer';

export type AnimeFaction = 'naruto' | 'jjk' | 'onepiece' | 'bleach' | 'blackclover' | 'dragonball' | 'demonslayer' | 'hxh' | 'physical';

export interface Line {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  player: number;
}

export type RoleTag = 'STRATEGIST' | 'BERSERKER' | 'BOUNTY HUNTER' | 'GHOST' | 'BROKER' | 'GAMBLER' | 'TRAITOR' | 'LONE WOLF' | 'WAR CHIEF' | 'PHANTOM' | 'MERCENARY' | 'COWARD' | '';

export type Currency = { bronze: number; silver: number; gold: number };

export type ShapeMode = 'square' | 'triangle';

export type BattleState = 'normal' | 'overload' | 'awakening' | 'last_stand' | 'forbidden';

export type MomentumLevel = 'critical' | 'low' | 'normal' | 'high' | 'peak' | 'legendary';

export interface Shape {
  r: number;
  c: number;
  player: number;
  cracked?: boolean;
  corrupted?: boolean;
  corruptionTurn?: number;
}

export interface Callout {
  id: string;
  text: string;
  intensity: 'minor' | 'major' | 'legendary';
  category: 'technique' | 'reversal' | 'awakening' | 'forbidden' | 'momentum' | 'last_stand' | 'domination';
  timestamp: number;
}

export interface BattleEffects {
  screenShake?: boolean;
  slowMotion?: boolean;
  flash?: boolean;
  pressure?: boolean;
} 

export interface Technique {
  name: string;
  cost: number;
  description: string;
  effect: string;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  text: string;
  timestamp: number;
  likes: number;
}

export interface ZankokuUser {
  id: number;
  username: string;
  bio: string;
  anime: AnimeFaction;
  alignment: Alignment;
  rank: number;
  points: number;
  roleTag: RoleTag;
  cowardStars: number;
  betrayalHistory: string[];
  bountyActive: boolean;
  bountyAmount: number;
  currency: Currency;
  techniques: string[];
  duelsWon: number;
  duelsLost: number;
  shapesCaptured: number;
  clanWars: number;
  bountiesClaimed: number;
  avatar: number;
  clanId: number | null;
  resource: number;
  maxResource: number;
  country?: string;
  countryFlag?: string;
  isLoggedIn?: boolean;
  // Resource system
  resourceLastRefill?: number; // Timestamp of last refill
  hasUnlimitedResources?: boolean; // Unlimited subscription active
  unlimitedResourcesExpiry?: number; // When unlimited expires (timestamp)
  unlimitedResourceType?: 'weekly' | 'monthly' | 'season'; // Type of unlimited subscription
}

export type ClanJoinType = 'open' | 'approval' | 'invite';
export type ClanMemberRole = 'leader' | 'officer' | 'member';
export type ClanPostType = 'discussion' | 'strategy' | 'announcement' | 'war_log';
export type ClanPostSort = 'hot' | 'new' | 'top';

export interface ClanRule {
  id: number;
  title: string;
  description: string;
}

export interface ClanMember {
  userId: number;
  role: ClanMemberRole;
  joinedAt: number;
  reputation: number;
  contributions: number;
}

export interface ClanPost {
  id: number;
  clanId: number;
  userId: number;
  type: ClanPostType;
  title: string;
  body: string;
  upvotes: number;
  downvotes: number;
  upvotedBy: number[];
  downvotedBy: number[];
  comments: number;
  timestamp: number;
  isPinned: boolean;
  isRemoved: boolean;
}

export interface ClanJoinRequest {
  id: number;
  clanId: number;
  userId: number;
  message: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Clan {
  id: number;
  name: string;
  tag: string;
  alignment: Alignment;
  primaryAnime: AnimeFaction | 'mixed';
  members: number;
  wins: number;
  losses: number;
  motto: string;
  description: string;
  leaderId: number;
  leaderTitle: string;
  rules: ClanRule[];
  joinType: ClanJoinType;
  createdAt: number;
  bannedUsers: number[];
  memberList: ClanMember[];
}

export type PostType = 'text' | 'battle' | 'achievement' | 'clan_war' | 'bounty_placed' | 'bounty_claimed';

export interface BattleMetadata {
  opponentId: number;
  opponentName: string;
  score: string;
  shapesCaptured: number;
  techniquesUsed: string[];
  isVictory: boolean;
  hypeCallout?: string;
  techniqueCallouts?: { technique: string; callout: string }[];
}

export interface Post {
  id: number;
  userId: number;
  text: string;
  type: PostType;
  upvotes: number;
  downvotes: number;
  comments: number;
  timestamp: number;
  likes: number;
  likedBy: number[];
  reposts: number;
  repostedBy: number[];
  bookmarkedBy: number[];
  shares: number;
  views: number;
  quotedPostId?: number;
  quoteText?: string;
  battleMetadata?: BattleMetadata;
  hashtags?: string[];
  mentions?: string[];
}

export interface Message {
  id: number;
  fromId: number;
  toId: number;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface Notification {
  id: number;
  type: 'duel_challenge' | 'bounty_placed' | 'bounty_claimed' | 'war_declared' | 'followed' | 'comment' | 'like' | 'repost' | 'spy_detected' | 'role_earned' | 'rank_up' | 'betrayed';
  fromUserId: number;
  text: string;
  timestamp: number;
  read: boolean;
  link?: string;
}

export interface Bounty {
  id: number;
  targetId: number;
  placedById: number;
  amount: number;
  anonymous: boolean;
  expiresAt: number;
  active: boolean;
}

export interface SpyMission {
  id: number;
  targetClanId: number;
  difficulty: string;
  intelType: string;
  cost: number;
  costCurrency: 'bronze' | 'silver';
  riskLevel: number;
}

export const FACTION_COLORS: Record<AnimeFaction, { hex: string; glow: string; css: string }> = {
  naruto: { hex: '#FF6B00', glow: '#FF9500', css: 'neon-orange' },
  jjk: { hex: '#8B00FF', glow: '#BF5FFF', css: 'neon-purple' },
  onepiece: { hex: '#00C8FF', glow: '#00E5FF', css: 'neon-blue' },
  bleach: { hex: '#00FF88', glow: '#00FFAA', css: 'neon-green' },
  blackclover: { hex: '#FFD700', glow: '#FFEC60', css: 'neon-gold' },
  dragonball: { hex: '#FF4400', glow: '#FF7700', css: 'neon-orange' },
  demonslayer: { hex: '#FF003C', glow: '#FF3366', css: 'neon-red' },
  hxh: { hex: '#00FF88', glow: '#00FFAA', css: 'neon-green' },
  physical: { hex: '#BBBBBB', glow: '#DDDDDD', css: 'neon-blue' },
};

export const FACTION_NAMES: Record<AnimeFaction, string> = {
  naruto: 'Naruto',
  jjk: 'Jujutsu Kaisen',
  onepiece: 'One Piece',
  bleach: 'Bleach',
  blackclover: 'Black Clover',
  dragonball: 'Dragon Ball Z',
  demonslayer: 'Demon Slayer',
  hxh: 'Hunter x Hunter',
  physical: 'Physical Fighter',
};

export const FACTION_RESOURCE: Record<AnimeFaction, string> = {
  naruto: 'Chakra',
  jjk: 'Cursed Energy',
  onepiece: 'Haki',
  bleach: 'Reiatsu',
  blackclover: 'Mana',
  dragonball: 'Ki',
  demonslayer: 'Breath',
  hxh: 'Nen',
  physical: 'Willpower',
};

export const TECHNIQUES: Record<AnimeFaction, Technique[]> = {
  naruto: [
    { name: 'Shadow Clone Jutsu', cost: 15, description: 'Place 3 lines this turn + gain 10 resources', effect: 'double_turn' },
    { name: 'Rasengan', cost: 20, description: 'DESTROY 2 opponent shapes + steal 1 shape', effect: 'destroy_shape' },
    { name: 'Sage Mode', cost: 10, description: 'Auto-complete your best shape + reveal next 3 moves', effect: 'reveal_best' },
  ],
  jjk: [
    { name: 'Domain Expansion', cost: 20, description: 'TRAP opponent in center - auto-complete 2 shapes + freeze opponent 2 turns', effect: 'restrict_zone' },
    { name: 'Divergent Fist', cost: 12, description: 'Next 3 shapes score TRIPLE + gain 20 resources', effect: 'double_score' },
    { name: 'Black Flash', cost: 18, description: 'STEAL 2 opponent shapes + destroy 1 shape', effect: 'steal_shape' },
  ],
  onepiece: [
    { name: "Conqueror's Haki", cost: 20, description: 'DOMINATE - Opponent skips 2 turns + lose 30 resources + 1 shape destroyed', effect: 'skip_turn' },
    { name: 'Armament Haki', cost: 12, description: 'BLOCK 3 opponent lines permanently + protect 2 of your shapes', effect: 'block_line' },
    { name: 'Observation Haki', cost: 15, description: 'SEE THE FUTURE - Place 3 perfect lines + predict opponent next 3 moves', effect: 'double_turn' },
  ],
  bleach: [
    { name: 'Bankai', cost: 20, description: 'RELEASE - Steal 3 opponent shapes + gain 25 resources + place 2 lines', effect: 'steal_shape' },
    { name: 'Getsuga Tensho', cost: 18, description: 'OBLITERATE - Destroy 2 opponent shapes + damage 1 additional shape', effect: 'destroy_shape' },
    { name: 'Flash Step', cost: 10, description: 'BLITZ - Place 3 lines instantly + gain 15 resources', effect: 'double_turn' },
  ],
  blackclover: [
    { name: 'Mana Zone', cost: 15, description: 'CONTROL SPACE - Connect any dots + auto-complete 1 shape + place 2 extra lines', effect: 'long_connect' },
    { name: 'Black Asta', cost: 20, description: 'ANTI-MAGIC - Nullify opponent last 3 moves + steal their resources', effect: 'nullify_line' },
    { name: 'Mana Skin', cost: 12, description: 'ABSOLUTE DEFENSE - Protect next 3 shapes + reflect 1 attack', effect: 'protect_shape' },
  ],
  dragonball: [
    { name: 'Kamehameha', cost: 20, description: 'ENERGY WAVE - Wipe entire row/column + destroy 2 shapes + gain 20 resources', effect: 'wipe_row' },
    { name: 'Instant Transmission', cost: 12, description: 'TELEPORT - Place 4 lines anywhere + complete 1 shape instantly', effect: 'double_turn' },
    { name: 'Spirit Bomb', cost: 18, description: 'ULTIMATE POWER - Steal 3 shapes + destroy 1 shape + gain 30 resources', effect: 'steal_shape' },
  ],
  demonslayer: [
    { name: 'Flame Breathing', cost: 15, description: 'BLAZING ASSAULT - Place 3 lines + burn 1 opponent shape + gain 15 resources', effect: 'double_turn' },
    { name: 'Water Breathing', cost: 12, description: 'FLOWING DEFENSE - Opponent techniques cost triple + block 2 lines + protect 1 shape', effect: 'double_cost' },
    { name: 'Thunder Clap Flash', cost: 20, description: 'GODSPEED - Steal 2 shapes + place 2 lines + opponent skips turn', effect: 'steal_shape' },
  ],
  hxh: [
    { name: 'Nen Restriction', cost: 15, description: 'BINDING VOW - Lock opponent techniques 4 turns + steal 20 resources + destroy 1 shape', effect: 'lock_techniques' },
    { name: 'Gyo', cost: 10, description: 'ENHANCED VISION - Auto-complete 2 shapes + reveal all threats + place 2 lines', effect: 'reveal_best' },
    { name: 'Jajanken', cost: 20, description: 'ULTIMATE GAMBLE - Rock: destroy 3 shapes | Paper: steal 3 shapes | Scissors: place 5 lines', effect: 'random_power' },
  ],
  physical: [
    { name: 'Iron Will', cost: 10, description: 'UNBREAKABLE - Block next 3 techniques + gain 25 resources + protect 2 shapes', effect: 'block_technique' },
    { name: 'Pressure', cost: 12, description: 'INTIMIDATE - Opponent random placement 3 turns + lose 20 resources + skip 1 turn', effect: 'random_place' },
    { name: 'Endurance', cost: 15, description: 'RECOVERY - Reclaim 4 shapes + heal 30 resources + place 2 lines', effect: 'recover_shapes' },
  ],
};

export const FORBIDDEN_TECHNIQUES: Record<AnimeFaction, Technique[]> = {
  naruto: [
    { name: 'Kurama Mode', cost: 100, description: 'Triple technique power for 3 turns, drains unlimited to 200 or ends unlimited', effect: 'awakening_sacrifice' },
    { name: 'Death God Contract', cost: 150, description: 'Steal 50% of enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'mass_sacrifice' },
    { name: 'Eight Gates', cost: 120, description: 'Instantly complete 3 shapes, drains unlimited to 200 or ends unlimited', effect: 'instant_power_sacrifice' },
    { name: 'Curse Mark', cost: 110, description: 'Corrupt all enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'corruption_sacrifice' },
  ],
  jjk: [
    { name: 'Unlimited Void', cost: 100, description: 'Triple technique power for 3 turns, drains unlimited to 200 or ends unlimited', effect: 'awakening_sacrifice' },
    { name: 'Cursed Technique Lapse', cost: 150, description: 'Steal 50% of enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'mass_sacrifice' },
    { name: 'Reverse Cursed Energy', cost: 120, description: 'Instantly complete 3 shapes, drains unlimited to 200 or ends unlimited', effect: 'instant_power_sacrifice' },
    { name: 'Vessel Transformation', cost: 110, description: 'Corrupt all enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'corruption_sacrifice' },
  ],
  hxh: [
    { name: 'Adult Gon', cost: 100, description: 'Triple technique power for 3 turns, drains unlimited to 200 or ends unlimited', effect: 'awakening_sacrifice' },
    { name: 'Zero Hand', cost: 150, description: 'Steal 50% of enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'mass_sacrifice' },
    { name: 'Emperor Time', cost: 120, description: 'Instantly complete 3 shapes, drains unlimited to 200 or ends unlimited', effect: 'instant_power_sacrifice' },
    { name: 'Nen After Death', cost: 110, description: 'Corrupt all enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'corruption_sacrifice' },
  ],
  onepiece: [
    { name: 'Gear Fifth', cost: 120, description: 'Control entire board for 2 turns, drains unlimited to 200 or ends unlimited', effect: 'board_control_sacrifice' },
    { name: 'Advanced Conqueror', cost: 150, description: 'Destroy all enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'total_destruction_sacrifice' },
  ],
  bleach: [
    { name: 'Final Getsuga Tensho', cost: 120, description: 'Wipe 75% of board, drains unlimited to 200 or ends unlimited', effect: 'board_wipe_sacrifice' },
    { name: 'Mugetsu', cost: 110, description: 'Steal all enemy techniques, drains unlimited to 200 or ends unlimited', effect: 'technique_theft_sacrifice' },
    { name: 'Hollowfication', cost: 130, description: 'Negate all enemy abilities permanently, drains unlimited to 200 or ends unlimited', effect: 'permanent_negation_sacrifice' },
    { name: 'Bankai Kenpachi', cost: 150, description: 'Control game rules for 1 turn, drains unlimited to 200 or ends unlimited', effect: 'rule_control_sacrifice' },
  ],
  dragonball: [
    { name: 'Ultra Instinct', cost: 150, description: 'Auto-dodge all attacks for 3 turns, drains unlimited to 200 or ends unlimited', effect: 'perfect_dodge_sacrifice' },
    { name: 'Spirit Bomb', cost: 120, description: 'Gain infinite resources for 2 turns, drains unlimited to 200 or ends unlimited', effect: 'infinite_power_sacrifice' },
    { name: 'Hakai', cost: 130, description: 'Instantly win if enemy has 50% or less resources, drains unlimited to 200 or ends unlimited', effect: 'desperation_gamble' },
    { name: 'Evil Containment Wave', cost: 110, description: 'Corrupt all shapes on board, drains unlimited to 200 or ends unlimited', effect: 'total_corruption_sacrifice' },
    { name: 'Eternal Dragon Wish', cost: 150, description: 'Any desired effect, drains unlimited to 200 or ends unlimited', effect: 'wish_sacrifice' },
    { name: 'Super Saiyan God', cost: 120, description: 'Triple all stats, drains unlimited to 200 or ends unlimited', effect: 'power_evolution_sacrifice' },
    { name: 'Majin Rage', cost: 100, description: 'Destroy all enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'blind_rage_sacrifice' },
    { name: 'Time Stop', cost: 150, description: 'Cannot lose for 2 turns, drains unlimited to 200 or ends unlimited', effect: 'draw_sacrifice' },
  ],
  blackclover: [
    { name: 'Devil Union', cost: 100, description: 'Triple technique power for 3 turns, drains unlimited to 200 or ends unlimited', effect: 'awakening_sacrifice' },
    { name: 'Forbidden Magic', cost: 150, description: 'Steal 50% of enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'mass_sacrifice' },
    { name: 'Anti Magic Ultimate', cost: 120, description: 'Instantly complete 3 shapes, drains unlimited to 200 or ends unlimited', effect: 'instant_power_sacrifice' },
    { name: 'Demon Transformation', cost: 110, description: 'Corrupt all enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'corruption_sacrifice' },
  ],
  demonslayer: [
    { name: 'Transparent World', cost: 100, description: 'Triple technique power for 3 turns, drains unlimited to 200 or ends unlimited', effect: 'awakening_sacrifice' },
    { name: 'Sun Breathing 13th Form', cost: 150, description: 'Steal 50% of enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'mass_sacrifice' },
    { name: 'Dance of the Fire God', cost: 120, description: 'Instantly complete 3 shapes, drains unlimited to 200 or ends unlimited', effect: 'instant_power_sacrifice' },
    { name: 'Demon King Form', cost: 110, description: 'Corrupt all enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'corruption_sacrifice' },
  ],
  physical: [
    { name: 'Final Stand', cost: 100, description: 'Triple technique power for 3 turns, drains unlimited to 200 or ends unlimited', effect: 'awakening_sacrifice' },
    { name: 'Last Resort', cost: 150, description: 'Steal 50% of enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'mass_sacrifice' },
    { name: 'Desperation Move', cost: 120, description: 'Instantly complete 3 shapes, drains unlimited to 200 or ends unlimited', effect: 'instant_power_sacrifice' },
    { name: 'Sacrificial Strike', cost: 110, description: 'Corrupt all enemy shapes, drains unlimited to 200 or ends unlimited', effect: 'corruption_sacrifice' },
  ],
};

export const STORE_PACKAGES = {
  silver: [
    { id: 1, name: 'Starter Pack', silver: 500, gold: 0, price: '$2.99' },
    { id: 2, name: 'Warrior Pack', silver: 1500, gold: 200, price: '$7.99' },
    { id: 3, name: 'Kage Bundle', silver: 5000, gold: 1000, price: '$19.99' },
    { id: 4, name: 'Monthly Arc Pass', silver: 0, gold: 500, price: '$4.99/mo', description: 'Season techniques + 500 Gold/mo' },
  ],
};

export const COUNTRIES = [
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: 'CN', flag: '🇨🇳', name: 'China' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: 'IN', flag: '🇮🇳', name: 'India' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: 'MX', flag: '🇲🇽', name: 'Mexico' },
  { code: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: 'PH', flag: '🇵🇭', name: 'Philippines' },
  { code: 'ID', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'TH', flag: '🇹🇭', name: 'Thailand' },
  { code: 'VN', flag: '🇻🇳', name: 'Vietnam' },
  { code: 'PL', flag: '🇵🇱', name: 'Poland' },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'SE', flag: '🇸🇪', name: 'Sweden' },
  { code: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: 'TR', flag: '🇹🇷', name: 'Turkey' },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: 'CL', flag: '🇨🇱', name: 'Chile' },
  { code: 'CO', flag: '🇨🇴', name: 'Colombia' },
  { code: 'PE', flag: '🇵🇪', name: 'Peru' },
  { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: 'MY', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore' },
  { code: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal' },
  { code: 'BE', flag: '🇧🇪', name: 'Belgium' },
  { code: 'CH', flag: '🇨🇭', name: 'Switzerland' },
  { code: 'AT', flag: '🇦🇹', name: 'Austria' },
  { code: 'NO', flag: '🇳🇴', name: 'Norway' },
  { code: 'DK', flag: '🇩🇰', name: 'Denmark' },
  { code: 'FI', flag: '🇫🇮', name: 'Finland' },
  { code: 'IE', flag: '🇮🇪', name: 'Ireland' },
  { code: 'PK', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'BD', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'RO', flag: '🇷🇴', name: 'Romania' },
  { code: 'CZ', flag: '🇨🇿', name: 'Czech Republic' },
  { code: 'HU', flag: '🇭🇺', name: 'Hungary' },
  { code: 'GR', flag: '🇬🇷', name: 'Greece' },
  { code: 'IL', flag: '🇮🇱', name: 'Israel' },
  { code: 'AF', flag: '🇦🇫', name: 'Afghanistan' },
  { code: 'AL', flag: '🇦🇱', name: 'Albania' },
  { code: 'DZ', flag: '🇩🇿', name: 'Algeria' },
  { code: 'AD', flag: '🇦🇩', name: 'Andorra' },
  { code: 'AO', flag: '🇦🇴', name: 'Angola' },
  { code: 'AG', flag: '🇦🇬', name: 'Antigua and Barbuda' },
  { code: 'AM', flag: '🇦🇲', name: 'Armenia' },
  { code: 'AW', flag: '🇦🇼', name: 'Aruba' },
  { code: 'AZ', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: 'BS', flag: '🇧🇸', name: 'Bahamas' },
  { code: 'BH', flag: '🇧🇭', name: 'Bahrain' },
  { code: 'BB', flag: '🇧🇧', name: 'Barbados' },
  { code: 'BY', flag: '🇧🇾', name: 'Belarus' },
  { code: 'BZ', flag: '🇧🇿', name: 'Belize' },
  { code: 'BJ', flag: '🇧🇯', name: 'Benin' },
  { code: 'BT', flag: '🇧🇹', name: 'Bhutan' },
  { code: 'BO', flag: '🇧🇴', name: 'Bolivia' },
  { code: 'BA', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: 'BW', flag: '🇧🇼', name: 'Botswana' },
  { code: 'BN', flag: '🇧🇳', name: 'Brunei' },
  { code: 'BF', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: 'BI', flag: '🇧🇮', name: 'Burundi' },
  { code: 'CV', flag: '🇨🇻', name: 'Cabo Verde' },
  { code: 'KH', flag: '🇰🇭', name: 'Cambodia' },
  { code: 'CM', flag: '🇨🇲', name: 'Cameroon' },
  { code: 'CF', flag: '🇨🇫', name: 'Central African Republic' },
  { code: 'TD', flag: '🇹🇩', name: 'Chad' },
  { code: 'KM', flag: '🇰🇲', name: 'Comoros' },
  { code: 'CG', flag: '🇨🇬', name: 'Congo' },
  { code: 'CR', flag: '🇨🇷', name: 'Costa Rica' },
  { code: 'CI', flag: '🇨🇮', name: 'Côte d\'Ivoire' },
  { code: 'HR', flag: '🇭🇷', name: 'Croatia' },
  { code: 'CU', flag: '🇨🇺', name: 'Cuba' },
  { code: 'CY', flag: '🇨🇾', name: 'Cyprus' },
  { code: 'DJ', flag: '🇩🇯', name: 'Djibouti' },
  { code: 'DM', flag: '🇩🇲', name: 'Dominica' },
  { code: 'DO', flag: '🇩🇴', name: 'Dominican Republic' },
  { code: 'EC', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'SV', flag: '🇸🇻', name: 'El Salvador' },
  { code: 'GQ', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: 'ER', flag: '🇪🇷', name: 'Eritrea' },
  { code: 'EE', flag: '🇪🇪', name: 'Estonia' },
  { code: 'SZ', flag: '🇸🇿', name: 'Eswatini' },
  { code: 'FJ', flag: '🇫🇯', name: 'Fiji' },
  { code: 'GA', flag: '🇬🇦', name: 'Gabon' },
  { code: 'GM', flag: '🇬🇲', name: 'Gambia' },
  { code: 'GE', flag: '🇬🇪', name: 'Georgia' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: 'GD', flag: '🇬🇩', name: 'Grenada' },
  { code: 'GT', flag: '🇬🇹', name: 'Guatemala' },
  { code: 'GN', flag: '🇬🇳', name: 'Guinea' },
  { code: 'GW', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: 'GY', flag: '🇬🇾', name: 'Guyana' },
  { code: 'HT', flag: '🇭🇹', name: 'Haiti' },
  { code: 'HN', flag: '🇭🇳', name: 'Honduras' },
  { code: 'IS', flag: '🇮🇸', name: 'Iceland' },
  { code: 'JM', flag: '🇯🇲', name: 'Jamaica' },
  { code: 'JO', flag: '🇯🇴', name: 'Jordan' },
  { code: 'KZ', flag: '🇰🇿', name: 'Kazakhstan' },
  { code: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: 'KI', flag: '🇰🇮', name: 'Kiribati' },
  { code: 'KW', flag: '🇰🇼', name: 'Kuwait' },
  { code: 'KG', flag: '🇰🇬', name: 'Kyrgyzstan' },
  { code: 'LA', flag: '🇱🇦', name: 'Laos' },
  { code: 'LV', flag: '🇱🇻', name: 'Latvia' },
  { code: 'LB', flag: '🇱🇧', name: 'Lebanon' },
  { code: 'LS', flag: '🇱🇸', name: 'Lesotho' },
  { code: 'LR', flag: '🇱🇷', name: 'Liberia' },
  { code: 'LY', flag: '🇱🇾', name: 'Libya' },
  { code: 'LI', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: 'LT', flag: '🇱🇹', name: 'Lithuania' },
  { code: 'LU', flag: '🇱🇺', name: 'Luxembourg' },
  { code: 'MG', flag: '🇲🇬', name: 'Madagascar' },
  { code: 'MW', flag: '🇲🇼', name: 'Malawi' },
  { code: 'MV', flag: '🇲🇻', name: 'Maldives' },
  { code: 'ML', flag: '🇲🇱', name: 'Mali' },
  { code: 'MT', flag: '🇲🇹', name: 'Malta' },
  { code: 'MH', flag: '🇲🇭', name: 'Marshall Islands' },
  { code: 'MR', flag: '🇲🇷', name: 'Mauritania' },
  { code: 'MU', flag: '🇲🇺', name: 'Mauritius' },
  { code: 'MD', flag: '🇲🇩', name: 'Moldova' },
  { code: 'MC', flag: '🇲🇨', name: 'Monaco' },
  { code: 'MN', flag: '🇲🇳', name: 'Mongolia' },
  { code: 'ME', flag: '🇲🇪', name: 'Montenegro' },
  { code: 'MA', flag: '🇲🇦', name: 'Morocco' },
  { code: 'MZ', flag: '🇲🇿', name: 'Mozambique' },
  { code: 'MM', flag: '🇲🇲', name: 'Myanmar' },
  { code: 'NA', flag: '🇳🇦', name: 'Namibia' },
  { code: 'NR', flag: '🇳🇷', name: 'Nauru' },
  { code: 'NP', flag: '🇳🇵', name: 'Nepal' },
  { code: 'NI', flag: '🇳🇮', name: 'Nicaragua' },
  { code: 'MK', flag: '🇲🇰', name: 'North Macedonia' },
  { code: 'OM', flag: '🇴🇲', name: 'Oman' },
  { code: 'PA', flag: '🇵🇦', name: 'Panama' },
  { code: 'PG', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: 'PY', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'QA', flag: '🇶🇦', name: 'Qatar' },
  { code: 'SN', flag: '🇸🇳', name: 'Senegal' },
  { code: 'RS', flag: '🇷🇸', name: 'Serbia' },
  { code: 'SC', flag: '🇸🇨', name: 'Seychelles' },
  { code: 'SL', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: 'SK', flag: '🇸🇰', name: 'Slovakia' },
  { code: 'SI', flag: '🇸🇮', name: 'Slovenia' },
  { code: 'SB', flag: '🇸🇧', name: 'Solomon Islands' },
  { code: 'SO', flag: '🇸🇴', name: 'Somalia' },
  { code: 'SS', flag: '🇸🇸', name: 'South Sudan' },
  { code: 'LK', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: 'SD', flag: '🇸🇩', name: 'Sudan' },
  { code: 'SR', flag: '🇸🇷', name: 'Suriname' },
  { code: 'SY', flag: '🇸🇾', name: 'Syria' },
  { code: 'TW', flag: '🇹🇼', name: 'Taiwan' },
  { code: 'TJ', flag: '🇹🇯', name: 'Tajikistan' },
  { code: 'TZ', flag: '🇹🇿', name: 'Tanzania' },
  { code: 'TL', flag: '🇹🇱', name: 'Timor-Leste' },
  { code: 'TG', flag: '🇹🇬', name: 'Togo' },
  { code: 'TO', flag: '🇹🇴', name: 'Tonga' },
  { code: 'TT', flag: '🇹🇹', name: 'Trinidad and Tobago' },
  { code: 'TN', flag: '🇹🇳', name: 'Tunisia' },
  { code: 'TM', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: 'TV', flag: '🇹🇻', name: 'Tuvalu' },
  { code: 'UG', flag: '🇺🇬', name: 'Uganda' },
  { code: 'UA', flag: '🇺🇦', name: 'Ukraine' },
  { code: 'UY', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'UZ', flag: '🇺🇿', name: 'Uzbekistan' },
  { code: 'VU', flag: '🇻🇺', name: 'Vanuatu' },
  { code: 'VE', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'YE', flag: '🇾🇪', name: 'Yemen' },
  { code: 'ZM', flag: '🇿🇲', name: 'Zambia' },
  { code: 'ZW', flag: '🇿🇼', name: 'Zimbabwe' },
];
