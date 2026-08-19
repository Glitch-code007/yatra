import { DestinationService } from "./destination.service"
import { PriceIntelligenceService } from "./price-intelligence.service"
import { SafetyService } from "./safety.service"

export interface AIChatContext {
  destinationSlug?: string
  destinationName?: string
  totalBudgetInr?: number
  numDays?: number
  numTravelers?: number
  currentItinerarySummary?: string
  travelPreference?: string
}

export class AIService {
  /**
   * Generates a context-aware answer from Yatra AI Assistant
   */
  static async askAssistant(
    userQuery: string,
    context?: AIChatContext
  ): Promise<{ response: string; suggestions: string[]; isAiGenerated: boolean }> {
    const apiKey = process.env.OPENAI_API_KEY

    // Assemble rich grounding facts from app database
    let groundingData = ""
    if (context?.destinationSlug) {
      const dest = DestinationService.getDestinationBySlug(context.destinationSlug)
      const prices = PriceIntelligenceService.getPriceGuidesByDestination(context.destinationSlug)
      const safety = SafetyService.getSafetyAlertsByDestination(context.destinationSlug)

      groundingData = `
Destination: ${dest?.name || context.destinationName} (${dest?.state}, India)
Best Time to Visit: ${dest?.bestTimeToVisit}
Key Places: ${dest?.places.map((p) => p.name).join(", ")}
Famous Delicacies: ${dest?.foodPlaces.map((f) => f.name + ` (${f.famousFor?.join(", ")})`).join("; ")}
Verified Local Prices: ${prices.map((pr) => `${pr.itemName}: ₹${pr.priceMinInr}-₹${pr.priceMaxInr} ${pr.unit}`).join("; ")}
Known Scam/Safety Alerts: ${safety.map((s) => `${s.title}: ${s.description}`).join("; ")}
User Budget: ₹${context.totalBudgetInr || "Flexible"} for ${context.numDays || 3} days and ${context.numTravelers || 1} travelers.
`
    }

    if (apiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are 'Yatra AI', an expert, helpful, and safety-conscious Indian travel assistant.
You guide travelers with authentic recommendations, cultural etiquette, food gems, and safety tips for traveling in India.

CRITICAL RULES:
1. All prices must be quoted in Indian Rupees (₹).
2. DO NOT fabricate live train/hotel availability or exact official rates. Use the factual context provided.
3. Keep responses structured, concise, and easy to read on mobile.
4. Always prioritize traveler safety and verified pricing.

Context Facts from Yatra Database:
${groundingData}`,
              },
              { role: "user", content: userQuery },
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const reply = data.choices[0]?.message?.content || ""
          return {
            response: reply,
            suggestions: this.generateSuggestions(context?.destinationName),
            isAiGenerated: true,
          }
        }
      } catch (err) {
        console.warn("OpenAI API call failed, using intelligent local engine:", err)
      }
    }

    // High-quality local heuristic fallback engine
    return this.generateHeuristicResponse(userQuery, context)
  }

  /**
   * High-accuracy heuristic fallback when offline or no API key
   */
  private static generateHeuristicResponse(
    query: string,
    context?: AIChatContext
  ): { response: string; suggestions: string[]; isAiGenerated: boolean } {
    const q = query.toLowerCase()
    const destName = context?.destinationName || "your destination"
    const budget = context?.totalBudgetInr ? `₹${context.totalBudgetInr}` : "your budget"

    let reply = ""

    if (q.includes("eat") || q.includes("food") || q.includes("restaurant") || q.includes("dish")) {
      reply = `**Must-Try Food in ${destName}:**\n\n` +
        `• **Authentic Regional Specialties:** Taste the local thali, freshly prepared seasonal sweets, and authentic dhabas.\n` +
        `• **Street Food Etiquette:** Always pick crowded stalls with high food turnover where items are fried or cooked piping hot in front of you.\n` +
        `• **Average Cost:** Budget meals cost ₹100–₹250/person; mid-range restaurants ₹400–₹700/person.\n` +
        `• **Beverage Tip:** Try clay-pot kulhad chai and freshly churned lassi.`
    } else if (q.includes("scam") || q.includes("safety") || q.includes("safe") || q.includes("danger")) {
      reply = `**Safety & Scam Alert for ${destName}:**\n\n` +
        `• **Auto/Taxi Commission Touts:** Never follow drivers claiming your hotel is 'closed' or 'burnt down'. Stick firmly to your itinerary.\n` +
        `• **Official Guides Only:** Look for authorized tourism ID badges with government holograms before hiring local guides.\n` +
        `• **Emergency Help:** Dial **112** for unified national emergency services or **1091** for 24x7 women safety assistance.\n` +
        `• **Digital Safety:** Use UPI apps (GPay/PhonePe) for exact change without cash disputes.`
    } else if (q.includes("cost") || q.includes("budget") || q.includes("cheap") || q.includes("price")) {
      reply = `**Budget Insights for ${destName}:**\n\n` +
        `• **Your Budget Plan:** ${budget} is well suited for a balanced experience.\n` +
        `• **Daily Allocation:** Allocate ~35% for stays, ~25% for dining, ~20% for sightseeing & entry tickets, and ~12% for local auto/taxis.\n` +
        `• **Savings Tip:** Book Indian Railways (3AC or Vande Bharat) in advance on IRCTC to save up to 60% compared to last-minute flights.`
    } else {
      reply = `**Traveler Guide for ${destName}:**\n\n` +
        `• **Planning:** Best explored over ${context?.numDays || 3} to 4 days with morning heritage visits and sunset viewpoints.\n` +
        `• **Transit:** Pre-negotiate auto rickshaw fares using our 'Price Check' tool or book Uber/Ola.\n` +
        `• **Weather & Clothing:** Carry comfortable cottons with a light layer for air-conditioned transit or winter evenings.\n\n` +
        `Feel free to ask me for specific food trails, budget tweaks, or day-wise modifications!`
    }

    return {
      response: reply,
      suggestions: this.generateSuggestions(destName),
      isAiGenerated: false,
    }
  }

  private static generateSuggestions(destName = "India"): string[] {
    return [
      `What are the must-eat local dishes in ${destName}?`,
      `How can I make my ${destName} trip more budget-friendly?`,
      `What scams should I avoid in ${destName}?`,
      `Suggest a romantic sunset spot in ${destName}`,
    ]
  }
}
