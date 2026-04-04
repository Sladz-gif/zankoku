/**
 * ZANKOKU DOT WARS AI ENGINE
 * 
 * A highly intelligent AI system that plays Dot Wars with adaptive strategies,
 * effective technique usage, and difficulty scaling from beginner-friendly to ruthless.
 * 
 * Features:
 * - Multi-layered strategic analysis (defensive, offensive, opportunistic)
 * - Dynamic technique usage based on game state
 * - Momentum and resource management
 * - Pattern recognition and counter-strategies
 * - Difficulty scaling with different personalities
 */

import { AnimeFaction, Technique, TECHNIQUES } from '@/types/game';

interface Line {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  player: number;
}

interface Square {
  r: number;
  c: number;
  player: number;
  protected?: boolean;
  cracked?: boolean;
}

interface Triangle {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  r3: number;
  c3: number;
  player: number;
  protected?: boolean;
  cracked?: boolean;
}

interface GameState {
  lines: Line[];
  squares: Square[];
  triangles: Triangle[];
  gridSize: number;
  aiPlayer: number;
  humanPlayer: number;
  aiResource: number;
  humanResource: number;
  aiScore: number;
  humanScore: number;
  turnCount: number;
  aiMomentum: number;
  humanMomentum: number;
  duelType: 'square' | 'triangle';
}

interface MoveScore {
  line: [number, number, number, number];
  score: number;
  reason: string;
  completesShape: boolean;
  blocksOpponent: boolean;
  setupsCombo: boolean;
  trapsPotential: number;
  futureShapes: number;
  controlsCenter: boolean;
}

export type AIDifficulty = 'tutorial' | 'practice' | 'master';

export class DotWarsAI {
  private difficulty: AIDifficulty;
  private faction: AnimeFaction;
  private techniques: Technique[];
  private moveHistory: [number, number, number, number][] = [];
  private opponentPatterns: Map<string, number> = new Map();
  private aggressiveness: number; // 0-1, how aggressive the AI plays
  private patience: number; // 0-1, how much AI waits for perfect setups
  private techniqueThreshold: number; // Resource threshold for using techniques
  private lookaheadDepth: number; // How many moves ahead to analyze
  private trapAwareness: number; // 0-1, ability to detect and avoid traps
  private openingBook: Map<string, [number, number, number, number][]>; // Opening strategies
  private playerMovePatterns: Map<string, number>; // Track player patterns for prediction
  private gamePhase: 'opening' | 'midgame' | 'endgame'; // Current game phase
  private evaluationCache: Map<string, number>; // Cache position evaluations
  private transpositionTable: Map<string, { score: number; depth: number; bestMove: [number, number, number, number] }>; // Transposition table
  private currentPlan: [number, number, number, number] | null; // Current strategic plan (hysteresis)
  private planStability: number; // How many turns to stick with plan
  private forgivenessWindow: number; // Early game forgiveness turns
  private pieceSquareTables: Map<string, number[][]>; // Position value tables

  constructor(faction: AnimeFaction, difficulty: AIDifficulty = 'practice') {
    this.faction = faction;
    this.difficulty = difficulty;
    this.techniques = TECHNIQUES[faction] || [];
    this.openingBook = new Map();
    this.playerMovePatterns = new Map();
    this.gamePhase = 'opening';
    this.evaluationCache = new Map();
    this.transpositionTable = new Map();
    this.currentPlan = null;
    this.planStability = 0;
    this.forgivenessWindow = 0;
    this.pieceSquareTables = new Map();
    this.initializeOpeningBook();
    this.initializePieceSquareTables();
    
    // Set AI personality based on difficulty
    switch (difficulty) {
      case 'tutorial':
        this.aggressiveness = 0.4;
        this.patience = 0.3;
        this.techniqueThreshold = 70;
        this.lookaheadDepth = 1;
        this.trapAwareness = 0.3;
        this.forgivenessWindow = 5; // Give player 5 turns to set up
        break;
      case 'practice':
        this.aggressiveness = 0.8;
        this.patience = 0.7;
        this.techniqueThreshold = 50;
        this.lookaheadDepth = 2;
        this.trapAwareness = 0.7;
        this.forgivenessWindow = 3; // Give player 3 turns
        break;
      case 'master':
        this.aggressiveness = 1.0;
        this.patience = 0.9;
        this.techniqueThreshold = 30;
        this.lookaheadDepth = 4; // Deeper search with iterative deepening
        this.trapAwareness = 1.0;
        this.forgivenessWindow = 0; // No mercy
        break;
    }
  }

