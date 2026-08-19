export type ReportStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
export type ReportType = 'INACCURATE_DATA' | 'INAPPROPRIATE_CONTENT' | 'SPAM' | 'SAFETY_ISSUE' | 'OTHER'

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTrips: number
  activeTrips: number
  destinationsCount: number
  reportsPending: number
  revenue?: number
}

export interface UserReport {
  id: string
  reporterId: string
  type: ReportType
  entityType: 'DESTINATION' | 'REVIEW' | 'USER' | 'ITINERARY'
  entityId: string
  title: string
  description: string
  status: ReportStatus
  adminNotes?: string
  suggestedCorrection?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolvedBy?: string
}
