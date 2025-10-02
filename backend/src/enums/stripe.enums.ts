

export enum StripeEventStatus {
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }
  
  export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    CANCELLED = 'CANCELLED',
  }
  
 
  export enum StripeEventType {
    CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed',
    PAYMENT_INTENT_PAYMENT_FAILED = 'payment_intent.payment_failed',
    CUSTOMER_SUBSCRIPTION_CREATED = 'customer.subscription.created',
    CUSTOMER_SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
  }
  

  export const DEFAULT_CURRENCY = 'INR';
  export const DEFAULT_PAYMENT_METHODS = ['card'] as const;
  