  /**
   * Main decision-making function - returns the best move for the AI
   */
  public async makeMove(gameState: GameState): Promise<[number, number, number, number] | null> {
    // Small delay for realism
    await this.delay(this.difficulty === 'tutorial' ? 800 : this.difficulty === 'practice' ? 500 : 300);

    const availableLines = this.getAvailableLines(gameState);
    if (availableLines.length === 0) return null;

    // Update game phase
    this.updateGamePhase(gameState);

    // COGNITIVE BIAS: Forgiveness window (make AI weaker early game for fun)
    const effectiveDepth = gameState.turnCount < this.forgivenessWindow ? 
      Math.max(1, this.lookaheadDepth - 2) : this.lookaheadDepth;

    // ADVANCED: Check opening book first (early game)
    if (this.gamePhase === 'opening' && this.difficulty !== 'tutorial') {
      const bookMove = this.getOpeningBookMove(gameState);
      if (bookMove) {
        this.moveHistory.push(bookMove);
        this.updatePatternRecognition(bookMove);
        this.currentPlan = bookMove;
        this.planStability = 2;
        return bookMove;
      }
    }

    // COGNITIVE BIAS: Hysteresis - stick with current plan if it's still good
    if (this.currentPlan && this.planStability > 0 && this.difficulty !== 'tutorial') {
      const isPlanStillValid = availableLines.some(line => 
        line[0] === this.currentPlan![0] && line[1] === this.currentPlan![1] &&
        line[2] === this.currentPlan![2] && line[3] === this.currentPlan![3]
      );
      if (isPlanStillValid) {
        this.planStability--;
        const planMove = this.currentPlan;
        this.moveHistory.push(planMove);
        this.updatePatternRecognition(planMove);
        return planMove;
      } else {
        this.currentPlan = null;
        this.planStability = 0;
      }
    }

    // Check transposition table first
    const positionHash = this.getPositionHash(gameState);
    const cachedResult = this.transpositionTable.get(positionHash);
    if (cachedResult && cachedResult.depth >= effectiveDepth) {
      const cachedMove = cachedResult.bestMove;
      this.moveHistory.push(cachedMove);
      this.updatePatternRecognition(cachedMove);
      return cachedMove;
    }

    // ADVANCED: Predict player's likely next move
    const predictedPlayerMove = this.predictPlayerMove(gameState);
    
    // ITERATIVE DEEPENING: Search progressively deeper
    let bestMoveOverall: MoveScore | null = null;
    for (let depth = 1; depth <= effectiveDepth; depth++) {
      const moveScores = this.analyzeAllMovesWithDepth(gameState, availableLines, predictedPlayerMove, depth);
      
      // MOVE ORDERING: Sort by previous iteration's scores for better pruning
      if (bestMoveOverall) {
        moveScores.sort((a, b) => {
          if (a.line === bestMoveOverall!.line) return -1;
          if (b.line === bestMoveOverall!.line) return 1;
          return b.score - a.score;
        });
      }

      // ADVANCED: Apply minimax with alpha-beta for deeper searches
      if (depth >= 2 && this.difficulty !== 'tutorial') {
        this.applyAlphaBetaMinimax(moveScores, gameState, depth);
      }

      bestMoveOverall = moveScores[0];
    }

    const moveScores = this.analyzeAllMoves(gameState, availableLines, predictedPlayerMove);

    // ADVANCED: Endgame tactics
    if (this.gamePhase === 'endgame') {
      this.applyEndgameTactics(moveScores, gameState);
    }
    
    // Select best move based on difficulty
    const selectedMove = this.selectMove(moveScores, gameState);
    
    if (selectedMove) {
      this.moveHistory.push(selectedMove.line);
      this.updatePatternRecognition(selectedMove.line);
      this.learnFromMove(selectedMove, gameState);
      
      // Store in transposition table
      this.transpositionTable.set(positionHash, {
        score: selectedMove.score,
        depth: effectiveDepth,
        bestMove: selectedMove.line
      });
      
      // COGNITIVE BIAS: Set new plan with hysteresis
      if (selectedMove.setupsCombo || selectedMove.trapsPotential > 0) {
        this.currentPlan = selectedMove.line;
        this.planStability = this.difficulty === 'master' ? 3 : 2;
      }
    }

    return selectedMove?.line || null;
  }

  /**
   * Decide whether to use a technique and which one
   */
  public decideTechnique(gameState: GameState): Technique | null {
    const { aiResource, aiScore, humanScore, turnCount, aiMomentum } = gameState;

    // Tutorial mode: use techniques sparingly but strategically
    if (this.difficulty === 'tutorial' && Math.random() > 0.3) {
      return null;
    }

    // Lower threshold for technique usage - be more aggressive
    const effectiveThreshold = this.difficulty === 'master' ? 
      this.techniqueThreshold * 0.7 : this.techniqueThreshold * 0.85;
    
    if (aiResource < effectiveThreshold) {
      return null;
    }

    // Analyze game state to determine best technique
    const scoreDiff = aiScore - humanScore;
    const isLosing = scoreDiff < -2;
    const isWinning = scoreDiff > 2;
    const isLateGame = turnCount > (gameState.gridSize * 2);
    const hasHighMomentum = aiMomentum > 60;

    // Filter affordable techniques
    const affordableTechs = this.techniques.filter(t => t.cost <= aiResource);
    if (affordableTechs.length === 0) return null;

    // Strategic technique selection - MORE AGGRESSIVE
    let selectedTech: Technique | null = null;

    if (isLosing && isLateGame) {
      // Desperate situation - use KILLER techniques
      selectedTech = this.findTechniqueByEffect(affordableTechs, ['steal_shape', 'destroy_shape', 'double_score', 'wipe_row', 'freeze_opponent']);
    } else if (isLosing) {
      // Losing but not late game - aggressive comeback
      selectedTech = this.findTechniqueByEffect(affordableTechs, ['steal_shape', 'double_turn', 'destroy_shape', 'block_line']);
    } else if (isWinning && hasHighMomentum) {
      // Dominating - CRUSH opponent with killer moves
      selectedTech = this.findTechniqueByEffect(affordableTechs, ['steal_shape', 'destroy_shape', 'double_turn', 'protect_shape', 'restrict_zone']);
    } else if (isWinning) {
      // Winning - maintain pressure with strong techniques
      selectedTech = this.findTechniqueByEffect(affordableTechs, ['double_turn', 'protect_shape', 'steal_shape', 'block_line']);
    } else if (scoreDiff >= -1 && scoreDiff <= 1) {
      // Close game - use game-changing techniques
      selectedTech = this.findTechniqueByEffect(affordableTechs, ['steal_shape', 'double_turn', 'destroy_shape', 'reveal_best', 'block_line']);
    } else {
      // Standard play - use powerful techniques
      selectedTech = this.findTechniqueByEffect(affordableTechs, ['double_turn', 'steal_shape', 'long_connect', 'protect_shape']);
    }

    // Practice/Master difficulty: VERY aggressive technique usage
    if (this.difficulty === 'practice' && !selectedTech && aiResource > 60) {
      selectedTech = affordableTechs[Math.floor(Math.random() * affordableTechs.length)];
    }
    if (this.difficulty === 'master' && !selectedTech && aiResource > 50) {
      // Master AI uses techniques aggressively
      selectedTech = affordableTechs[Math.floor(Math.random() * affordableTechs.length)];
    }

    return selectedTech;
  }

