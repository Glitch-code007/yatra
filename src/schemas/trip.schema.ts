import { z } from 'zod'

const tripBaseSchema = z.object({
  name: z.string().min(3, 'Trip name must be at least 3 characters').max(100),
  originId: z.string().optional(),
  destinationId: z.string().min(1, 'Destination is required'),
  startDate: z.string().datetime({ message: 'Valid start date is required' }),
  endDate: z.string().datetime({ message: 'Valid end date is required' }),
  travelers: z.number().int().min(1, 'At least 1 traveler is required').max(50),
  budgetLimit: z.number().positive('Budget must be positive').optional(),
  preferences: z.object({
    travelStyle: z.array(z.string()).optional(),
    accommodationType: z.array(z.string()).optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
    mobilityRequirements: z.array(z.string()).optional(),
    paceOfTravel: z.enum(['RELAXED', 'MODERATE', 'FAST']).optional(),
  }).optional(),
  interests: z.array(z.string()).optional(),
})

export const createTripSchema = tripBaseSchema.refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'End date must be after or equal to start date',
  path: ['endDate']
})

export const updateTripSchema = tripBaseSchema.partial()

export const tripFiltersSchema = z.object({
  status: z.enum(['planning', 'planned', 'ongoing', 'completed', 'cancelled']).optional(),
  destinationId: z.string().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
})

export type CreateTripInput = z.infer<typeof createTripSchema>
export type UpdateTripInput = z.infer<typeof updateTripSchema>
export type TripFiltersInput = z.infer<typeof tripFiltersSchema>
