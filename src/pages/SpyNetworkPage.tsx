import { useState } from 'react';
import { Eye, Shield, AlertTriangle, Clock, Target, Users } from 'lucide-react';

interface SpyMission {
  id: number;
  targetClan: string;
  targetFaction: string;
  missionType: 'infiltrate' | 'sabotage' | 'gather_intel' | 'assassinate';
  difficulty: 'low' | 'medium' | 'high' | 'critical';
  reward: number;
  timeLimit: number;
  description: string;
  requirements: string[];
  riskLevel: number;
}

const SpyNetworkPage = () => {
  const [missions, setMissions] = useState<SpyMission[]>([
    {
      id: 1,
      targetClan: 'Shadow Warriors',
      targetFaction: 'Naruto',
      missionType: 'infiltrate',
      difficulty: 'medium',
      reward: 500,
      timeLimit: 72,
      description: 'Infiltrate the Shadow Warriors clan headquarters and gather intelligence on their upcoming battle strategies.',
      requirements: ['Rank 15+', 'Stealth skill 50+', 'No active clan affiliation'],
      riskLevel: 65
    },
    {
      id: 2,
      targetClan: 'Cursed Society',
      targetFaction: 'JJK',
      missionType: 'sabotage',
      difficulty: 'high',
      reward: 1200,
      timeLimit: 96,
      description: 'Sabotage the Cursed Society\'s technique vault and destroy their forbidden scrolls.',
      requirements: ['Rank 25+', 'Explosives skill 30+', 'Shadow Clan affiliation'],
      riskLevel: 85
    },
    {
      id: 3,
      targetClan: 'Pirate Lords',
      targetFaction: 'One Piece',
      missionType: 'gather_intel',
      difficulty: 'low',
      reward: 200,
      timeLimit: 48,
      description: 'Gather intelligence on the Pirate Lords\' treasure locations and trade routes.',
      requirements: ['Rank 10+', 'Observation skill 40+'],
      riskLevel: 35
    },
    {
      id: 4,
      targetClan: 'Dragon Fist',
      targetFaction: 'Dragon Ball',
      missionType: 'assassinate',
      difficulty: 'critical',
      reward: 3000,
      timeLimit: 120,
      description: 'Eliminate the Dragon Fist clan leader during their annual tournament.',
      requirements: ['Rank 30+', 'Assassination skill 80+', 'Stealth skill 70+'],
      riskLevel: 95
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return '#00FF88';
      case 'medium': return '#FFD700';
      case 'high': return '#FF6B00';
      case 'critical': return '#FF003C';
      default: return '#6666AA';
    }
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel < 40) return '#00FF88';
    if (riskLevel < 70) return '#FFD700';
    if (riskLevel < 90) return '#FF6B00';
    return '#FF003C';
  };

  const executeMission = (missionId: number) => {
    alert(`Mission ${missionId} execution initiated! This feature is coming soon.`);
  };

  return (
    <div className="spy-page">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Eye size={32} style={{ color: 'var(--neon-purple)' }} />
          <h1 style={{ 
            fontFamily: 'Orbitron, monospace', 
            fontSize: '28px', 
            fontWeight: '900', 
            letterSpacing: '3px',
            color: 'var(--text-primary)',
            textTransform: 'uppercase'
          }}>
            SPY NETWORK
          </h1>
        </div>
        <p style={{ 
          fontFamily: 'Rajdhani, sans-serif', 
          fontSize: '16px', 
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          lineHeight: '1.5'
        }}>
          Top-secret missions for elite operatives. High risk, high reward.
        </p>
      </div>

      {missions.length === 0 ? (
        <div className="empty-state">
          <Eye size={48} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <div className="empty-state-title">NO MISSIONS AVAILABLE</div>
          <div className="empty-state-body">
            Check back later for new spy missions from headquarters.
          </div>
        </div>
      ) : (
        <div className="spy-missions-grid">
          {missions.map(mission => (
            <div key={mission.id} className="mission-card">
              <div className="mission-card-header">
                <div>
                  <div className="mission-clan-name">{mission.targetClan}</div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-muted)', 
                    marginTop: '2px' 
                  }}>
                    {mission.targetFaction} Faction
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '10px', 
                  fontWeight: '700',
                  background: getDifficultyColor(mission.difficulty) + '20',
                  color: getDifficultyColor(mission.difficulty),
                  textTransform: 'uppercase'
                }}>
                  {mission.difficulty}
                </div>
              </div>

              <div style={{ 
                fontSize: '14px', 
                color: 'var(--text-primary)', 
                lineHeight: '1.5',
                marginBottom: '16px'
              }}>
                {mission.description}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'var(--text-muted)', 
                  marginBottom: '4px' 
                }}>
                  REQUIREMENTS:
                </div>
                {mission.requirements.map((req, index) => (
                  <div key={index} style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '2px',
                    paddingLeft: '8px'
                  }}>
                    • {req}
                  </div>
                ))}
              </div>

              <div className="mission-risk-bar">
                <div 
                  className="mission-risk-fill"
                  style={{ 
                    width: `${mission.riskLevel}%`,
                    background: getRiskColor(mission.riskLevel)
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {mission.timeLimit}h
                  </span>
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '700',
                  color: 'var(--neon-gold)',
                  fontFamily: 'Orbitron, monospace'
                }}>
                  {mission.reward} Gold
                </div>
              </div>

              <button 
                onClick={() => executeMission(mission.id)}
                className="mission-execute-btn"
              >
                EXECUTE MISSION
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpyNetworkPage;
