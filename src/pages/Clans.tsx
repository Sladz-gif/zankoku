import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { AnimeFaction, Alignment, ClanPostType } from '@/types/game';
import { Shield, Search, Plus, Lock, Users, Trophy, ArrowLeft, ArrowUp, ArrowDown, MessageCircle, Pin, Trash2, Award, Ban, Flame, TrendingUp, Clock, Crown } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { Tabs } from '@/components/shared/Tabs';

const Clans = () => {
  // Add custom CSS for modal scrolling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced Create Clan modal scrolling on mobile */
      @media (max-width: 767px) {
        .fixed.inset-0.z-50 > div:last-child {
          overflow-x: auto !important;
          overflow-y: auto !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          max-height: 90vh !important;
        }
        
        .fixed.inset-0.z-50 > div:last-child::-webkit-scrollbar {
          display: none !important;
        }
        
        .fixed.inset-0.z-50 > div:last-child > div.p-6 {
          min-width: 320px !important;
          overflow-x: auto !important;
          overflow-y: auto !important;
        }
        
        /* Make clan avatar circles very small on mobile */
        .page-enter > div > div > div > div > div > div > div:first-child {
          width: 20px !important;
          height: 20px !important;
          font-size: 6px !important;
          border-width: 0.5px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const { 
    clans, 
    currentUser, 
    joinClan, 
    leaveClan,
    clanPosts,
    addClanPost,
    voteClanPost,
    removeClanPost,
    pinClanPost,
    createClan,
    requestJoinClan,
    clanJoinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    banClanMember,
    promoteClanMember,
    getClanMemberRole
  } = useGame();

  // Demo clans for better visualization
  const demoClans = [
    {
      id: 1,
      name: 'Shadow Legion',
      tag: 'SHDW',
      motto: 'From darkness we rise, to victory we fall',
      description: 'Elite warriors specializing in stealth and surprise attacks',
      alignment: 'villain' as const,
      primaryAnime: 'naruto' as const,
      joinType: 'approval' as const,
      members: 1250,
      wins: 342,
      losses: 89,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
      leaderId: 1,
      rules: [{ id: 1, text: 'Loyalty above all' }, { id: 2, text: 'Strike from the shadows' }]
    },
    {
      id: 2,
      name: 'Phoenix Rising',
      tag: 'PHNX',
      motto: 'Born from ashes, reborn in battle',
      description: 'Resilient fighters who never give up, no matter the odds',
      alignment: 'hero' as const,
      primaryAnime: 'bleach' as const,
      joinType: 'open' as const,
      members: 980,
      wins: 256,
      losses: 134,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45,
      leaderId: 2,
      rules: [{ id: 1, text: 'Never surrender' }, { id: 2, text: 'Protect the innocent' }]
    },
    {
      id: 3,
      name: 'Dragon Force',
      tag: 'DRGN',
      motto: 'The power of dragons flows through our veins',
      description: 'Masters of ancient techniques and devastating power',
      alignment: 'hero' as const,
      primaryAnime: 'onepiece' as const,
      joinType: 'approval' as const,
      members: 1100,
      wins: 412,
      losses: 98,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
      leaderId: 3,
      rules: [{ id: 1, text: 'Honor the dragon code' }, { id: 2, text: 'Train relentlessly' }]
    },
    {
      id: 4,
      name: 'Cursed Society',
      tag: 'CRSD',
      motto: 'Embrace the curse, master the power',
      description: 'Wielders of forbidden arts and dark energies',
      alignment: 'villain' as const,
      primaryAnime: 'jjk' as const,
      joinType: 'invite' as const,
      members: 750,
      wins: 289,
      losses: 67,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
      leaderId: 4,
      rules: [{ id: 1, text: 'Keep secrets sacred' }, { id: 2, text: 'Power above morality' }]
    },
    {
      id: 5,
      name: 'Demon Slayers',
      tag: 'SLAY',
      motto: 'Protect humanity from the darkness',
      description: 'Sacred warriors dedicated to protecting the innocent',
      alignment: 'hero' as const,
      primaryAnime: 'demonslayer' as const,
      joinType: 'open' as const,
      members: 1450,
      wins: 523,
      losses: 145,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
      leaderId: 5,
      rules: [{ id: 1, text: 'Protect the weak' }, { id: 2, text: 'Never show fear' }]
    },
    {
      id: 6,
      name: 'Anti-Magic Union',
      tag: 'ANTI',
      motto: 'True strength needs no magic',
      description: 'Warriors who rely on pure skill and determination',
      alignment: 'wanderer' as const,
      primaryAnime: 'blackclover' as const,
      joinType: 'approval' as const,
      members: 620,
      wins: 198,
      losses: 89,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 150,
      leaderId: 6,
      rules: [{ id: 1, text: 'Reject magical shortcuts' }, { id: 2, text: 'Train body and mind' }]
    }
  ];

  // Demo clan posts
  const demoClanPosts = [
    {
      id: 1,
      clanId: 1,
      title: 'Night Raid Training Session',
      body: 'All members required for stealth training at midnight. Bring your best techniques.',
      type: 'announcement' as const,
      authorId: 1,
      authorUsername: 'ShadowMaster',
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
      upvotes: 15,
      downvotes: 2,
      isPinned: true,
      commentCount: 8
    },
    {
      id: 2,
      clanId: 1,
      title: 'Victory Against Dragon Force!',
      body: 'Excellent teamwork in today\'s clan battle. Our shadow techniques proved superior!',
      type: 'celebration' as const,
      authorId: 2,
      authorUsername: 'NightHawk',
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      upvotes: 23,
      downvotes: 1,
      isPinned: false,
      commentCount: 12
    },
    {
      id: 3,
      clanId: 2,
      title: 'Welcome New Members!',
      body: 'Five new warriors joined our ranks today. Let\'s show them the Phoenix way!',
      type: 'welcome' as const,
      authorId: 3,
      authorUsername: 'PhoenixLeader',
      createdAt: Date.now() - 1000 * 60 * 60 * 8,
      upvotes: 18,
      downvotes: 0,
      isPinned: false,
      commentCount: 6
    }
  ];

  // Use demo data if real data is empty
  const allClans = clans.length > 0 ? clans : demoClans;
  const allClanPosts = clanPosts.length > 0 ? clanPosts : demoClanPosts;
  
  const [selectedClan, setSelectedClan] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [alignmentFilter, setAlignmentFilter] = useState<'all' | Alignment>('all');
  const [joinTypeFilter, setJoinTypeFilter] = useState<'all' | 'open' | 'approval' | 'invite'>('all');
  const [factionFilter, setFactionFilter] = useState<'all' | AnimeFaction>('all');
  const [sortBy, setSortBy] = useState<'members' | 'wins' | 'points' | 'activity'>('members');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailTab, setDetailTab] = useState('posts');
  const [postSort, setPostSort] = useState<'hot' | 'new' | 'top'>('hot');
  
  // Create clan form state
  const [clanName, setClanName] = useState('');
  const [clanTag, setClanTag] = useState('');
  const [clanMotto, setClanMotto] = useState('');
  const [clanDescription, setClanDescription] = useState('');
  const [clanAlignment, setClanAlignment] = useState<Alignment>('hero');
  const [clanJoinType, setClanJoinType] = useState<'open' | 'approval' | 'invite'>('open');
  const [clanLeaderTitle, setClanLeaderTitle] = useState('Leader');
  const [clanRules, setClanRules] = useState<string[]>(['Be respectful', 'Stay active']);
  
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';
  
  const getClanColor = (anime: AnimeFaction | 'mixed') => anime === 'mixed' ? '#8B00FF' : getFactionColor(anime as AnimeFaction);
  
  // Filter and sort clans
  let filtered = allClans.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesAlignment = alignmentFilter === 'all' || c.alignment === alignmentFilter;
    const matchesJoinType = joinTypeFilter === 'all' || c.joinType === joinTypeFilter;
    const matchesFaction = factionFilter === 'all' || c.primaryAnime === factionFilter;
    return matchesSearch && matchesAlignment && matchesJoinType && matchesFaction;
  });
  
  // Sort clans
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'members') return b.members - a.members;
    if (sortBy === 'wins') return b.wins - a.wins;
    if (sortBy === 'points') return (b.wins * 100) - (a.wins * 100);
    return 0;
  });
  
  const detail = selectedClan !== null ? allClans.find(c => c.id === selectedClan) : null;
  const userClan = currentUser?.clanId ? clans.find(c => c.id === currentUser.clanId) : null;
  const isInClan = detail && currentUser?.clanId === detail.id;
  const userRole = detail && currentUser ? getClanMemberRole(detail.id, currentUser.id) : null;
  const isLeaderOrOfficer = userRole === 'leader' || userRole === 'officer';
  
  // Get clan posts
  const detailPosts = detail ? allClanPosts.filter(p => p.clanId === detail.id) : [];
  
  // Sort posts
  const sortedPosts = [...detailPosts].sort((a, b) => {
    if (postSort === 'hot') {
      const scoreA = a.upvotes - a.downvotes + (a.isPinned ? 1000 : 0);
      const scoreB = b.upvotes - b.downvotes + (b.isPinned ? 1000 : 0);
      return scoreB - scoreA;
    }
    if (postSort === 'new') return b.createdAt - a.createdAt;
    if (postSort === 'top') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    return 0;
  });
  
  const handleCreateClan = () => {
    if (!currentUser) return;
    if (clanName.length < 3 || clanName.length > 30) {
      alert('Clan name must be 3-30 characters');
      return;
    }
    if (clanTag.length < 2 || clanTag.length > 5) {
      alert('Clan tag must be 2-5 characters');
      return;
    }
    
    createClan(
      clanName,
      clanTag,
      clanMotto,
      clanDescription,
      clanAlignment,
      currentUser.anime,
      clanLeaderTitle,
      clanRules.map((text, i) => ({ id: i + 1, text })),
      clanJoinType
    );
    
    setShowCreateModal(false);
    setClanName('');
    setClanTag('');
    setClanMotto('');
    setClanDescription('');
  };
  
  const handleJoinClan = (clanId: number, joinType: 'open' | 'approval' | 'invite') => {
    if (!currentUser) return;
    if (joinType === 'open') {
      joinClan(clanId);
    } else if (joinType === 'approval') {
      requestJoinClan(clanId, 'I would like to join your clan');
    } else {
      alert('This clan is invite-only');
    }
  };

  if (detail) {
    const cColor = getClanColor(detail.primaryAnime);
    return (
      <div className="page-enter max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <button onClick={() => setSelectedClan(null)} className="flex items-center justify-center w-8 h-8 font-['Rajdhani'] text-sm mb-4 rounded-lg bg-[#1A1A2E] hover:bg-[#2A2A4E] hover:text-[var(--text-primary)] transition-colors" style={{ color: '#6666AA' }}>
          <ArrowLeft size={14} strokeWidth={1.5} />
        </button>
        
        {/* Clan Header */}
        <div className="rounded-lg overflow-hidden mb-6" style={{ border: `1px solid ${cColor}40` }}>
          <div className="h-24 sm:h-32 relative" style={{ background: `linear-gradient(135deg, ${cColor}40, #080812)` }}>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6" style={{ background: 'linear-gradient(to top, #080812, transparent)' }}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h1 className="font-['Orbitron'] text-xl sm:text-2xl md:text-3xl font-bold tracking-wider mb-1" style={{ color: cColor }}>
                    {detail.name} <span className="text-sm sm:text-lg" style={{ color: '#6666AA' }}>[{detail.tag}]</span>
                  </h1>
                  <p className="font-['Rajdhani'] text-xs sm:text-sm italic" style={{ color: '#6666AA' }}>{detail.motto}</p>
                </div>
                {isInClan && userRole === 'leader' && (
                  <Crown size={24} sm:w-8 sm:h-8 strokeWidth={1.5} style={{ color: cColor, opacity: 0.5 }} />
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6" style={{ background: '#080812' }}>
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
              <span className="px-2 sm:px-3 py-1 rounded text-xs font-['Rajdhani'] font-bold uppercase tracking-wider" style={{ background: `${cColor}20`, color: cColor, border: `1px solid ${cColor}40` }}>
                {detail.alignment}
              </span>
              <span className="flex items-center gap-1.5 font-['Rajdhani'] text-xs sm:text-sm" style={{ color: '#6666AA' }}>
                <Users size={12} strokeWidth={1.5} /> {detail.members} members
              </span>
              <span className="flex items-center gap-1.5 font-['Rajdhani'] text-xs sm:text-sm" style={{ color: '#00FF88' }}>
                <Trophy size={12} strokeWidth={1.5} /> {detail.wins}W / {detail.losses}L
              </span>
              <span className="px-2 py-1 rounded text-xs font-['Rajdhani'] font-semibold" style={{ 
                background: detail.joinType === 'open' ? '#00FF8820' : detail.joinType === 'approval' ? '#FFD70020' : '#FF003C20',
                color: detail.joinType === 'open' ? '#00FF88' : detail.joinType === 'approval' ? '#FFD700' : '#FF003C'
              }}>
                {detail.joinType === 'open' ? 'OPEN' : detail.joinType === 'approval' ? 'APPROVAL' : 'INVITE ONLY'}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {!isInClan && (
                <Button 
                  onClick={() => handleJoinClan(detail.id, detail.joinType)}
                  variant="primary"
                  icon={detail.joinType === 'invite' ? Lock : Shield}
                  disabled={detail.joinType === 'invite'}
                >
                  {detail.joinType === 'open' ? 'JOIN CLAN' : detail.joinType === 'approval' ? 'REQUEST TO JOIN' : 'INVITE ONLY'}
                </Button>
              )}
              {isInClan && (
                <Button onClick={leaveClan} variant="danger">
                  LEAVE CLAN
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Clan Tabs */}
        <Tabs
          tabs={[
            { id: 'posts', label: 'Posts' },
            { id: 'members', label: 'Members' },
            { id: 'wars', label: 'War History' },
            ...(isLeaderOrOfficer ? [{ id: 'requests', label: 'Join Requests' }] : [])
          ]}
          activeTab={detailTab}
          onChange={setDetailTab}
        />
        
        <div className="mt-6">
          {/* Posts Tab */}
          {detailTab === 'posts' && (
            <div>
              {/* Post Sort */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setPostSort('hot')}
                  className={`px-3 sm:px-4 py-2 rounded font-['Rajdhani'] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all`}
                  style={{
                    background: postSort === 'hot' ? `${cColor}20` : 'transparent',
                    color: postSort === 'hot' ? cColor : '#6666AA',
                    border: `1px solid ${postSort === 'hot' ? cColor + '40' : '#1A1A2E'}`
                  }}
                >
                  <TrendingUp size={12} strokeWidth={1.5} className="inline mr-1" /> Hot
                </button>
                <button
                  onClick={() => setPostSort('new')}
                  className={`px-3 sm:px-4 py-2 rounded font-['Rajdhani'] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all`}
                  style={{
                    background: postSort === 'new' ? `${cColor}20` : 'transparent',
                    color: postSort === 'new' ? cColor : '#6666AA',
                    border: `1px solid ${postSort === 'new' ? cColor + '40' : '#1A1A2E'}`
                  }}
                >
                  <Clock size={12} strokeWidth={1.5} className="inline mr-1" /> New
                </button>
                <button
                  onClick={() => setPostSort('top')}
                  className={`px-3 sm:px-4 py-2 rounded font-['Rajdhani'] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all`}
                  style={{
                    background: postSort === 'top' ? `${cColor}20` : 'transparent',
                    color: postSort === 'top' ? cColor : '#6666AA',
                    border: `1px solid ${postSort === 'top' ? cColor + '40' : '#1A1A2E'}`
                  }}
                >
                  <Trophy size={12} strokeWidth={1.5} className="inline mr-1" /> Top
                </button>
              </div>
              
              {/* Reddit-style Posts */}
              <div className="space-y-3">
                {sortedPosts.length === 0 && (
                  <div className="text-center py-12" style={{ color: '#6666AA' }}>
                    <MessageCircle size={48} strokeWidth={1.5} className="mx-auto mb-3 opacity-30" />
                    <p className="font-['Rajdhani']">No posts yet. Be the first to post!</p>
                  </div>
                )}
                {sortedPosts.map(post => {
                  const score = post.upvotes - post.downvotes;
                  return (
                    <div key={post.id} className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
                      {/* Vote Section */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => voteClanPost(post.id, 'up')}
                          className="p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors"
                        >
                          <ArrowUp size={16} strokeWidth={1.5} style={{ color: '#00FF88' }} />
                        </button>
                        <span className="font-['Orbitron'] font-bold text-xs sm:text-sm" style={{ color: score > 0 ? '#00FF88' : score < 0 ? '#FF003C' : '#6666AA' }}>
                          {score}
                        </span>
                        <button
                          onClick={() => voteClanPost(post.id, 'down')}
                          className="p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors"
                        >
                          <ArrowDown size={16} strokeWidth={1.5} style={{ color: '#FF003C' }} />
                        </button>
                      </div>
                      
                      {/* Post Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                          {post.isPinned && (
                            <Pin size={12} strokeWidth={1.5} style={{ color: '#FFD700' }} />
                          )}
                          <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-['Rajdhani'] font-bold uppercase" style={{ background: `${cColor}20`, color: cColor }}>
                            {post.type}
                          </span>
                          <span className="text-xs font-['Rajdhani']" style={{ color: '#6666AA' }}>
                            by {post.authorUsername} • {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-['Orbitron'] font-bold text-sm sm:text-base mb-2" style={{ color: '#E8E8FF' }}>
                          {post.title}
                        </h3>
                        <p className="font-['Rajdhani'] text-xs sm:text-sm mb-3" style={{ color: '#6666AA' }}>
                          {post.body}
                        </p>
                        
                        {/* Post Actions */}
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <button className="flex items-center gap-1 text-xs font-['Rajdhani']" style={{ color: '#6666AA' }}>
                            <MessageCircle size={12} strokeWidth={1.5} /> {post.commentCount || 0} comments
                          </button>
                          {isLeaderOrOfficer && (
                            <>
                              <button
                                onClick={() => pinClanPost(post.id)}
                                className="flex items-center gap-1 text-xs font-['Rajdhani'] hover:text-[var(--neon-gold)] transition-colors"
                                style={{ color: '#6666AA' }}
                              >
                                <Pin size={12} strokeWidth={1.5} /> {post.isPinned ? 'Unpin' : 'Pin'}
                              </button>
                              <button
                                onClick={() => removeClanPost(post.id)}
                                className="flex items-center gap-1 text-xs font-['Rajdhani'] hover:text-[var(--neon-red)] transition-colors"
                                style={{ color: '#6666AA' }}
                              >
                                <Trash2 size={12} strokeWidth={1.5} /> Remove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Members Tab */}
          {detailTab === 'members' && (
            <div className="space-y-3">
              <p className="text-center py-12 font-['Rajdhani']" style={{ color: '#6666AA' }}>Member list coming soon</p>
            </div>
          )}
          
          {/* Wars Tab */}
          {detailTab === 'wars' && (
            <div className="space-y-3">
              <p className="text-center py-12 font-['Rajdhani']" style={{ color: '#6666AA' }}>War history coming soon</p>
            </div>
          )}
          
          {/* Join Requests Tab */}
          {detailTab === 'requests' && isLeaderOrOfficer && (
            <div className="space-y-3">
              {clanJoinRequests.filter(r => r.clanId === detail.id && r.status === 'pending').length === 0 && (
                <p className="text-center py-12 font-['Rajdhani']" style={{ color: '#6666AA' }}>No pending join requests</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-['Orbitron'] text-xl sm:text-2xl font-bold tracking-wider flex items-center gap-3" style={{ color: '#E8E8FF' }}>
          <Shield size={20} strokeWidth={1.5} /> CLANS
        </h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          icon={Plus}
          disabled={!!userClan}
          className="w-full sm:w-auto"
        >
          CREATE CLAN
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#333355' }} />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 rounded-md font-['Rajdhani'] text-sm focus:outline-none transition-all"
          style={{ 
            background: '#080812', 
            border: '1px solid #1A1A2E', 
            color: '#E8E8FF', 
            padding: '12px 16px', 
            paddingLeft: '36px',
            fontSize: '14px'
          }}
          placeholder="Search clans..." 
        />
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Select
          value={alignmentFilter}
          onChange={(v) => setAlignmentFilter(v as any)}
          options={[
            { value: 'all', label: 'All Alignments' },
            { value: 'hero', label: 'Hero' },
            { value: 'villain', label: 'Villain' },
            { value: 'wanderer', label: 'Wanderer' }
          ]}
        />
        <Select
          value={joinTypeFilter}
          onChange={(v) => setJoinTypeFilter(v as any)}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'open', label: 'Open' },
            { value: 'approval', label: 'Approval' },
            { value: 'invite', label: 'Invite Only' }
          ]}
        />
        <Select
          value={factionFilter}
          onChange={(v) => setFactionFilter(v as any)}
          options={[
            { value: 'all', label: 'All Factions' },
            { value: 'naruto', label: 'Naruto' },
            { value: 'jjk', label: 'JJK' },
            { value: 'onepiece', label: 'One Piece' },
            { value: 'bleach', label: 'Bleach' },
            { value: 'blackclover', label: 'Black Clover' },
            { value: 'dragonball', label: 'Dragon Ball' },
            { value: 'demonslayer', label: 'Demon Slayer' },
            { value: 'hunterxhunter', label: 'Hunter x Hunter' }
          ]}
        />
        <Select
          value={sortBy}
          onChange={(v) => setSortBy(v as any)}
          options={[
            { value: 'members', label: 'Most Members' },
            { value: 'wins', label: 'Most Wins' },
            { value: 'points', label: 'Highest Points' },
            { value: 'activity', label: 'Most Active' }
          ]}
        />
      </div>
      
      {/* Clan List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: '#6666AA' }}>
            <Shield size={48} strokeWidth={1.5} className="mx-auto mb-3 opacity-30" />
            <p className="font-['Rajdhani']">No clans found matching your filters</p>
          </div>
        )}
        {filtered.map((clan, i) => {
          const cColor = getFactionColor(clan.anime || 'naruto');
          return (
            <button 
              key={clan.id} 
              onClick={() => setSelectedClan(clan.id)}
              className="w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              style={{ 
                animationDelay: `${i * 50}ms`, 
                background: '#0D0D1A', 
                border: `1px solid ${cColor}40`, 
                boxShadow: `0 4px 12px rgba(0,0,0,0.3), 0 0 20px ${cColor}15` 
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold text-[8px] sm:text-[10px] flex-shrink-0"
                      style={{ 
                        background: `${cColor}20`, 
                        color: cColor,
                        border: `0.5px solid ${cColor}40`
                      }}
                    >
                      {clan.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-['Orbitron'] text-base sm:text-lg font-bold tracking-wider truncate" style={{ color: '#E8E8FF' }}>
                        {clan.name || 'Unknown Clan'}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-['Rajdhani'] font-semibold px-1.5 sm:px-2 py-0.5 rounded" style={{ 
                          background: `${cColor}15`, 
                          color: cColor,
                          border: `1px solid ${cColor}30`
                        }}>
                          [{clan.tag || 'TAG'}]
                        </span>
                        {clan.joinType === 'invite' && (
                          <Lock size={12} strokeWidth={1.5} style={{ color: '#FF003C' }} />
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="font-['Rajdhani'] text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2" style={{ color: '#B8B8D0' }}>
                    {clan.motto || 'No motto available'}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-['Rajdhani'] font-semibold uppercase" style={{ 
                      background: `${cColor}25`, 
                      color: cColor,
                      border: `1px solid ${cColor}40`
                    }}>
                      {clan.alignment || 'wanderer'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-['Rajdhani'] px-2 py-1 rounded" style={{ 
                      background: '#1A1A2E', 
                      color: '#6666AA',
                      border: '1px solid #2A2A4E'
                    }}>
                      <Users size={10} strokeWidth={1.5} /> {Array.isArray(clan.members) ? clan.members.length : (clan.memberCount || 0)} members
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-['Rajdhani'] px-2 py-1 rounded" style={{ 
                      background: '#0A2E0A', 
                      color: '#00FF88',
                      border: '1px solid #00FF8840'
                    }}>
                      <Trophy size={10} strokeWidth={1.5} /> {clan.wins || 0}W
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-3 border-t" style={{ borderColor: '#2A2A4E' }}>
                <span className="text-xs font-['Rajdhani']" style={{ color: '#6666AA' }}>
                  Created {clan.createdAt ? new Date(clan.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
                <span className="px-3 py-1 rounded text-xs font-['Rajdhani'] font-bold uppercase" style={{ 
                  background: clan.joinType === 'open' ? '#00FF8820' : clan.joinType === 'approval' ? '#FFD70020' : '#FF003C20',
                  color: clan.joinType === 'open' ? '#00FF88' : clan.joinType === 'approval' ? '#FFD700' : '#FF003C',
                  border: `1px solid ${clan.joinType === 'open' ? '#00FF8840' : clan.joinType === 'approval' ? '#FFD70040' : '#FF003C40'}`
                }}>
                  {clan.joinType || 'open'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Create Clan Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Clan"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: '#00FF8820', border: '1px solid #00FF8840' }}>
            <p className="text-sm font-['Rajdhani'] font-semibold" style={{ color: '#00FF88' }}>
              Create your own clan and build a community of warriors!
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={clanName}
              onChange={setClanName}
              placeholder="Clan Name (3-30 chars)"
              fullWidth
            />
            <Input
              value={clanTag}
              onChange={setClanTag}
              placeholder="Tag (2-5 chars)"
              fullWidth
            />
          </div>
          
          <Input
            value={clanMotto}
            onChange={setClanMotto}
            placeholder="Clan Motto"
            fullWidth
          />
          
          <textarea
            value={clanDescription}
            onChange={(e) => setClanDescription(e.target.value)}
            placeholder="Clan Description"
            rows={3}
            className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg font-['Rajdhani'] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-blue)] transition-all"
          />
          
          <div className="grid grid-cols-3 gap-4">
            <Select
              value={clanAlignment}
              onChange={(v) => setClanAlignment(v as Alignment)}
              options={[
                { value: 'hero', label: 'Hero' },
                { value: 'villain', label: 'Villain' },
                { value: 'wanderer', label: 'Wanderer' }
              ]}
              fullWidth
            />
            <Select
              value={clanJoinType}
              onChange={(v) => setClanJoinType(v as any)}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'approval', label: 'Approval' },
                { value: 'invite', label: 'Invite Only' }
              ]}
              fullWidth
            />
            <Input
              value={clanLeaderTitle}
              onChange={setClanLeaderTitle}
              placeholder="Leader Title"
              fullWidth
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button onClick={() => setShowCreateModal(false)} variant="ghost">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateClan} 
              variant="primary"
              disabled={!currentUser || clanName.length < 3}
            >
              Create Clan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clans;
