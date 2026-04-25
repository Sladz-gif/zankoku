import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { AnimeFaction, FACTION_NAMES } from '@/types/game';
import { Shield, Users, Trophy, Plus } from 'lucide-react';

interface Clan {
  id: number;
  name: string;
  tag: string;
  primaryAnime: AnimeFaction;
  members: number;
  wins: number;
  losses: number;
  joinType: 'open' | 'approval' | 'invite';
}

const ClansPage = () => {
  const { currentUser } = useGame();
  const [search, setSearch] = useState('');

  const clans: Clan[] = [
    {
      id: 1,
      name: 'Shadow Warriors',
      tag: 'SW',
      primaryAnime: 'naruto',
      members: 45,
      wins: 125,
      losses: 23,
      joinType: 'open'
    },
    {
      id: 2,
      name: 'Cursed Society',
      tag: 'CS',
      primaryAnime: 'jjk',
      members: 32,
      wins: 89,
      losses: 41,
      joinType: 'approval'
    },
    {
      id: 3,
      name: 'Pirate Lords',
      tag: 'PL',
      primaryAnime: 'onepiece',
      members: 67,
      wins: 234,
      losses: 78,
      joinType: 'open'
    },
    {
      id: 4,
      name: 'Soul Reapers',
      tag: 'SR',
      primaryAnime: 'bleach',
      members: 28,
      wins: 156,
      losses: 34,
      joinType: 'invite'
    },
    {
      id: 5,
      name: 'Dragon Fist',
      tag: 'DF',
      primaryAnime: 'dragonball',
      members: 51,
      wins: 198,
      losses: 45,
      joinType: 'open'
    },
    {
      id: 6,
      name: 'Demon Slayers',
      tag: 'DS',
      primaryAnime: 'demonslayer',
      members: 39,
      wins: 167,
      losses: 29,
      joinType: 'approval'
    }
  ];

  const filteredClans = clans.filter(clan => 
    clan.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-title">CLANS</div>
      
      {/* Search bar */}
      <div className="content-card">
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clans..."
          className="w-full p-3 rounded border"
        />
      </div>

      {/* Clan cards grid */}
      <div className="clans-grid">
        {filteredClans.map(clan => {
          const clanColor = getFactionColor(clan.primaryAnime);
          return (
            <div key={clan.id} className="clan-card">
              <div className="clan-card-accent" style={{ background: clanColor }}></div>
              <div className="clan-card-body">
                <h3 className="clan-name">{clan.name}</h3>
                <div className="clan-tag">[{clan.tag}]</div>
                
                <div className="clan-stats">
                  <div className="clan-stat">
                    <Users size={12} />
                    <span>{clan.members}</span>
                  </div>
                  <div className="clan-stat">
                    <Trophy size={12} />
                    <span>{clan.wins}W / {clan.losses}L</span>
                  </div>
                </div>

                <button 
                  className="clan-join-btn"
                  disabled={!!currentUser?.clanId}
                >
                  {clan.joinType === 'invite' ? 'INVITE ONLY' : clan.joinType === 'approval' ? 'REQUEST TO JOIN' : 'JOIN CLAN'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create clan button */}
      {currentUser && !currentUser.clanId && (
        <button 
          className="clan-join-btn"
          style={{ marginTop: '24px' }}
        >
          <Plus size={16} style={{ marginRight: '8px' }} />
          CREATE CLAN
        </button>
      )}
    </div>
  );
};

export default ClansPage;
