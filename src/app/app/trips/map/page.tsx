"use client"

import { useState } from "react"
import Link from "next/link"
import { Map, MapPin, Compass, ArrowRight, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { INDIAN_DESTINATIONS } from "@/data/destinations"

export default function TripMapPage() {
  const [selectedDest, setSelectedDest] = useState(INDIAN_DESTINATIONS[0])

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Map className="h-3.5 w-3.5" />
            <span>Interactive India Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pan-India Destination Geospatial Map</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Geographic directory covering all Indian States, Union Territories, and verified destination zones.
          </p>
        </div>

        <Button asChild size="sm" className="font-bold gap-1.5 shadow-sm">
          <Link href="/app/plan">
            <span>Plan Journey on Map</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Grid of Regions & Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDIAN_DESTINATIONS.map((dest) => (
          <Card key={dest.id} className="p-5 border-border/60 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-[10px] font-bold">
                  State: {dest.state}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {dest.latitude?.toFixed(2)}° N, {dest.longitude?.toFixed(2)}° E
                </span>
              </div>
              <h3 className="font-bold text-base">{dest.name}</h3>
              <div className="text-xs text-primary font-medium mt-0.5">District: {dest.district}</div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{dest.shortDescription}</p>
            </div>

            <Button asChild size="sm" variant="outline" className="w-full text-xs font-bold gap-1.5">
              <Link href={`/explore/${dest.slug}`}>
                <span>View Full Map & Guide</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
