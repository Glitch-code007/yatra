export interface BudgetCategoryItem {
  name: string
  key: string
  allocatedAmount: number
  percentageOfTotal: number
  dailyPerPersonEstimate: number
  description: string
  color: string
}

export interface BudgetBreakdown {
  totalBudget: number
  estimatedTotal: number
  remainingBudget: number
  overBudgetAmount: number
  isOverBudget: boolean
  categories: BudgetCategoryItem[]
}

export interface BudgetSummaryCategory {
  categoryName: string
  categoryKey: string
  plannedAmount: number
  actualAmount: number
  variance: number
  isOverBudget: boolean
  percentageUsed: number
}

export interface BudgetSummary {
  totalBudget: number
  totalPlannedCost: number
  totalActualSpent: number
  netDifference: number
  isUnderBudget: boolean
  categories: BudgetSummaryCategory[]
}
