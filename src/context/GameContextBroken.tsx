import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { ZankokuUser, Clan, Post, Bounty, SpyMission, AnimeFaction, Alignment, Currency, Comment, Message, Notification, ClanPost, ClanJoinRequest, ClanMemberRole, ClanPostType, ClanRule } from '@/types/game';
import { MangaSeries, MangaEpisode, MangaReview, MangaComment, UserLibrary, MangaPurchase, CreatorProfile } from '@/types/manga';
import { Purchase, Subscription, PurchaseHistory, ContentOwnership, PurchaseType } from '@/types/store';
import { EnhancedMessage, MessageType, MessageIntensity, AnimeReaction, UserPresence, TypingIndicator, PlayerBehaviorProfile, CinematicTrigger, MessageAction } from '@/types/messaging';
import { ReaderSettings, ReadingProgress, ReadingSession, ReaderComment, ReaderAnalytics, ImageQuality, ReadingMode } from '@/types/reader';
import { UserStatistics, TierProgress, Achievement, BattleHistoryEntry, TechniqueData, ProfileSettings } from '@/types/profile';
import { EnhancedBounty, HunterReputation, BountyHunt, BountyPlacement, AntiAbuseDetection, BountyNotification, ClaimRequirement } from '@/types/bounties';
import { RankingSystem } from '@/lib/rankingSystem';
import { 
  profilesService, 
  postsService, 
  clansService, 
  bountiesService, 
  commentsService,
  initializeRealtime,
  cleanupRealtime 
} from '@/lib/realtimeService';
import { supabase } from '@/lib/supabase';

// Helper function to generate UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface GameState {
  currentUser: ZankokuUser | null;
  onboarded: boolean;
  users: ZankokuUser[];
  clans: Clan[];
  posts: Post[];
  bounties: Bounty[];
  spyMissions: SpyMission[];
  comments: Comment[];
  messages: Message[];
  notifications: Notification[];
  setCurrentUser: (u: ZankokuUser | null) => void;
  setOnboarded: (v: boolean) => void;
  addPost: (text: string, quotedPostId?: number, quoteText?: string) => void;
  updateCurrency: (c: Partial<Currency>) => void;
  joinClan: (clanId: number) => void;
  updatePoints: (delta: number) => void;
  toggleLike: (postId: number) => void;
  repost: (postId: number) => void;
  addComment: (postId: number, text: string) => void;
  sendMessage: (toId: number, text: string) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  updateUserRank: (userId: number, newRank: number) => void;
  getRankings: () => ReturnType<typeof RankingSystem.calculateRankings>;
  updateUserStats: (userId: number, stats: Partial<ZankokuUser>) => void;
  toggleBookmark: (postId: number) => void;
  sharePost: (postId: number) => void;
  deletePost: (postId: number) => void;
  editPost: (postId: number, newText: string) => void;
  incrementPostViews: (postId: number) => void;
  followedUsers: number[];
  blockedUsers: number[];
  toggleFollow: (userId: number) => void;
  blockUser: (userId: number) => void;
  clanPosts: ClanPost[];
  clanJoinRequests: ClanJoinRequest[];
  createClan: (name: string, tag: string, motto: string, description: string, alignment: Alignment, anime: AnimeFaction | 'mixed', leaderTitle: string, rules: ClanRule[], joinType: 'open' | 'approval' | 'invite') => void;
  leaveClan: () => void;
  addClanPost: (clanId: number, type: ClanPostType, title: string, body: string) => void;
  voteClanPost: (postId: number, vote: 'up' | 'down') => void;
  removeClanPost: (postId: number) => void;
  pinClanPost: (postId: number) => void;
  requestJoinClan: (clanId: number, message: string) => void;
  approveJoinRequest: (requestId: number) => void;
  rejectJoinRequest: (requestId: number) => void;
  banClanMember: (clanId: number, userId: number) => void;
  promoteClanMember: (clanId: number, userId: number, role: ClanMemberRole) => void;
  updateClanRules: (clanId: number, rules: ClanRule[]) => void;
  getClanMemberRole: (clanId: number, userId: number) => ClanMemberRole | null;
  mangaSeries: MangaSeries[];
  userLibrary: UserLibrary | null;
  followedCreators: number[];
  likeMangaSeries: (seriesId: number) => void;
  followCreator: (creatorId: number) => void;
  purchaseEpisode: (episodeId: number, price: number) => boolean;
  purchaseSeries: (seriesId: number, price: number) => boolean;
  addToLibrary: (seriesId: number, status: 'reading' | 'completed' | 'wishlist') => void;
  updateReadingProgress: (seriesId: number, episodeId: number) => void;
  addMangaReview: (seriesId: number, rating: number, reviewText: string) => void;
  addMangaComment: (seriesId: number, episodeId: number | undefined, text: string) => void;
  likeMangaComment: (commentId: number) => void;
  purchases: Purchase[];
  purchaseHistory: PurchaseHistory | null;
  activeSubscription: Subscription | null;
  contentOwnership: ContentOwnership | null;
  makePurchase: (type: PurchaseType, itemId: string, itemName: string, price: number, silverAmount: number, goldAmount: number) => Promise<boolean>;
  activateSubscription: (tier: 'weekly' | 'monthly' | 'season', durationDays: number, price: number, goldCost: number) => boolean;
  cancelSubscription: () => void;
  hasContentAccess: (contentId: number) => boolean;
  addSilver: (amount: number) => void;
  addGold: (amount: number) => void;
  deductSilver: (amount: number) => boolean;
  deductGold: (amount: number) => boolean;
  enhancedMessages: EnhancedMessage[];
  userPresences: UserPresence[];
  typingIndicators: TypingIndicator[];
  behaviorProfiles: PlayerBehaviorProfile[];
  cinematicTriggers: CinematicTrigger[];
  sendEnhancedMessage: (toId: number, text: string, type?: MessageType, metadata?: any) => void;
  reactToMessage: (messageId: number, reaction: AnimeReaction) => void;
  deleteMessage: (messageId: number, forBoth: boolean) => void;
  pinMessage: (messageId: number) => void;
  replyToMessage: (messageId: number, text: string) => void;
  setTyping: (toUserId: number, isTyping: boolean) => void;
  updatePresence: (status: 'online' | 'idle' | 'offline') => void;
  acceptDuelChallenge: (messageId: number) => void;
  declineDuelChallenge: (messageId: number) => void;
  acceptClanInvite: (messageId: number) => void;
  reportMessage: (messageId: number, reason: string) => void;
  triggerCinematic: (text: string, intensity: 'minor' | 'major' | 'legendary') => void;
  readerSettings: ReaderSettings | null;
  readingProgress: ReadingProgress[];
  readingSessions: ReadingSession[];
  readerComments: ReaderComment[];
  readerAnalytics: ReaderAnalytics[];
  updateReaderSettings: (settings: Partial<ReaderSettings>) => void;
  saveReadingProgress: (seriesId: number, episodeId: number, pageNumber: number, scrollPosition: number) => void;
  startReadingSession: (seriesId: number, episodeId: number) => void;
  endReadingSession: (sessionId: string, pagesRead: number[]) => void;
  addReaderComment: (seriesId: number, episodeId: number, text: string, pageNumber?: number, parentId?: number) => void;
  reactToReaderComment: (commentId: number, emoji: string) => void;
  likeReaderComment: (commentId: number) => void;
  bookmarkPage: (seriesId: number, episodeId: number, pageNumber: number) => void;
  trackPageView: (seriesId: number, episodeId: number, pageNumber: number) => void;
  tipCreator: (creatorId: number, seriesId: number, amount: number, message?: string) => void;
  userStatistics: UserStatistics | null;
  tierProgress: TierProgress | null;
  achievements: Achievement[];
  battleHistory: BattleHistoryEntry[];
  profileSettings: ProfileSettings | null;
  updateUserStatistics: (stats: Partial<UserStatistics>) => void;
  unlockAchievement: (achievementId: string) => void;
  addBattleToHistory: (battle: BattleHistoryEntry) => void;
  updateProfileSettings: (settings: Partial<ProfileSettings>) => void;
  calculateTierProgress: () => void;
  enhancedBounties: EnhancedBounty[];
  hunterReputation: HunterReputation | null;
  activeBountyHunts: BountyHunt[];
  bountyPlacement: BountyPlacement | null;
  antiAbuseDetection: AntiAbuseDetection | null;
  bountyNotifications: BountyNotification[];
  placeBounty: (targetId: number, amount: number, reason: string, duration: number, requirement: ClaimRequirement) => Promise<boolean>;
  acceptBountyHunt: (bountyId: number) => boolean;
  abandonBountyHunt: (huntId: string) => void;
  claimBounty: (huntId: string) => Promise<boolean>;
  cancelBounty: (bountyId: number) => boolean;
  updateHunterReputation: () => void;
  recordBountyBattle: (huntId: string, won: boolean) => void;
  checkAntiAbuse: (userId: number) => AntiAbuseDetection;
  getBountyLeaderboard: (period: 'daily' | 'weekly' | 'monthly' | 'all-time') => any[];
  // Resource Management
  refillUserResources: () => boolean;
  checkResourceRefillAvailable: () => boolean;
  getTimeUntilRefill: () => number;
  activateUnlimitedResources: (type: 'weekly' | 'monthly' | 'season') => void;
  deactivateUnlimitedResources: () => void;
  handleForbiddenTechniqueUse: (cost: number) => { success: boolean; unlimitedEnded: boolean; unlimitedDrained: boolean };
  getResourceStatus: () => { current: number; hasUnlimited: boolean; canRefill: boolean; timeUntilRefill: number };
}

