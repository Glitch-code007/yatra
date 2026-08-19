export type UserRole = 'USER' | 'ADMIN' | 'CONTRIBUTOR'
export type TravelStyle = 'BACKPACKER' | 'LUXURY' | 'FAMILY' | 'COUPLE' | 'SOLO' | 'BUSINESS'

export interface UserPreferences {
  currency: string
  language: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  travelStyle: TravelStyle[]
  dietaryRequirements?: string[]
  accessibilityNeeds?: string[]
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  role: UserRole
  bio?: string
  location?: string
  joinedDate: string
  preferences: UserPreferences
  stats: {
    tripsPlanned: number
    countriesVisited: number
    reviewsPosted: number
  }
}
