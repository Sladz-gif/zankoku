import { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { RankingSystem, RankingResult } from '@/lib/rankingSystem';
import { FACTION_NAMES, ZankokuUser } from '@/types/game';
import { Trophy, TrendingUp, Target, Coins, Star, Skull, Shield, ArrowUp, ArrowDown, Minus } from 'lucide-react';

type LeaderboardTab = 'global' | 'bounty' | 'gamblers' | 'clans' | 'shame' | 'country';

const Leaderboard = () => {
  const { users, clans = [], currentUser } = useGame();
  const [tab, setTab] = useState<LeaderboardTab>('global');

  const allUsers = currentUser ? [currentUser, ...users.filter(u => u.id !== currentUser.id)] : users;

  // Calculate rankings using the new system
  const rankings = useMemo(() => RankingSystem.calculateRankings(allUsers), [allUsers]);

  const getSorted = (): { name: string; value: number | string; color: string; extra?: string; flag?: string; rankChange?: number; tier?: string }[] => {
    switch (tab) {
      case 'global':
        return rankings.map(r => ({
          name: r.user.username,
          value: r.user.points,
          color: getFactionColor(r.user.anime),
          extra: `${r.tier.icon} ${r.tier.name}`,
          flag: r.user.countryFlag,
          rankChange: r.rankChange,
          tier: r.tier.name
        }));
      case 'bounty':
        return [...allUsers].sort((a, b) => b.bountiesClaimed - a.bountiesClaimed).map(u => ({ 
          name: u.username, 
          value: `${u.bountiesClaimed} claimed`, 
          color: getFactionColor(u.anime), 
          flag: u.countryFlag 
        }));
      case 'gamblers':
        return [...allUsers].filter(u => u.roleTag === 'GAMBLER' || u.currency.gold > 50).sort((a, b) => b.currency.gold - a.currency.gold).map(u => ({ 
          name: u.username, 
          value: `${u.currency.gold} Gold`, 
          color: '#FFD700', 
          flag: u.countryFlag 
        }));
      case 'shame':
        return [...allUsers].filter(u => u.cowardStars > 0).sort((a, b) => b.cowardStars - a.cowardStars).map(u => ({ 
          name: u.username, 
          value: `${u.cowardStars} stars`, 
          color: '#FF003C', 
          flag: u.countryFlag 
        }));
      case 'clans':
        return clans.sort((a, b) => b.wins - a.wins).map(c => ({ 
          name: c.name, 
          value: `${c.wins}W / ${c.losses}L`, 
          color: '#8B00FF' 
        }));
      case 'country': {
        const byCountry: Record<string, { flag: string; total: number; count: number }> = {};
        allUsers.forEach(u => {
          if (u.country && u.countryFlag) {
            if (!byCountry[u.country]) byCountry[u.country] = { flag: u.countryFlag, total: 0, count: 0 };
            byCountry[u.country].total += u.points;
            byCountry[u.country].count++;
          }
        });
        return Object.entries(byCountry).sort((a, b) => b[1].total - a[1].total).map(([name, d]) => ({
          name, value: `${d.total} pts (${d.count} fighters)`, color: '#00C8FF', flag: d.flag,
        }));
      }
      default:
        return [];
    }
  };

  const rows = getSorted();
  const glowColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  const tabs: [LeaderboardTab, string, any][] = [
    ['global', 'Global', TrendingUp],
    ['bounty', 'Bounty Hunters', Target],
    ['gamblers', 'Gamblers', Coins],
    ['clans', 'Clan Wars', Shield],
    ['country', 'By Country', Trophy],
    ['shame', 'Shame', Skull],
  ];

  return (
    <div className="page-enter max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3 mb-6" style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
        <Trophy size={22} strokeWidth={1.5} /> LEADERBOARD
      </h1>

      <div className="flex gap-3 flex-wrap border-b mb-6" style={{ borderColor: '#1A1A2E' }}>
        {tabs.map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="pb-2 font-body text-sm font-semibold flex items-center gap-1.5"
            style={{ color: tab === k ? '#FFD700' : '#6666AA', borderBottom: tab === k ? '2px solid #FFD700' : '2px solid transparent' }}>
            <Icon size={14} strokeWidth={1.5} /> {l}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => {
          const getRankChangeIcon = () => {
            if (!row.rankChange) return <Minus size={12} className="text-gray-500" />;
            if (row.rankChange > 0) return <ArrowUp size={12} className="text-green-400" />;
            return <ArrowDown size={12} className="text-red-400" />;
          };

          const getTierColor = (tierName?: string) => {
            if (!tierName) return '#666666';
            const tier = rankings.find(r => r.tier.name === tierName)?.tier;
            return tier?.color || '#666666';
          };

          return (
            <div key={row.name + i} className="flex items-center gap-4 p-4 rounded-lg stagger-item"
              style={{
                animationDelay: `${i * 30}ms`,
                background: i < 3 ? `${glowColors[i]}08` : '#080812',
                border: `1px solid ${i < 3 ? `${glowColors[i]}30` : '#1A1A2E'}`,
                boxShadow: i < 3 ? `0 0 15px ${glowColors[i]}15` : 'none',
              }}>
              <span className="font-display text-lg font-bold w-8 text-center" style={{ color: i < 3 ? glowColors[i] : '#333355' }}>
                {i + 1}
              </span>
              
              {/* Rank Change Indicator */}
              {tab === 'global' && row.rankChange !== undefined && (
                <div className="flex items-center justify-center w-6">
                  {getRankChangeIcon()}
                  {Math.abs(row.rankChange) > 0 && (
                    <span className="text-xs ml-1" style={{ color: row.rankChange > 0 ? '#4ADE80' : '#F87171' }}>
                      {Math.abs(row.rankChange)}
                    </span>
                  )}
                </div>
              )}
              
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold"
                style={{ background: `${row.color}20`, border: `2px solid ${row.color}`, color: row.color }}>
                {row.name[0]}
              </div>
              <div className="flex-1">
                <span className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>
                  {row.flag && <span className="mr-1">{row.flag}</span>}
                  {row.name}
                </span>
                {row.extra && (
                  <span 
                    className="font-body text-xs ml-2 px-2 py-0.5 rounded" 
                    style={{ 
                      color: getTierColor(row.tier), 
                      background: `${getTierColor(row.tier)}20`,
                      border: `1px solid ${getTierColor(row.tier)}40`
                    }}
                  >
                    {row.extra}
                  </span>
                )}
              </div>
              <span className="font-display text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
