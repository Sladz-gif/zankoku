import { useState } from 'react';
import { Heart, X, ChevronUp } from 'lucide-react';

interface SupportSectionProps {
  onClick: () => void;
  onClose: () => void;
}

const SupportSection = ({ onClick, onClose }: SupportSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out">
      {/* Collapsed State */}
      {!isExpanded ? (
        <div 
          className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={() => setIsExpanded(true)}
        >
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-lg animate-pulse" />
          
          {/* Main button */}
          <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-pink-400/30">
            <Heart size={16} className="animate-pulse" />
            <span className="text-sm font-medium">Support Zankoku</span>
            <ChevronUp size={14} className="transition-transform group-hover:translate-y-[-1px]" />
          </div>
          
          {/* Hover hint */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
              Click to support our development
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      ) : (
        /* Expanded State */
        <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-gray-700/50 min-w-[280px] max-w-[320px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Support Zankoku</h3>
                <p className="text-gray-400 text-xs">Help us keep the battle going!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          {/* Support Options */}
          <div className="space-y-2 mb-3">
            {[
              { amount: 5, label: 'Coffee', emoji: '☕' },
              { amount: 10, label: 'Snack', emoji: '🍕' },
              { amount: 25, label: 'Meal', emoji: '🍔' },
            ].map((option) => (
              <button
                key={option.amount}
                onClick={() => onClick()}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                    {option.label}
                  </span>
                </div>
                <span className="text-pink-400 font-semibold text-sm">${option.amount}</span>
              </button>
            ))}
          </div>

          {/* More Options */}
          <button
            onClick={() => onClick()}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg font-medium text-sm hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            Support Development
          </button>

          {/* Collapse Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="w-full mt-2 text-gray-400 hover:text-gray-300 text-xs transition-colors"
          >
            <ChevronUp size={14} className="inline-block rotate-180 mr-1" />
            Minimize
          </button>
        </div>
      )}
    </div>
  );
};

export default SupportSection;
