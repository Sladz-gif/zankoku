import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getAlignmentLabel, timeAgo } from '@/lib/gameUtils';
import { FACTION_NAMES } from '@/types/game';
import { ArrowLeft, Heart, MessageCircle, Repeat2, Eye, AlertTriangle, Skull, Star } from 'lucide-react';
import { useState } from 'react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, users, currentUser, comments, toggleLike, addComment } = useGame();
  const [commentText, setCommentText] = useState('');
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  const post = posts.find(p => p.id === Number(id));
  if (!post) return (
    <div className="page-enter max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-body text-sm mb-4" style={{ color: '#6666AA' }}>
        <ArrowLeft size={18} strokeWidth={1.5} /> Back
      </button>
      <p className="font-body text-sm" style={{ color: '#6666AA' }}>Post not found.</p>
    </div>
  );

  const getUser = (uid: number) => {
    if (currentUser?.id === uid) return currentUser;
    return users.find(u => u.id === uid);
  };

  const author = getUser(post.userId);
  if (!author) return null;
  const authorColor = getFactionColor(author.anime);
  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
  const pComments = comments.filter(c => c.postId === post.id);

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="page-enter flex">
      <div className="flex-1 max-w-2xl mx-auto p-4 md:p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-body text-sm mb-6" style={{ color: '#6666AA' }}>
          <ArrowLeft size={18} strokeWidth={1.5} /> Back to Feed
        </button>

        <div className="rounded-lg p-6" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-display text-lg font-bold shrink-0"
              style={{ background: `${authorColor}20`, border: `2px solid ${authorColor}`, color: authorColor }}>
              {author.username[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>{author.username}</span>
                <span className="px-1.5 py-0.5 rounded text-xs font-body font-semibold" style={{ background: `${authorColor}20`, color: authorColor, fontSize: '10px' }}>
                  {FACTION_NAMES[author.anime]}
                </span>
                {author.roleTag && (
                  <span className="px-1.5 py-0.5 rounded text-xs font-display font-bold role-tag-shimmer" style={{ background: '#1A1A2E', color: '#E8E8FF', fontSize: '9px', letterSpacing: '0.1em' }}>
                    [{author.roleTag}]
                  </span>
                )}
                {author.bountyActive && (
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold bounty-pulse flex items-center gap-1" style={{ background: '#FF003C20', color: '#FF003C', fontSize: '9px' }}>
                    <AlertTriangle size={10} /> BOUNTY
                  </span>
                )}
              </div>
              <span className="font-body text-xs" style={{ color: '#333355' }}>{timeAgo(post.timestamp)}</span>
            </div>
          </div>

          <p className="font-body text-base mb-6" style={{ color: '#E8E8FF', lineHeight: 1.7 }}>{post.text}</p>

          <div className="flex items-center gap-6 py-4" style={{ borderTop: '1px solid #1A1A2E', borderBottom: '1px solid #1A1A2E' }}>
            <button onClick={() => toggleLike(post.id)}
              className="font-body text-sm flex items-center gap-1.5"
              style={{ color: isLiked ? '#FF6B8A' : '#6666AA' }}>
              <Heart size={16} strokeWidth={1.5} fill={isLiked ? '#FF6B8A' : 'none'} /> {post.likes}
            </button>
            <span className="font-body text-sm flex items-center gap-1.5" style={{ color: '#6666AA' }}>
              <MessageCircle size={16} strokeWidth={1.5} /> {pComments.length}
            </span>
            <span className="font-body text-sm flex items-center gap-1.5" style={{ color: '#6666AA' }}>
              <Repeat2 size={16} strokeWidth={1.5} /> {post.reposts}
            </span>
            <span className="font-body text-sm flex items-center gap-1.5" style={{ color: '#6666AA' }}>
              <Eye size={16} strokeWidth={1.5} /> {post.likes * 3 + post.reposts * 5}
            </span>
          </div>

          {/* Comment composer */}
          <div className="flex gap-2 mt-4 mb-6">
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              className="flex-1 rounded font-body text-sm focus:outline-none"
              style={{ background: '#0D0D1A', border: `1px solid ${factionColor}30`, color: '#E8E8FF', padding: '12px 16px' }}
              placeholder="Write a comment..."
              onKeyDown={e => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment}
              className="px-4 py-2 rounded font-display text-xs font-bold tracking-wider"
              style={{ background: `${factionColor}20`, color: factionColor }}>
              REPLY
            </button>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {pComments.map(c => {
              const cAuthor = getUser(c.userId);
              if (!cAuthor) return null;
              const cColor = getFactionColor(cAuthor.anime);
              return (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#0D0D1A' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold shrink-0"
                    style={{ background: `${cColor}20`, border: `1px solid ${cColor}`, color: cColor }}>
                    {cAuthor.username[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>{cAuthor.username}</span>
                      <span className="px-1 py-0.5 rounded font-body" style={{ background: `${cColor}15`, color: cColor, fontSize: '9px' }}>{FACTION_NAMES[cAuthor.anime]}</span>
                      <span className="font-body" style={{ color: '#333355', fontSize: '10px' }}>{timeAgo(c.timestamp)}</span>
                    </div>
                    <p className="font-body text-sm" style={{ color: '#E8E8FF' }}>{c.text}</p>
                    <button className="font-body flex items-center gap-1 mt-1.5" style={{ color: '#6666AA', fontSize: '11px' }}>
                      <Heart size={12} strokeWidth={1.5} /> {c.likes}
                    </button>
                  </div>
                </div>
              );
            })}
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
