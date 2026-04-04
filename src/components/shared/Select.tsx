import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 pr-10
          bg-[var(--bg-elevated)] 
          border border-[var(--border)]
          rounded-lg
          font-['Rajdhani'] text-[var(--text-primary)]
          focus:outline-none focus:border-[var(--neon-blue)] focus:shadow-[0_0_12px_var(--neon-blue)40]
          disabled:opacity-50 disabled:cursor-not-allowed
          appearance-none
          cursor-pointer
          transition-all
          ${className}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={18} strokeWidth={1.5} className="text-[var(--text-muted)]" />
      </div>
    </div>
  );
};
