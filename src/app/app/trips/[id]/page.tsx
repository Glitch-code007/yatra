"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import {
  Compass,
  Calendar,
  IndianRupee,
  Users,
  MapPin,
  Train,
  Plane,
  Bus,
  Car,
  BookOpen,
  PieChart as PieIcon,
  Sparkles,
  Share2,
  FileText,
  Clock,
  ArrowLeft,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TripStorageService } from "@/services/trip-storage.service"
import { Trip } from "@/types"
import { toast } from "sonner"

export default function TripWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)

  useEffect(() => {
    const data = TripStorageService.getTripById(resolvedParams.id)
    setTrip(data)
  }, [resolvedParams.id])

  if (!trip) {
    return (
      <div className="p-12 text-center space-y-4">
        <Compass className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-bold">Trip not found or loading...</h2>
        <Button asChild variant="outline">
          <Link href="/app/trips">Back to My Trips</Link>
        </Button>
      </div>
    )
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Trip link copied to clipboard!")
    }
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this trip?")) {
      TripStorageService.deleteTrip(trip.id)
      toast.success("Trip deleted.")
      router.push("/app/trips")
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back Link */}
      <div>
        <Link
          href="/app/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to My Trips</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                {trip.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {trip.originName} → {trip.destinationName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {trip.startDate} to {trip.endDate} ({trip.numDays} Days)
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                {trip.numTravelers} Traveler(s)
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-amber-500" />
                Budget: ₹{trip.totalBudgetInr?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="text-xs gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
              <Link href={`/app/trips/${trip.id}/summary`}>
                <FileText className="h-3.5 w-3.5" />
                <span>Summary Report</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="text-xs gap-1.5 font-bold">
              <Link href={`/app/trips/${trip.id}/journal`}>
                <BookOpen className="h-3.5 w-3.5" />
                <span>Open Trip Journal</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="itinerary" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 rounded-xl">
          <TabsTrigger value="itinerary" className="text-xs font-semibold px-4 gap-1.5">
            <Compass className="h-3.5 w-3.5" />
            <span>Daily Itinerary</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-xs font-semibold px-4 gap-1.5">
            <PieIcon className="h-3.5 w-3.5" />
            <span>Budget Split</span>
          </TabsTrigger>
          <TabsTrigger value="transport" className="text-xs font-semibold px-4 gap-1.5">
            <Train className="h-3.5 w-3.5" />
            <span>Travel Mode</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ITINERARY */}
        <TabsContent value="itinerary" className="space-y-6">
          {trip.itinerary?.days && trip.itinerary.days.length > 0 ? (
            <div className="space-y-6">
              {trip.itinerary.days.map((day: any) => (
                <Card key={day.dayNumber} className="border-border/60 overflow-hidden shadow-xs">
                  <CardHeader className="bg-muted/40 p-4 border-b border-border/40 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold">{day.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {day.date} • Suggested Stay Area: {day.accommodationArea}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs font-bold">
                      Est: ₹{day.estimatedDayCostInr.toLocaleString()}
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    {day.activities.map((act: any) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-all space-y-1"
                      >
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
          ) : (
            <p className="text-xs text-muted-foreground">No itinerary details recorded.</p>
          )}
        </TabsContent>

        {/* TAB 2: BUDGET BREAKDOWN */}
        <TabsContent value="budget" className="space-y-6">
          {trip.budgetBreakdown ? (
            <Card className="p-6 border-border/60 space-y-6 max-w-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Category-wise Budget Split</h3>
                <Badge variant={trip.budgetBreakdown.isOverBudget ? "destructive" : "secondary"}>
                  {trip.budgetBreakdown.isOverBudget ? "Over Budget" : "Within Budget"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/60 text-xs">
                <div>
                  <span className="text-muted-foreground text-[10px]">User Budget</span>
                  <div className="font-bold text-base">₹{trip.budgetBreakdown.totalBudget.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px]">Estimated Cost</span>
                  <div className="font-bold text-base text-primary">₹{trip.budgetBreakdown.estimatedTotal.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px]">Remaining Buffer</span>
                  <div className="font-bold text-base text-emerald-600">₹{trip.budgetBreakdown.remainingBudget.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-4">
                {trip.budgetBreakdown.categories.map((cat: any) => (
                  <div key={cat.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">{cat.name}</span>
                      <span className="font-semibold text-muted-foreground">
                        ₹{cat.allocatedAmount.toLocaleString()} ({cat.percentageOfTotal}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, cat.percentageOfTotal)}%`, backgroundColor: cat.color }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground">{cat.description}</div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <p className="text-xs text-muted-foreground">No budget breakdown available.</p>
          )}
        </TabsContent>

        {/* TAB 3: TRAVEL MODE */}
        <TabsContent value="transport" className="space-y-6">
          <Card className="p-6 border-border/60 max-w-2xl space-y-4">
            <h3 className="font-bold text-lg capitalize">
              Selected Mode: {trip.selectedTravelMode || "Multi-Modal"} Transit
            </h3>
            <p className="text-xs text-muted-foreground">
              Transit routes connecting {trip.originName} to {trip.destinationName}.
            </p>
            <div className="p-4 rounded-xl bg-muted/60 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Travel Style Preference:</span>
                <span className="font-bold capitalize">{trip.travelPreference || "Balanced"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking Advice:</span>
                <span className="font-bold">Book via official IRCTC / Airline counters.</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
