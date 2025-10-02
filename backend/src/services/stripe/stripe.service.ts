import { injectable, inject } from "inversify";
import { IStripeService } from "../../interfaces/services/IStripeServices";
import Stripe from 'stripe';
import TYPES from "../../di/types";
import { AppError } from "../../errors/app.error";
import { HttpStatus } from "../../enums/http.status";
import { MESSAGES } from '../../enums/message.constant';
import logger from "../../utils/logger";

@injectable()
export default class StripeServices implements IStripeService {
    constructor(@inject(TYPES.StripeClient) private readonly stripe: Stripe) {}

    async createCheckoutSession(priceId: string, ownerId: string): Promise<string> {
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [{ price: priceId, quantity: 1 }],
                metadata: { ownerId },
                success_url: `${process.env.FRONTEND_URL}/payment/success`,
                cancel_url: `${process.env.FRONTEND_URL}/owner/dashboard`,
            });

            if (!session.url) {
                throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OWNER.CHECKOUT_FAILED);
            }

            return session.url;
        } catch (err) {
            logger.warn('checkout error occured',err)
            throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.OWNER.CHECKOUT_FAILED);
        }
    }
}
