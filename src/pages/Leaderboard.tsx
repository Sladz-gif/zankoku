import { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { RankingSystem, RankingResult } from '@/lib/rankingSystem';
import { FACTION_NAMES, ZankokuUser } from '@/types/game';
import { Trophy, TrendingUp, Target, Coins, Star, Skull, Shield, ArrowUp, ArrowDown, Minus, Crown, Medal, Award } from 'lucide-react';

type LeaderboardTab = 'global' | 'bounty' | 'gamblers' | 'clans' | 'shame' | 'country';

const Leaderboard = () => {
  const { users, clans = [], currentUser } = useGame();
  const [tab, setTab] = useState<LeaderboardTab>('global');

  const allUsers = currentUser ? [currentUser, ...users.filter(u => u.id !== currentUser.id)] : users;

  // Calculate rankings using the new system
  const rankings = useMemo(() => RankingSystem.calculateRankings(allUsers), [allUsers]);

  const getTopPlayers = () => {
    return rankings.slice(0, 10).map((r, index) => ({
      rank: index + 1,
      username: r.user.username,
      points: r.user.points,
      wins: r.user.duelsWon || 0,
      losses: r.user.duelsLost || 0,
      winRate: r.user.duelsWon + r.user.duelsLost > 0 ? 
        Math.round((r.user.duelsWon / (r.user.duelsWon + r.user.duelsLost)) * 100) : 0,
      faction: r.user.anime,
      color: getFactionColor(r.user.anime),
      tier: r.tier.name,
      rankChange: r.rankChange
    }));
  };

  const topPlayers = getTopPlayers();

  const tabs: [LeaderboardTab, string, any][] = [
    ['global', 'Global', TrendingUp],
    ['bounty', 'Bounty Hunters', Target],
    ['gamblers', 'Gamblers', Coins],
    ['clans', 'Clan Wars', Shield],
    ['country', 'By Country', Trophy],
    ['shame', 'Shame', Skull],
  ];

  return (
    <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-orbitron text-[#FFD700] mb-2">LEADERBOARD</h1>
          <p className="text-[#6666AA]">Top ranked players in the Zankoku universe</p>
        </div>

        {/* Top 3 Players */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {topPlayers.slice(0, 3).map((player, index) => (
            <div key={player.rank} className="text-center">
              {/* Rank Badge */}
              <div className="mb-4">
                {player.rank === 1 && (
                  <div className="w-20 h-20 rounded-full bg-[#FFD700]/20 flex items-center justify-center mx-auto border-4 border-[#FFD700]">
                    <Crown size={32} className="text-[#FFD700]" />
                  </div>
                )}
                {player.rank === 2 && (
                  <div className="w-20 h-20 rounded-full bg-[#C0C0C0]/20 flex items-center justify-center mx-auto border-4 border-[#C0C0C0]">
                    <Medal size={32} className="text-[#C0C0C0]" />
                  </div>
                )}
                {player.rank === 3 && (
                  <div className="w-20 h-20 rounded-full bg-[#CD7F32]/20 flex items-center justify-center mx-auto border-4 border-[#CD7F32]">
                    <Award size={32} className="text-[#CD7F32]" />
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 mx-auto mb-3"
                  style={{ 
                    background: `${player.color}20`, 
                    borderColor: player.color,
                    color: player.color
                  }}
                >
                  {player.username[0]?.toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-[#E8E8FF] mb-1">{player.username}</h3>
                <div className="text-sm text-[#6666AA] mb-4">{player.faction}</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6666AA]">Points</span>
                    <span className="text-[#E8E8FF] font-medium">{player.points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6666AA]">Win Rate</span>
                    <span className="text-[#E8E8FF] font-medium">{player.winRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6666AA]">W/L</span>
                    <span className="text-[#E8E8FF] font-medium">{player.wins}/{player.losses}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Rankings */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6">
          <h2 className="text-xl font-bold font-orbitron mb-6">FULL RANKINGS</h2>
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#1A1A2E] text-xs font-medium text-[#6666AA]">
            <div className="col-span-1">RANK</div>
            <div className="col-span-4">PLAYER</div>
            <div className="col-span-2">FACTION</div>
            <div className="col-span-2 text-center">WIN RATE</div>
            <div className="col-span-1 text-center">WINS</div>
            <div className="col-span-1 text-center">LOSSES</div>
            <div className="col-span-1 text-center">POINTS</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {topPlayers.map((player) => (
              <div key={player.rank} className="grid grid-cols-12 gap-4 py-3 border-b border-[#1A1A2E]/50 items-center">
                <div className="col-span-1">
                  <span className={`font-bold ${
                    player.rank === 1 ? 'text-[#FFD700]' :
                    player.rank === 2 ? 'text-[#C0C0C0]' :
                    player.rank === 3 ? 'text-[#CD7F32]' :
                    'text-[#6666AA]'
                  }`}>
                    #{player.rank}
                  </span>
                </div>
                
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2"
                      style={{ 
                        background: `${player.color}20`, 
                        borderColor: player.color,
                        color: player.color
                      }}
                    >
                      {player.username[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[#E8E8FF]">{player.username}</span>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className="text-sm text-[#6666AA]">{player.faction}</span>
                </div>
                
                <div className="col-span-2 text-center">
                  <span className="text-sm text-[#E8E8FF]">{player.winRate}%</span>
                </div>
                
                <div className="col-span-1 text-center">
                  <span className="text-sm text-[#E8E8FF]">{player.wins}</span>
                </div>
                
                <div className="col-span-1 text-center">
                  <span className="text-sm text-[#E8E8FF]">{player.losses}</span>
                </div>
                
                <div className="col-span-1 text-center">
                  <span className="text-sm font-medium text-[#E8E8FF]">{player.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
