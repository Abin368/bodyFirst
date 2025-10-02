
import Stripe from 'stripe'
export interface IStripeWebhookService{
    handleWebhook(body: Buffer, signature: string): Promise<void>
    // handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void>
    //  handlePaymentFailed(event: Stripe.Event): Promise<void>
}