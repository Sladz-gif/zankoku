import React from 'react';

interface RoleTagProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleTag: React.FC<RoleTagProps> = ({ tag, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-1',
    lg: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center font-['Rajdhani'] font-bold uppercase tracking-[2px] rounded ${sizeClasses[size]} shimmer-animation`}
      style={{
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        color: 'var(--neon-gold)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)'
      }}
    >
      {tag}
    </span>
  );
};
