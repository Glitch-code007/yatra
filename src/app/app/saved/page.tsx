"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bookmark, Compass, Trash2, ArrowRight, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TripStorageService } from "@/services/trip-storage.service"
import { toast } from "sonner"

export default function SavedPlacesPage() {
  const [savedPlaces, setSavedPlaces] = useState<any[]>([])

  useEffect(() => {
    setSavedPlaces(TripStorageService.getSavedPlaces())
  }, [])

  const handleRemove = (place: any) => {
    TripStorageService.toggleSavedPlace(place)
    setSavedPlaces(TripStorageService.getSavedPlaces())
    toast.info(`Removed "${place.name}" from saved bookmarks.`)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <Bookmark className="h-3.5 w-3.5" />
          <span>My Collection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Saved Places & Bookmarks</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          All your bookmarked heritage monuments, restaurants, and scenic viewpoints across India.
        </p>
      </div>

      {savedPlaces.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20 my-8">
          <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold">No saved places yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Browse our verified destination guides and click &quot;Bookmark&quot; on any attraction or food spot to save it here.
          </p>
          <Button asChild size="sm" className="mt-4 font-bold">
            <Link href="/explore">Explore Destinations</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlaces.map((place) => (
            <Card key={place.id} className="overflow-hidden border-border/60 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                {place.imageUrl && (
                  <div className="relative h-44 w-full bg-muted">
                    <Image
                      src={place.imageUrl}
                      alt={place.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md text-[10px] uppercase font-bold">
                        {place.category}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold">{place.name}</CardTitle>
                    <button
                      onClick={() => handleRemove(place)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      title="Remove bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <CardDescription className="text-xs capitalize">
                    Located in {place.destinationSlug}
                  </CardDescription>
                </CardHeader>
              </div>

              <div className="p-4 pt-0 border-t border-border/40 flex items-center justify-between mt-3">
                <Button asChild size="sm" variant="outline" className="w-full text-xs font-bold gap-1">
                  <Link href={`/explore/${place.destinationSlug}`}>
                    <span>View Destination Guide</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
