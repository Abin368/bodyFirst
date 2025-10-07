import { z } from 'zod'
export const WebhookResponseSchema = z.object({
  message: z.string(),
  received: z.boolean(),
})
