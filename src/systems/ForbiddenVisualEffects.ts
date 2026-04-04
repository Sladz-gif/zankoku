/**
 * FORBIDDEN TECHNIQUE VISUAL EFFECTS SYSTEM
 * Provides dramatic visual effects for forbidden techniques
 */

export interface ForbiddenEffect {
  type: string;
  duration: number;
  color: string;
  intensity: 'extreme' | 'massive' | 'catastrophic';
  animation: string;
}

export class ForbiddenVisualEffects {
  /**
   * Get visual effect for forbidden technique
   */
  public getForbiddenEffect(effectType: string): ForbiddenEffect {
    const effects: Record<string, ForbiddenEffect> = {
      awakening_sacrifice: {
        type: 'aura_explosion',
        duration: 3000,
        color: '#FFD700',
        intensity: 'extreme',
        animation: 'golden_aura_burst'
      },
      mass_sacrifice: {
        type: 'dark_energy_transfer',
        duration: 2500,
        color: '#8B00FF',
        intensity: 'massive',
        animation: 'soul_drain'
      },
      instant_power_sacrifice: {
        type: 'explosive_creation',
        duration: 2000,
        color: '#FF003C',
        intensity: 'extreme',
        animation: 'reality_warp'
      },
      corruption_sacrifice: {
        type: 'spreading_corruption',
        duration: 3500,
        color: '#8B00FF',
        intensity: 'massive',
        animation: 'purple_plague'
      },
      board_control_sacrifice: {
        type: 'domain_takeover',
        duration: 4000,
        color: '#00C8FF',
        intensity: 'catastrophic',
        animation: 'absolute_control'
      },
      total_destruction_sacrifice: {
        type: 'apocalypse',
        duration: 5000,
        color: '#FF0000',
        intensity: 'catastrophic',
        animation: 'world_ending'
      },
      board_wipe_sacrifice: {
        type: 'cleansing_wave',
        duration: 3000,
        color: '#FFFFFF',
        intensity: 'massive',
        animation: 'divine_purge'
      },
      technique_theft_sacrifice: {
        type: 'ability_steal',
        duration: 2500,
        color: '#FFD700',
        intensity: 'extreme',
        animation: 'power_absorption'
      },
      permanent_negation_sacrifice: {
        type: 'anti_magic_field',
        duration: 3000,
        color: '#000000',
        intensity: 'massive',
        animation: 'void_expansion'
      },
      perfect_dodge_sacrifice: {
        type: 'ultra_instinct',
        duration: 2000,
        color: '#C0C0C0',
        intensity: 'extreme',
        animation: 'silver_aura'
      },
      infinite_power_sacrifice: {
        type: 'energy_overload',
        duration: 3500,
        color: '#00FFFF',
        intensity: 'catastrophic',
        animation: 'infinite_glow'
      },
      desperation_gamble: {
        type: 'all_or_nothing',
        duration: 2000,
        color: '#FF6B00',
        intensity: 'extreme',
        animation: 'fate_dice'
      },
      total_corruption_sacrifice: {
        type: 'world_corruption',
        duration: 4000,
        color: '#8B008B',
        intensity: 'catastrophic',
        animation: 'reality_corruption'
      },
      wish_sacrifice: {
        type: 'dragon_wish',
        duration: 3000,
        color: '#FFD700',
        intensity: 'massive',
        animation: 'wish_granting'
      },
      power_evolution_sacrifice: {
        type: 'transformation',
        duration: 2500,
        color: '#FF4400',
        intensity: 'extreme',
        animation: 'evolution_burst'
      },
      blind_rage_sacrifice: {
        type: 'berserker_mode',
        duration: 2000,
        color: '#8B0000',
        intensity: 'massive',
        animation: 'rage_explosion'
      },
      draw_sacrifice: {
        type: 'stalemate',
        duration: 3000,
        color: '#808080',
        intensity: 'extreme',
        animation: 'time_freeze'
      }
    };

    return effects[effectType] || {
      type: 'default_forbidden',
      duration: 2000,
      color: '#FF003C',
      intensity: 'extreme',
      animation: 'forbidden_burst'
    };
  }

