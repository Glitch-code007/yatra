import { TravelOption } from "@/types"

export interface StateCoordinates {
  name: string
  type: "State" | "Union Territory"
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast"
  lat: number
  lng: number
  capitalCity: string
}

export const ALL_INDIAN_STATES_AND_UTS: StateCoordinates[] = [
  // 28 States
  { name: "Andhra Pradesh", type: "State", region: "South", lat: 15.9129, lng: 79.74, capitalCity: "Amaravati" },
  { name: "Arunachal Pradesh", type: "State", region: "Northeast", lat: 28.218, lng: 94.7278, capitalCity: "Itanagar" },
  { name: "Assam", type: "State", region: "Northeast", lat: 26.2006, lng: 92.9376, capitalCity: "Dispur / Guwahati" },
  { name: "Bihar", type: "State", region: "East", lat: 25.0961, lng: 85.3131, capitalCity: "Patna" },
  { name: "Chhattisgarh", type: "State", region: "Central", lat: 21.2787, lng: 81.8661, capitalCity: "Raipur" },
  { name: "Goa", type: "State", region: "West", lat: 15.2993, lng: 74.124, capitalCity: "Panaji" },
  { name: "Gujarat", type: "State", region: "West", lat: 22.2587, lng: 71.1924, capitalCity: "Gandhinagar / Ahmedabad" },
  { name: "Haryana", type: "State", region: "North", lat: 29.0588, lng: 76.0856, capitalCity: "Chandigarh" },
  { name: "Himachal Pradesh", type: "State", region: "North", lat: 31.1048, lng: 77.1734, capitalCity: "Shimla" },
  { name: "Jharkhand", type: "State", region: "East", lat: 23.6102, lng: 85.2799, capitalCity: "Ranchi" },
  { name: "Karnataka", type: "State", region: "South", lat: 15.3173, lng: 75.7139, capitalCity: "Bengaluru" },
  { name: "Kerala", type: "State", region: "South", lat: 10.8505, lng: 76.2711, capitalCity: "Thiruvananthapuram" },
  { name: "Madhya Pradesh", type: "State", region: "Central", lat: 22.9734, lng: 78.6569, capitalCity: "Bhopal" },
  { name: "Maharashtra", type: "State", region: "West", lat: 19.7515, lng: 75.7139, capitalCity: "Mumbai" },
  { name: "Manipur", type: "State", region: "Northeast", lat: 24.6637, lng: 93.9063, capitalCity: "Imphal" },
  { name: "Meghalaya", type: "State", region: "Northeast", lat: 25.467, lng: 91.3662, capitalCity: "Shillong" },
  { name: "Mizoram", type: "State", region: "Northeast", lat: 23.1645, lng: 92.9376, capitalCity: "Aizawl" },
  { name: "Nagaland", type: "State", region: "Northeast", lat: 26.1584, lng: 94.5624, capitalCity: "Kohima" },
  { name: "Odisha", type: "State", region: "East", lat: 20.9517, lng: 85.0985, capitalCity: "Bhubaneswar" },
  { name: "Punjab", type: "State", region: "North", lat: 31.1471, lng: 75.3412, capitalCity: "Chandigarh / Amritsar" },
  { name: "Rajasthan", type: "State", region: "North", lat: 27.0238, lng: 74.2179, capitalCity: "Jaipur" },
  { name: "Sikkim", type: "State", region: "Northeast", lat: 27.533, lng: 88.5122, capitalCity: "Gangtok" },
  { name: "Tamil Nadu", type: "State", region: "South", lat: 11.1271, lng: 78.6569, capitalCity: "Chennai" },
  { name: "Telangana", type: "State", region: "South", lat: 18.1124, lng: 79.0193, capitalCity: "Hyderabad" },
  { name: "Tripura", type: "State", region: "Northeast", lat: 23.9408, lng: 91.9882, capitalCity: "Agartala" },
  { name: "Uttar Pradesh", type: "State", region: "North", lat: 26.8467, lng: 80.9462, capitalCity: "Lucknow" },
  { name: "Uttarakhand", type: "State", region: "North", lat: 30.0668, lng: 79.0193, capitalCity: "Dehradun" },
  { name: "West Bengal", type: "State", region: "East", lat: 22.9868, lng: 87.855, capitalCity: "Kolkata" },

  // 8 Union Territories
  { name: "Andaman and Nicobar Islands", type: "Union Territory", region: "South", lat: 11.7401, lng: 92.6586, capitalCity: "Port Blair" },
  { name: "Chandigarh", type: "Union Territory", region: "North", lat: 30.7333, lng: 76.7794, capitalCity: "Chandigarh" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", type: "Union Territory", region: "West", lat: 20.4283, lng: 72.8397, capitalCity: "Daman" },
  { name: "Delhi (NCT)", type: "Union Territory", region: "North", lat: 28.6139, lng: 77.209, capitalCity: "New Delhi" },
  { name: "Jammu and Kashmir", type: "Union Territory", region: "North", lat: 33.7782, lng: 76.5762, capitalCity: "Srinagar / Jammu" },
  { name: "Ladakh", type: "Union Territory", region: "North", lat: 34.1526, lng: 77.5771, capitalCity: "Leh" },
  { name: "Lakshadweep", type: "Union Territory", region: "South", lat: 10.5667, lng: 72.6417, capitalCity: "Kavaratti" },
  { name: "Puducherry", type: "Union Territory", region: "South", lat: 11.9416, lng: 79.8083, capitalCity: "Pondicherry" },
]

// Backwards compatibility alias
export const MAJOR_ORIGIN_CITIES = ALL_INDIAN_STATES_AND_UTS

/**
 * Calculates straight line distance (Haversine formula) in kilometers
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

/**
 * Computes realistic travel mode options (Train, Flight, Bus, Cab/Self-drive) for any origin & destination in India
 */
export function estimateTravelOptions(
  origin: { name: string; lat: number; lng: number },
  destination: { name: string; lat: number; lng: number },
  preference: "cheapest" | "fastest" | "comfortable" | "balanced" = "balanced",
  travelersCount = 1
): TravelOption[] {
  const directDistance = calculateDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng)
  const roadDistance = Math.max(80, Math.round(directDistance * 1.25))
  const railDistance = Math.max(80, Math.round(directDistance * 1.15))

  const options: TravelOption[] = []

  // 1. Train Option (Indian Railways / Vande Bharat / Express)
  const trainSpeedKmH = 65
  const trainHours = Math.max(3, Math.round(railDistance / trainSpeedKmH))
  const trainCostPerKm = 1.4 // 3AC / CC average
  const trainCost = Math.round(railDistance * trainCostPerKm * travelersCount)

  options.push({
    mode: "train",
    name: directDistance < 600 ? "Vande Bharat / Shatabdi Express" : "Superfast Express / Rajdhani 3AC",
    estimatedCostMinInr: Math.round(trainCost * 0.8),
    estimatedCostMaxInr: Math.round(trainCost * 1.3),
    estimatedDurationHours: trainHours,
    distanceKm: railDistance,
    comfortRating: 4.2,
    reliabilityRating: 4.5,
    frequency: "Multiple Daily Trains",
    pros: ["Scenic railway journey", "Center-to-center city connectivity", "Budget friendly with sleeper & 3AC"],
    cons: ["Advance booking required on IRCTC during peak season"],
    isRecommended: directDistance < 900 && preference !== "fastest",
    bookingAdvice: "Book 30-60 days ahead on IRCTC (tatkal opens 1 day prior at 10 AM).",
  })

  // 2. Flight Option (Domestic Airlines)
  if (directDistance > 300) {
    const flightDuration = Math.round(directDistance / 550 * 10) / 10 + 2.5 // include airport transit
    const baseFlightCost = directDistance > 1200 ? 5500 : 3800
    const totalFlightCost = baseFlightCost * travelersCount

    options.push({
      mode: "flight",
      name: "Direct / Connecting Domestic Flight",
      estimatedCostMinInr: Math.round(totalFlightCost * 0.85),
      estimatedCostMaxInr: Math.round(totalFlightCost * 1.4),
      estimatedDurationHours: Math.round(flightDuration),
      distanceKm: directDistance,
      comfortRating: 4.7,
      reliabilityRating: 4.6,
      frequency: "Daily Flights",
      pros: ["Fastest transit mode across states", "Ideal for short holidays & weekends"],
      cons: ["Higher baggage constraints", "Airport is often on city outskirts"],
      isRecommended: directDistance >= 900 || preference === "fastest",
      bookingAdvice: "Compare fares across IndiGo/Air India; book 3-4 weeks early for lowest fares.",
    })
  }

  // 3. AC Bus Option (State RTC / Private Volvo Multi-Axle)
  if (roadDistance <= 900) {
    const busHours = Math.max(4, Math.round(roadDistance / 48))
    const busCost = Math.round(roadDistance * 1.8 * travelersCount)

    options.push({
      mode: "bus",
      name: "Overnight AC Volvo / Scania Sleeper",
      estimatedCostMinInr: Math.round(busCost * 0.85),
      estimatedCostMaxInr: Math.round(busCost * 1.25),
      estimatedDurationHours: busHours,
      distanceKm: roadDistance,
      comfortRating: 3.8,
      reliabilityRating: 4.0,
      frequency: "Frequent Evening & Night Departures",
      pros: ["Overnight travel saves 1 night hotel cost", "Last minute seat availability"],
      cons: ["Subject to highway traffic and ghat road delays"],
      isRecommended: preference === "cheapest" && roadDistance < 600,
      bookingAdvice: "Book verified operators with high ratings on RedBus/State RTC.",
    })
  }

  // 4. Outstation Cab / Self-Drive Option
  if (roadDistance <= 700) {
    const cabHours = Math.max(3, Math.round(roadDistance / 55))
    const cabCost = Math.round(roadDistance * 13 + 600) // ₹13/km + toll buffer

    options.push({
      mode: "cab",
      name: "Private Outstation Sedan / SUV",
      estimatedCostMinInr: Math.round(cabCost * 0.9),
      estimatedCostMaxInr: Math.round(cabCost * 1.2),
      estimatedDurationHours: cabHours,
      distanceKm: roadDistance,
      comfortRating: 4.5,
      reliabilityRating: 4.3,
      frequency: "24x7 Door-to-Door On-Demand",
      pros: ["Complete flexibility on stops", "Doorstep pickup and sightseeing en route"],
      cons: ["Driver allowance and toll taxes applicable"],
      isRecommended: travelersCount >= 3 && roadDistance < 450,
      bookingAdvice: "Choose all-inclusive toll packages or verified outstation cab services.",
    })
  }

  // Ensure at least 1 option is marked recommended
  if (!options.some((o) => o.isRecommended) && options.length > 0) {
    options[0].isRecommended = true
  }

  return options
}
