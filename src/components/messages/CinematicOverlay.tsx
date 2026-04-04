import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '@/context/GameContext';

const CinematicOverlay: React.FC = () => {
  const { cinematicTriggers } = useGame();
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoDismissTimer, setAutoDismissTimer] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (cinematicTriggers.length > 0) {
      const latestTrigger = cinematicTriggers[cinematicTriggers.length - 1];
      setActiveTrigger(latestTrigger.text);
      setIsVisible(true);
      
      // Clear any existing timer
      if (autoDismissTimer) {
        clearTimeout(autoDismissTimer);
      }
      
      // Set auto-dismiss timer based on intensity
      const duration = latestTrigger.duration;
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setActiveTrigger(null);
        }, 500); // Wait for fade out
      }, duration);
      
      setAutoDismissTimer(timer);
    }
  }, [cinematicTriggers]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoDismissTimer) {
        clearTimeout(autoDismissTimer);
      }
    };
  }, [autoDismissTimer]);
  
  const handleClick = () => {
    // Dismiss immediately when clicked
    if (autoDismissTimer) {
      clearTimeout(autoDismissTimer);
      setAutoDismissTimer(null);
    }
    setIsVisible(false);
    setTimeout(() => {
      setActiveTrigger(null);
    }, 500); // Wait for fade out
  };
  
  if (!activeTrigger) return null;
  
  const overlayContent = (
    <div 
      className="fixed inset-0 z-[9999] cursor-pointer"
      style={{
        background: isVisible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',
        transition: 'background 0.3s ease'
      }}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center h-full">
        <div
          className="text-center px-4 select-none"
          style={{
            fontFamily: 'Orbitron',
            fontWeight: 900,
            fontSize: 'clamp(32px, 6vw, 64px)',
            color: 'white',
            textShadow: '0 0 40px var(--neon-purple), 0 0 80px var(--neon-purple)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.4s ease',
            pointerEvents: 'none' // Prevent text selection
          }}
        >
          {activeTrigger}
        </div>
        
        {/* Click to dismiss hint */}
        <div 
          className="absolute bottom-8 text-center"
          style={{
            opacity: isVisible ? 0.6 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none'
          }}
        >
          <p 
            className="text-xs"
            style={{
              fontFamily: 'Rajdhani',
              color: 'var(--text-muted)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}
          >
            Click anywhere to dismiss
          </p>
        </div>
      </div>
    </div>
  );
  
  return createPortal(overlayContent, document.body);
};

export default CinematicOverlay;
