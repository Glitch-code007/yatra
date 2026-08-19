import { TravelPreference } from "./trip"

export interface ItineraryActivity {
  id: string
  timeSlot: string
  title: string
  description: string
  placeId?: string
  placeName?: string
  category?: string
  estimatedCostInr: number
  durationMinutes?: number
  latitude?: number
  longitude?: number
  tips?: string
}

export interface ItineraryDay {
  dayNumber: number
  date: string
  title: string
  activities: ItineraryActivity[]
  accommodationArea?: string
  accommodationBudgetInr?: number
  estimatedDayCostInr: number
  notes?: string
}

export interface Itinerary {
  id: string
  destinationSlug: string
  destinationName: string
  numDays: number
  startDate: string
  numTravelers: number
  travelPreference: TravelPreference
  interests: string[]
  days: ItineraryDay[]
  totalEstimatedCostInr: number
  isCustomized?: boolean
  createdAt: string
  updatedAt: string
}
