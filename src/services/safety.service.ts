import { SafetyAlert } from "@/types"
import { SAFETY_ALERTS_DATA } from "@/data/destination-details"
import { NATIONWIDE_EMERGENCY_NUMBERS, REGIONAL_EMERGENCY_HUBS, EmergencyServiceItem } from "@/data/emergency-directory"

export const PAN_INDIA_SAFETY_TIPS: { title: string; category: string; description: string; advice: string }[] = [
  {
    title: "SIM Card & Digital Payments (UPI)",
    category: "digital",
    description: "Digital payments via UPI (Google Pay, PhonePe, Paytm) are ubiquitous across India from five-star hotels to roadside tea stalls.",
    advice: "Get an Indian Tourist SIM with e-SIM or physical SIM at airport counters using your passport. Setup UPI for seamless, change-free payments.",
  },
  {
    title: "Safe Drinking Water & Food Hygiene",
    category: "health",
    description: "Avoid untreated tap water. Opt for sealed mineral water or reputable RO filtered water.",
    advice: "Eat at crowded dhabas and street stalls with high turnover. Enjoy piping hot freshly prepared food.",
  },
  {
    title: "Night Travel & Solo Women Traveler Precautions",
    category: "women_safety",
    description: "Women safety precautions and 24x7 helpline connectivity (1091 and 112).",
    advice: "Use verified app-based cabs (Uber/Ola) with live GPS sharing enabled for late night transit. Keep hotel address card in local language.",
  },
  {
    title: "Temple & Cultural Etiquette",
    category: "culture",
    description: "Footwear removal and modest dressing expectations at religious shrines.",
    advice: "Remove shoes at designated temple shoe-stands (free or ₹5-10 tip). Cover shoulders and knees when entering places of worship.",
  },
]

export class SafetyService {
  /**
   * Get all active safety and scam alerts for a destination
   */
  static getSafetyAlertsByDestination(destinationSlug: string): SafetyAlert[] {
    const localAlerts = SAFETY_ALERTS_DATA[destinationSlug] || []
    return localAlerts.filter((a) => a.isActive)
  }

  /**
   * Get all emergency numbers (Nationwide + Regional)
   */
  static getEmergencyContacts(destinationSlug?: string): {
    nationwide: EmergencyServiceItem[]
    regional: EmergencyServiceItem[]
  } {
    const regional = destinationSlug ? REGIONAL_EMERGENCY_HUBS[destinationSlug] || [] : []
    return {
      nationwide: NATIONWIDE_EMERGENCY_NUMBERS,
      regional,
    }
  }

  /**
   * Get pan-India travel tips
   */
  static getGeneralSafetyTips() {
    return PAN_INDIA_SAFETY_TIPS
  }
}
