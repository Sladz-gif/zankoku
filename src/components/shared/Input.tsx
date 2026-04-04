import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  icon?: LucideIcon;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  icon: Icon,
  error,
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={18} strokeWidth={1.5} className="text-[var(--text-muted)]" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 ${Icon ? 'pl-12' : ''}
            bg-[var(--bg-elevated)] 
            border border-[var(--border)]
            rounded-lg
            font-['Rajdhani'] text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none focus:border-[var(--neon-blue)] focus:shadow-[0_0_12px_var(--neon-blue)40]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
            ${error ? 'border-[var(--neon-red)] focus:border-[var(--neon-red)] focus:shadow-[0_0_12px_var(--neon-red)40]' : ''}
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-['Rajdhani'] text-[var(--neon-red)]">
          {error}
        </p>
      )}
    </div>
  );
};
