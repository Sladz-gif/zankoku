// Faction color constants for use across all UI components

export interface FactionColorSet {
  primary: string;
  glow: string;
}

export const FACTION_COLORS: Record<string, FactionColorSet> = {
  naruto: { primary: '#FF6B00', glow: '#FF9500' },
  jjk: { primary: '#8B00FF', glow: '#BF5FFF' },
  onepiece: { primary: '#00C8FF', glow: '#00E5FF' },
  bleach: { primary: '#00FF88', glow: '#00FFAA' },
  blackclover: { primary: '#FFD700', glow: '#FFEC60' },
  dragonball: { primary: '#FF4400', glow: '#FF7700' },
  demonslayer: { primary: '#FF1744', glow: '#FF6D00' },
  hunterxhunter: { primary: '#76FF03', glow: '#CCFF90' },
  physical: { primary: '#FFFFFF', glow: '#AAAAAA' },
  mixed: { primary: '#6666AA', glow: '#8888CC' }
};

export const getFactionPrimaryColor = (faction: string): string => {
  return FACTION_COLORS[faction]?.primary || '#6666AA';
};

export const getFactionGlowColor = (faction: string): string => {
  return FACTION_COLORS[faction]?.glow || '#8888CC';
};

export const getFactionColorSet = (faction: string): FactionColorSet => {
  return FACTION_COLORS[faction] || { primary: '#6666AA', glow: '#8888CC' };
};
