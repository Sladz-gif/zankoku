import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  color = 'var(--neon-blue)',
  height = 'md',
  showLabel = false,
  label
}) => {
  const percentage = Math.min(100, (value / max) * 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-['Rajdhani'] text-[var(--text-secondary)]">{label}</span>
          <span className="text-xs font-['Rajdhani'] font-semibold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div 
        className={`w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden ${heightClasses[height]}`}
        style={{ border: `1px solid ${color}30` }}
      >
        <div
          className={`${heightClasses[height]} transition-all duration-500 ease-out`}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}60`
          }}
        />
      </div>
    </div>
  );
};
