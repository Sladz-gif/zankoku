import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Brain, Target, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';

const TutorialAdvancedStrategies = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to Advanced Strategies",
      content: "Now that you've mastered the basics, let's dive into advanced tactics that separate good players from great ones.",
      demo: "Advanced tactical overview",
      tip: "Advanced strategies require patience and foresight"
    },
    {
      title: "Pattern Recognition",
      content: "Learn to recognize common patterns and setups. Understanding patterns helps you anticipate your opponent's moves and set up traps.",
      demo: "Common opening patterns and responses",
      tip: "Study the board 3-4 moves ahead, not just the current move"
    },
    {
      title: "Forced Moves Theory",
      content: "Sometimes the best move is one that forces your opponent's response. Control the game by limiting your opponent's options.",
      demo: "Examples of forced move sequences",
      tip: "A forced move is worth more than a point if it leads to bigger gains"
    },
    {
      title: "Sacrifice Strategies",
      content: "Learn when to sacrifice a point or shape to gain a strategic advantage. Sometimes giving up a small win leads to a bigger victory.",
      demo: "Sacrifice plays that lead to multiple completions",
      tip: "Never sacrifice unless you have a clear plan for recovery"
    },
    {
      title: "Resource Management",
      content: "Advanced resource management involves timing your power moves perfectly and understanding when to build vs when to strike.",
      demo: "Resource timing and power move combinations",
      tip: "Save resources for critical moments, but don't hoard them"
    },
    {
      title: "Psychological Warfare",
      content: "Beyond the board, learn to read your opponent's patterns and use psychological tactics to gain an edge.",
      demo: "Reading opponent tendencies and adapting",
      tip: "Every player has tells - learn to recognize and exploit them"
    },
    {
      title: "Endgame Mastery",
      content: "The endgame requires different strategies. Learn to calculate final positions and maximize your scoring opportunities.",
      demo: "Endgame counting and position optimization",
      tip: "In the endgame, every single line matters"
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
            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <Brain size={40} className="text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold font-orbitron text-orange-500 mb-4">Advanced Mastery!</h1>
            <p className="text-lg text-[#6666AA] mb-8">
              You've mastered advanced combat strategies. Ready to challenge skilled opponents?
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
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(251,146,60,0.5)] transition-all"
              >
                <Play size={20} className="inline mr-2" />
                Practice vs AI
              </button>
              <button
                onClick={() => navigate('/dojo')}
                className="px-6 py-3 bg-gradient-to-r from-[#8B00FF] to-[#5500CC] text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(139,0,255,0.5)] transition-all"
              >
                Back to Dojo
              </button>
            </div>
          </div>

          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6">
            <h2 className="text-xl font-bold font-orbitron mb-4">Advanced Techniques Mastered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-orange-500" />
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
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] text-[#E8E8FF] rounded-lg font-medium hover:bg-[#2A2A4E] transition-all border border-[#333355]"
          >
            <ChevronLeft size={20} />
            Back to Dojo
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
                background: 'linear-gradient(90deg, #f97316, #ea580c)'
              }}
            />
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Brain size={32} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-orbitron text-[#E8E8FF] mb-2">{step.title}</h1>
              <div className="flex items-center gap-2 text-sm text-[#6666AA]">
                <Target size={14} />
                <span>Advanced Strategies Tutorial</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Overview</h3>
              <p className="text-[#6666AA] leading-relaxed">{step.content}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Strategic Practice</h3>
              <div className="bg-[#1A1A2E] rounded-lg p-6">
                <div className="text-[#6666AA] mb-4">{step.demo}</div>
                
                {/* Advanced Game Board */}
                <div className="bg-[#030308] rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-[#1A1A2E] rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
                        style={{
                          borderColor: i % 3 === 0 ? '#f97316' : i % 5 === 0 ? '#22c55e' : '#333355',
                          backgroundColor: i % 3 === 0 ? '#f9731620' : i % 5 === 0 ? '#22c55e20' : '#1A1A2E'
                        }}
                      >
                        <div className="w-1 h-1 bg-[#6666AA] rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-xs text-[#6666AA] mb-2">Advanced AI Practice</div>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-orange-400">Strategy Mode</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400">AI Planning...</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Description */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Target size={20} className="text-orange-500 mt-0.5" />
                    <div className="text-orange-400 text-sm">
                      <p className="font-medium mb-2">Strategic Objective:</p>
                      <p>{step.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Mastery Tip</h3>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target size={20} className="text-orange-500 mt-0.5" />
                  <p className="text-orange-400 text-sm">{step.tip}</p>
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
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(251,146,60,0.5)] transition-all"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight size={20} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialAdvancedStrategies;
