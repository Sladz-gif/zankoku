// Store utility functions for monetization and purchase management

import { ResourcePackage, UnlimitedPackage, Subscription, SubscriptionBenefits, FraudDetection, Purchase } from '@/types/store';

/**
 * Calculate value per dollar for resource packages
 */
export function calculateValuePerDollar(silver: number, gold: number, price: number): number {
  const totalValue = silver + (gold * 2); // Gold is worth 2x silver
  return totalValue / price;
}

/**
 * Determine best value package
 */
export function markBestValue(packages: ResourcePackage[]): ResourcePackage[] {
  const withValues = packages.map(pkg => ({
    ...pkg,
    valuePerDollar: calculateValuePerDollar(pkg.silver, pkg.gold, pkg.price)
  }));
  
  const maxValue = Math.max(...withValues.map(p => p.valuePerDollar || 0));
  
  return withValues.map(pkg => ({
    ...pkg,
    isBestValue: pkg.valuePerDollar === maxValue
  }));
}

/**
 * Calculate usage preview for resources
 */
export function calculateUsagePreview(amount: number): { techniques: number; battles: number } {
  const avgTechniqueCost = 10;
  const avgBattleCost = 50;
  
  return {
    techniques: Math.floor(amount / avgTechniqueCost),
    battles: Math.floor(amount / avgBattleCost)
  };
}

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status !== 'active') return false;
  return Date.now() < subscription.expiryDate;
}

/**
 * Get subscription benefits based on tier
 */
export function getSubscriptionBenefits(tier: 'weekly' | 'monthly' | 'season'): SubscriptionBenefits {
  const baseBenefits: SubscriptionBenefits = {
    unlimitedResources: true,
    allTechniquesUnlocked: true,
    regenerationMultiplier: 2.0,
    resourceCostOverride: 0,
    exclusiveContent: false
  };
  
  switch (tier) {
    case 'season':
      return {
        ...baseBenefits,
        regenerationMultiplier: 3.0,
        exclusiveContent: true
      };
    case 'monthly':
      return {
        ...baseBenefits,
        regenerationMultiplier: 2.5
      };
    case 'weekly':
    default:
      return baseBenefits;
  }
}

/**
 * Calculate days remaining in subscription
 */
export function getDaysRemaining(expiryDate: number): number {
  const now = Date.now();
  const diff = expiryDate - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(expiryDate: number): string {
  const days = getDaysRemaining(expiryDate);
  
  if (days === 0) return 'Expires today';
  if (days === 1) return '1 day remaining';
  if (days < 7) return `${days} days remaining`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} remaining`;
  }
  
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} remaining`;
}

/**
 * Check for fraud detection
 */
export function detectFraud(userId: number, purchases: Purchase[]): FraudDetection {
  const recentPurchases = purchases.filter(p => 
    p.userId === userId && 
    Date.now() - p.timestamp < 3600000 // Last hour
  );
  
  const rapidPurchases = recentPurchases.length;
  const lastPurchaseTime = recentPurchases.length > 0 
    ? Math.max(...recentPurchases.map(p => p.timestamp))
    : 0;
  
  const flagged = rapidPurchases > 5; // More than 5 purchases in an hour
  
  return {
    userId,
    rapidPurchases,
    lastPurchaseTime,
    flagged,
    reason: flagged ? 'Suspicious rapid purchases detected' : undefined
  };
}

/**
 * Validate purchase (sufficient funds, not fraud, etc.)
 */
export function validatePurchase(
  userGold: number,
  userSilver: number,
  requiredGold: number,
  requiredSilver: number,
  fraudCheck: FraudDetection
): { valid: boolean; error?: string } {
  if (fraudCheck.flagged) {
    return { valid: false, error: 'Too many purchases in a short time. Please wait before purchasing again.' };
  }
  
  if (requiredGold > 0 && userGold < requiredGold) {
    return { valid: false, error: `Insufficient Gold. You need ${requiredGold} Gold but only have ${userGold}.` };
  }
  
  if (requiredSilver > 0 && userSilver < requiredSilver) {
    return { valid: false, error: `Insufficient Silver. You need ${requiredSilver} Silver but only have ${userSilver}.` };
  }
  
  return { valid: true };
}

