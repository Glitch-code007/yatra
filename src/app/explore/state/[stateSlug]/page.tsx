"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  MapPin,
  Utensils,
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  IndianRupee,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Share2,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { getStateDetailBySlug } from "@/data/state-directory"
import { ALL_INDIAN_STATES_AND_UTS } from "@/data/travel-matrix"
import { toast } from "sonner"

export default function StateDetailPage({
  params,
}: {
  params: Promise<{ stateSlug: string }>
}) {
  const resolvedParams = use(params)
  const stateData = getStateDetailBySlug(resolvedParams.stateSlug)

  if (!stateData) {
    // If not found in detailed records, check if valid state and render generic guide
    const stateObj = ALL_INDIAN_STATES_AND_UTS.find(
      (s) => s.name.toLowerCase().replace(/[^a-z0-9]/g, "") === resolvedParams.stateSlug.toLowerCase().replace(/[^a-z0-9]/g, "")
    )
    if (!stateObj) {
      notFound()
    }

    // Render a coming-soon page for valid states without detailed place listings
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 pb-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-6 pb-2">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to All Indian States & Destinations</span>
            </Link>
          </div>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8 text-center space-y-6">
            <div className="p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-teal-500/5 to-amber-500/10 border border-border/60">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl sm:text-4xl font-black">{stateObj.name}</h1>
              <p className="text-sm text-muted-foreground mt-2">{stateObj.type} • {stateObj.region} India</p>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border/40 inline-block">
                <Sparkles className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Detailed Tourist Places & Food Guide Coming Soon!</p>
                <p className="text-xs text-muted-foreground mt-1">We are curating the best places, authentic food spots, and specialities for {stateObj.name}.</p>
              </div>
              <div className="mt-6">
                <Button asChild size="lg" className="rounded-xl font-bold gap-2">
                  <Link href={`/app/plan?state=${resolvedParams.stateSlug}`}>
                    <Compass className="h-4 w-4" />
                    <span>Plan a Trip to {stateObj.name}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("State tourist guide link copied to clipboard!")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pb-24">
        {/* Navigation Breadcrumb */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Indian States & Destinations</span>
          </Link>
        </div>

        {/* State Hero Banner */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-teal-500/10 to-amber-500/10 border border-border/60 p-6 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase px-3 py-1">
                    {stateData?.region || "India"} Region
                  </Badge>
                  <Badge variant="outline" className="text-xs font-semibold">
                    Capital: {stateData?.capital || "State Capital"}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-semibold">
                    Best Season: {stateData?.bestSeason || "October to March"}
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {stateData?.stateName} Tourist Places & Culinary Guide
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {stateData?.overview}
                </p>

                {stateData?.stateSpeciality && (
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary pt-1">
                    <Sparkles className="h-4 w-4" />
                    <span>State Speciality: {stateData.stateSpeciality}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <Button size="lg" asChild className="rounded-xl font-bold shadow-md gap-2">
                  <Link href={`/app/plan?state=${stateData?.stateSlug || resolvedParams.stateSlug}&dest=${stateData?.places[0]?.destinationSlug || stateData?.stateSlug || resolvedParams.stateSlug}`}>
                    <Compass className="h-4 w-4" />
                    <span>Plan Trip to {stateData?.stateName}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="text-xs gap-1.5 rounded-xl">
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share State Guide</span>
                </Button>
              </div>
            </div>

            {/* Signature State Dishes Banner */}
            {stateData?.signatureStateDishes && (
              <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-foreground shrink-0">
                  <Utensils className="h-4 w-4 text-amber-500" />
                  <span>Must-Eat State Delicacies:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stateData.signatureStateDishes.map((dish, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-background/80 border border-border/80 text-foreground font-semibold text-[11px] shadow-xs"
                    >
                      🍴 {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LINE-BY-LINE POPULAR TOURIST PLACES SECTION */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
          <div className="border-b border-border/60 pb-4">
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Popular Places & Attractions in {stateData?.stateName} (Listed Line by Line)</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Detailed breakdown of each destination with its unique architectural/natural speciality, authentic food dishes, and visiting advice.
            </p>
          </div>

          {/* Line by Line Cards */}
          <div className="space-y-6">
            {stateData?.places.map((place, index) => (
              <Card
                key={place.id}
                className="overflow-hidden border-border/70 shadow-sm hover:shadow-xl transition-all duration-300 bg-card rounded-2xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left Column: Image & Badges (4 cols) */}
                  <div className="relative h-64 lg:h-auto lg:col-span-4 bg-muted min-h-[220px]">
                    <SafeImage
                      src={place.imageUrl}
                      alt={place.name}
                      fallbackTitle={place.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                    
                    {/* Index Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-xs shadow-md">
                        #{index + 1}
                      </span>
                      <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md text-[10px] font-bold">
                        {place.category}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white lg:hidden">
                      <h3 className="text-lg font-bold">{place.name}</h3>
                      <div className="text-xs text-amber-300 font-semibold">{place.district}</div>
                    </div>
                  </div>

                  {/* Right Column: Place Details, Speciality & Famous Food (8 cols) */}
                  <div className="p-6 lg:col-span-8 flex flex-col justify-between space-y-5">
                    <div>
                      {/* Header Title & District */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
                        <div>
                          <div className="hidden lg:flex items-center gap-2 mb-1">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-extrabold text-[11px]">
                              {index + 1}
                            </span>
                            <Badge variant="outline" className="text-[10px] font-bold text-primary uppercase">
                              {place.category}
                            </Badge>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-foreground">{place.name}</h3>
                          <div className="text-xs font-bold text-primary flex items-center gap-1.5 mt-0.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>District: {place.district} • State: {stateData.stateName}</span>
                          </div>
                        </div>

                        {place.destinationSlug && (
                          <Button asChild size="sm" variant="default" className="text-xs font-bold gap-1 rounded-xl shadow-xs shrink-0">
                            <Link href={`/explore/${place.destinationSlug}`}>
                              <span>Full Guide</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}
                      </div>

                      {/* 1. SPECIALITY SECTION */}
                      <div className="mt-4 space-y-1.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Speciality & Significance:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                          {place.speciality}
                        </p>
                      </div>

                      {/* 2. FAMOUS FOOD OF THIS PLACE */}
                      <div className="mt-4 space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <Utensils className="h-3.5 w-3.5" />
                          <span>Famous Food & Authentic Delicacies to Try:</span>
                        </div>
                        
                        <div className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/20 space-y-2 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            {place.famousFood.dishes.map((dish, dIdx) => (
                              <Badge key={dIdx} className="bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-0.5">
                                🍲 {dish}
                              </Badge>
                            ))}
                            <span className="text-[11px] text-muted-foreground font-semibold">
                              (Avg: ~₹{place.famousFood.avgCostInr} per person)
                            </span>
                          </div>

                          <p className="text-muted-foreground leading-relaxed">
                            {place.famousFood.description}
                          </p>

                          <div className="text-[11px] text-foreground font-medium pt-1">
                            📍 <strong>Famous Local Spots:</strong> {place.famousFood.famousSpots}
                          </div>
                        </div>
                      </div>

                      {/* 3. KEY HIGHLIGHTS PILLS */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {place.highlights.map((highlight, hIdx) => (
                          <span
                            key={hIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-[11px] font-medium text-muted-foreground border border-border/40"
                          >
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                            <span>{highlight}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata & Visiting Hours */}
                    <div className="pt-4 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl mt-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span><strong>Timings:</strong> {place.timings}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span><strong>Entry:</strong> {place.entryFee}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                        <span><strong>Best Time:</strong> {place.bestTimeToVisit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
