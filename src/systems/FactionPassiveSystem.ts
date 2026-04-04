/**
 * FACTION PASSIVE ABILITIES SYSTEM
 * Provides unique passive bonuses for each anime faction
 */

import { AnimeFaction } from '@/types/game';

export interface PassiveAbility {
  name: string;
  description: string;
  effect: string;
  value: number;
  icon: string;
}

export class FactionPassiveSystem {
  private passiveAbilities: Record<AnimeFaction, PassiveAbility> = {
    naruto: {
      name: 'Chakra Regeneration',
      description: 'Regenerate extra chakra each turn',
      effect: 'resource_regen',
      value: 2,
      icon: '🌀'
    },
    jjk: {
      name: 'Cursed Energy Overflow',
      description: 'Store up to 120 cursed energy instead of 100',
      effect: 'max_resource',
      value: 120,
      icon: '⚡'
    },
    onepiece: {
      name: 'Willpower Shield',
      description: 'Protect 1 shape from being stolen per game',
      effect: 'shape_protection',
      value: 1,
      icon: '🛡️'
    },
    bleach: {
      name: 'Spirit Pressure',
      description: 'Opponent techniques cost 5% more',
      effect: 'opponent_cost_increase',
      value: 0.05,
      icon: '👻'
    },
    blackclover: {
      name: 'Anti-Magic',
      description: 'Reduce opponent technique costs by 10% (confuse them)',
      effect: 'opponent_cost_reduction',
      value: 0.1,
      icon: '⚔️'
    },
    dragonball: {
      name: 'Power Scaling',
      description: 'Gain +5% stats for each point behind opponent',
      effect: 'comeback_scaling',
      value: 0.05,
      icon: '💪'
    },
    demonslayer: {
      name: 'Breathing Forms',
      description: 'Switch between offense (+10% damage) and defense (+10% protection)',
      effect: 'stance_switching',
      value: 0.1,
      icon: '🌊'
    },
    hxh: {
      name: 'Nen Conditions',
      description: 'Set custom rules for +20% bonus (risk/reward)',
      effect: 'conditional_bonus',
      value: 0.2,
      icon: '🎯'
    },
    physical: {
      name: 'Iron Will',
      description: 'Reduce all incoming damage by 10%',
      effect: 'damage_reduction',
      value: 0.1,
      icon: '💎'
    }
  };

  /**
   * Get passive ability for a faction
   */
  public getPassiveAbility(faction: AnimeFaction): PassiveAbility {
    return this.passiveAbilities[faction];
  }

  /**
   * Apply passive effect to resource generation
   */
  public applyResourceRegen(faction: AnimeFaction, baseRegen: number): number {
    const passive = this.passiveAbilities[faction];
    if (passive.effect === 'resource_regen') {
      return baseRegen + passive.value;
    }
    return baseRegen;
  }

  /**
   * Get max resource for faction
   */
  public getMaxResource(faction: AnimeFaction): number {
    const passive = this.passiveAbilities[faction];
    if (passive.effect === 'max_resource') {
      return passive.value;
    }
    return 100; // Default max
  }

  /**
   * Check if shape is protected by passive
   */
  public isShapeProtected(
    faction: AnimeFaction,
    protectionCount: number
  ): boolean {
    const passive = this.passiveAbilities[faction];
    if (passive.effect === 'shape_protection') {
      return protectionCount < passive.value;
    }
    return false;
  }

  /**
   * Apply opponent cost modifier
   */
  public applyOpponentCostModifier(
    playerFaction: AnimeFaction,
    opponentCost: number
  ): number {
    const passive = this.passiveAbilities[playerFaction];
    
    if (passive.effect === 'opponent_cost_increase') {
      return Math.floor(opponentCost * (1 + passive.value));
    }
    
    if (passive.effect === 'opponent_cost_reduction') {
      // Anti-magic confuses opponent, making techniques cheaper but less effective
      return Math.floor(opponentCost * (1 - passive.value));
    }
    
    return opponentCost;
  }

  /**
   * Calculate comeback scaling bonus
   */
  public getComebackBonus(
    faction: AnimeFaction,
    playerScore: number,
    opponentScore: number
  ): number {
    const passive = this.passiveAbilities[faction];
    
    if (passive.effect === 'comeback_scaling') {
      const deficit = Math.max(0, opponentScore - playerScore);
      return 1 + (deficit * passive.value);
    }
    
    return 1; // No bonus
  }

  /**
   * Get stance bonus (Demon Slayer)
   */
  public getStanceBonus(
    faction: AnimeFaction,
    stance: 'offense' | 'defense'
  ): number {
    const passive = this.passiveAbilities[faction];
    
    if (passive.effect === 'stance_switching') {
      return passive.value;
    }
    
    return 0;
  }

  /**
   * Get conditional bonus (HxH Nen)
   */
  public getConditionalBonus(
    faction: AnimeFaction,
    conditionMet: boolean
  ): number {
    const passive = this.passiveAbilities[faction];
    
    if (passive.effect === 'conditional_bonus' && conditionMet) {
      return passive.value;
    }
    
    return 0;
  }

  /**
   * Apply damage reduction
   */
  public applyDamageReduction(
    faction: AnimeFaction,
    incomingDamage: number
  ): number {
    const passive = this.passiveAbilities[faction];
    
    if (passive.effect === 'damage_reduction') {
      return Math.floor(incomingDamage * (1 - passive.value));
    }
    
    return incomingDamage;
  }

  /**
   * Get all passive abilities for display
   */
  public getAllPassives(): Record<AnimeFaction, PassiveAbility> {
    return this.passiveAbilities;
  }

  /**
   * Get passive visual indicator
   */
  public getPassiveVisual(faction: AnimeFaction): {
    color: string;
    glow: string;
    icon: string;
  } {
    const passive = this.passiveAbilities[faction];
    
    const colors: Record<string, { color: string; glow: string }> = {
      naruto: { color: '#FF6B00', glow: '#FF9500' },
      jjk: { color: '#8B00FF', glow: '#BF5FFF' },
      onepiece: { color: '#00C8FF', glow: '#00E5FF' },
      bleach: { color: '#00FF88', glow: '#00FFAA' },
      blackclover: { color: '#FFD700', glow: '#FFEC60' },
      dragonball: { color: '#FF4400', glow: '#FF7700' },
      demonslayer: { color: '#FF003C', glow: '#FF3366' },
      hxh: { color: '#00FF88', glow: '#00FFAA' },
      physical: { color: '#BBBBBB', glow: '#DDDDDD' }
    };

    return {
      ...colors[faction],
      icon: passive.icon
    };
  }
}

// Export singleton
export const createFactionPassiveSystem = (): FactionPassiveSystem => {
  return new FactionPassiveSystem();
};
