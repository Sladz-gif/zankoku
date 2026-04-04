import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: number;
  onExpire?: () => void;
  showIcon?: boolean;
  color?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  expiresAt, 
  onExpire,
  showIcon = true,
  color = 'var(--neon-orange)'
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(expiresAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = expiresAt - Date.now();
      setTimeLeft(remaining);
      
      if (remaining <= 0 && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const formatTime = (ms: number): string => {
    if (ms <= 0) return 'Expired';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const isUrgent = timeLeft > 0 && timeLeft < 3600000;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 font-['Rajdhani'] font-semibold text-sm ${isUrgent ? 'urgent-pulse' : ''}`}
      style={{ color: timeLeft <= 0 ? 'var(--text-muted)' : color }}
    >
      {showIcon && <Clock size={14} strokeWidth={1.5} />}
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};
