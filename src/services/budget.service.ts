import { BudgetBreakdown, BudgetSummary } from "@/types"

export interface BudgetCalculationParams {
  totalBudgetInr: number
  numDays: number
  numTravelers: number
  travelPreference: "cheapest" | "fastest" | "comfortable" | "balanced"
  travelModeCostInr: number
}

export class BudgetService {
  /**
   * Generates a recommended category-wise budget breakdown based on duration, traveler count, and preference
   */
  static calculateTripBudget(params: BudgetCalculationParams): BudgetBreakdown {
    const { totalBudgetInr, numDays, numTravelers, travelPreference, travelModeCostInr } = params

    // 1. Inter-city Transport Cost (Round trip = x2)
    const transportTotal = Math.round(travelModeCostInr * 2)

    // 2. Remaining Budget for On-Ground Expenses
    const onGroundBudget = Math.max(0, totalBudgetInr - transportTotal)

    // 3. Category distribution weights depending on traveler style
    let stayWeight = 0.35
    let foodWeight = 0.25
    let activitiesWeight = 0.2
    let localTransportWeight = 0.12
    let bufferWeight = 0.08

    if (travelPreference === "cheapest") {
      stayWeight = 0.28
      foodWeight = 0.26
      activitiesWeight = 0.22
      localTransportWeight = 0.14
      bufferWeight = 0.1
    } else if (travelPreference === "comfortable") {
      stayWeight = 0.42
      foodWeight = 0.24
      activitiesWeight = 0.18
      localTransportWeight = 0.1
      bufferWeight = 0.06
    }

    const accommodationTotal = Math.round(onGroundBudget * stayWeight)
    const foodTotal = Math.round(onGroundBudget * foodWeight)
    const activitiesTotal = Math.round(onGroundBudget * activitiesWeight)
    const localTransportTotal = Math.round(onGroundBudget * localTransportWeight)
    const miscBufferTotal = Math.round(onGroundBudget * bufferWeight)

    const estimatedTotal =
      transportTotal + accommodationTotal + foodTotal + activitiesTotal + localTransportTotal + miscBufferTotal

    const remainingBudget = totalBudgetInr - estimatedTotal

    return {
      totalBudget: totalBudgetInr,
      estimatedTotal,
      remainingBudget: Math.max(0, remainingBudget),
      overBudgetAmount: remainingBudget < 0 ? Math.abs(remainingBudget) : 0,
      isOverBudget: remainingBudget < 0,
      categories: [
        {
          name: "Inter-city Transport",
          key: "transport",
          allocatedAmount: transportTotal,
          percentageOfTotal: Math.round((transportTotal / totalBudgetInr) * 100),
          dailyPerPersonEstimate: Math.round(transportTotal / (numDays * numTravelers)),
          description: "Round-trip flights/train/bus tickets for all travelers",
          color: "#0d9488", // teal-600
        },
        {
          name: "Stay & Accommodation",
          key: "accommodation",
          allocatedAmount: accommodationTotal,
          percentageOfTotal: Math.round((accommodationTotal / totalBudgetInr) * 100),
          dailyPerPersonEstimate: Math.round(accommodationTotal / (numDays * numTravelers)),
          description: `Hotel/Resort rooms for ${numDays} nights`,
          color: "#f59e0b", // amber-500
        },
        {
          name: "Food & Dining",
          key: "food",
          allocatedAmount: foodTotal,
          percentageOfTotal: Math.round((foodTotal / totalBudgetInr) * 100),
          dailyPerPersonEstimate: Math.round(foodTotal / (numDays * numTravelers)),
          description: "Breakfast, local cuisine lunches, dinners, street food & snacks",
          color: "#ef4444", // red-500
        },
        {
          name: "Sightseeing & Activities",
          key: "activities",
          allocatedAmount: activitiesTotal,
          percentageOfTotal: Math.round((activitiesTotal / totalBudgetInr) * 100),
          dailyPerPersonEstimate: Math.round(activitiesTotal / (numDays * numTravelers)),
          description: "Fort/monument entry fees, boat rides, guide services, adventure tickets",
          color: "#8b5cf6", // purple-500
        },
        {
          name: "Local Transit & Auto",
          key: "local_transport",
          allocatedAmount: localTransportTotal,
          percentageOfTotal: Math.round((localTransportTotal / totalBudgetInr) * 100),
          dailyPerPersonEstimate: Math.round(localTransportTotal / (numDays * numTravelers)),
          description: "Daily auto rickshaws, metro, scooty rental, fuel & parking",
          color: "#3b82f6", // blue-500
        },
        {
          name: "Contingency / Emergency Buffer",
          key: "buffer",
          allocatedAmount: miscBufferTotal,
          percentageOfTotal: Math.round((miscBufferTotal / totalBudgetInr) * 100),
          dailyPerPersonEstimate: Math.round(miscBufferTotal / (numDays * numTravelers)),
          description: "Souvenirs, shopping, medicines, and unexpected emergency buffer",
          color: "#10b981", // emerald-500
        },
      ],
    }
  }

  /**
   * Formats chart data for Recharts Pie and Bar charts
   */
  static getRechartsData(breakdown: BudgetBreakdown) {
    return breakdown.categories.map((c) => ({
      name: c.name,
      value: c.allocatedAmount,
      percentage: c.percentageOfTotal,
      color: c.color,
      daily: c.dailyPerPersonEstimate,
    }))
  }

  /**
   * Compares Planned budget against Actual expenses recorded in Trip Journal
   */
  static comparePlanVsActual(
    planned: BudgetBreakdown,
    actualExpenses: { category: string; amountInr: number }[]
  ): BudgetSummary {
    const actualTotalsByCategory: Record<string, number> = {}
    let totalActualSpent = 0

    actualExpenses.forEach((exp) => {
      const catKey = exp.category.toLowerCase()
      actualTotalsByCategory[catKey] = (actualTotalsByCategory[catKey] || 0) + exp.amountInr
      totalActualSpent += exp.amountInr
    })

    const comparisonItems = planned.categories.map((cat) => {
      const actualAmount = actualTotalsByCategory[cat.key] || 0
      const variance = cat.allocatedAmount - actualAmount
      return {
        categoryName: cat.name,
        categoryKey: cat.key,
        plannedAmount: cat.allocatedAmount,
        actualAmount,
        variance,
        isOverBudget: variance < 0,
        percentageUsed: cat.allocatedAmount > 0 ? Math.round((actualAmount / cat.allocatedAmount) * 100) : 0,
      }
    })

    return {
      totalBudget: planned.totalBudget,
      totalPlannedCost: planned.estimatedTotal,
      totalActualSpent,
      netDifference: planned.totalBudget - totalActualSpent,
      isUnderBudget: totalActualSpent <= planned.totalBudget,
      categories: comparisonItems,
    }
  }
}
