import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ZankokuUser } from '@/types/game';

interface GameState {
  currentUser: ZankokuUser | null;
  users: ZankokuUser[];
  posts: any[];
  clans: any[];
  bounties: any[];
  notifications: any[];
  enhancedMessages: any[];
  clanPosts: any[];
  clanJoinRequests: any[];
  setCurrentUser: (user: ZankokuUser | null) => void;
  addPost: (text: string) => void;
  toggleLike: (postId: number) => void;
  addComment: (postId: number, text: string) => void;
  updateCurrency: (currency: Partial<{ bronze: number; silver: number; gold: number }>) => void;
  getPostById: (id: string) => any;
  createClan: (name: string, tag: string, motto: string, description: string, alignment: string, joinType: string, leaderTitle: string) => void;
  joinClan: (clanId: number) => void;
  leaveClan: () => void;
  addClanPost: (type: string, content: string) => void;
  voteClanPost: (postId: number, vote: string) => void;
  removeClanPost: (postId: number) => void;
  pinClanPost: (postId: number) => void;
  requestJoinClan: (clanId: number) => void;
  approveJoinRequest: (requestId: number) => void;
  rejectJoinRequest: (requestId: number) => void;
  banClanMember: (memberId: number) => void;
  promoteClanMember: (memberId: number) => void;
  getClanMemberRole: (memberId: number) => string | null;
}

const defaultContext: GameState = {
  currentUser: null,
  users: [],
  posts: [],
  clans: [],
  bounties: [],
  notifications: [],
  enhancedMessages: [],
  clanPosts: [],
  clanJoinRequests: [],
  setCurrentUser: () => {},
  addPost: () => {},
  toggleLike: () => {},
  addComment: () => {},
  updateCurrency: () => {},
  createClan: () => {},
  joinClan: () => {},
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
  getClanMemberRole: () => null,
};

