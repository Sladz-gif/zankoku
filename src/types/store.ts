// Store and monetization type definitions

export type PurchaseType = 'resource' | 'subscription' | 'content' | 'currency';
export type SubscriptionTier = 'weekly' | 'monthly' | 'season';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type PaymentMethod = 'card' | 'momo' | 'paypal' | 'apple_pay' | 'google_pay';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Purchase {
  id: string;
  userId: number;
  type: PurchaseType;
  itemId: string;
  itemName: string;
  price: number; // USD
  silverAmount: number;
  goldAmount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  timestamp: number;
  transactionId?: string;
}

export interface Subscription {
  id: string;
  userId: number;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: number;
  expiryDate: number;
  autoRenew: boolean;
  price: number;
  goldCost: number;
}

export interface UserWallet {
  userId: number;
  silver: number;
  gold: number;
  bronze: number;
}

export interface PurchaseHistory {
  userId: number;
  purchases: Purchase[];
  totalSpent: number;
  lastPurchase: number;
}

export interface ContentOwnership {
  userId: number;
  ownedContent: {
    contentId: number;
    contentType: 'manga' | 'comic' | 'art';
    purchaseDate: number;
    price: number;
  }[];
}

export interface ResourcePackage {
  id: number;
  name: string;
  amount: number;
  silver: number;
  gold: number;
  price: number; // USD
  valuePerDollar?: number;
  isBestValue?: boolean;
}

export interface UnlimitedPackage {
  id: number;
  name: string;
  tier: SubscriptionTier;
  duration: string;
  durationDays: number;
  gold: number;
  price: number; // USD
  benefits: string[];
}

export interface ContentPackage {
  id: number;
  creator: string;
  creatorId: number;
  type: 'manga' | 'comic' | 'art';
  title: string;
  price: number;
  currency: 'silver' | 'gold';
  rating: number;
  previewAvailable: boolean;
}

export interface PurchaseConfirmation {
  itemName: string;
  itemType: PurchaseType;
  price: number;
  silverAmount: number;
  goldAmount: number;
  benefits: string[];
  duration?: string;
}

export interface SubscriptionBenefits {
  unlimitedResources: boolean;
  allTechniquesUnlocked: boolean;
  regenerationMultiplier: number;
  resourceCostOverride: number; // 0 for unlimited
  exclusiveContent: boolean;
}

export interface StoreAnalytics {
  conversionRate: number;
  topSellingItems: { itemId: string; sales: number }[];
  revenueByCategory: {
    resources: number;
    subscriptions: number;
    content: number;
  };
  averageOrderValue: number;
  dropOffPoints: {
    viewedStore: number;
    clickedBuy: number;
    reachedCheckout: number;
    completedPurchase: number;
  };
}

export interface FraudDetection {
  userId: number;
  rapidPurchases: number;
  lastPurchaseTime: number;
  flagged: boolean;
  reason?: string;
}

export interface RefundPolicy {
  eligible: boolean;
  reason: string;
  daysRemaining: number;
}
