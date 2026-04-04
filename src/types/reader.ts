// Manga Reader system type definitions

export type ReadingMode = 'vertical' | 'page-by-page' | 'fullscreen';
export type ImageQuality = 'high' | 'medium' | 'low';
export type ZoomMode = 'fit-width' | 'fit-height' | 'fit-screen' | 'original';
export type ReadingSpeed = 'slow' | 'normal' | 'fast';

export interface ReaderSettings {
  userId: number;
  mode: ReadingMode;
  imageQuality: ImageQuality;
  zoomMode: ZoomMode;
  nightMode: boolean;
  autoScroll: boolean;
  scrollSpeed: number;
  showPageNumbers: boolean;
  preloadPages: number;
  fontSize: number;
  lineHeight: number;
  fontColor: string;
  backgroundColor: string;
  highContrast: boolean;
  reducedMotion: boolean;
  keyboardShortcuts: boolean;
}

export interface ReadingProgress {
  userId: number;
  seriesId: number;
  episodeId: number;
  pageNumber: number;
  scrollPosition: number;
  percentage: number;
  lastRead: number;
  readingTime: number; // Total time spent reading in ms
  completed: boolean;
  bookmarkedPages: number[];
}

export interface ReadingSession {
  id: string;
  userId: number;
  seriesId: number;
  episodeId: number;
  startTime: number;
  endTime?: number;
  pagesRead: number[];
  totalTime: number;
  averageTimePerPage: number;
  readingSpeed: ReadingSpeed;
}

export interface EpisodeProgress {
  episodeId: number;
  read: boolean;
  completed: boolean;
  progress: number;
  lastPage: number;
  totalPages: number;
  readingTime: number;
  firstRead?: number;
  lastRead?: number;
}

export interface PageAnalytics {
  pageNumber: number;
  views: number;
  averageReadTime: number;
  bookmarks: number;
  shares: number;
  comments: number;
}

export interface ReaderComment {
  id: number;
  userId: number;
  seriesId: number;
  episodeId: number;
  pageNumber?: number;
  text: string;
  timestamp: number;
  likes: number;
  dislikes: number;
  likedBy: number[];
  dislikedBy: number[];
  parentId?: number; // For threaded replies
  replies: ReaderComment[];
  mentions: string[]; // @username mentions
  reactions: CommentReaction[];
  imageAttachment?: string;
  edited: boolean;
  editedAt?: number;
}

export interface CommentReaction {
  userId: number;
  emoji: string;
  timestamp: number;
}

export interface ShareData {
  type: 'page' | 'episode' | 'series';
  seriesId: number;
  episodeId?: number;
  pageNumber?: number;
  url: string;
  embedCode: string;
  qrCode: string;
}

export interface CreatorTip {
  id: string;
  userId: number;
  creatorId: number;
  seriesId: number;
  amount: number; // Gold
  message?: string;
  timestamp: number;
  anonymous: boolean;
}

export interface ReaderAnalytics {
  seriesId: number;
  episodeId: number;
  totalViews: number;
  uniqueReaders: number;
  completionRate: number;
  averageReadingTime: number;
  popularPages: number[];
  dropOffPoints: number[];
  peakReadingTimes: { hour: number; count: number }[];
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  geographicData: {
    country: string;
    count: number;
  }[];
}

export interface CreatorInsights {
  creatorId: number;
  totalViews: number;
  totalReaders: number;
  totalRevenue: number;
  averageRating: number;
  engagementRate: number;
  followerGrowth: number;
  topSeries: {
    seriesId: number;
    title: string;
    views: number;
    revenue: number;
  }[];
  audienceDemographics: {
    ageGroups: { range: string; percentage: number }[];
    topCountries: { country: string; percentage: number }[];
    deviceUsage: { device: string; percentage: number }[];
  };
}

export interface ImageLoadState {
  pageNumber: number;
  url: string;
  loaded: boolean;
  loading: boolean;
  error: boolean;
  quality: ImageQuality;
  cached: boolean;
}

export interface GestureState {
  type: 'swipe' | 'pinch' | 'tap' | 'double-tap';
  direction?: 'left' | 'right' | 'up' | 'down';
  scale?: number;
  position?: { x: number; y: number };
}

export interface KeyboardShortcut {
  key: string;
  action: 'next-page' | 'prev-page' | 'next-episode' | 'prev-episode' | 'toggle-fullscreen' | 'toggle-comments' | 'bookmark' | 'zoom-in' | 'zoom-out';
  description: string;
}

export interface AccessControl {
  seriesId: number;
  episodeId: number;
  isPurchased: boolean;
  isFree: boolean;
  isPreview: boolean;
  previewPages: number;
  price: number;
  unlockDate?: number;
}

export interface OfflineData {
  seriesId: number;
  episodeId: number;
  pages: {
    pageNumber: number;
    imageData: string; // Base64 or blob URL
    cached: boolean;
  }[];
  downloadedAt: number;
  expiresAt: number;
}

export interface ReadingHabit {
  userId: number;
  preferredGenres: string[];
  averageSessionDuration: number;
  preferredReadingTime: number; // Hour of day
  readingSpeed: ReadingSpeed;
  completionRate: number;
  favoriteCreators: number[];
  bingeBehavior: boolean; // Reads multiple episodes in one session
}

export interface RecommendationData {
  seriesId: number;
  score: number;
  reason: 'similar-genre' | 'same-creator' | 'popular' | 'reading-history' | 'trending';
  confidence: number;
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  userId: 0,
  mode: 'vertical',
  imageQuality: 'high',
  zoomMode: 'fit-width',
  nightMode: false,
  autoScroll: false,
  scrollSpeed: 50,
  showPageNumbers: true,
  preloadPages: 3,
  fontSize: 16,
  lineHeight: 1.5,
  fontColor: '#E8E8FF',
  backgroundColor: '#050510',
  highContrast: false,
  reducedMotion: false,
  keyboardShortcuts: true
};

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'ArrowRight', action: 'next-page', description: 'Next page' },
  { key: 'ArrowLeft', action: 'prev-page', description: 'Previous page' },
  { key: 'ArrowDown', action: 'next-episode', description: 'Next episode' },
  { key: 'ArrowUp', action: 'prev-episode', description: 'Previous episode' },
  { key: 'f', action: 'toggle-fullscreen', description: 'Toggle fullscreen' },
  { key: 'c', action: 'toggle-comments', description: 'Toggle comments' },
  { key: 'b', action: 'bookmark', description: 'Bookmark page' },
  { key: '+', action: 'zoom-in', description: 'Zoom in' },
  { key: '-', action: 'zoom-out', description: 'Zoom out' }
];
