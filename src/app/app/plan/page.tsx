"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Train,
  Plane,
  Bus,
  Car,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  PieChart as PieIcon,
  Save,
  Clock,
  Plus,
  Minus,
  Utensils,
  Leaf,
  Zap,
  Coffee,
  Bookmark,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { INDIAN_DESTINATIONS } from "@/data/destinations"
import { ALL_INDIAN_STATES_AND_UTS, estimateTravelOptions } from "@/data/travel-matrix"
import { ItineraryGeneratorService } from "@/services/itinerary-generator.service"
import { BudgetService } from "@/services/budget.service"
import { TripStorageService } from "@/services/trip-storage.service"
import { Itinerary, TravelOption, BudgetBreakdown } from "@/types"
import { toast } from "sonner"

export default function PlanTripPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground text-sm">Loading trip planner...</div>}>
      <PlanTripContent />
    </Suspense>
  )
}

function PlanTripContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialDestSlug = searchParams.get("dest")
  const initialStateParam = searchParams.get("state")

  // Multi-step Wizard State (1 to 5)
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Origin & Destination (All 28 States + 8 UTs)
  const [originStateName, setOriginStateName] = useState("Delhi (NCT)")
  const [originSearchQuery, setOriginSearchQuery] = useState("")
  const [destinationSlug, setDestinationSlug] = useState(initialDestSlug || "jaipur")
  const [destSearchQuery, setDestSearchQuery] = useState("")

  const filteredOriginStates = ALL_INDIAN_STATES_AND_UTS.filter((s) => {
    if (!originSearchQuery.trim()) return true
    const q = originSearchQuery.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q)
  })

  const currentOriginObj = ALL_INDIAN_STATES_AND_UTS.find((s) => s.name === originStateName) || ALL_INDIAN_STATES_AND_UTS[0]

  // Combine custom destinations with all 36 Indian states & UTs
  const allDestinationOptions = useMemo(() => {
    const stateDestinations = ALL_INDIAN_STATES_AND_UTS.map((st) => {
      const slug = st.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
      const existing = INDIAN_DESTINATIONS.find((d) => d.slug === slug || d.state.toLowerCase() === st.name.toLowerCase())
      if (existing) return existing

      return {
        id: `dest-state-${slug}`,
        name: `${st.name}`,
        slug: slug,
        district: `${st.capitalCity} / Main Hub`,
        state: st.name,
        region: st.region,
        description: `Explore the vibrant culture, landscapes, and iconic attractions of ${st.name}.`,
        shortDescription: `Top attractions, authentic food, and cultural heritage of ${st.name}.`,
        latitude: st.lat,
        longitude: st.lng,
        bestTimeToVisit: "October to March",
        bestMonths: [10, 11, 12, 1, 2, 3],
        altitudeMeters: 300,
        nearestAirport: `${st.capitalCity} Airport`,
        nearestRailway: `${st.capitalCity} Railway Station`,
        primaryImageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"],
        tags: ["Culture", "Heritage", "Sightseeing", "Nature"],
        isFeatured: false,
        isPublished: true,
        popularityScore: 90,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })

    const map = new Map<string, any>()
    INDIAN_DESTINATIONS.forEach((d) => map.set(d.slug, d))
    stateDestinations.forEach((d) => {
      if (!map.has(d.slug)) {
        map.set(d.slug, d)
      }
    })
    return Array.from(map.values())
  }, [])

  const filteredDestinations = INDIAN_DESTINATIONS.filter((d) => {
    if (!destSearchQuery.trim()) return true
    const q = destSearchQuery.toLowerCase()
    return (
      d.name.toLowerCase().includes(q) ||
      d.district?.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q)
    )
  })

  const currentDestObj = allDestinationOptions.find(
    (d: any) =>
      d.slug.toLowerCase() === destinationSlug.toLowerCase() ||
      d.state.toLowerCase().replace(/[^a-z0-9]+/g, "-") === destinationSlug.toLowerCase() ||
      d.state.toLowerCase() === destinationSlug.toLowerCase()
  ) || allDestinationOptions[0]

  // Step 2: Dates & Travelers
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  )
  const [numDays, setNumDays] = useState(3)
  const [numTravelers, setNumTravelers] = useState(2)
  const [travelerType, setTravelerType] = useState<"solo" | "couple" | "family" | "group">("couple")

  // Step 3: Budget & Preferences
  const [totalBudgetInr, setTotalBudgetInr] = useState(25000)
  const [travelPreference, setTravelPreference] = useState<"cheapest" | "fastest" | "comfortable" | "balanced">("balanced")
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Heritage", "Food", "Culture"])

  // Step 4: Travel Mode Options
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([])
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelOption | null>(null)

  // Step 5: Generated Itinerary & Budget
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null)
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Automatically update destination if query param provided
  useEffect(() => {
    const destParam = searchParams.get("dest")
    const stateParam = searchParams.get("state")

    if (destParam) {
      const match = allDestinationOptions.find(
        (d: any) => d.slug.toLowerCase() === destParam.toLowerCase() || d.state.toLowerCase().replace(/[^a-z0-9]+/g, "-") === destParam.toLowerCase()
      )
      if (match) {
        setDestinationSlug(match.slug)
      } else {
        setDestinationSlug(destParam)
      }
    } else if (stateParam) {
      const clean = stateParam.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
      const match = allDestinationOptions.find(
        (d: any) => d.slug.toLowerCase() === clean || d.state.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean || d.state.toLowerCase() === stateParam.toLowerCase()
      )
      if (match) {
        setDestinationSlug(match.slug)
      } else {
        setDestinationSlug(clean)
      }
    }
  }, [searchParams, allDestinationOptions])

  // Compute travel mode options when entering step 4
  const handleProceedToTravelModes = () => {
    const origin = ALL_INDIAN_STATES_AND_UTS.find((c) => c.name === originStateName) || ALL_INDIAN_STATES_AND_UTS[0]
    const destObj = currentDestObj

    const options = estimateTravelOptions(
      { name: origin.name, lat: origin.lat, lng: origin.lng },
      { name: destObj.name, lat: destObj.latitude || 26.9124, lng: destObj.longitude || 75.7873 },
      travelPreference,
      numTravelers
    )

    setTravelOptions(options)
    const recommended = options.find((o) => o.isRecommended) || options[0]
    setSelectedTravelMode(recommended)
    setCurrentStep(4)
  }

  // Generate Itinerary & Budget when entering step 5
  const handleGenerateItinerary = () => {
    const destObj = currentDestObj
    const transitCost = selectedTravelMode ? selectedTravelMode.estimatedCostMinInr : 4000

    const itinerary = ItineraryGeneratorService.generateItinerary({
      destinationSlug: destObj.slug,
      destinationName: destObj.name,
      numDays,
      startDate,
      numTravelers,
      travelPreference,
      interests: selectedInterests,
      totalBudgetInr,
    })

    const budget = BudgetService.calculateTripBudget({
      totalBudgetInr,
      numDays,
      numTravelers,
      travelPreference,
      travelModeCostInr: transitCost,
    })

    setGeneratedItinerary(itinerary)
    setBudgetBreakdown(budget)
    setCurrentStep(5)
  }

  // Quick Controls on generated itinerary
  const handleApplyModifier = (action: "cheaper" | "nature" | "food" | "relaxed" | "faster" | "adventure") => {
    if (!generatedItinerary) return
    const updated = ItineraryGeneratorService.applyQuickControl(generatedItinerary, action)
    setGeneratedItinerary(updated)
    toast.success(`Itinerary updated: Applied "${action}" optimization!`)
  }

  // Save Trip
  const handleSaveTrip = () => {
    if (!generatedItinerary || !budgetBreakdown) return
    setIsSaving(true)

    const destObj = currentDestObj
    const origin = ALL_INDIAN_STATES_AND_UTS.find((c) => c.name === originStateName) || ALL_INDIAN_STATES_AND_UTS[0]

    const newTrip = TripStorageService.saveTrip({
      id: `trip-${Date.now()}`,
      userId: "guest-user",
      destinationId: destObj.id,
      title: `${numDays}-Day Journey to ${destObj.name}`,
      status: "planned",
      originName: origin.name,
      originLat: origin.lat,
      originLng: origin.lng,
      destinationName: destObj.name,
      destinationLat: destObj.latitude || undefined,
      destinationLng: destObj.longitude || undefined,
      startDate,
      endDate: new Date(new Date(startDate).getTime() + numDays * 86400000).toISOString().split("T")[0],
      numDays,
      numTravelers,
      totalBudgetInr,
      estimatedCostInr: budgetBreakdown.estimatedTotal,
      actualCostInr: 0,
      travelPreference,
      interests: selectedInterests,
      selectedTravelMode: selectedTravelMode?.mode,
      itinerary: generatedItinerary,
      travelOptions,
      budgetBreakdown,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    setIsSaving(false)
    toast.success("Trip successfully saved to My Trips!")
    router.push(`/app/trips/${newTrip.id}`)
  }

  const interestOptions = [
    "Heritage & Forts",
    "Food & Street Food",
    "Nature & Mountains",
    "Beach & Coastal",
    "Adventure & Treks",
    "Spiritual & Sacred",
    "Relaxation & Spa",
    "Shopping & Handlooms",
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Step Progress Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Step {currentStep} of 5</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentStep === 1 && "Select Starting Point & Destination"}
            {currentStep === 2 && "Dates, Duration & Travelers"}
            {currentStep === 3 && "Budget & Travel Preferences"}
            {currentStep === 4 && "Travel Mode Recommendation"}
            {currentStep === 5 && "Suggested Day-by-Day Itinerary & Budget"}
          </h1>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-1 sm:gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <button
              key={step}
              onClick={() => step < currentStep && setCurrentStep(step)}
              disabled={step > currentStep}
              className={`h-8 w-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                currentStep === step
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                  : currentStep > step
                  ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                  : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
              }`}
            >
              {currentStep > step ? "✓" : step}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: ORIGIN & DESTINATION */}
      {currentStep === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl">
          <Card className="p-6 border-border/60 space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="text-sm font-bold block">1. Where are you starting from (Select State / UT in India)?</label>
                <div className="text-xs text-muted-foreground">
                  Selected: <span className="font-bold text-primary">{currentOriginObj.name}</span> ({currentOriginObj.region} India • {currentOriginObj.type})
                </div>
              </div>

              {/* Search filter for origin states */}
              <div className="relative mb-3">
                <Input
                  type="text"
                  placeholder="Type starting State or Union Territory name (e.g. Tamil Nadu, Kerala, Maharashtra, Delhi)..."
                  value={originSearchQuery}
                  onChange={(e) => setOriginSearchQuery(e.target.value)}
                  className="h-10 text-xs rounded-xl pl-3 bg-muted/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {filteredOriginStates.map((stateItem) => (
                  <button
                    key={stateItem.name}
                    type="button"
                    onClick={() => setOriginStateName(stateItem.name)}
                    className={`p-3 rounded-xl text-xs font-medium text-left border transition-all flex flex-col justify-between ${
                      originStateName === stateItem.name
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/40"
                        : "border-border/60 hover:bg-muted text-muted-foreground bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <div className="font-bold text-foreground text-sm">{stateItem.name}</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {stateItem.region} India • {stateItem.type}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="text-sm font-bold block">2. Choose your destination State / UT to explore</label>
                <div className="text-xs text-muted-foreground">
                  Selected: <span className="font-bold text-primary">{currentDestObj.name}</span> ({currentDestObj.district}, {currentDestObj.state})
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground mb-3">
                Click any state to view its <strong>popular tourist places, famous food &amp; specialities</strong>, then come back to plan your trip.
              </p>

              {/* Live search input for destination/state/district */}
              <div className="relative mb-3">
                <Input
                  type="text"
                  placeholder="Type state, district, or location name (e.g. Rajasthan, Idukki, Kullu, Goa)..."
                  value={destSearchQuery}
                  onChange={(e) => setDestSearchQuery(e.target.value)}
                  className="h-10 text-xs rounded-xl pl-3 bg-muted/40"
                />
              </div>

              {/* State Cards Grid — clicking opens state detail page */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1 mb-4">
                {ALL_INDIAN_STATES_AND_UTS
                  .filter((s) => {
                    if (!destSearchQuery.trim()) return true
                    const q = destSearchQuery.toLowerCase()
                    return s.name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q)
                  })
                  .map((stateItem) => {
                    const stateSlug = stateItem.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
                    const isSelected =
                      currentDestObj.state.toLowerCase() === stateItem.name.toLowerCase() ||
                      currentDestObj.slug.toLowerCase() === stateSlug ||
                      destinationSlug.toLowerCase() === stateSlug

                    return (
                      <div
                        key={stateItem.name}
                        onClick={() => setDestinationSlug(stateSlug)}
                        className={`p-3 rounded-xl text-xs font-medium text-left border transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-2 ring-primary"
                            : "border-border/60 hover:border-primary/50 hover:bg-muted/50 text-muted-foreground bg-card"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="font-bold text-foreground text-[13px] truncate">{stateItem.name}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {stateItem.type} • {stateItem.region} India
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-border/40 text-[10px]">
                          <span className={isSelected ? "text-primary font-bold" : "text-muted-foreground"}>
                            {isSelected ? "✓ Selected" : "Click to select"}
                          </span>
                          <Link
                            href={`/explore/state/${stateSlug}`}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                          >
                            <span>Guide</span>
                            <ArrowRight className="h-2.5 w-2.5" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Specific location selection within the chosen state */}
              <div className="border-t border-border/40 pt-4 mt-2">
                <label className="text-xs font-bold block mb-2 text-muted-foreground">
                  Or select a specific destination for your trip itinerary:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {filteredDestinations.map((dest) => (
                    <button
                      key={dest.slug}
                      type="button"
                      onClick={() => setDestinationSlug(dest.slug)}
                      className={`p-3 rounded-xl text-xs text-left border transition-all flex flex-col justify-between ${
                        destinationSlug === dest.slug
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/40"
                          : "border-border/60 hover:bg-muted text-muted-foreground bg-card"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-foreground text-sm">{dest.name}</div>
                        <div className="text-[11px] font-semibold text-primary/90 mt-0.5">District: {dest.district}</div>
                        <div className="text-[10px] text-muted-foreground">State: {dest.state} ({dest.region} India)</div>
                      </div>
                      <div className="text-[10px] text-amber-600 mt-2 font-medium">Best: {dest.bestTimeToVisit}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" onClick={() => setCurrentStep(2)} className="gap-2 font-bold px-8">
              <span>Next: Dates & Travelers</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: DATES, DURATION & TRAVELERS */}
      {currentStep === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl">
          <Card className="p-6 border-border/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold block mb-2 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Start Date</span>
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-bold block mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Trip Duration</span>
                  </span>
                  <span className="text-xs font-bold text-primary">{numDays} {numDays === 1 ? "Day" : "Days"}</span>
                </label>
                
                {/* Direct Numeric Input with Counter Controls */}
                <div className="flex items-center gap-2 mb-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-xl shrink-0 border-border/80"
                    onClick={() => setNumDays(Math.max(1, numDays - 1))}
                    disabled={numDays <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      value={numDays}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10)
                        if (!isNaN(val) && val > 0) {
                          setNumDays(Math.min(60, val))
                        } else if (e.target.value === "") {
                          setNumDays(1)
                        }
                      }}
                      className="h-11 rounded-xl text-center font-bold text-base"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                      {numDays === 1 ? "Day" : "Days"}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-xl shrink-0 border-border/80"
                    onClick={() => setNumDays(Math.min(60, numDays + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Selection Presets */}
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5, 7, 10, 14].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setNumDays(days)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        numDays === days
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "border-border/60 bg-card hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Travelers</span>
                </span>
                <span className="text-xs font-bold text-primary">{numTravelers} {numTravelers === 1 ? "Person" : "Persons"}</span>
              </label>

              {/* Direct Numeric Input with Counter Controls */}
              <div className="flex items-center gap-2 mb-3 max-w-sm">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl shrink-0 border-border/80"
                  onClick={() => {
                    const newCount = Math.max(1, numTravelers - 1)
                    setNumTravelers(newCount)
                    if (newCount === 1) setTravelerType("solo")
                    else if (newCount === 2) setTravelerType("couple")
                    else if (newCount <= 4) setTravelerType("family")
                    else setTravelerType("group")
                  }}
                  disabled={numTravelers <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={numTravelers}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val) && val > 0) {
                        const clamped = Math.min(100, val)
                        setNumTravelers(clamped)
                        if (clamped === 1) setTravelerType("solo")
                        else if (clamped === 2) setTravelerType("couple")
                        else if (clamped <= 4) setTravelerType("family")
                        else setTravelerType("group")
                      } else if (e.target.value === "") {
                        setNumTravelers(1)
                        setTravelerType("solo")
                      }
                    }}
                    className="h-11 rounded-xl text-center font-bold text-base"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                    {numTravelers === 1 ? "Person" : "Persons"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl shrink-0 border-border/80"
                  onClick={() => {
                    const newCount = Math.min(100, numTravelers + 1)
                    setNumTravelers(newCount)
                    if (newCount === 1) setTravelerType("solo")
                    else if (newCount === 2) setTravelerType("couple")
                    else if (newCount <= 4) setTravelerType("family")
                    else setTravelerType("group")
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Type Selection Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "solo", label: "Solo Traveler", count: 1 },
                  { id: "couple", label: "Couple", count: 2 },
                  { id: "family", label: "Family (3-4)", count: 4 },
                  { id: "group", label: "Friends Group (5+)", count: 6 },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTravelerType(item.id as any)
                      setNumTravelers(item.count)
                    }}
                    className={`p-3 rounded-xl text-xs text-left border transition-all ${
                      travelerType === item.id && numTravelers === item.count
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/40"
                        : "border-border/60 bg-card hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground">{item.count} person(s)</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button size="lg" onClick={() => setCurrentStep(3)} className="gap-2 font-bold px-8">
              <span>Next: Budget & Style</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: BUDGET & PREFERENCES */}
      {currentStep === 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl">
          <Card className="p-6 border-border/60 space-y-6">
            <div>
              <label className="text-sm font-bold block mb-1 flex items-center gap-1.5">
                <IndianRupee className="h-4 w-4 text-amber-500" />
                <span>Total Approximate Trip Budget (in ₹ INR)</span>
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Include round-trip transit, accommodation, food, sightseeing, and local autos for all {numTravelers} travelers.
              </p>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={totalBudgetInr}
                  onChange={(e) => setTotalBudgetInr(parseInt(e.target.value) || 0)}
                  className="pl-8 h-12 text-lg font-bold rounded-xl"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[15000, 25000, 45000, 80000, 150000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTotalBudgetInr(amt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground font-medium"
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">Travel Preference Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "cheapest", label: "Cheapest", desc: "Sleeper/Bus, hostels, dhabas" },
                  { id: "balanced", label: "Balanced", desc: "3AC/Trains, mid-hotels, cafes" },
                  { id: "comfortable", label: "Comfortable", desc: "Flights/2AC, boutique stays" },
                  { id: "fastest", label: "Fastest", desc: "Flights, cabs, time-saver" },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setTravelPreference(pref.id as any)}
                    className={`p-3 rounded-xl text-xs text-left border transition-all ${
                      travelPreference === pref.id
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border/60 bg-card hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="font-bold">{pref.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{pref.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">Your Interests</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => {
                  const isSelected = selectedInterests.includes(interest)
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedInterests(selectedInterests.filter((i) => i !== interest))
                        } else {
                          setSelectedInterests([...selectedInterests, interest])
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {interest}
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(2)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button size="lg" onClick={handleProceedToTravelModes} className="gap-2 font-bold px-8">
              <span>Next: Compare Travel Modes</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: TRAVEL MODE COMPARISON & RECOMMENDATION */}
      {currentStep === 4 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
          <div>
            <h2 className="text-xl font-bold">Recommended Transit: {originStateName} → {currentDestObj.name} ({currentDestObj.state})</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Select your preferred mode of travel. We&apos;ll factor this cost directly into your total trip budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelOptions.map((option) => {
              const isSelected = selectedTravelMode?.mode === option.mode
              const Icon =
                option.mode === "train"
                  ? Train
                  : option.mode === "flight"
                  ? Plane
                  : option.mode === "bus"
                  ? Bus
                  : Car

              return (
                <Card
                  key={option.mode}
                  onClick={() => setSelectedTravelMode(option)}
                  className={`p-5 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border/60 hover:border-primary/40 bg-card"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base capitalize">{option.mode} Transit</h3>
                          <div className="text-xs text-muted-foreground">{option.name}</div>
                        </div>
                      </div>
                      {option.isRecommended && (
                        <Badge className="bg-emerald-600 text-white font-bold text-[10px] uppercase">
                          Recommended
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-muted/60 text-xs">
                      <div>
                        <div className="text-muted-foreground text-[10px]">Estimated Cost (Total)</div>
                        <div className="font-black text-sm text-foreground">
                          ₹{option.estimatedCostMinInr.toLocaleString()} – ₹{option.estimatedCostMaxInr.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-[10px]">Travel Time</div>
                        <div className="font-black text-sm text-foreground">
                          ~{option.estimatedDurationHours} Hours ({option.distanceKm} km)
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Pros:</div>
                      <div className="text-muted-foreground">{option.pros.slice(0, 2).join(" • ")}</div>
                    </div>

                    <div className="text-[11px] text-muted-foreground/80 italic">
                      💡 {option.bookingAdvice}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Frequency: {option.frequency}</span>
                    <span className={`font-bold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                      {isSelected ? "Selected ✓" : "Click to select"}
                    </span>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(3)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button size="lg" onClick={handleGenerateItinerary} className="gap-2 font-bold px-8 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span>Generate AI Itinerary & Budget</span>
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: GENERATED ITINERARY & BUDGET */}
      {currentStep === 5 && generatedItinerary && budgetBreakdown && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm">
            <div>
              <h2 className="text-lg font-bold">
                {generatedItinerary.numDays}-Day Custom Itinerary for {generatedItinerary.destinationName} ({currentDestObj.district}, {currentDestObj.state})
              </h2>
              <div className="text-xs text-muted-foreground mt-0.5">
                {numTravelers} Travelers • Budget: ₹{totalBudgetInr.toLocaleString()} • Est Total: ₹{generatedItinerary.totalEstimatedCostInr.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/app/assistant?dest=${destinationSlug}`)}
                className="text-xs gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Ask AI to Modify</span>
              </Button>
              <Button size="sm" onClick={handleSaveTrip} disabled={isSaving} className="text-xs gap-1.5 font-bold">
                <Save className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : "Save Trip"}</span>
              </Button>
            </div>
          </div>

          {/* Quick Modifier Chips */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Quick Itinerary Modifiers (1-Click Regeneration):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyModifier("cheaper")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1"
              >
                <IndianRupee className="h-3 w-3 text-amber-500" />
                <span>Make It Cheaper</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyModifier("nature")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1"
              >
                <Leaf className="h-3 w-3 text-emerald-500" />
                <span>More Nature & Scenic</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyModifier("food")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1"
              >
                <Utensils className="h-3 w-3 text-red-500" />
                <span>More Food Trails</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyModifier("relaxed")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1"
              >
                <Coffee className="h-3 w-3 text-purple-500" />
                <span>Relaxed & Slower Pace</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Day-by-Day Activity Flow (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              {generatedItinerary.days.map((day) => (
                <Card key={day.dayNumber} className="border-border/60 overflow-hidden shadow-xs">
                  <CardHeader className="bg-muted/40 p-4 border-b border-border/40 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold">{day.title}</CardTitle>
                      <CardDescription className="text-xs">{day.date} • Suggested Stay: {day.accommodationArea}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs font-bold">
                      Est: ₹{day.estimatedDayCostInr.toLocaleString()}
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {day.activities.map((act) => (
                      <div key={act.id} className="p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-all space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-primary uppercase">{act.timeSlot}</span>
                          <span className="text-xs font-semibold text-muted-foreground">₹{act.estimatedCostInr}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground">{act.title}</h4>
                        <p className="text-xs text-muted-foreground">{act.description}</p>
                        {act.tips && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 pt-1">
                            💡 {act.tips}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right: Budget Breakdown Card (1 Col) */}
            <div className="space-y-6">
              <Card className="border-border/60 p-5 space-y-4 sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center gap-1.5">
                    <PieIcon className="h-4 w-4 text-primary" />
                    <span>Estimated Budget Split</span>
                  </h3>
                  <Badge variant={budgetBreakdown.isOverBudget ? "destructive" : "secondary"} className="text-xs">
                    {budgetBreakdown.isOverBudget ? "Over Budget" : "Within Budget"}
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-muted/60 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">User Budget:</span>
                    <span className="font-bold">₹{budgetBreakdown.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Estimated Total:</span>
                    <span className="font-bold text-primary">₹{budgetBreakdown.estimatedTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-border/60 pt-1 font-bold">
                    <span>Remaining Buffer:</span>
                    <span className={budgetBreakdown.remainingBudget > 0 ? "text-emerald-600" : "text-red-500"}>
                      ₹{budgetBreakdown.remainingBudget.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Category Progress Bars */}
                <div className="space-y-3">
                  {budgetBreakdown.categories.map((cat) => (
                    <div key={cat.key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{cat.name}</span>
                        <span className="font-bold">₹{cat.allocatedAmount.toLocaleString()} ({cat.percentageOfTotal}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, cat.percentageOfTotal)}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button size="lg" onClick={handleSaveTrip} disabled={isSaving} className="w-full font-bold shadow-md gap-2">
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Saving Trip..." : "Save Trip & Continue"}</span>
                </Button>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
