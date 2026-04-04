import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow, getAlignmentLabel } from '@/lib/gameUtils';
import { FACTION_NAMES, FACTION_RESOURCE, TECHNIQUES, AnimeFaction } from '@/types/game';
import { Swords, Shield, Star, Skull, AlertTriangle, Lock, CheckCircle, Coins, Zap, Award, TrendingUp, BookOpen, Plus, Upload, Image, Type, X, Globe, UserPlus, UserMinus, Edit2, Save, Users, Heart, MessageCircle, Calendar, MapPin } from 'lucide-react';
import RankingProgress from '@/components/RankingProgress';

// Mock anime data for demonstration
const POPULAR_ANIME = [
  { id: 1, title: 'Naruto Shippuden', genre: 'Action', rating: 4.8, episodes: 500, status: 'completed', image: '🍥' },
  { id: 2, title: 'Attack on Titan', genre: 'Dark Fantasy', rating: 4.9, episodes: 87, status: 'completed', image: '🔱' },
  { id: 3, title: 'Jujutsu Kaisen', genre: 'Action', rating: 4.7, episodes: 24, status: 'ongoing', image: '👻' },
  { id: 4, title: 'Demon Slayer', genre: 'Action', rating: 4.6, episodes: 26, status: 'completed', image: '⚔️' },
  { id: 5, title: 'One Piece', genre: 'Adventure', rating: 4.9, episodes: 1000, status: 'ongoing', image: '🏴‍☠️' },
  { id: 6, title: 'Bleach', genre: 'Action', rating: 4.5, episodes: 366, status: 'completed', image: '⚔️' },
  { id: 7, title: 'My Hero Academia', genre: 'Superhero', rating: 4.4, episodes: 138, status: 'ongoing', image: '🦸' },
  { id: 8, title: 'Dragon Ball Z', genre: 'Action', rating: 4.8, episodes: 291, status: 'completed', image: '🐉' },
];

