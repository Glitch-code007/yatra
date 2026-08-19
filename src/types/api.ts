export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  meta?: {
    timestamp: string
    requestId: string
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta?: ApiResponse<T>['meta'] & {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchParams {
  query?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, string | string[]>
}
