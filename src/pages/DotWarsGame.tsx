import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Coins } from 'lucide-react';
import { AnimeFaction, FACTION_NAMES, FACTION_RESOURCE, TECHNIQUES, FORBIDDEN_TECHNIQUES, Technique } from '@/types/game';
import { getFactionColor, getFactionGlow } from '@/lib/gameUtils';
import { battleSystem, calloutGenerator } from '@/systems/BattleSystem';
import { createDotWarsAI, AIDifficulty } from '@/systems/DotWarsAI';
import { createTutorialSystem, TutorialStep } from '@/systems/TutorialSystem';
import { createSharinganSystem } from '@/systems/SharinganSystem';
import { createForbiddenTechniqueSystem } from '@/systems/ForbiddenTechniqueSystem';
import { createFactionPassiveSystem } from '@/systems/FactionPassiveSystem';
import { createForbiddenVisualEffects } from '@/systems/ForbiddenVisualEffects';

interface Line { r1: number; c1: number; r2: number; c2: number; player: number }
interface Square { r: number; c: number; player: number; protected?: boolean; cracked?: boolean; corrupted?: boolean; corruptionTurn?: number }
interface Triangle { r1: number; c1: number; r2: number; c2: number; r3: number; c3: number; player: number; protected?: boolean; cracked?: boolean; corrupted?: boolean; corruptionTurn?: number }
type Shape = Square | Triangle;

const DotWarsGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateCurrency, currentUser, handleForbiddenTechniqueUse, getResourceStatus, refillUserResources } = useGame();
  const state = location.state as { p1Anime: AnimeFaction; p2Anime: AnimeFaction; p2Username?: string; gridSize: number; duelType: string; difficulty?: 'normal' | 'hard' | 'hardest'; mode?: 'tutorial' | 'practice' | 'master' | 'pvp' } | null;

  const p1Anime = state?.p1Anime || 'jjk';
  const p2Anime = state?.p2Anime || 'naruto';
  const p2Username = state?.p2Username || 'Player 2';
  const gridSize = state?.gridSize || 4;
  const duelType = state?.duelType || 'square';
  const difficulty = state?.difficulty || 'normal';
  const gameMode = state?.mode || 'pvp'; // 'tutorial', 'practice', 'master', or 'pvp'
  const isAIMode = ['tutorial', 'practice', 'master'].includes(gameMode);
  const aiDifficulty: AIDifficulty = gameMode === 'tutorial' ? 'tutorial' : gameMode === 'practice' ? 'practice' : gameMode === 'master' ? 'master' : 'practice';
  
  // AI instance (Player 2 is AI in Dojo mode)
  const aiRef = useRef(isAIMode ? createDotWarsAI(p2Anime, aiDifficulty) : null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  // Tutorial system (only in tutorial mode)
  const tutorialRef = useRef(gameMode === 'tutorial' ? createTutorialSystem() : null);
  const [currentTutorialStep, setCurrentTutorialStep] = useState<TutorialStep | null>(null);
  const [showTutorial, setShowTutorial] = useState(gameMode === 'tutorial');
  
  // Sharingan system (for Naruto faction)
  const sharinganRef = useRef(createSharinganSystem());
  
  // Forbidden technique system
  const forbiddenRef = useRef(createForbiddenTechniqueSystem());
  
  // Faction passive system
  const passiveRef = useRef(createFactionPassiveSystem());
  
  // Forbidden visual effects
  const forbiddenVFXRef = useRef(createForbiddenVisualEffects());
  
  // Faction passive state
  const [passiveProtectionUsed, setPassiveProtectionUsed] = useState({ player1: 0, player2: 0 });
  const [breathingStance, setBreathingStance] = useState<{ player1: 'offense' | 'defense'; player2: 'offense' | 'defense' }>({ player1: 'offense', player2: 'defense' });
  const [nenConditionActive, setNenConditionActive] = useState({ player1: false, player2: false });
  const p1Color = getFactionColor(p1Anime);
  const p1Glow = getFactionGlow(p1Anime);
  const p2Color = getFactionColor(p2Anime);
  const p2Glow = getFactionGlow(p2Anime);

  const [lines, setLines] = useState<Line[]>([]);
  const [squares, setSquares] = useState<Square[]>([]);
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [p1Resource, setP1Resource] = useState(100);
  const [p2Resource, setP2Resource] = useState(100);
  const [scores, setScores] = useState([0, 0]);
  const [floatText, setFloatText] = useState<{ text: string; color: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [bonusTurn, setBonusTurn] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [extraLine, setExtraLine] = useState(false);
  const [linesPlacedThisTurn, setLinesPlacedThisTurn] = useState(0);
  const [lastResourceRefill, setLastResourceRefill] = useState(Date.now());
  const [visualEffects, setVisualEffects] = useState<{ type: string; color: string; x: number; y: number; id: number }[]>([]);
  const [switchTimer, setSwitchTimer] = useState<any>(null);
  const [rewardGiven, setRewardGiven] = useState(false);
  const p1Techs = TECHNIQUES[p1Anime];
  const p2Techs = TECHNIQUES[p2Anime];
  const p1ForbiddenTechs = FORBIDDEN_TECHNIQUES[p1Anime];
  const p2ForbiddenTechs = FORBIDDEN_TECHNIQUES[p2Anime];

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Enhanced Battle System State
  const [battleState, setBattleState] = useState<{ player1: string; player2: string }>({ player1: 'normal', player2: 'normal' });
  const [momentum, setMomentum] = useState<{ player1: string; player2: string }>({ player1: 'normal', player2: 'normal' });
  const [momentumLevel, setMomentumLevel] = useState<{ player1: number; player2: number }>({ player1: 0, player2: 0 });
  const [activeCallouts, setActiveCallouts] = useState<{ id: string; text: string; intensity: string; category: string; timestamp: number }[]>([]);
  const [battleEffects, setBattleEffects] = useState<{ screenShake?: boolean; slowMotion?: boolean; flash?: boolean; pressure?: boolean }>({});
  const [turnCount, setTurnCount] = useState(0);
  const [forbiddenAvailable, setForbiddenAvailable] = useState<{ player1: boolean; player2: boolean }>({ player1: false, player2: false });
  const [aiMoveInProgress, setAiMoveInProgress] = useState(false);
  const [techniqueUsed, setTechniqueUsed] = useState<{ player: number; technique: Technique; timestamp: number } | null>(null);
  
  // Sharingan & Special Abilities State
  const [sharinganActive, setSharinganActive] = useState<{ player1: boolean; player2: boolean }>({ player1: false, player2: false });
  const [lastOpponentMove, setLastOpponentMove] = useState<{ line: Line | null; technique: Technique | null }>({ line: null, technique: null });
  const [predictedMoves, setPredictedMoves] = useState<Line[]>([]);
  
  // Update tutorial step display
  useEffect(() => {
    if (tutorialRef.current && showTutorial) {
      const step = tutorialRef.current.getCurrentStep();
      setCurrentTutorialStep(step);
    }
  }, [showTutorial, lines, squares, activeEffects]);
  
  // Auto-dismiss callouts after 3 seconds and limit to max 2 visible
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveCallouts(prev => {
        const filtered = prev.filter(callout => now - callout.timestamp < 3000);
        // Keep only the 2 most recent
        return filtered.slice(-2);
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Momentum level management
  const updateMomentumLevel = (player: number, change: number) => {
    setMomentumLevel(prev => {
      const newLevel = Math.max(0, Math.min(100, prev[`player${player}`] + change));
      return {
        ...prev,
        [`player${player}`]: newLevel
      };
    });

    // Update momentum tier based on level
    setMomentum(prev => {
      const currentLevel = momentumLevel[`player${player}`] + change;
      let newTier: string = 'normal';
      
      if (currentLevel >= 80) newTier = 'legendary';
      else if (currentLevel >= 60) newTier = 'peak';
      else if (currentLevel >= 40) newTier = 'high';
      else if (currentLevel >= 20) newTier = 'low';
      else if (currentLevel < 10) newTier = 'critical';
      
      return {
        ...prev,
        [`player${player}`]: newTier
      };
    });
  };

  // Use momentum at 100 to destroy opponent shapes
  const useMomentumPower = (player: number) => {
    if (momentumLevel[`player${player}`] < 100) {
      setActiveCallouts(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        text: 'MOMENTUM MUST BE AT 100!',
        intensity: 'minor',
        category: 'momentum',
        timestamp: Date.now()
      } as any]);
      return;
    }

    const opponentIdx = player === 1 ? 1 : 0;
    const opponentSquares = squares.filter(s => s.player === (opponentIdx + 1));
    const opponentTriangles = triangles.filter(t => t.player === (opponentIdx + 1));
    
    if (opponentSquares.length === 0 && opponentTriangles.length === 0) {
      setActiveCallouts(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        text: 'NO OPPONENT SHAPES TO DESTROY!',
        intensity: 'minor',
        category: 'momentum',
        timestamp: Date.now()
      } as any]);
      return;
    }

    // Combine all opponent shapes and randomly select 5
    const allOpponentShapes: Array<{ type: 'square' | 'triangle'; shape: Square | Triangle; index: number }> = [];
    
    opponentSquares.forEach((square, index) => {
      allOpponentShapes.push({ type: 'square', shape: square, index });
    });
    
    opponentTriangles.forEach((triangle, index) => {
      allOpponentShapes.push({ type: 'triangle', shape: triangle, index });
    });
    
    // Shuffle and take up to 5 shapes
    const shuffled = allOpponentShapes.sort(() => Math.random() - 0.5);
    const shapesToDestroy = shuffled.slice(0, Math.min(5, shuffled.length));
    
    // Destroy the selected shapes
    let destroyedCount = 0;
    shapesToDestroy.forEach(({ type, shape }) => {
      if (type === 'square') {
        const square = shape as Square;
        const targetX = PADDING + square.c * DOT_SPACING + DOT_SPACING / 2;
        const targetY = PADDING + square.r * DOT_SPACING + DOT_SPACING / 2;
        addVisualEffect('explosion', '#FF003C', targetX, targetY);
        setSquares(prev => prev.filter(s => !(s.r === square.r && s.c === square.c)));
        destroyedCount++;
      } else if (type === 'triangle') {
        const triangle = shape as Triangle;
        const targetX = PADDING + triangle.c1 * DOT_SPACING + DOT_SPACING / 2;
        const targetY = PADDING + triangle.r1 * DOT_SPACING + DOT_SPACING / 2;
        addVisualEffect('explosion', '#FF003C', targetX, targetY);
        setTriangles(prev => prev.filter(t => 
          !(t.r1 === triangle.r1 && t.c1 === triangle.c1 && t.r2 === triangle.r2 && t.c2 === triangle.c2 && t.r3 === triangle.r3 && t.c3 === triangle.c3)
        ));
        destroyedCount++;
      }
    });
    
    // Update scores
    setScores(prev => {
      const newScores = [...prev];
      newScores[opponentIdx] -= destroyedCount;
      return newScores;
    });
    
    // Reset momentum to 0 after use
    updateMomentumLevel(player, -100);
    
    // Show powerful effect message
    setActiveCallouts(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      text: `MOMENTUM UNLEASHED! ${destroyedCount} SHAPES DESTROYED!`,
      intensity: 'legendary',
      category: 'momentum',
      timestamp: Date.now()
    } as any]);
    
    // Add screen effect for momentum power
    setBattleEffects({
      screenShake: true,
      flash: true
    });
    
    setTimeout(() => {
      setBattleEffects({});
    }, 2000);
  };

  // Momentum loss for failed actions
  const loseMomentum = (player: number, amount: number = 10) => {
    updateMomentumLevel(player, -amount);
    
    // Generate negative momentum callout for significant losses
    if (amount >= 15) {
      setActiveCallouts(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        text: 'MOMENTUM LOST!',
        intensity: 'minor',
        category: 'momentum'
      }]);
    }
  };
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // AI Turn Execution
  useEffect(() => {
    if (!isAIMode || !aiRef.current || gameOver || aiMoveInProgress) return;
    if (currentPlayer !== 2) return; // AI is always player 2 in Dojo mode

    const executeAITurn = async () => {
      setAiMoveInProgress(true);
      setIsAIThinking(true);

      try {
        // Prepare game state for AI
        const gameState = {
          lines,
          squares,
          triangles,
          gridSize,
          aiPlayer: 2,
          humanPlayer: 1,
          aiResource: p2Resource,
          humanResource: p1Resource,
          aiScore: scores[1],
          humanScore: scores[0],
          turnCount,
          aiMomentum: momentumLevel.player2,
          humanMomentum: momentumLevel.player1,
          duelType: duelType as 'square' | 'triangle',
          currentPlayer: 2
        };

        // First, check if AI should use a technique
        const aiTechnique = aiRef.current.decideTechnique(gameState);
        if (aiTechnique) {
          // Show AI technique usage notification
          setTechniqueUsed({ player: 2, technique: aiTechnique, timestamp: Date.now() });
          setTimeout(() => setTechniqueUsed(null), 4000);
          activateTechnique(aiTechnique);
        }

        // Then make a move
        const move = await aiRef.current.makeMove(gameState);
        if (move) {
          const [r1, c1, r2, c2] = move;
          await new Promise(resolve => setTimeout(resolve, 300));
          placeLine(r1, c1, r2, c2);
        }
      } catch (error) {
        console.error('AI move error:', error);
      } finally {
        setIsAIThinking(false);
        setAiMoveInProgress(false);
      }
    };

    // Small delay before AI moves
    const timer = setTimeout(executeAITurn, 600);
    return () => clearTimeout(timer);
  }, [isAIMode, currentPlayer, gameOver, aiMoveInProgress, lines, squares, triangles, p1Resource, p2Resource, scores, turnCount, momentumLevel]);
  
  // Responsive sizing
  const maxBoardWidth = windowWidth < 768 ? Math.min(windowWidth - 40, 350) : windowWidth < 1024 ? 450 : 500;
  const DOT_SPACING = Math.min(60, maxBoardWidth / gridSize);
  const PADDING = windowWidth < 768 ? 20 : 30;
  const svgSize = PADDING * 2 + (gridSize - 1) * DOT_SPACING;

  const lineExists = useCallback((r1: number, c1: number, r2: number, c2: number) => {
    return lines.some(l =>
      (l.r1 === r1 && l.c1 === c1 && l.r2 === r2 && l.c2 === c2) ||
      (l.r1 === r2 && l.c1 === c2 && l.r2 === r1 && l.c2 === c1)
    );
  }, [lines]);

  const getAdjacentPairs = useCallback((r: number, c: number): [number, number, number, number][] => {
    const pairs: [number, number, number, number][] = [];
    if (r > 0) pairs.push([r, c, r - 1, c]);
    if (r < gridSize - 1) pairs.push([r, c, r + 1, c]);
    if (c > 0) pairs.push([r, c, r, c - 1]);
    if (c < gridSize - 1) pairs.push([r, c, r, c + 1]);
    // Add diagonal connections for triangles only in triangle mode
    if (duelType === 'triangle') {
      if (r > 0 && c > 0) pairs.push([r, c, r - 1, c - 1]);
      if (r > 0 && c < gridSize - 1) pairs.push([r, c, r - 1, c + 1]);
      if (r < gridSize - 1 && c > 0) pairs.push([r, c, r + 1, c - 1]);
      if (r < gridSize - 1 && c < gridSize - 1) pairs.push([r, c, r + 1, c + 1]);
    }
    return pairs;
  }, [gridSize]);

  const checkNewSquares = useCallback((newLines: Line[], player: number, existingSquares: Square[]): Square[] => {
    const newSquares: Square[] = [];
    const hasLine = (r1: number, c1: number, r2: number, c2: number) =>
      newLines.some(l =>
        (l.r1 === r1 && l.c1 === c1 && l.r2 === r2 && l.c2 === c2) ||
        (l.r1 === r2 && l.c1 === c2 && l.r2 === r1 && l.c2 === c1)
      );

    for (let r = 0; r < gridSize - 1; r++) {
      for (let c = 0; c < gridSize - 1; c++) {
        const alreadyClaimed = existingSquares.some(s => s.r === r && s.c === c);
        if (alreadyClaimed) continue;
        if (
          hasLine(r, c, r, c + 1) &&
          hasLine(r + 1, c, r + 1, c + 1) &&
          hasLine(r, c, r + 1, c) &&
          hasLine(r, c + 1, r + 1, c + 1)
        ) {
          newSquares.push({ r, c, player });
        }
      }
    }
    return newSquares;
  }, [gridSize]);

  const checkNewTriangles = useCallback((newLines: Line[], player: number, existingTriangles: Triangle[]): Triangle[] => {
    const newTriangles: Triangle[] = [];
    const hasLine = (r1: number, c1: number, r2: number, c2: number) =>
      newLines.some(l =>
        (l.r1 === r1 && l.c1 === c1 && l.r2 === r2 && l.c2 === c2) ||
        (l.r1 === r2 && l.c1 === c2 && l.r2 === r1 && l.c2 === c1)
      );

    // Check for upward and downward triangles
    for (let r = 0; r < gridSize - 1; r++) {
      for (let c = 0; c < gridSize - 1; c++) {
        // Upward triangle
        const upwardClaimed = existingTriangles.some(t => 
          t.r1 === r && t.c1 === c && t.r2 === r && t.c2 === c + 1 && t.r3 === r + 1 && t.c3 === c
        );
        if (!upwardClaimed &&
          hasLine(r, c, r, c + 1) &&
          hasLine(r, c + 1, r + 1, c) &&
          hasLine(r + 1, c, r, c)
        ) {
          newTriangles.push({ r1: r, c1: c, r2: r, c2: c + 1, r3: r + 1, c3: c, player });
        }

        // Downward triangle
        const downwardClaimed = existingTriangles.some(t => 
          t.r1 === r && t.c1 === c + 1 && t.r2 === r + 1 && t.c2 === c + 1 && t.r3 === r + 1 && t.c3 === c
        );
        if (!downwardClaimed &&
          hasLine(r, c + 1, r + 1, c + 1) &&
          hasLine(r + 1, c + 1, r + 1, c) &&
          hasLine(r + 1, c, r, c + 1)
        ) {
          newTriangles.push({ r1: r, c1: c + 1, r2: r + 1, c2: c + 1, r3: r + 1, c3: c, player });
        }
      }
    }
    return newTriangles;
  }, [gridSize]);

  const placeLine = useCallback((r1: number, c1: number, r2: number, c2: number) => {
    if (gameOver || lineExists(r1, c1, r2, c2)) return;

    const newLine: Line = { r1, c1, r2, c2, player: currentPlayer };
    const updatedLines = [...lines, newLine];
    setLines(updatedLines);
    
    // Tutorial progress tracking
    if (tutorialRef.current && currentPlayer === 1) {
      tutorialRef.current.onLinePlaced();
      setCurrentTutorialStep(tutorialRef.current.getCurrentStep());
    }
    
    // Track opponent's last move for Sharingan
    setLastOpponentMove({ line: { r1, c1, r2, c2, player: currentPlayer }, technique: null });

    const newSquares = checkNewSquares(updatedLines, currentPlayer, squares);
    const newTriangles = duelType === 'triangle' ? checkNewTriangles(updatedLines, currentPlayer, triangles) : [];
    
    if (newSquares.length > 0 || newTriangles.length > 0) {
      if (newSquares.length > 0) {
        setSquares(prev => [...prev, ...newSquares]);
      }
      if (newTriangles.length > 0) {
        setTriangles(prev => [...prev, ...newTriangles]);
      }
      const newScores = [...scores];
      newScores[currentPlayer - 1] += newSquares.length + newTriangles.length;
      setScores(newScores);
      setBonusTurn(true);
      
      // Tutorial progress tracking for shape completion
      if (tutorialRef.current && currentPlayer === 1) {
        tutorialRef.current.onShapeCompleted();
        setCurrentTutorialStep(tutorialRef.current.getCurrentStep());
      }
      
      // Update momentum for shape completion (but no resource gain)
      updateMomentumLevel(currentPlayer, 10);
      
      // Generate momentum callout for high momentum
      if (momentumLevel[`player${currentPlayer}`] + 15 >= 80) {
        setActiveCallouts(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          text: 'UNSTOPPABLE MOMENTUM!',
          intensity: 'legendary',
          category: 'momentum',
          timestamp: Date.now()
        }]);
      }
      
      // Check territory decay
      const totalShapes = squares.length + triangles.length + newSquares.length + newTriangles.length;
      let player1Shapes = squares.filter(s => s.player === 1).length + triangles.filter(t => t.player === 1).length;
      let player2Shapes = squares.filter(s => s.player === 2).length + triangles.filter(t => t.player === 2).length;
      
      if (currentPlayer === 1) {
        player1Shapes += newSquares.length + newTriangles.length;
      } else {
        player2Shapes += newSquares.length + newTriangles.length;
      }
      
      const decayTarget = battleSystem.checkTerritoryDecay(player1Shapes, player2Shapes, totalShapes);
      if (decayTarget > 0) {
        // Apply cracking to dominant player's shapes
        if (decayTarget === 1) {
          setSquares(prev => prev.map(s => s.player === 1 ? { ...s, cracked: true } : s));
          setTriangles(prev => prev.map(t => t.player === 1 ? { ...t, cracked: true } : t));
        } else {
          setSquares(prev => prev.map(s => s.player === 2 ? { ...s, cracked: true } : s));
          setTriangles(prev => prev.map(t => t.player === 2 ? { ...t, cracked: true } : t));
        }
      }
      
      // Generate contextual callout
      const contextualCallout = calloutGenerator.generateContextualCallout({
        playerResources: currentPlayer === 1 ? p1Resource : p2Resource,
        enemyResources: currentPlayer === 1 ? p2Resource : p1Resource,
        playerShapes: currentPlayer === 1 ? player1Shapes : player2Shapes,
        enemyShapes: currentPlayer === 1 ? player2Shapes : player1Shapes,
        turnCount,
        momentum: momentum[`player${currentPlayer}`] as any
      });
      
      if (contextualCallout) {
        setActiveCallouts(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          text: contextualCallout,
          intensity: 'major',
          category: 'technique',
          timestamp: Date.now()
        }]);
      }
    }

    const maxLines = 2 * gridSize * (gridSize - 1);
    if (updatedLines.length >= maxLines) {
      setGameOver(true);
      return;
    }

    if (extraLine && linesPlacedThisTurn === 0) {
      setLinesPlacedThisTurn(1);
      return;
    }

    if (newSquares.length === 0 && newTriangles.length === 0 && !extraLine) {
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      
      // Update battle system for turn change
      battleSystem.nextTurn();
      setTurnCount(prev => prev + 1);
      
      // Check battlefield shift
      if (battleSystem.checkBattlefieldShift()) {
        setBattleEffects({
          screenShake: true,
          flash: true,
          slowMotion: true
        });
        
        setTimeout(() => {
          setBattleEffects({});
        }, 3000);
      }
      
      // Update resources (separate from momentum)
      setP1Resource(prev => Math.min(200, prev + 5));
      setP2Resource(prev => Math.min(200, prev + 5));
      
      // Apply momentum decay
      updateMomentumLevel(1, -3);
      updateMomentumLevel(2, -3);
    }

    setExtraLine(false);
    setLinesPlacedThisTurn(0);
  }, [gameOver, lineExists, lines, currentPlayer, checkNewSquares, checkNewTriangles, squares, triangles, gridSize, scores, extraLine, linesPlacedThisTurn]);

  const addVisualEffect = (type: string, color: string, x: number = 0, y: number = 0) => {
    const effect = { type, color, x, y, id: Date.now() + Math.random() };
    setVisualEffects(prev => [...prev, effect]);
    setTimeout(() => {
      setVisualEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 2000);
  };

  const activateTechnique = (tech: Technique) => {
    const resource = currentPlayer === 1 ? p1Resource : p2Resource;
    
    // Check if this is a forbidden technique (cost >= 100)
    const isForbiddenTechnique = tech.cost >= 100;
    
    // Forbidden techniques require at least 100 resources
    if (isForbiddenTechnique && resource < 100) {
      setActiveCallouts(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        text: 'INSUFFICIENT RESOURCES FOR FORBIDDEN TECHNIQUE!',
        intensity: 'major',
        category: 'forbidden',
        timestamp: Date.now()
      }]);
      return;
    }
    
    // Check overload state
    const isOverloaded = battleSystem.checkOverload(currentPlayer, resource);
    let finalCost = tech.cost;
    
    if (isOverloaded) {
      finalCost = battleSystem.applyOverloadPenalty(currentPlayer, tech.cost);
      if (finalCost === 0) {
        // Technique backfired
        setActiveCallouts(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          text: 'TECHNIQUE BACKFIRED!',
          intensity: 'major',
          category: 'technique',
          timestamp: Date.now()
        }]);
        return;
      }
    }
    
    // Check awakening bonus
    if (battleState[`player${currentPlayer}`] === 'awakening') {
      finalCost = battleSystem.applyAwakeningBonus(currentPlayer, finalCost);
    }
    
    if (resource < finalCost) return;

    // Handle forbidden technique resource drain for unlimited users
    if (isForbiddenTechnique && currentPlayer === 1 && currentUser) {
      const result = handleForbiddenTechniqueUse(finalCost);
      
      if (result.unlimitedDrained) {
        setActiveCallouts(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          text: 'UNLIMITED DRAINED TO 200!',
          intensity: 'legendary',
          category: 'forbidden',
          timestamp: Date.now()
        }]);
        setP1Resource(200);
      } else if (result.unlimitedEnded) {
        setActiveCallouts(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          text: 'UNLIMITED SUBSCRIPTION ENDED!',
          intensity: 'legendary',
          category: 'forbidden',
          timestamp: Date.now()
        }]);
        setP1Resource(r => Math.max(0, r - finalCost));
      } else {
        setP1Resource(r => r - finalCost);
      }
    } else {
      if (currentPlayer === 1) setP1Resource(r => r - finalCost);
      else setP2Resource(r => r - finalCost);
    }

    const color = currentPlayer === 1 ? p1Color : p2Color;
    
    // Generate technique callout
    const calloutText = calloutGenerator.generateTechniqueCallout(
      finalCost > 60 ? 'legendary' : finalCost > 40 ? 'major' : 'minor'
    );
    
    setActiveCallouts(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      text: calloutText,
      intensity: finalCost > 60 ? 'legendary' : finalCost > 40 ? 'major' : 'minor',
      category: 'technique',
      timestamp: Date.now()
    }]);
    
    setFloatText({ text: tech.name, color });
    setTimeout(() => setFloatText(null), 2000);
    
    // Show technique usage notification
    setTechniqueUsed({ player: currentPlayer, technique: tech, timestamp: Date.now() });
    setTimeout(() => setTechniqueUsed(null), 4000);
    
    // Tutorial progress tracking for technique usage
    if (tutorialRef.current && currentPlayer === 1) {
      tutorialRef.current.onTechniqueUsed();
      setCurrentTutorialStep(tutorialRef.current.getCurrentStep());
    }
    
    // Track opponent's last technique for Sharingan
    setLastOpponentMove(prev => ({ ...prev, technique: tech }));

    // Update momentum (but no resource gain)
    updateMomentumLevel(currentPlayer, 5);
    
    // Generate momentum callout for high momentum
    if (momentumLevel[`player${currentPlayer}`] + 10 >= 60) {
      setActiveCallouts(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        text: 'MOMENTUM BUILDING!',
        intensity: 'major',
        category: 'momentum',
        timestamp: Date.now()
      }]);
    }

    // Add visual effects based on technique type
    switch (tech.effect) {
      case 'double_turn':
        addVisualEffect('flash', color, svgSize / 2, svgSize / 2);
        setExtraLine(true);
        setLinesPlacedThisTurn(0);
        setActiveEffects(prev => [...prev, `${tech.name} active`]);
        break;
      case 'destroy_shape': {
        // Find and destroy random opponent shape
        const opponentIdx = currentPlayer === 1 ? 1 : 0;
        const opponentSquares = squares.filter(s => s.player === (opponentIdx + 1) && !s.protected);
        const opponentTriangles = triangles.filter(t => t.player === (opponentIdx + 1) && !t.protected);
        
        if (opponentSquares.length > 0 || opponentTriangles.length > 0) {
          let target: Square | Triangle | null = null;
          let targetX = 0, targetY = 0;
          
          // Randomly choose between squares and triangles
          if (opponentSquares.length > 0 && (opponentTriangles.length === 0 || Math.random() < 0.6)) {
            target = opponentSquares[Math.floor(Math.random() * opponentSquares.length)];
            targetX = PADDING + target.c * DOT_SPACING + DOT_SPACING / 2;
            targetY = PADDING + target.r * DOT_SPACING + DOT_SPACING / 2;
            
            // Remove the square
            setSquares(prev => prev.filter(s => !(s.r === target.r && s.c === target.c)));
          } else if (opponentTriangles.length > 0) {
            target = opponentTriangles[Math.floor(Math.random() * opponentTriangles.length)];
            targetX = PADDING + target.c1 * DOT_SPACING + DOT_SPACING / 2;
            targetY = PADDING + target.r1 * DOT_SPACING + DOT_SPACING / 2;
            
            // Remove the triangle
            setTriangles(prev => prev.filter(t => !(t.r1 === target.r1 && t.c1 === target.c1 && t.r2 === target.r2 && t.c2 === target.c2 && t.r3 === target.r3 && t.c3 === target.c3)));
          }
          
          if (target) {
            addVisualEffect('explosion', '#FF003C', targetX, targetY);
            setScores(prev => { const n = [...prev]; n[opponentIdx]--; return n; });
          }
        }
        break;
      }
      case 'steal_shape': {
        // Find and steal random opponent shape
        const opponentIdx = currentPlayer === 1 ? 1 : 0;
        const opponentSquares = squares.filter(s => s.player === (opponentIdx + 1) && !s.protected);
        const opponentTriangles = triangles.filter(t => t.player === (opponentIdx + 1) && !t.protected);
        
        if (opponentSquares.length > 0 || opponentTriangles.length > 0) {
          let target: Square | Triangle | null = null;
          let targetX = 0, targetY = 0;
          
          // Randomly choose between squares and triangles
          if (opponentSquares.length > 0 && (opponentTriangles.length === 0 || Math.random() < 0.6)) {
            target = opponentSquares[Math.floor(Math.random() * opponentSquares.length)];
            targetX = PADDING + target.c * DOT_SPACING + DOT_SPACING / 2;
            targetY = PADDING + target.r * DOT_SPACING + DOT_SPACING / 2;
            
            // Steal the square
            setSquares(prev => prev.map(s => s.r === target.r && s.c === target.c ? { ...s, player: currentPlayer } : s));
          } else if (opponentTriangles.length > 0) {
            target = opponentTriangles[Math.floor(Math.random() * opponentTriangles.length)];
            targetX = PADDING + target.c1 * DOT_SPACING + DOT_SPACING / 2;
            targetY = PADDING + target.r1 * DOT_SPACING + DOT_SPACING / 2;
            
            // Steal the triangle
            setTriangles(prev => prev.map(t => 
              t.r1 === target.r1 && t.c1 === target.c1 && t.r2 === target.r2 && t.c2 === target.c2 && t.r3 === target.r3 && t.c3 === target.c3 
                ? { ...t, player: currentPlayer } 
                : t
            ));
          }
          
          if (target) {
            addVisualEffect('steal', color, targetX, targetY);
            setScores(prev => { const n = [...prev]; n[currentPlayer - 1]++; n[opponentIdx]--; return n; });
          }
        }
        break;
      }
      case 'skip_turn':
        addVisualEffect('freeze', '#00C8FF', svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Opponent skips next turn']);
        break;
      case 'reveal_best': {
        // Find and highlight the best move (one that completes most shapes)
        const availableLines = getAvailableLines();
        
        if (availableLines.length > 0) {
          // Score each available line based on how many shapes it would complete
          const scoredLines = availableLines.map(([r1, c1, r2, c2]) => {
            let score = 0;
            const testLine = { r1, c1, r2, c2, player: currentPlayer };
            const testLines = [...lines, testLine];
            
            // Check if this line would complete squares
            const potentialSquares = checkNewSquares(testLines, currentPlayer, squares);
            score += potentialSquares.length * 3;
            
            // Check if this line would complete triangles
            if (duelType === 'triangle') {
              const potentialTriangles = checkNewTriangles(testLines, currentPlayer, triangles);
              score += potentialTriangles.length * 3;
            }
            
            // Bonus for blocking opponent
            const opponentTestLine = { r1, c1, r2, c2, player: currentPlayer === 1 ? 2 : 1 };
            const opponentTestLines = [...lines, opponentTestLine];
            const opponentSquares = checkNewSquares(opponentTestLines, currentPlayer === 1 ? 2 : 1, squares);
            const opponentTriangles = duelType === 'triangle' ? checkNewTriangles(opponentTestLines, currentPlayer === 1 ? 2 : 1, triangles) : [];
            score += (opponentSquares.length + opponentTriangles.length) * 1;
            
            return { line: [r1, c1, r2, c2], score };
          });
          
          // Sort by score and highlight the best move
          scoredLines.sort((a, b) => b.score - a.score);
          
          if (scoredLines.length > 0 && scoredLines[0].score > 0) {
            const [r1, c1, r2, c2] = scoredLines[0].line;
            const targetX = PADDING + ((c1 + c2) / 2) * DOT_SPACING + DOT_SPACING / 2;
            const targetY = PADDING + ((r1 + r2) / 2) * DOT_SPACING + DOT_SPACING / 2;
            
            addVisualEffect('reveal', '#FFD700', targetX, targetY);
            setActiveEffects(prev => [...prev, `Best move: (${r1},${c1})→(${r2},${c2}) [Score: ${scoredLines[0].score}]`]);
            
            // Auto-complete the best move
            setTimeout(() => {
              placeLine(r1, c1, r2, c2);
            }, 500);
          }
        }
        break;
      }
      case 'protect_shape': {
        // Protect the next shape that will be completed
        addVisualEffect('shield', '#00FF88', svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Next shape will be protected from destruction/stealing']);
        
        // Mark next completed shape as protected
        setTimeout(() => {
          setSquares(prev => prev.map((s, index) => {
            if (index === prev.length - 1) {
              return { ...s, protected: true };
            }
            return s;
          }));
          setTriangles(prev => prev.map((t, index) => {
            if (index === prev.length - 1) {
              return { ...t, protected: true };
            }
            return t;
          }));
        }, 100);
        break;
      }
      case 'restrict_zone': {
        // Domain Expansion - find best strategic location
        const centerRow = Math.floor(gridSize / 2);
        const centerCol = Math.floor(gridSize / 2);
        
        // Check if center is occupied by a shape
        const centerOccupied = squares.some(s => s.r === centerRow && s.c === centerCol) || 
                              triangles.some(t => 
                                (t.r1 === centerRow && t.c1 === centerCol) ||
                                (t.r2 === centerRow && t.c2 === centerCol) ||
                                (t.r3 === centerRow && t.c3 === centerCol)
                              );
        
        let targetRow = centerRow;
        let targetCol = centerCol;
        
        // If center is occupied, find nearest empty location
        if (centerOccupied) {
          const emptyLocations: [number, number][] = [];
          
          // Find all empty grid positions
          for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
              const hasSquare = squares.some(s => s.r === r && s.c === c);
              const hasTriangle = triangles.some(t => 
                (t.r1 === r && t.c1 === c) ||
                (t.r2 === r && t.c2 === c) ||
                (t.r3 === r && t.c3 === c)
              );
              
              if (!hasSquare && !hasTriangle) {
                emptyLocations.push([r, c]);
              }
            }
          }
          
          // Choose the empty location closest to center
          if (emptyLocations.length > 0) {
            emptyLocations.sort(([r1, c1], [r2, c2]) => {
              const dist1 = Math.abs(r1 - centerRow) + Math.abs(c1 - centerCol);
              const dist2 = Math.abs(r2 - centerRow) + Math.abs(c2 - centerCol);
              return dist1 - dist2;
            });
            [targetRow, targetCol] = emptyLocations[0];
          }
        }
        
        const targetX = PADDING + targetCol * DOT_SPACING + DOT_SPACING / 2;
        const targetY = PADDING + targetRow * DOT_SPACING + DOT_SPACING / 2;
        
        addVisualEffect('domain', color, targetX, targetY);
        setActiveEffects(prev => [...prev, `Domain Expansion at (${targetRow},${targetCol})`]);
        
        // Auto-complete 2 shapes near the domain location
        const domainLines: Line[] = [];
        const directions = [[0, 1], [1, 0], [-1, 0], [0, -1]]; // right, down, up, left
        
        for (let i = 0; i < 2; i++) {
          const [dr, dc] = directions[i % directions.length];
          const newRow = targetRow + dr;
          const newCol = targetCol + dc;
          
          if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            // Create lines to form a square around the domain
            if (!lineExists(targetRow, targetCol, newRow, targetCol)) {
              domainLines.push({ r1: targetRow, c1: targetCol, r2: newRow, c2: targetCol, player: currentPlayer });
            }
            if (!lineExists(targetRow, targetCol, targetRow, newCol)) {
              domainLines.push({ r1: targetRow, c1: targetCol, r2: targetRow, c2: newCol, player: currentPlayer });
            }
          }
        }
        
        if (domainLines.length > 0) {
          setLines(prev => [...prev, ...domainLines]);
          
          // Check for new shapes created
          const newSquares = checkNewSquares([...lines, ...domainLines], currentPlayer, squares);
          if (newSquares.length > 0) {
            setSquares(prev => [...prev, ...newSquares]);
            setScores(prev => {
              const newScores = [...prev];
              newScores[currentPlayer - 1] += newSquares.length;
              return newScores;
            });
          }
        }
        
        // Freeze opponent for 2 turns (handled by effect system)
        break;
      }
      case 'double_score': {
        // Next 3 shapes score TRIPLE + gain 20 resources
        addVisualEffect('power', color, svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Next 3 shapes score TRIPLE + 20 resources']);
        
        // Grant immediate resources
        if (currentPlayer === 1) {
          setP1Resource(prev => Math.min(200, prev + 20));
        } else {
          setP2Resource(prev => Math.min(200, prev + 20));
        }
        
        // Set up triple scoring for next 3 shapes (this would need additional state tracking)
        break;
      }
      case 'block_line': {
        // Find the most strategic line to block (one that would complete opponent shape)
        const opponentIdx = currentPlayer === 1 ? 1 : 0;
        const availableLines = getAvailableLines();
        
        // Score each available line based on how many opponent shapes it would complete
        const scoredLines = availableLines.map(([r1, c1, r2, c2]) => {
          let score = 0;
          const testLine = { r1, c1, r2, c2, player: opponentIdx + 1 };
          const testLines = [...lines, testLine];
          
          // Check if this line would complete opponent squares
          const potentialSquares = checkNewSquares(testLines, opponentIdx + 1, squares);
          score += potentialSquares.length * 2;
          
          // Check if this line would complete opponent triangles
          if (duelType === 'triangle') {
            const potentialTriangles = checkNewTriangles(testLines, opponentIdx + 1, triangles);
            score += potentialTriangles.length * 2;
          }
          
          return { line: [r1, c1, r2, c2], score };
        });
        
        // Sort by score and block the highest scoring line
        scoredLines.sort((a, b) => b.score - a.score);
        
        if (scoredLines.length > 0 && scoredLines[0].score > 0) {
          const [r1, c1, r2, c2] = scoredLines[0].line;
          
          // Create a "blocked" line that prevents opponent from using it
          const blockedLine = { r1, c1, r2, c2, player: 0 }; // player 0 indicates blocked
          setLines(prev => [...prev, blockedLine]);
          
          const targetX = PADDING + ((c1 + c2) / 2) * DOT_SPACING + DOT_SPACING / 2;
          const targetY = PADDING + ((r1 + r2) / 2) * DOT_SPACING + DOT_SPACING / 2;
          addVisualEffect('barrier', color, targetX, targetY);
          setActiveEffects(prev => [...prev, `Strategic line blocked`]);
        } else {
          // If no strategic lines, block a random available line
          if (availableLines.length > 0) {
            const [r1, c1, r2, c2] = availableLines[Math.floor(Math.random() * availableLines.length)];
            const blockedLine = { r1, c1, r2, c2, player: 0 };
            setLines(prev => [...prev, blockedLine]);
            
            const targetX = PADDING + ((c1 + c2) / 2) * DOT_SPACING + DOT_SPACING / 2;
            const targetY = PADDING + ((r1 + r2) / 2) * DOT_SPACING + DOT_SPACING / 2;
            addVisualEffect('barrier', color, targetX, targetY);
            setActiveEffects(prev => [...prev, 'Random line blocked']);
          }
        }
        break;
      }
      case 'long_connect': {
        // Create the longest possible connection from a random point
        const availableLines = getAvailableLines();
        if (availableLines.length > 0) {
          // Pick a random starting point
          const [startR, startC] = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
          
          // Find all lines from this point
          const fromPoint = availableLines.filter(([r1, c1, r2, c2]) => 
            (r1 === startR && c1 === startC) || (r2 === startR && c2 === startC)
          );
          
          if (fromPoint.length > 0) {
            // Create multiple connections from this point
            const connectionsToMake = Math.min(3, fromPoint.length);
            const newLines: Line[] = [];
            
            for (let i = 0; i < connectionsToMake; i++) {
              const [r1, c1, r2, c2] = fromPoint[i];
              newLines.push({ r1, c1, r2, c2, player: currentPlayer });
            }
            
            setLines(prev => [...prev, ...newLines]);
            
            // Check for new shapes created
            const newSquares = checkNewSquares([...lines, ...newLines], currentPlayer, squares);
            const newTriangles = duelType === 'triangle' ? checkNewTriangles([...lines, ...newLines], currentPlayer, triangles) : [];
            
            if (newSquares.length > 0 || newTriangles.length > 0) {
              if (newSquares.length > 0) {
                setSquares(prev => [...prev, ...newSquares]);
              }
              if (newTriangles.length > 0) {
                setTriangles(prev => [...prev, ...newTriangles]);
              }
              setScores(prev => {
                const newScores = [...prev];
                newScores[currentPlayer - 1] += newSquares.length + newTriangles.length;
                return newScores;
              });
              setBonusTurn(true);
            }
            
            const targetX = PADDING + startC * DOT_SPACING + DOT_SPACING / 2;
            const targetY = PADDING + startR * DOT_SPACING + DOT_SPACING / 2;
            addVisualEffect('chain', color, targetX, targetY);
            setActiveEffects(prev => [...prev, `${connectionsToMake} connections from (${startR},${startC})`]);
          }
        }
        break;
      }
      case 'nullify_line':
        addVisualEffect('void', '#8B00FF', svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Nullification active']);
        break;
      case 'wipe_row': {
        // Find the row with the most opponent shapes and wipe it
        const opponentIdx = currentPlayer === 1 ? 1 : 0;
        const opponentSquares = squares.filter(s => s.player === (opponentIdx + 1));
        const opponentTriangles = triangles.filter(t => t.player === (opponentIdx + 1));
        
        if (opponentSquares.length > 0 || opponentTriangles.length > 0) {
          // Count shapes per row
          const rowCounts: { [key: number]: number } = {};
          
          opponentSquares.forEach(s => {
            rowCounts[s.r] = (rowCounts[s.r] || 0) + 1;
          });
          
          opponentTriangles.forEach(t => {
            rowCounts[t.r1] = (rowCounts[t.r1] || 0) + 1;
            rowCounts[t.r2] = (rowCounts[t.r2] || 0) + 1;
            rowCounts[t.r3] = (rowCounts[t.r3] || 0) + 1;
          });
          
          // Find row with most opponent shapes
          let targetRow = 0;
          let maxCount = 0;
          
          Object.entries(rowCounts).forEach(([row, count]) => {
            if (count > maxCount) {
              maxCount = count;
              targetRow = parseInt(row);
            }
          });
          
          // Wipe the row - remove all opponent shapes in that row
          const removedSquares = squares.filter(s => s.player === (opponentIdx + 1) && s.r === targetRow).length;
          const removedTriangles = triangles.filter(t => 
            t.player === (opponentIdx + 1) && 
            (t.r1 === targetRow || t.r2 === targetRow || t.r3 === targetRow)
          ).length;
          
          if (removedSquares > 0) {
            setSquares(prev => prev.filter(s => !(s.player === (opponentIdx + 1) && s.r === targetRow)));
          }
          
          if (removedTriangles > 0) {
            setTriangles(prev => prev.filter(t => 
              !(t.player === (opponentIdx + 1) && 
                (t.r1 === targetRow || t.r2 === targetRow || t.r3 === targetRow))
            ));
          }
          
          const totalRemoved = removedSquares + removedTriangles;
          if (totalRemoved > 0) {
            const targetX = PADDING + gridSize * DOT_SPACING / 2;
            const targetY = PADDING + targetRow * DOT_SPACING + DOT_SPACING / 2;
            addVisualEffect('beam', '#FF4400', targetX, targetY);
            setScores(prev => { const n = [...prev]; n[opponentIdx] -= totalRemoved; return n; });
            setActiveEffects(prev => [...prev, `Row ${targetRow} wiped (${totalRemoved} shapes)`]);
          }
        }
        break;
      }
      case 'double_cost':
        addVisualEffect('drain', '#FF6B00', svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Cost doubled']);
        break;
      case 'lock_techniques':
        addVisualEffect('seal', color, svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Techniques locked']);
        break;
      case 'random_power':
        addVisualEffect('chaos', '#FF00FF', svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Random power activated']);
        break;
      case 'block_technique':
        addVisualEffect('iron', '#BBBBBB', svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Technique blocked']);
        break;
      case 'random_place': {
        // Place a random line for the current player
        const availableLines = getAvailableLines();
        if (availableLines.length > 0) {
          const [r1, c1, r2, c2] = availableLines[Math.floor(Math.random() * availableLines.length)];
          
          const targetX = PADDING + ((c1 + c2) / 2) * DOT_SPACING + DOT_SPACING / 2;
          const targetY = PADDING + ((r1 + r2) / 2) * DOT_SPACING + DOT_SPACING / 2;
          
          addVisualEffect('confusion', '#FFD700', targetX, targetY);
          setActiveEffects(prev => [...prev, `Random line placed at (${r1},${c1})→(${r2},${c2})`]);
          
          // Place the random line
          setTimeout(() => {
            placeLine(r1, c1, r2, c2);
          }, 500);
        }
        break;
      }
      case 'recover_shapes': {
        // Recover destroyed shapes by recreating them
        const opponentIdx = currentPlayer === 1 ? 1 : 0;
        const currentPlayerShapes = squares.filter(s => s.player === currentPlayer).length + 
                                   triangles.filter(t => t.player === currentPlayer).length;
        const opponentShapes = squares.filter(s => s.player === (opponentIdx + 1)).length + 
                              triangles.filter(t => t.player === (opponentIdx + 1)).length;
        
        if (currentPlayerShapes < opponentShapes) {
          // Recover some lost shapes by creating new ones
          const shapesToRecover = Math.min(2, opponentShapes - currentPlayerShapes);
          const availableLines = getAvailableLines();
          
          if (availableLines.length >= shapesToRecover * 2) {
            const newLines: Line[] = [];
            
            for (let i = 0; i < shapesToRecover * 2 && i < availableLines.length; i++) {
              const [r1, c1, r2, c2] = availableLines[i];
              newLines.push({ r1, c1, r2, c2, player: currentPlayer });
            }
            
            setLines(prev => [...prev, ...newLines]);
            
            // Check for new shapes created
            const newSquares = checkNewSquares([...lines, ...newLines], currentPlayer, squares);
            const newTriangles = duelType === 'triangle' ? checkNewTriangles([...lines, ...newLines], currentPlayer, triangles) : [];
            
            if (newSquares.length > 0 || newTriangles.length > 0) {
              if (newSquares.length > 0) {
                setSquares(prev => [...prev, ...newSquares]);
              }
              if (newTriangles.length > 0) {
                setTriangles(prev => [...prev, ...newTriangles]);
              }
              setScores(prev => {
                const newScores = [...prev];
                newScores[currentPlayer - 1] += newSquares.length + newTriangles.length;
                return newScores;
              });
            }
          }
        }
        
        addVisualEffect('heal', '#00FF88', svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, 'Shape recovery activated']);
        break;
      }
      default:
        addVisualEffect('default', color, svgSize / 2, svgSize / 2);
        setActiveEffects(prev => [...prev, `${tech.name} activated`]);
    }
    
    // Check for awakening trigger after technique use
    const currentResources = currentPlayer === 1 ? p1Resource - finalCost : p2Resource - finalCost;
    const currentShapes = currentPlayer === 1 ? squares.filter(s => s.player === 1).length : squares.filter(s => s.player === 2).length;
    const enemyShapes = currentPlayer === 1 ? squares.filter(s => s.player === 2).length : squares.filter(s => s.player === 1).length;
    
    if (battleSystem.checkAwakeningTrigger(currentPlayer, currentResources, currentShapes, enemyShapes)) {
      setBattleState(prev => ({
        ...prev,
        [`player${currentPlayer}`]: 'awakening'
      }));
    }
    
    // Check for last stand trigger
    if (battleSystem.checkLastStand(currentPlayer, currentResources, currentShapes, enemyShapes)) {
      setBattleState(prev => ({
        ...prev,
        [`player${currentPlayer}`]: 'last_stand'
      }));
      // Add immediate resource boost
      if (currentPlayer === 1) {
        setP1Resource(prev => Math.min(200, prev + 50));
      } else {
        setP2Resource(prev => Math.min(200, prev + 50));
      }
    }
  };

  const getAvailableLines = (): [number, number, number, number][] => {
    const available: [number, number, number, number][] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Horizontal lines
        if (c < gridSize - 1 && !lineExists(r, c, r, c + 1)) available.push([r, c, r, c + 1]);
        // Vertical lines
        if (r < gridSize - 1 && !lineExists(r, c, r + 1, c)) available.push([r, c, r + 1, c]);
        // Diagonal lines for triangles only in triangle mode
        if (duelType === 'triangle') {
          if (r < gridSize - 1 && c < gridSize - 1 && !lineExists(r, c, r + 1, c + 1)) available.push([r, c, r + 1, c + 1]);
          if (r < gridSize - 1 && c > 0 && !lineExists(r, c, r + 1, c - 1)) available.push([r, c, r + 1, c - 1]);
        }
      }
    }
    return available;
  };

  // Resource replenishment system
  useEffect(() => {
    const checkResourceRefill = () => {
      const now = Date.now();
      const timeSinceLastRefill = now - lastResourceRefill;
      const fiveHours = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
      
      if (timeSinceLastRefill >= fiveHours) {
        setP1Resource(100);
        setP2Resource(100);
        setLastResourceRefill(now);
        setFloatText({ text: 'Resources Refilled!', color: '#FFD700' });
        setTimeout(() => setFloatText(null), 2000);
      }
    };

    const interval = setInterval(checkResourceRefill, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastResourceRefill]);

  // Difficulty-based dot switching system
  useEffect(() => {
    if (difficulty === 'normal') {
      if (switchTimer) {
        clearInterval(switchTimer);
        setSwitchTimer(null);
      }
      return;
    }

    const switchInterval = difficulty === 'hard' ? 15000 : difficulty === 'hardest' ? 10000 : 0;
    const switchCount = difficulty === 'hard' ? 3 : difficulty === 'hardest' ? 5 : 0;

    if (switchInterval > 0) {
      const timer = setInterval(() => {
        // Switch some lines and squares positions
        setLines(prev => {
          if (prev.length < 4) return prev;
          const shuffled = [...prev];
          const switches = Math.min(switchCount, Math.floor(shuffled.length / 2));
          
          for (let i = 0; i < switches; i++) {
            const idx1 = Math.floor(Math.random() * shuffled.length);
            const idx2 = Math.floor(Math.random() * shuffled.length);
            
            // Swap players
            const temp = shuffled[idx1].player;
            shuffled[idx1].player = shuffled[idx2].player;
            shuffled[idx2].player = temp;
          }
          
          return shuffled;
        });

        setFloatText({ text: 'Lines Switched!', color: '#FF6B00' });
        setTimeout(() => setFloatText(null), 1500);
      }, switchInterval);

      setSwitchTimer(timer);
      return () => clearInterval(timer);
    }
  }, [difficulty]);

  const currentTechs = currentPlayer === 1 ? p1Techs : p2Techs;
  const currentForbiddenTechs = currentPlayer === 1 ? p1ForbiddenTechs : p2ForbiddenTechs;
  const currentResource = currentPlayer === 1 ? p1Resource : p2Resource;
  const currentAnime = currentPlayer === 1 ? p1Anime : p2Anime;
  const currentColor = currentPlayer === 1 ? p1Color : p2Color;
  const isNarutoFaction = currentAnime === 'naruto';
  const sharinganIsActive = sharinganActive[`player${currentPlayer}`];

  const purchaseResources = (amount: number, cost: number) => {
    // In a real game, this would check player's currency
    // For now, we'll just add resources
    if (currentPlayer === 1) {
      setP1Resource(prev => Math.min(100, prev + amount));
    } else {
      setP2Resource(prev => Math.min(100, prev + amount));
    }
    setFloatText({ text: `+${amount} Resources!`, color: '#00FF88' });
    setTimeout(() => setFloatText(null), 2000);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'hard': return '#FF6B00';
      case 'hardest': return '#FF003C';
      default: return '#00FF88';
    }
  };

  useEffect(() => {
    if (gameOver && !rewardGiven) {
      const winner = scores[0] > scores[1] ? 1 : scores[1] > scores[0] ? 2 : 0;
      if (winner !== 0) {
        const difficultyMultiplier = difficulty === 'hard' ? 2 : difficulty === 'hardest' ? 3 : 1;
        const reward = scores[winner - 1] * difficultyMultiplier;
        updateCurrency({ bronze: (currentUser?.currency?.bronze || 0) + reward });
      }
      setRewardGiven(true);
    }
  }, [gameOver, rewardGiven, scores, difficulty, currentUser, updateCurrency]);

  if (gameOver) {
    const winner = scores[0] > scores[1] ? 1 : scores[1] > scores[0] ? 2 : 0;
    const winColor = winner === 1 ? p1Color : winner === 2 ? p2Color : '#8B00FF';
    const difficultyMultiplier = difficulty === 'hard' ? 2 : difficulty === 'hardest' ? 3 : 1;
    const reward = winner !== 0 ? scores[winner - 1] * difficultyMultiplier : 0;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center zankoku-bg z-50">
        <div className="scanline-overlay" />
        <div className="text-center relative z-10">
          <div className="text-[8rem] font-serif mb-4" style={{ color: '#FF003C', textShadow: '0 0 40px rgba(255,0,60,0.4)', opacity: 0.3 }}>残酷</div>
          <h1 className="font-display text-4xl font-black tracking-wider mb-4" style={{ color: winColor, textShadow: `0 0 30px ${winColor}60` }}>
            {winner === 0 ? 'DRAW' : `PLAYER ${winner} WINS`}
          </h1>
          <div className="font-display text-2xl font-bold mb-6" style={{ color: '#E8E8FF' }}>
            {scores[0]} — {scores[1]}
          </div>
          {winner !== 0 && (
            <div className="flex items-center justify-center gap-2 mb-8 font-display text-xl animate-pulse" style={{ color: '#CD7F32', textShadow: '0 0 10px rgba(205,127,50,0.5)' }}>
              +{reward} <Coins size={24} /> BRONZE EARNED
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/battle')} className="px-6 py-3 rounded-md font-display text-sm font-bold tracking-widest"
              style={{ background: '#FF003C20', color: '#FF003C', border: '1px solid #FF003C40' }}>
              BACK TO LOBBY
            </button>
            <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-md font-display text-sm font-bold tracking-widest"
              style={{ background: `${winColor}20`, color: winColor, border: `1px solid ${winColor}40` }}>
              REMATCH
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen zankoku-bg">
      <div className="scanline-overlay" />
      <div className="max-w-5xl mx-auto p-4 md:p-6 relative z-10">
        {/* Float text */}
        {floatText && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="float-text font-display text-5xl md:text-7xl font-black tracking-wider"
              style={{ color: floatText.color, textShadow: `0 0 40px ${floatText.color}80, 0 0 80px ${floatText.color}40` }}>
              {floatText.text}
            </div>
          </div>
        )}

        {/* Battle Effects */}
        {battleEffects.screenShake && (
          <div className="fixed inset-0 z-40 pointer-events-none animate-pulse">
            <div className="w-full h-full bg-red-500 opacity-10" />
          </div>
        )}
        
        {battleEffects.flash && (
          <div className="fixed inset-0 z-40 pointer-events-none">
            <div className="w-full h-full bg-white opacity-30 animate-ping" />
          </div>
        )}
        
        {battleEffects.slowMotion && (
          <div className="fixed inset-0 z-40 pointer-events-none">
            <div className="w-full h-full bg-purple-500 opacity-20 animate-pulse" />
          </div>
        )}

        {/* Tutorial Overlay */}
        {showTutorial && currentTutorialStep && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="max-w-md">
              <div className="p-3 rounded-lg pointer-events-auto" style={{ background: 'linear-gradient(135deg, #00C8FF15, #00FF8815)', border: '1px solid #00C8FF60', boxShadow: '0 0 20px rgba(0,200,255,0.2)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-['Orbitron'] text-xs font-bold mb-1" style={{ color: '#00C8FF' }}>
                      STEP {currentTutorialStep.id}/7
                    </h3>
                    <p className="font-['Rajdhani'] text-xs leading-tight" style={{ color: '#E8E8FF' }}>
                      {currentTutorialStep.message}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (tutorialRef.current) {
                        tutorialRef.current.skip();
                        setShowTutorial(false);
                      }
                    }}
                    className="px-2 py-1 rounded text-xs font-['Orbitron'] font-bold hover:brightness-110 transition-all flex-shrink-0"
                    style={{ background: '#FF003C20', color: '#FF003C', border: '1px solid #FF003C40' }}
                  >
                    SKIP
                  </button>
                </div>
                <div className="h-1 rounded-full overflow-hidden mt-2" style={{ background: '#1A1A2E' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${tutorialRef.current ? tutorialRef.current.getProgress() : 0}%`,
                      background: 'linear-gradient(90deg, #00C8FF, #00FF88)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technique Usage Notification */}
        {techniqueUsed && (
          <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="px-6 py-4 rounded-xl" style={{
              background: `linear-gradient(135deg, ${techniqueUsed.player === 1 ? p1Color : p2Color}20, ${techniqueUsed.player === 1 ? p1Color : p2Color}10)`,
              border: `2px solid ${techniqueUsed.player === 1 ? p1Color : p2Color}`,
              boxShadow: `0 0 30px ${techniqueUsed.player === 1 ? p1Color : p2Color}40, inset 0 0 20px ${techniqueUsed.player === 1 ? p1Color : p2Color}10`
            }}>
              <div className="text-center">
                <div className="font-['Orbitron'] text-xs font-bold mb-1" style={{ color: techniqueUsed.player === 1 ? p1Color : p2Color }}>
                  {techniqueUsed.player === 1 ? `P1 · ${currentUser?.username || 'Player 1'}` : `P2 · ${p2Username}`} TECHNIQUE
                </div>
                <div className="font-display text-2xl font-black tracking-wider" style={{ 
                  color: techniqueUsed.player === 1 ? p1Color : p2Color,
                  textShadow: `0 0 20px ${techniqueUsed.player === 1 ? p1Glow : p2Glow}`
                }}>
                  {techniqueUsed.technique.name}
                </div>
                <div className="font-['Rajdhani'] text-sm mt-1 opacity-90" style={{ color: '#E8E8FF' }}>
                  {techniqueUsed.technique.description}
                </div>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="px-2 py-1 rounded text-xs font-['Orbitron'] font-bold" style={{
                    background: `${techniqueUsed.player === 1 ? p1Color : p2Color}20`,
                    color: techniqueUsed.player === 1 ? p1Color : p2Color,
                    border: `1px solid ${techniqueUsed.player === 1 ? p1Color : p2Color}40`
                  }}>
                    COST: {techniqueUsed.technique.cost}
                  </div>
                  <div className="px-2 py-1 rounded text-xs font-['Orbitron'] font-bold" style={{
                    background: `${techniqueUsed.player === 1 ? p1Color : p2Color}20`,
                    color: techniqueUsed.player === 1 ? p1Color : p2Color,
                    border: `1px solid ${techniqueUsed.player === 1 ? p1Color : p2Color}40`
                  }}>
                    {techniqueUsed.technique.effect.toUpperCase().replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Callouts */}
        <div className="fixed top-20 left-0 right-0 z-40 pointer-events-none">
          <div className="max-w-2xl mx-auto space-y-2">
            {activeCallouts.map(callout => (
              <div key={callout.id} className="text-center animate-bounce">
                <div className={`font-display text-2xl md:text-4xl font-black tracking-wider ${
                  callout.intensity === 'legendary' ? 'text-yellow-400' :
                  callout.intensity === 'major' ? 'text-orange-400' :
                  'text-blue-400'
                }`}
                  style={{ 
                    textShadow: callout.intensity === 'legendary' ? '0 0 30px rgba(255,255,0,0.8)' :
                                 callout.intensity === 'major' ? '0 0 20px rgba(255,165,0,0.8)' :
                                 '0 0 10px rgba(100,149,237,0.8)',
                    animation: 'slideInDown 0.5s ease-out'
                  }}>
                  {callout.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score bar */}
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-lg flex-1 mr-2 ${currentPlayer === 1 ? 'active-pulse' : ''}`}
            style={{ background: '#080812', border: `2px solid ${currentPlayer === 1 ? p1Color : '#1A1A2E'}`, boxShadow: currentPlayer === 1 ? `0 0 20px ${p1Color}30` : 'none' }}>
            <div className="font-display text-xs font-bold tracking-wider mb-1" style={{ color: p1Color }}>P1 · {currentUser?.username || 'Player 1'}</div>
            <div className="font-display text-3xl font-black" style={{ color: p1Color }}>{scores[0]}</div>
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: '#1A1A2E' }}>
              <div className="h-full rounded-full resource-bar" style={{ width: `${p1Resource}%`, background: `linear-gradient(90deg, ${p1Color}, ${p1Glow})` }} />
            </div>
            <div className="font-body text-xs mt-1" style={{ color: '#6666AA' }}>{FACTION_RESOURCE[p1Anime]}: {p1Resource}/100</div>
            
            {/* Momentum Bar */}
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: '#1A1A2E' }}>
              <div 
                className="h-full rounded-full transition-all duration-300" 
                style={{ 
                  width: `${momentumLevel.player1}%`, 
                  background: momentum.player1 === 'legendary' ? 'linear-gradient(90deg, #FFD700, #FFA500)' :
                             momentum.player1 === 'peak' ? 'linear-gradient(90deg, #FF6B00, #FF4500)' :
                             momentum.player1 === 'high' ? 'linear-gradient(90deg, #00FF88, #00CC66)' :
                             momentum.player1 === 'normal' ? 'linear-gradient(90deg, #6666AA, #555599)' :
                             momentum.player1 === 'low' ? 'linear-gradient(90deg, #FF6B6B, #FF4444)' :
                             'linear-gradient(90deg, #FF003C, #CC0020)'
                }} 
              />
            </div>
            <div className="font-body text-xs mt-1" style={{ 
              color: momentum.player1 === 'legendary' ? '#FFD700' :
                     momentum.player1 === 'peak' ? '#FF6B00' :
                     momentum.player1 === 'high' ? '#00FF88' :
                     momentum.player1 === 'normal' ? '#6666AA' :
                     momentum.player1 === 'low' ? '#FF6B6B' :
                     '#FF003C'
            }}>
              MOMENTUM: {momentum.player1.toUpperCase()} ({momentumLevel.player1}%)
            </div>
            
            {/* Battle State Indicator */}
            {battleState.player1 !== 'normal' && (
              <div className={`mt-2 text-xs font-bold text-center px-2 py-1 rounded ${
                battleState.player1 === 'awakening' ? 'bg-purple-600 text-white' :
                battleState.player1 === 'last_stand' ? 'bg-red-600 text-white' :
                battleState.player1 === 'overload' ? 'bg-orange-600 text-white' :
                battleState.player1 === 'forbidden' ? 'bg-black text-red-400 border border-red-400' :
                'bg-gray-600 text-white'
              }`}>
                {battleState.player1.toUpperCase().replace('_', ' ')}
              </div>
            )}
          </div>

          <div className="font-display text-xl font-bold px-4" style={{ color: '#333355' }}>VS</div>

          <div className={`p-4 rounded-lg flex-1 ml-2 ${currentPlayer === 2 ? 'active-pulse' : ''}`}
            style={{ background: '#080812', border: `2px solid ${currentPlayer === 2 ? p2Color : '#1A1A2E'}`, boxShadow: currentPlayer === 2 ? `0 0 20px ${p2Color}30` : 'none' }}>
            <div className="font-display text-xs font-bold tracking-wider mb-1 text-right flex items-center justify-end gap-2" style={{ color: p2Color }}>
              <span>{isAIMode ? 'AI' : 'P2'} · {p2Username}</span>
              {isAIMode && isAIThinking && (
                <span className="text-xs animate-pulse" style={{ color: '#FFD700' }}>THINKING...</span>
              )}
            </div>
            <div className="font-display text-3xl font-black text-right" style={{ color: p2Color }}>{scores[1]}</div>
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: '#1A1A2E' }}>
              <div className="h-full rounded-full resource-bar" style={{ width: `${p2Resource}%`, background: `linear-gradient(90deg, ${p2Color}, ${p2Glow})` }} />
            </div>
            <div className="font-body text-xs mt-1 text-right" style={{ color: '#6666AA' }}>{FACTION_RESOURCE[p2Anime]}: {p2Resource}/100</div>
            
            {/* Momentum Bar */}
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: '#1A1A2E' }}>
              <div 
                className="h-full rounded-full transition-all duration-300" 
                style={{ 
                  width: `${momentumLevel.player2}%`, 
                  background: momentum.player2 === 'legendary' ? 'linear-gradient(90deg, #FFD700, #FFA500)' :
                             momentum.player2 === 'peak' ? 'linear-gradient(90deg, #FF6B00, #FF4500)' :
                             momentum.player2 === 'high' ? 'linear-gradient(90deg, #00FF88, #00CC66)' :
                             momentum.player2 === 'normal' ? 'linear-gradient(90deg, #6666AA, #555599)' :
                             momentum.player2 === 'low' ? 'linear-gradient(90deg, #FF6B6B, #FF4444)' :
                             'linear-gradient(90deg, #FF003C, #CC0020)'
                }} 
              />
            </div>
            <div className="font-body text-xs mt-1 text-right" style={{ 
              color: momentum.player2 === 'legendary' ? '#FFD700' :
                     momentum.player2 === 'peak' ? '#FF6B00' :
                     momentum.player2 === 'high' ? '#00FF88' :
                     momentum.player2 === 'normal' ? '#6666AA' :
                     momentum.player2 === 'low' ? '#FF6B6B' :
                     '#FF003C'
            }}>
              MOMENTUM: {momentum.player2.toUpperCase()} ({momentumLevel.player2}%)
            </div>
            
            {/* Battle State Indicator */}
            {battleState.player2 !== 'normal' && (
              <div className={`mt-2 text-xs font-bold text-center px-2 py-1 rounded ${
                battleState.player2 === 'awakening' ? 'bg-purple-600 text-white' :
                battleState.player2 === 'last_stand' ? 'bg-red-600 text-white' :
                battleState.player2 === 'overload' ? 'bg-orange-600 text-white' :
                battleState.player2 === 'forbidden' ? 'bg-black text-red-400 border border-red-400' :
                'bg-gray-600 text-white'
              }`}>
                {battleState.player2.toUpperCase().replace('_', ' ')}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Game board */}
          <div className="flex-1 flex justify-center order-1 lg:order-1">
            <div className="w-full max-w-[500px] flex justify-center">
              <svg width={svgSize} height={svgSize} className="rounded-lg w-full h-auto" style={{ background: '#050510', maxWidth: '100%' }}>
              {/* Completed squares */}
              {squares.map((sq, i) => {
                const color = sq.player === 1 ? p1Color : p2Color;
                const isCracked = sq.cracked;
                const isCorrupted = sq.corrupted;
                
                return (
                  <g key={`sq-${i}`}>
                    <rect
                      x={PADDING + sq.c * DOT_SPACING}
                      y={PADDING + sq.r * DOT_SPACING}
                      width={DOT_SPACING}
                      height={DOT_SPACING}
                      fill={isCorrupted ? '#8B00FF' : color}
                      fillOpacity={isCracked ? 0.1 : isCorrupted ? 0.3 : 0.2}
                      stroke={isCorrupted ? '#FF00FF' : color}
                      strokeWidth={isCracked ? 2 : 1}
                      strokeOpacity={isCracked ? 0.8 : isCorrupted ? 0.9 : 0.5}
                      strokeDasharray={isCracked ? '3,3' : ''}
                    />
                    {isCracked && (
                      <line
                        x1={PADDING + sq.c * DOT_SPACING}
                        y1={PADDING + sq.r * DOT_SPACING}
                        x2={PADDING + (sq.c + 1) * DOT_SPACING}
                        y2={PADDING + (sq.r + 1) * DOT_SPACING}
                        stroke='#FF003C'
                        strokeWidth={2}
                        opacity={0.6}
                      />
                    )}
                  </g>
                );
              })}

              {/* Completed triangles */}
              {duelType === 'triangle' && triangles.map((tri, i) => {
                const color = tri.player === 1 ? p1Color : p2Color;
                const isCracked = tri.cracked;
                const isCorrupted = tri.corrupted;
                const x1 = PADDING + tri.c1 * DOT_SPACING;
                const y1 = PADDING + tri.r1 * DOT_SPACING;
                const x2 = PADDING + tri.c2 * DOT_SPACING;
                const y2 = PADDING + tri.r2 * DOT_SPACING;
                const x3 = PADDING + tri.c3 * DOT_SPACING;
                const y3 = PADDING + tri.r3 * DOT_SPACING;
                
                return (
                  <g key={`tri-${i}`}>
                    <polygon
                      points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                      fill={isCorrupted ? '#8B00FF' : color}
                      fillOpacity={isCracked ? 0.05 : isCorrupted ? 0.25 : 0.15}
                      stroke={isCorrupted ? '#FF00FF' : color}
                      strokeWidth={isCracked ? 2 : 1}
                      strokeOpacity={isCracked ? 0.8 : isCorrupted ? 0.9 : 0.6}
                      strokeDasharray={isCracked ? '3,3' : ''}
                    />
                    {isCracked && (
                      <line
                        x1={x1}
                        y1={y1}
                        x2={(x1 + x2 + x3) / 3}
                        y2={(y1 + y2 + y3) / 3}
                        stroke='#FF003C'
                        strokeWidth={2}
                        opacity={0.6}
                      />
                    )}
                  </g>
                );
              })}

              {/* Clickable line areas */}
              {getAvailableLines().map(([r1, c1, r2, c2]) => {
                const x1 = PADDING + c1 * DOT_SPACING;
                const y1 = PADDING + r1 * DOT_SPACING;
                const x2 = PADDING + c2 * DOT_SPACING;
                const y2 = PADDING + r2 * DOT_SPACING;
                const isHorizontal = r1 === r2;
                return (
                  <line key={`avail-${r1}-${c1}-${r2}-${c2}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={currentColor}
                    strokeWidth={10}
                    strokeOpacity={0}
                    className="cursor-pointer"
                    onMouseEnter={e => { (e.target as SVGLineElement).setAttribute('stroke-opacity', '0.2'); }}
                    onMouseLeave={e => { (e.target as SVGLineElement).setAttribute('stroke-opacity', '0'); }}
                    onClick={() => placeLine(r1, c1, r2, c2)}
                  />
                );
              })}

              {/* Drawn lines */}
              {lines.map((l, i) => {
                const color = l.player === 1 ? p1Color : p2Color;
                const glow = l.player === 1 ? p1Glow : p2Glow;
                return (
                  <g key={`line-${i}`}>
                    <line
                      x1={PADDING + l.c1 * DOT_SPACING} y1={PADDING + l.r1 * DOT_SPACING}
                      x2={PADDING + l.c2 * DOT_SPACING} y2={PADDING + l.r2 * DOT_SPACING}
                      stroke={color} strokeWidth={3} strokeLinecap="round"
                      filter={`drop-shadow(0 0 4px ${glow})`}
                    />
                  </g>
                );
              })}

              {/* Visual effects for techniques */}
              {visualEffects.map(effect => {
                const getEffectElement = () => {
                  switch (effect.type) {
                    case 'explosion':
                      return (
                        <g>
                          <circle cx={effect.x} cy={effect.y} r="20" fill="none" stroke={effect.color} strokeWidth="3" opacity="0.8">
                            <animate attributeName="r" from="5" to="40" dur="0.5s" />
                            <animate attributeName="opacity" from="1" to="0" dur="0.5s" />
                          </circle>
                          <circle cx={effect.x} cy={effect.y} r="10" fill={effect.color} opacity="0.6">
                            <animate attributeName="r" from="2" to="20" dur="0.3s" />
                            <animate attributeName="opacity" from="0.8" to="0" dur="0.3s" />
                          </circle>
                        </g>
                      );
                    case 'flash':
                      return (
                        <rect x="0" y="0" width={svgSize} height={svgSize} fill={effect.color} opacity="0.3">
                          <animate attributeName="opacity" from="0.3" to="0" dur="0.3s" />
                        </rect>
                      );
                    case 'steal':
                      return (
                        <g>
                          <circle cx={effect.x} cy={effect.y} r="15" fill="none" stroke={effect.color} strokeWidth="2" strokeDasharray="5,5">
                            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite" />
                          </circle>
                          <path d={`M ${effect.x-10} ${effect.y} L ${effect.x} ${effect.y-10} L ${effect.x+10} ${effect.y} L ${effect.x} ${effect.y+10} Z`} fill={effect.color} opacity="0.7">
                            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite" />
                          </path>
                        </g>
                      );
                    case 'freeze':
                      return (
                        <g>
                          {[0, 45, 90, 135].map((angle, i) => (
                            <line key={i} x1={effect.x} y1={effect.y} x2={effect.x + 30 * Math.cos(angle * Math.PI / 180)} y2={effect.y + 30 * Math.sin(angle * Math.PI / 180)} stroke={effect.color} strokeWidth="3" opacity="0.7">
                              <animate attributeName="opacity" from="0" to="0.7" dur="0.2s" begin={`${i * 0.1}s`} />
                            </line>
                          ))}
                        </g>
                      );
                    case 'shield':
                      return (
                        <g>
                          <circle cx={effect.x} cy={effect.y} r="25" fill="none" stroke={effect.color} strokeWidth="3" opacity="0.6">
                            <animate attributeName="r" from="15" to="25" dur="0.5s" />
                          </circle>
                          <circle cx={effect.x} cy={effect.y} r="20" fill="none" stroke={effect.color} strokeWidth="2" opacity="0.4">
                            <animate attributeName="r" from="10" to="20" dur="0.5s" />
                          </circle>
                        </g>
                      );
                    case 'domain':
                      return (
                        <g>
                          <rect x={effect.x - 40} y={effect.y - 40} width="80" height="80" fill="none" stroke={effect.color} strokeWidth="3" opacity="0.5">
                            <animate attributeName="opacity" from="0" to="0.5" dur="0.5s" />
                          </rect>
                          <rect x={effect.x - 30} y={effect.y - 30} width="60" height="60" fill="none" stroke={effect.color} strokeWidth="2" opacity="0.3">
                            <animate attributeName="opacity" from="0" to="0.3" dur="0.5s" />
                          </rect>
                        </g>
                      );
                    default:
                      return (
                        <circle cx={effect.x} cy={effect.y} r="20" fill={effect.color} opacity="0.5">
                          <animate attributeName="r" from="5" to="20" dur="0.5s" />
                          <animate attributeName="opacity" from="0.8" to="0" dur="0.5s" />
                        </circle>
                      );
                  }
                };

                return (
                  <g key={effect.id}>
                    {getEffectElement()}
                  </g>
                );
              })}

              {/* Dots */}
              {Array.from({ length: gridSize }).map((_, r) =>
                Array.from({ length: gridSize }).map((_, c) => (
                  <g key={`dot-${r}-${c}`}>
                    <circle
                      cx={PADDING + c * DOT_SPACING}
                      cy={PADDING + r * DOT_SPACING}
                      r={5}
                      fill="#0D0D1A"
                      stroke={currentColor}
                      strokeWidth={1.5}
                      filter={`drop-shadow(0 0 3px ${currentColor}60)`}
                    />
                  </g>
                ))
              )}
            </svg>
            </div>
          </div>

          {/* Game controls panel */}
          <div className="lg:w-64 w-full space-y-3 order-2 lg:order-2">
            {/* Resource purchase */}
            <div>
              <h3 className="font-display text-xs font-bold tracking-widest mb-2" style={{ color: '#00FF88' }}>PURCHASE RESOURCES</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                <button onClick={() => purchaseResources(25, 10)}
                  className="px-2 py-1 rounded text-xs font-display transition-all duration-200"
                  style={{
                    background: '#00FF8810',
                    color: '#00FF88',
                    border: '1px solid #00FF8830',
                  }}>
                  +25 Resources (10 Silver)
                </button>
                <button onClick={() => purchaseResources(50, 20)}
                  className="px-2 py-1 rounded text-xs font-display transition-all duration-200"
                  style={{
                    background: '#00FF8810',
                    color: '#00FF88',
                    border: '1px solid #00FF8830',
                  }}>
                  +50 Resources (20 Silver)
                </button>
                <button onClick={() => purchaseResources(100, 50)}
                  className="w-full px-2 py-1 rounded text-xs font-display transition-all duration-200"
                  style={{
                    background: '#FFD70010',
                    color: '#FFD700',
                    border: '1px solid #FFD70030',
                  }}>
                  +100 Resources (50 Gold)
                </button>
              </div>
            </div>

            {/* Sharingan Abilities (Naruto Faction Only) */}
            {isNarutoFaction && (
              <div className="mb-4">
                <div className="mb-2 p-2 rounded" style={{ background: '#FF000010', border: '1px solid #FF000040' }}>
                  <h3 className="font-display text-xs font-bold tracking-widest flex items-center gap-2" style={{ color: '#FF0000' }}>
                    <span>👁️ SHARINGAN</span>
                    {sharinganIsActive && <span className="text-xs animate-pulse">ACTIVE</span>}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (currentResource >= 15) {
                        if (currentPlayer === 1) {
                          setP1Resource(prev => prev - 15);
                        } else {
                          setP2Resource(prev => prev - 15);
                        }
                        setSharinganActive(prev => ({ ...prev, [`player${currentPlayer}`]: true }));
                        const prediction = sharinganRef.current.predictOpponentMoves(lines, gridSize, currentPlayer === 1 ? 2 : 1);
                        setPredictedMoves(prediction.possibleMoves);
                        setFloatText({ text: 'Sharingan Activated!', color: '#FF0000' });
                        setTimeout(() => setFloatText(null), 2000);
                      }
                    }}
                    disabled={currentResource < 15 || sharinganIsActive}
                    className="px-2 py-2 rounded text-xs font-display transition-all"
                    style={{
                      background: currentResource >= 15 && !sharinganIsActive ? '#FF000015' : '#080812',
                      border: `1px solid ${currentResource >= 15 && !sharinganIsActive ? '#FF0000' : '#1A1A2E'}`,
                      color: currentResource >= 15 && !sharinganIsActive ? '#FF0000' : '#333355',
                      opacity: currentResource >= 15 && !sharinganIsActive ? 1 : 0.4,
                      cursor: currentResource >= 15 && !sharinganIsActive ? 'pointer' : 'not-allowed'
                    }}>
                    <div className="font-bold">Activate</div>
                    <div className="text-xs opacity-75">15 Cost</div>
                  </button>
                  <button
                    onClick={() => {
                      if (lastOpponentMove.technique && sharinganIsActive) {
                        const copyInfo = sharinganRef.current.copyTechnique(lastOpponentMove.technique, currentResource);
                        if (copyInfo.canCopy) {
                          activateTechnique(lastOpponentMove.technique);
                          setFloatText({ text: 'Technique Copied!', color: '#FF0000' });
                          setTimeout(() => setFloatText(null), 2000);
                        }
                      }
                    }}
                    disabled={!sharinganIsActive || !lastOpponentMove.technique}
                    className="px-2 py-2 rounded text-xs font-display transition-all"
                    style={{
                      background: sharinganIsActive && lastOpponentMove.technique ? '#FF000015' : '#080812',
                      border: `1px solid ${sharinganIsActive && lastOpponentMove.technique ? '#FF0000' : '#1A1A2E'}`,
                      color: sharinganIsActive && lastOpponentMove.technique ? '#FF0000' : '#333355',
                      opacity: sharinganIsActive && lastOpponentMove.technique ? 1 : 0.4,
                      cursor: sharinganIsActive && lastOpponentMove.technique ? 'pointer' : 'not-allowed'
                    }}>
                    <div className="font-bold">Copy</div>
                    <div className="text-xs opacity-75">Last Tech</div>
                  </button>
                </div>
              </div>
            )}

            {/* Techniques panel */}
            <div>
              <h3 className="font-display text-xs font-bold tracking-widest" style={{ color: currentColor }}>
                P{currentPlayer} TECHNIQUES
              </h3>
              {currentTechs.map(tech => {
                const canUse = currentResource >= tech.cost;
                return (
                  <button key={tech.name} onClick={() => {
                  if (canUse) {
                    activateTechnique(tech);
                  }
                }}
                    disabled={!canUse}
                    className="w-full text-left p-3 rounded-lg transition-all duration-200"
                    style={{
                      background: canUse ? `${currentColor}10` : '#080812',
                      border: `1px solid ${canUse ? `${currentColor}40` : '#1A1A2E'}`,
                      opacity: canUse ? 1 : 0.4,
                      cursor: canUse ? 'pointer' : 'not-allowed',
                    }}>
                    <div className="font-display text-xs font-bold mb-1" style={{ color: canUse ? currentColor : '#333355' }}>{tech.name}</div>
                    <div className="font-body text-xs" style={{ color: '#6666AA' }}>{tech.description}</div>
                    <div className="font-display text-xs mt-1" style={{ color: '#FFD700' }}>Cost: {tech.cost}</div>
                  </button>
                );
              })}
            </div>

            {/* Momentum Power Button */}
            <div className="mt-4">
              <div className="mb-2 p-2 rounded" style={{ background: '#FFD70010', border: '1px solid #FFD70040' }}>
                <h3 className="font-display text-xs font-bold tracking-widest flex items-center gap-2" style={{ color: '#FFD700' }}>
                  <span>⚡ MOMENTUM POWER</span>
                </h3>
                <p className="font-body text-xs mt-1" style={{ color: '#FFD70080' }}>Destroy 5 opponent shapes when momentum reaches 100%</p>
              </div>
              <button
                onClick={() => useMomentumPower(currentPlayer)}
                disabled={momentumLevel[`player${currentPlayer}`] < 100}
                className="w-full text-left p-4 rounded-lg transition-all duration-200"
                style={{
                  background: momentumLevel[`player${currentPlayer}`] >= 100 ? '#FFD70020' : '#080812',
                  border: `2px solid ${momentumLevel[`player${currentPlayer}`] >= 100 ? '#FFD700' : '#1A1A2E'}`,
                  opacity: momentumLevel[`player${currentPlayer}`] >= 100 ? 1 : 0.4,
                  cursor: momentumLevel[`player${currentPlayer}`] >= 100 ? 'pointer' : 'not-allowed',
                  boxShadow: momentumLevel[`player${currentPlayer}`] >= 100 ? '0 0 20px rgba(255, 215, 0, 0.3)' : 'none'
                }}>
                <div className="font-display text-sm font-bold mb-2" style={{ 
                  color: momentumLevel[`player${currentPlayer}`] >= 100 ? '#FFD700' : '#333355',
                  textShadow: momentumLevel[`player${currentPlayer}`] >= 100 ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'
                }}>
                  {momentumLevel[`player${currentPlayer}`] >= 100 ? '⚡ UNLEASH MOMENTUM!' : `Momentum: ${momentumLevel[`player${currentPlayer}`]}%`}
                </div>
                <div className="font-body text-xs" style={{ color: momentumLevel[`player${currentPlayer}`] >= 100 ? '#FFD70080' : '#6666AA' }}>
                  {momentumLevel[`player${currentPlayer}`] >= 100 ? 'Destroys 5 opponent shapes and resets to 0%' : 'Requires 100% momentum to use'}
                </div>
              </button>
            </div>

            {/* Forbidden Techniques panel */}
            <div className="mt-4">
              <div className="mb-2 p-2 rounded" style={{ background: '#FF003C10', border: '1px solid #FF003C40' }}>
                <h3 className="font-display text-xs font-bold tracking-widest flex items-center gap-2" style={{ color: '#FF003C' }}>
                  <span>⚠️ FORBIDDEN TECHNIQUES</span>
                </h3>
                <p className="font-body text-xs mt-1" style={{ color: '#FF6B6B' }}>High risk, high reward. Severe penalties apply.</p>
              </div>
              {currentForbiddenTechs.map(tech => {
                const canUse = currentResource >= tech.cost && forbiddenAvailable[`player${currentPlayer}`];
                return (
                  <button key={tech.name} onClick={() => {
                    if (canUse) {
                      activateTechnique(tech);
                    }
                  }}
                    disabled={!canUse}
                    className="w-full text-left p-3 rounded-lg transition-all duration-200 mb-2"
                    style={{
                      background: canUse ? '#FF003C15' : '#080812',
                      border: `2px solid ${canUse ? '#FF003C' : '#1A1A2E'}`,
                      opacity: canUse ? 1 : 0.3,
                      cursor: canUse ? 'pointer' : 'not-allowed',
                      boxShadow: canUse ? '0 0 15px rgba(255,0,60,0.3)' : 'none'
                    }}>
                    <div className="font-display text-xs font-bold mb-1 flex items-center gap-2" style={{ color: canUse ? '#FF003C' : '#333355' }}>
                      <span>💀</span>
                      {tech.name}
                    </div>
                    <div className="font-body text-xs" style={{ color: '#6666AA' }}>{tech.description}</div>
                    <div className="font-display text-xs mt-1 flex justify-between">
                      <span style={{ color: '#FFD700' }}>Cost: {tech.cost}</span>
                      {!forbiddenAvailable[`player${currentPlayer}`] && (
                        <span style={{ color: '#FF003C', fontSize: '10px' }}>🔒 LOCKED</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {activeEffects.length > 0 && (
              <div>
                <h3 className="font-display text-xs font-bold tracking-widest mt-4 mb-2" style={{ color: '#FFD700' }}>ACTIVE EFFECTS</h3>
                <div className="flex flex-wrap gap-1">
                  {activeEffects.map((e, i) => (
                    <span key={i} className="px-2 py-1 rounded text-xs font-body" style={{ background: '#FFD70010', color: '#FFD700', border: '1px solid #FFD70030' }}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => navigate('/battle')} className="font-body text-sm" style={{ color: '#6666AA' }}>← Leave Battle</button>
        </div>
      </div>
    </div>
  );
};

export default DotWarsGame;
