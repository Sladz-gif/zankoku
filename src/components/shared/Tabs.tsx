import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTab, 
  onChange,
  variant = 'default'
}) => {
  if (variant === 'pills') {
    return (
      <div className="flex gap-2 p-1 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md
              font-['Rajdhani'] font-semibold text-sm uppercase tracking-wider
              transition-all
              ${activeTab === tab.id 
                ? 'bg-[var(--neon-blue)] text-white shadow-[0_0_12px_var(--neon-blue)40]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1 border-b border-[var(--border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-2 px-6 py-3
            font-['Rajdhani'] font-semibold text-sm uppercase tracking-wider
            transition-all relative
            ${activeTab === tab.id 
              ? 'text-[var(--neon-blue)]' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }
          `}
        >
          {tab.icon}
          {tab.label}
          {activeTab === tab.id && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--neon-blue)]"
              style={{ boxShadow: '0 0 8px var(--neon-blue)' }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