// Initialize empty state - will be populated from Supabase
const mockUsers: ZankokuUser[] = [];
const mockClans: Clan[] = [];
const mockPosts: Post[] = [];
const mockComments: Comment[] = [];
const mockMessages: Message[] = [];
const mockNotifications: Notification[] = [];
const mockBounties: Bounty[] = [];
const mockSpyMissions: SpyMission[] = [];

const defaultContext: GameState = {
  currentUser: null,
  onboarded: false,
  users: [],
  clans: [],
  posts: [],
  bounties: [],
  spyMissions: [],
  comments: [],
  messages: [],
  notifications: [],
  setCurrentUser: () => {},
  setOnboarded: () => {},
  addPost: () => {},
  updateCurrency: () => {},
  joinClan: () => {},
  updatePoints: () => {},
  toggleLike: () => {},
  repost: () => {},
  addComment: () => {},
  sendMessage: () => {},
  markNotificationRead: () => {},
  markAllNotificationsRead: () => {},
  updateUserRank: () => {},
  getRankings: () => ({ users: [], clans: [], length: 0, pop: () => undefined, push: () => undefined, concat: () => [] }),
  updateUserStats: () => {},
  toggleBookmark: () => {},
  sharePost: () => {},
  deletePost: () => {},
  editPost: () => {},
  incrementPostViews: () => {},
  followedUsers: [],
  blockedUsers: [],
  toggleFollow: () => {},
  blockUser: () => {},
  clanPosts: [],
  clanJoinRequests: [],
  createClan: () => {},
  leaveClan: () => {},
  addClanPost: () => {},
  voteClanPost: () => {},
  removeClanPost: () => {},
  pinClanPost: () => {},
  requestJoinClan: () => {},
  approveJoinRequest: () => {},
  rejectJoinRequest: () => {},
  banClanMember: () => {},
  promoteClanMember: () => {},
  updateClanRules: () => {},
  getClanMemberRole: () => null,
  mangaSeries: [],
  userLibrary: null,
  followedCreators: [],
  likeMangaSeries: () => {},
  followCreator: () => {},
  purchaseEpisode: () => false,
  purchaseSeries: () => false,
  addToLibrary: () => {},
  updateReadingProgress: () => {},
  addMangaReview: () => {},
  addMangaComment: () => {},
  likeMangaComment: () => {},
  getMangaComments: () => [],
  getMangaReviews: () => [],
  getReadingProgress: () => null,
  getLibraryStats: () => ({ totalSeries: 0, totalEpisodes: 0, completedSeries: 0 }),
  getResourceStatus: () => ({ current: 100, max: 100, hasUnlimited: false, canRefill: false, timeUntilRefill: null })
};

