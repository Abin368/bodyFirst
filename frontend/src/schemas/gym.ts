
import z from 'zod'

export const GymSchema = z.object({
    name:z.string().min(2,'Gym name required'),
    contactNo:z.string().min(10,'Invalid Cuntact number'),
    website:z.string().url().optional(),
    address:z.object({
        city:z.string(),
        state:z.string(),
        street:z.string(),
        pincode:z.string()
    }),
    images:z.array(z.string()).optional(),
    services:z.array(z.string()).optional()
})

export type GymFormValues = z.infer<typeof GymSchema>