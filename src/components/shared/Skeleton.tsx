import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style, children }) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export const SkeletonText: React.FC<{ width?: 'short' | 'medium' | 'full' }> = ({ width = 'medium' }) => {
  return (
    <div className={`skeleton-text skeleton-text-${width}`} />
  );
};

export const SkeletonAvatar: React.FC = () => {
  return <div className="skeleton-avatar" />;
};

export const SkeletonCard: React.FC = () => {
  return <div className="skeleton-card" />;
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="list-item animate-in">
          <SkeletonCard />
        </div>
      ))}
    </>
  );
};
