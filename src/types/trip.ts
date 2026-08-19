export type TripStatus = "planning" | "planned" | "ongoing" | "completed" | "cancelled"
export type TravelMode = "train" | "flight" | "bus" | "cab" | "bike" | "other"
export type TravelPreference = "cheapest" | "fastest" | "comfortable" | "balanced"

export interface TravelOption {
  mode: TravelMode
  name: string
  estimatedCostMinInr: number
  estimatedCostMaxInr: number
  estimatedDurationHours: number
  distanceKm: number
  comfortRating: number
  reliabilityRating: number
  frequency: string
  pros: string[]
  cons: string[]
  isRecommended: boolean
  bookingAdvice: string
}

export interface TripActivity {
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

export interface TripDay {
  id?: string
  tripId?: string
  dayNumber: number
  date?: string
  title: string
  activities: TripActivity[]
  accommodationArea?: string
  accommodationBudgetInr?: number
  estimatedDayCostInr: number
  notes?: string
}

export interface TripJournalEntry {
  id: string
  tripId: string
  dayNumber?: number
  entryType: "expense" | "place_visited" | "photo" | "note" | "highlight" | "route"
  expenseCategory?: string
  expenseAmountInr?: number
  expenseDescription?: string
  placeName?: string
  latitude?: number
  longitude?: number
  content?: string
  photoUrls?: string[]
  mood?: "amazing" | "good" | "neutral" | "bad" | "terrible"
  recordedAt?: string
  createdAt: string
  updatedAt?: string
}

export interface Trip {
  id: string
  userId?: string
  destinationId?: string
  title: string
  status: TripStatus
  originName?: string
  originLat?: number
  originLng?: number
  destinationName?: string
  destinationLat?: number
  destinationLng?: number
  startDate?: string
  endDate?: string
  numDays?: number
  numTravelers?: number
  totalBudgetInr?: number
  estimatedCostInr?: number
  actualCostInr?: number
  travelPreference?: TravelPreference
  interests?: string[]
  selectedTravelMode?: string
  itinerary?: any
  travelOptions?: TravelOption[]
  budgetBreakdown?: any
  isFavorite?: boolean
  createdAt: string
  updatedAt: string
}
