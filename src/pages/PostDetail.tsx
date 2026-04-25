import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, timeAgo } from '@/lib/gameUtils';
import { ArrowLeft, Heart, MessageCircle, Repeat2, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, users, currentUser, getPostById } = useGame();
  const [commentText, setCommentText] = useState('');
  const [animatingPosts, setAnimatingPosts] = useState(new Set());
  const [comments, setComments] = useState([]);
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  // Move useEffect to top to follow Rules of Hooks
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Force horizontal layout for post detail */
      .flex.items-center,
      .flex.justify-between,
      .flex.justify-around {
        display: flex !important;
        flex-direction: row !important;
      }
      
      .flex.items-center > *,
      .flex.justify-between > *,
      .flex.justify-around > * {
        display: inline-flex !important;
        flex-direction: row !important;
      }
      
      .flex.items-center button,
      .flex.justify-between button,
      .flex.justify-around button {
        display: inline-flex !important;
        flex-direction: row !important;
        align-items: center !important;
        width: auto !important;
        flex-shrink: 0 !important;
      }
      
      .flex.items-center button span,
      .flex.justify-between button span,
      .flex.justify-around button span {
        display: inline-block !important;
      }
      
      .flex.gap-4 > *,
      .flex.gap-6 > * {
        flex-shrink: 0;
      }
      
      .space-y-3 > * {
        margin-bottom: 0.75rem !important;
      }
      
      .page-enter {
        min-height: 100vh;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Helper functions and calculations
  const getUser = (uid: number) => {
    if (currentUser?.id === uid) return currentUser;
    return users.find(u => u.id === uid);
  };

  const handleLike = async (postId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!currentUser) return;
    
    setAnimatingPosts(prev => new Set(prev).add(postId));
    // TODO: Implement actual like functionality
    console.log('Post liked:', postId);
    
    setTimeout(() => {
      setAnimatingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }, 200);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    // TODO: Implement actual comment functionality
    console.log('Comment added:', commentText);
    setCommentText('');
  };

  // Early returns after all hooks
  if (!posts || posts.length === 0) return (
    <div className="page-enter max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-body text-sm mb-4" style={{ color: '#6666AA' }}>
        <ArrowLeft size={18} strokeWidth={1.5} /> Back to Feed
      </button>
      <p className="font-body text-sm" style={{ color: '#6666AA' }}>Loading posts...</p>
    </div>
  );

  const post = getPostById(id);
  if (!post) return (
    <div className="page-enter max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-body text-sm mb-4" style={{ color: '#6666AA' }}>
        <ArrowLeft size={18} strokeWidth={1.5} /> Back to Feed
      </button>
      <p className="font-body text-sm" style={{ color: '#6666AA' }}>Post not found.</p>
    </div>
  );

  const author = getUser(post.userId);
  if (!author) return null;
  const authorColor = getFactionColor(author.anime);
  const isLiked = currentUser ? post.likedBy?.includes(currentUser.id) : false;
  const pComments = comments.filter(c => c.postId === post.id);

  return (
    <div className="page-enter flex">
      <div className="flex-1 max-w-2xl mx-auto p-4 md:p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-body text-sm mb-6" style={{ color: '#6666AA' }}>
          <ArrowLeft size={18} strokeWidth={1.5} /> Back to Feed
        </button>

        <div className="rounded-lg p-6" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: authorColor, color: 'white' }}>
                {author?.username[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <span className="font-bold text-white" style={{ fontFamily: 'Orbitron, monospace', fontSize: '15px' }}>{author?.username || 'Unknown User'}</span>
                <span className="text-gray-500" style={{ fontFamily: 'Orbitron, monospace', fontSize: '15px' }}>@{author?.username?.toLowerCase() || 'unknown'} · {timeAgo(post.timestamp)}</span>
              </div>
            </div>

            <div className="text-white leading-relaxed mb-6">
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.5' }}>
                {post.text}
              </p>
            </div>

            {/* Stats Row - X/Twitter style */}
            <div className="flex items-center justify-between w-full text-gray-500 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{pComments.length}</span>
              </span>
              <span className="flex items-center gap-1">
                <Repeat2 size={16} />
                <span>{Math.floor((post.likedBy?.length || 0) * 0.3)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Heart size={16} className={isLiked ? 'text-red-500' : ''} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{post.likedBy?.length || 0}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} />
                <span>{Math.floor((post.likedBy?.length || 0) * 10)}</span>
              </span>
            </div>

            {/* Action Buttons - Interactive X/Twitter style */}
            <div className="flex items-center justify-between w-full mt-2">
              <button 
                onClick={(e) => {
                  if (currentUser) handleLike(post.id, e);
                }} 
                className={`flex items-center gap-2 p-2 rounded-full transition ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                } ${animatingPosts.has(post.id) ? 'scale-110' : ''}`}
                style={{ 
                  transform: animatingPosts.has(post.id) ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease-out'
                }}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                <span>{post.likedBy?.length || 0}</span>
              </button>
              
              <button className="flex items-center gap-2 p-2 rounded-full text-gray-500 hover:text-blue-500 transition">
                <MessageCircle size={18} />
                <span>{pComments.length}</span>
              </button>
              
              <button className="flex items-center gap-2 p-2 rounded-full text-gray-500 hover:text-green-500 transition">
                <Repeat2 size={18} />
                <span>{Math.floor((post.likedBy?.length || 0) * 0.3)}</span>
              </button>
              
              <button className="flex items-center gap-2 p-2 rounded-full text-gray-500 hover:text-blue-400 transition">
                <Eye size={18} />
                <span>{Math.floor((post.likedBy?.length || 0) * 10)}</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="font-display text-lg font-bold mb-4" style={{ color: '#8B00FF' }}>Comments</h3>
              {pComments.length === 0 ? (
                <p className="font-body text-gray-400">No comments yet. Be the first to comment!</p>
              ) : (
                <div className="space-y-4">
                  {pComments.map(comment => {
                    const commentAuthor = getUser(comment.userId);
                    if (!commentAuthor) return null;
                    const commentColor = getFactionColor(commentAuthor.anime);

                    return (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: commentColor, color: 'white' }}>
                          {commentAuthor.username[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white" style={{ fontFamily: 'Orbitron, monospace', fontSize: '14px' }}>{commentAuthor.username || 'Unknown User'}</span>
                            <span className="text-gray-400" style={{ fontFamily: 'Orbitron, monospace', fontSize: '12px' }}>@{commentAuthor.username?.toLowerCase() || 'unknown'} · {timeAgo(comment.timestamp)}</span>
                          </div>
                          <p className="text-white leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reply Input */}
            <div className="flex items-center gap-3 mt-4">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
                style={{ border: `1px solid ${factionColor}` }}
              />
              <button 
                onClick={handleComment}
                className="px-4 py-2 rounded-lg text-white font-bold transition"
                style={{ background: factionColor }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="hidden lg:block w-72 p-6 space-y-6 shrink-0">
        <div className="rounded-lg p-5" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
          <h3 className="font-display text-xs font-bold tracking-widest mb-4" style={{ color: authorColor, letterSpacing: '4px' }}>POSTER PROFILE</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-bold"
              style={{ background: `${authorColor}20`, border: `2px solid ${authorColor}`, color: authorColor }}>
              {author.username[0]}
            </div>
            <div>
              <div className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>{author.username}</div>
              <div className="font-body text-xs" style={{ color: '#6666AA' }}>Rank #{author.rank}</div>
            </div>
          </div>
          <div className="font-body text-xs" style={{ color: '#6666AA' }}>{author.bio}</div>
        </div>
      </aside>
    </div>
  );
};

export default PostDetail;
