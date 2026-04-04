import { useState, useEffect } from 'react';
import { Clock, Zap, Infinity } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { formatTimeRemaining } from '@/utils/resourceManager';

export const ResourceTimer = () => {
  const { currentUser, getResourceStatus, refillUserResources } = useGame();
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const updateTimer = () => {
      const status = getResourceStatus();
      setTimeRemaining(status.timeUntilRefill);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentUser, getResourceStatus]);

  if (!currentUser) return null;

  const status = getResourceStatus();
  const { current, hasUnlimited, canRefill } = status;

  const handleRefill = () => {
    if (canRefill) {
      refillUserResources();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-30">
      <div className="p-4 rounded-xl" style={{
        background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
        border: hasUnlimited ? '2px solid #FFD700' : '2px solid #00C8FF',
        boxShadow: hasUnlimited 
          ? '0 0 30px rgba(255, 215, 0, 0.3)' 
          : '0 0 20px rgba(0, 200, 255, 0.2)'
      }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          {hasUnlimited ? (
            <Infinity className="w-5 h-5" style={{ color: '#FFD700' }} />
          ) : (
            <Zap className="w-5 h-5" style={{ color: '#00C8FF' }} />
          )}
          <span className="font-['Orbitron'] text-sm font-bold" style={{ 
            color: hasUnlimited ? '#FFD700' : '#00C8FF' 
          }}>
            {hasUnlimited ? 'UNLIMITED' : 'RESOURCES'}
          </span>
        </div>

        {/* Resource Display */}
        <div className="mb-3">
          <div className="font-display text-3xl font-black" style={{ 
            color: hasUnlimited ? '#FFD700' : '#00FF88',
            textShadow: hasUnlimited 
              ? '0 0 20px rgba(255, 215, 0, 0.5)' 
              : '0 0 20px rgba(0, 255, 136, 0.5)'
          }}>
            {current}
          </div>
          <div className="font-['Rajdhani'] text-xs" style={{ color: '#8888AA' }}>
            {hasUnlimited ? 'Unlimited Active' : `/ 100 Available`}
          </div>
        </div>

        {/* Timer or Unlimited Info */}
        {hasUnlimited ? (
          <div className="flex items-center gap-2 p-2 rounded" style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <Infinity className="w-4 h-4" style={{ color: '#FFD700' }} />
            <span className="font-['Rajdhani'] text-xs" style={{ color: '#FFD700' }}>
              No refill needed
            </span>
          </div>
        ) : canRefill ? (
          <button
            onClick={handleRefill}
            className="w-full py-2 px-3 rounded font-['Orbitron'] text-xs font-bold transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #00FF88, #00CC66)',
              color: '#0A0A0F',
              boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)'
            }}
          >
            REFILL NOW
          </button>
        ) : (
          <div className="flex items-center gap-2 p-2 rounded" style={{
            background: 'rgba(0, 200, 255, 0.1)',
            border: '1px solid rgba(0, 200, 255, 0.3)'
          }}>
            <Clock className="w-4 h-4" style={{ color: '#00C8FF' }} />
            <div className="flex-1">
              <div className="font-['Rajdhani'] text-xs" style={{ color: '#8888AA' }}>
                Next refill in
              </div>
              <div className="font-['Orbitron'] text-sm font-bold" style={{ color: '#00C8FF' }}>
                {formatTimeRemaining(timeRemaining)}
              </div>
            </div>
          </div>
        )}

        {/* Unlimited Expiry */}
        {hasUnlimited && currentUser.unlimitedResourcesExpiry && (
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255, 215, 0, 0.2)' }}>
            <div className="font-['Rajdhani'] text-xs" style={{ color: '#8888AA' }}>
              Expires: {new Date(currentUser.unlimitedResourcesExpiry).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