  /**
   * Generate SVG animation for forbidden effect
   */
  public generateSVGEffect(
    effect: ForbiddenEffect,
    centerX: number,
    centerY: number,
    boardSize: number
  ): string {
    switch (effect.animation) {
      case 'golden_aura_burst':
        return this.goldenAuraBurst(centerX, centerY, effect.color);
      
      case 'soul_drain':
        return this.soulDrain(centerX, centerY, boardSize, effect.color);
      
      case 'reality_warp':
        return this.realityWarp(centerX, centerY, boardSize, effect.color);
      
      case 'purple_plague':
        return this.purplePlague(centerX, centerY, boardSize, effect.color);
      
      case 'absolute_control':
        return this.absoluteControl(boardSize, effect.color);
      
      case 'world_ending':
        return this.worldEnding(centerX, centerY, boardSize, effect.color);
      
      case 'divine_purge':
        return this.divinePurge(boardSize, effect.color);
      
      case 'power_absorption':
        return this.powerAbsorption(centerX, centerY, effect.color);
      
      case 'void_expansion':
        return this.voidExpansion(centerX, centerY, boardSize, effect.color);
      
      case 'silver_aura':
        return this.silverAura(centerX, centerY, effect.color);
      
      case 'infinite_glow':
        return this.infiniteGlow(centerX, centerY, boardSize, effect.color);
      
      default:
        return this.defaultForbiddenBurst(centerX, centerY, effect.color);
    }
  }

  private goldenAuraBurst(x: number, y: number, color: string): string {
    return `
      <g class="forbidden-effect">
        <circle cx="${x}" cy="${y}" r="0" fill="${color}" opacity="0.8">
          <animate attributeName="r" from="0" to="200" dur="1s" />
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" />
        </circle>
        ${[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const endX = x + Math.cos(angle) * 150;
          const endY = y + Math.sin(angle) * 150;
          return `
            <line x1="${x}" y1="${y}" x2="${endX}" y2="${endY}" 
              stroke="${color}" stroke-width="3" opacity="0.9">
              <animate attributeName="opacity" from="0.9" to="0" dur="0.8s" />
            </line>
          `;
        }).join('')}
      </g>
    `;
  }

  private soulDrain(x: number, y: number, size: number, color: string): string {
    return `
      <g class="forbidden-effect">
        ${[...Array(20)].map((_, i) => {
          const startX = Math.random() * size;
          const startY = Math.random() * size;
          return `
            <line x1="${startX}" y1="${startY}" x2="${x}" y2="${y}" 
              stroke="${color}" stroke-width="2" opacity="0.7">
              <animate attributeName="x1" from="${startX}" to="${x}" dur="1.5s" />
              <animate attributeName="y1" from="${startY}" to="${y}" dur="1.5s" />
              <animate attributeName="opacity" from="0.7" to="0" dur="1.5s" />
            </line>
          `;
        }).join('')}
      </g>
    `;
  }

  private realityWarp(x: number, y: number, size: number, color: string): string {
    return `
      <g class="forbidden-effect">
        <rect x="0" y="0" width="${size}" height="${size}" 
          fill="${color}" opacity="0.3">
          <animate attributeName="opacity" 
            values="0;0.3;0.6;0.3;0" dur="1s" />
        </rect>
        <circle cx="${x}" cy="${y}" r="50" fill="none" 
          stroke="${color}" stroke-width="5">
          <animate attributeName="r" from="0" to="150" dur="1s" />
          <animate attributeName="opacity" from="1" to="0" dur="1s" />
        </circle>
      </g>
    `;
  }

  private purplePlague(x: number, y: number, size: number, color: string): string {
    return `
      <g class="forbidden-effect">
        ${[...Array(30)].map(() => {
          const px = Math.random() * size;
          const py = Math.random() * size;
          return `
            <circle cx="${px}" cy="${py}" r="0" fill="${color}" opacity="0.6">
              <animate attributeName="r" from="0" to="30" dur="2s" />
              <animate attributeName="opacity" from="0.6" to="0" dur="2s" />
            </circle>
          `;
        }).join('')}
      </g>
    `;
  }

