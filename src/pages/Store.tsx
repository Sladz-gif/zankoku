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
    <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-orbitron text-[#FFD700] mb-2">BATTLE STORE</h1>
          <p className="text-[#6666AA]">Purchase coins and resources to enhance your battle experience</p>
        </div>

        {/* Coin Balance */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C0C0C0]/20 flex items-center justify-center">
                <Coins size={16} className="text-[#C0C0C0]" />
              </div>
              <div>
                <div className="text-xs text-[#6666AA]">SILVER</div>
                <div className="text-lg font-bold text-[#E8E8FF]">{currentUser?.currency.silver || 0}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <Coins size={16} className="text-[#FFD700]" />
              </div>
              <div>
                <div className="text-xs text-[#6666AA]">GOLD</div>
                <div className="text-lg font-bold text-[#E8E8FF]">{currentUser?.currency.gold || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setTab('coins')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                tab === 'coins' 
                  ? 'bg-[#FFD700] text-[#030308]' 
                  : 'text-[#6666AA] hover:text-[#E8E8FF]'
              }`}
            >
              <Coins size={16} className="inline mr-2" />
              COINS
            </button>
            <button
              onClick={() => setTab('resources')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                tab === 'resources' 
                  ? 'bg-[#FFD700] text-[#030308]' 
                  : 'text-[#6666AA] hover:text-[#E8E8FF]'
              }`}
            >
              <Zap size={16} className="inline mr-2" />
              RESOURCES
            </button>
          </div>
        </div>

        {/* Content */}
        {tab === 'coins' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coinPackages.map(pkg => (
              <div key={pkg.id} className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 relative">
                                
                <h3 className="text-xl font-bold font-orbitron text-[#E8E8FF] mb-2">{pkg.name}</h3>
                <div className="text-2xl font-bold text-[#FFD700] mb-4">{pkg.price}</div>
                
                <div className="space-y-3 mb-6">
                  {pkg.silver > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#C0C0C0]/20 flex items-center justify-center">
                          <Coins size={12} className="text-[#C0C0C0]" />
                        </div>
                        <span className="text-[#E8E8FF]">Silver</span>
                      </div>
                      <span className="text-[#E8E8FF] font-medium">+{pkg.silver}</span>
                    </div>
                  )}
                  {pkg.gold > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                          <Coins size={12} className="text-[#FFD700]" />
                        </div>
                        <span className="text-[#E8E8FF]">Gold</span>
                      </div>
                      <span className="text-[#E8E8FF] font-medium">+{pkg.gold}</span>
                    </div>
                  )}
                  {pkg.bonus && (
                    <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-[#FFD700]">{pkg.bonus}</div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => handleBuy(pkg.name, pkg.silver, pkg.gold, pkg.price, undefined, true)}
                  className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#030308] rounded-lg font-bold hover:shadow-[0_0_16px_rgba(255,215,0,0.5)] transition-all"
                  disabled={!currentUser}
                >
                  PURCHASE
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcePackages.map(pkg => (
              <div key={pkg.id} className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6">
                <h3 className="text-xl font-bold font-orbitron text-[#E8E8FF] mb-2">{pkg.name}</h3>
                
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#8B00FF]/20 flex items-center justify-center">
                      <Zap size={16} className="text-[#8B00FF]" />
                    </div>
                    <span className="text-[#E8E8FF] font-medium">{userResource.name}</span>
                  </div>
                  <div className="text-center py-4 bg-[#1A1A2E] rounded-lg">
                    <div className="text-2xl font-bold text-[#8B00FF]">+{pkg.amount}</div>
                    <div className="text-xs text-[#6666AA]">Resource Fill</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#6666AA]">Cost</span>
                  <div className="flex items-center gap-1">
                    <Coins size={14} className="text-[#C0C0C0]" />
                    <span className="text-[#E8E8FF] font-medium">{pkg.silver}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleBuy(pkg.name, pkg.silver, pkg.gold)}
                  className="w-full py-3 bg-gradient-to-r from-[#8B00FF] to-[#5500CC] text-white rounded-lg font-bold hover:shadow-[0_0_16px_rgba(139,0,255,0.5)] transition-all"
                  disabled={!currentUser || (currentUser?.currency.silver || 0) < pkg.silver}
                >
                  {(currentUser?.currency.silver || 0) < pkg.silver ? 'INSUFFICIENT' : 'PURCHASE'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
