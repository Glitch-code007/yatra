import { z } from 'zod'

export const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  location: z.string().max(100).optional(),
  travelStyle: z.array(z.enum(['BACKPACKER', 'LUXURY', 'FAMILY', 'COUPLE', 'SOLO', 'BUSINESS'])).optional(),
  interests: z.array(z.string()).optional(),
  preferredTransport: z.array(z.enum(['FLIGHT', 'TRAIN', 'BUS', 'CAR', 'BIKE'])).optional(),
  budgetPreference: z.enum(['BUDGET', 'MID_RANGE', 'LUXURY']).optional(),
  dietaryRequirements: z.array(z.string()).optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
