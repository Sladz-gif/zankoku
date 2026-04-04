import React from 'react';
import { Coins } from 'lucide-react';

interface CoinBalanceProps {
  amount: number;
  type: 'bronze' | 'silver' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const COIN_COLORS = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700'
};

export const CoinBalance: React.FC<CoinBalanceProps> = ({ 
  amount, 
  type, 
  size = 'md',
  showIcon = true 
}) => {
  const color = COIN_COLORS[type];
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  const formatAmount = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-['Rajdhani'] font-semibold ${sizeClasses[size]}`}>
      {showIcon && (
        <Coins 
          size={iconSizes[size]} 
          strokeWidth={1.5}
          style={{ color }}
        />
      )}
      <span style={{ color }}>{formatAmount(amount)}</span>
    </div>
  );
};
