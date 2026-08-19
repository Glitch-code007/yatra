import { z } from 'zod'

export const destinationSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  slug: z.string().min(2).max(100),
  state: z.string().min(2, 'State is required'),
  region: z.enum(['North', 'South', 'East', 'West', 'Central', 'Northeast']),
  description: z.string().nullable().optional(),
  shortDescription: z.string().max(200).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  bestTimeToVisit: z.string().nullable().optional(),
  bestMonths: z.array(z.number().min(1).max(12)),
  altitudeMeters: z.number().nullable().optional(),
  nearestAirport: z.string().nullable().optional(),
  nearestRailway: z.string().nullable().optional(),
  primaryImageUrl: z.string().url().nullable().optional(),
  images: z.array(z.string().url()),
  tags: z.array(z.string()),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  popularityScore: z.number().min(0).max(100).default(0),
})

export type DestinationInput = z.infer<typeof destinationSchema>
