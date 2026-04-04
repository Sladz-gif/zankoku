import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor, getFactionGlow, getAlignmentLabel } from '@/lib/gameUtils';
import { AnimeFaction, FACTION_NAMES, Alignment } from '@/types/game';
import { Coins, Trophy, TrendingUp, Users, Clock, ChevronLeft, AlertTriangle, CheckCircle } from 'lucide-react';

interface BetOption {
  player: 'player1' | 'player2';
  odds: number;
  potentialPayout: number;
}

interface Bet {
  id: string;
  battleId: string;
  userId: number;
  player: 'player1' | 'player2';
  amount: number;
  odds: number;
  potentialPayout: number;
  placedAt: number;
}

const BetPage = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { currentUser, updateCurrency } = useGame();
  
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedPlayer, setSelectedPlayer] = useState<'player1' | 'player2' | null>(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Battle data would come from API/battle context
  const battle = battleId ? { id: battleId } : null;

  // Calculate odds based on current betting
  const calculateOdds = (playerBets: number, opponentBets: number): number => {
    if (playerBets === 0) return 2.0;
    const totalPool = playerBets + opponentBets;
    return Number((totalPool / playerBets).toFixed(2));
  };

  const betOptions: BetOption[] = battle ? [
    {
      player: 'player1',
      odds: 2.0,
      potentialPayout: selectedPlayer === 'player1' ? betAmount * 2.0 : 0
    },
    {
      player: 'player2',
      odds: 2.0,
      potentialPayout: selectedPlayer === 'player2' ? betAmount * 2.0 : 0
    }
  ] : [];

  const quickBetAmounts = [10, 25, 50, 100, 250, 500];

  const handlePlaceBet = async () => {
    if (!selectedPlayer || !currentUser || betAmount > currentUser.goldCoins) return;
    
    setProcessing(true);
    
    // Simulate bet placement
    setTimeout(() => {
      updateCurrency({ goldCoins: -betAmount });
      setBetPlaced(true);
      setProcessing(false);
    }, 1500);
  };

  const getPlayerStats = (player: typeof battle.player1) => ({
    winRate: `${player.winRate}%`,
    recentForm: `${player.recentWins} wins`,
    rank: `#${player.rank}`,
    faction: FACTION_NAMES[player.anime]
  });

  if (betPlaced) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ 
              background: 'var(--neon-green)20', 
              border: '2px solid var(--neon-green)',
              boxShadow: '0 0 30px rgba(0,255,136,0.3)'
            }}
          >
            <CheckCircle size={40} style={{ color: 'var(--neon-green)' }} />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--neon-green)' }}>
            BET PLACED!
          </h1>
          <p className="font-body text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            Your bet of {betAmount} Gold on {selectedPlayer === 'player1' ? battle.player1.username : battle.player2.username}
          </p>
          <div className="mb-8">
            <div className="font-display text-xl mb-2" style={{ color: 'var(--neon-gold)' }}>
              Potential Payout: {betAmount * (selectedPlayer === 'player1' ? betOptions[0].odds : betOptions[1].odds)} Gold
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Odds: {selectedPlayer === 'player1' ? betOptions[0].odds : betOptions[1].odds}x
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/battle')}
              className="px-6 py-3 rounded font-display font-bold transition-all"
              style={{ 
                background: 'var(--neon-blue)20', 
                color: 'var(--neon-blue)',
                border: '1px solid var(--neon-blue)'
              }}
            >
              Watch Battle
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded font-display font-bold transition-all"
              style={{ 
                background: 'var(--bg-elevated)', 
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/battle')}
          className="p-2 rounded transition-colors hover:bg-gray-800"
          style={{ color: 'var(--text-primary)' }}
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Place Your Bet
          </h1>
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Battle #{battle.id}
          </p>
        </div>
      </div>

      {/* Battle Overview */}
      <div className="p-6 rounded-lg border mb-6" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="font-display font-bold text-lg mb-2" style={{ color: getFactionColor(battle.player1.anime) }}>
              {battle.player1.username}
            </div>
            <div className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
              <div>Rank #{battle.player1.rank} • {FACTION_NAMES[battle.player1.anime]}</div>
              <div>{getAlignmentLabel(battle.player1.alignment)}</div>
              <div>Win Rate: {battle.player1.winRate}%</div>
            </div>
          </div>
          
          <div className="text-center px-4">
            <div className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>VS</div>
            <div className="text-xs px-2 py-1 rounded" style={{ 
              background: 'var(--neon-green)20', 
              color: 'var(--neon-green)',
              border: '1px solid var(--neon-green)'
            }}>
              Turn {battle.currentTurn}
            </div>
          </div>

          <div className="text-center flex-1">
            <div className="font-display font-bold text-lg mb-2" style={{ color: getFactionColor(battle.player2.anime) }}>
              {battle.player2.username}
            </div>
            <div className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
              <div>Rank #{battle.player2.rank} • {FACTION_NAMES[battle.player2.anime]}</div>
              <div>{getAlignmentLabel(battle.player2.alignment)}</div>
              <div>Win Rate: {battle.player2.winRate}%</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-1">
            <Users size={14} />
            {battle.spectators} watching
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={14} />
            {battle.prizePool} Gold prize
          </div>
          <div className="flex items-center gap-1">
            <Coins size={14} />
            {battle.totalBets} Gold in bets
          </div>
        </div>
      </div>

      {/* Betting Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {betOptions.map((option) => {
          const player = option.player === 'player1' ? battle.player1 : battle.player2;
          const isSelected = selectedPlayer === option.player;
          
          return (
            <button
              key={option.player}
              onClick={() => setSelectedPlayer(option.player)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
              style={{
                background: isSelected ? 'var(--bg-surface)' : 'var(--bg-elevated)',
                borderColor: isSelected ? getFactionColor(player.anime) : 'var(--border)',
                boxShadow: isSelected ? `0 0 20px ${getFactionColor(player.anime)}30` : 'none'
              }}
            >
              <div className="text-center">
                <div className="font-display text-xl font-bold mb-2" style={{ color: getFactionColor(player.anime) }}>
                  {player.username}
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold" style={{ color: 'var(--neon-gold)' }}>
                    {option.odds}x
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Odds
                  </div>
                </div>
                {isSelected && (
                  <div className="text-sm" style={{ color: 'var(--neon-green)' }}>
                    Potential: {option.potentialPayout} Gold
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bet Amount */}
      <div className="p-6 rounded-lg border mb-6" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
        <h3 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Bet Amount
        </h3>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          {quickBetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              className={`p-3 rounded font-display font-bold transition-all ${
                betAmount === amount ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                background: betAmount === amount ? 'var(--neon-gold)20' : 'var(--bg-surface)',
                color: betAmount === amount ? 'var(--neon-gold)' : 'var(--text-primary)',
                border: betAmount === amount ? '1px solid var(--neon-gold)' : '1px solid var(--border)',
                ringColor: betAmount === amount ? 'var(--neon-gold)' : 'transparent'
              }}
            >
              {amount}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
            className="flex-1 p-3 rounded font-display text-lg font-bold text-center"
            style={{ 
              background: 'var(--bg-surface)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border)'
            }}
          />
          <div className="text-right">
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Your Balance</div>
            <div className="font-display font-bold" style={{ color: 'var(--neon-gold)' }}>
              {currentUser?.goldCoins || 0} Gold
            </div>
          </div>
        </div>

        {betAmount > (currentUser?.goldCoins || 0) && (
          <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: '#FF003C' }}>
            <AlertTriangle size={16} />
            Insufficient balance
          </div>
        )}
      </div>

      {/* Place Bet Button */}
      <button
        onClick={handlePlaceBet}
        disabled={!selectedPlayer || processing || betAmount > (currentUser?.goldCoins || 0)}
        className="w-full p-4 rounded-lg font-display font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: !selectedPlayer || processing || betAmount > (currentUser?.goldCoins || 0) 
            ? 'var(--bg-elevated)' 
            : 'linear-gradient(135deg, var(--neon-gold), #FFA500)',
          color: !selectedPlayer || processing || betAmount > (currentUser?.goldCoins || 0) 
            ? 'var(--text-muted)' 
            : 'white',
          border: !selectedPlayer || processing || betAmount > (currentUser?.goldCoins || 0) 
            ? '1px solid var(--border)' 
            : 'none',
          boxShadow: selectedPlayer && !processing && betAmount <= (currentUser?.goldCoins || 0)
            ? '0 0 20px rgba(255,215,0,0.4)' 
            : 'none'
        }}
      >
        {processing ? 'Placing Bet...' : `Place Bet (${betAmount} Gold)`}
      </button>

      {/* Betting Stats */}
      <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <h4 className="font-display text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Current Betting Pool
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-display font-bold" style={{ color: getFactionColor(battle.player1.anime) }}>
              {battle.player1.username}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              {battle.player1Bets} Gold ({((battle.player1Bets / battle.totalBets) * 100).toFixed(1)}%)
            </div>
          </div>
          <div>
            <div className="font-display font-bold" style={{ color: getFactionColor(battle.player2.anime) }}>
              {battle.player2.username}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              {battle.player2Bets} Gold ({((battle.player2Bets / battle.totalBets) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetPage;
