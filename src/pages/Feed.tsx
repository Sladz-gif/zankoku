import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow, timeAgo } from '@/lib/gameUtils';
import { FACTION_NAMES } from '@/types/game';
import { 
  Heart, MessageCircle, Repeat2, Share2, Bookmark, MoreHorizontal,
  AlertTriangle, Skull, Star, Target, Copy, Check, Edit, Trash2, Flag, UserX, Volume2
} from 'lucide-react';
import { 
  parseTextSegments, 
  extractMentions, 
  extractHashtags, 
  validatePost, 
  recordPost,
  copyToClipboard,
  getPostUrl,
  calculateEngagementScore,
  type TextSegment
} from '@/lib/feedUtils';

const FeedEnhanced = () => {
  const { 
    currentUser, users, posts, bounties, comments, 
    addPost, toggleLike, repost, addComment, toggleBookmark, sharePost,
    deletePost, editPost, incrementPostViews, followedUsers, blockedUsers,
    toggleFollow, blockUser
  } = useGame();
  
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState('');
  const [tab, setTab] = useState<'foryou' | 'trending' | 'clan' | 'following'>('foryou');
  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [repostDropdown, setRepostDropdown] = useState<number | null>(null);
  const [quoteModal, setQuoteModal] = useState<number | null>(null);
  const [quoteText, setQuoteText] = useState('');
  const [likeAnimations, setLikeAnimations] = useState<Set<number>>(new Set());
  const [bookmarkAnimations, setBookmarkAnimations] = useState<Set<number>>(new Set());
  const [copiedPostId, setCopiedPostId] = useState<number | null>(null);
  const [postMenuOpen, setPostMenuOpen] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [hashtagFilter, setHashtagFilter] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);
  
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  // Get user helper
  const getUser = useCallback((id: number) => {
    if (currentUser?.id === id) return currentUser;
    return users.find(u => u.id === id);
  }, [currentUser, users]);

  // Filter posts based on tab and blocked users
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(p => !blockedUsers.includes(p.userId));
    
    // Apply hashtag filter if active
    if (hashtagFilter) {
      filtered = filtered.filter(p => 
        p.hashtags?.includes(hashtagFilter.toLowerCase()) ||
        p.text.toLowerCase().includes(`#${hashtagFilter.toLowerCase()}`)
      );
    }
    
    switch (tab) {
      case 'following':
        return filtered.filter(p => followedUsers.includes(p.userId));
      
      case 'trending':
        return [...filtered].sort((a, b) => 
          calculateEngagementScore(b) - calculateEngagementScore(a)
        );
      
      case 'clan':
        if (!currentUser?.clanId) return [];
        const clanMemberIds = users
          .filter(u => u.clanId === currentUser.clanId)
          .map(u => u.id);
        return filtered.filter(p => clanMemberIds.includes(p.userId));
      
      case 'foryou':
      default:
        return filtered;
    }
  }, [posts, tab, followedUsers, blockedUsers, currentUser, users, hashtagFilter]);

  // Handle post creation
  const handlePost = useCallback(() => {
    if (!newPost.trim()) return;
    
    const validation = validatePost(newPost);
    if (!validation.valid) {
      setPostError(validation.error || 'Invalid post');
      setTimeout(() => setPostError(null), 3000);
      return;
    }
    
    recordPost();
    addPost(newPost.trim());
    setNewPost('');
    setPostError(null);
  }, [newPost, addPost]);

  // Handle like with animation
  const handleLike = useCallback((postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post && currentUser && post.userId === currentUser.id) return;
    
    toggleLike(postId);
    setLikeAnimations(prev => new Set(prev).add(postId));
    setTimeout(() => {
      setLikeAnimations(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }, 600);
  }, [posts, currentUser, toggleLike]);

  // Handle bookmark with animation
  const handleBookmark = useCallback((postId: number) => {
    toggleBookmark(postId);
    setBookmarkAnimations(prev => new Set(prev).add(postId));
    setTimeout(() => {
      setBookmarkAnimations(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }, 600);
  }, [toggleBookmark]);

  // Handle share (copy link)
  const handleShare = useCallback(async (postId: number) => {
    const url = getPostUrl(postId);
    const success = await copyToClipboard(url);
    
    if (success) {
      sharePost(postId);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  }, [sharePost]);

  // Handle repost
  const handleRepost = useCallback((postId: number) => {
    repost(postId);
    setRepostDropdown(null);
  }, [repost]);

  // Handle quote post
  const handleQuotePost = useCallback(() => {
    if (!quoteModal || !quoteText.trim()) return;
    const origPost = posts.find(p => p.id === quoteModal);
    addPost(quoteText.trim(), quoteModal, origPost?.text);
    setQuoteModal(null);
    setQuoteText('');
  }, [quoteModal, quoteText, posts, addPost]);

  // Handle comment
  const handleComment = useCallback((postId: number) => {
    if (!commentText.trim()) return;
    addComment(postId, commentText.trim());
    setCommentText('');
  }, [commentText, addComment]);

  // Handle post deletion
  const handleDeletePost = useCallback((postId: number) => {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      deletePost(postId);
      setPostMenuOpen(null);
    }
  }, [deletePost]);

  // Handle post edit
  const handleEditPost = useCallback((postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    setEditingPost(postId);
    setEditText(post.text);
    setPostMenuOpen(null);
  }, [posts]);

  // Save edited post
  const handleSaveEdit = useCallback((postId: number) => {
    if (!editText.trim()) return;
    
    const validation = validatePost(editText);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    
    editPost(postId, editText.trim());
    setEditingPost(null);
    setEditText('');
  }, [editText, editPost]);

  // Navigate to profile
  const handleProfileClick = useCallback((userId: number) => {
    navigate(`/profile?user=${userId}`);
  }, [navigate]);

  // Handle mention click
  const handleMentionClick = useCallback((username: string) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      navigate(`/profile?user=${user.id}`);
    }
  }, [users, navigate]);

  // Handle hashtag click
  const handleHashtagClick = useCallback((hashtag: string) => {
    setHashtagFilter(hashtag);
    setTab('foryou');
  }, []);

  // Render text with clickable links
  const renderText = useCallback((text: string) => {
    const segments = parseTextSegments(text);
    
    return segments.map((segment, index) => {
      switch (segment.type) {
        case 'mention':
          return (
            <span
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleMentionClick(segment.username);
              }}
              className="cursor-pointer hover:underline"
              style={{ color: '#8B00FF' }}
            >
              {segment.raw}
            </span>
          );
        
        case 'hashtag':
          return (
            <span
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleHashtagClick(segment.hashtag);
              }}
              className="cursor-pointer hover:underline"
              style={{ color: '#00C8FF' }}
            >
              {segment.raw}
            </span>
          );
        
        case 'url':
          return (
            <a
              key={index}
              href={segment.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:underline"
              style={{ color: '#00FF88' }}
            >
              {segment.url}
            </a>
          );
        
        case 'text':
        default:
          return <span key={index}>{segment.content}</span>;
      }
    });
  }, [handleMentionClick, handleHashtagClick]);

  // Increment views when post is viewed
  useEffect(() => {
    const viewedPosts = new Set<number>();
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = parseInt(entry.target.getAttribute('data-post-id') || '0');
            if (postId && !viewedPosts.has(postId)) {
              viewedPosts.add(postId);
              incrementPostViews(postId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const postElements = document.querySelectorAll('[data-post-id]');
    postElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredPosts, incrementPostViews]);

  const activeBounties = bounties.filter(b => b.active);
  const postComments = useCallback((postId: number) => comments.filter(c => c.postId === postId), [comments]);

  return (
    <div className="page-enter flex flex-col lg:flex-row">
      <div className="flex-1 max-w-2xl mx-auto p-4 md:p-6 lg:pr-0">
        {/* Composer */}
        <div className="rounded-lg p-5 mb-6" style={{ background: '#080812', border: `1px solid ${factionColor}30` }}>
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            className="w-full bg-transparent font-body text-sm resize-none focus:outline-none mb-3"
            style={{ color: '#E8E8FF', minHeight: '60px' }}
            placeholder="Speak your truth... (500 chars max, @mention users, #hashtags)"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="font-body text-xs" style={{ color: newPost.length > 450 ? '#FF003C' : '#6666AA' }}>
                {newPost.length}/500
              </span>
              {postError && (
                <span className="font-body text-xs" style={{ color: '#FF003C' }}>
                  {postError}
                </span>
              )}
            </div>
            <button 
              onClick={handlePost} 
              disabled={!newPost.trim()}
              className="px-6 py-2 rounded-md font-display text-xs font-bold tracking-widest transition-opacity"
              style={{ 
                background: `linear-gradient(135deg, ${factionColor}, ${getFactionGlow(currentUser?.anime || 'jjk')})`, 
                color: '#030308',
                opacity: newPost.trim() ? 1 : 0.5
              }}
            >
              POST TO ZANKOKU
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b" style={{ borderColor: '#1A1A2E' }}>
          {(['foryou', 'trending', 'clan', 'following'] as const).map(t => (
            <button 
              key={t} 
              onClick={() => { setTab(t); setHashtagFilter(null); }}
              className="pb-2 font-body text-sm font-semibold capitalize transition-colors relative"
              style={{ 
                color: tab === t ? factionColor : '#6666AA', 
                borderBottom: tab === t ? `2px solid ${factionColor}` : '2px solid transparent' 
              }}
            >
              {t === 'foryou' ? 'For You' : t === 'clan' ? 'Clan Feed' : t}
              {t === 'following' && followedUsers.length > 0 && (
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full" style={{ background: factionColor }} />
              )}
            </button>
          ))}
        </div>

        {/* Hashtag filter indicator */}
        {hashtagFilter && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg" style={{ background: '#080812', border: '1px solid #00C8FF40' }}>
            <span className="font-body text-sm" style={{ color: '#00C8FF' }}>
              Filtering by: #{hashtagFilter}
            </span>
            <button 
              onClick={() => setHashtagFilter(null)}
              className="ml-auto font-body text-xs hover:brightness-125"
              style={{ color: '#6666AA' }}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-sm" style={{ color: '#6666AA' }}>
              {tab === 'following' && followedUsers.length === 0 
                ? 'Follow users to see their posts here'
                : tab === 'clan' && !currentUser?.clanId
                ? 'Join a clan to see clan posts'
                : hashtagFilter
                ? `No posts found with #${hashtagFilter}`
                : 'No posts yet. Be the first to post!'}
            </p>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-3">
          {filteredPosts.map((post, i) => {
            const author = getUser(post.userId);
            if (!author) return null;
            
            const authorColor = getFactionColor(author.anime);
            const hasBounty = author.bountyActive;
            const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
            const isBookmarked = currentUser ? post.bookmarkedBy.includes(currentUser.id) : false;
            const isReposted = currentUser ? post.repostedBy.includes(currentUser.id) : false;
            const isOwnPost = currentUser?.id === post.userId;
            const showComments = expandedComments === post.id;
            const pComments = postComments(post.id);
            const isEditing = editingPost === post.id;
            const isFollowing = followedUsers.includes(post.userId);

            return (
              <div 
                key={post.id} 
                data-post-id={post.id}
                className="rounded-lg p-5 transition-all duration-200 stagger-item"
                style={{ 
                  animationDelay: `${i * 50}ms`, 
                  background: '#080812', 
                  border: `1px solid ${hasBounty ? '#FF003C40' : '#1A1A2E'}`, 
                  boxShadow: hasBounty ? '0 0 15px rgba(255,0,60,0.1)' : 'none' 
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar - clickable */}
                  <div 
                    onClick={() => handleProfileClick(author.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-bold shrink-0 cursor-pointer hover:brightness-125 transition-all"
                    style={{ background: `${authorColor}20`, border: `2px solid ${authorColor}`, color: authorColor }}
                  >
                    {author.username[0]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* User info */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span 
                        onClick={() => handleProfileClick(author.id)}
                        className="font-body text-sm font-bold cursor-pointer hover:underline" 
                        style={{ color: '#E8E8FF' }}
                      >
                        {author.username}
                      </span>
                      <span 
                        className="px-1.5 py-0.5 rounded text-xs font-body font-semibold" 
                        style={{ background: `${authorColor}20`, color: authorColor, fontSize: '10px' }}
                      >
                        {FACTION_NAMES[author.anime]}
                      </span>
                      {author.roleTag && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-xs font-display font-bold role-tag-shimmer" 
                          style={{ background: '#1A1A2E', color: '#E8E8FF', fontSize: '9px', letterSpacing: '0.1em' }}
                        >
                          [{author.roleTag}]
                        </span>
                      )}
                      {hasBounty && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-xs font-bold bounty-pulse flex items-center gap-1" 
                          style={{ background: '#FF003C20', color: '#FF003C', fontSize: '9px' }}
                        >
                          <AlertTriangle size={10} strokeWidth={1.5} /> BOUNTY
                        </span>
                      )}
                      {author.betrayalHistory.length > 0 && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1" 
                          style={{ background: '#FF003C10', color: '#FF003C80', fontSize: '9px' }}
                        >
                          <Skull size={10} strokeWidth={1.5} /> TRAITOR x{author.betrayalHistory.length}
                        </span>
                      )}
                      {author.cowardStars > 0 && (
                        <span className="coward-shake flex items-center gap-0.5">
                          {Array.from({ length: author.cowardStars }).map((_, si) => (
                            <Star key={si} size={12} fill="#FF003C" strokeWidth={0} />
                          ))}
                        </span>
                      )}
                      
                      {/* Follow button */}
                      {!isOwnPost && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFollow(author.id);
                          }}
                          className="ml-auto px-2 py-1 rounded text-xs font-body font-semibold transition-all hover:brightness-125"
                          style={{ 
                            background: isFollowing ? 'transparent' : `${factionColor}20`,
                            border: `1px solid ${isFollowing ? '#6666AA' : factionColor}`,
                            color: isFollowing ? '#6666AA' : factionColor
                          }}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>

                    {/* Post text - editable or clickable */}
                    {isEditing ? (
                      <div className="mb-3">
                        <textarea
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="w-full bg-transparent font-body text-sm resize-none focus:outline-none p-2 rounded"
                          style={{ color: '#E8E8FF', minHeight: '60px', background: '#0D0D1A', border: `1px solid ${factionColor}30` }}
                          maxLength={500}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="px-3 py-1 rounded font-body text-xs font-semibold"
                            style={{ background: `${factionColor}20`, color: factionColor }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPost(null)}
                            className="px-3 py-1 rounded font-body text-xs"
                            style={{ color: '#6666AA' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p 
                        className="font-body text-sm mb-3 cursor-pointer hover:opacity-80" 
                        style={{ color: '#E8E8FF' }}
                        onClick={() => navigate(`/post/${post.id}`)}
                      >
                        {renderText(post.text)}
                      </p>
                    )}

                    {/* Quoted post */}
                    {post.quotedPostId && post.quoteText && (
                      <div 
                        className="p-3 rounded-lg mb-3 cursor-pointer hover:brightness-110" 
                        style={{ background: '#0D0D1A', border: '1px solid #1A1A2E' }}
                        onClick={() => navigate(`/post/${post.quotedPostId}`)}
                      >
                        <p className="font-body text-xs" style={{ color: '#6666AA' }}>{post.quoteText}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-5">
                      {/* Like */}
                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={isOwnPost}
                        className="font-body text-xs flex items-center gap-1.5 transition-all duration-200 relative"
                        style={{ 
                          color: isLiked ? '#FF6B8A' : '#6666AA', 
                          opacity: isOwnPost ? 0.4 : 1, 
                          cursor: isOwnPost ? 'not-allowed' : 'pointer' 
                        }}
                        title={isOwnPost ? 'You cannot like your own post' : ''}
                      >
                        <Heart size={14} strokeWidth={1.5} fill={isLiked ? '#FF6B8A' : 'none'} />
                        {post.likes}
                        {likeAnimations.has(post.id) && (
                          <span className="like-burst" />
                        )}
                      </button>

                      {/* Comment */}
                      <button 
                        onClick={() => setExpandedComments(showComments ? null : post.id)}
                        className="font-body text-xs flex items-center gap-1.5 transition-colors hover:brightness-125" 
                        style={{ color: '#6666AA' }}
                      >
                        <MessageCircle size={14} strokeWidth={1.5} /> 
                        {post.comments}
                      </button>

                      {/* Repost */}
                      <div className="relative">
                        <button 
                          onClick={() => setRepostDropdown(repostDropdown === post.id ? null : post.id)}
                          className="font-body text-xs flex items-center gap-1.5 transition-colors hover:brightness-125"
                          style={{ color: isReposted ? '#00FF88' : '#6666AA' }}
                        >
                          <Repeat2 size={14} strokeWidth={1.5} /> 
                          {post.reposts}
                        </button>
                        {repostDropdown === post.id && (
                          <div 
                            className="absolute bottom-full left-0 mb-2 rounded-lg p-1 z-20" 
                            style={{ background: '#0D0D1A', border: '1px solid #2A2A4E', minWidth: '160px' }}
                          >
                            <button 
                              onClick={() => handleRepost(post.id)}
                              className="w-full text-left px-3 py-2 rounded font-body text-xs hover:brightness-125 flex items-center gap-2"
                              style={{ color: '#E8E8FF' }}
                            >
                              <Repeat2 size={14} /> Repost
                            </button>
                            <button 
                              onClick={() => { setQuoteModal(post.id); setRepostDropdown(null); }}
                              className="w-full text-left px-3 py-2 rounded font-body text-xs hover:brightness-125 flex items-center gap-2"
                              style={{ color: '#E8E8FF' }}
                            >
                              <Share2 size={14} /> Quote Post
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Share (Copy Link) */}
                      <button
                        onClick={() => handleShare(post.id)}
                        className="font-body text-xs flex items-center gap-1.5 transition-colors hover:brightness-125"
                        style={{ color: copiedPostId === post.id ? '#00FF88' : '#6666AA' }}
                        title="Copy link to post"
                      >
                        {copiedPostId === post.id ? (
                          <Check size={14} strokeWidth={1.5} />
                        ) : (
                          <Copy size={14} strokeWidth={1.5} />
                        )}
                        {post.shares}
                      </button>

                      {/* Bookmark */}
                      <button
                        onClick={() => handleBookmark(post.id)}
                        className="font-body text-xs flex items-center gap-1.5 transition-all duration-200 relative"
                        style={{ color: isBookmarked ? '#FFD700' : '#6666AA' }}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                      >
                        <Bookmark size={14} strokeWidth={1.5} fill={isBookmarked ? '#FFD700' : 'none'} />
                        {bookmarkAnimations.has(post.id) && (
                          <span className="like-burst" style={{ background: '#FFD700' }} />
                        )}
                      </button>

                      {/* Post menu */}
                      <div className="relative ml-auto">
                        <button
                          onClick={() => setPostMenuOpen(postMenuOpen === post.id ? null : post.id)}
                          className="font-body text-xs transition-colors hover:brightness-125"
                          style={{ color: '#6666AA' }}
                        >
                          <MoreHorizontal size={14} strokeWidth={1.5} />
                        </button>
                        {postMenuOpen === post.id && (
                          <div 
                            className="absolute bottom-full right-0 mb-2 rounded-lg p-1 z-20" 
                            style={{ background: '#0D0D1A', border: '1px solid #2A2A4E', minWidth: '140px' }}
                          >
                            {isOwnPost ? (
                              <>
                                <button 
                                  onClick={() => handleEditPost(post.id)}
                                  className="w-full text-left px-3 py-2 rounded font-body text-xs hover:brightness-125 flex items-center gap-2"
                                  style={{ color: '#E8E8FF' }}
                                >
                                  <Edit size={12} /> Edit
                                </button>
                                <button 
                                  onClick={() => handleDeletePost(post.id)}
                                  className="w-full text-left px-3 py-2 rounded font-body text-xs hover:brightness-125 flex items-center gap-2"
                                  style={{ color: '#FF003C' }}
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => {
                                    alert('Post reported to moderators');
                                    setPostMenuOpen(null);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded font-body text-xs hover:brightness-125 flex items-center gap-2"
                                  style={{ color: '#E8E8FF' }}
                                >
                                  <Flag size={12} /> Report
                                </button>
                                <button 
                                  onClick={() => {
                                    blockUser(author.id);
                                    setPostMenuOpen(null);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded font-body text-xs hover:brightness-125 flex items-center gap-2"
                                  style={{ color: '#FF003C' }}
                                >
                                  <UserX size={12} /> Block User
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <span className="font-body text-xs" style={{ color: '#333355' }}>
                        {timeAgo(post.timestamp)}
                      </span>
                    </div>

                    {/* Inline comments */}
                    {showComments && (
                      <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1A1A2E' }}>
                        <div className="space-y-3 mb-3">
                          {pComments.map(c => {
                            const cAuthor = getUser(c.userId);
                            if (!cAuthor) return null;
                            const cColor = getFactionColor(cAuthor.anime);
                            return (
                              <div key={c.id} className="flex items-start gap-2">
                                <div 
                                  onClick={() => handleProfileClick(cAuthor.id)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center font-display text-[9px] font-bold shrink-0 cursor-pointer hover:brightness-125"
                                  style={{ background: `${cColor}20`, border: `1px solid ${cColor}`, color: cColor }}
                                >
                                  {cAuthor.username[0]}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span 
                                      onClick={() => handleProfileClick(cAuthor.id)}
                                      className="font-body text-xs font-bold cursor-pointer hover:underline" 
                                      style={{ color: '#E8E8FF' }}
                                    >
                                      {cAuthor.username}
                                    </span>
                                    <span 
                                      className="px-1 py-0.5 rounded font-body" 
                                      style={{ background: `${cColor}15`, color: cColor, fontSize: '8px' }}
                                    >
                                      {FACTION_NAMES[cAuthor.anime]}
                                    </span>
                                    <span className="font-body" style={{ color: '#333355', fontSize: '10px' }}>
                                      {timeAgo(c.timestamp)}
                                    </span>
                                  </div>
                                  <p className="font-body text-xs" style={{ color: '#E8E8FF' }}>
                                    {renderText(c.text)}
                                  </p>
                                  <button className="font-body flex items-center gap-1 mt-1" style={{ color: '#6666AA', fontSize: '10px' }}>
                                    <Heart size={10} strokeWidth={1.5} /> {c.likes}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            value={commentText} 
                            onChange={e => setCommentText(e.target.value)}
                            className="flex-1 px-3 py-2 rounded font-body text-xs focus:outline-none"
                            style={{ background: '#0D0D1A', border: `1px solid ${factionColor}30`, color: '#E8E8FF' }}
                            placeholder="Write a reply..."
                            onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                          />
                          <button 
                            onClick={() => handleComment(post.id)}
                            className="px-3 py-2 rounded font-display text-xs font-bold"
                            style={{ background: `${factionColor}20`, color: factionColor }}
                          >
                            REPLY
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile bounties */}
      <div className="lg:hidden w-full max-w-2xl mx-auto px-4 md:px-6 pb-20">
        <div className="rounded-lg p-4" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
          <h3 className="font-display text-xs font-bold tracking-widest mb-3" style={{ color: '#FF003C' }}>
            ACTIVE BOUNTIES
          </h3>
          <div className="space-y-2">
            {activeBounties.slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#1A1A2E' }}>
                <span className="font-display text-xs font-bold flex items-center gap-1" style={{ color: '#FFD700' }}>
                  <Target size={12} strokeWidth={1.5} /> {getUser(b.targetId)?.username || 'Unknown'}
                </span>
                <span className="font-body text-xs" style={{ color: '#6666AA' }}>{b.amount} Gold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="hidden lg:block w-72 p-6 space-y-6 shrink-0">
        <div>
          <h3 className="font-display text-xs font-bold tracking-widest mb-4" style={{ color: '#FF003C' }}>
            ACTIVE BOUNTIES
          </h3>
          <div className="space-y-3">
            {activeBounties.slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#1A1A2E' }}>
                <span className="font-display text-xs font-bold flex items-center gap-1" style={{ color: '#FFD700' }}>
                  <Target size={12} strokeWidth={1.5} /> {getUser(b.targetId)?.username || 'Unknown'}
                </span>
                <span className="font-body text-xs" style={{ color: '#6666AA' }}>{b.amount} Gold</span>
              </div>
            ))}
          </div>
          <h3 className="font-display text-xs font-bold tracking-widest mb-4 mt-6" style={{ color: '#8B00FF', letterSpacing: '4px' }}>
            TRENDING CLANS
          </h3>
          {clans.slice(0, 3).map((clan, i) => (
            <div key={clan.id} className="py-2 border-b font-body text-sm" style={{ borderColor: '#1A1A2E', color: '#6666AA' }}>
              #{i + 1} {clan.name}
            </div>
          ))}
        </div>
      </aside>

      {/* Quote modal */}
      {quoteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center" 
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setQuoteModal(null)}
        >
          <div 
            className="w-full max-w-lg p-6 rounded-lg" 
            style={{ background: '#0D0D1A', border: '1px solid #2A2A4E' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-display text-sm font-bold tracking-widest mb-4" style={{ color: '#E8E8FF' }}>
              QUOTE POST
            </h3>
            <textarea 
              value={quoteText} 
              onChange={e => setQuoteText(e.target.value)}
              className="w-full bg-transparent font-body text-sm resize-none focus:outline-none mb-3"
              style={{ 
                color: '#E8E8FF', 
                minHeight: '80px', 
                padding: '12px 16px', 
                background: '#080812', 
                border: `1px solid ${factionColor}30`, 
                borderRadius: '8px' 
              }}
              placeholder="Add your commentary..."
              maxLength={500}
            />
            <div className="p-3 rounded-lg mb-4" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
              <p className="font-body text-xs" style={{ color: '#6666AA' }}>
                {posts.find(p => p.id === quoteModal)?.text}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setQuoteModal(null)} 
                className="px-4 py-2 rounded font-body text-sm" 
                style={{ color: '#6666AA' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleQuotePost}
                className="px-6 py-2 rounded-md font-display text-xs font-bold tracking-widest"
                style={{ 
                  background: `linear-gradient(135deg, ${factionColor}, ${getFactionGlow(currentUser?.anime || 'jjk')})`, 
                  color: '#030308' 
                }}
              >
                POST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedEnhanced;
