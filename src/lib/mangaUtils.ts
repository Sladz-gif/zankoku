// Manga platform utility functions

import { MangaSeries, MangaEpisode, UserLibrary } from '@/types/manga';

/**
 * Calculate trending score for manga series
 * Formula: (views * 0.4) + (likes * 0.3) + (comments * 0.2) + (recentActivity * 0.1)
 */
export function calculateTrendingScore(series: MangaSeries): number {
  const ageInHours = (Date.now() - series.lastEpisodeAt) / (1000 * 60 * 60);
  const recencyFactor = Math.max(0, 1 - (ageInHours / 168)); // Decay over 1 week
  
  const totalComments = series.episodes.reduce((sum, ep) => sum + ep.comments, 0);
  
  const score = (
    series.views * 0.4 +
    series.likes * 0.3 +
    totalComments * 0.2 +
    (recencyFactor * 1000) * 0.1
  );
  
  return score;
}

/**
 * Calculate aggregate rating from reviews
 */
export function calculateAggregateRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

/**
 * Calculate creator revenue (after platform fee)
 */
export function calculateCreatorRevenue(price: number, platformFeePercent: number = 30): number {
  return price * (1 - platformFeePercent / 100);
}

/**
 * Check if user has purchased episode or series
 */
export function hasAccess(
  episodeId: number,
  seriesId: number,
  episode: MangaEpisode,
  library: UserLibrary
): boolean {
  // First episode is always free
  if (episode.episodeNumber === 1) return true;
  
  // Check if episode is free
  if (episode.isFree) return true;
  
  // Check if user purchased the specific episode
  if (library.purchasedEpisodes.includes(episodeId)) return true;
  
  // Check if user purchased the full series
  if (library.purchasedSeries.includes(seriesId)) return true;
  
  return false;
}

/**
 * Calculate reading progress percentage
 */
export function calculateProgress(lastReadEpisode: number, totalEpisodes: number): number {
  if (totalEpisodes === 0) return 0;
  return Math.round((lastReadEpisode / totalEpisodes) * 100);
}

/**
 * Get recommended series based on user history
 */
export function getRecommendations(
  allSeries: MangaSeries[],
  library: UserLibrary,
  limit: number = 10
): MangaSeries[] {
  // Get user's favorite genres from reading history
  const readSeriesIds = library.savedSeries.map(s => s.seriesId);
  const readSeries = allSeries.filter(s => readSeriesIds.includes(s.id));
  
  // Count genre frequency
  const genreCount: Record<string, number> = {};
  readSeries.forEach(series => {
    series.genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });
  
  // Get top genres
  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([genre]) => genre);
  
  // Find series with matching genres that user hasn't read
  const recommendations = allSeries
    .filter(series => !readSeriesIds.includes(series.id))
    .map(series => {
      // Calculate match score
      const genreMatches = series.genres.filter(g => topGenres.includes(g)).length;
      const popularityScore = series.views / 1000 + series.likes / 100;
      const score = genreMatches * 100 + popularityScore;
      
      return { series, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ series }) => series);
  
  return recommendations;
}

/**
 * Get rising series (new series with high engagement)
 */
export function getRisingSeries(allSeries: MangaSeries[], limit: number = 10): MangaSeries[] {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  return allSeries
    .filter(series => series.createdAt > thirtyDaysAgo)
    .map(series => {
      const ageInDays = (Date.now() - series.createdAt) / (1000 * 60 * 60 * 24);
      const growthRate = series.views / Math.max(ageInDays, 1);
      return { series, growthRate };
    })
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, limit)
    .map(({ series }) => series);
}

/**
 * Get hidden gems (high rating, low views)
 */
export function getHiddenGems(allSeries: MangaSeries[], limit: number = 10): MangaSeries[] {
  return allSeries
    .filter(series => series.rating >= 4.5 && series.views < 50000 && series.totalRatings >= 10)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Highlight search matches in text
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
}

/**
 * Search series by title, author, tags
 */
export function searchSeries(
  allSeries: MangaSeries[],
  query: string,
  genres: string[] = [],
  excludeGenres: string[] = []
): MangaSeries[] {
  const lowerQuery = query.toLowerCase();
  
  return allSeries.filter(series => {
    // Text search
    const matchesQuery = !query || 
      series.title.toLowerCase().includes(lowerQuery) ||
      series.authorName.toLowerCase().includes(lowerQuery) ||
      series.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    
    // Genre filter
    const matchesGenres = genres.length === 0 || 
      genres.some(genre => series.genres.includes(genre as any));
    
    // Exclude genres
    const notExcluded = excludeGenres.length === 0 ||
      !excludeGenres.some(genre => series.genres.includes(genre as any));
    
    return matchesQuery && matchesGenres && notExcluded;
  });
}

/**
 * Sort series based on criteria
 */
export function sortSeries(
  series: MangaSeries[],
  sortBy: 'trending' | 'new' | 'popular' | 'rating'
): MangaSeries[] {
  const sorted = [...series];
  
  switch (sortBy) {
    case 'trending':
      return sorted.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
    
    case 'new':
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    
    case 'popular':
      return sorted.sort((a, b) => b.views - a.views);
    
    case 'rating':
      return sorted.sort((a, b) => {
        if (b.rating === a.rating) {
          return b.totalRatings - a.totalRatings;
        }
        return b.rating - a.rating;
      });
    
    default:
      return sorted;
  }
}

/**
 * Get series share URL
 */
export function getSeriesShareUrl(seriesId: number): string {
  return `${window.location.origin}/manga/${seriesId}`;
}

/**
 * Get episode share URL
 */
export function getEpisodeShareUrl(seriesId: number, episodeId: number): string {
  return `${window.location.origin}/manga/${seriesId}/episode/${episodeId}`;
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
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
 * Format number for display (125K, 1.2M, etc.)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Calculate time ago
 */
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}

/**
 * Validate series title
 */
export function validateSeriesTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }
  
  if (title.length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }
  
  if (title.length > 100) {
    return { valid: false, error: 'Title cannot exceed 100 characters' };
  }
  
  return { valid: true };
}

/**
 * Validate episode title
 */
export function validateEpisodeTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Episode title cannot be empty' };
  }
  
  if (title.length > 200) {
    return { valid: false, error: 'Episode title cannot exceed 200 characters' };
  }
  
  return { valid: true };
}

/**
 * Store search history in localStorage
 */
export function saveSearchHistory(query: string): void {
  const history = getSearchHistory();
  const updated = [query, ...history.filter(q => q !== query)].slice(0, 10);
  localStorage.setItem('manga_search_history', JSON.stringify(updated));
}

/**
 * Get search history from localStorage
 */
export function getSearchHistory(): string[] {
  try {
    const stored = localStorage.getItem('manga_search_history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  localStorage.removeItem('manga_search_history');
}
