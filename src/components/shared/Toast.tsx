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
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 200);
    }, duration);

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
      className={`toast ${isExiting ? 'exiting' : ''}`}
      style={{ borderLeftColor: color }}
    >
      <Icon size={20} strokeWidth={1.5} style={{ color }} />
      <p className="toast-message">
        {message}
      </p>
      <button
        onClick={onClose}
        className="btn-icon"
        style={{ position: 'absolute', top: '12px', right: '12px' }}
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
};
