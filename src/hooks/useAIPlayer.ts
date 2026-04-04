/**
 * Custom hook for managing AI player in Dot Wars
 * Handles AI move execution and technique usage
 */

import { useEffect, useRef, useCallback } from 'react';
import { DotWarsAI, AIDifficulty } from '@/systems/DotWarsAI';
import { AnimeFaction, Technique } from '@/types/game';

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

interface UseAIPlayerProps {
  enabled: boolean;
  faction: AnimeFaction;
  difficulty: AIDifficulty;
  currentPlayer: number;
  aiPlayer: number;
  gameState: GameState;
  onAIMove: (line: [number, number, number, number]) => void;
  onAITechnique: (technique: Technique) => void;
  gameOver: boolean;
}

export const useAIPlayer = ({
  enabled,
  faction,
  difficulty,
  currentPlayer,
  aiPlayer,
  gameState,
  onAIMove,
  onAITechnique,
  gameOver
}: UseAIPlayerProps) => {
  const aiRef = useRef<DotWarsAI | null>(null);
  const isProcessingRef = useRef(false);

  // Initialize AI
  useEffect(() => {
    if (enabled && !aiRef.current) {
      aiRef.current = new DotWarsAI(faction, difficulty);
    }
  }, [enabled, faction, difficulty]);

  // Execute AI turn
  const executeAITurn = useCallback(async () => {
    if (!enabled || !aiRef.current || isProcessingRef.current || gameOver) {
      return;
    }

    if (currentPlayer !== aiPlayer) {
      return;
    }

    isProcessingRef.current = true;

    try {
      // First, decide if AI should use a technique
      const technique = aiRef.current.decideTechnique(gameState);
      if (technique) {
        // Small delay before using technique
        await new Promise(resolve => setTimeout(resolve, 400));
        onAITechnique(technique);
        // Wait for technique animation
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Then make a move
      const move = await aiRef.current.makeMove(gameState);
      if (move) {
        onAIMove(move);
      }
    } catch (error) {
      console.error('AI move error:', error);
    } finally {
      isProcessingRef.current = false;
    }
  }, [enabled, currentPlayer, aiPlayer, gameState, onAIMove, onAITechnique, gameOver]);

  // Trigger AI turn when it's AI's turn
  useEffect(() => {
    if (enabled && currentPlayer === aiPlayer && !gameOver && !isProcessingRef.current) {
      // Small delay to make it feel more natural
      const timer = setTimeout(() => {
        executeAITurn();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [enabled, currentPlayer, aiPlayer, gameOver, executeAITurn]);

  // Reset AI on game over
  useEffect(() => {
    if (gameOver && aiRef.current) {
      aiRef.current.reset();
    }
  }, [gameOver]);

  return {
    ai: aiRef.current,
    isAITurn: enabled && currentPlayer === aiPlayer && !gameOver
  };
};
