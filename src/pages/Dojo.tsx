import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { getFactionColor } from '@/lib/gameUtils';
import { Sword, Shield, Target, BookOpen, Award, Zap, Users, ChevronRight, ChevronLeft, Play, Lock, Bot, Brain } from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';

const Dojo = () => {
  const navigate = useNavigate();
  const { currentUser } = useGame();
  const factionColor = currentUser ? getFactionColor(currentUser.anime) : '#8B00FF';

  const tutorials = [
    {
      id: 1,
      title: "Basic Combat",
      description: "Learn the fundamentals of battle mechanics",
      difficulty: "Beginner",
      duration: "5 min",
      icon: Sword,
      locked: false,
      path: "/tutorial/basic-combat"
    },
    {
      id: 2,
      title: "Advanced Strategies",
      description: "Master advanced battle tactics and combos",
      difficulty: "Advanced",
      duration: "10 min",
      icon: Shield,
      locked: false,
      path: "/tutorial/advanced-strategies"
    },
    {
      id: 3,
      title: "Fighting Styles",
      description: "Explore different combat styles and techniques",
      difficulty: "Intermediate",
      duration: "8 min",
      icon: Target,
      locked: false,
      path: "/tutorial/fighting-styles"
    },
    {
      id: 4,
      title: "Clan Warfare",
      description: "Team strategies and clan battle tactics",
      difficulty: "Expert",
      duration: "15 min",
      icon: Users,
      locked: true,
      path: "/tutorial/clan-warfare"
    },
    {
      id: 5,
      title: "Power Moves",
      description: "Unlock and master special abilities",
      difficulty: "Advanced",
      duration: "12 min",
      icon: Zap,
      locked: true,
      path: "/tutorial/power-moves"
    },
    {
      id: 6,
      title: "Tournament Prep",
      description: "Prepare for competitive battles",
      difficulty: "Expert",
      duration: "20 min",
      icon: Award,
      locked: true,
      path: "/tutorial/tournament-prep"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleTutorialClick = (tutorial: typeof tutorials[0]) => {
    if (!tutorial.locked) {
      navigate(tutorial.path);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#030308] text-[#E8E8FF] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/battle-lobby')}
            className="flex items-center justify-center w-10 h-10 bg-[#1A1A2E] text-[#E8E8FF] rounded-lg hover:bg-[#2A2A4E] transition-all border border-[#333355]"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold font-orbitron mb-4">TRAINING DOJO</h1>
            <p className="text-lg text-[#6666AA] max-w-2xl mx-auto">
              Master the art of battle through comprehensive training modules and tutorials
            </p>
          </div>
          
          <div className="w-40"></div> {/* Spacer for centering */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#8B00FF]/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-[#8B00FF]" />
            </div>
            <div className="text-2xl font-bold text-[#E8E8FF] mb-1">6</div>
            <div className="text-sm text-[#6666AA]">Training Modules</div>
          </div>
          
          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#00C8FF]/20 flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-[#00C8FF]" />
            </div>
            <div className="text-2xl font-bold text-[#E8E8FF] mb-1">3</div>
            <div className="text-sm text-[#6666AA]">Completed</div>
          </div>
          
          <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FF003C]/20 flex items-center justify-center mx-auto mb-4">
              <Zap size={32} className="text-[#FF003C]" />
            </div>
            <div className="text-2xl font-bold text-[#E8E8FF] mb-1">750</div>
            <div className="text-sm text-[#6666AA]">Training Points</div>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => {
            const Icon = tutorial.icon;
            return (
              <div
                key={tutorial.id}
                onClick={() => handleTutorialClick(tutorial)}
                className={`bg-[#080812] border rounded-lg p-6 transition-all cursor-pointer ${
                  tutorial.locked
                    ? 'border-[#1A1A2E] opacity-60 cursor-not-allowed'
                    : 'border-[#1A1A2E] hover:border-[#2A2A4E] hover:shadow-[0_0_16px_rgba(139,0,255,0.2)]'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    tutorial.locked ? 'bg-[#1A1A2E]' : 'bg-[#8B00FF]/20'
                  }`}>
                    <Icon size={24} className={tutorial.locked ? 'text-[#333355]' : 'text-[#8B00FF]'} />
                  </div>
                  {tutorial.locked && <Lock size={16} className="text-[#6666AA]" />}
                </div>
                
                <h3 className="text-lg font-bold text-[#E8E8FF] mb-2">{tutorial.title}</h3>
                <p className="text-sm text-[#6666AA] mb-4">{tutorial.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                    <span className="text-xs text-[#6666AA]">{tutorial.duration}</span>
                  </div>
                  
                  {!tutorial.locked && (
                    <button className="flex items-center gap-1 text-[#8B00FF] hover:text-[#BF5FFF] transition-colors">
                      <Play size={16} />
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Training Opponents */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold font-orbitron text-[#E8E8FF] mb-6">AI TRAINING PARTNERS</h2>
          <p className="text-[#6666AA] mb-8 max-w-2xl">
            Practice against AI opponents built on advanced chess AI principles. Each AI has different strategies and difficulty levels.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tutorial AI */}
            <div
              onClick={() => navigate('/game?opponent=ai-tutorial&type=dot')}
              className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 transition-all cursor-pointer hover:border-[#00FF88] hover:shadow-[0_0_16px_rgba(0,255,136,0.2)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#00FF88]/20 flex items-center justify-center">
                  <Brain size={24} className="text-[#00FF88]" />
                </div>
                <div className="px-2 py-1 bg-[#00FF88]/20 rounded text-xs text-[#00FF88] font-medium">
                  Tutorial
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-[#E8E8FF] mb-2">Sensei Bot</h3>
              <p className="text-sm text-[#6666AA] mb-4">Patient teacher AI that makes mistakes to help you learn the basics</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-green-400">Beginner</span>
                  <span className="text-xs text-[#6666AA]">Forgiving</span>
                </div>
                
                <button className="flex items-center gap-1 text-[#00FF88] hover:text-[#40FFAA] transition-colors">
                  <Play size={16} />
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Practice AI */}
            <div
              onClick={() => navigate('/game?opponent=ai-practice&type=dot')}
              className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 transition-all cursor-pointer hover:border-[#FFD700] hover:shadow-[0_0_16px_rgba(255,215,0,0.2)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                  <Bot size={24} className="text-[#FFD700]" />
                </div>
                <div className="px-2 py-1 bg-[#FFD700]/20 rounded text-xs text-[#FFD700] font-medium">
                  Practice
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-[#E8E8FF] mb-2">Rival Bot</h3>
              <p className="text-sm text-[#6666AA] mb-4">Balanced opponent that provides a good challenge with strategic moves</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-yellow-400">Intermediate</span>
                  <span className="text-xs text-[#6666AA]">Strategic</span>
                </div>
                
                <button className="flex items-center gap-1 text-[#FFD700] hover:text-[#FFED8E] transition-colors">
                  <Play size={16} />
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Master AI */}
            <div
              onClick={() => navigate('/game?opponent=ai-master&type=dot')}
              className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-6 transition-all cursor-pointer hover:border-[#FF003C] hover:shadow-[0_0_16px_rgba(255,0,60,0.2)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#FF003C]/20 flex items-center justify-center">
                  <Zap size={24} className="text-[#FF003C]" />
                </div>
                <div className="px-2 py-1 bg-[#FF003C]/20 rounded text-xs text-[#FF003C] font-medium">
                  Master
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-[#E8E8FF] mb-2">Master Bot</h3>
              <p className="text-sm text-[#6666AA] mb-4">Ruthless AI with advanced tactics, pattern recognition, and optimal play</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-red-400">Expert</span>
                  <span className="text-xs text-[#6666AA]">Unforgiving</span>
                </div>
                
                <button className="flex items-center gap-1 text-[#FF003C] hover:text-[#FF3370] transition-colors">
                  <Play size={16} />
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="mt-8 bg-[#080812] border border-[#1A1A2E] rounded-lg p-6">
            <h3 className="text-lg font-bold font-orbitron text-[#E8E8FF] mb-4">AI ENGINE FEATURES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#8B00FF]" />
                <span className="text-[#6666AA]">Multi-layered strategic analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00C8FF]" />
                <span className="text-[#6666AA]">Dynamic technique usage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF003C]" />
                <span className="text-[#6666AA]">Pattern recognition</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                <span className="text-[#6666AA]">Adaptive difficulty scaling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                <span className="text-[#6666AA]">Chess-inspired minimax algorithm</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                <span className="text-[#6666AA]">Counter-strategy development</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-12 bg-[#080812] border border-[#1A1A2E] rounded-lg p-8">
          <h2 className="text-2xl font-bold font-orbitron text-[#E8E8FF] mb-6">TRAINING PROGRESS</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6666AA]">Overall Completion</span>
                <span className="text-sm text-[#E8E8FF]">50%</span>
              </div>
              <div className="w-full bg-[#1A1A2E] rounded-full h-2">
                <div className="bg-gradient-to-r from-[#8B00FF] to-[#00C8FF] h-2 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8B00FF] mb-1">3/6</div>
                <div className="text-xs text-[#6666AA]">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00C8FF] mb-1">45 min</div>
                <div className="text-xs text-[#6666AA]">Total Training Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF003C] mb-1">A+</div>
                <div className="text-xs text-[#6666AA]">Average Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ScrollToTop />
    </>
  );
};

export default Dojo;
