// Manga Reader utility functions

import { 
  ReadingProgress, 
  ReadingSession, 
  EpisodeProgress, 
  ReadingSpeed,
  ReaderSettings,
  ImageQuality,
  ReaderComment,
  ReaderAnalytics,
  ReadingHabit,
  RecommendationData
} from '@/types/reader';

/**
 * Calculate reading progress percentage
 */
export function calculateReadingProgress(
  currentPage: number,
  totalPages: number,
  scrollPosition?: number
): number {
  const baseProgress = (currentPage / totalPages) * 100;
  
  if (scrollPosition !== undefined) {
    const pageProgress = scrollPosition / 100; // Assuming scroll is 0-100
    const progressPerPage = 100 / totalPages;
    return Math.min(100, baseProgress + (pageProgress * progressPerPage));
  }
  
  return Math.min(100, baseProgress);
}

/**
 * Determine reading speed based on time per page
 */
export function calculateReadingSpeed(averageTimePerPage: number): ReadingSpeed {
  if (averageTimePerPage < 30000) return 'fast'; // Less than 30 seconds
  if (averageTimePerPage < 60000) return 'normal'; // 30-60 seconds
  return 'slow'; // More than 60 seconds
}

/**
 * Calculate average time per page
 */
export function calculateAverageTimePerPage(
  totalTime: number,
  pagesRead: number
): number {
  if (pagesRead === 0) return 0;
  return totalTime / pagesRead;
}

/**
 * Track reading session
 */
export function createReadingSession(
  userId: number,
  seriesId: number,
  episodeId: number,
  pagesRead: number[]
): ReadingSession {
  const now = Date.now();
  const totalTime = 0; // Will be updated on session end
  
  return {
    id: `SESSION-${now}-${userId}`,
    userId,
    seriesId,
    episodeId,
    startTime: now,
    pagesRead,
    totalTime,
    averageTimePerPage: 0,
    readingSpeed: 'normal'
  };
}

/**
 * End reading session and calculate stats
 */
export function endReadingSession(
  session: ReadingSession,
  endTime: number
): ReadingSession {
  const totalTime = endTime - session.startTime;
  const averageTimePerPage = calculateAverageTimePerPage(totalTime, session.pagesRead.length);
  const readingSpeed = calculateReadingSpeed(averageTimePerPage);
  
  return {
    ...session,
    endTime,
    totalTime,
    averageTimePerPage,
    readingSpeed
  };
}

/**
 * Check if episode is completed
 */
export function isEpisodeCompleted(
  currentPage: number,
  totalPages: number,
  threshold: number = 0.9
): boolean {
  return (currentPage / totalPages) >= threshold;
}

/**
 * Get next unread episode
 */
export function getNextUnreadEpisode(
  episodes: EpisodeProgress[],
  currentEpisodeId: number
): EpisodeProgress | null {
  const currentIndex = episodes.findIndex(ep => ep.episodeId === currentEpisodeId);
  
  for (let i = currentIndex + 1; i < episodes.length; i++) {
    if (!episodes[i].completed) {
      return episodes[i];
    }
  }
  
  return null;
}

/**
 * Calculate image URL with quality parameter
 */
