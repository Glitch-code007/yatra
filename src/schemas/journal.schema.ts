import { z } from 'zod'

export const expenseEntrySchema = z.object({
  amount: z.number().positive('Amount must be greater than zero'),
  currency: z.string().length(3),
  category: z.enum(['TRANSPORT', 'ACCOMMODATION', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'MISC']),
  paymentMethod: z.string().optional(),
  receiptUrl: z.string().url('Must be a valid URL').optional(),
})

export const createJournalEntrySchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  entryType: z.enum(['NOTE', 'EXPENSE', 'MEMORY', 'REVIEW']),
  date: z.string().datetime(),
  location: z.object({
    name: z.string(),
    lat: z.number(),
    lng: z.number()
  }).optional(),
  photos: z.array(z.string().url('Must be a valid image URL')).max(10, 'Maximum 10 photos allowed').optional(),
  expense: expenseEntrySchema.optional(),
  placeId: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).max(5).optional(),
})

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>
export type ExpenseEntryInput = z.infer<typeof expenseEntrySchema>