export const GameContext = createContext<GameState | null>(defaultContext);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setInternalCurrentUser] = useState<ZankokuUser | null>(() => {
    const saved = sessionStorage.getItem('zankoku_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [onboarded, setOnboarded] = useState(false);
  const [users, setUsers] = useState<ZankokuUser[]>(mockUsers);
  const [clans, setClans] = useState<Clan[]>(mockClans);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [bounties, setBounties] = useState<Bounty[]>(mockBounties);
  const [spyMissions] = useState<SpyMission[]>(mockSpyMissions);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
  const [clanPosts, setClanPosts] = useState<ClanPost[]>([]);
  const [clanJoinRequests, setClanJoinRequests] = useState<ClanJoinRequest[]>([]);
  const [mangaSeries, setMangaSeries] = useState<MangaSeries[]>([]);
  const [userLibrary, setUserLibrary] = useState<UserLibrary | null>(null);
  const [followedCreators, setFollowedCreators] = useState<number[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [contentOwnership, setContentOwnership] = useState<ContentOwnership | null>(null);
  const [enhancedMessages, setEnhancedMessages] = useState<EnhancedMessage[]>([]);
  const [userPresences, setUserPresences] = useState<UserPresence[]>([]);
  const [typingIndicators, setTypingIndicators] = useState<TypingIndicator[]>([]);
  const [behaviorProfiles, setBehaviorProfiles] = useState<PlayerBehaviorProfile[]>([]);
  const [cinematicTriggers, setCinematicTriggers] = useState<CinematicTrigger[]>([]);
  const [readerSettings, setReaderSettings] = useState<ReaderSettings | null>(null);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>([]);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [readerComments, setReaderComments] = useState<ReaderComment[]>([]);
  const [readerAnalytics, setReaderAnalytics] = useState<ReaderAnalytics[]>([]);
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);
  const [tierProgress, setTierProgress] = useState<TierProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [battleHistory, setBattleHistory] = useState<BattleHistoryEntry[]>([]);
  const [profileSettings, setProfileSettings] = useState<ProfileSettings | null>(null);
  const [enhancedBounties, setEnhancedBounties] = useState<EnhancedBounty[]>([]);
  const [hunterReputation, setHunterReputation] = useState<HunterReputation | null>(null);
  const [activeBountyHunts, setActiveBountyHunts] = useState<BountyHunt[]>([]);
  const [bountyPlacement, setBountyPlacement] = useState<BountyPlacement | null>(null);
  const [antiAbuseDetection, setAntiAbuseDetection] = useState<AntiAbuseDetection | null>(null);
  const [bountyNotifications, setBountyNotifications] = useState<BountyNotification[]>([]);

  // Sync with Supabase auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('GameContext: Auth state changed', event, session?.user?.id);
        console.log('GameContext: Session exists:', !!session);
        console.log('GameContext: Current user before update:', !!currentUser);
        
        if (event === 'SIGNED_OUT' || !session) {
          // Clear user state on sign out
          setCurrentUser(null);
        } else if (event === 'SIGNED_IN' && session.user) {
          console.log('GameContext: Setting user immediately from session');
          // Set user immediately from session data, don't wait for profile
          const basicUser: ZankokuUser = {
            id: parseInt(session.user.id),
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Player',
            bio: '',
            anime: 'jjk',
            alignment: 'wanderer',
            rank: 500,
            points: 1000,
            roleTag: '',
            cowardStars: 0,
            betrayalHistory: [],
            bountyActive: false,
            bountyAmount: 0,
            currency: { bronze: 50, silver: 0, gold: 0 },
            techniques: ['Divergent Fist'],
            duelsWon: 0,
            duelsLost: 0,
            shapesCaptured: 0,
            clanWars: 0,
            bountiesClaimed: 0,
            avatar: 1,
            clanId: null,
            resource: 100,
            maxResource: 100,
            isLoggedIn: true
          };
          console.log('GameContext: Setting basic user immediately:', basicUser);
          setCurrentUser(basicUser);
          
          // Try to load profile in background (non-blocking)
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            console.log('GameContext: Profile fetch result:', { profile, error });
            
            if (error) {
              console.error('Profile fetch error:', error);
              // User already set above, so no action needed
            } else if (profile) {
              // Update user with profile data
              const profileUser: ZankokuUser = {
                id: parseInt(profile.id),
                username: profile.username || 'Player',
                bio: profile.bio || '',
                anime: profile.anime_faction || 'jjk',
                alignment: profile.alignment || 'wanderer',
                rank: profile.rank || 500,
                points: profile.points || 1000,
                roleTag: profile.role_tag || '',
                cowardStars: profile.coward_stars || 0,
                betrayalHistory: profile.betrayal_history || [],
                bountyActive: profile.bounty_active || false,
                bountyAmount: profile.bounty_amount || 0,
                currency: profile.currency || { bronze: 50, silver: 0, gold: 0 },
                techniques: profile.techniques || ['Divergent Fist'],
                duelsWon: profile.duels_won || 0,
                duelsLost: profile.duels_lost || 0,
                shapesCaptured: profile.shapes_captured || 0,
                clanWars: profile.clan_wars || 0,
                bountiesClaimed: profile.bounties_claimed || 0,
                avatar: profile.avatar || 1,
                clanId: profile.clan_id || null,
                resource: profile.resource || 100,
                maxResource: profile.max_resource || 100,
                isLoggedIn: true
              };
              console.log('GameContext: Updating user with profile data:', profileUser);
              setCurrentUser(profileUser);
            }
          } catch (error) {
            console.error('Error loading user profile:', error);
            // User already set above, so no action needed
          }
              const basicUser: ZankokuUser = {
                id: parseInt(session.user.id),
                username: session.user.user_metadata?.username || 'Player',
                bio: '',
                anime: 'jjk',
                alignment: 'wanderer',
                rank: 500,
                points: 1000,
                roleTag: '',
                cowardStars: 0,
                betrayalHistory: [],
                bountyActive: false,
                bountyAmount: 0,
                currency: { bronze: 50, silver: 0, gold: 0 },
                techniques: ['Divergent Fist'],
                duelsWon: 0,
                duelsLost: 0,
                shapesCaptured: 0,
                clanWars: 0,
                bountiesClaimed: 0,
                avatar: 1,
            // Still set a basic user even on error
            const basicUser: ZankokuUser = {
              id: parseInt(session.user.id),
              username: session.user.user_metadata?.username || 'Player',
              bio: '',
              anime: 'jjk',
              alignment: 'wanderer',
              rank: 500,
              points: 1000,
              roleTag: '',
              cowardStars: 0,
              betrayalHistory: [],
              bountyActive: false,
              bountyAmount: 0,
              currency: { bronze: 50, silver: 0, gold: 0 },
              techniques: ['Divergent Fist'],
              duelsWon: 0,
              duelsLost: 0,
              shapesCaptured: 0,
              clanWars: 0,
              bountiesClaimed: 0,
              avatar: 1,
              clanId: null,
              resource: 100,
              maxResource: 100,
              isLoggedIn: true
            };
            setCurrentUser(basicUser);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load real data from Supabase 
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_banned', false)
          .order('created_at', { ascending: false });

        // Load posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        // Load clans
        const { data: clansData, error: clansError } = await supabase
          .from('clans')
          .select('*')
          .eq('is_active', true)
          .order('wins', { ascending: false });

        // Load bounties
        const { data: bountiesData, error: bountiesError } = await supabase
          .from('bounties')
          .select('*')
          .eq('status', 'active')
          .order('amount', { ascending: false });

        // Update state with real data
        if (profilesData && !profilesError) {
          setUsers(profilesData);
        }
        
        if (postsData && !postsError) {
          setPosts(postsData);
        }
        
        if (clansData && !clansError) {
          setClans(clansData);
        }
        
        if (bountiesData && !bountiesError) {
          setBounties(bountiesData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [setUsers, setPosts, setClans, setBounties]);

  const setCurrentUser = useCallback((user: ZankokuUser | null) => {
    if (user) {
      sessionStorage.setItem('zankoku_session', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('zankoku_session');
    }
    setInternalCurrentUser(user);
    // Auto onboard if setting a valid user with isLoggedIn true
    if (user?.isLoggedIn) {
      setOnboarded(true);
    } else if (!user) {
      setOnboarded(false);
    }
  }, []);

  const addPost = useCallback((text: string, quotedPostId?: number, quoteText?: string) => {
    if (!currentUser) return;
    const newPost: Post = { 
      id: generateUUID(), 
      userId: currentUser.id, 
      text, 
      type: 'text',
      upvotes: 0, 
      downvotes: 0, 
      comments: 0, 
      timestamp: Date.now(), 
      likes: 0, 
      likedBy: [], 
      reposts: 0, 
      repostedBy: [],
      bookmarkedBy: [],
      shares: 0,
      views: 0
    };
    if (quotedPostId) {
      newPost.quotedPostId = quotedPostId;
      newPost.quoteText = quoteText;
    }
    setPosts(prev => [newPost, ...prev]);
  }, [currentUser]);

  const updateCurrency = useCallback((c: Partial<Currency>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, currency: { ...currentUser.currency, ...c } });
  }, [currentUser, setCurrentUser]);

  const placeBounty = useCallback((targetId: number, amount: number, anonymous: boolean) => {
    if (!currentUser) return;
    setBounties(prev => [...prev, { id: generateUUID(), targetId, placedById: currentUser.id, amount, anonymous, expiresAt: Date.now() + 86400000 * 3, active: true }]);
    setCurrentUser({ ...currentUser, currency: { ...currentUser.currency, gold: currentUser.currency.gold - amount } });
  }, [currentUser, setCurrentUser]);

  const joinClan = useCallback((clanId: number) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, clanId });
  }, [currentUser, setCurrentUser]);

  const updatePoints = useCallback((delta: number) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, points: Math.max(0, currentUser.points + delta) });
  }, [currentUser, setCurrentUser]);

  const toggleLike = useCallback((postId: number) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      if (p.userId === currentUser.id) return p; // can't like own
      const liked = p.likedBy.includes(currentUser.id);
      return {
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        likedBy: liked ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id],
      };
    }));
  }, [currentUser]);

  const repost = useCallback((postId: number) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      if (p.repostedBy.includes(currentUser.id)) return p;
      return { ...p, reposts: p.reposts + 1, repostedBy: [...p.repostedBy, currentUser.id] };
    }));
  }, [currentUser]);

  const addComment = useCallback((postId: number, text: string) => {
    if (!currentUser) return;
    const newComment: Comment = { id: generateUUID(), userId: currentUser.id, postId, text, timestamp: Date.now(), likes: 0 };
    setComments(prev => [newComment, ...prev]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
  }, [currentUser]);

  const sendMessage = useCallback((toId: number, text: string) => {
    if (!currentUser) return;
    setMessages(prev => [...prev, { id: generateUUID(), fromId: currentUser.id, toId, text, timestamp: Date.now(), read: true }]);
  }, [currentUser]);

  const markNotificationRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const updateUserRank = useCallback((userId: number, newRank: number) => {
    if (currentUser && currentUser.id === userId) {
      const updatedUser = RankingSystem.updateUserRank(currentUser, newRank);
      setCurrentUser(updatedUser);
    }
  }, [currentUser, setCurrentUser]);

  const getRankings = useCallback(() => {
    const allUsers = currentUser ? [currentUser, ...users.filter(u => u.id !== currentUser.id)] : users;
    return RankingSystem.calculateRankings(allUsers);
  }, [currentUser, users]);

  const updateUserStats = useCallback((userId: number, stats: Partial<ZankokuUser>) => {
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...stats };
      setCurrentUser(updatedUser);
    }
  }, [currentUser, setCurrentUser]);

  const toggleBookmark = useCallback((postId: number) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const bookmarked = p.bookmarkedBy.includes(currentUser.id);
      return {
        ...p,
        bookmarkedBy: bookmarked 
          ? p.bookmarkedBy.filter(id => id !== currentUser.id) 
          : [...p.bookmarkedBy, currentUser.id],
      };
    }));
  }, [currentUser]);

  const sharePost = useCallback((postId: number) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, shares: p.shares + 1 } : p
    ));
  }, []);

  const deletePost = useCallback((postId: number) => {
    if (!currentUser) return;
    setPosts(prev => prev.filter(p => !(p.id === postId && p.userId === currentUser.id)));
  }, [currentUser]);

  const editPost = useCallback((postId: number, newText: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => 
      (p.id === postId && p.userId === currentUser.id) ? { ...p, text: newText } : p
    ));
  }, [currentUser]);

  const incrementPostViews = useCallback((postId: number) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, views: p.views + 1 } : p
    ));
  }, []);

  const toggleFollow = useCallback((userId: number) => {
    setFollowedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const blockUser = useCallback((userId: number) => {
    setBlockedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  // Clan methods
  const createClan = useCallback((name: string, tag: string, motto: string, description: string, alignment: Alignment, anime: AnimeFaction | 'mixed', leaderTitle: string, rules: ClanRule[], joinType: 'open' | 'approval' | 'invite') => {
    if (!currentUser) return;
    const newClan: Clan = {
      id: generateUUID(),
      name,
      tag,
      alignment,
      anime,
      leaderTitle,
      rules,
      joinType,
      createdAt: generateUUID(),
      bannedUsers: [],
      memberList: [{
        userId: currentUser.id,
        role: 'leader',
        joinedAt: generateUUID(),
        reputation: 0,
        contributions: 0
      }]
    };
    if (setClans) {
      setClans(prev => [...(prev || []), newClan]);
    }
    setCurrentUser({ ...currentUser, clanId: newClan.id });
  }, [currentUser, setCurrentUser, setClans]);

  const leaveClan = useCallback(() => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, clanId: null });
  }, [currentUser, setCurrentUser]);

  const addClanPost = useCallback((clanId: number, type: ClanPostType, title: string, body: string) => {
    if (!currentUser) return;
    const newPost: ClanPost = {
      id: generateUUID(),
      clanId,
      userId: currentUser.id,
      type,
      title,
      body,
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
      comments: 0,
      timestamp: generateUUID(),
      isPinned: false,
      isRemoved: false
    };
    setClanPosts(prev => [newPost, ...prev]);
  }, [currentUser]);

  const voteClanPost = useCallback((postId: number, vote: 'up' | 'down') => {
    if (!currentUser) return;
    setClanPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      
      const hasUpvoted = p.upvotedBy.includes(currentUser.id);
      const hasDownvoted = p.downvotedBy.includes(currentUser.id);
      
      if (vote === 'up') {
        if (hasUpvoted) {
          // Remove upvote
          return {
            ...p,
            upvotes: p.upvotes - 1,
            upvotedBy: p.upvotedBy.filter(id => id !== currentUser.id)
          };
        } else {
          // Add upvote, remove downvote if exists
          return {
            ...p,
            upvotes: p.upvotes + 1,
            downvotes: hasDownvoted ? p.downvotes - 1 : p.downvotes,
            upvotedBy: [...p.upvotedBy, currentUser.id],
            downvotedBy: hasDownvoted ? p.downvotedBy.filter(id => id !== currentUser.id) : p.downvotedBy
          };
        }
      } else {
        if (hasDownvoted) {
          // Remove downvote
          return {
            ...p,
            downvotes: p.downvotes - 1,
            downvotedBy: p.downvotedBy.filter(id => id !== currentUser.id)
          };
        } else {
          // Add downvote, remove upvote if exists
          return {
            ...p,
            upvotes: hasUpvoted ? p.upvotes - 1 : p.upvotes,
            downvotes: p.downvotes + 1,
            upvotedBy: hasUpvoted ? p.upvotedBy.filter(id => id !== currentUser.id) : p.upvotedBy,
            downvotedBy: [...p.downvotedBy, currentUser.id]
          };
        }
      }
    }));
  }, [currentUser]);

  const removeClanPost = useCallback((postId: number) => {
    setClanPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, isRemoved: true } : p
    ));
  }, []);

  const pinClanPost = useCallback((postId: number) => {
    setClanPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, isPinned: !p.isPinned } : p
    ));
  }, []);

  const requestJoinClan = useCallback((clanId: number, message: string) => {
    if (!currentUser) return;
    const newRequest: ClanJoinRequest = {
      id: Date.now(),
      clanId,
      userId: currentUser.id,
      message,
      timestamp: Date.now(),
      status: 'pending'
    };
    setClanJoinRequests(prev => [...prev, newRequest]);
  }, [currentUser]);

  const approveJoinRequest = useCallback((requestId: number) => {
    setClanJoinRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'approved' as const } : r
    ));
    const request = clanJoinRequests.find(r => r.id === requestId);
    if (request) {
      // Would update clan members here
    }
  }, [clanJoinRequests]);

  const rejectJoinRequest = useCallback((requestId: number) => {
    setClanJoinRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
  }, []);

  const banClanMember = useCallback((clanId: number, userId: number) => {
    // Would update clan bannedUsers array
  }, []);

  const promoteClanMember = useCallback((clanId: number, userId: number, role: ClanMemberRole) => {
    // Would update clan member role
  }, []);

  const updateClanRules = useCallback((clanId: number, rules: ClanRule[]) => {
    // Would update clan rules
  }, []);

  const getClanMemberRole = useCallback((clanId: number, userId: number): ClanMemberRole | null => {
    if (!clans || clans.length === 0) return null;
    const clan = clans.find(c => c.id === clanId);
    if (!clan) return null;
    const member = clan.memberList.find(m => m.userId === userId);
    return member?.role || null;
  }, [clans]);

  // Manga methods
  const likeMangaSeries = useCallback((seriesId: number) => {
    if (!currentUser) return;
    setMangaSeries(prev => prev.map(series => {
      if (series.id !== seriesId) return series;
      const isLiked = series.likedBy.includes(currentUser.id);
      return {
        ...series,
        likes: isLiked ? series.likes - 1 : series.likes + 1,
        likedBy: isLiked 
          ? series.likedBy.filter(id => id !== currentUser.id)
          : [...series.likedBy, currentUser.id]
      };
    }));
  }, [currentUser]);

  const followCreator = useCallback((creatorId: number) => {
    setFollowedCreators(prev => 
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  }, []);

  const purchaseEpisode = useCallback((episodeId: number, price: number): boolean => {
    if (!currentUser || !userLibrary) return false;
    if (currentUser.currency.gold < price) return false;
    
    setCurrentUser({
      ...currentUser,
      currency: {
        ...currentUser.currency,
        gold: currentUser.currency.gold - price
      }
    });
    
    setUserLibrary({
      ...userLibrary,
      purchasedEpisodes: [...userLibrary.purchasedEpisodes, episodeId]
    });
    
    return true;
  }, [currentUser, userLibrary, setCurrentUser]);

  const purchaseSeries = useCallback((seriesId: number, price: number): boolean => {
    if (!currentUser || !userLibrary) return false;
    if (currentUser.currency.gold < price) return false;
    
    setCurrentUser({
      ...currentUser,
      currency: {
        ...currentUser.currency,
        gold: currentUser.currency.gold - price
      }
    });
    
    setUserLibrary({
      ...userLibrary,
      purchasedSeries: [...userLibrary.purchasedSeries, seriesId]
    });
    
    return true;
  }, [currentUser, userLibrary, setCurrentUser]);

  const addToLibrary = useCallback((seriesId: number, status: 'reading' | 'completed' | 'wishlist') => {
    if (!currentUser || !userLibrary) return;
    
    const existing = userLibrary.savedSeries.find(s => s.seriesId === seriesId);
    if (existing) {
      setUserLibrary({
        ...userLibrary,
        savedSeries: userLibrary.savedSeries.map(s => 
          s.seriesId === seriesId ? { ...s, status } : s
        )
      });
    } else {
      setUserLibrary({
        ...userLibrary,
        savedSeries: [...userLibrary.savedSeries, {
          seriesId,
          status,
          lastReadEpisode: 0,
          progress: 0,
          addedAt: Date.now()
        }]
      });
    }
  }, [currentUser, userLibrary]);

  const updateReadingProgress = useCallback((seriesId: number, episodeId: number) => {
    if (!currentUser || !userLibrary) return;
    
    const series = mangaSeries.find(s => s.id === seriesId);
    if (!series) return;
    
    const episode = series.episodes.find(e => e.id === episodeId);
    if (!episode) return;
    
    const progress = (episode.episodeNumber / series.totalEpisodes) * 100;
    
    setUserLibrary({
      ...userLibrary,
      savedSeries: userLibrary.savedSeries.map(s => 
        s.seriesId === seriesId 
          ? { ...s, lastReadEpisode: episode.episodeNumber, progress }
          : s
      ),
      readingHistory: [
        { seriesId, episodeId, timestamp: Date.now() },
        ...userLibrary.readingHistory
      ]
    });
  }, [currentUser, userLibrary, mangaSeries]);

  const addMangaReview = useCallback((seriesId: number, rating: number, reviewText: string) => {
    if (!currentUser) return;
    // Would add review to reviews state
  }, [currentUser]);

  const addMangaComment = useCallback((seriesId: number, episodeId: number | undefined, text: string) => {
    if (!currentUser) return;
    // Would add comment to manga comments state
  }, [currentUser]);

  const likeMangaComment = useCallback((commentId: number) => {
    if (!currentUser) return;
    // Would toggle like on manga comment
  }, [currentUser]);

  // Store methods
  const makePurchase = useCallback(async (type: PurchaseType, itemId: string, itemName: string, price: number, silverAmount: number, goldAmount: number): Promise<boolean> => {
    if (!currentUser) return false;
    
    const newPurchase: Purchase = {
      id: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`.toUpperCase(),
      userId: currentUser.id,
      type,
      itemId,
      itemName,
      price,
      silverAmount,
      goldAmount,
      paymentMethod: 'card',
      status: 'completed',
      timestamp: Date.now(),
      transactionId: `TXN-${Date.now()}`
    };
    
    setPurchases(prev => [...prev, newPurchase]);
    
    if (silverAmount > 0) {
      setCurrentUser({
        ...currentUser,
        currency: {
          ...currentUser.currency,
          silver: currentUser.currency.silver + silverAmount
        }
      });
    }
    
    if (goldAmount > 0) {
      setCurrentUser({
        ...currentUser,
        currency: {
          ...currentUser.currency,
          gold: currentUser.currency.gold + goldAmount
        }
      });
    }
    
    return true;
  }, [currentUser, setCurrentUser]);

  const activateSubscription = useCallback((tier: 'weekly' | 'monthly' | 'season', durationDays: number, price: number, goldCost: number): boolean => {
    if (!currentUser) return false;
    if (currentUser.currency.gold < goldCost) return false;
    
    const startDate = Date.now();
    const expiryDate = startDate + (durationDays * 24 * 60 * 60 * 1000);
    
    const newSubscription: Subscription = {
      id: `SUB-${Date.now()}`,
      userId: currentUser.id,
      tier,
      status: 'active',
      startDate,
      expiryDate,
      autoRenew: false,
      price,
      goldCost
    };
    
    setActiveSubscription(newSubscription);
    
    setCurrentUser({
      ...currentUser,
      currency: {
        ...currentUser.currency,
        gold: currentUser.currency.gold - goldCost
      }
    });
    
    return true;
  }, [currentUser, setCurrentUser]);

  const cancelSubscription = useCallback(() => {
    if (activeSubscription) {
      setActiveSubscription({
        ...activeSubscription,
        status: 'cancelled',
        autoRenew: false
      });
    }
  }, [activeSubscription]);

  const hasContentAccess = useCallback((contentId: number): boolean => {
    if (!contentOwnership) return false;
    return contentOwnership.ownedContent.some(c => c.contentId === contentId);
  }, [contentOwnership]);

  const addSilver = useCallback((amount: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      currency: {
        ...currentUser.currency,
        silver: currentUser.currency.silver + amount
      }
    });
  }, [currentUser, setCurrentUser]);

  const addGold = useCallback((amount: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      currency: {
        ...currentUser.currency,
        gold: currentUser.currency.gold + amount
      }
    });
  }, [currentUser, setCurrentUser]);

  const deductSilver = useCallback((amount: number): boolean => {
    if (!currentUser) return false;
    if (currentUser.currency.silver < amount) return false;
    
    setCurrentUser({
      ...currentUser,
      currency: {
        ...currentUser.currency,
        silver: currentUser.currency.silver - amount
      }
    });
    
    return true;
  }, [currentUser, setCurrentUser]);

  const deductGold = useCallback((amount: number): boolean => {
    if (!currentUser) return false;
    if (currentUser.currency.gold < amount) return false;
    
    setCurrentUser({
      ...currentUser,
      currency: {
        ...currentUser.currency,
        gold: currentUser.currency.gold - amount
      }
    });
    
    return true;
  }, [currentUser, setCurrentUser]);

  // Messaging methods
  const sendEnhancedMessage = useCallback((toId: number, text: string, type: MessageType = 'text', metadata?: any) => {
    if (!currentUser) return;
    
    const newMessage: EnhancedMessage = {
      id: Date.now(),
      fromId: currentUser.id,
      toId,
      text,
      timestamp: Date.now(),
      read: false,
      status: 'sent',
      type,
      intensity: 'normal', // Will be calculated by utility
      reactions: [],
      isPinned: false,
      isDeleted: false,
      deletedForBoth: false,
      metadata
    };
    
    setEnhancedMessages(prev => [...prev, newMessage]);
    sendMessage(toId, text); // Also update legacy messages
  }, [currentUser, sendMessage]);

  const reactToMessage = useCallback((messageId: number, reaction: AnimeReaction) => {
    if (!currentUser) return;
    
    setEnhancedMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const existingReaction = msg.reactions.find(r => r.userId === currentUser.id && r.reaction === reaction);
      
      if (existingReaction) {
        return {
          ...msg,
          reactions: msg.reactions.filter(r => !(r.userId === currentUser.id && r.reaction === reaction))
        };
      } else {
        return {
          ...msg,
          reactions: [...msg.reactions, { userId: currentUser.id, reaction, timestamp: Date.now() }]
        };
      }
    }));
  }, [currentUser]);

  const deleteMessage = useCallback((messageId: number, forBoth: boolean) => {
    if (!currentUser) return;
    
    setEnhancedMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      if (msg.fromId !== currentUser.id && forBoth) return msg;
      
      return {
        ...msg,
        isDeleted: true,
        deletedForBoth: forBoth
      };
    }));
  }, [currentUser]);

  const pinMessage = useCallback((messageId: number) => {
    setEnhancedMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    ));
  }, []);

  const replyToMessage = useCallback((messageId: number, text: string) => {
    if (!currentUser) return;
    
    const originalMessage = enhancedMessages.find(m => m.id === messageId);
    if (!originalMessage) return;
    
    const newMessage: EnhancedMessage = {
      id: Date.now(),
      fromId: currentUser.id,
      toId: originalMessage.fromId === currentUser.id ? originalMessage.toId : originalMessage.fromId,
      text,
      timestamp: Date.now(),
      read: false,
      status: 'sent',
      type: 'text',
      intensity: 'normal',
      reactions: [],
      replyTo: messageId,
      isPinned: false,
      isDeleted: false,
      deletedForBoth: false
    };
    
    setEnhancedMessages(prev => [...prev, newMessage]);
  }, [currentUser, enhancedMessages]);

  const setTyping = useCallback((toUserId: number, isTyping: boolean) => {
    if (!currentUser) return;
    
    if (isTyping) {
      setTypingIndicators(prev => {
        const existing = prev.find(t => t.userId === currentUser.id && t.conversationWith === toUserId);
        if (existing) return prev;
        return [...prev, { userId: currentUser.id, conversationWith: toUserId, timestamp: Date.now() }];
      });
    } else {
      setTypingIndicators(prev => 
        prev.filter(t => !(t.userId === currentUser.id && t.conversationWith === toUserId))
      );
    }
  }, [currentUser]);

  const updatePresence = useCallback((status: 'online' | 'idle' | 'offline') => {
    if (!currentUser) return;
    
    setUserPresences(prev => {
      const existing = prev.find(p => p.userId === currentUser.id);
      if (existing) {
        return prev.map(p => 
          p.userId === currentUser.id 
            ? { ...p, status, lastSeen: Date.now() }
            : p
        );
      } else {
        return [...prev, {
          userId: currentUser.id,
          status,
          lastSeen: Date.now(),
          isTyping: false
        }];
      }
    });
  }, [currentUser]);

  const acceptDuelChallenge = useCallback((messageId: number) => {
    setEnhancedMessages(prev => prev.map(msg => {
      if (msg.id !== messageId || msg.type !== 'duel_challenge') return msg;
      
      return {
        ...msg,
        metadata: {
          ...msg.metadata,
          status: 'accepted',
          acceptedAt: Date.now()
        }
      };
    }));
    
    triggerCinematic('A CHALLENGE HAS BEEN ACCEPTED!', 'major');
  }, []);

  const declineDuelChallenge = useCallback((messageId: number) => {
    setEnhancedMessages(prev => prev.map(msg => {
      if (msg.id !== messageId || msg.type !== 'duel_challenge') return msg;
      
      return {
        ...msg,
        metadata: {
          ...msg.metadata,
          status: 'declined'
        }
      };
    }));
    
    triggerCinematic('COWARD.', 'minor');
  }, []);

  const acceptClanInvite = useCallback((messageId: number) => {
    if (!currentUser) return;
    
    const message = enhancedMessages.find(m => m.id === messageId);
    if (!message || message.type !== 'clan_invite' || !message.metadata) return;
    
    const metadata = message.metadata as any;
    setCurrentUser({ ...currentUser, clanId: metadata.clanId });
    
    setEnhancedMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      return {
        ...msg,
        metadata: {
          ...msg.metadata,
          status: 'accepted'
        }
      };
    }));
  }, [currentUser, enhancedMessages, setCurrentUser]);

  const reportMessage = useCallback((messageId: number, reason: string) => {
    setEnhancedMessages(prev => prev.map(msg => {
      if (msg.id !== messageId || msg.type !== 'threat') return msg;
      
      return {
        ...msg,
        metadata: {
          ...msg.metadata,
          reported: true,
          moderationFlags: [...(msg.metadata?.moderationFlags || []), reason]
        }
      };
    }));
  }, []);

  const triggerCinematic = useCallback((text: string, intensity: 'minor' | 'major' | 'legendary') => {
    const newTrigger: CinematicTrigger = {
      id: `CINE-${Date.now()}`,
      text,
      intensity,
      duration: intensity === 'legendary' ? 3000 : intensity === 'major' ? 2000 : 1500,
      timestamp: Date.now()
    };
    
    setCinematicTriggers(prev => [...prev, newTrigger]);
    
    setTimeout(() => {
      setCinematicTriggers(prev => prev.filter(t => t.id !== newTrigger.id));
    }, newTrigger.duration);
  }, []);

  // Resource Management Functions
  const refillUserResources = useCallback(() => {
    if (!currentUser) return false;
    
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
    const now = Date.now();
    const lastRefill = currentUser.resourceLastRefill || 0;
    const timeSinceRefill = now - lastRefill;
    
    // Can't refill if unlimited is active
    if (currentUser.hasUnlimitedResources && 
        currentUser.unlimitedResourcesExpiry && 
        now < currentUser.unlimitedResourcesExpiry) {
      return false;
    }
    
    // Can't refill if less than 3 hours passed
    if (timeSinceRefill < THREE_HOURS_MS) {
      return false;
    }
    
    // Refill to 100
    setCurrentUser({
      ...currentUser,
      resource: 100,
      resourceLastRefill: now
    });
    
    return true;
  }, [currentUser, setCurrentUser]);

  const checkResourceRefillAvailable = useCallback(() => {
    if (!currentUser) return false;
    
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
    const now = Date.now();
    const lastRefill = currentUser.resourceLastRefill || 0;
    const timeSinceRefill = now - lastRefill;
    
    // Unlimited users don't need refills
    if (currentUser.hasUnlimitedResources && 
        currentUser.unlimitedResourcesExpiry && 
        now < currentUser.unlimitedResourcesExpiry) {
      return false;
    }
    
    return timeSinceRefill >= THREE_HOURS_MS;
  }, [currentUser]);

  const getTimeUntilRefill = useCallback(() => {
    if (!currentUser) return 0;
    
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
    const now = Date.now();
    const lastRefill = currentUser.resourceLastRefill || 0;
    const timeSinceRefill = now - lastRefill;
    const remaining = THREE_HOURS_MS - timeSinceRefill;
    
    return Math.max(0, remaining);
  }, [currentUser]);

  const activateUnlimitedResources = useCallback((type: 'weekly' | 'monthly' | 'season') => {
    if (!currentUser) return;
    
    const now = Date.now();
    let expiryTime = now;
    
    switch (type) {
      case 'weekly':
        expiryTime = now + (7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        expiryTime = now + (30 * 24 * 60 * 60 * 1000);
        break;
      case 'season':
        expiryTime = now + (90 * 24 * 60 * 60 * 1000);
        break;
    }
    
    setCurrentUser({
      ...currentUser,
      resource: 200,
      hasUnlimitedResources: true,
      unlimitedResourcesExpiry: expiryTime,
      unlimitedResourceType: type
    });
  }, [currentUser, setCurrentUser]);

  const deactivateUnlimitedResources = useCallback(() => {
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      hasUnlimitedResources: false,
      unlimitedResourcesExpiry: undefined,
      unlimitedResourceType: undefined,
      resource: Math.min(100, currentUser.resource)
    });
  }, [currentUser, setCurrentUser]);

  const handleForbiddenTechniqueUse = useCallback((cost: number) => {
    if (!currentUser) return { success: false, unlimitedEnded: false, unlimitedDrained: false };
    
    // Need at least 100 resources
    if (currentUser.resource < 100) {
      return { success: false, unlimitedEnded: false, unlimitedDrained: false };
    }
    
    const now = Date.now();
    const hasUnlimited = currentUser.hasUnlimitedResources && 
                        currentUser.unlimitedResourcesExpiry && 
                        now < currentUser.unlimitedResourcesExpiry;
    
    if (hasUnlimited) {
      if (currentUser.resource >= 200) {
        // Drain to 200
        setCurrentUser({
          ...currentUser,
          resource: 200
        });
        return { success: true, unlimitedEnded: false, unlimitedDrained: true };
      } else {
        // End unlimited
        setCurrentUser({
          ...currentUser,
          resource: Math.max(0, currentUser.resource - cost),
          hasUnlimitedResources: false,
          unlimitedResourcesExpiry: undefined,
          unlimitedResourceType: undefined
        });
        return { success: true, unlimitedEnded: true, unlimitedDrained: false };
      }
    } else {
      // Normal user - just pay cost
      setCurrentUser({
        ...currentUser,
        resource: Math.max(0, currentUser.resource - cost)
      });
      return { success: true, unlimitedEnded: false, unlimitedDrained: false };
    }
  }, [currentUser, setCurrentUser]);

  const getResourceStatus = useCallback(() => {
    if (!currentUser) {
      return { current: 0, hasUnlimited: false, canRefill: false, timeUntilRefill: 0 };
    }
    
    const now = Date.now();
    const hasUnlimited = currentUser.hasUnlimitedResources && 
                        currentUser.unlimitedResourcesExpiry && 
                        now < currentUser.unlimitedResourcesExpiry;
    
    return {
      current: hasUnlimited ? 200 : currentUser.resource,
      hasUnlimited,
      canRefill: checkResourceRefillAvailable(),
      timeUntilRefill: getTimeUntilRefill()
    };
  }, [currentUser, checkResourceRefillAvailable, getTimeUntilRefill]);

  return (
    <GameContext.Provider value={{
      currentUser, onboarded, users, clans: clans || [], posts, bounties, spyMissions, comments, messages, notifications,
      setCurrentUser, setOnboarded, addPost, updateCurrency, placeBounty, joinClan, updatePoints,
      toggleLike, repost, addComment, sendMessage, markNotificationRead, markAllNotificationsRead,
      updateUserRank, getRankings, updateUserStats,
      toggleBookmark, sharePost, deletePost, editPost, incrementPostViews,
      followedUsers, blockedUsers, toggleFollow, blockUser,
      clanPosts, clanJoinRequests, createClan, leaveClan, addClanPost, voteClanPost,
      removeClanPost, pinClanPost, requestJoinClan, approveJoinRequest, rejectJoinRequest,
      banClanMember, promoteClanMember, updateClanRules, getClanMemberRole,
      mangaSeries, userLibrary, followedCreators, likeMangaSeries, followCreator,
      purchaseEpisode, purchaseSeries, addToLibrary, updateReadingProgress,
      addMangaReview, addMangaComment, likeMangaComment,
      purchases, purchaseHistory, activeSubscription, contentOwnership,
      makePurchase, activateSubscription, cancelSubscription, hasContentAccess,
      addSilver, addGold, deductSilver, deductGold,
      enhancedMessages, userPresences, typingIndicators, behaviorProfiles, cinematicTriggers,
      sendEnhancedMessage, reactToMessage, deleteMessage, pinMessage, replyToMessage,
      setTyping, updatePresence, acceptDuelChallenge, declineDuelChallenge,
      acceptClanInvite, reportMessage, triggerCinematic,
      refillUserResources, checkResourceRefillAvailable, getTimeUntilRefill,
      activateUnlimitedResources, deactivateUnlimitedResources, handleForbiddenTechniqueUse, getResourceStatus,
    }}>
      {children}
    </GameContext.Provider>
  );
};
