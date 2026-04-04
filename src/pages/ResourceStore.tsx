import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow } from '@/lib/gameUtils';
import { FACTION_RESOURCE, FACTION_NAMES } from '@/types/game';
import { Coins, Zap, Sparkles, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResourceStore = () => {
  const { currentUser, updateCurrency } = useGame();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'coins' | 'resources' | 'bundles'>('coins');
  const [bought, setBought] = useState<string | null>(null);
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';
  const factionGlow = currentUser ? getFactionGlow(currentUser.anime) : '#BF5FFF';

  const handlePurchase = (name: string, cost: { bronze?: number; silver?: number; gold?: number }) => {
    if (!currentUser) return;
    const c = currentUser.currency;
    if ((cost.bronze && c.bronze < cost.bronze) || (cost.silver && c.silver < cost.silver) || (cost.gold && c.gold < cost.gold)) return;
    updateCurrency({
      bronze: c.bronze - (cost.bronze || 0),
      silver: c.silver - (cost.silver || 0),
      gold: c.gold - (cost.gold || 0),
    });
    setBought(name);
    setTimeout(() => setBought(null), 3000);
  };

  const canAfford = (cost: { bronze?: number; silver?: number; gold?: number }) => {
    if (!currentUser) return false;
    const c = currentUser.currency;
    return (!cost.bronze || c.bronze >= cost.bronze) && (!cost.silver || c.silver >= cost.silver) && (!cost.gold || c.gold >= cost.gold);
  };

  const silverPacks = [
    { name: 'Spark Pack', amount: '500 Silver', price: '$0.99', silver: 500 },
    { name: 'Flame Pack', amount: '1,500 Silver', price: '$2.99', silver: 1500 },
    { name: 'Storm Pack', amount: '5,000 Silver', price: '$7.99', silver: 5000 },
    { name: 'Thunder Pack', amount: '15,000 Silver', price: '$19.99', silver: 15000 },
  ];

  const goldPacks = [
    { name: 'Shard', amount: '100 Gold', price: '$0.99', gold: 100 },
    { name: 'Fragment', amount: '350 Gold', price: '$2.99', gold: 350 },
    { name: 'Ingot', amount: '1,200 Gold', price: '$7.99', gold: 1200 },
    { name: 'Crown', amount: '4,000 Gold', price: '$19.99', gold: 4000 },
  ];

  return (
    <div className="page-enter max-w-4xl mx-auto p-4 md:p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-body text-sm mb-6" style={{ color: '#6666AA' }}>
        <ArrowLeft size={18} strokeWidth={1.5} /> Back
      </button>

      <h1 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3 mb-6" style={{ color: factionColor, textShadow: `0 0 20px ${factionColor}40` }}>
        <Zap size={22} strokeWidth={1.5} /> RESOURCES
      </h1>

      {bought && (
        <div className="p-3 rounded-lg mb-4 flex items-center gap-2" style={{ background: '#00FF8810', border: '1px solid #00FF8840' }}>
          <CheckCircle size={16} style={{ color: '#00FF88' }} />
          <p className="font-body text-sm" style={{ color: '#00FF88' }}>Purchased: {bought}</p>
        </div>
      )}

      <div className="flex gap-4 border-b mb-8" style={{ borderColor: '#1A1A2E' }}>
        {(['coins', 'resources', 'bundles'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="pb-2 font-body text-sm font-semibold uppercase tracking-wider"
            style={{ color: tab === t ? factionColor : '#6666AA', borderBottom: tab === t ? `2px solid ${factionColor}` : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'coins' && (
        <div className="space-y-8">
          {/* Bronze notice */}
          <div className="p-5 rounded-lg flex items-center gap-3" style={{ background: '#080812', border: '1px solid #CD7F3230' }}>
            <Coins size={24} strokeWidth={1.5} style={{ color: '#CD7F32' }} />
            <div>
              <p className="font-body text-sm font-semibold" style={{ color: '#CD7F32' }}>Bronze is earned through battle. It cannot be bought.</p>
              <p className="font-body text-xs" style={{ color: '#6666AA' }}>Play duels, raid dungeons, and complete spy missions.</p>
            </div>
          </div>

          {/* Silver */}
          <div>
            <h3 className="font-display text-xs font-bold tracking-widest mb-4" style={{ color: '#C0C0C0', letterSpacing: '4px' }}>SILVER PACKAGES</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {silverPacks.map(p => (
                <div key={p.name} className="p-5 rounded-lg" style={{ background: '#080812', border: '1px solid #C0C0C030' }}>
                  <Coins size={20} strokeWidth={1.5} className="mb-2" style={{ color: '#C0C0C0' }} />
                  <h4 className="font-display text-sm font-bold mb-1" style={{ color: '#E8E8FF' }}>{p.name}</h4>
                  <p className="font-body text-xs mb-3" style={{ color: '#C0C0C0' }}>{p.amount}</p>
                  <button onClick={() => handlePurchase(p.name, {})}
                    className="w-full py-2 rounded font-display text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #C0C0C0, #E8E8FF)', color: '#030308' }}>
                    {p.price}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Gold */}
          <div>
            <h3 className="font-display text-xs font-bold tracking-widest mb-4" style={{ color: '#FFD700', letterSpacing: '4px' }}>GOLD PACKAGES</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goldPacks.map(p => (
                <div key={p.name} className="p-5 rounded-lg" style={{ background: '#080812', border: '1px solid #FFD70030' }}>
                  <Coins size={20} strokeWidth={1.5} className="mb-2" style={{ color: '#FFD700' }} />
                  <h4 className="font-display text-sm font-bold mb-1" style={{ color: '#E8E8FF' }}>{p.name}</h4>
                  <p className="font-body text-xs mb-3" style={{ color: '#FFD700' }}>{p.amount}</p>
                  <button onClick={() => handlePurchase(p.name, {})}
                    className="w-full py-2 rounded font-display text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #FFEC60)', color: '#030308' }}>
                    {p.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'resources' && currentUser && (
        <div className="space-y-6">
          <div className="p-5 rounded-lg" style={{ background: '#080812', border: `1px solid ${factionColor}30` }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} strokeWidth={1.5} style={{ color: factionColor }} />
              <h3 className="font-display text-sm font-bold" style={{ color: factionColor }}>
                {FACTION_RESOURCE[currentUser.anime]} — {FACTION_NAMES[currentUser.anime]}
              </h3>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#1A1A2E' }}>
                <div className="h-full rounded-full resource-bar" style={{ width: `${currentUser.resource}%`, background: `linear-gradient(90deg, ${factionColor}, ${factionGlow})` }} />
              </div>
              <span className="font-display text-sm font-bold" style={{ color: factionColor }}>{currentUser.resource}/{currentUser.maxResource}</span>
            </div>

            <h4 className="font-display text-xs font-bold tracking-widest mb-3" style={{ color: '#E8E8FF', letterSpacing: '4px' }}>INSTANT REFILL</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <button onClick={() => canAfford({ bronze: 20 }) && handlePurchase('Full Refill (Bronze)', { bronze: 20 })}
                className="p-4 rounded-lg text-left"
                style={{ background: '#0D0D1A', border: `1px solid ${canAfford({ bronze: 20 }) ? '#CD7F3240' : '#1A1A2E'}` }}>
                <p className="font-body text-sm font-semibold" style={{ color: '#E8E8FF' }}>Full Refill</p>
                <p className="font-body text-xs flex items-center gap-1" style={{ color: '#CD7F32' }}>
                  <Coins size={12} style={{ color: '#CD7F32' }} /> 20 Bronze
                </p>
                {!canAfford({ bronze: 20 }) && <p className="font-body text-xs mt-1" style={{ color: '#FF003C' }}>INSUFFICIENT FUNDS</p>}
              </button>
              <button onClick={() => canAfford({ silver: 50 }) && handlePurchase('Full Refill + 10% Boost', { silver: 50 })}
                className="p-4 rounded-lg text-left"
                style={{ background: '#0D0D1A', border: `1px solid ${canAfford({ silver: 50 }) ? '#C0C0C040' : '#1A1A2E'}` }}>
                <p className="font-body text-sm font-semibold" style={{ color: '#E8E8FF' }}>Full Refill + 10% Boost</p>
                <p className="font-body text-xs flex items-center gap-1" style={{ color: '#C0C0C0' }}>
                  <Coins size={12} style={{ color: '#C0C0C0' }} /> 50 Silver
                </p>
                {!canAfford({ silver: 50 }) && <p className="font-body text-xs mt-1" style={{ color: '#FF003C' }}>INSUFFICIENT FUNDS</p>}
              </button>
            </div>

            <h4 className="font-display text-xs font-bold tracking-widest mb-3" style={{ color: '#E8E8FF', letterSpacing: '4px' }}>CAPACITY UPGRADE</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Level 1 — 120 max', cost: { silver: 100 }, costLabel: '100 Silver' },
                { label: 'Level 2 — 150 max', cost: { silver: 300 }, costLabel: '300 Silver' },
                { label: 'Level 3 — 200 max', cost: { silver: 500, gold: 50 }, costLabel: '500 Silver + 50 Gold' },
              ].map(u => (
                <button key={u.label} onClick={() => canAfford(u.cost) && handlePurchase(u.label, u.cost)}
                  className="p-4 rounded-lg text-left"
                  style={{ background: '#0D0D1A', border: `1px solid ${canAfford(u.cost) ? `${factionColor}30` : '#1A1A2E'}` }}>
                  <p className="font-body text-sm font-semibold" style={{ color: '#E8E8FF' }}>{u.label}</p>
                  <p className="font-body text-xs" style={{ color: '#6666AA' }}>{u.costLabel}</p>
                  {!canAfford(u.cost) && <p className="font-body text-xs mt-1" style={{ color: '#FF003C' }}>INSUFFICIENT FUNDS</p>}
                </button>
              ))}
            </div>

            <h4 className="font-display text-xs font-bold tracking-widest mb-3" style={{ color: '#E8E8FF', letterSpacing: '4px' }}>REFILL SPEED</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: 'Fast Refill (+8/turn)', cost: { silver: 200 }, costLabel: '200 Silver' },
                { label: 'Blazing Refill (+12/turn)', cost: { silver: 400, gold: 30 }, costLabel: '400 Silver + 30 Gold' },
              ].map(u => (
                <button key={u.label} onClick={() => canAfford(u.cost) && handlePurchase(u.label, u.cost)}
                  className="p-4 rounded-lg text-left"
                  style={{ background: '#0D0D1A', border: `1px solid ${canAfford(u.cost) ? `${factionColor}30` : '#1A1A2E'}` }}>
                  <p className="font-body text-sm font-semibold" style={{ color: '#E8E8FF' }}>{u.label}</p>
                  <p className="font-body text-xs" style={{ color: '#6666AA' }}>{u.costLabel}</p>
                  {!canAfford(u.cost) && <p className="font-body text-xs mt-1" style={{ color: '#FF003C' }}>INSUFFICIENT FUNDS</p>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'bundles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'STARTER BUNDLE', desc: '500 Silver + 50 Gold + Full Resource Refill', price: '$2.99' },
            { name: 'WARRIOR BUNDLE', desc: '2,000 Silver + 200 Gold + Capacity Lv1 + 3 Techniques', price: '$9.99' },
            { name: 'KAGE BUNDLE', desc: '8,000 Silver + 1,000 Gold + Capacity Lv2 + 10 Techniques', price: '$29.99' },
            { name: 'MONTHLY ARC PASS', desc: '500 Gold/month + Seasonal techniques + Refill Speed upgrade', price: '$4.99/mo', best: true },
            ...(currentUser?.roleTag === 'TRAITOR' ? [{ name: 'BETRAYAL PACK', desc: 'Full resource refill + 3 starter techniques + 200 Silver', price: '$3.99' }] : []),
          ].map(b => (
            <div key={b.name} className="p-5 rounded-lg relative" style={{ background: '#080812', border: `1px solid ${b.best ? '#FFD70050' : `${factionColor}30`}`, boxShadow: b.best ? '0 0 20px rgba(255,215,0,0.1)' : 'none' }}>
              {b.best && (
                <span className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-display font-bold role-tag-shimmer flex items-center gap-1"
                  style={{ background: '#FFD70020', color: '#FFD700', border: '1px solid #FFD70040' }}>
                  <Sparkles size={12} strokeWidth={1.5} /> BEST VALUE
                </span>
              )}
              <h3 className="font-display text-sm font-bold tracking-wider mb-2" style={{ color: b.best ? '#FFD700' : '#E8E8FF' }}>{b.name}</h3>
              <p className="font-body text-xs mb-4" style={{ color: '#6666AA' }}>{b.desc}</p>
              <button className="px-6 py-2 rounded font-display text-xs font-bold tracking-wider"
                style={{ background: b.best ? 'linear-gradient(135deg, #FFD700, #FFEC60)' : `linear-gradient(135deg, ${factionColor}, ${factionGlow})`, color: '#030308' }}>
                {b.price}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceStore;
