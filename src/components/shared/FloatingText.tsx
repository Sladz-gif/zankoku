import React, { useEffect, useState } from 'react';

interface FloatingTextProps {
  text: string;
  color: string;
  type: 'technique' | 'quote';
  mood?: 'mocking' | 'confident' | 'unsettled' | 'angry' | 'sad' | 'cold' | 'unhinged';
  player?: 1 | 2;
  onComplete?: () => void;
}

const MOOD_COLORS: Record<string, string> = {
  mocking: 'var(--neon-blue)',
  confident: 'var(--neon-gold)',
  unsettled: '#7766AA',
  angry: 'var(--neon-red)',
  sad: '#446688',
  cold: 'rgba(255,255,255,0.7)',
  unhinged: 'var(--neon-green)'
};

export const FloatingText: React.FC<FloatingTextProps> = ({ 
  text, 
  color, 
  type,
  mood,
  player,
  onComplete 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = type === 'technique' ? 2200 : 4000;
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [type, onComplete]);

  if (!visible) return null;

  if (type === 'technique') {
    return (
      <div
        className="fixed top-[35%] left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-float-up"
        style={{
          color,
          textShadow: `0 0 30px ${color}, 0 0 60px ${color}80`,
          fontSize: '48px',
          fontFamily: 'Orbitron',
          fontWeight: 900,
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}
      >
        {text}
      </div>
    );
  }

  const quoteColor = mood ? MOOD_COLORS[mood] : color;
  const position = player === 1 ? 'left-[10%]' : 'right-[10%]';
  const animation = player === 1 ? 'animate-quote-drift-right' : 'animate-quote-drift-left';

  return (
    <div
      className={`fixed top-1/2 ${position} -translate-y-1/2 z-40 pointer-events-none ${animation} ${mood === 'unhinged' ? 'animate-flicker' : ''}`}
      style={{
        color: quoteColor,
        textShadow: `0 0 20px ${quoteColor}80`,
        fontSize: '18px',
        fontFamily: 'Rajdhani',
        fontStyle: 'italic',
        fontWeight: 400,
        maxWidth: '300px'
      }}
    >
      {text}
    </div>
  );
};
