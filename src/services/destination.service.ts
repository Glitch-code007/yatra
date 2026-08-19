import { INDIAN_DESTINATIONS } from "@/data/destinations"
import { PLACES_DATA, FOOD_DATA, ACCOMMODATION_DATA, PRICE_GUIDE_DATA, SAFETY_ALERTS_DATA } from "@/data/destination-details"
import { Destination, DestinationWithDetails } from "@/types"

export class DestinationService {
  /**
   * Get all published destinations
   */
  static getAllDestinations(region?: string, tag?: string): Destination[] {
    let list = INDIAN_DESTINATIONS.filter((d) => d.isPublished)
    if (region && region !== "all") {
      list = list.filter((d) => d.region.toLowerCase() === region.toLowerCase())
    }
    if (tag && tag !== "all") {
      list = list.filter((d) => d.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
    }
    return list
  }

  /**
   * Get featured destinations for landing hero/cards
   */
  static getFeaturedDestinations(): Destination[] {
    return INDIAN_DESTINATIONS.filter((d) => d.isFeatured && d.isPublished)
  }

  /**
   * Get destination by URL slug with all joined relational data
   */
  static getDestinationBySlug(slug: string): DestinationWithDetails | null {
    const dest = INDIAN_DESTINATIONS.find((d) => d.slug.toLowerCase() === slug.toLowerCase())
    if (!dest) return null

    const places = PLACES_DATA[slug] || []
    const foodPlaces = FOOD_DATA[slug] || []
    const accommodations = ACCOMMODATION_DATA[slug] || []
    const priceGuides = PRICE_GUIDE_DATA[slug] || []
    const safetyAlerts = SAFETY_ALERTS_DATA[slug] || []

    return {
      ...dest,
      places,
      foodPlaces,
      accommodations,
      priceGuides,
      safetyAlerts,
    }
  }

  /**
   * Global search query across destinations, districts, states, places, and tags
   */
  static searchDestinations(query: string): Destination[] {
    if (!query || query.trim() === "") return INDIAN_DESTINATIONS

    const cleanQuery = query.toLowerCase().trim()
    return INDIAN_DESTINATIONS.filter((d) => {
      const matchName = d.name.toLowerCase().includes(cleanQuery)
      const matchDistrict = d.district?.toLowerCase().includes(cleanQuery)
      const matchState = d.state.toLowerCase().includes(cleanQuery)
      const matchTags = d.tags.some((t) => t.toLowerCase().includes(cleanQuery))
      const matchDesc = d.description?.toLowerCase().includes(cleanQuery)
      return matchName || matchDistrict || matchState || matchTags || matchDesc
    })
  }

  /**
   * Autocomplete suggestions for search input
   */
  static getAutocompleteSuggestions(query: string): { label: string; subtext: string; slug: string; type: "city" | "state" | "tag" }[] {
    if (!query || query.length < 2) return []
    const q = query.toLowerCase()

    const results: { label: string; subtext: string; slug: string; type: "city" | "state" | "tag" }[] = []

    INDIAN_DESTINATIONS.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.district?.toLowerCase().includes(q)) {
        results.push({
          label: d.name,
          subtext: `${d.district} • ${d.state}`,
          slug: d.slug,
          type: "city",
        })
      } else if (d.state.toLowerCase().includes(q)) {
        results.push({
          label: `${d.state} — ${d.name}`,
          subtext: `${d.district} (${d.region} India)`,
          slug: d.slug,
          type: "state",
        })
      }
    })

    return results.slice(0, 6)
  }
}
