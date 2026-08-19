export interface AIMessage {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: string
  citations?: string[]
}

export interface AIContext {
  tripId?: string
  destinationId?: string
  userPreferences?: any
  currentLocation?: {
    lat: number
    lng: number
  }
}

export interface AIConversation {
  id: string
  userId: string
  title: string
  messages: AIMessage[]
  context: AIContext
  createdAt: string
  updatedAt: string
}

export interface AIResponse {
  message: AIMessage
  suggestedActions?: {
    label: string
    action: string
    payload?: any
  }[]
  relevantDestinations?: string[]
}
