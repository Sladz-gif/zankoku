/**
 * TUTORIAL SYSTEM
 * Provides step-by-step guidance for new players learning Dot Wars
 */

export interface TutorialStep {
  id: number;
  title: string;
  message: string;
  highlight?: 'dots' | 'resources' | 'techniques' | 'score' | 'shapes';
  condition: 'start' | 'first_line' | 'first_shape' | 'use_technique' | 'complete';
  completed: boolean;
}

export class TutorialSystem {
  private steps: TutorialStep[] = [
    {
      id: 1,
      title: 'Welcome to Dot Wars!',
      message: 'Connect dots to create shapes and claim territory. Click on two adjacent dots to draw a line between them.',
      highlight: 'dots',
      condition: 'start',
      completed: false
    },
    {
      id: 2,
      title: 'Great! You drew your first line!',
      message: 'Keep connecting dots. When you complete a square (4 lines forming a box), you claim it and get a bonus turn!',
      highlight: 'shapes',
      condition: 'first_line',
      completed: false
    },
    {
      id: 3,
      title: 'Excellent! You completed a shape!',
      message: 'Notice your score increased! You also got a bonus turn. Try to complete another shape to build momentum.',
      highlight: 'score',
      condition: 'first_shape',
      completed: false
    },
    {
      id: 4,
      title: 'Resources & Techniques',
      message: 'See your resource bar? You gain +5 resources each turn. Use resources to activate powerful techniques that can change the game!',
      highlight: 'resources',
      condition: 'first_shape',
      completed: false
    },
    {
      id: 5,
      title: 'Try Using a Technique!',
      message: 'Click on a technique below to use it. Each technique costs resources but gives you special abilities. Try one now!',
      highlight: 'techniques',
      condition: 'first_shape',
      completed: false
    },
    {
      id: 6,
      title: 'Strategic Tips',
      message: 'Block your opponent from completing shapes! If they have 3 sides of a square, place a line to block them. Control the center for better positioning.',
      highlight: 'dots',
      condition: 'use_technique',
      completed: false
    },
    {
      id: 7,
      title: 'Tutorial Complete!',
      message: 'You\'ve learned the basics! Keep playing to master advanced strategies. The AI will now play at full strength. Good luck!',
      condition: 'complete',
      completed: false
    }
  ];

  private currentStepIndex = 0;
  private linesPlaced = 0;
  private shapesCompleted = 0;
  private techniquesUsed = 0;

  constructor() {}

  /**
   * Get the current tutorial step
   */
  public getCurrentStep(): TutorialStep | null {
    if (this.currentStepIndex >= this.steps.length) {
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  /**
   * Update tutorial progress based on game events
   */
  public onLinePlaced(): void {
    this.linesPlaced++;
    
    if (this.linesPlaced === 1 && this.currentStepIndex === 0) {
      this.advanceStep();
    }
  }

  public onShapeCompleted(): void {
    this.shapesCompleted++;
    
    if (this.shapesCompleted === 1 && this.currentStepIndex === 1) {
      this.advanceStep();
      // Immediately show resource tip
      setTimeout(() => {
        this.advanceStep();
      }, 3000);
    }
  }

  public onTechniqueUsed(): void {
    this.techniquesUsed++;
    
    if (this.techniquesUsed === 1 && this.currentStepIndex === 4) {
      this.advanceStep();
      // Show strategic tips
      setTimeout(() => {
        this.advanceStep();
      }, 4000);
    }
  }

  /**
   * Manually advance to next step
   */
  public advanceStep(): void {
    if (this.currentStepIndex < this.steps.length) {
      this.steps[this.currentStepIndex].completed = true;
      this.currentStepIndex++;
    }
  }

  /**
   * Check if tutorial is complete
   */
  public isComplete(): boolean {
    return this.currentStepIndex >= this.steps.length - 1;
  }

  /**
   * Get progress percentage
   */
  public getProgress(): number {
    return Math.round((this.currentStepIndex / this.steps.length) * 100);
  }

  /**
   * Reset tutorial
   */
  public reset(): void {
    this.currentStepIndex = 0;
    this.linesPlaced = 0;
    this.shapesCompleted = 0;
    this.techniquesUsed = 0;
    this.steps.forEach(step => step.completed = false);
  }

  /**
   * Skip tutorial
   */
  public skip(): void {
    this.currentStepIndex = this.steps.length;
  }

  /**
   * Get all steps for display
   */
  public getAllSteps(): TutorialStep[] {
    return this.steps;
  }

  /**
   * Check if should show hint for current game state
   */
  public shouldShowHint(gameState: {
    currentPlayer: number;
    playerShapes: number;
    opponentShapes: number;
    playerResource: number;
  }): string | null {
    const step = this.getCurrentStep();
    if (!step) return null;

    // Provide contextual hints based on game state
    if (step.id === 2 && gameState.currentPlayer === 1) {
      return 'Look for opportunities to complete squares! You need 4 connected lines.';
    }

    if (step.id === 5 && gameState.playerResource >= 30) {
      return 'You have enough resources! Try clicking a technique below.';
    }

    if (step.id === 6 && gameState.opponentShapes > gameState.playerShapes + 2) {
      return 'The AI is ahead! Try to block their next move or use a technique to catch up.';
    }

    return null;
  }
}

// Export singleton
export const createTutorialSystem = (): TutorialSystem => {
  return new TutorialSystem();
};
