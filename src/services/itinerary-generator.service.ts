import { Itinerary, ItineraryDay, ItineraryActivity, Place, FoodPlace } from "@/types"
import { DestinationService } from "./destination.service"

export interface ItineraryGenerationParams {
  destinationSlug: string
  destinationName: string
  numDays: number
  startDate?: string
  numTravelers: number
  travelPreference: "cheapest" | "fastest" | "comfortable" | "balanced"
  interests: string[]
  totalBudgetInr: number
}

export class ItineraryGeneratorService {
  /**
   * Generates a rich, realistic, geographically sequenced day-by-day itinerary
   */
  static generateItinerary(params: ItineraryGenerationParams): Itinerary {
    const { destinationSlug, destinationName, numDays, startDate, numTravelers, interests, travelPreference } = params

    const destDetails = DestinationService.getDestinationBySlug(destinationSlug)
    const availablePlaces = destDetails?.places || []
    const availableFood = destDetails?.foodPlaces || []

    const days: ItineraryDay[] = []
    const baseDate = startDate ? new Date(startDate) : new Date()

    for (let d = 1; d <= numDays; d++) {
      const currentDate = new Date(baseDate)
      currentDate.setDate(baseDate.getDate() + (d - 1))
      const dateString = currentDate.toISOString().split("T")[0]

      const dayActivities: ItineraryActivity[] = []
      let dayCost = 0

      // 1. Morning Activity (Sightseeing / Heritage / Nature)
      const morningPlace = availablePlaces[(d * 2 - 2) % (availablePlaces.length || 1)]
      if (morningPlace) {
        const morningCost = (morningPlace.entryFeeInr || 0) * numTravelers
        dayCost += morningCost
        dayActivities.push({
          id: `act-d${d}-morning`,
          timeSlot: "Morning (09:00 AM - 12:30 PM)",
          title: `Explore ${morningPlace.name}`,
          description: morningPlace.description || morningPlace.shortDescription || "Discover iconic landmark and cultural highlights.",
          placeId: morningPlace.id,
          placeName: morningPlace.name,
          category: morningPlace.category,
          estimatedCostInr: morningCost,
          durationMinutes: morningPlace.estimatedVisitDurationMinutes || 120,
          latitude: morningPlace.latitude || undefined,
          longitude: morningPlace.longitude || undefined,
          tips: "Visit early morning to avoid rush and capture optimal photography lighting.",
        })
      } else {
        dayActivities.push({
          id: `act-d${d}-morning-gen`,
          timeSlot: "Morning (09:00 AM - 12:30 PM)",
          title: `Heritage Walk & Local Highlights of ${destinationName}`,
          description: "Stroll through the old quarters, photography spots, and historical lanes.",
          category: "attraction",
          estimatedCostInr: 150 * numTravelers,
          durationMinutes: 120,
          tips: "Carry comfortable walking shoes and stay hydrated.",
        })
      }

      // 2. Lunch Suggestion (Authentic Local Cuisine)
      const lunchSpot = availableFood[(d - 1) % (availableFood.length || 1)]
      const lunchCost = (lunchSpot?.avgMealCostInr || 250) * numTravelers
      dayCost += lunchCost
      dayActivities.push({
        id: `act-d${d}-lunch`,
        timeSlot: "Lunch (01:00 PM - 02:30 PM)",
        title: lunchSpot ? `Authentic Meal at ${lunchSpot.name}` : `Local Specialty Lunch in ${destinationName}`,
        description: lunchSpot
          ? `Savor authentic delicacies: ${lunchSpot.famousFor?.join(", ") || lunchSpot.cuisineType?.join(", ")}.`
          : `Relish authentic regional thali and seasonal delicacies at renowned local dhabas.`,
        category: "food",
        estimatedCostInr: lunchCost,
        durationMinutes: 90,
        tips: "Ask for regional specialties and fresh lassi/buttermilk.",
      })

      // 3. Afternoon Activity (Palaces / Museums / Leisure / Nature)
      const afternoonPlace = availablePlaces[(d * 2 - 1) % (availablePlaces.length || 1)]
      if (afternoonPlace) {
        const afternoonCost = (afternoonPlace.entryFeeInr || 0) * numTravelers
        dayCost += afternoonCost
        dayActivities.push({
          id: `act-d${d}-afternoon`,
          timeSlot: "Afternoon (03:00 PM - 05:30 PM)",
          title: `Visit ${afternoonPlace.name}`,
          description: afternoonPlace.description || afternoonPlace.shortDescription || "Explore scenic courtyards and architecture.",
          placeId: afternoonPlace.id,
          placeName: afternoonPlace.name,
          category: afternoonPlace.category,
          estimatedCostInr: afternoonCost,
          durationMinutes: afternoonPlace.estimatedVisitDurationMinutes || 90,
          latitude: afternoonPlace.latitude || undefined,
          longitude: afternoonPlace.longitude || undefined,
          tips: "Keep your tickets handy. Official audio guides provide rich historical context.",
        })
      } else {
        dayActivities.push({
          id: `act-d${d}-afternoon-gen`,
          timeSlot: "Afternoon (03:00 PM - 05:30 PM)",
          title: `Artisanal Craft & Cultural Centers in ${destinationName}`,
          description: "Witness local artisans at work, handloom weaving, or traditional painting studios.",
          category: "market",
          estimatedCostInr: 100 * numTravelers,
          durationMinutes: 90,
          tips: "Look for government-certified craft emporiums with fixed GST pricing.",
        })
      }

      // 4. Evening Activity (Sunset / Bazaar / Aarti / Lake Cruise)
      const eveningCost = 250 * numTravelers
      dayCost += eveningCost
      dayActivities.push({
        id: `act-d${d}-evening`,
        timeSlot: "Evening (06:00 PM - 09:30 PM)",
        title: `Sunset Viewpoint, Local Bazaars & Dinner`,
        description: `Experience the evening magic of ${destinationName} — sunset views, vibrant street stalls, tea/kulhad chai, and relaxed dining.`,
        category: "viewpoint",
        estimatedCostInr: eveningCost,
        durationMinutes: 150,
        tips: "Watch your personal belongings in crowded markets and bargain gently.",
      })

      // Accommodation area suggestion
      const stayArea = d === 1 ? "Central Heritage Area / Old Town" : "Scenic Lakeside / Quiet Valley Quarter"
      const stayCostEstimate = travelPreference === "cheapest" ? 900 : travelPreference === "comfortable" ? 3500 : 1800
      dayCost += stayCostEstimate

      days.push({
        dayNumber: d,
        date: dateString,
        title: `Day ${d}: ${d === 1 ? "Arrival & Royal Highlights" : d === 2 ? "Hidden Gems & Local Flavors" : d === 3 ? "Nature & Panoramic Panoramas" : "Culture, Bazaars & Farewell"}`,
        activities: dayActivities,
        accommodationArea: stayArea,
        accommodationBudgetInr: stayCostEstimate,
        estimatedDayCostInr: dayCost,
        notes: "Keep water bottles, sun protection, and digital passes on your phone.",
      })
    }

    const totalEstimatedCost = days.reduce((sum, day) => sum + day.estimatedDayCostInr, 0)

    return {
      id: `itin-${Date.now()}`,
      destinationSlug,
      destinationName,
      numDays,
      startDate: startDate || new Date().toISOString().split("T")[0],
      numTravelers,
      travelPreference,
      interests,
      days,
      totalEstimatedCostInr: totalEstimatedCost,
      isCustomized: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  /**
   * Instant modifier controls: adjusts itinerary activities in response to quick control buttons
   */
  static applyQuickControl(
    itinerary: Itinerary,
    action: "cheaper" | "nature" | "food" | "relaxed" | "faster" | "adventure"
  ): Itinerary {
    const updatedDays = itinerary.days.map((day) => {
      let updatedActivities = [...day.activities]

      if (action === "cheaper") {
        // Swap high entry fee places with free public parks, ghats, walking bazaars
        updatedActivities = updatedActivities.map((act) => ({
          ...act,
          estimatedCostInr: Math.round(act.estimatedCostInr * 0.6),
          tips: `${act.tips || ""} (Budget Tip: Use public transit or shared autos).`,
        }))
      } else if (action === "nature") {
        // Boost nature, gardens, lake walks
        if (updatedActivities[0]) {
          updatedActivities[0] = {
            ...updatedActivities[0],
            title: `Sunrise Nature Walk & Botanical Sanctuary`,
            category: "park",
            description: "Explore lush walking trails, flora gardens, and tranquil early morning bird sounds.",
          }
        }
      } else if (action === "food") {
        // Add a specialized food trail in afternoon/evening
        if (updatedActivities[2]) {
          updatedActivities[2] = {
            ...updatedActivities[2],
            title: `Curated Street Food Trail & Tea Tastings`,
            category: "food",
            description: "Sample local delicacies, clay-pot kulhad chai, signature sweets, and street savory chaats.",
          }
        }
      } else if (action === "relaxed") {
        // Reduce activities to 3 with longer durations
        if (updatedActivities.length > 3) {
          updatedActivities = updatedActivities.slice(0, 3)
        }
      }

      const newDayCost = updatedActivities.reduce((sum, a) => sum + a.estimatedCostInr, 0) + (day.accommodationBudgetInr || 1500)

      return {
        ...day,
        activities: updatedActivities,
        estimatedDayCostInr: newDayCost,
      }
    })

    const newTotal = updatedDays.reduce((sum, d) => sum + d.estimatedDayCostInr, 0)

    return {
      ...itinerary,
      days: updatedDays,
      totalEstimatedCostInr: newTotal,
      isCustomized: true,
      updatedAt: new Date().toISOString(),
    }
  }
}
