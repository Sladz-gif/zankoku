import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { Swords, Shield, Users, Search, Filter, UserPlus, UserMinus, AlertTriangle, CheckCircle, X, Play, School, ChevronLeft } from 'lucide-react';

const BattleLobby = () => {
  const navigate = useNavigate();
  const { users, currentUser } = useGame();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpponent, setSelectedOpponent] = useState<number | null>(null);
  const [duelType, setDuelType] = useState<'dot'>('dot');
  const [isSearching, setIsSearching] = useState(false);

  const filteredUsers = users.filter(user => 
    user?.id !== currentUser?.id &&
    user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const handleStartBattle = () => {
    if (selectedOpponent) {
      navigate(`/game?opponent=${selectedOpponent}&type=${duelType}`);
    }
  };

  const handleSelectOpponent = (userId: number) => {
    setSelectedOpponent(userId);
  };

  return (
    <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 bg-[#1A1A2E] text-[#E8E8FF] rounded-lg hover:bg-[#2A2A4E] transition-all border border-[#333355]"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h1 className="text-3xl font-bold font-orbitron">BATTLE LOBBY</h1>
          
          <div className="w-40"></div> {/* Spacer for centering */}
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333355]" />
          <input
            type="text"
            placeholder="Search for opponents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#080812] border border-[#1A1A2E] rounded-lg text-[#E8E8FF] placeholder-[#333355] focus:outline-none focus:border-[#8B00FF] transition-colors"
          />
        </div>

        {/* Battle Type Selection */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold font-orbitron text-[#8B00FF]">BATTLE TYPE</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => setDuelType('dot')}
              className={`p-6 rounded-lg border-2 transition-all h-full min-h-[140px] ${
                duelType === 'dot' 
                  ? 'border-[#8B00FF] bg-[#8B00FF]/10' 
                  : 'border-[#1A1A2E] bg-[#080812] hover:border-[#2A2A4E]'
              }`}
            >
              <div className="text-lg font-bold font-orbitron mb-2">DOT WARS</div>
              <div className="text-sm text-[#6666AA]">Classic grid-based combat</div>
            </button>
            <div className="p-6 rounded-lg border-2 border-[#1A1A2E] bg-[#080812] opacity-60 cursor-not-allowed h-full min-h-[140px] flex flex-col justify-between">
              <div>
                <div className="text-lg font-bold font-orbitron mb-2 text-[#6666AA]">TRIANGLE DUEL</div>
                <div className="text-sm text-[#6666AA]">Strategic triangle battles</div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD700]/20 border border-[#FFD700]/30 rounded-full">
                <span className="text-xs font-medium text-[#FFD700]">COMING SOON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Training Dojo */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold font-orbitron text-[#00C8FF]">TRAINING DOJO</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/dojo')}
              className="w-full p-6 bg-[#080812] border-2 border-[#1A1A2E] rounded-lg hover:border-[#00C8FF] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00C8FF]/20 flex items-center justify-center group-hover:bg-[#00C8FF]/30 transition-colors">
                  <School size={24} className="text-[#00C8FF]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-lg font-bold font-orbitron text-[#E8E8FF] mb-1">Enter Training Dojo</div>
                  <div className="text-sm text-[#6666AA]">Master combat techniques and improve your skills</div>
                </div>
                <div className="text-[#00C8FF] group-hover:text-[#40E0FF] transition-colors">
                  <Play size={20} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Online Players */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-orbitron">ONLINE PLAYERS</h2>
            <span className="text-[#6666AA]">{filteredUsers.length} available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => {
              const isSelected = selectedOpponent === user.id;
              const userColor = getFactionColor(user.anime);
              
              return (
                <div 
                  key={user.id}
                  className={`bg-[#080812] border rounded-lg p-4 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-[#8B00FF] shadow-[0_0_16px_rgba(139,0,255,0.3)]' 
                      : 'border-[#1A1A2E] hover:border-[#2A2A4E]'
                  }`}
                  onClick={() => handleSelectOpponent(user.id)}
                >
                  {/* Player Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2"
                        style={{ 
                          background: `${userColor}20`, 
                          color: userColor,
                          borderColor: userColor
                        }}
                      >
                        {user.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-[#E8E8FF] text-sm">{user.username}</div>
                        <div className="text-xs text-[#6666AA]">{user.anime}</div>
                      </div>
                    </div>
                    <div className="text-xs text-[#6666AA]">
                      Rank {user.rank || 0}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-around mb-3 py-2 border-t border-[#1A1A2E]">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#E8E8FF]">{user.duelsWon || 0}</div>
                      <div className="text-xs text-[#6666AA]">WINS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#E8E8FF]">{user.duelsLost || 0}</div>
                      <div className="text-xs text-[#6666AA]">LOSSES</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#E8E8FF]">
                        {user.duelsWon + user.duelsLost > 0 ? 
                          Math.round((user.duelsWon / (user.duelsWon + user.duelsLost)) * 100) : 0}%
                      </div>
                      <div className="text-xs text-[#6666AA]">WIN RATE</div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleStartBattle();
                        }}
                        className="w-full px-3 py-2 bg-gradient-to-r from-[#8B00FF] to-[#5500CC] text-white rounded-lg font-medium text-xs hover:shadow-[0_0_16px_rgba(139,0,255,0.5)] transition-all"
                      >
                        BATTLE
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Opponent Panel */}
        {selectedOpponent && (() => {
          const opponent = users.find(u => u.id === selectedOpponent);
          if (!opponent) return null;
          
          const opponentColor = getFactionColor(opponent.anime);
          
          return (
            <div className="fixed bottom-6 right-6 bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 shadow-xl max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2"
                  style={{ 
                    background: `${opponentColor}20`, 
                    color: opponentColor,
                    borderColor: opponentColor
                  }}
                >
                  {opponent.username?.[0]?.toUpperCase() || '?'}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-[#E8E8FF]">{opponent.username}</div>
                  <div className="text-sm text-[#6666AA]">{opponent.anime} · Rank {opponent.rank || 0}</div>
                  <div className="text-sm text-[#6666AA]">
                    {opponent.duelsWon || 0}W - {opponent.duelsLost || 0}L
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleStartBattle}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#8B00FF] to-[#5500CC] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_16px_rgba(139,0,255,0.5)] transition-all"
              >
                START BATTLE
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default BattleLobby;
