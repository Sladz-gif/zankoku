import React from 'react';

interface DateSeparatorProps {
  timestamp: number;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ timestamp }) => {
  const formatDate = (ts: number) => {
    const now = new Date();
    const date = new Date(ts);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="flex justify-center my-4">
      <div 
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          fontFamily: 'Rajdhani'
        }}
      >
        {formatDate(timestamp)}
      </div>
    </div>
  );
};

export default DateSeparator;