/**
 * Calculate total revenue by category
 */
export function calculateRevenue(purchases: Purchase[]): {
  resources: number;
  subscriptions: number;
  content: number;
  total: number;
} {
  const revenue = {
    resources: 0,
    subscriptions: 0,
    content: 0,
    total: 0
  };
  
  purchases.forEach(p => {
    if (p.status === 'completed') {
      revenue.total += p.price;
      
      switch (p.type) {
        case 'resource':
        case 'currency':
          revenue.resources += p.price;
          break;
        case 'subscription':
          revenue.subscriptions += p.price;
          break;
        case 'content':
          revenue.content += p.price;
          break;
      }
    }
  });
  
  return revenue;
}

/**
 * Calculate conversion funnel
 */
export function calculateConversionFunnel(analytics: {
  viewedStore: number;
  clickedBuy: number;
  reachedCheckout: number;
  completedPurchase: number;
}): {
  viewToClick: number;
  clickToCheckout: number;
  checkoutToComplete: number;
  overall: number;
} {
  return {
    viewToClick: analytics.viewedStore > 0 ? (analytics.clickedBuy / analytics.viewedStore) * 100 : 0,
    clickToCheckout: analytics.clickedBuy > 0 ? (analytics.reachedCheckout / analytics.clickedBuy) * 100 : 0,
    checkoutToComplete: analytics.reachedCheckout > 0 ? (analytics.completedPurchase / analytics.reachedCheckout) * 100 : 0,
    overall: analytics.viewedStore > 0 ? (analytics.completedPurchase / analytics.viewedStore) * 100 : 0
  };
}

/**
 * Generate transaction ID
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `TXN-${timestamp}-${random}`.toUpperCase();
}

/**
 * Check refund eligibility
 */
export function checkRefundEligibility(purchase: Purchase): { eligible: boolean; reason: string; daysRemaining: number } {
  const daysSincePurchase = (Date.now() - purchase.timestamp) / (1000 * 60 * 60 * 24);
  const refundWindow = 7; // 7 days
  const daysRemaining = Math.max(0, Math.ceil(refundWindow - daysSincePurchase));
  
  if (purchase.status === 'refunded') {
    return { eligible: false, reason: 'Already refunded', daysRemaining: 0 };
  }
  
  if (purchase.status !== 'completed') {
    return { eligible: false, reason: 'Purchase not completed', daysRemaining: 0 };
  }
  
  if (daysSincePurchase > refundWindow) {
    return { eligible: false, reason: 'Refund window expired (7 days)', daysRemaining: 0 };
  }
  
  return { eligible: true, reason: 'Eligible for refund', daysRemaining };
}

/**
 * Format currency display
 */
export function formatCurrency(amount: number, currency: 'USD' | 'silver' | 'gold'): string {
  switch (currency) {
    case 'USD':
      return `$${amount.toFixed(2)}`;
    case 'silver':
      return `${amount} Silver`;
    case 'gold':
      return `${amount} Gold`;
    default:
      return `${amount}`;
  }
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Get payment method display name
 */
export function getPaymentMethodName(method: string): string {
  const names: Record<string, string> = {
    card: 'Credit/Debit Card',
    momo: 'Mobile Money',
    paypal: 'PayPal',
    apple_pay: 'Apple Pay',
    google_pay: 'Google Pay'
  };
  return names[method] || method;
}

/**
 * Validate payment method for region
 */
export function validatePaymentMethod(method: string, country: string): boolean {
  if (method === 'momo') {
    return country === 'Ghana';
  }
  return true; // Other methods available globally
}

/**
 * Get subscription tier from duration
 */
export function getSubscriptionTier(durationDays: number): 'weekly' | 'monthly' | 'season' {
  if (durationDays <= 7) return 'weekly';
  if (durationDays <= 30) return 'monthly';
  return 'season';
}

/**
 * Calculate subscription expiry date
 */
export function calculateExpiryDate(startDate: number, durationDays: number): number {
  return startDate + (durationDays * 24 * 60 * 60 * 1000);
}
