import { useState, useEffect } from 'react';
import { X, Heart, Crown, Sparkles } from 'lucide-react';

interface SupportPopupProps {
  onClose: () => void;
}

const SupportPopup = ({ onClose }: SupportPopupProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const supportOptions = [
    { amount: 5, label: 'Coffee', icon: '☕', color: 'from-orange-500 to-orange-600' },
    { amount: 10, label: 'Snack', icon: '🍕', color: 'from-red-500 to-red-600' },
    { amount: 25, label: 'Meal', icon: '🍔', color: 'from-yellow-500 to-yellow-600' },
    { amount: 50, label: 'Supporter', icon: '⭐', color: 'from-purple-500 to-purple-600' },
    { amount: 100, label: 'Champion', icon: '👑', color: 'from-pink-500 to-pink-600' },
  ];

  const handleSupport = async () => {
    if (!selectedAmount) return;
    
    setIsProcessing(true);
    
    // Send to checkout with selected amount
    const checkoutData = {
      itemName: `Support Zankoku - $${selectedAmount}`,
      price: selectedAmount,
      currency: 'USD',
      type: 'support'
    };
    
    // Navigate to checkout with state
    window.location.href = `/checkout?support=true&amount=${selectedAmount}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-8 shadow-2xl border border-purple-700/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Support Zankoku</h2>
          <p className="text-purple-200 text-sm">
            Help us keep the battle going! Your support keeps Zankoku free and awesome for everyone.
          </p>
        </div>
        
        {/* Support Options */}
        <div className="space-y-3 mb-6">
          {supportOptions.map((option) => (
            <button
              key={option.amount}
              onClick={() => setSelectedAmount(option.amount)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedAmount === option.amount
                  ? 'border-white bg-white/20 shadow-lg scale-105'
                  : 'border-purple-600/50 bg-purple-800/30 hover:border-purple-500 hover:bg-purple-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="text-left">
                    <div className="text-white font-semibold">{option.label}</div>
                    <div className="text-purple-200 text-sm">Thank you for your support!</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">${option.amount}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Support Button */}
        <button
          onClick={handleSupport}
          disabled={!selectedAmount || isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
            selectedAmount && !isProcessing
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Support Zankoku ${selectedAmount || ''}
            </div>
          )}
        </button>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-purple-300 text-xs">
            Every contribution helps us improve the game and add new features.
          </p>
          <p className="text-purple-400 text-xs mt-1">
            Thank you for being part of the Zankoku community! 💜
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPopup;
