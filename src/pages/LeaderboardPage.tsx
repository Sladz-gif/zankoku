import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { AnimeFaction, FACTION_NAMES } from '@/types/game';
import { Trophy, TrendingUp, Target, Coins, Star, Skull, Shield, ArrowUp, ArrowDown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  value: number | string;
  color: string;
  flag?: string;
  rankChange?: number;
  tier?: string;
  isCurrentUser?: boolean;
}

const LeaderboardPage = () => {
  const { currentUser } = useGame();
  const [tab, setTab] = useState<'global' | 'bounty' | 'wins' | 'points'>('global');

  const globalLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      username: 'DragonSlayer99',
      value: 15420,
      color: '#FFD700',
      tier: 'DIAMOND',
      rankChange: 0,
      isCurrentUser: currentUser?.username === 'DragonSlayer99'
    },
    {
      rank: 2,
      username: 'NinjaMaster',
      value: 14850,
      color: '#C0C0C0',
      tier: 'PLATINUM',
      rankChange: 1,
      isCurrentUser: currentUser?.username === 'NinjaMaster'
    },
    {
      rank: 3,
      username: 'PirateKing',
      value: 13920,
      color: '#CD7F32',
      tier: 'GOLD',
      rankChange: -1,
      isCurrentUser: currentUser?.username === 'PirateKing'
    },
    {
      rank: 4,
      username: 'CursedSorcerer',
      value: 12500,
      color: '#FF8C00',
      rankChange: 2,
      isCurrentUser: currentUser?.username === 'CursedSorcerer'
    },
    {
      rank: 5,
      username: 'ShadowWarrior',
      value: 11200,
      color: '#8B4513',
      rankChange: -1,
      isCurrentUser: currentUser?.username === 'ShadowWarrior'
    }
  ];

  const bountyLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      username: 'BountyHunter',
      value: '47 claimed',
      color: '#FF6B00',
      isCurrentUser: currentUser?.username === 'BountyHunter'
    },
    {
      rank: 2,
      username: 'TargetEliminator',
      value: '32 claimed',
      color: '#FFD700',
      isCurrentUser: currentUser?.username === 'TargetEliminator'
    },
    {
      rank: 3,
      username: 'PhantomSlayer',
      value: '28 claimed',
      color: '#FF8C00',
      isCurrentUser: currentUser?.username === 'PhantomSlayer'
    }
  ];

  const winsLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      username: 'ChampionX',
      value: 342,
      color: '#FFD700',
      isCurrentUser: currentUser?.username === 'ChampionX'
    },
    {
      rank: 2,
      username: 'WarriorKing',
      value: 289,
      color: '#C0C0C0',
      isCurrentUser: currentUser?.username === 'WarriorKing'
    },
    {
      rank: 3,
      username: 'NinjaLegend',
      value: 267,
      color: '#CD7F32',
      isCurrentUser: currentUser?.username === 'NinjaLegend'
    }
  ];

  const pointsLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      username: 'PointMaster',
      value: 45800,
      color: '#FFD700',
      isCurrentUser: currentUser?.username === 'PointMaster'
    },
    {
      rank: 2,
      username: 'CoinCollector',
      value: 38900,
      color: '#C0C0C0',
      isCurrentUser: currentUser?.username === 'CoinCollector'
    },
    {
      rank: 3,
      username: 'ScoreChaser',
      value: 32100,
      color: '#CD7F32',
      isCurrentUser: currentUser?.username === 'ScoreChaser'
    }
  ];

  const getCurrentLeaderboard = () => {
    switch (tab) {
      case 'global': return globalLeaderboard;
      case 'bounty': return bountyLeaderboard;
      case 'wins': return winsLeaderboard;
      case 'points': return pointsLeaderboard;
      default: return globalLeaderboard;
    }
  };

  const currentLeaderboard = getCurrentLeaderboard();

  return (
    <div className="page-container">
      <div className="page-title">LEADERBOARD</div>
      
      {/* Tabs */}
      <div className="page-tabs">
        {(['global', 'bounty', 'wins', 'points'] as const).map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`page-tab-btn ${tab === t ? 'active' : ''}`}
          >
            {t === 'global' && <Trophy size={14} />}
            {t === 'bounty' && <Target size={14} />}
            {t === 'wins' && <TrendingUp size={14} />}
            {t === 'points' && <Coins size={14} />}
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="leaderboard-rank">RANK</th>
            <th className="leaderboard-user">USER</th>
            <th className="leaderboard-stat">STAT</th>
          </tr>
        </thead>
        <tbody>
          {currentLeaderboard.map((entry, i) => (
            <tr key={entry.username} className={`leaderboard-row ${entry.isCurrentUser ? 'current-user' : ''}`}>
              <td className="leaderboard-rank">{entry.rank}</td>
              <td className="leaderboard-user">
                <div className="leaderboard-username">{entry.username}</div>
              </td>
              <td className="leaderboard-stat">{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="leaderboard-cards-list">
        {currentLeaderboard.map((entry, i) => (
          <div key={entry.username} className={`leaderboard-row ${entry.isCurrentUser ? 'current-user' : ''}`}>
            <div className="leaderboard-rank">{entry.rank}</div>
            <div className="leaderboard-user">
              <div className="leaderboard-username">{entry.username}</div>
            </div>
            <div className="leaderboard-stat">{entry.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