  /**
   * Analyze all possible moves and score them
   */
  private analyzeAllMoves(
    gameState: GameState, 
    availableLines: [number, number, number, number][],
    predictedPlayerMove?: [number, number, number, number] | null
  ): MoveScore[] {
    return this.analyzeAllMovesWithDepth(gameState, availableLines, predictedPlayerMove, this.lookaheadDepth);
  }

  /**
   * Analyze all moves with specific depth (for iterative deepening)
   */
  private analyzeAllMovesWithDepth(
    gameState: GameState,
    availableLines: [number, number, number, number][],
    predictedPlayerMove: [number, number, number, number] | null | undefined,
    depth: number
  ): MoveScore[] {
    const moveScores: MoveScore[] = [];

    for (const line of availableLines) {
      const moveScore = this.evaluateMove(line, gameState, predictedPlayerMove);
      moveScores.push(moveScore);
    }

    // MOVE ORDERING: Sort by score for better alpha-beta pruning
    // Prioritize: captures > threats > positional
    moveScores.sort((a, b) => {
      // Completing shapes first
      if (a.completesShape && !b.completesShape) return -1;
      if (!a.completesShape && b.completesShape) return 1;
      // Blocking opponent second
      if (a.blocksOpponent && !b.blocksOpponent) return -1;
      if (!a.blocksOpponent && b.blocksOpponent) return 1;
      // Then by score
      return b.score - a.score;
    });

    return moveScores;
  }

  /**
   * Evaluate a single move and return its score
   */
  private evaluateMove(
    line: [number, number, number, number], 
    gameState: GameState,
    predictedPlayerMove?: [number, number, number, number] | null
  ): MoveScore {
    const [r1, c1, r2, c2] = line;
    let score = 0;
    let reason = '';
    let completesShape = false;
    let blocksOpponent = false;
    let setupsCombo = false;
    let trapsPotential = 0;
    let futureShapes = 0;
    let controlsCenter = false;

    // Simulate placing the line
    const simulatedLines = [...gameState.lines, { r1, c1, r2, c2, player: gameState.aiPlayer }];

    // Check if this completes a shape for AI - CRITICAL PRIORITY
    const aiShapesCompleted = this.countCompletedShapes(simulatedLines, gameState, gameState.aiPlayer);
    if (aiShapesCompleted > 0) {
      score += aiShapesCompleted * 10000; // MAXIMUM priority - never miss this
      completesShape = true;
      reason = `Completes ${aiShapesCompleted} shape(s)`;
    }

    // Check if this blocks opponent from completing a shape - VERY HIGH PRIORITY
    const opponentThreats = this.findOpponentThreats(line, gameState);
    if (opponentThreats > 0) {
      score += opponentThreats * 5000; // Very high priority - always block
      blocksOpponent = true;
      reason = reason ? `${reason}, Blocks opponent` : 'Blocks opponent threat';
    }

    // Check if this sets up future shapes (has 2 or 3 sides already)
    const setupValue = this.evaluateSetupPotential(line, simulatedLines, gameState);
    if (setupValue > 0) {
      score += setupValue * 300; // Increased setup value
      setupsCombo = true;
      reason = reason ? `${reason}, Sets up combo` : 'Sets up future shape';
    }

    // Positional scoring - center is more valuable
    const centerScore = this.evaluateCenterControl(r1, c1, r2, c2, gameState.gridSize);
    score += centerScore * 50;
    if (centerScore > gameState.gridSize * 0.6) {
      controlsCenter = true;
    }

    // CHESS-LEVEL: Lookahead analysis - evaluate future possibilities
    const lookaheadScore = this.analyzeLookahead(simulatedLines, gameState, this.lookaheadDepth);
    score += lookaheadScore.score;
    futureShapes = lookaheadScore.futureShapes;
    if (lookaheadScore.createsMultipleThreats) {
      score += 2000; // Creating multiple threats is powerful
      reason = reason ? `${reason}, Creates multiple threats` : 'Creates multiple threats';
    }

    // CHESS-LEVEL: Trap detection - avoid walking into opponent traps
    const trapRisk = this.detectTrapRisk(line, gameState);
    if (trapRisk > 0 && this.trapAwareness > 0.5) {
      score -= trapRisk * 3000 * this.trapAwareness; // Heavily penalize trap moves
      reason = reason ? `${reason}, Avoids trap` : 'Avoids opponent trap';
    }

    // CHESS-LEVEL: Create traps for opponent
    const trapValue = this.evaluateTrapPotential(simulatedLines, gameState);
    if (trapValue > 0) {
      score += trapValue * 1500;
      trapsPotential = trapValue;
      reason = reason ? `${reason}, Sets trap` : 'Sets trap for opponent';
    }

    // CHESS-LEVEL: Control key positions
    const positionControl = this.evaluatePositionControl(line, simulatedLines, gameState);
    score += positionControl * 400;

    // ADVANCED: Counter predicted player move
    if (predictedPlayerMove && this.difficulty !== 'tutorial') {
      const countersPlayerMove = this.evaluateCounterMove(line, predictedPlayerMove, gameState);
      if (countersPlayerMove > 0) {
        score += countersPlayerMove * 2500;
        reason = reason ? `${reason}, Counters player strategy` : 'Counters player strategy';
      }
    }

    // ADVANCED: Evaluate move flexibility (keeps options open)
    const flexibility = this.evaluateMoveFlexibility(simulatedLines, gameState);
    score += flexibility * 200;

    // PIECE-SQUARE TABLES: Positional bonuses
    const positionalBonus = this.evaluatePieceSquareValue(line, gameState);
    score += positionalBonus;

    // Pattern recognition - avoid predictable moves
    const patternPenalty = this.getPatternPenalty(line);
    score -= patternPenalty * 30;

    // Difficulty adjustments
    if (this.difficulty === 'tutorial') {
      // Make suboptimal moves occasionally, but NEVER miss shape completions
      if (!completesShape && !blocksOpponent && Math.random() > 0.7) {
        score *= 0.6;
      }
    } else if (this.difficulty === 'practice') {
      // Boost strategic moves
      if (setupsCombo) score *= 1.2;
      if (blocksOpponent) score *= 1.3;
    } else if (this.difficulty === 'master') {
      // Maximum strategic boost
      if (setupsCombo) score *= 1.5;
      if (blocksOpponent) score *= 1.4;
      if (completesShape) score *= 1.2;
    }

    return {
      line,
      score,
      reason: reason || 'Standard move',
      completesShape,
      blocksOpponent,
      setupsCombo,
      trapsPotential,
      futureShapes,
      controlsCenter
    };
  }

