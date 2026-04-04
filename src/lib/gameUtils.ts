import { AnimeFaction, FACTION_COLORS } from '@/types/game';

export const getFactionColor = (anime: AnimeFaction) => FACTION_COLORS[anime]?.hex || '#8B00FF';
export const getFactionGlow = (anime: AnimeFaction) => FACTION_COLORS[anime]?.glow || '#BF5FFF';

export const getAlignmentLabel = (alignment: string) => {
  switch (alignment) {
    case 'hero': return 'HERO';
    case 'villain': return 'VILLAIN';
    case 'wanderer': return 'WANDERER';
    default: return 'WANDERER';
  }
};

export const timeAgo = (ts: number) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};
