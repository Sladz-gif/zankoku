import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
  factionColor?: string;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000,
  onClose,
  factionColor = 'var(--neon-blue)'
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle
  };

  const colors = {
    success: 'var(--neon-green)',
    error: 'var(--neon-red)',
    info: factionColor
  };

  const Icon = icons[type];
  const color = colors[type];

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[var(--bg-surface)] border-l-4 rounded-lg p-4 shadow-2xl min-w-[300px] max-w-md animate-slide-in-right"
      style={{ 
        borderLeftColor: color,
        boxShadow: `0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px ${color}20`
      }}
    >
      <Icon size={20} strokeWidth={1.5} style={{ color }} />
      <p className="flex-1 text-sm font-['Rajdhani'] text-[var(--text-primary)]">
        {message}
      </p>
      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors"
      >
        <X size={16} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
      </button>
    </div>
  );
};
