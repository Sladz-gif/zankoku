import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Shield, Target, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';

const TutorialBasicCombat = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to Basic Combat",
      content: "In this tutorial, you'll learn the fundamental mechanics of battle in Zankoku. Master these basics to become a formidable warrior.",
      demo: "Basic battle interface overview",
      tip: "Pay attention to the turn indicators and resource bars"
    },
    {
      title: "Understanding the Battle Grid",
      content: "The battle grid is where you'll place your lines to create shapes. Each dot can connect to adjacent dots to form lines.",
      demo: "4x4 grid with dots and connection points",
      tip: "Think ahead - each line you place affects future moves"
    },
    {
      title: "Creating Shapes",
      content: "Complete squares and triangles by connecting dots. Squares give you 1 point, triangles give you 2 points.",
      demo: "Animation showing square and triangle completion",
      tip: "Triangles are worth more but harder to complete"
    },
    {
      title: "Turn-Based Combat",
      content: "You and your opponent take turns placing lines. The player who completes a shape gets another turn.",
      demo: "Turn indicator and player switching",
      tip: "Force your opponent to give you completion opportunities"
    },
    {
      title: "Resources and Power Moves",
      content: "Build up your faction resource by completing shapes. Use power moves when your resource bar is full.",
      demo: "Resource bar filling and power move activation",
      tip: "Save power moves for critical moments"
    },
    {
      title: "Winning the Battle",
      content: "The battle ends when all possible lines are placed. The player with the most points wins!",
      demo: "Final score comparison and victory screen",
      tip: "Sometimes blocking is better than scoring"
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
    navigate('/game?opponent=ai-tutorial&type=dot');
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Sword size={40} className="text-green-500" />
            </div>
            <h1 className="text-4xl font-bold font-orbitron text-green-500 mb-4">Tutorial Complete!</h1>
            <p className="text-lg text-[#6666AA] mb-8">
              You've mastered the basics of combat. Ready to test your skills?
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
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(34,197,94,0.5)] transition-all"
              >
                <Play size={20} className="inline mr-2" />
                Practice vs AI
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
            <h2 className="text-xl font-bold font-orbitron mb-4">What You've Learned</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-green-500" />
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
    <>
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
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)'
                }}
              />
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Sword size={32} className="text-green-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-orbitron text-[#E8E8FF] mb-2">{step.title}</h1>
                <div className="flex items-center gap-2 text-sm text-[#6666AA]">
                  <Target size={14} />
                  <span>Basic Combat Tutorial</span>
                </div>
              </div>
            </div>

            <div className="text-[#B8B8D0] leading-relaxed mb-8">
              {step.content}
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target size={20} className="text-green-500 mt-0.5" />
                <p className="text-green-400 text-sm">{step.tip}</p>
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
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-[0_0_16px_rgba(34,197,94,0.5)] transition-all"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight size={20} className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
      
      <ScrollToTop />
    </>
  );
};

export default TutorialBasicCombat;