  /**
   * Select the best move from scored moves
   */
  private selectMove(moveScores: MoveScore[], gameState: GameState): MoveScore | null {
    if (moveScores.length === 0) return null;

    // Tutorial: sometimes pick a random decent move
    if (this.difficulty === 'tutorial' && Math.random() > 0.6) {
      const topMoves = moveScores.slice(0, Math.min(5, moveScores.length));
      return topMoves[Math.floor(Math.random() * topMoves.length)];
    }

    // Practice: mostly optimal with occasional variation
    if (this.difficulty === 'practice' && Math.random() > 0.8) {
      const topMoves = moveScores.slice(0, Math.min(3, moveScores.length));
      return topMoves[Math.floor(Math.random() * topMoves.length)];
    }

    // Master: always optimal, but with strategic patience
    const bestMove = moveScores[0];
    
    // If patient and no immediate shape completion, look for better setup
    if (this.difficulty === 'master' && this.patience > 0.7 && !bestMove.completesShape) {
      const setupMoves = moveScores.filter(m => m.setupsCombo && m.score > bestMove.score * 0.8);
      if (setupMoves.length > 0) {
        return setupMoves[0];
      }
    }

    return bestMove;
  }

  /**
   * Count how many shapes this line would complete
   */
  private countCompletedShapes(simulatedLines: Line[], gameState: GameState, player: number): number {
    let count = 0;

    if (gameState.duelType === 'square') {
      // Check for completed squares
      for (let r = 0; r < gameState.gridSize - 1; r++) {
        for (let c = 0; c < gameState.gridSize - 1; c++) {
          const alreadyExists = gameState.squares.some(s => s.r === r && s.c === c);
          if (alreadyExists) continue;

          if (
            this.hasLine(simulatedLines, r, c, r, c + 1) &&
            this.hasLine(simulatedLines, r + 1, c, r + 1, c + 1) &&
            this.hasLine(simulatedLines, r, c, r + 1, c) &&
            this.hasLine(simulatedLines, r, c + 1, r + 1, c + 1)
          ) {
            count++;
          }
        }
      }
    } else {
      // Check for completed triangles
      for (let r = 0; r < gameState.gridSize - 1; r++) {
        for (let c = 0; c < gameState.gridSize - 1; c++) {
          // Upward triangle
          if (
            this.hasLine(simulatedLines, r, c, r, c + 1) &&
            this.hasLine(simulatedLines, r, c + 1, r + 1, c) &&
            this.hasLine(simulatedLines, r + 1, c, r, c)
          ) {
            count++;
          }
          // Downward triangle
          if (
            this.hasLine(simulatedLines, r, c + 1, r + 1, c + 1) &&
            this.hasLine(simulatedLines, r + 1, c + 1, r + 1, c) &&
            this.hasLine(simulatedLines, r + 1, c, r, c + 1)
          ) {
            count++;
          }
        }
      }
    }

    return count;
  }

  /**
   * Find how many opponent shapes this line would block
   */
  private findOpponentThreats(line: [number, number, number, number], gameState: GameState): number {
    let threats = 0;
    const [r1, c1, r2, c2] = line;

    // Check all potential squares/triangles that include this line
    if (gameState.duelType === 'square') {
      // Check squares that would use this line
      const potentialSquares = this.getPotentialSquares(r1, c1, r2, c2, gameState.gridSize);
      
      for (const sq of potentialSquares) {
        const sidesComplete = this.countCompleteSides(sq, gameState.lines);
        if (sidesComplete === 3) {
          // Opponent is one move away from completing this square
          threats++;
        }
      }
    }

    return threats;
  }

