import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Target, ChevronLeft, ChevronRight, Play, RotateCcw, Lock, Trophy } from 'lucide-react';

const TutorialTournamentPrep = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to Tournament Preparation",
      content: "Tournaments require special preparation. Learn the strategies that separate champions from contenders.",
      demo: "Tournament overview and structure",
      tip: "Tournament success begins long before the first match"
    },
    {
      title: "Mental Preparation",
      content: "Tournament pressure can affect performance. Learn mental techniques to stay focused and confident.",
      demo: "Mental preparation exercises",
      tip: "Confidence comes from preparation, not just talent"
    },
    {
      title: "Study Your Opponents",
      content: "Research opponent patterns and tendencies. Knowledge is power in tournament play.",
      demo: "Opponent analysis techniques",
      tip: "Every player has patterns - find and exploit them"
    },
    {
      title: "Tournament Strategies",
      content: "Different tournament formats require different strategies. Adapt your style to the format.",
      demo: "Format-specific strategies",
      tip: "Know the rules better than your opponents"
    },
    {
      title: "Energy Management",
      content: "Tournaments are marathons, not sprints. Learn to conserve energy for crucial moments.",
      demo: "Energy conservation techniques",
      tip: "Pace yourself - the final match matters most"
    },
    {
      title: "Adaptation Skills",
      content: "The ability to adapt mid-tournament is crucial. Learn to adjust strategies on the fly.",
      demo: "In-tournament adaptation examples",
      tip: "Flexibility beats rigid planning in tournaments"
    },
    {
      title: "Pressure Situations",
      content: "Tournaments create high-pressure situations. Learn to thrive when the stakes are highest.",
      demo: "Pressure handling techniques",
      tip: "Embrace pressure - it's what makes victory meaningful"
    },
    {
      title: "Championship Mindset",
      content: "Develop the mindset of a champion. Learn from defeats and build on victories.",
      demo: "Champion mentality development",
      tip: "Champions learn more from defeats than victories"
    },
    {
      title: "Post-Tournament Analysis",
      content: "Review and learn from every tournament performance. Continuous improvement is key.",
      demo: "Performance analysis methods",
      tip: "Every tournament is a learning opportunity"
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
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} className="text-amber-500" />
            </div>
            <h1 className="text-4xl font-bold font-orbitron text-amber-500 mb-4">Tournament Champion!</h1>
            <p className="text-lg text-[#6666AA] mb-8">
              You've mastered tournament preparation. Ready to claim your championship title?
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
                onClick={() => navigate('/leaderboard')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(245,158,11,0.5)] transition-all"
              >
                <Trophy size={20} className="inline mr-2" />
                View Tournaments
              </button>
              <button
                onClick={handleBackToDojo}
                className="px-6 py-3 bg-gradient-to-r from-[#8B00FF] to-[#5500CC] text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(139,0,255,0.5)] transition-all"
              >
                Back to Dojo
              </button>
            </div>
          </div>

          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6">
            <h2 className="text-xl font-bold font-orbitron mb-4">Tournament Skills Mastered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Award size={16} className="text-amber-500" />
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
            <Lock size={16} className="text-amber-500 mr-2" />
            <span className="text-sm text-[#6666AA]">Expert Tutorial</span>
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
                background: 'linear-gradient(90deg, #f59e0b, #d97706)'
              }}
            />
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Trophy size={32} className="text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-orbitron text-[#E8E8FF] mb-2">{step.title}</h1>
              <div className="flex items-center gap-2 text-sm text-[#6666AA]">
                <Target size={14} />
                <span>Tournament Preparation</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Overview</h3>
              <p className="text-[#6666AA] leading-relaxed">{step.content}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Tournament Practice</h3>
              <div className="bg-[#1A1A2E] rounded-lg p-6">
                <div className="text-[#6666AA] mb-4">{step.demo}</div>
                
                {/* Tournament Board */}
                <div className="bg-[#030308] rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-[#1A1A2E] rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
                        style={{
                          borderColor: i % 3 === 0 ? '#f59e0b' : i % 5 === 0 ? '#ef4444' : '#333355',
                          backgroundColor: i % 3 === 0 ? '#f59e0b20' : i % 5 === 0 ? '#ef444420' : '#1A1A2E'
                        }}
                      >
                        <div className="w-1 h-1 bg-[#6666AA] rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-xs text-[#6666AA] mb-2">Championship Simulation</div>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-400">Tournament Mode</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400">Champion AI</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tournament Description */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Trophy size={20} className="text-amber-500 mt-0.5" />
                    <div className="text-amber-400 text-sm">
                      <p className="font-medium mb-2">Tournament Objective:</p>
                      <p>{step.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Champion Tip</h3>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Trophy size={20} className="text-amber-500 mt-0.5" />
                  <p className="text-amber-400 text-sm">{step.tip}</p>
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
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(245,158,11,0.5)] transition-all"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight size={20} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialTournamentPrep;
