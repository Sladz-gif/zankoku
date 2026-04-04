import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-["Rajdhani"] font-bold uppercase tracking-wider rounded transition-all';
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  const variantClasses = {
    primary: 'bg-[var(--neon-blue)] text-white hover:bg-[var(--neon-blue)]/90 shadow-[0_0_20px_var(--neon-blue)40]',
    secondary: 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-active)] hover:bg-[var(--bg-surface)]',
    danger: 'bg-[var(--neon-red)] text-white hover:bg-[var(--neon-red)]/90 shadow-[0_0_20px_var(--neon-red)40]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? disabledClasses : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} strokeWidth={1.5} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} strokeWidth={1.5} />}
    </button>
  );
};
