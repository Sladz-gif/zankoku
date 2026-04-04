// Shared utility functions for Zankoku

export function getFactionColor(anime: string): string {
  const map: Record<string, string> = {
    naruto: '#FF6B00',
    jjk: '#8B00FF',
    onepiece: '#00C8FF',
    bleach: '#00FF88',
    blackclover: '#FFD700',
    dragonball: '#FF4400',
    demonslayer: '#FF1744',
    hxh: '#76FF03',
    physical: '#FFFFFF',
  };
  return map[anime] ?? '#6666AA';
}

export function getFactionGlow(anime: string): string {
  const map: Record<string, string> = {
    naruto: '#FF9500',
    jjk: '#BF5FFF',
    onepiece: '#00E5FF',
    bleach: '#00FFAA',
    blackclover: '#FFEC60',
    dragonball: '#FF7700',
    demonslayer: '#FF6D00',
    hxh: '#CCFF90',
    physical: '#AAAAAA',
  };
  return map[anime] ?? '#444466';
}

export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (hours > 0) {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  }
  if (minutes > 0) {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return 'Just now';
}

export function formatFullTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: dateObj.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined });
  }
  if (hours > 0) {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  }
  const dateObj = new Date(timestamp);
  return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
