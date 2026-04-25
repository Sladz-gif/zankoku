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
  
  // Demo posts for initialization
  const demoPosts = [
    {
      id: 1,
      userId: 1,
      text: "Just mastered the Rasengan! Who's ready for a training session? 🌀⚡ The power of the Nine-Tails flows through me!",
      timestamp: Date.now() - 1000 * 60 * 5,
      likedBy: [2, 3, 4],
      comments: 12,
      anime: 'naruto' as const
    },
    {
      id: 2,
      userId: 2,
      text: "The Domain Expansion is ready. Unlimited Void awaits those who challenge me. 👁️✨ None can escape my infinite void.",
      timestamp: Date.now() - 1000 * 60 * 15,
      likedBy: [1, 3, 5],
      comments: 8,
      anime: 'jjk' as const
    },
    {
      id: 3,
      userId: 3,
      text: "King of the Pirates? More like King of the Battle Arena! Who wants to test their Haki against mine? 💫⚔️ I'll show you the power of conqueror's Haki!",
      timestamp: Date.now() - 1000 * 60 * 30,
      likedBy: [1, 2, 4],
      comments: 15,
      anime: 'onepiece' as const
    },
    {
      id: 4,
      userId: 4,
      text: "Water Breathing Form: Waterfall Basin! Perfect technique for clearing out the battle lobby. 🌊💪 Let me show you the way of the Demon Slayer!",
      timestamp: Date.now() - 1000 * 60 * 45,
      likedBy: [1, 2, 3],
      comments: 6,
      anime: 'demonslayer' as const
    },
    {
      id: 5,
      userId: 5,
      text: "Anti-magic swords are ready! No jutsus, no cursed energy - just pure skill. Who's brave enough? ⚔️✨ My demon-slayer sword awaits!",
      timestamp: Date.now() - 1000 * 60 * 60,
      likedBy: [2, 3, 4],
      comments: 10,
      anime: 'blackclover' as const
    },
    {
      id: 6,
      userId: 6,
      text: "Super Saiyan transformation achieved in the battle arena! Power levels are off the charts! 🔥⚡ KA-ME-HA-ME-HA!",
      timestamp: Date.now() - 1000 * 60 * 90,
      likedBy: [1, 3, 5],
      comments: 20,
      anime: 'dragonball' as const
    },
    {
      id: 7,
      userId: 7,
      text: "Nen abilities mastered! My Bungee Gum is ready for battle. Who wants to test their luck against me? 🌀💪 Let's see what you're made of!",
      timestamp: Date.now() - 1000 * 60 * 120,
      likedBy: [1, 2, 6],
      comments: 9,
      anime: 'hxh' as const
    },
    {
      id: 8,
      userId: 8,
      text: "Bankai achieved! My Zanpakuto's true form is unleashed. Prepare to face the power of a thousand souls! ⚔️✨",
      timestamp: Date.now() - 1000 * 60 * 150,
      likedBy: [3, 4, 5],
      comments: 14,
      anime: 'bleach' as const
    }
  ];

  // Demo users for initialization
  const demoUsers: ZankokuUser[] = [
    {
      id: 1,
      username: 'NarutoUzumaki',
      bio: 'Future Hokage of the Hidden Leaf Village',
      anime: 'naruto',
      alignment: 'wanderer',
      rank: 500,
      points: 1000,
      roleTag: '',
      cowardStars: 0,
      betrayalHistory: [],
      bountyActive: false,
      bountyAmount: 0,
      currency: { bronze: 50, silver: 0, gold: 0 },
      techniques: ['Rasengan'],
      duelsWon: 0,
      duelsLost: 0,
      shapesCaptured: 0,
      clanWars: 0,
      bountiesClaimed: 0,
      avatar: 1,
      clanId: null,
      resource: 100,
      maxResource: 100,
      isLoggedIn: false
    },
    {
      id: 2,
      username: 'GojoSatoru',
      bio: 'The strongest Jujutsu Sorcerer',
      anime: 'jjk',
      alignment: 'wanderer',
      rank: 600,
      points: 1200,
      roleTag: '',
      cowardStars: 0,
      betrayalHistory: [],
      bountyActive: false,
      bountyAmount: 0,
      currency: { bronze: 75, silver: 10, gold: 0 },
      techniques: ['Domain Expansion'],
      duelsWon: 0,
      duelsLost: 0,
      shapesCaptured: 0,
      clanWars: 0,
      bountiesClaimed: 0,
      avatar: 2,
      clanId: null,
      resource: 100,
      maxResource: 100,
      isLoggedIn: false
    },
    {
      id: 3,
      username: 'LuffyCaptain',
      bio: 'King of the Pirates',
      anime: 'onepiece',
      alignment: 'wanderer',
      rank: 550,
      points: 1100,
      roleTag: '',
      cowardStars: 0,
      betrayalHistory: [],
      bountyActive: false,
      bountyAmount: 0,
      currency: { bronze: 60, silver: 5, gold: 0 },
      techniques: ['Gomu Gomu no Mi'],
      duelsWon: 0,
      duelsLost: 0,
      shapesCaptured: 0,
      clanWars: 0,
      bountiesClaimed: 0,
      avatar: 3,
      clanId: null,
      resource: 100,
      maxResource: 100,
      isLoggedIn: false
    },
    {
      id: 4,
      username: 'IchigoKurosaki',
      bio: 'Substitute Soul Reaper',
      anime: 'demonslayer',
      alignment: 'wanderer',
      rank: 525,
      points: 1050,
      roleTag: '',
      cowardStars: 0,
      betrayalHistory: [],
      bountyActive: false,
      bountyAmount: 0,
      currency: { bronze: 55, silver: 2, gold: 0 },
      techniques: ['Getsuga Tensho'],
      duelsWon: 0,
      duelsLost: 0,
      shapesCaptured: 0,
      clanWars: 0,
      bountiesClaimed: 0,
      avatar: 4,
      clanId: null,
      resource: 100,
      maxResource: 100,
      isLoggedIn: false
    },
    {
      id: 5,
      username: 'AstaBlack',
      bio: 'Anti-magic knight',
      anime: 'blackclover',
      alignment: 'wanderer',
      rank: 480,
      points: 950,
      roleTag: '',
      cowardStars: 0,
      betrayalHistory: [],
      bountyActive: false,
      bountyAmount: 0,
      currency: { bronze: 45, silver: 0, gold: 0 },
      techniques: ['Anti-Magic Sword'],
      duelsWon: 0,
      duelsLost: 0,
      shapesCaptured: 0,
      clanWars: 0,
      bountiesClaimed: 0,
      avatar: 5,
      clanId: null,
      resource: 100,
      maxResource: 100,
      isLoggedIn: false
    },
    {
      id: 6,
      username: 'GokuSaiyan',
      bio: 'Super Saiyan Warrior',
      anime: 'dragonball',
      alignment: 'wanderer',
      rank: 700,
      points: 1500,
      roleTag: '',
      cowardStars: 0,
      betrayalHistory: [],
      bountyActive: false,
      bountyAmount: 0,
      currency: { bronze: 100, silver: 25, gold: 5 },
      techniques: ['Kamehameha'],
      duelsWon: 0,
      duelsLost: 0,
      shapesCaptured: 0,
      clanWars: 0,
      bountiesClaimed: 0,
      avatar: 6,
      clanId: null,
      resource: 100,
      maxResource: 100,
      isLoggedIn: false
    },
    {
      id: 7,
      username: 'KilluaZoldyck',
      bio: 'Professional Assassin',
      anime: 'hxh',
      alignment: 'wanderer',
      rank: 520,
      points: 1020,
      roleTag: '',
      cowardStars: 0,
      betrayalHistory: [],
      bountyActive: false,
      bountyAmount: 0,
      currency: { bronze: 52, silver: 1, gold: 0 },
      techniques: ['Bungee Gum'],
      duelsWon: 0,
      duelsLost: 0,
      shapesCaptured: 0,
      clanWars: 0,
      bountiesClaimed: 0,
      avatar: 7,
      clanId: null,
      resource: 100,
      maxResource: 100,
      isLoggedIn: false
    },
    {
      id: 8,
      username: 'ByakuyaKuchiki',
      bio: 'Captain of the 6th Division',
      anime: 'bleach',
      alignment: 'wanderer',
      rank: 580,
      points: 1150,
      roleTag: '',
      cowardStars: 0,
      betrayalHistory: [],
      bountyActive: false,
      bountyAmount: 0,
      currency: { bronze: 65, silver: 8, gold: 1 },
      techniques: ['Senbonzakura'],
      duelsWon: 0,
      duelsLost: 0,
      shapesCaptured: 0,
      clanWars: 0,
      bountiesClaimed: 0,
      avatar: 8,
      clanId: null,
      resource: 100,
      maxResource: 100,
      isLoggedIn: false
    }
  ];

  const [users, setUsers] = useState<ZankokuUser[]>(demoUsers);
  const [posts, setPosts] = useState<any[]>(demoPosts);
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
    }, [posts])
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
