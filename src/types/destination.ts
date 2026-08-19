export interface Destination {
  id: string
  name: string
  slug: string
  district: string
  state: string
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast"
  description: string | null
  shortDescription: string | null
  latitude: number | null
  longitude: number | null
  bestTimeToVisit: string | null
  bestMonths: number[]
  altitudeMeters: number | null
  nearestAirport: string | null
  nearestRailway: string | null
  primaryImageUrl: string | null
  images: string[]
  tags: string[]
  isFeatured: boolean
  isPublished: boolean
  popularityScore: number
  createdAt: string
  updatedAt: string
}

export interface Place {
  id: string
  destinationId: string
  name: string
  slug: string
  category: string
  description?: string
  shortDescription?: string
  latitude?: number
  longitude?: number
  address?: string
  district?: string
  locationArea?: string
  openingHours?: any
  entryFeeInr?: number
  entryFeeForeignInr?: number
  estimatedVisitDurationMinutes?: number
  primaryImageUrl?: string
  images?: string[]
  tags: string[]
  rating?: number
  dataSource?: string
  lastVerifiedAt?: string
  isPublished?: boolean
}

export interface FoodPlace {
  id: string
  destinationId: string
  name: string
  category?: string
  cuisineType: string[]
  description?: string
  famousFor?: string[]
  priceRange?: string
  avgMealCostInr?: number
  latitude?: number
  longitude?: number
  address?: string
  openingHours?: any
  primaryImageUrl?: string
  images?: string[]
  rating?: number
  dataSource?: string
  lastVerifiedAt?: string
  isPublished?: boolean
}

export interface Accommodation {
  id: string
  destinationId: string
  name: string
  category: string
  tier: "budget" | "mid-range" | "premium" | "luxury"
  description: string
  priceRangeMinInr: number
  priceRangeMaxInr: number
  latitude?: number
  longitude?: number
  address?: string
  amenities: string[]
  primaryImageUrl?: string
  images?: string[]
  rating?: number
  dataSource?: string
  lastVerifiedAt?: string
  isPublished?: boolean
}

export interface PriceGuide {
  id: string
  destinationId: string
  itemName: string
  category: string
  priceMinInr: number
  priceMaxInr: number
  unit: string
  description: string
  tips?: string
  dataSource?: string
  lastVerifiedAt?: string
  verificationStatus: "verified" | "unverified" | "user_reported" | "outdated"
}

export interface SafetyAlert {
  id: string
  destinationId: string | null
  title: string
  category: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  howToAvoid: string
  dataSource?: string
  lastVerifiedAt?: string
  verificationStatus: "verified" | "unverified" | "user_reported" | "outdated"
  isActive: boolean
}

export interface DestinationWithDetails extends Destination {
  places: Place[]
  foodPlaces: FoodPlace[]
  accommodations: Accommodation[]
  priceGuides: PriceGuide[]
  safetyAlerts: SafetyAlert[]
}