const Profile = () => {
  const { currentUser, users, toggleFollow, followedUsers } = useGame();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'overview');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

  // Get other users to follow
  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  useEffect(() => {
    if (currentUser && followedUsers.includes(currentUser.id)) {
      setIsFollowing(true);
    }
  }, [currentUser, followedUsers]);

  if (!currentUser) return null;

  const color = getFactionColor(currentUser.anime);
  const glow = getFactionGlow(currentUser.anime);
  const allTechniques = TECHNIQUES[currentUser.anime];

  const handleSaveBio = () => {
    // In a real app, this would save to backend
    console.log('Saving bio:', bioText);
    setIsEditingBio(false);
    // Update currentUser bio (mock)
    currentUser.bio = bioText;
  };

  const handleFollow = (userId: number) => {
    toggleFollow(userId);
  };

  const handleEditBio = () => {
    setBioText(currentUser.bio || '');
    setIsEditingBio(true);
  };

  return (
    <div className="page-enter max-w-6xl mx-auto p-4 md:p-6">
      {/* Profile Header */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden mb-8" style={{ 
        background: `linear-gradient(135deg, ${color}40, ${glow}20, #080812)` 
      }}>
        <span className="kanji-watermark" style={{ top: '-20%', right: '5%', fontSize: '10rem' }}>残酷</span>
        
        {/* User Avatar and Basic Info */}
        <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-end gap-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center font-display text-3xl font-black -mt-12 border-4"
            style={{ 
              background: `${color}20`, 
              border: `4px solid ${color}`, 
              color,
              boxShadow: `0 0 30px ${color}40` 
            }}
          >
            {currentUser.username[0]?.toUpperCase()}
          </div>
          
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold tracking-wider mb-2" style={{ color: '#E8E8FF' }}>
              {currentUser.username}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-lg text-center" style={{ background: `${color}20`, border: `1px solid ${color}` }}>
                <div className="font-display text-xl font-bold" style={{ color }}>{currentUser.points}</div>
                <div className="font-body text-xs" style={{ color: '#6666AA' }}>POINTS</div>
              </span>
              <span className="px-2 py-1 rounded text-xs font-body font-semibold flex items-center gap-1"
                style={{ background: currentUser.alignment === 'hero' ? '#00C8FF20' : currentUser.alignment === 'villain' ? '#FF003C20' : '#8B00FF20', color: currentUser.alignment === 'hero' ? '#00C8FF' : currentUser.alignment === 'villain' ? '#FF003C' : '#8B00FF' }}>
                {currentUser.alignment === 'hero' ? <Swords size={12} /> : currentUser.alignment === 'villain' ? <Skull size={12} /> : <Shield size={12} />}
                {getAlignmentLabel(currentUser.alignment)}
              </span>
              <span className="px-2 py-1 rounded text-xs font-body font-semibold" style={{ background: `${color}20`, color }}>{FACTION_NAMES[currentUser.anime]}</span>
              <span className="font-display text-xs font-bold flex items-center gap-1" style={{ color: '#FFD700' }}>
                <TrendingUp size={12} strokeWidth={1.5} /> RANK #{currentUser.rank}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Section */}
          <div className="neon-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold tracking-wider" style={{ color }}>
                BIO
              </h2>
              <button
                onClick={handleEditBio}
                className="touch-target p-2 rounded-lg transition-all duration-200"
                style={{ background: `${color}10`, border: `1px solid ${color}` }}
              >
                <Edit2 size={16} style={{ color }} />
              </button>
            </div>
            
            {isEditingBio ? (
              <div className="space-y-3">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  placeholder="Tell the Zankoku community about yourself..."
                  className="w-full p-4 rounded-lg font-body text-sm focus:outline-none resize-none"
                  style={{ 
                    background: 'var(--bg-elevated)', 
                    color: 'var(--text-primary)', 
                    border: '1px solid var(--border)',
                    minHeight: '120px'
                  }}
                  rows={4}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveBio}
                    className="touch-target px-6 py-2 rounded-lg font-body font-semibold transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, var(--neon-green), #00AA55)', color: '#fff' }}
                  >
                    <Save size={16} className="mr-2" />
                    Save Bio
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="touch-target px-6 py-2 rounded-lg font-body font-semibold transition-all duration-200"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {currentUser.bio ? (
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {currentUser.bio}
                  </p>
                ) : (
                  <div className="text-center py-8">
                    <Type size={32} style={{ color: 'var(--text-muted)' }} />
                    <p className="font-body text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
                      No bio yet. Click the edit button to add your story!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Favorite Anime Section */}
          <div className="neon-card p-6">
            <h2 className="font-display text-lg font-bold tracking-wider mb-4" style={{ color }}>
              FAVORITE ANIME
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {POPULAR_ANIME.map(anime => (
                <div key={anime.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg p-4 transition-all duration-200 hover:scale-105"
                    style={{ 
                      background: 'var(--bg-elevated)', 
                      border: '1px solid var(--border)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.boxShadow = `0 0 20px ${color}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{anime.image}</div>
                      <div className="flex-1">
                        <h3 className="font-body font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                          {anime.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded" style={{ 
                            background: anime.status === 'ongoing' ? 'var(--neon-green)' : 'var(--neon-blue)', 
                            color: '#fff' 
                          }}>
                            {anime.status}
                          </span>
                          <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            ⭐ {anime.rating}
                          </span>
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {anime.episodes} episodes
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart size={16} className="touch-target" style={{ color: 'var(--neon-red)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="neon-card p-6">
            <h2 className="font-display text-lg font-bold tracking-wider mb-4" style={{ color }}>
              BATTLE STATISTICS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Duels Won', val: currentUser.duelsWon, icon: Swords, color: 'var(--neon-green)' },
                { label: 'Duels Lost', val: currentUser.duelsLost, icon: Shield, color: 'var(--neon-red)' },
                { label: 'Shapes', val: currentUser.shapesCaptured, icon: Star, color: 'var(--neon-blue)' },
                { label: 'Clan Wars', val: currentUser.clanWars, icon: AlertTriangle, color: 'var(--neon-orange)' },
                { label: 'Bounties', val: currentUser.bountiesClaimed, icon: Coins, color: 'var(--neon-gold)' },
                { label: 'Win Rate', val: currentUser.duelsWon + currentUser.duelsLost > 0 ? `${Math.round((currentUser.duelsWon / (currentUser.duelsWon + currentUser.duelsLost)) * 100)}%` : '0%', icon: TrendingUp, color: 'var(--neon-purple)' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <Icon size={20} style={{ color: stat.color }} />
                    <div className="font-display text-xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                      {stat.val}
                    </div>
                    <div className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Follow System */}
        <div className="space-y-6">
          {/* Follow/Unfollow Current User */}
          <div className="neon-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold tracking-wider" style={{ color }}>
                ACTIONS
              </h2>
            </div>
            <button
              onClick={() => handleFollow(currentUser.id)}
              className="w-full touch-target px-6 py-3 rounded-lg font-body font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{ 
                background: isFollowing ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--neon-purple), #5500CC)', 
                color: isFollowing ? 'var(--text-secondary)' : '#fff',
                border: isFollowing ? '1px solid var(--border)' : 'none'
              }}
            >
              {isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
              {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
            </button>
          </div>

          {/* Other Users to Follow */}
          <div className="neon-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold tracking-wider" style={{ color }}>
                DISCOVER USERS
              </h2>
              <button
                onClick={() => setShowFollowers(!showFollowers)}
                className="text-sm font-body font-semibold"
                style={{ color: 'var(--neon-blue)' }}
              >
                {showFollowers ? 'Show Less' : 'Show All'}
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {otherUsers.slice(0, showFollowers ? otherUsers.length : 5).map(user => {
                const isFollowed = followedUsers.includes(user.id);
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-102"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-bold"
                        style={{ 
                          background: `${getFactionColor(user.anime)}20`, 
                          border: `2px solid ${getFactionColor(user.anime)}`, 
                          color: getFactionColor(user.anime)
                        }}
                      >
                        {user.username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-body font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {user.username}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded" style={{ 
                            background: user.alignment === 'hero' ? '#00C8FF20' : user.alignment === 'villain' ? '#FF003C20' : '#8B00FF20', 
                            color: user.alignment === 'hero' ? '#00C8FF' : user.alignment === 'villain' ? '#FF003C' : '#8B00FF' 
                          }}>
                            {getAlignmentLabel(user.alignment)}
                          </span>
                          <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            Rank #{user.rank}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(user.id)}
                      className="touch-target px-3 py-1.5 rounded-lg font-body text-xs font-semibold transition-all duration-200"
                      style={{ 
                        background: isFollowed ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--neon-blue), #0066CC)', 
                        color: isFollowed ? 'var(--text-secondary)' : '#fff',
                        border: isFollowed ? '1px solid var(--border)' : 'none'
                      }}
                    >
                      {isFollowed ? <UserMinus size={12} /> : <UserPlus size={12} />}
                      {isFollowed ? 'UNFOLLOW' : 'FOLLOW'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="neon-card p-6">
            <h2 className="font-display text-lg font-bold tracking-wider mb-4" style={{ color }}>
              QUICK ACTIONS
            </h2>
            <div className="space-y-3">
              <Link
                to="/messages"
                className="w-full touch-target flex items-center gap-3 px-4 py-3 rounded-lg font-body font-semibold transition-all duration-200"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <MessageCircle size={18} />
                Send Message
              </Link>
              <Link
                to="/battle"
                className="w-full touch-target flex items-center gap-3 px-4 py-3 rounded-lg font-body font-semibold transition-all duration-200"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <Swords size={18} />
                Challenge to Duel
              </Link>
              <Link
                to="/clans"
                className="w-full touch-target flex items-center gap-3 px-4 py-3 rounded-lg font-body font-semibold transition-all duration-200"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <Shield size={18} />
                View Clan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="mt-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-6 overflow-x-auto">
          {['overview', 'techniques', 'history', 'clan', 'create'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="pb-4 font-body text-sm font-semibold capitalize flex items-center gap-2 whitespace-nowrap transition-all duration-200"
              style={{ 
                color: tab === t ? color : 'var(--text-muted)', 
                borderBottom: tab === t ? `2px solid ${color}` : '2px solid transparent',
                minWidth: '120px'
              }}
            >
              {t === 'ranking' && <TrendingUp size={14} />}
              {t === 'create' && <BookOpen size={14} />}
              {t === 'create' ? 'Create Manga' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RankingProgress user={currentUser} />
            </div>
            <div className="neon-card p-6">
              <h3 className="font-display text-lg font-bold tracking-wider mb-4" style={{ color }}>
                RESOURCES
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {FACTION_RESOURCE[currentUser.anime]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Zap size={16} style={{ color }} />
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div 
                        className="h-full rounded-full resource-bar" 
                        style={{ 
                          width: `${currentUser.resource}%`, 
                          background: `linear-gradient(90deg, ${color}, ${glow})` 
                        }} 
                      />
                    </div>
                  </div>
                  <span className="font-display text-xs font-bold" style={{ color }}>
                    {currentUser.resource}/{currentUser.maxResource}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Currency
                  </span>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid #CD7F32' }}>
                      <Coins size={12} style={{ color: '#CD7F32' }} />
                      <span className="font-display text-sm font-bold" style={{ color: '#CD7F32' }}>
                        {currentUser.currency.bronze}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid #C0C0C0' }}>
                      <Coins size={12} style={{ color: '#C0C0C0' }} />
                      <span className="font-display text-sm font-bold" style={{ color: '#C0C0C0' }}>
                        {currentUser.currency.silver}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid #FFD700' }}>
                      <Coins size={12} style={{ color: '#FFD700' }} />
                      <span className="font-display text-sm font-bold" style={{ color: '#FFD700' }}>
                        {currentUser.currency.gold}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'techniques' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTechniques.map(tech => {
              const owned = currentUser.techniques.includes(tech.name);
              return (
                <div key={tech.name} className="neon-card p-5 relative overflow-hidden transition-all duration-200 hover:scale-105"
                  style={{
                    background: owned ? `${color}10` : 'var(--bg-surface)',
                    border: `1px solid ${owned ? `${color}40` : 'var(--border)'}`,
                    opacity: owned ? 1 : 0.7,
                  }}
                >
                  {!owned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Lock size={32} strokeWidth={1.5} style={{ color: '#333355' }} />
                    </div>
                  )}
                  {owned && (
                    <CheckCircle size={16} strokeWidth={1.5} className="absolute top-3 right-3" style={{ color: 'var(--neon-green)' }} />
                  )}
                  <h4 className="font-display text-sm font-bold mb-2" style={{ color: owned ? color : 'var(--text-primary)' }}>
                    {tech.name}
                  </h4>
                  <p className="font-body text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {tech.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold flex items-center gap-1" style={{ color: 'var(--neon-orange)' }}>
                      <Zap size={10} strokeWidth={1.5} /> Cost: {tech.cost}
                    </span>
                    {owned && (
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ 
                        background: 'var(--neon-green)', 
                        color: '#fff' 
                      }}>
                        OWNED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'history' && (
          <div className="neon-card p-8 text-center">
            <Calendar size={48} style={{ color: 'var(--text-muted)' }} />
            <h3 className="font-display text-xl font-bold tracking-wider mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>
              Battle History
            </h3>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              No battle history yet. Enter the battle lobby to start your journey!
            </p>
            <Link
              to="/battle"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg font-body font-semibold transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, var(--neon-purple), #5500CC)', color: '#fff' }}
            >
              <Swords size={18} />
              Enter Battle Lobby
            </Link>
          </div>
        )}

        {tab === 'clan' && (
          <div className="neon-card p-8 text-center">
            <Shield size={48} style={{ color: 'var(--text-muted)' }} />
            <h3 className="font-display text-xl font-bold tracking-wider mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>
              Clan Information
            </h3>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              {currentUser.clanId ? 'You are part of a clan. Visit the Clans page to manage your clan activities.' : 'You are not in a clan yet. Visit the Clans page to join one!'}
            </p>
            <Link
              to="/clans"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg font-body font-semibold transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, var(--neon-purple), #5500CC)', color: '#fff' }}
            >
              <Shield size={18} />
              {currentUser.clanId ? 'Manage Clan' : 'Join Clan'}
            </Link>
          </div>
        )}

        {tab === 'create' && (
          <div className="neon-card p-8 text-center">
            <BookOpen size={48} style={{ color: 'var(--text-muted)' }} />
            <h3 className="font-display text-xl font-bold tracking-wider mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>
              Create Manga
            </h3>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              Share your stories and art with the Zankoku community. Create compelling manga series and earn Gold from readers!
            </p>
            <div className="mt-6">
              <Link
                to="/manga"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-body font-semibold transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)', color: '#fff' }}
              >
                <BookOpen size={18} />
                Browse Manga Library
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
