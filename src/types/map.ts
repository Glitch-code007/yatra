export type MarkerType = 'DESTINATION' | 'PLACE' | 'FOOD' | 'ACCOMMODATION' | 'SAFETY'

export interface MapMarker {
  id: string
  type: MarkerType
  latitude: number
  longitude: number
  title: string
  subtitle?: string
  color?: string
  icon?: string
}

export interface MapFilter {
  types: MarkerType[]
  radius?: number
  searchQuery?: string
  minRating?: number
  priceRange?: [number, number]
}

export interface MapCategory {
  id: string
  label: string
  type: MarkerType
  icon: string
  color: string
  isActive: boolean
}

export interface PlaceInfoWindow {
  id: string
  type: MarkerType
  title: string
  description: string
  imageUrl?: string
  rating?: number
  priceRange?: string
  actionLabel?: string
  actionUrl?: string
}
