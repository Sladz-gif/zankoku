// Enhanced Battle Systems for Zankoku Upgrade
import { AnimeFaction, BattleState, MomentumLevel, Callout, BattleEffects } from '../types/game';

// Battle State Management
export class BattleSystem {
  player1State: BattleState = 'normal';
  player2State: BattleState = 'normal';
  player1Momentum: MomentumLevel = 'normal';
  player2Momentum: MomentumLevel = 'normal';
  player1Resources: number = 100;
  player2Resources: number = 100;
  turnCount: number = 0;
  activeCallouts: Callout[] = [];
  battleEffects: BattleEffects = {};

  // Energy Instability / Overload System
  checkOverload(player: number, resources: number): boolean {
    if (resources > 150) {
      this.setBattleState(player, 'overload');
      return true;
    }
    return false;
  }

  applyOverloadPenalty(player: number, techniqueCost: number): number {
    if (this.getPlayerState(player) === 'overload') {
      // 20% increased cost
      const increasedCost = Math.floor(techniqueCost * 1.2);
      
      // 10% chance of backfire
      if (Math.random() < 0.1) {
        this.triggerCallout('TECHNIQUE BACKFIRED!', 'major', 'technique');
        return 0; // Technique fails
      }
      
      // Opponent gains pressure resources
      const opponent = player === 1 ? 2 : 1;
      this.addResources(opponent, 5);
      
      return increasedCost;
    }
    return techniqueCost;
  }

  // Territory Instability System
  checkTerritoryDecay(player1Shapes: number, player2Shapes: number, totalShapes: number): number {
    const player1Percentage = (player1Shapes / totalShapes) * 100;
    const player2Percentage = (player2Shapes / totalShapes) * 100;

    if (player1Percentage > 60) {
      this.triggerCallout('TERRITORY DECAY ACTIVATED!', 'major', 'reversal');
      return 1; // Player 1 shapes become cracked
    }
    if (player2Percentage > 60) {
      this.triggerCallout('TERRITORY DECAY ACTIVATED!', 'major', 'reversal');
      return 2; // Player 2 shapes become cracked
    }
    return 0;
  }

  // Awakening Mode System
  checkAwakeningTrigger(player: number, resources: number, shapes: number, enemyShapes: number): boolean {
    const isLowOnResources = resources < 30;
    const isLosing = shapes < enemyShapes - 2;
    const isCriticalMoment = this.turnCount > 20;

    if ((isLowOnResources || isLosing) && isCriticalMoment) {
      this.setBattleState(player, 'awakening');
      this.triggerCallout('AWAKENING ACTIVATED!', 'legendary', 'awakening');
      return true;
    }
    return false;
  }

  applyAwakeningBonus(player: number, techniqueCost: number): number {
    if (this.getPlayerState(player) === 'awakening') {
      return Math.floor(techniqueCost * 0.5); // 50% cost reduction
    }
    return techniqueCost;
  }

  // Last Stand System
  checkLastStand(player: number, resources: number, shapes: number, enemyShapes: number): boolean {
    const isDesperate = resources < 20 && shapes < enemyShapes - 3;
    
    if (isDesperate && this.getPlayerState(player) !== 'last_stand') {
      this.setBattleState(player, 'last_stand');
      this.triggerCallout('LAST STAND ACTIVATED!', 'legendary', 'last_stand');
      
      // Immediate resource boost
      this.addResources(player, 50);
      
      return true;
    }
    return false;
  }

  // Momentum System
  updateMomentum(player: number, action: 'shape_completed' | 'technique_success' | 'technique_waste' | 'countered'): void {
    const currentMomentum = this.getMomentum(player);
    
    switch (action) {
      case 'shape_completed':
        this.increaseMomentum(player);
        break;
      case 'technique_success':
        this.increaseMomentum(player);
        break;
      case 'technique_waste':
        this.decreaseMomentum(player);
        break;
      case 'countered':
        this.decreaseMomentum(player);
        break;
    }

    const newMomentum = this.getMomentum(player);
    if (newMomentum === 'peak' || newMomentum === 'legendary') {
      this.triggerCallout('UNSTOPPABLE MOMENTUM!', 'major', 'momentum');
    }
  }

  private increaseMomentum(player: number): void {
    const momentum = player === 1 ? this.player1Momentum : this.player2Momentum;
    const levels: MomentumLevel[] = ['critical', 'low', 'normal', 'high', 'peak', 'legendary'];
    const currentIndex = levels.indexOf(momentum);
    
    if (currentIndex < levels.length - 1) {
      if (player === 1) {
        this.player1Momentum = levels[currentIndex + 1];
      } else {
        this.player2Momentum = levels[currentIndex + 1];
      }
    }
  }

  private decreaseMomentum(player: number): void {
    const momentum = player === 1 ? this.player1Momentum : this.player2Momentum;
    const levels: MomentumLevel[] = ['critical', 'low', 'normal', 'high', 'peak', 'legendary'];
    const currentIndex = levels.indexOf(momentum);
    
    if (currentIndex > 0) {
      if (player === 1) {
        this.player1Momentum = levels[currentIndex - 1];
      } else {
        this.player2Momentum = levels[currentIndex - 1];
      }
    }
  }

  // Callout System
  triggerCallout(text: string, intensity: 'minor' | 'major' | 'legendary', category: Callout['category']): void {
    const callout: Callout = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      intensity,
      category,
      timestamp: Date.now()
    };
    
    this.activeCallouts.push(callout);
    
    // Apply battle effects based on intensity
    if (intensity === 'legendary') {
      this.battleEffects = {
        screenShake: true,
        flash: true,
        slowMotion: true
      };
    } else if (intensity === 'major') {
      this.battleEffects = {
        screenShake: true,
        pressure: true
      };
    }
    