  /**
   * Evaluate how well this move sets up future shapes
   */
  private evaluateSetupPotential(
    line: [number, number, number, number],
    simulatedLines: Line[],
    gameState: GameState
  ): number {
    let setupValue = 0;
    const [r1, c1, r2, c2] = line;

    if (gameState.duelType === 'square') {
      const potentialSquares = this.getPotentialSquares(r1, c1, r2, c2, gameState.gridSize);
      
      for (const sq of potentialSquares) {
        const sidesComplete = this.countCompleteSides(sq, simulatedLines);
        if (sidesComplete === 2) setupValue += 3; // Two sides = good setup
        if (sidesComplete === 3) setupValue += 5; // Three sides = excellent setup
      }
    }

    return setupValue;
  }

  /**
   * Evaluate center control value
   */
  private evaluateCenterControl(r1: number, c1: number, r2: number, c2: number, gridSize: number): number {
    const center = (gridSize - 1) / 2;
    const dist1 = Math.abs(r1 - center) + Math.abs(c1 - center);
    const dist2 = Math.abs(r2 - center) + Math.abs(c2 - center);
    const avgDist = (dist1 + dist2) / 2;
    
    // Closer to center = higher value
    return Math.max(0, gridSize - avgDist);
  }

  /**
   * Get pattern penalty to avoid predictability
   */
  private getPatternPenalty(line: [number, number, number, number]): number {
    const pattern = `${line[0]},${line[1]},${line[2]},${line[3]}`;
    return this.opponentPatterns.get(pattern) || 0;
  }

  /**
   * Update pattern recognition
   */
  private updatePatternRecognition(line: [number, number, number, number]): void {
    const pattern = `${line[0]},${line[1]},${line[2]},${line[3]}`;
    const current = this.opponentPatterns.get(pattern) || 0;
    this.opponentPatterns.set(pattern, current + 1);
  }

