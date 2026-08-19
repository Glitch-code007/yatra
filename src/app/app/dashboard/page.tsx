"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Compass,
  Calendar,
  Briefcase,
  Sparkles,
  ArrowRight,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Plus,
  BookOpen,
  Bookmark,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TripStorageService } from "@/services/trip-storage.service"
import { DestinationService } from "@/services/destination.service"
import { Trip } from "@/types"

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [savedPlaces, setSavedPlaces] = useState<any[]>([])
  const featuredDestinations = DestinationService.getFeaturedDestinations().slice(0, 3)

  useEffect(() => {
    setTrips(TripStorageService.getAllTrips())
    setSavedPlaces(TripStorageService.getSavedPlaces())
  }, [])

  const activeTrip = trips.find((t) => t.status === "ongoing" || t.status === "planned") || trips[0]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-primary to-emerald-800 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>Welcome to your India Travel Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Where to next in Incredible India?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 max-w-xl">
            You have <strong className="text-white">{trips.length} saved trip(s)</strong> and{" "}
            <strong className="text-white">{savedPlaces.length} bookmarked place(s)</strong> in your travel planner.
          </p>
        </div>

        <Button asChild size="lg" className="bg-white text-primary hover:bg-zinc-100 font-bold rounded-xl shadow-lg gap-2 shrink-0">
          <Link href="/app/plan">
            <Plus className="h-4 w-4" />
            <span>Plan New Trip</span>
          </Link>
        </Button>
      </div>

      {/* Overview Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Trips</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold mt-2">{trips.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Planned & In Progress</div>
        </Card>

        <Card className="p-4 border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Saved Places</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold mt-2">{savedPlaces.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Bookmarks & Stays</div>
        </Card>

        <Card className="p-4 border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Verified Destinations</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold mt-2">12+</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">All India Zones</div>
        </Card>

        <Card className="p-4 border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Safety & Scam Alerts</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold mt-2">100%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Verified Intelligence</div>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active / Upcoming Trip Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Upcoming / Recent Trip</h2>
            <Link href="/app/trips" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>View All Trips ({trips.length})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {activeTrip ? (
            <Card className="overflow-hidden border-border/60 shadow-md">
              <CardHeader className="bg-muted/40 p-5 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-1 text-[10px] uppercase font-bold">
                    {activeTrip.status}
                  </Badge>
                  <CardTitle className="text-xl font-bold">{activeTrip.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {activeTrip.originName} → {activeTrip.destinationName} • {activeTrip.numDays} Days ({activeTrip.startDate})
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="rounded-xl font-bold text-xs">
                  <Link href={`/app/trips/${activeTrip.id}`}>
                    <span>Open Workspace</span>
                  </Link>
                </Button>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-card border border-border/60 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Total Budget</span>
                    <div className="font-extrabold text-sm text-foreground">₹{activeTrip.totalBudgetInr?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Estimated Cost</span>
                    <div className="font-extrabold text-sm text-primary">₹{activeTrip.estimatedCostInr?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Travelers</span>
                    <div className="font-extrabold text-sm text-foreground">{activeTrip.numTravelers} Person(s)</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
                    <Link href={`/app/trips/${activeTrip.id}`}>
                      <Compass className="h-3.5 w-3.5" />
                      <span>View Daily Itinerary</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
                    <Link href={`/app/trips/${activeTrip.id}/journal`}>
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Trip Journal & Real Spend</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
                    <Link href={`/app/prices`}>
                      <IndianRupee className="h-3.5 w-3.5" />
                      <span>Price Checker</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center border-dashed border-border/80 bg-muted/20">
              <Compass className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-bold text-base">No trips planned yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Create your first trip in under 2 minutes with AI itinerary generation and budget calculations.
              </p>
              <Button asChild size="sm" className="mt-4 font-bold">
                <Link href="/app/plan">Plan a Trip Now</Link>
              </Button>
            </Card>
          )}

          {/* Quick Tools Access */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link
              href="/app/prices"
              className="p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Local Price Guide</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Check verified auto fares and meal benchmarks.</p>
              </div>
            </Link>

            <Link
              href="/app/safety"
              className="p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Scam Intelligence</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Common tourist traps and safety precautions.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Recommended Destinations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Top Recommendations</h2>
            <Link href="/explore" className="text-xs text-primary font-semibold hover:underline">
              Explore All
            </Link>
          </div>

          <div className="space-y-3">
            {featuredDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/explore/${dest.slug}`}
                className="group flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0">
                  <Image
                    src={dest.primaryImageUrl || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=200&q=80"}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate text-foreground">{dest.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{dest.state} • {dest.region}</div>
                  <div className="text-[10px] text-amber-600 font-medium mt-0.5">Best: {dest.bestTimeToVisit}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