  private absoluteControl(size: number, color: string): string {
    return `
      <g class="forbidden-effect">
        <rect x="0" y="0" width="${size}" height="${size}" 
          fill="${color}" opacity="0">
          <animate attributeName="opacity" 
            values="0;0.5;0.8;0.5;0" dur="2s" />
        </rect>
        ${[...Array(10)].map((_, i) => `
          <line x1="0" y1="${i * size / 10}" x2="${size}" y2="${i * size / 10}" 
            stroke="${color}" stroke-width="2" opacity="0.8">
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" />
          </line>
          <line x1="${i * size / 10}" y1="0" x2="${i * size / 10}" y2="${size}" 
            stroke="${color}" stroke-width="2" opacity="0.8">
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" />
          </line>
        `).join('')}
      </g>
    `;
  }

  private worldEnding(x: number, y: number, size: number, color: string): string {
    return `
      <g class="forbidden-effect">
        <circle cx="${x}" cy="${y}" r="0" fill="${color}" opacity="0.9">
          <animate attributeName="r" from="0" to="${size}" dur="2.5s" />
          <animate attributeName="opacity" from="0.9" to="0" dur="2.5s" />
        </circle>
        <rect x="0" y="0" width="${size}" height="${size}" fill="#000000" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="2.5s" />
        </rect>
      </g>
    `;
  }

  private divinePurge(size: number, color: string): string {
    return `
      <g class="forbidden-effect">
        <rect x="0" y="0" width="${size}" height="${size}" fill="${color}" opacity="0">
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" />
        </rect>
      </g>
    `;
  }

  private powerAbsorption(x: number, y: number, color: string): string {
    return `
      <g class="forbidden-effect">
        ${[...Array(8)].map((_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const startX = x + Math.cos(angle) * 100;
          const startY = y + Math.sin(angle) * 100;
          return `
            <path d="M ${startX} ${startY} Q ${x} ${y} ${x} ${y}" 
              stroke="${color}" stroke-width="3" fill="none" opacity="0.8">
              <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" />
            </path>
          `;
        }).join('')}
      </g>
    `;
  }

  private voidExpansion(x: number, y: number, size: number, color: string): string {
    return `
      <g class="forbidden-effect">
        <circle cx="${x}" cy="${y}" r="0" fill="#000000" opacity="0.9">
          <animate attributeName="r" from="0" to="${size / 2}" dur="1.5s" />
        </circle>
        <circle cx="${x}" cy="${y}" r="0" stroke="${color}" stroke-width="5" fill="none">
          <animate attributeName="r" from="0" to="${size / 2}" dur="1.5s" />
          <animate attributeName="opacity" from="1" to="0" dur="1.5s" />
        </circle>
      </g>
    `;
  }

  private silverAura(x: number, y: number, color: string): string {
    return `
      <g class="forbidden-effect">
        <circle cx="${x}" cy="${y}" r="80" fill="none" stroke="${color}" stroke-width="3" opacity="0.9">
          <animate attributeName="r" values="60;80;60" dur="1s" repeatCount="2" />
        </circle>
        <circle cx="${x}" cy="${y}" r="60" fill="${color}" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="2" />
        </circle>
      </g>
    `;
  }

  private infiniteGlow(x: number, y: number, size: number, color: string): string {
    return `
      <g class="forbidden-effect">
        ${[...Array(5)].map((_, i) => `
          <circle cx="${x}" cy="${y}" r="${(i + 1) * 40}" 
            fill="none" stroke="${color}" stroke-width="2" opacity="0.7">
            <animate attributeName="r" 
              from="${(i + 1) * 40}" to="${(i + 1) * 40 + 100}" dur="2s" />
            <animate attributeName="opacity" from="0.7" to="0" dur="2s" />
          </circle>
        `).join('')}
      </g>
    `;
  }

  private defaultForbiddenBurst(x: number, y: number, color: string): string {
    return `
      <g class="forbidden-effect">
        <circle cx="${x}" cy="${y}" r="0" fill="${color}" opacity="0.8">
          <animate attributeName="r" from="0" to="100" dur="1s" />
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" />
        </circle>
      </g>
    `;
  }
}

// Export singleton
export const createForbiddenVisualEffects = (): ForbiddenVisualEffects => {
  return new ForbiddenVisualEffects();
};
