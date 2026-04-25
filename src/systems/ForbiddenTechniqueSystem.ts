/**
 * FORBIDDEN TECHNIQUE UNLOCK SYSTEM
 * Manages conditions and triggers for unlocking forbidden techniques
 */

export interface ForbiddenUnlockConditions {
  minTurnCount: number;
  resourceThreshold: number;
  scoreDeficit: number;
  momentumLevel: string;
  battleState: string;
}

export class ForbiddenTechniqueSystem {
  /**
   * Check if forbidden techniques should be unlocked for a player
   */
  public checkUnlockConditions(
    turnCount: number,
    playerResource: number,
    playerScore: number,
    opponentScore: number,
    momentumLevel: number,
    battleState: string
  ): boolean {
    // Condition 1: Late game (turn 15+)
    const isLateGame = turnCount >= 15;
    
    // Condition 2: Desperate situation (losing by 3+ points)
    const isDesperate = opponentScore - playerScore >= 3;
    
    // Condition 3: High momentum (60+)
    const hasHighMomentum = momentumLevel >= 60;
    
    // Condition 4: Already in awakening or last stand
    const isInCriticalState = battleState === 'awakening' || battleState === 'last_stand';
    
    // Condition 5: High resources (80+) - can afford the cost
    const hasResources = playerResource >= 80;
    
    // Unlock if any of these combinations are true:
    // - Late game AND desperate
    // - Critical state AND high resources
    // - High momentum AND late game
    return (isLateGame && isDesperate) || 
           (isInCriticalState && hasResources) ||
           (hasHighMomentum && isLateGame);
  }

  /**
   * Get visual indicator for forbidden technique availability
   */
  public getUnlockVisual(isUnlocked: boolean): {
    color: string;
    glow: string;
    icon: string;
    message: string;
  } {
    if (isUnlocked) {
      return {
        color: '#FF003C',
        glow: '#FF6B6B',
        icon: '💀',
        message: 'FORBIDDEN TECHNIQUES UNLOCKED'
      };
    }
    
    return {
      color: '#666666',
      glow: '#888888',
      icon: '🔒',
      message: 'Locked - Reach critical conditions'
    };
  }

  /**
   * Calculate penalty for using forbidden technique
   */
  public calculatePenalty(
    effect: string,
    playerResource: number,
    playerShapes: number
  ): {
    resourceLoss: number;
    shapeLoss: number;
    turnSkip: number;
    techniqueLock: boolean;
  } {
    const penalties = {
      resourceLoss: 0,
      shapeLoss: 0,
      turnSkip: 0,
      techniqueLock: false
    };

    switch (effect) {
      case 'awakening_sacrifice':
        penalties.resourceLoss = playerResource; // Lose ALL resources after 3 turns
        break;
      
      case 'mass_sacrifice':
        penalties.shapeLoss = Math.floor(playerShapes * 0.3); // Lose 30% of shapes
        break;
      
      case 'instant_power_sacrifice':
        penalties.turnSkip = 2; // Skip next 2 turns
        break;
      
      case 'corruption_sacrifice':
        penalties.techniqueLock = true; // Can't use techniques anymore
        break;
      
      case 'board_control_sacrifice':
        penalties.resourceLoss = Math.floor(playerResource * 0.8); // Lose 80% resources
        break;
      
      case 'total_destruction_sacrifice':
        penalties.turnSkip = 3; // Skip next 3 turns
        break;
      
      case 'board_wipe_sacrifice':
        penalties.shapeLoss = playerShapes; // Lose ALL shapes
        break;
      
      case 'technique_theft_sacrifice':
        penalties.shapeLoss = Math.floor(playerShapes * 0.5); // Lose 50% shapes
        break;
      
      case 'permanent_negation_sacrifice':
        penalties.resourceLoss = Math.floor(playerResource * 0.5); // Lose 50% max resources permanently
        break;
      
      case 'perfect_dodge_sacrifice':
        penalties.resourceLoss = playerResource; // Lose all resources
        break;
      
      case 'infinite_power_sacrifice':
        penalties.shapeLoss = playerShapes; // Lose all shapes
        break;
      
      case 'desperation_gamble':
        // Win or lose condition - no traditional penalty
        break;
      
      case 'total_corruption_sacrifice':
        penalties.turnSkip = 1; // Permanently lose 1 turn per round
        break;
      
      case 'wish_sacrifice': {
        // Random penalty - could be any of the above
        const random = Math.random();
        if (random < 0.33) {
          penalties.resourceLoss = Math.floor(playerResource * 0.7);
        } else if (random < 0.66) {
          penalties.shapeLoss = Math.floor(playerShapes * 0.4);
        } else {
          penalties.techniqueLock = true;
        }
        break;
      }
      
      case 'power_evolution_sacrifice':
        penalties.techniqueLock = true; // Lose techniques forever
        break;
      
      case 'blind_rage_sacrifice':
        penalties.turnSkip = 3; // Lose control for 3 turns
        break;
      
      case 'draw_sacrifice':
        // Game ends in draw - ultimate sacrifice
        break;
    }

    return penalties;
  }

  /**
   * Apply forbidden technique effect with dramatic visuals
   */
  public applyForbiddenEffect(
    effect: string,
    playerShapes: number,
    opponentShapes: number
  ): {
    playerShapeChange: number;
    opponentShapeChange: number;
    specialEffect: string;
  } {
    let playerShapeChange = 0;
    let opponentShapeChange = 0;
    let specialEffect = 'forbidden_activation';

    switch (effect) {
      case 'mass_sacrifice':
        opponentShapeChange = -Math.floor(opponentShapes * 0.5);
        playerShapeChange = -Math.floor(playerShapes * 0.3);
        specialEffect = 'mass_steal';
        break;
      
      case 'instant_power_sacrifice':
        playerShapeChange = 3; // Instantly complete 3 shapes
        specialEffect = 'instant_power';
        break;
      
      case 'corruption_sacrifice':
        specialEffect = 'total_corruption';
        break;
      
      case 'total_destruction_sacrifice':
        opponentShapeChange = -opponentShapes; // Destroy ALL enemy shapes
        specialEffect = 'apocalypse';
        break;
      
      case 'board_wipe_sacrifice':
        // Wipe 75% of board
        specialEffect = 'board_wipe';
        break;
    }

    return {
      playerShapeChange,
      opponentShapeChange,
      specialEffect
    };
  }
}

// Export singleton
export const createForbiddenTechniqueSystem = (): ForbiddenTechniqueSystem => {
  return new ForbiddenTechniqueSystem();
};
