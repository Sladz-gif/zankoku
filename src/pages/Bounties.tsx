import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow, timeAgo } from '@/lib/gameUtils';
import { FACTION_NAMES } from '@/types/game';
import { Target, Coins, AlertTriangle } from 'lucide-react';

const Bounties = () => {
  const { currentUser, users, bounties, placeBounty } = useGame();
  const [tab, setTab] = useState('active');
  const [targetName, setTargetName] = useState('');
  const [amount, setAmount] = useState(50);
  const [anonymous, setAnonymous] = useState(false);
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  const getUser = (id: number) => users.find(u => u.id === id) || (currentUser?.id === id ? currentUser : null);
  const activeBounties = bounties.filter(b => b.active);
  const myBounties = bounties.filter(b => b.placedById === currentUser?.id);

  const handlePlace = () => {
    const target = users.find(u => u.username.toLowerCase() === targetName.toLowerCase());
    if (!target || !currentUser || currentUser.currency.gold < amount || amount < 50) return;
    placeBounty(target.id, amount, anonymous);
    setTargetName('');
    setAmount(50);
  };

  return (
    <div className="page-enter max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3 mb-6" style={{ color: '#FF003C', textShadow: '0 0 20px rgba(255,0,60,0.3)' }}>
        <Target size={22} strokeWidth={1.5} /> BOUNTIES
      </h1>

      <div className="flex gap-4 border-b mb-6" style={{ borderColor: '#1A1A2E' }}>
        {['active', 'place', 'mine'].map(t => (
          <button key={t} onClick={() => setTab(t)} className="pb-2 font-body text-sm font-semibold capitalize"
            style={{ color: tab === t ? '#FF003C' : '#6666AA', borderBottom: tab === t ? '2px solid #FF003C' : '2px solid transparent' }}>
            {t === 'place' ? 'Place Bounty' : t === 'mine' ? 'My Bounties' : 'Active'}
          </button>
        ))}
      </div>

      {tab === 'active' && (
        <div className="space-y-3">
          {activeBounties.map((b, i) => {
            const target = getUser(b.targetId);
            const placer = b.anonymous ? null : getUser(b.placedById);
            if (!target) return null;
            const tColor = getFactionColor(target.anime);
            return (
              <div key={b.id} className="p-5 rounded-lg stagger-item bounty-pulse"
                style={{ animationDelay: `${i * 50}ms`, background: '#080812', border: '1px solid #FF003C30' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-bold"
                      style={{ background: `${tColor}20`, border: `2px solid ${tColor}`, color: tColor }}>
                      {target.username[0]}
                    </div>
                    <div>
                      <div className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>{target.username}</div>
                      <div className="font-body text-xs" style={{ color: '#6666AA' }}>
                        {placer ? `By ${placer.username}` : 'Anonymous'} · Expires {timeAgo(b.expiresAt - Date.now() + Date.now())}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold flex items-center gap-1" style={{ color: '#FFD700' }}>
                      <Coins size={16} strokeWidth={1.5} style={{ color: '#FFD700' }} />{b.amount}
                    </div>
                    <button className="mt-1 px-4 py-1 rounded font-display text-xs font-bold tracking-wider flex items-center gap-1"
                      style={{ background: '#FF003C20', color: '#FF003C', border: '1px solid #FF003C40' }}>
                      <Target size={12} strokeWidth={1.5} /> HUNT
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {activeBounties.length === 0 && <p className="font-body text-sm" style={{ color: '#6666AA' }}>No active bounties.</p>}
        </div>
      )}

      {tab === 'place' && (
        <div className="max-w-md space-y-4">
          <div>
            <label className="font-body text-sm font-semibold block mb-1" style={{ color: '#6666AA' }}>Target Username</label>
            <input value={targetName} onChange={e => setTargetName(e.target.value)}
              className="w-full rounded-md font-body text-sm focus:outline-none"
              style={{ background: '#080812', border: '1px solid #FF003C30', color: '#E8E8FF', padding: '12px 16px' }}
              placeholder="Enter target..." />
          </div>
          <div>
            <label className="font-body text-sm font-semibold block mb-1" style={{ color: '#6666AA' }}>Amount (min 50 Gold)</label>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} min={50}
              className="w-full rounded-md font-body text-sm focus:outline-none"
              style={{ background: '#080812', border: '1px solid #FF003C30', color: '#E8E8FF', padding: '12px 16px' }} />
          </div>
          <label className="flex items-center gap-2 font-body text-sm cursor-pointer" style={{ color: '#6666AA' }}>
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
            Post anonymously
          </label>
          <button onClick={handlePlace}
            className="w-full py-3 rounded-md font-display text-sm font-bold tracking-widest"
            style={{ background: 'linear-gradient(135deg, #FF003C, #FF3366)', color: '#030308' }}>
            PLACE BOUNTY
          </button>
        </div>
      )}

      {tab === 'mine' && (
        <div className="space-y-3">
          {myBounties.map(b => {
            const target = getUser(b.targetId);
            return (
              <div key={b.id} className="p-5 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm" style={{ color: '#E8E8FF' }}>{target?.username || 'Unknown'}</span>
                  <span className="font-display text-sm font-bold flex items-center gap-1" style={{ color: '#FFD700' }}>
                    <Coins size={14} strokeWidth={1.5} style={{ color: '#FFD700' }} />{b.amount}
                  </span>
                  <span className="font-body text-xs px-2 py-0.5 rounded" style={{ background: b.active ? '#FF003C20' : '#00FF8820', color: b.active ? '#FF003C' : '#00FF88' }}>
                    {b.active ? 'Active' : 'Expired'}
                  </span>
                </div>
              </div>
            );
          })}
          {myBounties.length === 0 && <p className="font-body text-sm" style={{ color: '#6666AA' }}>You haven't placed any bounties yet.</p>}
        </div>
      )}
    </div>
  );
};

export default Bounties;