  /**
   * Get all available lines
   */
  private getAvailableLines(gameState: GameState): [number, number, number, number][] {
    const available: [number, number, number, number][] = [];
    const { gridSize, lines, duelType } = gameState;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Horizontal lines
        if (c < gridSize - 1 && !this.lineExists(lines, r, c, r, c + 1)) {
          available.push([r, c, r, c + 1]);
        }
        // Vertical lines
        if (r < gridSize - 1 && !this.lineExists(lines, r, c, r + 1, c)) {
          available.push([r, c, r + 1, c]);
        }
        // Diagonal lines for triangles
        if (duelType === 'triangle') {
          if (r < gridSize - 1 && c < gridSize - 1 && !this.lineExists(lines, r, c, r + 1, c + 1)) {
            available.push([r, c, r + 1, c + 1]);
          }
          if (r < gridSize - 1 && c > 0 && !this.lineExists(lines, r, c, r + 1, c - 1)) {
            available.push([r, c, r + 1, c - 1]);
          }
        }
      }
    }

    return available;
  }

  /**
   * Helper: Check if line exists
   */
  private lineExists(lines: Line[], r1: number, c1: number, r2: number, c2: number): boolean {
    return lines.some(l =>
      (l.r1 === r1 && l.c1 === c1 && l.r2 === r2 && l.c2 === c2) ||
      (l.r1 === r2 && l.c1 === c2 && l.r2 === r1 && l.c2 === c1)
    );
  }

  /**
   * Helper: Check if line exists in array
   */
  private hasLine(lines: Line[], r1: number, c1: number, r2: number, c2: number): boolean {
    return this.lineExists(lines, r1, c1, r2, c2);
  }

  /**
   * Get potential squares that include this line
   */
  private getPotentialSquares(r1: number, c1: number, r2: number, c2: number, gridSize: number): Array<{r: number, c: number}> {
    const squares: Array<{r: number, c: number}> = [];
    
    // Horizontal line
    if (r1 === r2) {
      const r = r1;
      const c = Math.min(c1, c2);
      if (r > 0) squares.push({ r: r - 1, c });
      if (r < gridSize - 1) squares.push({ r, c });
    }
    // Vertical line
    else if (c1 === c2) {
      const c = c1;
      const r = Math.min(r1, r2);
      if (c > 0) squares.push({ r, c: c - 1 });
      if (c < gridSize - 1) squares.push({ r, c });
    }

    return squares;
  }

  /**
   * Count complete sides of a square
   */
  private countCompleteSides(sq: {r: number, c: number}, lines: Line[]): number {
    let count = 0;
    const { r, c } = sq;

    if (this.hasLine(lines, r, c, r, c + 1)) count++;
    if (this.hasLine(lines, r + 1, c, r + 1, c + 1)) count++;
    if (this.hasLine(lines, r, c, r + 1, c)) count++;
    if (this.hasLine(lines, r, c + 1, r + 1, c + 1)) count++;

    return count;
  }

  /**
   * Find technique by effect type
   */
  private findTechniqueByEffect(techniques: Technique[], effects: string[]): Technique | null {
    for (const effect of effects) {
      const tech = techniques.find(t => t.effect === effect);
      if (tech) return tech;
    }
    return null;
  }

  /**
   * Delay helper for realistic AI timing
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset AI state for new game
   */
  public reset(): void {
    this.moveHistory = [];
    this.opponentPatterns.clear();
  }

  /**
   * CHESS-LEVEL: Analyze future moves (lookahead)
   */
  private analyzeLookahead(
    currentLines: Line[],
    gameState: GameState,
    depth: number
  ): { score: number; futureShapes: number; createsMultipleThreats: boolean } {
    if (depth === 0) return { score: 0, futureShapes: 0, createsMultipleThreats: false };

    let futureShapes = 0;
    let threatCount = 0;

    // Analyze potential shapes we can complete in next few moves
    if (gameState.duelType === 'square') {
      for (let r = 0; r < gameState.gridSize - 1; r++) {
        for (let c = 0; c < gameState.gridSize - 1; c++) {
          const sides = this.countCompleteSides({ r, c }, currentLines);
          if (sides === 2) {
            futureShapes++; // We're 2 moves away from completing this
          }
          if (sides === 3) {
            futureShapes += 2; // We're 1 move away - very valuable
            threatCount++;
          }
        }
      }
    }

    const createsMultipleThreats = threatCount >= 2;
    const score = futureShapes * 150;

    return { score, futureShapes, createsMultipleThreats };
  }

  /**
   * CHESS-LEVEL: Detect if a move walks into opponent's trap
   */
  private detectTrapRisk(
    line: [number, number, number, number],
    gameState: GameState
  ): number {
    let trapRisk = 0;
    const [r1, c1, r2, c2] = line;

    // Simulate opponent's response after our move
    const simulatedLines = [...gameState.lines, { r1, c1, r2, c2, player: gameState.aiPlayer }];

    // Check if opponent can complete multiple shapes after this move
    if (gameState.duelType === 'square') {
      for (let r = 0; r < gameState.gridSize - 1; r++) {
        for (let c = 0; c < gameState.gridSize - 1; c++) {
          const sides = this.countCompleteSides({ r, c }, simulatedLines);
          // If opponent has 3 sides, they can complete on next turn
          if (sides === 3) {
            // Check if this square would benefit opponent more than us
            const nearOpponentShapes = this.countNearbyShapes(r, c, gameState.squares, gameState.humanPlayer);
            if (nearOpponentShapes > 0) {
              trapRisk++;
            }
          }
        }
      }
    }

    return trapRisk;
  }

  /**
   * CHESS-LEVEL: Evaluate potential to create traps
   */
  private evaluateTrapPotential(
    simulatedLines: Line[],
    gameState: GameState
  ): number {
    let trapValue = 0;

    // A trap is when we create multiple threats that opponent can't block all of them
    const threats: Array<{ r: number; c: number }> = [];

    if (gameState.duelType === 'square') {
      for (let r = 0; r < gameState.gridSize - 1; r++) {
        for (let c = 0; c < gameState.gridSize - 1; c++) {
          const sides = this.countCompleteSides({ r, c }, simulatedLines);
          if (sides === 3) {
            threats.push({ r, c });
          }
        }
      }
    }

    // If we create 2+ threats, opponent can only block one
    if (threats.length >= 2) {
      trapValue = threats.length;
    }

    return trapValue;
  }

  /**
   * CHESS-LEVEL: Evaluate control of key board positions
   */
  private evaluatePositionControl(
    line: [number, number, number, number],
    simulatedLines: Line[],
    gameState: GameState
  ): number {
    let controlScore = 0;
    const [r1, c1, r2, c2] = line;

    // Control center positions
    const center = (gameState.gridSize - 1) / 2;
    const isCenterLine = 
      (Math.abs(r1 - center) <= 1 && Math.abs(c1 - center) <= 1) ||
      (Math.abs(r2 - center) <= 1 && Math.abs(c2 - center) <= 1);
    
    if (isCenterLine) {
      controlScore += 3;
    }

    // Control corners (strategic positions)
    const isCorner = 
      (r1 === 0 || r1 === gameState.gridSize - 1) && (c1 === 0 || c1 === gameState.gridSize - 1) ||
      (r2 === 0 || r2 === gameState.gridSize - 1) && (c2 === 0 || c2 === gameState.gridSize - 1);
    
    if (isCorner) {
      controlScore += 2;
    }

    // Control edges (defensive positions)
    const isEdge = 
      r1 === 0 || r1 === gameState.gridSize - 1 || c1 === 0 || c1 === gameState.gridSize - 1 ||
      r2 === 0 || r2 === gameState.gridSize - 1 || c2 === 0 || c2 === gameState.gridSize - 1;
    
    if (isEdge) {
      controlScore += 1;
    }

    return controlScore;
  }

  /**
   * Helper: Count nearby shapes belonging to a player
   */
  private countNearbyShapes(
    r: number,
    c: number,
    squares: Square[],
    player: number
  ): number {
    let count = 0;
    for (const sq of squares) {
      if (sq.player === player) {
        const distance = Math.abs(sq.r - r) + Math.abs(sq.c - c);
        if (distance <= 2) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * ADVANCED: Initialize opening book with strong starting moves
   */
  private initializeOpeningBook(): void {
    // Center control openings
    this.openingBook.set('opening_center', [
      [2, 2, 2, 3], // Center horizontal
      [2, 2, 3, 2], // Center vertical
      [1, 2, 2, 2], // Near center
      [2, 1, 2, 2], // Near center
    ]);

    // Corner control openings
    this.openingBook.set('opening_corner', [
      [0, 0, 0, 1], // Top-left corner
      [0, 0, 1, 0], // Top-left corner
    ]);
  }

  /**
   * ADVANCED: Get move from opening book
   */
  private getOpeningBookMove(gameState: GameState): [number, number, number, number] | null {
    if (gameState.turnCount > 3) return null; // Only use in first 3 turns

    const centerMoves = this.openingBook.get('opening_center') || [];
    const availableLines = this.getAvailableLines(gameState);

    // Find first book move that's available
    for (const bookMove of centerMoves) {
      const isAvailable = availableLines.some(line => 
        line[0] === bookMove[0] && line[1] === bookMove[1] && 
        line[2] === bookMove[2] && line[3] === bookMove[3]
      );
      if (isAvailable) {
        return bookMove;
      }
    }

    return null;
  }

  /**
   * ADVANCED: Update current game phase
   */
  private updateGamePhase(gameState: GameState): void {
    const totalMoves = gameState.lines.length;
    const maxMoves = gameState.gridSize * gameState.gridSize * 2;

    if (totalMoves < maxMoves * 0.25) {
      this.gamePhase = 'opening';
    } else if (totalMoves < maxMoves * 0.7) {
      this.gamePhase = 'midgame';
    } else {
      this.gamePhase = 'endgame';
    }
  }

  /**
   * ADVANCED: Predict player's next move based on patterns
   */
  private predictPlayerMove(gameState: GameState): [number, number, number, number] | null {
    if (this.moveHistory.length < 3) return null;

    // Analyze recent player moves (last 5 moves)
    const recentMoves = this.moveHistory.slice(-10).filter((_, i) => i % 2 === 1); // Player moves
    if (recentMoves.length === 0) return null;

    // Find most common pattern
    let maxCount = 0;
    let predictedMove: [number, number, number, number] | null = null;

    for (const [pattern, count] of this.playerMovePatterns.entries()) {
      if (count > maxCount) {
        maxCount = count;
        const coords = pattern.split(',').map(Number);
        if (coords.length === 4) {
          predictedMove = coords as [number, number, number, number];
        }
      }
    }

    return predictedMove;
  }

  /**
   * ADVANCED: Evaluate if move counters predicted player move
   */
  private evaluateCounterMove(
    ourMove: [number, number, number, number],
    playerMove: [number, number, number, number],
    gameState: GameState
  ): number {
    let counterValue = 0;

    // Check if our move blocks what player is trying to build
    const [pr1, pc1, pr2, pc2] = playerMove;
    const [r1, c1, r2, c2] = ourMove;

    // If moves share a point, we're blocking them
    if ((r1 === pr1 && c1 === pc1) || (r1 === pr2 && c1 === pc2) ||
        (r2 === pr1 && c2 === pc1) || (r2 === pr2 && c2 === pc2)) {
      counterValue += 2;
    }

    // If our move completes a shape near their predicted move, that's valuable
    const distance = Math.abs(r1 - pr1) + Math.abs(c1 - pc1);
    if (distance <= 2) {
      counterValue += 1;
    }

    return counterValue;
  }

  /**
   * ADVANCED: Evaluate move flexibility (keeps options open)
   */
  private evaluateMoveFlexibility(
    simulatedLines: Line[],
    gameState: GameState
  ): number {
    let flexibility = 0;

    // Count how many potential shapes this move contributes to
    if (gameState.duelType === 'square') {
      for (let r = 0; r < gameState.gridSize - 1; r++) {
        for (let c = 0; c < gameState.gridSize - 1; c++) {
          const sides = this.countCompleteSides({ r, c }, simulatedLines);
          if (sides === 1 || sides === 2) {
            flexibility++; // This move contributes to a potential shape
          }
        }
      }
    }

    return flexibility;
  }

  /**
   * ADVANCED: Apply alpha-beta minimax evaluation
   */
  private applyAlphaBetaMinimax(moveScores: MoveScore[], gameState: GameState, depth: number): void {
    // For each top move, use alpha-beta pruning
    const topMoves = moveScores.slice(0, 8);
    let alpha = -Infinity;
    let beta = Infinity;

    for (const moveScore of topMoves) {
      const score = this.alphaBeta(
        gameState,
        depth - 1,
        alpha,
        beta,
        false, // Opponent's turn
        moveScore.line
      );
      
      moveScore.score += score * 0.4; // Weight the minimax result
      alpha = Math.max(alpha, score);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }
  }

  /**
   * Alpha-Beta pruning algorithm
   */
  private alphaBeta(
    gameState: GameState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    lastMove?: [number, number, number, number]
  ): number {
    // Terminal condition
    if (depth === 0) {
      return this.evaluatePosition(gameState);
    }

    // Check transposition table
    const posHash = this.getPositionHash(gameState);
    const cached = this.transpositionTable.get(posHash);
    if (cached && cached.depth >= depth) {
      return cached.score;
    }

    const availableLines = this.getAvailableLines(gameState);
    if (availableLines.length === 0) {
      return this.evaluatePosition(gameState);
    }

    // QUIESCENCE SEARCH: Continue searching in tactical positions
    if (depth === 0 && this.isTacticalPosition(gameState)) {
      depth = 1; // Extend search in volatile positions
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const line of availableLines.slice(0, 15)) {
        const simulated = this.simulateMove(line, gameState, gameState.aiPlayer);
        const evaluation = this.alphaBeta(simulated, depth - 1, alpha, beta, false, line);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Beta cutoff
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const line of availableLines.slice(0, 15)) {
        const simulated = this.simulateMove(line, gameState, gameState.humanPlayer);
        const evaluation = this.alphaBeta(simulated, depth - 1, alpha, beta, true, line);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha cutoff
      }
      return minEval;
    }
  }

  /**
   * QUIESCENCE SEARCH: Detect tactical positions
   */
  private isTacticalPosition(gameState: GameState): boolean {
    // Position is tactical if there are immediate threats
    const threats = this.countImmediateThreats(gameState);
    return threats > 0;
  }

  /**
   * Count immediate shape completion threats
   */
  private countImmediateThreats(gameState: GameState): number {
    let threats = 0;
    if (gameState.duelType === 'square') {
      for (let r = 0; r < gameState.gridSize - 1; r++) {
        for (let c = 0; c < gameState.gridSize - 1; c++) {
          const sides = this.countCompleteSides({ r, c }, gameState.lines);
          if (sides === 3) threats++;
        }
      }
    }
    return threats;
  }

  /**
   * ADVANCED: Apply endgame tactics
   */
  private applyEndgameTactics(moveScores: MoveScore[], gameState: GameState): void {
    const scoreDiff = gameState.aiScore - gameState.humanScore;

    for (const moveScore of moveScores) {
      // If winning, prioritize safe moves that maintain lead
      if (scoreDiff > 3) {
        if (moveScore.blocksOpponent) {
          moveScore.score *= 1.5; // Heavily prioritize blocking
        }
        if (moveScore.completesShape) {
          moveScore.score *= 1.3; // Secure the win
        }
      }
      // If losing, prioritize aggressive moves
      else if (scoreDiff < -2) {
        if (moveScore.trapsPotential > 0) {
          moveScore.score *= 1.8; // Create desperate traps
        }
        if (moveScore.completesShape) {
          moveScore.score *= 1.6; // Need points desperately
        }
      }
    }
  }

  /**
   * ADVANCED: Simulate a move and return new game state
   */
  private simulateMove(
    line: [number, number, number, number],
    gameState: GameState,
    player: number
  ): GameState {
    const [r1, c1, r2, c2] = line;
    return {
      ...gameState,
      lines: [...gameState.lines, { r1, c1, r2, c2, player }],
      turnCount: gameState.turnCount + 1
    };
  }

  /**
   * ADVANCED: Evaluate overall board position
   */
  private evaluatePosition(gameState: GameState): number {
    let evaluation = 0;

    // Material advantage (shapes owned)
    evaluation += (gameState.aiScore - gameState.humanScore) * 1000;

    // Resource advantage
    evaluation += (gameState.aiResource - gameState.humanResource) * 10;

    // Momentum advantage
    evaluation += (gameState.aiMomentum - gameState.humanMomentum) * 5;

    // Count potential shapes
    let aiPotential = 0;
    let humanPotential = 0;

    if (gameState.duelType === 'square') {
      for (let r = 0; r < gameState.gridSize - 1; r++) {
        for (let c = 0; c < gameState.gridSize - 1; c++) {
          const sides = this.countCompleteSides({ r, c }, gameState.lines);
          if (sides === 2) aiPotential++;
          if (sides === 3) aiPotential += 3; // Very close to completion
        }
      }
    }

    evaluation += (aiPotential - humanPotential) * 100;

    return evaluation;
  }

  /**
   * ADVANCED: Learn from successful moves
   */
  private learnFromMove(moveScore: MoveScore, gameState: GameState): void {
    // If move was very successful, remember it
    if (moveScore.completesShape || moveScore.trapsPotential > 0) {
      const pattern = `${moveScore.line[0]},${moveScore.line[1]},${moveScore.line[2]},${moveScore.line[3]}`;
      const current = this.playerMovePatterns.get(pattern) || 0;
      this.playerMovePatterns.set(pattern, current + 1);
    }
  }

  /**
   * ADVANCED: Get position key for caching
   */
  private getPositionKey(line: [number, number, number, number], gameState: GameState): string {
    return `${line.join(',')}_${gameState.lines.length}_${gameState.turnCount}`;
  }

  /**
   * Get position hash for transposition table
   */
  private getPositionHash(gameState: GameState): string {
    // Create unique hash based on board state
    const lineHash = gameState.lines
      .map(l => `${l.r1}${l.c1}${l.r2}${l.c2}${l.player}`)
      .sort()
      .join('|');
    return `${lineHash}_${gameState.turnCount}_${gameState.currentPlayer}`;
  }

  /**
   * Initialize piece-square tables for positional evaluation
   */
  private initializePieceSquareTables(): void {
    // Center control table (higher values in center)
    const centerTable = [
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 2, 3, 2, 1],
      [1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1]
    ];
    this.pieceSquareTables.set('center', centerTable);

    // Edge control table (higher values on edges for defense)
    const edgeTable = [
      [3, 2, 2, 2, 3],
      [2, 1, 1, 1, 2],
      [2, 1, 1, 1, 2],
      [2, 1, 1, 1, 2],
      [3, 2, 2, 2, 3]
    ];
    this.pieceSquareTables.set('edge', edgeTable);
  }

  /**
   * Evaluate piece-square table value
   */
  private evaluatePieceSquareValue(
    line: [number, number, number, number],
    gameState: GameState
  ): number {
    const [r1, c1, r2, c2] = line;
    let bonus = 0;

    const table = this.gamePhase === 'opening' ? 
      this.pieceSquareTables.get('center') : 
      this.pieceSquareTables.get('edge');

    if (table && table[r1] && table[r1][c1]) {
      bonus += table[r1][c1] * 50;
    }
    if (table && table[r2] && table[r2][c2]) {
      bonus += table[r2][c2] * 50;
    }

    return bonus;
  }

  /**
   * Get AI personality description
   */
  public getPersonality(): string {
    switch (this.difficulty) {
      case 'tutorial':
        return 'Patient Teacher - Forgiveness window, makes mistakes to help you learn';
      case 'practice':
        return 'Strategic Opponent - Alpha-beta pruning, pattern learning, hysteresis';
      case 'master':
        return 'Chess Engine - Iterative deepening, transposition tables, quiescence search, piece-square tables, no mercy';
      default:
        return 'Unknown';
    }
  }
}

// Export singleton factory
export const createDotWarsAI = (faction: AnimeFaction, difficulty: AIDifficulty = 'practice'): DotWarsAI => {
  return new DotWarsAI(faction, difficulty);
};
