import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow } from '@/lib/gameUtils';
import { AnimeFaction, FACTION_NAMES } from '@/types/game';
import { Swords, Skull, Shield, Coins, Square, Triangle, Grid3X3, X, Play, GraduationCap, Target, Award } from 'lucide-react';

const ANIMES: AnimeFaction[] = ['naruto', 'jjk', 'onepiece', 'bleach', 'blackclover', 'dragonball', 'demonslayer', 'hxh', 'physical'];

const AI_ANIMES: AnimeFaction[] = ['naruto', 'jjk', 'onepiece', 'bleach', 'blackclover', 'dragonball', 'demonslayer', 'hxh'];

const GRID_SIZES = [
  { size: 4, label: '4×4', tier: 'Small' },
  { size: 6, label: '6×6', tier: 'Medium' },
  { size: 8, label: '8×8', tier: 'Large' },
  { size: 10, label: '10×10', tier: 'XL' },
  { size: 12, label: '12×12', tier: 'XXL' },
  { size: 14, label: '14×14', tier: 'TITAN', special: true },
];

const BattleLobby = () => {
  const { currentUser, users } = useGame();
  
  const [section, setSection] = useState<'duel' | 'clanwar' | 'dojo' | 'dungeon'>('dojo');
  const [p2AnimeState, setP2Anime] = useState<AnimeFaction>('naruto');
  const [aiAnime, setAiAnime] = useState<AnimeFaction>('naruto');
  const [gridSizeState, setGridSize] = useState(4);
  const [shapeMode, setShapeMode] = useState<'square' | 'triangle'>('square');
  const [duelTypeState, setDuelType] = useState<'normal' | 'death'>('normal');
  const [difficultyState, setDifficulty] = useState<'normal' | 'hard' | 'hardest'>('normal');
  const [showConfirm, setShowConfirm] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
  
  // Filter out blocked users from online players list
  const filteredUsers = (users && Array.isArray(users)) ? users.filter(user => !blockedUsers.includes(user.id)) : [];
  
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { p1Anime: AnimeFaction; p2Anime: AnimeFaction; p2Username?: string; gridSize: number; duelType: string; difficulty?: 'normal' | 'hard' | 'hardest'; mode?: 'tutorial' | 'practice' | 'master' | 'pvp' } | null;

  const p1Anime = state?.p1Anime || 'jjk';
  const p2Anime = state?.p2Anime || 'naruto';
  const p2Username = state?.p2Username || 'Player 2';
  const gridSize = state?.gridSize || 4;
  const duelType = state?.duelType || 'square';
  const difficulty = state?.difficulty || 'normal';
  
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  const startGame = () => {
    setShowConfirm(true);
  };

  const confirmAndStart = () => {
    // Force square mode for now since triangle is coming soon
    navigate('/game', { state: { p1Anime: currentUser?.anime || 'jjk', p2Anime, gridSize, duelType, shapeMode: 'square', difficulty } });
  };

  const openChallenges = users.slice(0, 4).map(u => ({
    ...u,
    type: Math.random() > 0.5 ? 'normal' as const : 'death' as const,
  }));

  return (
    <div className="page-enter max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3 mb-6" style={{ color: '#FF003C', textShadow: '0 0 20px rgba(255,0,60,0.3)' }}>
        <Swords size={22} strokeWidth={1.5} /> BATTLE LOBBY
      </h1>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b mb-6" style={{ borderColor: '#1A1A2E' }}>
        {(['dojo', 'duel', 'clanwar', 'dungeon'] as const).map(s => (
          <button key={s} onClick={() => setSection(s)} className="pb-2 font-['Rajdhani'] text-sm font-semibold uppercase"
            style={{ color: section === s ? '#FF003C' : '#6666AA', borderBottom: section === s ? '2px solid #FF003C' : '2px solid transparent' }}>
            {s === 'clanwar' ? 'Clan War' : s === 'dungeon' ? 'Dungeon Raid' : s === 'dojo' ? 'Dojo' : 'Duel'}
          </button>
        ))}
      </div>

      {section === 'duel' && (
        <div className="space-y-6">
          <div className="rounded-lg p-6" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
            <h2 className="font-display text-sm font-bold tracking-widest mb-5" style={{ color: '#E8E8FF', letterSpacing: '4px' }}>START A DUEL</h2>

            <div className="mb-5">
              <label className="font-body text-sm font-semibold block mb-2" style={{ color: '#6666AA' }}>Find Opponent</label>
              
              {/* Search by Username */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter username..."
                    className="flex-1 px-3 py-2 rounded font-body text-sm"
                    style={{ 
                      background: '#0D0D1A', 
                      border: '1px solid #1A1A2E',
                      color: '#E8E8FF',
                      outline: 'none'
                    }}
                  />
                  <button
                    className="px-4 py-2 rounded font-display text-xs font-bold transition-all"
                    style={{
                      background: '#00C8FF20',
                      border: '1px solid #00C8FF40',
                      color: '#00C8FF',
                      cursor: 'pointer'
                    }}
                  >
                    SEARCH
                  </button>
                </div>
              </div>
              
              {/* Find Random Online Player */}
              <div className="mb-4">
                <button
                  className="w-full px-4 py-3 rounded font-display text-sm font-bold transition-all"
                  style={{
                    background: '#FFD70020',
                    border: '1px solid #FFD70040',
                    color: '#FFD700',
                    cursor: 'pointer'
                  }}
                >
                  🎲 FIND RANDOM ONLINE PLAYER
                </button>
              </div>
              
              {/* Online Players List */}
              <div className="mb-4">
                <h3 className="font-body text-xs font-semibold mb-2" style={{ color: '#6666AA' }}>Online Players</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filteredUsers.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg" style={{ 
                      background: '#080812', 
                      border: `1px solid ${getFactionColor(user.anime)}40` 
                    }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold" 
                          style={{ 
                            background: `${getFactionColor(user.anime)}20`, 
                            border: `2px solid ${getFactionColor(user.anime)}`, 
                            color: getFactionColor(user.anime) 
                          }}
                        >
                          {user.username[0]}
                        </div>
                        <div>
                          <span className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>{user.username}</span>
                          <span className="font-body text-xs ml-2" style={{ color: '#6666AA' }}>Rank #{user.rank}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setP2Anime(user.anime);
                            // TODO: Send challenge to user
                            navigate('/game', { state: { p1Anime: currentUser?.anime || 'jjk', p2Anime: user.anime, p2Username: user.username, gridSize, duelType, shapeMode: 'square', difficulty } });
                          }}
                          className="px-3 py-1 rounded font-display text-xs font-bold transition-all"
                          style={{
                            background: `${getFactionColor(user.anime)}20`,
                            border: `1px solid ${getFactionColor(user.anime)}40`,
                            color: getFactionColor(user.anime),
                            cursor: 'pointer'
                          }}
                        >
                          CHALLENGE
                        </button>
                        <button
                          onClick={() => {
                            if (blockedUsers.includes(user.id)) {
                              setBlockedUsers(prev => prev.filter(id => id !== user.id));
                              alert(`${user.username} has been unblocked`);
                            } else {
                              setBlockedUsers(prev => [...prev, user.id]);
                              alert(`${user.username} has been blocked`);
                            }
                          }}
                          className={`px-3 py-1 rounded font-display text-xs font-bold transition-all ${
                            blockedUsers.includes(user.id) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          style={{
                            background: blockedUsers.includes(user.id) ? '#FF003C20' : `${getFactionColor(user.anime)}20`,
                            border: `1px solid ${blockedUsers.includes(user.id) ? '#FF003C40' : getFactionColor(user.anime)}40`,
                            color: blockedUsers.includes(user.id) ? '#FF003C' : getFactionColor(user.anime),
                            cursor: blockedUsers.includes(user.id) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {blockedUsers.includes(user.id) ? 'UNBLOCK' : 'BLOCK'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-4" style={{ color: '#6666AA' }}>
                      <div className="text-sm mb-2">No online players found</div>
                      <div className="text-xs">Try searching for a specific username or check back later</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shape selection */}
            <div className="mb-5">
              <label className="font-display text-xs font-bold tracking-widest block mb-3" style={{ color: '#E8E8FF', letterSpacing: '4px' }}>CHOOSE YOUR BATTLEFIELD</label>
              <div className="grid grid-cols-2 gap-3">
                <button disabled
                  className="p-6 rounded-lg text-center transition-all duration-300 opacity-60 cursor-not-allowed"
                  style={{ background: '#0D0D1A', border: '2px solid #1A1A2E' }}>
                  <Triangle size={40} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: '#333355' }} />
                  <h4 className="font-display text-sm font-bold mb-1" style={{ color: '#6666AA' }}>TRIANGLE</h4>
                  <p className="font-body text-xs" style={{ color: '#6666AA' }}>Coming Soon</p>
                </button>
                <button onClick={() => setShapeMode('square')}
                  className="p-6 rounded-lg text-center transition-all duration-300"
                  style={{ background: shapeMode === 'square' ? `${factionColor}15` : '#0D0D1A', border: `2px solid ${shapeMode === 'square' ? factionColor : '#1A1A2E'}`, boxShadow: shapeMode === 'square' ? `0 0 25px ${factionColor}25` : 'none' }}>
                  <Square size={40} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: shapeMode === 'square' ? factionColor : '#333355' }} />
                  <h4 className="font-display text-sm font-bold mb-1" style={{ color: shapeMode === 'square' ? factionColor : '#6666AA' }}>SQUARE</h4>
                  <p className="font-body text-xs" style={{ color: '#6666AA' }}>Claim squares. Control the grid.</p>
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className="font-body text-sm font-semibold block mb-2 flex items-center gap-1.5" style={{ color: '#6666AA' }}>
                <Grid3X3 size={14} strokeWidth={1.5} /> Grid Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {GRID_SIZES.map(g => (
                  <button key={g.size} onClick={() => setGridSize(g.size)}
                    className="px-4 py-2 rounded font-display text-xs font-bold"
                    style={{
                      background: gridSize === g.size ? `${factionColor}20` : '#0D0D1A',
                      border: `1px solid ${gridSize === g.size ? factionColor : g.special ? '#FFD70040' : '#1A1A2E'}`,
                      color: gridSize === g.size ? factionColor : g.special ? '#FFD700' : '#6666AA',
                    }}>
                    {g.label}
                    {g.special && <span className="ml-1 text-[8px]" style={{ color: '#FFD700' }}>TITAN</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="font-display text-xs font-bold tracking-widest block mb-2" style={{ color: '#E8E8FF', letterSpacing: '4px' }}>DIFFICULTY</label>
              <div className="flex gap-2">
                {(['normal', 'hard', 'hardest'] as const).map(level => {
                  const colors = { normal: '#00FF88', hard: '#FF6B00', hardest: '#FF003C' };
                  const color = colors[level];
                  return (
                    <button key={level}
                      onClick={() => setDifficulty(level)}
                      className="px-4 py-2 flex-1 rounded font-display text-xs font-bold transition-all"
                      style={{
                        background: difficulty === level ? `${color}20` : '#0D0D1A',
                        color: difficulty === level ? color : '#6666AA',
                        border: `1px solid ${difficulty === level ? `${color}40` : '#1A1A2E'}`,
                      }}>
                      {level.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="font-body text-sm font-semibold block mb-2" style={{ color: '#6666AA' }}>Duel Type</label>
              <div className="flex gap-2">
                <button onClick={() => setDuelType('normal')}
                  className="px-4 py-2 rounded font-display text-xs font-bold"
                  style={{ background: duelType === 'normal' ? '#00C8FF20' : '#0D0D1A', border: `1px solid ${duelType === 'normal' ? '#00C8FF' : '#1A1A2E'}`, color: duelType === 'normal' ? '#00C8FF' : '#6666AA' }}>
                  NORMAL
                </button>
                <button onClick={() => setDuelType('death')}
                  className="px-4 py-2 rounded font-display text-xs font-bold flex items-center gap-1.5"
                  style={{ background: duelType === 'death' ? '#FF003C20' : '#0D0D1A', border: `1px solid ${duelType === 'death' ? '#FF003C' : '#1A1A2E'}`, color: duelType === 'death' ? '#FF003C' : '#6666AA' }}>
                  <Skull size={14} strokeWidth={1.5} /> DUEL TO DEATH
                </button>
              </div>
              {duelType === 'death' && (
                <p className="font-body text-xs mt-2 flex items-center gap-1" style={{ color: '#FF003C' }}>
                  <Skull size={10} /> Loser loses ALL points. Winner takes all. Both lose 50% as cost.
                </p>
              )}
            </div>

            <button onClick={startGame}
              className="w-full py-3 rounded-md font-display text-sm font-bold tracking-widest flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, #FF003C, #FF3366)`, color: '#030308', boxShadow: '0 0 30px rgba(255,0,60,0.3)' }}>
              <Swords size={18} strokeWidth={1.5} /> BEGIN BATTLE
            </button>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold tracking-widest mb-3" style={{ color: '#E8E8FF', letterSpacing: '4px' }}>OPEN CHALLENGES</h2>
            <div className="space-y-2">
              {openChallenges.map((u, i) => {
                const color = getFactionColor(u.anime);
                return (
                  <div key={u.id} className="flex items-center justify-between p-4 rounded-lg stagger-item"
                    style={{ animationDelay: `${i * 50}ms`, background: '#080812', border: `1px solid ${color}20` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold"
                        style={{ background: `${color}20`, border: `2px solid ${color}`, color }}>{u.username[0]}</div>
                      <div>
                        <span className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>{u.username}</span>
                        <span className="font-body text-xs ml-2" style={{ color: '#6666AA' }}>Rank #{u.rank}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.type === 'death' && <Skull size={14} strokeWidth={1.5} style={{ color: '#FF003C' }} />}
                      <button onClick={startGame} className="px-3 py-1 rounded font-display text-xs font-bold"
                        style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                        ACCEPT
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {section === 'dojo' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#00FF8820', border: '2px solid #00FF88' }}>
              <GraduationCap size={40} style={{ color: '#00FF88' }} />
            </div>
            <h2 className="font-['Orbitron'] text-2xl font-bold mb-2" style={{ color: '#00FF88' }}>DOJO TRAINING</h2>
            <p className="font-['Rajdhani'] text-sm" style={{ color: '#6666AA' }}>Master your skills and learn advanced techniques</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tutorial Mode */}
            <div className="p-6 rounded-lg" style={{ background: '#080812', border: '1px solid #00C8FF40' }}>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#00C8FF20', border: '2px solid #00C8FF' }}>
                <GraduationCap size={24} style={{ color: '#00C8FF' }} />
              </div>
              <h3 className="font-['Orbitron'] text-base font-bold text-center mb-2" style={{ color: '#00C8FF' }}>TUTORIAL</h3>
              <p className="font-['Rajdhani'] text-sm text-center mb-4" style={{ color: '#6666AA' }}>
                Learn the basics of Dot Wars. Perfect for beginners.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#00C8FF' }}>•</span> How to claim shapes
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#00C8FF' }}>•</span> Resource management
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#00C8FF' }}>•</span> Basic techniques
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#00C8FF' }}>•</span> Winning strategies
                </li>
              </ul>
              <div className="mb-3">
                <label className="block font-['Rajdhani'] text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>AI Opponent</label>
                <select
                  value={aiAnime}
                  onChange={(e) => setAiAnime(e.target.value as AnimeFaction)}
                  className="w-full p-2 rounded font-['Rajdhani'] text-sm"
                  style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #00C8FF40' }}
                >
                  {AI_ANIMES.map(anime => (
                    <option key={anime} value={anime}>{FACTION_NAMES[anime]}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => navigate('/game', { state: { p1Anime: currentUser?.anime || 'jjk', p2Anime: aiAnime, gridSize: 6, duelType: 'normal', shapeMode: 'square', difficulty: 'normal', mode: 'tutorial' } })}
                className="w-full py-3 rounded font-['Orbitron'] text-sm font-bold tracking-wider hover:brightness-110 transition-all"
                style={{ background: '#00C8FF20', color: '#00C8FF', border: '1px solid #00C8FF40' }}
              >
                START TUTORIAL
              </button>
            </div>

            {/* Practice Mode */}
            <div className="p-6 rounded-lg" style={{ background: '#080812', border: '1px solid #FFD70040' }}>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#FFD70020', border: '2px solid #FFD700' }}>
                <Target size={24} style={{ color: '#FFD700' }} />
              </div>
              <h3 className="font-['Orbitron'] text-base font-bold text-center mb-2" style={{ color: '#FFD700' }}>PRACTICE</h3>
              <p className="font-['Rajdhani'] text-sm text-center mb-4" style={{ color: '#6666AA' }}>
                Train against AI opponents. No risk, all reward.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#FFD700' }}>•</span> Choose difficulty level
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#FFD700' }}>•</span> Test new strategies
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#FFD700' }}>•</span> No points at stake
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#FFD700' }}>•</span> Unlimited attempts
                </li>
              </ul>
              <div className="mb-3">
                <label className="block font-['Rajdhani'] text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>AI Opponent</label>
                <select
                  value={aiAnime}
                  onChange={(e) => setAiAnime(e.target.value as AnimeFaction)}
                  className="w-full p-2 rounded font-['Rajdhani'] text-sm"
                  style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #FFD70040' }}
                >
                  {AI_ANIMES.map(anime => (
                    <option key={anime} value={anime}>{FACTION_NAMES[anime]}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => navigate('/game', { state: { p1Anime: currentUser?.anime || 'jjk', p2Anime: aiAnime, gridSize: 8, duelType: 'normal', shapeMode: 'square', difficulty: 'normal', mode: 'practice' } })}
                className="w-full py-3 rounded font-['Orbitron'] text-sm font-bold tracking-wider hover:brightness-110 transition-all"
                style={{ background: '#FFD70020', color: '#FFD700', border: '1px solid #FFD70040' }}
              >
                START PRACTICE
              </button>
            </div>

            {/* Master Mode */}
            <div className="p-6 rounded-lg" style={{ background: '#080812', border: '1px solid #FF003C40' }}>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#FF003C20', border: '2px solid #FF003C' }}>
                <Award size={24} style={{ color: '#FF003C' }} />
              </div>
              <h3 className="font-['Orbitron'] text-base font-bold text-center mb-2" style={{ color: '#FF003C' }}>MASTER</h3>
              <p className="font-['Rajdhani'] text-sm text-center mb-4" style={{ color: '#6666AA' }}>
                Face the ultimate challenge. Prove your mastery.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#FF003C' }}>•</span> Hardest AI difficulty
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#FF003C' }}>•</span> Advanced techniques
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#FF003C' }}>•</span> Earn mastery badges
                </li>
                <li className="font-['Rajdhani'] text-xs flex items-start gap-2" style={{ color: '#6666AA' }}>
                  <span style={{ color: '#FF003C' }}>•</span> Unlock achievements
                </li>
              </ul>
              <div className="mb-3">
                <label className="block font-['Rajdhani'] text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>AI Opponent</label>
                <select
                  value={aiAnime}
                  onChange={(e) => setAiAnime(e.target.value as AnimeFaction)}
                  className="w-full p-2 rounded font-['Rajdhani'] text-sm"
                  style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #FF003C40' }}
                >
                  {AI_ANIMES.map(anime => (
                    <option key={anime} value={anime}>{FACTION_NAMES[anime]}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => navigate('/game', { state: { p1Anime: currentUser?.anime || 'jjk', p2Anime: aiAnime, gridSize: 10, duelType: 'normal', shapeMode: 'square', difficulty: 'hardest', mode: 'master' } })}
                className="w-full py-3 rounded font-['Orbitron'] text-sm font-bold tracking-wider hover:brightness-110 transition-all"
                style={{ background: '#FF003C20', color: '#FF003C', border: '1px solid #FF003C40' }}
              >
                START MASTER
              </button>
            </div>
          </div>

          {/* Training Tips */}
          <div className="p-6 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
            <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider mb-4" style={{ color: '#E8E8FF', letterSpacing: '4px' }}>TRAINING TIPS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00FF8820', border: '1px solid #00FF88' }}>
                  <span className="font-['Orbitron'] text-xs font-bold" style={{ color: '#00FF88' }}>1</span>
                </div>
                <div>
                  <h4 className="font-['Rajdhani'] font-semibold text-sm mb-1" style={{ color: '#E8E8FF' }}>Start with Tutorial</h4>
                  <p className="font-['Rajdhani'] text-xs" style={{ color: '#6666AA' }}>Learn the fundamentals before jumping into competitive play</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00FF8820', border: '1px solid #00FF88' }}>
                  <span className="font-['Orbitron'] text-xs font-bold" style={{ color: '#00FF88' }}>2</span>
                </div>
                <div>
                  <h4 className="font-['Rajdhani'] font-semibold text-sm mb-1" style={{ color: '#E8E8FF' }}>Practice Regularly</h4>
                  <p className="font-['Rajdhani'] text-xs" style={{ color: '#6666AA' }}>Consistent practice builds muscle memory and strategic thinking</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00FF8820', border: '1px solid #00FF88' }}>
                  <span className="font-['Orbitron'] text-xs font-bold" style={{ color: '#00FF88' }}>3</span>
                </div>
                <div>
                  <h4 className="font-['Rajdhani'] font-semibold text-sm mb-1" style={{ color: '#E8E8FF' }}>Master Techniques</h4>
                  <p className="font-['Rajdhani'] text-xs" style={{ color: '#6666AA' }}>Each faction has unique techniques - learn when to use them</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00FF8820', border: '1px solid #00FF88' }}>
                  <span className="font-['Orbitron'] text-xs font-bold" style={{ color: '#00FF88' }}>4</span>
                </div>
                <div>
                  <h4 className="font-['Rajdhani'] font-semibold text-sm mb-1" style={{ color: '#E8E8FF' }}>Challenge Yourself</h4>
                  <p className="font-['Rajdhani'] text-xs" style={{ color: '#6666AA' }}>Push your limits with Master mode to become a true warrior</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {section === 'clanwar' && (
        <div className="text-center py-12">
          <Shield size={32} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: '#E8E8FF' }} />
          <h2 className="font-['Orbitron'] text-lg font-bold mb-3" style={{ color: '#E8E8FF' }}>CLAN WAR</h2>
          <p className="font-['Rajdhani'] text-sm mb-4" style={{ color: '#6666AA' }}>
            10v10 format. Your clan leader must select 10 fighters.
          </p>
          
          {!currentUser?.clanId ? (
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-lg mb-4" style={{ background: '#FF003C20', border: '1px solid #FF003C40' }}>
                <p className="font-['Rajdhani'] text-sm font-semibold" style={{ color: '#FF003C' }}>
                  You must join a clan before you can participate in clan wars.
                </p>
              </div>
              <button
                onClick={() => navigate('/clans')}
                className="px-6 py-3 rounded-md font-['Orbitron'] text-sm font-bold tracking-widest hover:brightness-110 transition-all"
                style={{ background: `${factionColor}20`, color: factionColor, border: `1px solid ${factionColor}40` }}
              >
                BROWSE CLANS
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                alert('Clan war matchmaking coming soon! Your clan will be matched with an opponent of similar strength.');
              }}
              className="px-6 py-3 rounded-md font-['Orbitron'] text-sm font-bold tracking-widest hover:brightness-110 transition-all"
              style={{ background: `${factionColor}20`, color: factionColor, border: `1px solid ${factionColor}40` }}
            >
              CHALLENGE A CLAN
            </button>
          )}
        </div>
      )}

      {section === 'dungeon' && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: '#080812', border: '2px solid #FF003C30', boxShadow: '0 0 20px rgba(255,0,60,0.2)' }}>
              <span className="font-display text-3xl font-black" style={{ color: '#FF003C', textShadow: '0 0 15px rgba(255,0,60,0.5)' }}>🏰</span>
            </div>
            <h2 className="font-display text-2xl font-bold mb-4" style={{ color: '#FF003C', textShadow: '0 0 20px rgba(255,0,60,0.3)' }}>DUNGEON RAIDS</h2>
            <p className="font-body text-lg mb-6" style={{ color: '#E8E8FF' }}>Coming Soon</p>
            <p className="font-body text-sm leading-relaxed" style={{ color: '#6666AA' }}>
              Gather your clan and prepare for epic dungeon raids. Face powerful enemies, 
              discover rare treasures, and earn legendary rewards. The darkness awaits...
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF003C', animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF003C', animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF003C', animationDelay: '400ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="rounded-lg w-full max-w-md p-6 relative" style={{ background: '#080812', border: '1px solid #2A2A4E', boxShadow: '0 0 30px rgba(0,0,0,0.8)' }}>
            <button onClick={() => setShowConfirm(false)} className="absolute top-4 right-4" style={{ color: '#6666AA' }}>
              <X size={20} />
            </button>
            <h2 className="font-display text-lg font-bold mb-2 flex items-center gap-2" style={{ color: '#E8E8FF' }}>
              <Swords size={18} style={{ color: '#FF003C' }} /> CHALLENGE PENDING
            </h2>
            <p className="font-body text-sm mb-6" style={{ color: '#6666AA' }}>
              Waiting for Player 2 ({p2Username}) to accept the settings and begin the duel.
            </p>
            
            <div className="space-y-3 mb-6 p-4 rounded bg-[#0D0D1A] border border-[#1A1A2E]">
              <div className="flex justify-between font-body text-sm">
                <span style={{ color: '#6666AA' }}>Battlefield:</span>
                <span className="font-bold" style={{ color: '#E8E8FF' }}>{gridSize}×{gridSize} {shapeMode.toUpperCase()}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span style={{ color: '#6666AA' }}>Duel Type:</span>
                <span className="font-bold" style={{ color: duelType === 'death' ? '#FF003C' : '#00C8FF' }}>{duelType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span style={{ color: '#6666AA' }}>Difficulty:</span>
                <span className="font-bold" style={{ color: difficulty === 'normal' ? '#00FF88' : difficulty === 'hard' ? '#FF6B00' : '#FF003C' }}>{difficulty.toUpperCase()}</span>
              </div>
            </div>

            <button onClick={confirmAndStart}
              className="w-full py-3 rounded-md font-display text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-transform hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${getFactionColor(p2Anime)}, ${getFactionGlow(p2Anime)})`, color: '#030308', boxShadow: `0 0 20px ${getFactionColor(p2Anime)}40` }}>
              <Play size={18} strokeWidth={2} /> P2 CONFIRM & PLAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleLobby;
