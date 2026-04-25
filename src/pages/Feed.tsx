import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { Heart, MessageCircle, Repeat2, Bookmark, Share2, X, MoreHorizontal, Image, Type, Send, Users, TrendingUp, Plus, Shield } from 'lucide-react';

const Feed = () => {
  const navigate = useNavigate();
  const { currentUser, posts, users, clans, toggleLike, addPost, addComment } = useGame();
  
  // State for interactions
  const [likingPosts, setLikingPosts] = useState<Set<number>>(new Set());
  const [animatingPosts, setAnimatingPosts] = useState<Set<number>>(new Set());

  // Well-defined demo posts for better visualization
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

  // Well-defined demo users
  const demoUsers = [
    { id: 1, username: 'NarutoUzumaki', anime: 'naruto' as const },
    { id: 2, username: 'GojoSatoru', anime: 'jjk' as const },
    { id: 3, username: 'LuffyCaptain', anime: 'onepiece' as const },
    { id: 4, username: 'IchigoKurosaki', anime: 'demonslayer' as const },
    { id: 5, username: 'AstaBlack', anime: 'blackclover' as const },
    { id: 6, username: 'GokuSaiyan', anime: 'dragonball' as const },
    { id: 7, username: 'KilluaZoldyck', anime: 'hxh' as const },
    { id: 8, username: 'ByakuyaKuchiki', anime: 'bleach' as const }
  ];

  // Use demo posts if real ones are empty, otherwise use real posts
  const allPosts = posts.length > 0 ? posts : demoPosts;
  const allUsers = users.length > 0 ? users : demoUsers;

  // Add custom CSS for vertical scrolling and full width layout
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Override feed layout to use full width */
      .feed-page {
        width: 100vw !important;
        max-width: 100vw !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow-x: hidden !important;
      }
      
      /* Ensure verification button is perfect circle on mobile */
      @media (max-width: 767px) {
        .verification-badge {
          width: 16px !important;
          height: 16px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      }
      
      /* Force action buttons to be horizontal - override any inherited styles */
      .flex.flex-row {
        flex-direction: row !important;
      }
      
      .flex.flex-row > div {
        display: inline-flex !important;
        flex-direction: row !important;
      }
      
      .flex.flex-row button {
        display: inline-flex !important;
        flex-direction: row !important;
        align-items: center !important;
      }
      
      /* More specific override for action buttons */
      .flex.flex-row .flex.items-center {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
      }
      
      .flex.flex-row .flex.items-center button {
        display: inline-flex !important;
        flex-direction: row !important;
        align-items: center !important;
        width: auto !important;
        flex-shrink: 0 !important;
      }
      
      .flex.flex-row .flex.items-center button span {
        display: inline-block !important;
      }
      
      /* Remove center column constraints */
      .feed-center-column {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Override global input group flex-direction */
      .input-group {
        flex-direction: row !important;
      }
      
      /* Override global width constraints */
      .notifications-page,
      .profile-page {
        width: auto !important;
        max-width: none !important;
      }
      
      /* Override global flex-start alignment */
      .notifications-page {
        align-items: flex-start !important;
        flex-direction: row !important;
      }
      
      /* Apply same horizontal fix to all potential problematic components */
      .flex-row,
      .flex.items-center,
      .flex.justify-between,
      .flex.justify-around {
        display: flex !important;
        flex-direction: row !important;
      }
      
      .flex-row > *,
      .flex.items-center > *,
      .flex.justify-between > *,
      .flex.justify-around > * {
        display: inline-flex !important;
        flex-direction: row !important;
      }
      
      .flex-row button,
      .flex.items-center button,
      .flex.justify-between button,
      .flex.justify-around button {
        display: inline-flex !important;
        flex-direction: row !important;
        align-items: center !important;
        width: auto !important;
        flex-shrink: 0 !important;
      }
      
      .posts-vertical-scroll {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
        overflow: visible !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
      }
      
      @media (min-width: 768px) {
        .posts-vertical-scroll {
          display: block !important;
          flex-direction: column !important;
          overflow: visible !important;
          padding: 0 !important;
          height: auto !important;
        }
      }
      
      /* Mobile posts - X-style flat feed */
      @media (max-width: 767px) {
        .posts-vertical-scroll .post-card {
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          height: fit-content !important;
          flex-shrink: 0 !important;
          padding: 16px !important;
          border-radius: 0 !important;
          border-bottom: 1px solid #2F3336 !important;
          background: transparent !important;
        }
      }
      
      /* Desktop posts - X-style edge-to-edge */
      @media (min-width: 768px) {
        .posts-vertical-scroll .post-card {
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 16px !important;
          border-radius: 0 !important;
          border-bottom: 1px solid #2F3336 !important;
          background: transparent !important;
        }
      }
      
      /* Large desktop posts - still edge-to-edge */
      @media (min-width: 1024px) {
        .posts-vertical-scroll .post-card {
          max-width: 100% !important;
          padding: 16px !important;
          margin: 0 !important;
        }
      }
      
      /* Force mobile layout */
      @media (max-width: 767px) {
        .posts-vertical-scroll > * {
          display: block !important;
          flex-shrink: 0 !important;
        }
      }
      
      /* Enhanced feed tabs layout on mobile */
      @media (max-width: 767px) {
        .feed-center-column > div:first-child {
          display: flex !important;
          justify-content: space-between !important;
          overflow-x: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        .feed-center-column > div:first-child::-webkit-scrollbar {
          display: none !important;
        }
        
        .feed-center-column > div:first-child button {
          flex: 1 !important;
          text-align: center !important;
          padding: 14px 8px !important;
          font-size: 12px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [newPost, setNewPost] = useState('');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [tab, setTab] = useState('foryou');
  const [commentText, setCommentText] = useState<{ [postId: number]: string }>({});
  const composeRef = useRef<HTMLDivElement>(null);

  
  const filteredPosts = allPosts.filter(post => {
    if (tab === 'foryou') return true;
    if (tab === 'following') return false; // TODO: implement following logic
    return true;
  });

  const handlePost = () => {
    if (newPost.trim()) {
      addPost(newPost);
      setNewPost('');
      setIsComposeModalOpen(false);
    }
  };

  const handleComment = (postId: number) => {
    const text = commentText[postId];
    if (text?.trim()) {
      addComment(postId, text);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    }
  };

  // Handle post body click - navigate to post detail
  const handlePostClick = (postId: number, event: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/post/${postId.toString()}`);
  };

  // Handle like with instant feedback
  const handleLike = async (postId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent post click
    
    if (likingPosts.has(postId)) return; // Prevent double clicks
    
    setLikingPosts(prev => new Set(prev).add(postId));
    setAnimatingPosts(prev => new Set(prev).add(postId));
    
    // Optimistic update - toggle immediately
    toggleLike(postId);
    
    // Remove animation state after animation
    setTimeout(() => {
      setAnimatingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }, 300);
    
    // Remove loading state
    setTimeout(() => {
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }, 100);
  };

  // Handle repost - show bottom sheet (placeholder for now)
  const handleRepost = (postId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // TODO: Implement repost bottom sheet
    console.log('Repost clicked for post:', postId);
  };

  // Handle reply - open reply composer (placeholder for now)
  const handleReply = (postId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // TODO: Implement reply composer
    console.log('Reply clicked for post:', postId);
  };

  // Handle share - system share sheet (placeholder for now)
  const handleShare = (postId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // TODO: Implement system share
    console.log('Share clicked for post:', postId);
  };

  // Handle profile navigation
  const handleProfileClick = (userId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/profile?user=${userId}`);
  };

  return (
    <div className="feed-page">
      {/* Feed Container */}
      <div>
        {/* Feed Tabs - X Style */}
        <div className="flex border-b border-gray-800 bg-black sticky top-0 z-10" style={{ background: '#000000' }}>
          {['foryou', 'following'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 whitespace-nowrap px-4 py-4 text-center font-medium text-[15px] transition-all relative ${
                tab === t ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {t === 'foryou' && 'For you'}
              {t === 'following' && 'Following'}
              {tab === t && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" style={{ background: 'var(--neon-blue)' }} />
              )}
            </button>
          ))}
        </div>

        {/* Posts - Vertical scroll on mobile */}
        <div className="posts-vertical-scroll">
          {filteredPosts.map(post => {
            const author = allUsers.find(u => u.id === post.userId);
            const isLiked = post.likedBy?.includes(currentUser?.id || 0);
            
            return (
              <div key={post.id} className="post-card w-full flex-shrink-0">
                <div className="flex gap-3" onClick={(e) => handlePostClick(post.id, e)}>
                  {/* Avatar - clickable to profile */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
                    style={{ color: 'white' }}
                    onClick={(e) => handleProfileClick(author?.id || 0, e)}
                  >
                    {author?.username[0]?.toUpperCase() || '?'}
                  </div>
                  
                  {/* Main Content - everything aligns to avatar */}
                  <div className="flex-1 min-w-0">
                    {/* Name + Handle + Time - inline like X */}
                    <div className="flex items-center gap-1 mb-1">
                      <span 
                        className="font-bold text-white cursor-pointer hover:underline"
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
                        onClick={(e) => handleProfileClick(author?.id || 0, e)}
                      >
                        {author?.username || 'Unknown User'}
                      </span>
                      {/* Verified checkmark - perfect circle */}
                      <div 
                        className="verification-badge w-4 h-4 flex items-center justify-center"
                        style={{ 
                          background: 'var(--neon-blue)', 
                          color: 'white', 
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px'
                        }}
                      >
                        <span style={{ fontSize: '10px', lineHeight: '1' }}>✓</span>
                      </div>
                      <span className="text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
                        @{author?.username?.toLowerCase() || 'unknown'} · {new Date(post.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Post Content - clickable */}
                    <div className="mb-3 cursor-pointer">
                      <p className="text-white leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.5' }}>
                        {post.text}
                      </p>
                    </div>

                    {/* Action Buttons - interactive like X */}
                    <div className="flex flex-row items-center justify-between w-full mt-2 text-gray-500">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReply(post.id, e);
                        }}
                        className="flex items-center gap-1"
                      >
                        <MessageCircle size={18} />
                        <span>{post.comments || 0}</span>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRepost(post.id, e);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Repeat2 size={18} />
                        <span>{Math.floor((post.likedBy?.length || 0) * 0.3)}</span>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id, e);
                        }}
                        className={`flex items-center gap-1 ${
                          isLiked 
                            ? 'text-red-500' 
                            : 'hover:text-red-500'
                        }`}
                      >
                        <Heart 
                          size={18} 
                          fill={isLiked ? 'currentColor' : 'none'}
                          className={`transition-transform ${
                            animatingPosts.has(post.id) ? 'scale-125' : ''
                          }`}
                        />
                        <span>{post.likedBy?.length || 0}</span>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(post.id, e);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
        </div>
      </div>

      
      
      {/* Compose Modal */}
      {isComposeModalOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end justify-center md:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsComposeModalOpen(false);
          }}
        >
          <div 
            className="w-full max-h-[92vh] bg-[#080812] rounded-t-2xl border-t border-[#2A2A4E] flex flex-col overflow-hidden md:max-w-[560px] md:rounded-xl md:border md:mx-auto"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-[#1A1A2E] flex-shrink-0 relative">
              <button
                className="w-9 h-9 flex items-center justify-center bg-transparent border-none rounded-full text-[#E8E8FF] cursor-pointer transition-colors hover:bg-white/8"
                onClick={() => setIsComposeModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <span className="font-orbitron text-[14px] font-bold tracking-widest uppercase text-[#E8E8FF] absolute left-1/2 -translate-x-1/2">
                Create Post
              </span>
            </div>

            {/* Body */}
            <div className="flex gap-3 p-4 flex-1 overflow-y-auto">
              
              {/* Avatar column */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-[#8B00FF] bg-[#0D0D1A] flex items-center justify-center font-orbitron text-[14px] font-bold text-[#E8E8FF] overflow-hidden">
                  {currentUser.username[0]?.toUpperCase()}
                </div>
                <div className="w-0.5 bg-[#1A1A2E] mx-auto mt-2 flex-1 min-h-[20px] rounded-sm" />
              </div>

              {/* Text area column */}
              <div className="flex-1 min-w-0 flex flex-col">
                <textarea
                  className="w-full min-h-[120px] bg-transparent border-none outline-none text-[#E8E8FF] font-rajdhani text-[18px] font-normal leading-[1.55] resize-none p-0 caret-[#8B00FF] placeholder:text-[#333355] placeholder:text-[18px]"
                  placeholder="What is happening in your world?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  maxLength={500}
                  autoFocus
                />
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5 border-t border-[#1A1A2E] flex-shrink-0">
              <div className="flex items-center gap-1">
                {/* Clan tag button */}
                <button className="w-9 h-9 flex items-center justify-center bg-transparent border-none rounded-full text-[#8B00FF] cursor-pointer transition-colors hover:bg-[rgba(139,0,255,0.1)]" aria-label="Tag clan">
                  <Shield size={18} />
                </button>
                {/* Brag toggle */}
                <button className="w-9 h-9 flex items-center justify-center bg-transparent border-none rounded-full text-[#8B00FF] cursor-pointer transition-colors hover:bg-[rgba(139,0,255,0.1)]" aria-label="Brag post">
                  <MessageCircle size={18} />
                </button>
              </div>

              <span
                className={`font-rajdhani text-[13px] tracking-wider ${
                  newPost.length > 450 ? 'text-[#FF6B00]' : ''
                } ${
                  newPost.length >= 500 ? 'text-[#FF003C]' : 'text-[#333355]'
                }`}
              >
                {newPost.length}/500
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