export function getImageUrl(
  baseUrl: string,
  quality: ImageQuality
): string {
  const qualityParams = {
    high: 'q=100&w=2000',
    medium: 'q=75&w=1200',
    low: 'q=50&w=800'
  };
  
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${qualityParams[quality]}`;
}

/**
 * Preload images for smooth reading
 */
export async function preloadImages(
  urls: string[],
  quality: ImageQuality
): Promise<void> {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = getImageUrl(url, quality);
    });
  });
  
  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Failed to preload some images:', error);
  }
}

/**
 * Calculate pages to preload
 */
export function getPagesToPreload(
  currentPage: number,
  totalPages: number,
  preloadCount: number
): number[] {
  const pages: number[] = [];
  
  for (let i = 1; i <= preloadCount; i++) {
    const nextPage = currentPage + i;
    if (nextPage <= totalPages) {
      pages.push(nextPage);
    }
  }
  
  return pages;
}

/**
 * Detect gesture from touch events
 */
export function detectGesture(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  threshold: number = 50
): 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | null {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > threshold) {
      return deltaX > 0 ? 'swipe-right' : 'swipe-left';
    }
  } else {
    if (Math.abs(deltaY) > threshold) {
      return deltaY > 0 ? 'swipe-down' : 'swipe-up';
    }
  }
  
  return null;
}

/**
 * Calculate scroll momentum
 */
export function calculateScrollMomentum(
  velocity: number,
  friction: number = 0.95
): number {
  return velocity * friction;
}

/**
 * Generate share URL
 */
export function generateShareUrl(
  seriesId: number,
  episodeId?: number,
  pageNumber?: number
): string {
  const baseUrl = window.location.origin;
  let url = `${baseUrl}/manga/series/${seriesId}`;
  
  if (episodeId) {
    url += `/episode/${episodeId}`;
    if (pageNumber) {
      url += `?page=${pageNumber}`;
    }
  }
  
  return url;
}

/**
 * Generate embed code
 */
export function generateEmbedCode(
  seriesId: number,
  episodeId?: number,
  width: number = 800,
  height: number = 600
): string {
  const url = generateShareUrl(seriesId, episodeId);
  return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
}

/**
 * Generate QR code data URL
 */
export function generateQRCodeUrl(url: string): string {
  // In production, use a QR code library
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
}

/**
 * Extract mentions from comment text
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

/**
 * Build comment tree from flat list
 */
export function buildCommentTree(comments: ReaderComment[]): ReaderComment[] {
  const commentMap = new Map<number, ReaderComment>();
  const rootComments: ReaderComment[] = [];
  
  // First pass: create map
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });
  
  // Second pass: build tree
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });
  
  return rootComments;
}

/**
 * Sort comments by various criteria
 */
export function sortComments(
  comments: ReaderComment[],
  sortBy: 'newest' | 'oldest' | 'popular'
): ReaderComment[] {
  const sorted = [...comments];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.timestamp - a.timestamp);
    case 'oldest':
      return sorted.sort((a, b) => a.timestamp - b.timestamp);
    case 'popular':
      return sorted.sort((a, b) => b.likes - a.likes);
    default:
      return sorted;
  }
}

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(
  completedReaders: number,
  totalReaders: number
): number {
  if (totalReaders === 0) return 0;
  return (completedReaders / totalReaders) * 100;
}

/**
 * Identify drop-off points
 */
export function identifyDropOffPoints(
  pageViews: { page: number; views: number }[]
): number[] {
  const dropOffPoints: number[] = [];
  
  for (let i = 1; i < pageViews.length; i++) {
    const currentViews = pageViews[i].views;
    const previousViews = pageViews[i - 1].views;
    
    // If views drop by more than 30%, mark as drop-off point
    if (previousViews > 0 && (currentViews / previousViews) < 0.7) {
      dropOffPoints.push(pageViews[i].page);
    }
  }
  
  return dropOffPoints;
}

/**
 * Analyze reading habits
 */
export function analyzeReadingHabits(
  sessions: ReadingSession[]
): ReadingHabit {
  const totalSessions = sessions.length;
  if (totalSessions === 0) {
    return {
      userId: 0,
      preferredGenres: [],
      averageSessionDuration: 0,
      preferredReadingTime: 0,
      readingSpeed: 'normal',
      completionRate: 0,
      favoriteCreators: [],
      bingeBehavior: false
    };
  }
  
  const totalDuration = sessions.reduce((sum, s) => sum + s.totalTime, 0);
  const averageSessionDuration = totalDuration / totalSessions;
  
  // Calculate preferred reading time (hour of day)
  const readingTimes = sessions.map(s => new Date(s.startTime).getHours());
  const timeFrequency = readingTimes.reduce((acc, hour) => {
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const preferredReadingTime = Number(
    Object.entries(timeFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 0
  );
  
  // Detect binge behavior (3+ episodes in one session)
  const bingeSessions = sessions.filter(s => s.pagesRead.length >= 30); // Assuming ~10 pages per episode
  const bingeBehavior = bingeSessions.length / totalSessions > 0.3;
  
  // Calculate average reading speed
  const speeds = sessions.map(s => s.readingSpeed);
  const speedCounts = speeds.reduce((acc, speed) => {
    acc[speed] = (acc[speed] || 0) + 1;
    return acc;
  }, {} as Record<ReadingSpeed, number>);
  
  const readingSpeed = (Object.entries(speedCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'normal') as ReadingSpeed;
  
  return {
    userId: sessions[0].userId,
    preferredGenres: [],
    averageSessionDuration,
    preferredReadingTime,
    readingSpeed,
    completionRate: 0,
    favoriteCreators: [],
    bingeBehavior
  };
}

/**
 * Generate recommendations based on reading history
 */
export function generateRecommendations(
  readHistory: { seriesId: number; genre: string; creatorId: number }[],
  allSeries: { seriesId: number; genre: string; creatorId: number; popularity: number }[]
): RecommendationData[] {
  const recommendations: RecommendationData[] = [];
  
  // Get user's preferred genres
  const genreCounts = readHistory.reduce((acc, item) => {
    acc[item.genre] = (acc[item.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const preferredGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);
  
  // Get favorite creators
  const creatorCounts = readHistory.reduce((acc, item) => {
    acc[item.creatorId] = (acc[item.creatorId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const favoriteCreators = Object.entries(creatorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => Number(id));
  
  // Generate recommendations
  allSeries.forEach(series => {
    // Skip already read series
    if (readHistory.some(h => h.seriesId === series.seriesId)) return;
    
    let score = 0;
    let reason: RecommendationData['reason'] = 'popular';
    
    // Same creator bonus
    if (favoriteCreators.includes(series.creatorId)) {
      score += 50;
      reason = 'same-creator';
    }
    
    // Similar genre bonus
    if (preferredGenres.includes(series.genre)) {
      score += 30;
      reason = 'similar-genre';
    }
    
    // Popularity bonus
    score += series.popularity * 0.2;
    
    if (score > 20) {
      recommendations.push({
        seriesId: series.seriesId,
        score,
        reason,
        confidence: Math.min(100, score)
      });
    }
  });
  
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
}

/**
 * Save reading progress to localStorage
 */
export function saveProgressToLocal(progress: ReadingProgress): void {
  const key = `reading_progress_${progress.userId}_${progress.seriesId}`;
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Load reading progress from localStorage
 */
export function loadProgressFromLocal(
  userId: number,
  seriesId: number
): ReadingProgress | null {
  const key = `reading_progress_${userId}_${seriesId}`;
  const data = localStorage.getItem(key);
  
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse reading progress:', error);
      return null;
    }
  }
  
  return null;
}

/**
 * Format reading time
 */
export function formatReadingTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Check if image is cached
 */
export function isImageCached(url: string): boolean {
  // Simple check - in production, use proper cache API
  const img = new Image();
  img.src = url;
  return img.complete;
}

/**
 * Calculate optimal scroll speed based on content
 */
export function calculateOptimalScrollSpeed(
  contentHeight: number,
  viewportHeight: number,
  readingSpeed: ReadingSpeed
): number {
  const baseSpeed = {
    slow: 20,
    normal: 50,
    fast: 80
  }[readingSpeed];
  
  const contentRatio = contentHeight / viewportHeight;
  return baseSpeed * Math.min(2, contentRatio);
}

/**
 * Validate page number
 */
export function validatePageNumber(
  page: number,
  totalPages: number
): number {
  return Math.max(1, Math.min(page, totalPages));
}
