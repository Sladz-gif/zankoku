import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow, getAlignmentLabel } from '@/lib/gameUtils';
import { FACTION_NAMES, FACTION_RESOURCE, TECHNIQUES } from '../types/game';

// Temporary type definition
type AnimeFaction = 'naruto' | 'jjk' | 'onepiece' | 'bleach' | 'blackclover' | 'dragonball' | 'demonslayer' | 'hxh' | 'physical';
import { Swords, Shield, Star, Skull, AlertTriangle, Lock, CheckCircle, Coins, Zap, Award, TrendingUp, BookOpen, Plus, Upload, Image, Type, X, Globe, UserPlus, UserMinus, Edit2, Save, Users, Heart, MessageCircle, Calendar, MapPin, Crown, Target, Flame } from 'lucide-react';
import RankingProgress from '@/components/RankingProgress';

const ProfilePage = () => {
  const { currentUser, users } = useGame();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';
  
  const [tab, setTab] = useState(tabFromUrl);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser?.bio || '');
  const [showFollowers, setShowFollowers] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCreateMangaModal, setShowCreateMangaModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [isSeries, setIsSeries] = useState(false);
  const [chapters, setChapters] = useState<{id: number, title: string, file: File | null}[]>([
    { id: 1, title: 'Chapter 1', file: null }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const color = getFactionColor(currentUser?.anime || 'naruto');
  const glow = getFactionGlow(currentUser?.anime || 'naruto');
  const factionName = FACTION_NAMES[currentUser?.anime || 'naruto'];

  // Calculate stats
  const totalBattles = (currentUser?.duelsWon || 0) + (currentUser?.duelsLost || 0);
  const winRate = totalBattles > 0 ? Math.round((currentUser?.duelsWon || 0) / totalBattles * 100) : 0;
  const rank = currentUser?.rank || 0;

  const handleFollow = (userId: number) => {
    if (followedUsers.includes(userId)) {
      setFollowedUsers(prev => prev.filter(id => id !== userId));
      setIsFollowing(false);
    } else {
      setFollowedUsers(prev => [...prev, userId]);
      setIsFollowing(true);
    }
  };

  const handleCreateManga = () => {
    setShowCreateMangaModal(true);
  };

  const handleLearnMore = () => {
    // Navigate to manga library for now
    navigate('/manga');
  };

  const addChapter = () => {
    const newId = Math.max(...chapters.map(c => c.id)) + 1;
    setChapters([...chapters, { id: newId, title: `Chapter ${newId}`, file: null }]);
  };

  const removeChapter = (id: number) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter(c => c.id !== id));
    }
  };

  const updateChapterTitle = (id: number, title: string) => {
    setChapters(chapters.map(c => c.id === id ? { ...c, title } : c));
  };

  const updateChapterFile = (id: number, file: File | null) => {
    setChapters(chapters.map(c => c.id === id ? { ...c, file } : c));
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
    setBioText(currentUser?.bio || '');
  };

  const handleSaveBio = () => {
    // This would save to backend
    setIsEditingBio(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (!currentUser) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <Users size={48} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <div className="empty-state-title">USER NOT FOUND</div>
          <div className="empty-state-body">
            The user you're looking for doesn't exist.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl border-4 mb-4"
              style={{ 
                background: `${color}20`, 
                borderColor: color,
                color: color
              }}
            >
              {currentUser.username[0]?.toUpperCase()}
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold font-orbitron mb-2">{currentUser.username}</h1>
              <div className="flex items-center gap-2 justify-center mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${color}20`, color: color }}>
                  {factionName}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1A1A2E] text-[#6666AA]">
                  Rank {rank}
                </span>
              </div>
              <div className="text-sm text-[#6666AA]">
                Level {Math.floor(rank / 10)} · {currentUser.points || 0} Points
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#E8E8FF] mb-1">{currentUser.duelsWon || 0}</div>
              <div className="text-xs text-[#6666AA]">WINS</div>
            </div>
            <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#E8E8FF] mb-1">{currentUser.duelsLost || 0}</div>
              <div className="text-xs text-[#6666AA]">LOSSES</div>
            </div>
            <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#E8E8FF] mb-1">{winRate}%</div>
              <div className="text-xs text-[#6666AA]">WIN RATE</div>
            </div>
            <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#E8E8FF] mb-1">{currentUser.coins || 0}</div>
              <div className="text-xs text-[#6666AA]">COINS</div>
            </div>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-orbitron">RANK PROGRESS</h2>
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-[#FFD700]" />
              <span className="text-lg font-bold" style={{ color: '#FFD700' }}>Rank {rank}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#6666AA]">Current Rank</span>
                <span className="text-[#E8E8FF]">Rank {rank}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-[#1A1A2E]">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(rank % 10) * 10}%`,
                    background: `linear-gradient(90deg, ${color}, ${glow})`
                  }}
                />
              </div>
            </div>
            <div className="text-center text-sm text-[#6666AA]">
              {rank % 10}/10 to next rank · {10 - (rank % 10)} battles remaining
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold font-orbitron mb-4">ACHIEVEMENTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFD700]/20 flex items-center justify-center mx-auto mb-2">
                <Award size={24} className="text-[#FFD700]" />
              </div>
              <div className="text-sm font-medium text-[#E8E8FF]">First Victory</div>
              <div className="text-xs text-[#6666AA]">Win your first battle</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#8B00FF]/20 flex items-center justify-center mx-auto mb-2">
                <Target size={24} className="text-[#8B00FF]" />
              </div>
              <div className="text-sm font-medium text-[#E8E8FF]">Sharpshooter</div>
              <div className="text-xs text-[#6666AA]">75% win rate</div>
            </div>
            <div className="text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-[#1A1A2E] flex items-center justify-center mx-auto mb-2">
                <Lock size={24} className="text-[#6666AA]" />
              </div>
              <div className="text-sm font-medium text-[#6666AA]">Locked</div>
              <div className="text-xs text-[#333355]">Win 100 battles</div>
            </div>
            <div className="text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-[#1A1A2E] flex items-center justify-center mx-auto mb-2">
                <Lock size={24} className="text-[#6666AA]" />
              </div>
              <div className="text-sm font-medium text-[#6666AA]">Locked</div>
              <div className="text-xs text-[#333355]">Reach Rank 50</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold font-orbitron mb-4">RECENT ACTIVITY</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#1A1A2E]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Swords size={16} className="text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#E8E8FF]">Victory vs Player2</div>
                  <div className="text-xs text-[#6666AA]">2 hours ago</div>
                </div>
              </div>
              <div className="text-sm text-green-400">+25 Rank</div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1A1A2E]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Skull size={16} className="text-red-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#E8E8FF]">Defeat vs Player3</div>
                  <div className="text-xs text-[#6666AA]">5 hours ago</div>
                </div>
              </div>
              <div className="text-sm text-red-400">-10 Rank</div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                  <Award size={16} className="text-[#FFD700]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#E8E8FF]">Achievement Unlocked</div>
                  <div className="text-xs text-[#6666AA]">1 day ago</div>
                </div>
              </div>
              <div className="text-sm text-[#FFD700]">+50 Coins</div>
            </div>
          </div>
        </div>

        {/* Create Your Manga */}
        <div className="bg-gradient-to-r from-[#8B00FF]/20 to-[#5500CC]/20 border border-[#8B00FF]/50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold font-orbitron mb-2" style={{ color: '#8B00FF' }}>CREATE YOUR MANGA</h2>
              <p className="text-sm text-[#6666AA]">Share your stories with the Zankoku community</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#8B00FF]/20 flex items-center justify-center">
              <BookOpen size={32} className="text-[#8B00FF]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 text-center">
              <Upload size={24} className="text-[#8B00FF] mx-auto mb-2" />
              <div className="text-sm font-medium text-[#E8E8FF] mb-1">Upload Chapters</div>
              <div className="text-xs text-[#6666AA]">PDF, JPG, PNG</div>
            </div>
            <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 text-center">
              <Type size={24} className="text-[#8B00FF] mx-auto mb-2" />
              <div className="text-sm font-medium text-[#E8E8FF] mb-1">Write Stories</div>
              <div className="text-xs text-[#6666AA]">Rich text editor</div>
            </div>
            <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 text-center">
              <Globe size={24} className="text-[#8B00FF] mx-auto mb-2" />
              <div className="text-sm font-medium text-[#E8E8FF] mb-1">Reach Readers</div>
              <div className="text-xs text-[#6666AA]">Global audience</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowTestModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B00FF] to-[#5500CC] text-white rounded-lg font-medium hover:shadow-[0_0_20px_rgba(139,0,255,0.5)] transition-all"
            >
              <Plus size={20} />
              Test Modal
            </button>
            <button 
              onClick={() => alert(`Modal state: ${showCreateMangaModal}`)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Debug State
            </button>
            <button 
              onClick={handleLearnMore}
              className="px-6 py-3 bg-[#080812] border border-[#1A1A2E] text-[#E8E8FF] rounded-lg font-medium hover:border-[#8B00FF] transition-all"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Test Modal */}
        {showTestModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              backgroundColor: '#080812',
              border: '1px solid #1A1A2E',
              borderRadius: '12px',
              maxWidth: '512px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ padding: '24px' }}>
                <h2 style={{ color: '#E8E8FF', marginBottom: '16px' }}>Test Modal Working!</h2>
                <p style={{ color: '#6666AA', marginBottom: '16px' }}>This is a simple test modal.</p>
                <button 
                  onClick={() => setShowTestModal(false)}
                  style={{ 
                    backgroundColor: '#8B00FF', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Manga Modal */}
        {showCreateMangaModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              backgroundColor: '#080812',
              border: '1px solid #1A1A2E',
              borderRadius: '12px',
              maxWidth: '1024px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px',
                borderBottom: '1px solid #1A1A2E',
                flexShrink: 0
              }}>
                <h2 style={{ color: '#E8E8FF', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                  Create New {isSeries ? 'Series' : 'Manga'}
                </h2>
                <button
                  onClick={() => setShowCreateMangaModal(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#1A1A2E',
                    border: 'none',
                    color: '#6666AA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                color: '#E8E8FF'
              }}>
                <p>Modal is working! This is a test.</p>
                <button 
                  onClick={() => setIsSeries(!isSeries)}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    backgroundColor: '#8B00FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Toggle Series: {isSeries ? 'Series' : 'One-Shot'}
                </button>
              </div>

              {/* Modal Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px',
                borderTop: '1px solid #1A1A2E',
                flexShrink: 0,
                gap: '16px'
              }}>
                <button
                  onClick={() => setShowCreateMangaModal(false)}
                  style={{
                    padding: '8px 24px',
                    backgroundColor: '#1A1A2E',
                    color: '#6666AA',
                    border: '1px solid #1A1A2E',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateMangaModal(false);
                    navigate('/manga');
                  }}
                  style={{
                    padding: '8px 24px',
                    backgroundColor: '#8B00FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Create {isSeries ? 'Series' : 'Manga'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