    // Clear effects after 2 seconds
    setTimeout(() => {
      this.battleEffects = {};
    }, 2000);
  }

  // Shape Actions System
  fractureShape(shapeId: string, player: number): boolean {
    // Remove 1 line from enemy shape
    this.triggerCallout('SHAPE FRACTURED!', 'minor', 'reversal');
    return true;
  }

  collapseShape(shapeId: string, player: number): boolean {
    // Destroy entire shape
    this.triggerCallout('SHAPE COLLAPSED!', 'major', 'reversal');
    return true;
  }

  corruptShape(shapeId: string, player: number): boolean {
    // Convert shape over time
    this.triggerCallout('CORRUPTION SPREADING!', 'major', 'forbidden');
    return true;
  }

  // Battlefield Shift (Late Game)
  checkBattlefieldShift(): boolean {
    if (this.turnCount > 20 && Math.random() < 0.3) {
      this.triggerCallout('BATTLEFIELD SHIFT!', 'legendary', 'technique');
      return true;
    }
    return false;
  }

  // Utility Methods
  setBattleState(player: number, state: BattleState): void {
    if (player === 1) {
      this.player1State = state;
    } else {
      this.player2State = state;
    }
  }

  getPlayerState(player: number): BattleState {
    return player === 1 ? this.player1State : this.player2State;
  }

  getMomentum(player: number): MomentumLevel {
    return player === 1 ? this.player1Momentum : this.player2Momentum;
  }

  addResources(player: number, amount: number): void {
    if (player === 1) {
      this.player1Resources = Math.min(200, this.player1Resources + amount);
    } else {
      this.player2Resources = Math.min(200, this.player2Resources + amount);
    }
  }

  consumeResources(player: number, amount: number): boolean {
    const resources = player === 1 ? this.player1Resources : this.player2Resources;
    if (resources >= amount) {
      if (player === 1) {
        this.player1Resources -= amount;
      } else {
        this.player2Resources -= amount;
      }
      return true;
    }
    return false;
  }

  nextTurn(): void {
    this.turnCount++;
    
    // Generate base resources
    this.addResources(1, 5);
    this.addResources(2, 5);
    
    // Clear old callouts
    const now = Date.now();
    this.activeCallouts = this.activeCallouts.filter(callout => now - callout.timestamp < 3000);
  }

  // Forbidden Technique Check
  canUseForbiddenTechnique(player: number, cost: number): boolean {
    const resources = player === 1 ? this.player1Resources : this.player2Resources;
    const state = this.getPlayerState(player);
    
    // Can only use forbidden techniques in desperate situations
    const isDesperate = resources < 50 || state === 'last_stand';
    
    if (isDesperate && resources >= cost) {
      this.triggerCallout('FORBIDDEN TECHNIQUE UNLEASHED!', 'legendary', 'forbidden');
      return true;
    }
    
    return false;
  }

  applyForbiddenPenalty(player: number, technique: string): void {
    this.setBattleState(player, 'forbidden');
    
    // Apply severe penalties based on technique
    switch (technique) {
      case 'awakening_sacrifice':
        this.player1Resources = 0;
        break;
      case 'mass_sacrifice':
        // Lose 30% of own shapes
        break;
      case 'instant_power_sacrifice':
        // Skip next 2 turns
        break;
      // ... other penalties
    }
    
    this.triggerCallout('THE PRICE OF POWER!', 'legendary', 'forbidden');
  }
}

// Universal Callout Generator
export class CalloutGenerator {
  private techniqueCallouts = {
    minor: [
      "STRATEGIC MOVE!",
      "CLEVER PLAY!",
      "WELL EXECUTED!",
      "CALCULATED RISK!",
    ],
    major: [
      "HE JUST TOOK CONTROL!",
      "THIS CHANGES EVERYTHING!",
      "THAT MOVE COST HIM EVERYTHING!",
      "THE TIDE HAS TURNED!",
      "IMPOSSIBLE TECHNIQUE!",
    ],
    legendary: [
      "WHAT IS THIS POWER?!",
      "HE'S DEFYING REALITY!",
      "THIS ISN'T JUST A GAME!",
      "THE LEGEND IS REAL!",
      "TRANSCENDENT SKILL!",
    ],
  };

  generateTechniqueCallout(impact: 'minor' | 'major' | 'legendary'): string {
    const callouts = this.techniqueCallouts[impact];
    return callouts[Math.floor(Math.random() * callouts.length)];
  }

  generateContextualCallout(gameState: {
    playerResources: number;
    enemyResources: number;
    playerShapes: number;
    enemyShapes: number;
    turnCount: number;
    momentum: MomentumLevel;
  }): string | null {
    const { playerResources, enemyResources, playerShapes, enemyShapes, turnCount, momentum } = gameState;
    
    // Comeback situations
    if (playerResources < 30 && playerShapes < enemyShapes - 2) {
      return "REFUSING TO LOSE!";
    }
    
    // Dominance situations
    if (playerShapes > enemyShapes + 3 && momentum === 'legendary') {
      return "TOTAL DOMINANCE!";
    }
    
    // High momentum plays
    if (momentum === 'peak' || momentum === 'legendary') {
      return "UNSTOPPABLE FORCE!";
    }
    
    // Late game intensity
    if (turnCount > 25 && Math.abs(playerShapes - enemyShapes) <= 1) {
      return "THIS IS THE END!";
    }
    
    return null;
  }
}

export const battleSystem = new BattleSystem();
export const calloutGenerator = new CalloutGenerator();
