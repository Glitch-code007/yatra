"use client"

import { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  MapPin,
  Calendar,
  Plane,
  Train,
  Mountain,
  Compass,
  Sparkles,
  ShieldCheck,
  IndianRupee,
  Utensils,
  Hotel,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Siren,
  Phone,
  Bookmark,
  Share2,
  ArrowLeft,
  Search,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DestinationService } from "@/services/destination.service"
import { PriceIntelligenceService } from "@/services/price-intelligence.service"
import { SafetyService } from "@/services/safety.service"
import { TripStorageService } from "@/services/trip-storage.service"
import { toast } from "sonner"

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = use(params)
  const dest = DestinationService.getDestinationBySlug(resolvedParams.slug)

  if (!dest) {
    notFound()
  }

  // Interactive Price Checker State
  const [checkerCategory, setCheckerCategory] = useState("transport")
  const [quotedPrice, setQuotedPrice] = useState("")
  const [checkResult, setCheckResult] = useState<any>(null)

  const handlePriceCheck = (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseFloat(quotedPrice)
    if (!priceNum || isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price amount in INR (₹)")
      return
    }
    const result = PriceIntelligenceService.evaluatePrice(dest.slug, checkerCategory, priceNum)
    setCheckResult(result)
  }

  const handleSavePlace = (place: any) => {
    const added = TripStorageService.toggleSavedPlace({
      id: place.id,
      name: place.name,
      category: place.category,
      destinationSlug: dest.slug,
      imageUrl: place.primaryImageUrl,
    })
    if (added) {
      toast.success(`Saved "${place.name}" to your bookmarks!`)
    } else {
      toast.info(`Removed "${place.name}" from bookmarks.`)
    }
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Destination link copied to clipboard!")
    }
  }

  const emergencyContacts = SafetyService.getEmergencyContacts(dest.slug)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pb-20">
        {/* Back Link */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Destinations</span>
          </Link>
        </div>

        {/* Hero Cover Banner */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
          <div className="relative h-[380px] sm:h-[460px] w-full overflow-hidden rounded-3xl bg-muted shadow-lg">
            <SafeImage
              src={dest.primaryImageUrl || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"}
              alt={dest.name}
              fallbackTitle={dest.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md border-0 text-xs px-3 py-1 font-bold">
                  State: {dest.state}
                </Badge>
                <Badge variant="secondary" className="bg-black/70 text-amber-300 backdrop-blur-md border-0 text-xs px-3 py-1 font-semibold">
                  District: {dest.district}
                </Badge>
                {dest.isFeatured && (
                  <Badge className="bg-amber-500 text-black font-bold text-xs gap-1 border-0">
                    <Sparkles className="h-3 w-3" />
                    <span>Featured</span>
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-md gap-1.5 rounded-full text-xs"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs font-semibold text-amber-300 mb-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Visiting Location: {dest.name} (District: {dest.district}, State: {dest.state})</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {dest.name}
              </h1>
              <p className="mt-2 max-w-3xl text-xs sm:text-sm text-zinc-200 leading-relaxed drop-shadow-sm">
                {dest.shortDescription || dest.description}
              </p>

              {/* Quick Metadata Row */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-200">
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  <span>Best Season: {dest.bestTimeToVisit}</span>
                </div>
                {dest.altitudeMeters && (
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Mountain className="h-3.5 w-3.5 text-teal-400" />
                    <span>Altitude: {dest.altitudeMeters}m</span>
                  </div>
                )}
                {dest.nearestAirport && (
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Plane className="h-3.5 w-3.5 text-blue-400" />
                    <span>{dest.nearestAirport}</span>
                  </div>
                )}
              </div>

              {/* CTA Action */}
              <div className="mt-6">
                <Button asChild size="lg" className="rounded-xl px-8 shadow-xl gap-2 font-bold h-11 text-sm bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={`/app/plan?dest=${dest.slug}`}>
                    <Compass className="h-4 w-4" />
                    <span>Plan a Trip to {dest.name}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <Tabs defaultValue="places" className="space-y-8">
            <div className="overflow-x-auto pb-2 scrollbar-none">
              <TabsList className="h-11 bg-muted/60 p-1 rounded-xl">
                <TabsTrigger value="places" className="rounded-lg text-xs font-semibold px-4 gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Places to Visit ({dest.places.length})</span>
                </TabsTrigger>
                <TabsTrigger value="food" className="rounded-lg text-xs font-semibold px-4 gap-1.5">
                  <Utensils className="h-3.5 w-3.5" />
                  <span>Food & Dining ({dest.foodPlaces.length})</span>
                </TabsTrigger>
                <TabsTrigger value="stay" className="rounded-lg text-xs font-semibold px-4 gap-1.5">
                  <Hotel className="h-3.5 w-3.5" />
                  <span>Where to Stay ({dest.accommodations.length})</span>
                </TabsTrigger>
                <TabsTrigger value="prices" className="rounded-lg text-xs font-semibold px-4 gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5" />
                  <span>Local Price Guide & Checker</span>
                </TabsTrigger>
                <TabsTrigger value="safety" className="rounded-lg text-xs font-semibold px-4 gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
                  <span>Scams & Safety ({dest.safetyAlerts.length})</span>
                </TabsTrigger>
                <TabsTrigger value="emergency" className="rounded-lg text-xs font-semibold px-4 gap-1.5">
                  <Siren className="h-3.5 w-3.5 text-rose-500" />
                  <span>Emergency Helplines</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: PLACES & ATTRACTIONS */}
            <TabsContent value="places" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Iconic Places & Sightseeing</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Key monuments, viewpoints, forts, and cultural landmarks verified with official timings and entry fees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dest.places.map((place) => (
                  <Card key={place.id} className="overflow-hidden border-border/60 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      {place.primaryImageUrl && (
                        <div className="relative h-48 w-full bg-muted">
                          <SafeImage
                            src={place.primaryImageUrl}
                            alt={place.name}
                            fallbackTitle={place.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm text-[10px] uppercase font-bold">
                              {place.category}
                            </Badge>
                          </div>
                        </div>
                      )}
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg font-bold">{place.name}</CardTitle>
                          {place.rating && (
                            <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              ★ {place.rating}
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {place.description || place.shortDescription}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-4 pt-1 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>Timings: {typeof place.openingHours === "object" ? place.openingHours?.all : place.openingHours}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <IndianRupee className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span>
                            Entry Fee: {place.entryFeeInr === 0 ? "Free Entry" : `₹${place.entryFeeInr || 50} (Indian) / ₹${place.entryFeeForeignInr || (place.entryFeeInr || 50) * 4} (Foreign)`}
                          </span>
                        </div>

                        {place.estimatedVisitDurationMinutes && (
                          <div className="text-[11px] text-muted-foreground">
                            ⏱ Estimated Duration: {place.estimatedVisitDurationMinutes} mins
                          </div>
                        )}

                        <div className="pt-2 flex flex-wrap gap-1">
                          {place.tags.map((t) => (
                            <span key={t} className="text-[10px] font-medium bg-secondary px-2 py-0.5 rounded-md">
                              {t}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </div>

                    <div className="p-4 pt-0 border-t border-border/40 flex items-center justify-between mt-3">
                      <div className="text-[10px] text-muted-foreground italic">
                        Verified via {place.dataSource}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSavePlace(place)}
                        className="text-xs h-7 gap-1"
                      >
                        <Bookmark className="h-3 w-3" />
                        <span>Bookmark</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 2: FOOD & DINING */}
            <TabsContent value="food" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Authentic Local Flavors & Dining</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Must-eat regional specialties, historic eateries, and street food joints in {dest.name}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dest.foodPlaces.map((food) => (
                  <Card key={food.id} className="border-border/60 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold">{food.name}</h3>
                        <div className="text-xs text-primary font-medium">{food.cuisineType.join(", ")}</div>
                      </div>
                      <Badge variant="outline" className="text-xs uppercase font-semibold">
                        {food.priceRange}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{food.description}</p>

                    {food.famousFor && food.famousFor.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                        <div className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                          <Utensils className="h-3 w-3" />
                          <span>Must-Try Signature Dishes:</span>
                        </div>
                        <div className="text-muted-foreground">{food.famousFor.join(" • ")}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                      <span>Average Cost: <strong className="text-foreground">₹{food.avgMealCostInr}/person</strong></span>
                      {food.address && <span className="truncate max-w-[200px]">{food.address}</span>}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: WHERE TO STAY */}
            <TabsContent value="stay" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Where to Stay in {dest.name}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Realistic price tiers from backpacker hostels to heritage havelis and luxury palace resorts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dest.accommodations.map((acc) => (
                  <Card key={acc.id} className="border-border/60 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                          {acc.tier} Tier
                        </Badge>
                        <span className="text-xs font-bold text-amber-500">★ {acc.rating || 4.5}</span>
                      </div>

                      <h3 className="text-lg font-bold">{acc.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{acc.description}</p>

                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="text-xs font-semibold text-primary mb-1">Typical Rate Range:</div>
                        <div className="text-base font-extrabold text-foreground">
                          ₹{acc.priceRangeMinInr.toLocaleString()} – ₹{acc.priceRangeMaxInr.toLocaleString()}
                          <span className="text-xs font-normal text-muted-foreground"> / night</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-muted-foreground">Included Amenities:</div>
                        <div className="flex flex-wrap gap-1">
                          {acc.amenities.map((amenity) => (
                            <span key={amenity} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/40 text-[10px] text-muted-foreground italic">
                      Verified via {acc.dataSource}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 4: LOCAL PRICE GUIDE & INTERACTIVE CHECKER */}
            <TabsContent value="prices" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Local Price Benchmarks & Fair Fare Checker</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Know standard local rates for auto rickshaws, guide fees, meals, and rentals in {dest.name}.
                </p>
              </div>

              {/* Interactive 'Is This Price Fair?' Evaluator */}
              <Card className="border-primary/40 bg-gradient-to-r from-primary/5 via-card to-background p-6 shadow-md">
                <div className="flex items-center gap-2 text-primary font-bold text-base mb-1">
                  <IndianRupee className="h-5 w-5" />
                  <span>Interactive &quot;Is This Price Fair?&quot; Evaluator</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Enter a quoted price from a local vendor or driver to evaluate against our verified benchmark database.
                </p>

                <form onSubmit={handlePriceCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                    <select
                      value={checkerCategory}
                      onChange={(e) => setCheckerCategory(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-card shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="transport">Auto Rickshaw / Taxi Transit</option>
                      <option value="food">Authentic Meal / Thali</option>
                      <option value="guide">Government Tour Guide</option>
                      <option value="rental">Scooter / Bike Rental</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Quoted Price (in ₹ INR)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 350"
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button type="submit" className="w-full h-10 text-xs font-bold">
                      Check Fairness
                    </Button>
                  </div>
                </form>

                {/* Checker Evaluation Result */}
                {checkResult && (
                  <div
                    className={`mt-5 p-4 rounded-xl border text-xs leading-relaxed ${
                      checkResult.status === "fair" || checkResult.status === "great_deal"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
                        : checkResult.status === "slightly_high"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300"
                        : "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-300"
                    }`}
                  >
                    <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                      {checkResult.status === "fair" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Fair Price Verified! (₹{checkResult.reportedPriceInr})</span>
                        </>
                      ) : checkResult.status === "slightly_high" ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <span>Slightly Above Benchmark (₹{checkResult.reportedPriceInr})</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span>Potential Overcharging Warning (₹{checkResult.reportedPriceInr})</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1">{checkResult.advice}</p>
                    <div className="mt-2 text-[10px] opacity-80">
                      Standard Benchmark: ₹{checkResult.benchmarkMinInr} – ₹{checkResult.benchmarkMaxInr} • Source: {checkResult.source}
                    </div>
                  </div>
                )}
              </Card>

              {/* Price Guides Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dest.priceGuides.map((guide) => (
                  <Card key={guide.id} className="p-4 border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">{guide.itemName}</h4>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                        {guide.verificationStatus}
                      </Badge>
                    </div>
                    <div className="text-lg font-black text-primary">
                      ₹{guide.priceMinInr} – ₹{guide.priceMaxInr}{" "}
                      <span className="text-xs font-normal text-muted-foreground">({guide.unit})</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{guide.description}</p>
                    {guide.tips && (
                      <div className="text-[11px] p-2 rounded-lg bg-muted text-muted-foreground font-medium">
                        💡 Tip: {guide.tips}
                      </div>
                    )}
                    <div className="text-[10px] text-muted-foreground/80 pt-1">
                      Source: {guide.dataSource} • Last Verified: {guide.lastVerifiedAt}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 5: SCAM & SAFETY INTELLIGENCE */}
            <TabsContent value="safety" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Verified Scam Alerts & Safety Precautions</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Documented tout techniques, commission schemes, and practical prevention steps in {dest.name}.
                </p>
              </div>

              <div className="space-y-4">
                {dest.safetyAlerts.map((alert) => (
                  <Card key={alert.id} className="border-red-500/20 bg-red-500/5 p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                        <h3 className="font-bold text-base text-foreground">{alert.title}</h3>
                      </div>
                      <Badge variant="destructive" className="text-[10px] uppercase font-bold">
                        {alert.severity} Risk
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{alert.description}</p>

                    <div className="p-3 rounded-xl bg-card border border-border/80 text-xs">
                      <div className="font-bold text-primary mb-1">🛡️ How to Avoid / Protect Yourself:</div>
                      <div className="text-muted-foreground">{alert.howToAvoid}</div>
                    </div>

                    <div className="text-[10px] text-muted-foreground italic flex items-center justify-between">
                      <span>Source: {alert.dataSource}</span>
                      <span>Verified: {alert.lastVerifiedAt}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 6: EMERGENCY DIRECTORY */}
            <TabsContent value="emergency" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Emergency Helplines & Medical Trauma Centers</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  1-tap emergency dial buttons and local police & hospital coordination.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nationwide Hotlines */}
                <Card className="p-5 border-border/60 space-y-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Pan-India 24x7 Helplines</h3>
                  <div className="space-y-2">
                    {emergencyContacts.nationwide.map((em) => (
                      <div key={em.id} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/60">
                        <div>
                          <div className="font-bold text-xs">{em.name}</div>
                          <div className="text-[10px] text-muted-foreground">{em.description}</div>
                        </div>
                        <Button size="sm" variant="destructive" asChild className="rounded-lg h-7 px-3 text-xs gap-1">
                          <a href={`tel:${em.phone}`}>
                            <Phone className="h-3 w-3" />
                            <span>{em.phone}</span>
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Regional Medical & Police */}
                <Card className="p-5 border-border/60 space-y-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Regional Emergency Hubs in {dest.name}</h3>
                  <div className="space-y-2">
                    {emergencyContacts.regional.length > 0 ? (
                      emergencyContacts.regional.map((em) => (
                        <div key={em.id} className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{em.name}</span>
                            <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                              {em.category}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{em.description}</div>
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{em.stateOrCity}</span>
                            <Button size="sm" variant="outline" asChild className="h-7 text-xs gap-1">
                              <a href={`tel:${em.phone}`}>
                                <Phone className="h-3 w-3 text-primary" />
                                <span>{em.phone}</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground py-4 text-center">
                        Dial <strong>112</strong> for immediate localized dispatch in {dest.name}.
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
