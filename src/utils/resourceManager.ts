/**
 * Resource Management System
 * Handles 3-hour refill timer, unlimited subscriptions, and forbidden technique drains
 */

const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export interface ResourceStatus {
  currentResources: number;
  canRefill: boolean;
  timeUntilRefill: number; // milliseconds
  hasUnlimited: boolean;
  unlimitedExpiry?: number;
}

/**
 * Check if user can refill their resources (3 hours passed)
 */
export function canRefillResources(lastRefillTime?: number): boolean {
  if (!lastRefillTime) return true; // First time, can refill
  const now = Date.now();
  const timeSinceRefill = now - lastRefillTime;
  return timeSinceRefill >= THREE_HOURS_MS;
}

/**
 * Get time remaining until next refill
 */
export function getTimeUntilRefill(lastRefillTime?: number): number {
  if (!lastRefillTime) return 0;
  const now = Date.now();
  const timeSinceRefill = now - lastRefillTime;
  const remaining = THREE_HOURS_MS - timeSinceRefill;
  return Math.max(0, remaining);
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Check if unlimited subscription is still active
 */
export function isUnlimitedActive(hasUnlimited?: boolean, expiryTime?: number): boolean {
  if (!hasUnlimited) return false;
  if (!expiryTime) return true; // No expiry set, assume active
  return Date.now() < expiryTime;
}

/**
 * Get resource status for a user
 */
export function getResourceStatus(
  currentResources: number,
  lastRefillTime?: number,
  hasUnlimited?: boolean,
  unlimitedExpiry?: number
): ResourceStatus {
  const unlimited = isUnlimitedActive(hasUnlimited, unlimitedExpiry);
  
  return {
    currentResources: unlimited ? 200 : currentResources,
    canRefill: !unlimited && canRefillResources(lastRefillTime),
    timeUntilRefill: unlimited ? 0 : getTimeUntilRefill(lastRefillTime),
    hasUnlimited: unlimited,
    unlimitedExpiry
  };
}

/**
 * Handle forbidden technique usage - drains unlimited users
 */
export function handleForbiddenTechniqueUse(
  hasUnlimited: boolean,
  currentResources: number,
  techniqueCost: number
): {
  newResources: number;
  unlimitedEnded: boolean;
  unlimitedDrained: boolean;
} {
  // Forbidden techniques require at least 100 resources
  if (currentResources < 100) {
    return {
      newResources: currentResources,
      unlimitedEnded: false,
      unlimitedDrained: false
    };
  }

  if (hasUnlimited) {
    // For unlimited users, drain to 200 or end unlimited
    if (currentResources >= 200) {
      // Drain to 200
      return {
        newResources: 200,
        unlimitedEnded: false,
        unlimitedDrained: true
      };
    } else {
      // End unlimited subscription
      return {
        newResources: Math.max(0, currentResources - techniqueCost),
        unlimitedEnded: true,
        unlimitedDrained: false
      };
    }
  } else {
    // Normal users just pay the cost
    return {
      newResources: Math.max(0, currentResources - techniqueCost),
      unlimitedEnded: false,
      unlimitedDrained: false
    };
  }
}

/**
 * Refill user resources (only if 3 hours passed)
 */
export function refillResources(
  currentResources: number,
  lastRefillTime?: number,
  hasUnlimited?: boolean
): {
  newResources: number;
  refilled: boolean;
  newRefillTime: number;
} {
  // Unlimited users always have 200
  if (hasUnlimited) {
    return {
      newResources: 200,
      refilled: false,
      newRefillTime: lastRefillTime || Date.now()
    };
  }

  // Check if can refill
  if (!canRefillResources(lastRefillTime)) {
    return {
      newResources: currentResources,
      refilled: false,
      newRefillTime: lastRefillTime || Date.now()
    };
  }

  // Refill to 100
  return {
    newResources: 100,
    refilled: true,
    newRefillTime: Date.now()
  };
}

/**
 * Calculate unlimited subscription expiry time
 */
export function calculateUnlimitedExpiry(type: 'weekly' | 'monthly' | 'season'): number {
  const now = Date.now();
  
  switch (type) {
    case 'weekly':
      return now + (7 * 24 * 60 * 60 * 1000); // 7 days
    case 'monthly':
      return now + (30 * 24 * 60 * 60 * 1000); // 30 days
    case 'season':
      return now + (90 * 24 * 60 * 60 * 1000); // 90 days
    default:
      return now + (30 * 24 * 60 * 60 * 1000);
  }
}
