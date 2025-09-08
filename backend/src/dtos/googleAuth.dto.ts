import {z} from 'zod'

export const GoogleAuthCallbackSchema = z.object({
    code: z.string()
})