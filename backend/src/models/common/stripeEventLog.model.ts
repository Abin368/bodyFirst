import { Schema, model } from 'mongoose'
import { IStripeEventLog } from '../../interfaces/models/common/IStripeEventLog'

const StripeEventLogSchema = new Schema<IStripeEventLog>(
  {
    eventId: { type: String, unique: true, required: true },
    type: { type: String, required: true },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default model<IStripeEventLog>('StripeEventLog', StripeEventLogSchema)
