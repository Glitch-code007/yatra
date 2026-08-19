export type SafetySeverity = "low" | "medium" | "high" | "critical"
export type VerificationStatus = "verified" | "unverified" | "user_reported" | "outdated"

// SafetyAlert is exported from destination.ts to avoid duplicate exports
// Re-export helpers and additional safety-specific types here

export interface ScamReport {
  id: string
  destinationId: string
  title: string
  description: string
  howToAvoid: string
  severity: SafetySeverity
  reportedBy?: string
  reportedAt: string
  verificationStatus: VerificationStatus
}
