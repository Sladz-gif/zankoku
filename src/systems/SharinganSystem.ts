/**
 * SHARINGAN & SPECIAL DOJUTSU SYSTEM
 * Provides prediction, copy, and analysis abilities for Naruto faction
 */

import { Line, Technique } from '@/types/game';

export interface SharinganPrediction {
  possibleMoves: Line[];
  bestMove: Line | null;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class SharinganSystem {
  private activationCost = 15;
  private predictionAccuracy = 0.85;
  
  /**
   * Activate Sharingan - costs resources but provides prediction
   */
  public activate(playerResource: number): boolean {
    return playerResource >= this.activationCost;
  }

  /**
   * Predict opponent's next likely moves based on game state
   */
  public predictOpponentMoves(
    lines: Line[],
    gridSize: number,
    opponentPlayer: number
  ): SharinganPrediction {
    const possibleMoves: Line[] = [];
    
    // Analyze all possible moves
    for (let r1 = 0; r1 < gridSize; r1++) {
      for (let c1 = 0; c1 < gridSize; c1++) {
        // Check horizontal
        if (c1 < gridSize - 1) {
          const line = { r1, c1, r2: r1, c2: c1 + 1, player: opponentPlayer };
          if (!this.lineExists(line, lines)) {
            possibleMoves.push(line);
          }
        }
        // Check vertical
        if (r1 < gridSize - 1) {
          const line = { r1, c1, r2: r1 + 1, c2: c1, player: opponentPlayer };
          if (!this.lineExists(line, lines)) {
            possibleMoves.push(line);
          }
        }
      }
    }

    // Score moves based on shape completion potential
    const scoredMoves = possibleMoves.map(move => ({
      move,
      score: this.scoreMove(move, lines, gridSize)
    }));

    scoredMoves.sort((a, b) => b.score - a.score);
    
    const bestMove = scoredMoves.length > 0 ? scoredMoves[0].move : null;
    const threatLevel = this.assessThreatLevel(scoredMoves);

    // Return top 3 most likely moves
    return {
      possibleMoves: scoredMoves.slice(0, 3).map(sm => sm.move),
      bestMove,
      threatLevel
    };
  }

  /**
   * Copy opponent's last technique (Sharingan copy ability)
   */
  public copyTechnique(
    lastTechnique: Technique | null,
    playerResource: number
  ): { canCopy: boolean; cost: number } {
    if (!lastTechnique) {
      return { canCopy: false, cost: 0 };
    }

    // Copying costs 75% of original technique cost
    const copyCost = Math.floor(lastTechnique.cost * 0.75);
    const canCopy = playerResource >= copyCost;

    return { canCopy, cost: copyCost };
  }

  /**
   * Analyze opponent's pattern and predict their strategy
   */
  public analyzePattern(
    recentMoves: Line[],
    techniques: Technique[]
  ): {
    pattern: 'aggressive' | 'defensive' | 'balanced' | 'unpredictable';
    confidence: number;
  } {
    if (recentMoves.length < 3) {
      return { pattern: 'unpredictable', confidence: 0.3 };
    }

    // Analyze move patterns
    const centerMoves = recentMoves.filter(m => 
      Math.abs(m.r1 - 2) <= 1 && Math.abs(m.c1 - 2) <= 1
    ).length;
    
    const edgeMoves = recentMoves.filter(m =>
      m.r1 === 0 || m.r1 === 3 || m.c1 === 0 || m.c1 === 3
    ).length;

    const centerRatio = centerMoves / recentMoves.length;
    const edgeRatio = edgeMoves / recentMoves.length;

    if (centerRatio > 0.6) {
      return { pattern: 'aggressive', confidence: 0.8 };
    } else if (edgeRatio > 0.6) {
      return { pattern: 'defensive', confidence: 0.75 };
    } else if (Math.abs(centerRatio - edgeRatio) < 0.2) {
      return { pattern: 'balanced', confidence: 0.7 };
    }

    return { pattern: 'unpredictable', confidence: 0.5 };
  }

  /**
   * Visual indicator for Sharingan activation
   */
  public getSharinganVisual(): {
    color: string;
    glow: string;
    icon: string;
  } {
    return {
      color: '#FF0000',
      glow: '#FF6B6B',
      icon: '👁️'
    };
  }

  private lineExists(line: Line, lines: Line[]): boolean {
    return lines.some(l =>
      (l.r1 === line.r1 && l.c1 === line.c1 && l.r2 === line.r2 && l.c2 === line.c2) ||
      (l.r1 === line.r2 && l.c1 === line.c2 && l.r2 === line.r1 && l.c2 === line.c1)
    );
  }

  private scoreMove(move: Line, lines: Line[], gridSize: number): number {
    let score = 0;
    
    // Check if move completes a square
    const { r1, c1, r2, c2 } = move;
    
    // Horizontal line
    if (r1 === r2) {
      const r = r1;
      const c = Math.min(c1, c2);
      
      // Check square above
      if (r > 0) {
        const top = lines.filter(l => l.r1 === r - 1 && l.r2 === r - 1 && Math.min(l.c1, l.c2) === c).length;
        const left = lines.filter(l => l.c1 === c && l.c2 === c && Math.min(l.r1, l.r2) === r - 1).length;
        const right = lines.filter(l => l.c1 === c + 1 && l.c2 === c + 1 && Math.min(l.r1, l.r2) === r - 1).length;
        if (top + left + right === 3) score += 100;
        else if (top + left + right === 2) score += 50;
      }
      
      // Check square below
      if (r < gridSize - 1) {
        const bottom = lines.filter(l => l.r1 === r + 1 && l.r2 === r + 1 && Math.min(l.c1, l.c2) === c).length;
        const left = lines.filter(l => l.c1 === c && l.c2 === c && Math.min(l.r1, l.r2) === r).length;
        const right = lines.filter(l => l.c1 === c + 1 && l.c2 === c + 1 && Math.min(l.r1, l.r2) === r).length;
        if (bottom + left + right === 3) score += 100;
        else if (bottom + left + right === 2) score += 50;
      }
    }
    
    // Vertical line
    if (c1 === c2) {
      const c = c1;
      const r = Math.min(r1, r2);
      
      // Check square to left
      if (c > 0) {
        const left = lines.filter(l => l.c1 === c - 1 && l.c2 === c - 1 && Math.min(l.r1, l.r2) === r).length;
        const top = lines.filter(l => l.r1 === r && l.r2 === r && Math.min(l.c1, l.c2) === c - 1).length;
        const bottom = lines.filter(l => l.r1 === r + 1 && l.r2 === r + 1 && Math.min(l.c1, l.c2) === c - 1).length;
        if (left + top + bottom === 3) score += 100;
        else if (left + top + bottom === 2) score += 50;
      }
      
      // Check square to right
      if (c < gridSize - 1) {
        const right = lines.filter(l => l.c1 === c + 1 && l.c2 === c + 1 && Math.min(l.r1, l.r2) === r).length;
        const top = lines.filter(l => l.r1 === r && l.r2 === r && Math.min(l.c1, l.c2) === c).length;
        const bottom = lines.filter(l => l.r1 === r + 1 && l.r2 === r + 1 && Math.min(l.c1, l.c2) === c).length;
        if (right + top + bottom === 3) score += 100;
        else if (right + top + bottom === 2) score += 50;
      }
    }
    
    // Center control bonus
    if (Math.abs(r1 - gridSize / 2) < 1 && Math.abs(c1 - gridSize / 2) < 1) {
      score += 10;
    }
    
    return score;
  }

  private assessThreatLevel(scoredMoves: { move: Line; score: number }[]): 'low' | 'medium' | 'high' | 'critical' {
    if (scoredMoves.length === 0) return 'low';
    
    const topScore = scoredMoves[0].score;
    
    if (topScore >= 100) return 'critical';
    if (topScore >= 50) return 'high';
    if (topScore >= 20) return 'medium';
    return 'low';
  }
}

// Export singleton
export const createSharinganSystem = (): SharinganSystem => {
  return new SharinganSystem();
};
