export interface IStripeService {
  createCheckoutSession(priceId: string, ownerId: string): Promise<string>
}
