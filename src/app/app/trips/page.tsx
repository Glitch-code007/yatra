"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Compass,
  Briefcase,
  Calendar,
  IndianRupee,
  Users,
  Plus,
  Trash2,
  ArrowRight,
  BookOpen,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TripStorageService } from "@/services/trip-storage.service"
import { Trip } from "@/types"
import { toast } from "sonner"

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    setTrips(TripStorageService.getAllTrips())
  }, [])

  const handleDeleteTrip = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this trip?")) {
      TripStorageService.deleteTrip(id)
      setTrips(TripStorageService.getAllTrips())
      toast.success("Trip deleted.")
    }
  }

  const filteredTrips = trips.filter((t) => {
    if (filterStatus === "all") return true
    return t.status === filterStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Trip Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Saved Trips</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your planned, ongoing, and completed Indian journeys.
          </p>
        </div>

        <Button asChild size="lg" className="rounded-xl font-bold gap-2 shadow-md">
          <Link href="/app/plan">
            <Plus className="h-4 w-4" />
            <span>Plan New Trip</span>
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["all", "planned", "ongoing", "completed"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === st
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {st === "all" ? `All Trips (${trips.length})` : st}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20 my-8">
          <Compass className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold">No trips found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {filterStatus === "all"
              ? "You haven't created any trips yet. Launch our trip planner to build your custom itinerary in 2 minutes."
              : `No trips with status "${filterStatus}".`}
          </p>
          <Button asChild size="sm" className="mt-4 font-bold">
            <Link href="/app/plan">Plan a Trip Now</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTrips.map((trip) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={trip.id}
              >
                <Card className="overflow-hidden border-border/60 hover:shadow-lg transition-all flex flex-col justify-between h-full">
                  <div>
                    <CardHeader className="bg-muted/40 p-4 border-b border-border/40">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                          {trip.status}
                        </Badge>
                        <button
                          onClick={(e) => handleDeleteTrip(trip.id, e)}
                          className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                          title="Delete trip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <CardTitle className="text-base font-bold line-clamp-1">{trip.title}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span>{trip.startDate} ({trip.numDays} Days)</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-card border border-border/60">
                        <div>
                          <span className="text-[10px] text-muted-foreground">Budget</span>
                          <div className="font-bold text-foreground">₹{trip.totalBudgetInr?.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground">Estimated Cost</span>
                          <div className="font-bold text-primary">₹{trip.estimatedCostInr?.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span>Route: {trip.originName} → {trip.destinationName}</span>
                        <span>{trip.numTravelers} Traveler(s)</span>
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-4 pt-0 border-t border-border/40 flex items-center justify-between gap-2 mt-3">
                    <Button asChild variant="outline" size="sm" className="text-xs h-8 gap-1 flex-1">
                      <Link href={`/app/trips/${trip.id}/journal`}>
                        <BookOpen className="h-3 w-3" />
                        <span>Journal</span>
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="text-xs h-8 gap-1 flex-1 font-bold">
                      <Link href={`/app/trips/${trip.id}`}>
                        <span>Workspace</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
