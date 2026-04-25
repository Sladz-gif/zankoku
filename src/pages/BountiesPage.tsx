import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Target, Clock, Users, Trophy } from 'lucide-react';
import { AnimeFaction, FACTION_NAMES } from '@/types/game';

interface Bounty {
  id: number;
  targetName: string;
  targetFaction: AnimeFaction;
  amount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  description: string;
  timeLeft: number;
  hunters: number;
}

const BountiesPage = () => {
  const { currentUser } = useGame();
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'extreme'>('all');

  const bounties: Bounty[] = [
    {
      id: 1,
      targetName: 'ShadowNinja',
      targetFaction: 'naruto',
      amount: 500,
      difficulty: 'medium',
      description: 'Eliminate the rogue ninja who has been terrorizing villages',
      timeLeft: 3600,
      hunters: 12
    },
    {
      id: 2,
      targetName: 'PhantomMage',
      targetFaction: 'jjk',
      amount: 1000,
      difficulty: 'hard',
      description: 'Capture the cursed sorcerer hiding in the abandoned temple',
      timeLeft: 7200,
      hunters: 8
    },
    {
      id: 3,
      targetName: 'PirateKing',
      targetFaction: 'onepiece',
      amount: 750,
      difficulty: 'medium',
      description: 'Defeat the pirate lord and claim his treasure',
      timeLeft: 1800,
      hunters: 15
    },
    {
      id: 4,
      targetName: 'HollowReaper',
      targetFaction: 'bleach',
      amount: 1500,
      difficulty: 'extreme',
      description: 'Survive the encounter with the soul reaper',
      timeLeft: 14400,
      hunters: 5
    }
  ];

  const filteredBounties = filter === 'all' 
    ? bounties 
    : bounties.filter(b => b.difficulty === filter);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#00FF88';
      case 'medium': return '#FFD700';
      case 'hard': return '#FF6B00';
      case 'extreme': return '#FF003C';
      default: return '#6666AA';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      <div className="page-title">BOUNTY BOARD</div>
      
      {/* Filter tabs */}
      <div className="page-tabs">
        {(['all', 'easy', 'medium', 'hard', 'extreme'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`page-tab-btn ${filter === f ? 'active' : ''}`}
          >
            {f === 'all' && <Target size={14} />}
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bounties grid */}
      <div className="bounties-grid">
        {filteredBounties.map(bounty => (
          <div key={bounty.id} className="bounty-card">
            <div className="bounty-card-header">
              <div className="bounty-target-info">
                <div className="bounty-target-name">{bounty.targetName}</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6666AA',
                  marginTop: '2px'
                }}>
                  {FACTION_NAMES[bounty.targetFaction]}
                </div>
              </div>
              <div className="bounty-amount">{bounty.amount}</div>
            </div>

            <div className="bounty-difficulty-badge" style={{ 
              background: getDifficultyColor(bounty.difficulty) + '20',
              color: getDifficultyColor(bounty.difficulty),
              borderColor: getDifficultyColor(bounty.difficulty) + '40'
            }}>
              {bounty.difficulty.toUpperCase()}
            </div>

            <p style={{ 
              fontSize: '13px', 
              color: '#E8E8FF', 
              lineHeight: '1.5',
              marginBottom: '12px'
            }}>
              {bounty.description}
            </p>

            <div className="bounty-countdown">
              <Clock size={14} />
              <span>{formatTime(bounty.timeLeft)}</span>
            </div>

            <div className="bounty-actions">
              <div style={{ 
                fontSize: '11px', 
                color: '#6666AA',
                marginBottom: '8px'
              }}>
                <Users size={12} style={{ marginRight: '4px' }} />
                {bounty.hunters} hunters
              </div>
              <button className="bounty-hunt-btn">
                HUNT TARGET
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BountiesPage;
