import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Zap, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';

const TutorialFightingStyles = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to Fighting Styles",
      content: "Different fighting styles suit different players. Find your style and master it to dominate the battlefield.",
      demo: "Overview of different combat approaches",
      tip: "The best style is one that matches your natural instincts"
    },
    {
      title: "Aggressive Style",
      content: "Aggressive players focus on constant pressure, forcing opponents to react. This style requires quick thinking and risk-taking.",
      demo: "High-pressure offensive patterns",
      tip: "Aggression works best when balanced with tactical awareness"
    },
    {
      title: "Defensive Style",
      content: "Defensive players wait for opponents to make mistakes, then capitalize. This style requires patience and pattern recognition.",
      demo: "Counter-attack and defensive formations",
      tip: "Defense wins games, but you must know when to switch to offense"
    },
    {
      title: "Balanced Style",
      content: "Balanced players adapt to situations, switching between offense and defense as needed. This is the most versatile style.",
      demo: "Adaptive gameplay examples",
      tip: "Balance requires reading the game state and adjusting accordingly"
    },
    {
      title: "Territorial Style",
      content: "Territorial players focus on controlling specific areas of the board, creating zones of dominance.",
      demo: "Board control and zone strategies",
      tip: "Control the center, but don't neglect the edges"
    },
    {
      title: "Resource-Focused Style",
      content: "This style prioritizes building resources for powerful moves, even at the cost of early points.",
      demo: "Resource accumulation and timing",
      tip: "Resource focus requires patience - don't wait too long to strike"
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

  const handlePractice = () => {
    navigate('/game?opponent=ai-practice&type=dot');
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <Target size={40} className="text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold font-orbitron text-yellow-500 mb-4">Style Mastery!</h1>
            <p className="text-lg text-[#6666AA] mb-8">
              You've explored different fighting styles. Time to find your signature approach!
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
                onClick={handlePractice}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(234,179,8,0.5)] transition-all"
              >
                <Play size={20} className="inline mr-2" />
                Practice Styles
              </button>
              <button
                onClick={() => navigate('/dojo')}
                className="px-6 py-3 bg-gradient-to-r from-[#8B00FF] to-[#5500CC] text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(139,0,255,0.5)] transition-all"
              >
                ←
              </button>
            </div>
          </div>

          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6">
            <h2 className="text-xl font-bold font-orbitron mb-4">Fighting Styles Explored</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Zap size={16} className="text-yellow-500" />
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
            onClick={() => navigate('/dojo')}
            className="flex items-center justify-center w-10 h-10 bg-[#1A1A2E] text-[#E8E8FF] rounded-lg hover:bg-[#2A2A4E] transition-all border border-[#333355]"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6666AA]">Step</span>
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
                background: 'linear-gradient(90deg, #eab308, #ca8a04)'
              }}
            />
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Target size={32} className="text-yellow-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-orbitron text-[#E8E8FF] mb-2">{step.title}</h1>
              <div className="flex items-center gap-2 text-sm text-[#6666AA]">
                <Zap size={14} />
                <span>Fighting Styles Tutorial</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Overview</h3>
              <p className="text-[#6666AA] leading-relaxed">{step.content}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Style Practice</h3>
              <div className="bg-[#1A1A2E] rounded-lg p-6">
                <div className="text-[#6666AA] mb-4">{step.demo}</div>
                
                {/* Style Game Board */}
                <div className="bg-[#030308] rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-[#1A1A2E] rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
                        style={{
                          borderColor: i % 4 === 0 ? '#eab308' : i % 7 === 0 ? '#f97316' : '#333355',
                          backgroundColor: i % 4 === 0 ? '#eab30820' : i % 7 === 0 ? '#f9731620' : '#1A1A2E'
                        }}
                      >
                        <div className="w-1 h-1 bg-[#6666AA] rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-xs text-[#6666AA] mb-2">Style Adaptation Practice</div>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-yellow-400">Your Style</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400">AI Adapting...</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Style Description */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Zap size={20} className="text-yellow-500 mt-0.5" />
                    <div className="text-yellow-400 text-sm">
                      <p className="font-medium mb-2">Style Objective:</p>
                      <p>{step.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Style Tip</h3>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap size={20} className="text-yellow-500 mt-0.5" />
                  <p className="text-yellow-400 text-sm">{step.tip}</p>
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
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(234,179,8,0.5)] transition-all"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight size={20} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialFightingStyles;
