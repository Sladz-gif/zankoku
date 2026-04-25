import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, ChevronLeft, ChevronRight, Play, RotateCcw, Lock } from 'lucide-react';

const TutorialPowerMoves = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to Power Moves",
      content: "Power moves are special abilities that can turn the tide of battle. Master them to unleash devastating attacks and defenses.",
      demo: "Power move activation overview",
      tip: "Power moves require full resources - use them wisely"
    },
    {
      title: "Building Resources",
      content: "Learn the most efficient ways to build your faction resource. Different strategies work for different situations.",
      demo: "Resource building techniques",
      tip: "Balance resource building with scoring - don't fall behind"
    },
    {
      title: "Offensive Power Moves",
      content: "Offensive power moves can score multiple points at once or block opponent progress. Learn when to strike.",
      demo: "Offensive power move demonstrations",
      tip: "Offensive moves are most effective when opponents are weak"
    },
    {
      title: "Defensive Power Moves",
      content: "Defensive power moves protect your positions and disrupt opponent strategies. Defense can be the best offense.",
      demo: "Defensive techniques and counters",
      tip: "Sometimes preventing opponent points is better than scoring"
    },
    {
      title: "Timing and Strategy",
      content: "The timing of power moves can be more important than the move itself. Learn the art of perfect timing.",
      demo: "Timing examples and strategic moments",
      tip: "Wait for the perfect moment - patience pays off"
    },
    {
      title: "Combination Moves",
      content: "Advanced players combine power moves for devastating effects. Learn to chain moves for maximum impact.",
      demo: "Power move combinations and chains",
      tip: "Combinations require planning and resource management"
    },
    {
      title: "Counter-Power Strategies",
      content: "Learn to counter opponent power moves and turn their strengths against them.",
      demo: "Counter-techniques and defenses",
      tip: "The best counter is often another well-timed power move"
    },
    {
      title: "Resource Recovery",
      content: "After using power moves, learn efficient resource recovery strategies to stay in the fight.",
      demo: "Resource recovery techniques",
      tip: "Quick recovery can give you the edge in extended battles"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompleted(false);
  };

  const handleBackToDojo = () => {
    navigate('/dojo');
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <Zap size={40} className="text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold font-orbitron text-purple-500 mb-4">Power Move Master!</h1>
            <p className="text-lg text-[#6666AA] mb-8">
              You've mastered the art of power moves. Ready to unleash devastating attacks?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-[#1A1A2E] text-[#E8E8FF] rounded-lg font-medium hover:bg-[#2A2A4E] transition-colors"
              >
                <RotateCcw size={20} className="inline mr-2" />
                Review Tutorial
              </button>
              <button
                onClick={() => navigate('/game?opponent=ai-master&type=dot')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(168,85,247,0.5)] transition-all"
              >
                <Zap size={20} className="inline mr-2" />
                Master Challenge
              </button>
              <button
                onClick={handleBackToDojo}
                className="px-6 py-3 bg-gradient-to-r from-[#8B00FF] to-[#5500CC] text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(139,0,255,0.5)] transition-all"
              >
                ←
              </button>
            </div>
          </div>

          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6">
            <h2 className="text-xl font-bold font-orbitron mb-4">Power Move Techniques Mastered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-purple-500" />
                  </div>
                  <span className="text-[#E8E8FF]">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const step = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToDojo}
            className="flex items-center justify-center w-10 h-10 bg-[#1A1A2E] text-[#E8E8FF] rounded-lg hover:bg-[#2A2A4E] transition-all border border-[#333355]"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-purple-500 mr-2" />
            <span className="text-sm text-[#6666AA]">Advanced Tutorial</span>
            <span className="text-sm text-[#6666AA] ml-4">Step</span>
            <span className="text-sm font-medium text-[#E8E8FF]">{currentStep + 1}/{tutorialSteps.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 rounded-full overflow-hidden bg-[#1A1A2E]">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
                background: 'linear-gradient(90deg, #a855f7, #9333ea)'
              }}
            />
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Zap size={32} className="text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-orbitron text-[#E8E8FF] mb-2">{step.title}</h1>
              <div className="flex items-center gap-2 text-sm text-[#6666AA]">
                <Shield size={14} />
                <span>Power Moves Tutorial</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Overview</h3>
              <p className="text-[#6666AA] leading-relaxed">{step.content}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Power Move Practice</h3>
              <div className="bg-[#1A1A2E] rounded-lg p-6">
                <div className="text-[#6666AA] mb-4">{step.demo}</div>
                
                {/* Power Move Board */}
                <div className="bg-[#030308] rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-[#1A1A2E] rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
                        style={{
                          borderColor: i % 2 === 0 ? '#a855f7' : i % 4 === 0 ? '#22c55e' : '#333355',
                          backgroundColor: i % 2 === 0 ? '#a855f720' : i % 4 === 0 ? '#22c55e20' : '#1A1A2E'
                        }}
                      >
                        <div className="w-1 h-1 bg-[#6666AA] rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-xs text-[#6666AA] mb-2">Power Move Training</div>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-purple-400">Power Mode</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400">AI Charging...</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Power Move Description */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Zap size={20} className="text-purple-500 mt-0.5" />
                    <div className="text-purple-400 text-sm">
                      <p className="font-medium mb-2">Power Objective:</p>
                      <p>{step.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Power Tip</h3>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap size={20} className="text-purple-500 mt-0.5" />
                  <p className="text-purple-400 text-sm">{step.tip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'bg-[#1A1A2E] text-[#333355] cursor-not-allowed'
                : 'bg-[#1A1A2E] text-[#E8E8FF] hover:bg-[#2A2A4E]'
            }`}
          >
            <ChevronLeft size={20} className="inline mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(168,85,247,0.5)] transition-all"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight size={20} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialPowerMoves;