export const GameContext = createContext<GameState | null>(defaultContext);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<ZankokuUser | null>(null);
  const [users, setUsers] = useState<ZankokuUser[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [clans, setClans] = useState<any[]>([]);
  const [bounties, setBounties] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [enhancedMessages, setEnhancedMessages] = useState<any[]>([]);
  const [clanPosts, setClanPosts] = useState<any[]>([]);
  const [clanJoinRequests, setClanJoinRequests] = useState<any[]>([]);

  // Sync with Supabase auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('GameContext: Auth state changed', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT' || !session) {
          setCurrentUser(null);
        } else if (event === 'SIGNED_IN' && session.user) {
          console.log('GameContext: Setting user immediately from session');
          // Set user immediately from session data
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
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const addPost = useCallback((text: string) => {
    if (!currentUser) return;
    const newPost = { 
      id: Date.now(), 
      userId: currentUser.id, 
      text,
      likes: 0,
      comments: 0,
      timestamp: Date.now()
    };
    setPosts(prev => [newPost, ...prev]);
  }, [currentUser]);

  const getPostById = useCallback((id: string) => {
    return posts.find(p => String(p.id) === id);
  }, [posts]);

  const toggleLike = useCallback((postId: number) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        likes: p.likedBy?.includes(currentUser.id) ? p.likes - 1 : p.likes + 1,
        likedBy: p.likedBy?.includes(currentUser.id) 
          ? p.likedBy.filter((id: number) => id !== currentUser.id)
          : [...(p.likedBy || []), currentUser.id]
      };
    }));
  }, [currentUser]);

  const addComment = useCallback((postId: number, text: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, comments: p.comments + 1 } : p
    ));
  }, [currentUser]);

  const updateCurrency = useCallback((currency: Partial<{ bronze: number; silver: number; gold: number }>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? {
      ...prev,
      currency: {
        bronze: (prev.currency?.bronze || 0) + (currency.bronze || 0),
        silver: (prev.currency?.silver || 0) + (currency.silver || 0),
        gold: (prev.currency?.gold || 0) + (currency.gold || 0)
      }
    } : null);
  }, [currentUser]);

  // Clan functions
  const createClan = useCallback((name: string, tag: string, motto: string, description: string, alignment: string, joinType: string, leaderTitle: string) => {
    if (!currentUser) return;
    const newClan = {
      id: Date.now(),
      name,
      tag,
      motto,
      description,
      alignment,
      joinType,
      leaderTitle,
      leaderId: currentUser.id,
      members: [currentUser.id],
      createdAt: Date.now(),
      wins: 0,
      points: 0
    };
    setClans(prev => [...prev, newClan]);
    setCurrentUser(prev => prev ? { ...prev, clanId: newClan.id } : null);
  }, [currentUser]);

  const joinClan = useCallback((clanId: number) => {
    if (!currentUser) return;
    setClans(prev => prev.map(clan => 
      clan.id === clanId 
        ? { ...clan, members: [...(clan.members || []), currentUser.id] }
        : clan
    ));
    setCurrentUser(prev => prev ? { ...prev, clanId } : null);
  }, [currentUser]);

  const leaveClan = useCallback(() => {
    if (!currentUser) return;
    setClans(prev => prev.map(clan => 
      clan.id === currentUser.clanId 
        ? { ...clan, members: clan.members?.filter(id => id !== currentUser.id) || [] }
        : clan
    ));
    setCurrentUser(prev => prev ? { ...prev, clanId: null } : null);
  }, [currentUser]);

  const addClanPost = useCallback((type: string, content: string) => {
    if (!currentUser) return;
    const newPost = {
      id: Date.now(),
      clanId: currentUser.clanId,
      type,
      content,
      authorId: currentUser.id,
      createdAt: Date.now(),
      votes: {},
      pinned: false
    };
    setClanPosts(prev => [...prev, newPost]);
  }, [currentUser]);

  const voteClanPost = useCallback((postId: number, vote: string) => {
    if (!currentUser) return;
    setClanPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, votes: { ...post.votes, [currentUser.id]: vote } }
        : post
    ));
  }, [currentUser]);

  const removeClanPost = useCallback((postId: number) => {
    if (!currentUser) return;
    setClanPosts(prev => prev.filter(post => post.id !== postId));
  }, [currentUser]);

  const pinClanPost = useCallback((postId: number) => {
    if (!currentUser) return;
    setClanPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, pinned: true }
        : post
    ));
  }, [currentUser]);

  const requestJoinClan = useCallback((clanId: number) => {
    if (!currentUser) return;
    const newRequest = {
      id: Date.now(),
      clanId,
      userId: currentUser.id,
      status: 'pending',
      createdAt: Date.now()
    };
    setClanJoinRequests(prev => [...prev, newRequest]);
  }, [currentUser]);

  const approveJoinRequest = useCallback((requestId: number) => {
    setClanJoinRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved' }
        : req
    ));
  }, []);

  const rejectJoinRequest = useCallback((requestId: number) => {
    setClanJoinRequests(prev => prev.filter(req => req.id !== requestId));
  }, []);

  const banClanMember = useCallback((memberId: number) => {
    // Implementation would remove member from clan
    console.log('Ban member:', memberId);
  }, []);

  const promoteClanMember = useCallback((memberId: number) => {
    // Implementation would promote member
    console.log('Promote member:', memberId);
  }, []);

  const getClanMemberRole = useCallback((memberId: number) => {
    // Implementation would return member role
    return memberId === currentUser?.id ? 'leader' : 'member';
  }, [currentUser]);

  const value: GameState = {
    currentUser,
    users,
    posts,
    clans,
    bounties,
    notifications,
    enhancedMessages,
    clanPosts,
    clanJoinRequests,
    setCurrentUser,
    addPost,
    toggleLike,
    addComment,
    updateCurrency,
    createClan,
    joinClan,
    leaveClan,
    addClanPost,
    voteClanPost,
    removeClanPost,
    pinClanPost,
    requestJoinClan,
    approveJoinRequest,
    rejectJoinRequest,
    banClanMember,
    promoteClanMember,
    getClanMemberRole,
  getPostById: useCallback((id: string) => {
    return posts.find(p => String(p.id) === id);
  }, [posts]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
