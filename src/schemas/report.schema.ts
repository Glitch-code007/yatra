import { z } from 'zod'

export const createReportSchema = z.object({
  reportType: z.enum(['INACCURATE_DATA', 'INAPPROPRIATE_CONTENT', 'SPAM', 'SAFETY_ISSUE', 'OTHER']),
  entityType: z.enum(['DESTINATION', 'REVIEW', 'USER', 'ITINERARY', 'PLACE']),
  entityId: z.string().min(1, 'Entity ID is required'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Please provide more details').max(1000),
  suggestedCorrection: z.string().max(500).optional(),
})

export type CreateReportInput = z.infer<typeof createReportSchema>
