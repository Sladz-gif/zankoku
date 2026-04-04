// Manga platform type definitions

export type MangaGenre = 'action' | 'romance' | 'fantasy' | 'sci-fi' | 'horror' | 'comedy' | 'drama' | 'thriller' | 'mystery' | 'slice-of-life';
export type MangaStatus = 'ongoing' | 'completed' | 'hiatus';
export type MangaTag = 'OP MC' | 'Dark' | 'Slow burn' | 'School' | 'Revenge' | 'Isekai' | 'Reincarnation' | 'System' | 'Cultivation' | 'Harem';
export type ReadingStatus = 'reading' | 'completed' | 'wishlist' | 'dropped';

export interface MangaEpisode {
  id: number;
  seriesId: number;
  episodeNumber: number;
  title: string;
  panels: string[]; // URLs or base64 images
  isFree: boolean;
  price: number; // Gold price if not free
  views: number;
  likes: number;
  comments: number;
  publishedAt: number;
  isLocked: boolean; // User-specific lock state
}

export interface MangaReview {
  id: number;
  seriesId: number;
  userId: number;
  rating: number; // 1-5
  reviewText: string;
  likes: number;
  timestamp: number;
}

export interface MangaComment {
  id: number;
  seriesId?: number;
  episodeId?: number;
  userId: number;
  text: string;
  likes: number;
  likedBy: number[];
  replies: MangaComment[];
  timestamp: number;
}

export interface MangaSeries {
  id: number;
  title: string;
  description: string;
  cover: string; // Gradient or image URL
  authorId: number;
  authorName: string;
  genres: MangaGenre[];
  tags: MangaTag[];
  status: MangaStatus;
  episodes: MangaEpisode[];
  totalEpisodes: number;
  rating: number; // Aggregate rating
  totalRatings: number;
  views: number;
  likes: number;
  likedBy: number[];
  followers: number;
  followedBy: number[];
  price: number; // Full series price (discounted)
  episodePrice: number; // Per-episode price
  createdAt: number;
  updatedAt: number;
  lastEpisodeAt: number;
}

export interface CreatorProfile {
  userId: number;
  username: string;
  bio: string;
  avatar: number;
  series: number[]; // Series IDs
  followers: number;
  totalViews: number;
  totalRevenue: number;
  joinedAt: number;
}

export interface UserLibrary {
  userId: number;
  savedSeries: {
    seriesId: number;
    status: ReadingStatus;
    lastReadEpisode: number;
    progress: number; // Percentage
    addedAt: number;
  }[];
  purchasedEpisodes: number[]; // Episode IDs
  purchasedSeries: number[]; // Series IDs
  readingHistory: {
    seriesId: number;
    episodeId: number;
    timestamp: number;
  }[];
}

export interface MangaPurchase {
  id: number;
  userId: number;
  seriesId?: number;
  episodeId?: number;
  type: 'episode' | 'series';
  price: number;
  timestamp: number;
}

export interface CreatorAnalytics {
  seriesId: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalRevenue: number;
  episodeStats: {
    episodeId: number;
    views: number;
    purchases: number;
    revenue: number;
  }[];
  viewsOverTime: { date: string; views: number }[];
  revenueOverTime: { date: string; revenue: number }[];
}
