import { Document } from 'mongoose'
export interface IStripeEventLog extends Document {
  eventId: string
  type: string
  processedAt: Date
}
