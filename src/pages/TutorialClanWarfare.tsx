import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, ChevronLeft, ChevronRight, Play, RotateCcw, Lock } from 'lucide-react';

const TutorialClanWarfare = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to Clan Warfare",
      content: "Clan battles require coordination, strategy, and teamwork. Master the art of fighting alongside your clanmates.",
      demo: "Clan battle coordination overview",
      tip: "Communication is the key to clan victory"
    },
    {
      title: "Clan Roles and Positions",
      content: "Every clan member has a role. Understanding your position and how it supports the team is crucial for success.",
      demo: "Different clan roles and responsibilities",
      tip: "Play to your strengths but support your team's needs"
    },
    {
      title: "Coordinated Attacks",
      content: "Learn to time attacks with your clanmates. Coordinated strikes can overwhelm opponents and secure victory.",
      demo: "Synchronized attack patterns",
      tip: "Timing is everything - a second too early or late can fail the attack"
    },
    {
      title: "Defensive Formations",
      content: "Clan defense requires creating impenetrable formations. Learn to protect your team while setting up counter-attacks.",
      demo: "Defensive positioning and formations",
      tip: "A good defense creates opportunities for offense"
    },
    {
      title: "Resource Sharing",
      content: "In clan battles, resources are shared. Learn when to use resources for the team versus personal gain.",
      demo: "Resource management in team context",
      tip: "Sometimes sacrificing personal advantage helps the team win"
    },
    {
      title: "Battle Communication",
      content: "Effective communication during battle can turn the tide. Learn the signals and strategies teams use.",
      demo: "Communication methods and signals",
      tip: "Clear, concise communication saves precious time"
    },
    {
      title: "Clan Tournament Strategy",
      content: "Tournament play requires different strategies than regular battles. Preparation and adaptation are key.",
      demo: "Tournament preparation and adaptation",
      tip: "Study your opponents but be ready to improvise"
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
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-red-500" />
            </div>
            <h1 className="text-4xl font-bold font-orbitron text-red-500 mb-4">Clan Warfare Expert!</h1>
            <p className="text-lg text-[#6666AA] mb-8">
              You've mastered clan battle strategies. Ready to lead your clan to victory?
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
                onClick={() => navigate('/clans')}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(239,68,68,0.5)] transition-all"
              >
                <Users size={20} className="inline mr-2" />
                Visit Clans
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
            <h2 className="text-xl font-bold font-orbitron mb-4">Clan Warfare Techniques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-red-500" />
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
    <div className="min-h-screen bg-[#030308] text-[#E8E8FF] px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/dojo')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] text-[#E8E8FF] rounded-lg font-medium hover:bg-[#2A2A4E] transition-all border border-[#333355]"
          >
            <ChevronLeft size={20} />
            Back to Dojo
          </button>
          
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-red-500 mr-2" />
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
                background: 'linear-gradient(90deg, #ef4444, #dc2626)'
              }}
            />
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-4 sm:p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Users size={24} className="sm:hidden text-red-500" />
              <Users size={32} className="hidden sm:block text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-orbitron text-[#E8E8FF] mb-2">{step.title}</h1>
              <div className="flex items-center gap-2 text-sm text-[#6666AA]">
                <Shield size={14} />
                <span>Clan Warfare Tutorial</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Overview</h3>
              <p className="text-[#6666AA] leading-relaxed">{step.content}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Clan Battle Practice</h3>
              <div className="bg-[#1A1A2E] rounded-lg p-4 sm:p-6">
                <div className="text-[#6666AA] mb-4">{step.demo}</div>
                
                {/* Clan Battle Board */}
                <div className="bg-[#030308] rounded-lg p-3 sm:p-4 mb-4">
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-xs sm:max-w-sm mx-auto">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-[#1A1A2E] rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
                        style={{
                          borderColor: i % 2 === 0 ? '#ef4444' : i % 3 === 0 ? '#3b82f6' : '#333355',
                          backgroundColor: i % 2 === 0 ? '#ef444420' : i % 3 === 0 ? '#3b82f620' : '#1A1A2E'
                        }}
                      >
                        <div className="w-1 h-1 bg-[#6666AA] rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-3 sm:mt-4">
                    <div className="text-xs text-[#6666AA] mb-2">Team Battle Simulation</div>
                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-400">Your Clan</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400">Enemy Clan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clan Strategy Description */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <div className="flex-shrink-0">
                      <Users size={18} className="sm:hidden text-red-500" />
                      <Users size={20} className="hidden sm:block text-red-500" />
                    </div>
                    <div className="text-red-400 text-sm">
                      <p className="font-medium mb-2">Clan Objective:</p>
                      <p>{step.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#E8E8FF] mb-3">Clan Tip</h3>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="flex-shrink-0">
                    <Users size={18} className="sm:hidden text-red-500" />
                    <Users size={20} className="hidden sm:block text-red-500" />
                  </div>
                  <p className="text-red-400 text-sm">{step.tip}</p>
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
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(239,68,68,0.5)] transition-all"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight size={20} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialClanWarfare;
