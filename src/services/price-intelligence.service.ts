import { PriceGuide } from "@/types"
import { PRICE_GUIDE_DATA } from "@/data/destination-details"

export interface PriceCheckResult {
  itemName: string
  reportedPriceInr: number
  benchmarkMinInr: number
  benchmarkMaxInr: number
  status: "fair" | "slightly_high" | "overpriced_scam" | "great_deal"
  advice: string
  source: string
  lastVerified: string
}

export class PriceIntelligenceService {
  /**
   * Get all price benchmarks for a given destination
   */
  static getPriceGuidesByDestination(destinationSlug: string): PriceGuide[] {
    return PRICE_GUIDE_DATA[destinationSlug] || [
      {
        id: "gen-auto",
        destinationId: destinationSlug,
        itemName: "Local Auto Rickshaw (Per KM)",
        category: "transport",
        priceMinInr: 15,
        priceMaxInr: 25,
        unit: "per km",
        description: "Standard daytime auto fare in tier 1 & tier 2 Indian cities.",
        tips: "Ask driver to turn on meter or check Ola/Uber Auto rate as benchmark.",
        dataSource: "State Transport Authority Guidelines",
        lastVerifiedAt: "2026-01-15",
        verificationStatus: "verified",
      },
      {
        id: "gen-thali",
        destinationId: destinationSlug,
        itemName: "Standard Vegetarian Thali",
        category: "food",
        priceMinInr: 120,
        priceMaxInr: 300,
        unit: "per plate",
        description: "Complete meal with 2 sabzis, dal, rice, roti, pickle, and papad.",
        tips: "Pure-veg dhabas around bus/train hubs offer fresh thalis at low rates.",
        dataSource: "Field Survey Benchmarks",
        lastVerifiedAt: "2026-01-20",
        verificationStatus: "verified",
      },
      {
        id: "gen-water",
        destinationId: destinationSlug,
        itemName: "Packaged Mineral Water (1 Litre)",
        category: "food",
        priceMinInr: 20,
        priceMaxInr: 20,
        unit: "per bottle",
        description: "Government regulated Maximum Retail Price (MRP).",
        tips: "Never pay more than ₹20 MRP printed on bottle. Check seal integrity.",
        dataSource: "Legal Metrology Dept (Govt of India)",
        lastVerifiedAt: "2026-01-01",
        verificationStatus: "verified",
      },
    ]
  }

  /**
   * "Is This Price Fair?" — Real-time price assessment engine
   */
  static evaluatePrice(
    destinationSlug: string,
    category: string,
    quotedPriceInr: number,
    quantity = 1
  ): PriceCheckResult {
    const guides = this.getPriceGuidesByDestination(destinationSlug)
    const matchingGuide = guides.find((g) => g.category.toLowerCase() === category.toLowerCase()) || guides[0]

    const expectedMin = matchingGuide.priceMinInr * quantity
    const expectedMax = matchingGuide.priceMaxInr * quantity

    let status: PriceCheckResult["status"] = "fair"
    let advice = ""

    if (quotedPriceInr < expectedMin * 0.7) {
      status = "great_deal"
      advice = `Remarkably low rate! Verify that the quality, inclusions, and safety standards are genuine.`
    } else if (quotedPriceInr <= expectedMax * 1.15) {
      status = "fair"
      advice = `This is well within the typical verified range (₹${expectedMin} – ₹${expectedMax}) for ${matchingGuide.itemName}.`
    } else if (quotedPriceInr <= expectedMax * 1.8) {
      status = "slightly_high"
      advice = `Slightly inflated. Standard rate is typically ₹${expectedMin} – ₹${expectedMax}. Try polite bargaining or checking ride-hailing apps.`
    } else {
      status = "overpriced_scam"
      advice = `Potential tourist markup/overcharging! The typical local range is ₹${expectedMin} – ₹${expectedMax}. We strongly recommend getting a quote from another vendor or booking via official counters.`
    }

    return {
      itemName: matchingGuide.itemName,
      reportedPriceInr: quotedPriceInr,
      benchmarkMinInr: expectedMin,
      benchmarkMaxInr: expectedMax,
      status,
      advice,
      source: matchingGuide.dataSource || "Yatra Price Intelligence Database",
      lastVerified: matchingGuide.lastVerifiedAt || "2026-01-15",
    }
  }
}
