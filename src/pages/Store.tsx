import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow } from '@/lib/gameUtils';
import { FACTION_NAMES, FACTION_RESOURCE, AnimeFaction, STORE_PACKAGES } from '@/types/game';
import { ShoppingBag, Coins, Zap, CheckCircle, Crown, Infinity as InfinityIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ANIME_RESOURCES = {
  naruto: { name: 'Chakra', icon: '⚡', color: '#2596be' },
  jjk: { name: 'Cursed Energy', icon: '👁️', color: '#8B00FF' },
  onepiece: { name: 'Haki', icon: '💫', color: '#00C8FF' },
  bleach: { name: 'Reiatsu', icon: '⚔️', color: '#00FF88' },
  blackclover: { name: 'Mana', icon: '✨', color: '#FFD700' },
  dragonball: { name: 'Ki', icon: '🔥', color: '#FF6B00' },
  demonslayer: { name: 'Breath Power', icon: '🌊', color: '#FF003C' },
  hxh: { name: 'Nen', icon: '🌀', color: '#00FF88' },
  physical: { name: 'Stamina', icon: '💪', color: '#6666AA' }
};

const Store = () => {
  const { currentUser, updateCurrency, activateUnlimitedResources } = useGame();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'coins' | 'resources'>('coins');
  const [bought, setBought] = useState<string | null>(null);
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';
  const userResource = ANIME_RESOURCES[currentUser?.anime || 'physical'];

  const handleBuy = (name: string, silver: number, gold: number, price?: string, subscriptionType?: 'weekly' | 'monthly' | 'season', isCoinPurchase: boolean = false) => {
    if (isCoinPurchase) {
      // Only coin purchases go to checkout
      navigate('/checkout', { 
        state: { 
          itemName: name, 
          silver, 
          gold,
          price,
          type: 'store_purchase',
          subscriptionType
        } 
      });
    } else {
      // Handle other purchases internally (Silver for resources, Gold for manga)
      if (silver > 0) {
        // Silver purchase - check if user has enough Silver
        if (currentUser?.currency.silver >= silver) {
          updateCurrency({ silver: currentUser.currency.silver - silver });
          setBought(name);
          // TODO: Add resource refill logic
        } else {
          alert('Not enough Silver coins! Get more from the Coins tab.');
        }
      } else if (gold > 0) {
        // Gold purchase - check if user has enough Gold
        if (currentUser?.currency.gold >= gold) {
          updateCurrency({ gold: currentUser.currency.gold - gold });
          setBought(name);
          // TODO: Add manga access/unlimited subscription logic
        } else {
          alert('Not enough Gold coins! Get more from the Coins tab.');
        }
      }
    }
  };

  const resourcePackages = [
    { id: 1, name: 'Small Refill', amount: 25, silverCost: 50 },
    { id: 2, name: 'Medium Refill', amount: 50, silverCost: 100 },
    { id: 3, name: 'Large Refill', amount: 100, silverCost: 200 },
    { id: 4, name: 'Mega Refill', amount: 200, silverCost: 400 },
  ];

  const unlimitedSubscriptions = [
    { id: 1, name: 'Weekly Unlimited', duration: '7 days', goldCost: 50, realPrice: '$2.50' },
    { id: 2, name: 'Monthly Unlimited', duration: '30 days', goldCost: 150, realPrice: '$7.50' },
    { id: 3, name: 'Season Pass', duration: '90 days', goldCost: 400, realPrice: '$20.00' },
  ];

  const coinPackages = [
    { id: 1, name: 'Silver Starter', silver: 1000, gold: 0, price: '$4.99', bonus: 'Free 200 Silver' },
    { id: 2, name: 'Silver Warrior', silver: 3000, gold: 0, price: '$12.99', bonus: 'Free 600 Silver' },
    { id: 3, name: 'Gold Starter', silver: 2000, gold: 500, price: '$9.99', bonus: 'Free 400 Silver + 100 Gold' },
    { id: 4, name: 'Gold Bundle', silver: 5000, gold: 1500, price: '$24.99', bonus: 'Free 1000 Silver + 300 Gold' },
    { id: 5, name: 'Mega Bundle', silver: 10000, gold: 3000, price: '$49.99', bonus: 'Free 2000 Silver + 600 Gold' },
  ];

  return (
    <div className="min-h-screen zankoku-bg">
      <div className="scanline-overlay" />
      <div className="max-w-6xl mx-auto p-4 md:p-6 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `${factionColor}20`, border: `2px solid ${factionColor}` }}>
              <ShoppingBag size={32} style={{ color: factionColor }} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-black tracking-wider" style={{ color: '#E8E8FF' }}>Battle Store</h1>
              <p className="font-body text-sm" style={{ color: '#6666AA' }}>Power up your arsenal with exclusive content</p>
            </div>
          </div>

          {/* Currency Display */}
          {currentUser && (
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
                <Coins size={16} style={{ color: '#C0C0C0' }} />
                <span className="font-body text-sm font-semibold" style={{ color: '#C0C0C0' }}>{currentUser.currency.silver} Silver</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
                <Coins size={16} style={{ color: '#FFD700' }} />
                <span className="font-body text-sm font-semibold" style={{ color: '#FFD700' }}>{currentUser.currency.gold} Gold</span>
              </div>
            </div>
          )}

          {bought && (
            <div className="p-3 rounded-lg mb-4 flex items-center gap-2" style={{ background: '#00FF8810', border: '1px solid #00FF8840' }}>
              <CheckCircle size={16} style={{ color: '#00FF88' }} />
              <p className="font-body text-sm" style={{ color: '#00FF88' }}>Purchased: {bought}</p>
            </div>
          )}

          <div className="flex gap-4 border-b mb-6" style={{ borderColor: '#1A1A2E' }}>
            {(['coins', 'resources'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className="pb-2 font-body text-sm font-semibold capitalize flex items-center gap-1.5"
                style={{ color: tab === t ? '#FFD700' : '#6666AA', borderBottom: tab === t ? '2px solid #FFD700' : '2px solid transparent' }}>
                {t === 'coins' && <Coins size={14} />}
                {t === 'resources' && <Zap size={14} />}
                {t}
              </button>
            ))}
          </div>

          {tab === 'resources' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${userResource.color}20`, border: `2px solid ${userResource.color}` }}>
                  <span className="text-xl">{userResource.icon}</span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold" style={{ color: userResource.color }}>{userResource.name} Refills</h2>
                  <p className="font-body text-xs" style={{ color: '#6666AA' }}>Power your techniques and abilities with Silver Coins</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resourcePackages.map(pkg => (
                  <div key={pkg.id} className="p-5 rounded-lg" style={{ background: '#080812', border: `1px solid ${userResource.color}30` }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-sm font-bold" style={{ color: '#E8E8FF' }}>{pkg.name}</h3>
                      <span className="font-display text-lg font-black" style={{ color: userResource.color }}>+{pkg.amount}</span>
                    </div>
                    <p className="font-body text-xs mb-3" style={{ color: '#6666AA' }}>
                      Instant {userResource.name} refill for your next battles
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body text-xs" style={{ color: '#C0C0C0' }}>Cost:</span>
                      <span className="font-display text-sm font-bold" style={{ color: '#C0C0C0' }}>{pkg.silverCost} Silver</span>
                    </div>
                    <button onClick={() => handleBuy(pkg.name, pkg.silverCost, 0, '', undefined, false)}
                      className="w-full px-4 py-2 rounded font-display text-xs font-bold tracking-wider"
                      style={{ background: `${userResource.color}20`, color: userResource.color, border: `1px solid ${userResource.color}40` }}>
                      {pkg.silverCost} Silver
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
                <h3 className="font-display text-sm font-bold mb-2" style={{ color: '#FFD700' }}>Need More Silver?</h3>
                <p className="font-body text-xs mb-3" style={{ color: '#6666AA' }}>
                  Purchase Silver Coins from the Coins tab
                </p>
                <button onClick={() => setTab('coins')} className="px-4 py-2 rounded font-display text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FFEC60)', color: '#030308' }}>
                  Get Coins →
                </button>
              </div>

              <div className="mt-8 p-4 rounded-lg" style={{ background: '#080812', border: '1px solid #FFD70030' }}>
                <h3 className="font-display text-sm font-bold mb-3" style={{ color: '#FFD700' }}>Unlimited Resources</h3>
                <p className="font-body text-xs mb-4" style={{ color: '#6666AA' }}>
                  Never run out of {userResource.name} during battles. Gold only.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {unlimitedSubscriptions.map((pkg, idx) => {
                    const subType = idx === 0 ? 'weekly' : idx === 1 ? 'monthly' : 'season';
                    return (
                      <div key={pkg.id} className="p-4 rounded-lg text-center" style={{ background: '#0D0D1A', border: '1px solid #FFD70040' }}>
                        <h4 className="font-display text-xs font-bold mb-1" style={{ color: '#FFD700' }}>{pkg.name}</h4>
                        <p className="font-body text-xs mb-2" style={{ color: '#6666AA' }}>{pkg.duration}</p>
                        <p className="font-body text-xs mb-3" style={{ color: '#00FF88' }}>
                          Unlimited {userResource.name}
                        </p>
                        <div className="mb-2">
                          <span className="font-display text-sm font-bold" style={{ color: '#FFD700' }}>{pkg.goldCost} Gold</span>
                        </div>
                        <button onClick={() => handleBuy(pkg.name, 0, pkg.goldCost, '', subType, false)}
                          className="w-full px-3 py-2 rounded font-display text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #FFD700, #FFEC60)', color: '#030308' }}>
                          {pkg.goldCost} Gold
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'coins' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Coins size={32} className="mx-auto mb-3" style={{ color: '#FFD700' }} />
                <h2 className="font-display text-lg font-bold mb-2" style={{ color: '#FFD700' }}>Coin Packages</h2>
                <p className="font-body text-sm" style={{ color: '#6666AA' }}>
                  Purchase Silver and Gold coins for premium features
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coinPackages.map(pkg => (
                  <div key={pkg.id} className="p-5 rounded-lg text-center" style={{ background: '#080812', border: '2px solid #FFD70030' }}>
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: '#FFD70020', border: '2px solid #FFD700' }}>
                      <Coins size={24} style={{ color: '#FFD700' }} />
                    </div>
                    <h3 className="font-display text-sm font-bold mb-1" style={{ color: '#FFD700' }}>{pkg.name}</h3>
                    <div className="mb-3">
                      {pkg.silver > 0 && (
                        <p className="font-body text-xs" style={{ color: '#C0C0C0' }}>
                          {pkg.silver} Silver Coins
                        </p>
                      )}
                      {pkg.gold > 0 && (
                        <p className="font-body text-xs" style={{ color: '#FFD700' }}>
                          {pkg.gold} Gold Coins
                        </p>
                      )}
                    </div>
                    <p className="font-body text-xs mb-3" style={{ color: '#00FF88' }}>
                      {pkg.bonus}
                    </p>
                    <button onClick={() => handleBuy(pkg.name, pkg.silver, pkg.gold, pkg.price, undefined, true)}
                      className="w-full px-4 py-2 rounded font-display text-xs font-bold tracking-wider"
                      style={{ background: 'linear-gradient(135deg, #FFD700, #FFEC60)', color: '#030308' }}>
                      {pkg.price}
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg" style={{ background: '#00FF8810', border: '1px solid #00FF8840' }}>
                <p className="font-body text-xs" style={{ color: '#00FF88' }}>
                  💰 Purchase coins to unlock premium features and content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
