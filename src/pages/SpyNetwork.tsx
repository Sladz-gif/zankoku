import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { Eye, EyeOff, AlertTriangle, Coins } from 'lucide-react';

const SpyNetwork = () => {
  const { spyMissions, clans, currentUser } = useGame();
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';
  const [result, setResult] = useState<string | null>(null);

  const attemptMission = (missionId: number) => {
    const mission = spyMissions.find(m => m.id === missionId);
    if (!mission) return;
    const success = Math.random() * 100 > mission.riskLevel;
    setResult(success
      ? `Mission successful! Intel gathered: ${mission.intelType}. +15 Bronze earned.`
      : `You were caught! A bounty has been placed on your head by the target clan.`
    );
    setTimeout(() => setResult(null), 5000);
  };

  return (
    <div className="page-enter max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3 mb-6" style={{ color: '#E8E8FF' }}>
        <Eye size={22} strokeWidth={1.5} /> SPY NETWORK
      </h1>

      {result && (
        <div className="p-4 rounded-lg mb-6 flex items-center gap-2"
          style={{ background: result.includes('successful') ? '#00FF8810' : '#FF003C10', border: `1px solid ${result.includes('successful') ? '#00FF8840' : '#FF003C40'}` }}>
          {result.includes('caught') ? <EyeOff size={16} style={{ color: '#FF003C' }} /> : <Eye size={16} style={{ color: '#00FF88' }} />}
          <p className="font-body text-sm" style={{ color: result.includes('successful') ? '#00FF88' : '#FF003C' }}>{result}</p>
        </div>
      )}

      <div className="space-y-3">
        {spyMissions.map((m, i) => {
          const clan = clans.find(c => c.id === m.targetClanId);
          return (
            <div key={m.id} className="p-5 rounded-lg stagger-item"
              style={{ animationDelay: `${i * 50}ms`, background: '#080812', border: '1px solid #1A1A2E' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wider mb-1" style={{ color: '#E8E8FF' }}>
                    Infiltrate: {clan?.name || 'Unknown Clan'}
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    <span className="font-body text-xs" style={{ color: '#6666AA' }}>Intel: {m.intelType}</span>
                    <span className="font-body text-xs" style={{ color: '#FFD700' }}>Difficulty: {m.difficulty}</span>
                    <span className="font-body text-xs flex items-center gap-1" style={{ color: '#FF003C' }}>
                      <AlertTriangle size={10} strokeWidth={1.5} /> Risk: {m.riskLevel}%
                    </span>
                    <span className="font-body text-xs flex items-center gap-1" style={{ color: '#00FF88' }}>
                      <Coins size={10} strokeWidth={1.5} style={{ color: m.costCurrency === 'bronze' ? '#CD7F32' : '#C0C0C0' }} />
                      {m.cost} {m.costCurrency}
                    </span>
                  </div>
                </div>
                <button onClick={() => attemptMission(m.id)}
                  className="px-4 py-2 rounded font-display text-xs font-bold tracking-wider flex items-center gap-1.5"
                  style={{ background: `${factionColor}20`, color: factionColor, border: `1px solid ${factionColor}40` }}>
                  <Eye size={14} strokeWidth={1.5} /> INFILTRATE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpyNetwork;
