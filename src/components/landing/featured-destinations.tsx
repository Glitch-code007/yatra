"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { DestinationService } from "@/services/destination.service"

const filterTabs = [
  { id: "all", label: "All Destinations" },
  { id: "Heritage", label: "Heritage & Forts" },
  { id: "Beach", label: "Beaches & Coastal" },
  { id: "Nature", label: "Hills & Nature" },
  { id: "Adventure", label: "High Pass Adventure" },
  { id: "Spiritual", label: "Spiritual & Sacred" },
]

export function FeaturedDestinations() {
  const [activeTab, setActiveTab] = useState("all")
  const allDestinations = DestinationService.getAllDestinations()

  const filtered =
    activeTab === "all"
      ? allDestinations
      : allDestinations.filter((d) => d.tags.some((t) => t.toLowerCase() === activeTab.toLowerCase()))

  return (
    <section className="py-20 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated India Travel Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Featured Iconic Destinations
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl text-sm sm:text-base">
              Explore royal palaces, sunlit beaches, misty Western Ghats, and high-altitude Himalayan passes with verified factual intelligence.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 gap-2">
            <Link href="/explore">
              <span>View All 12+ Destinations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Destination Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((dest) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={dest.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <SafeImage
                    src={dest.primaryImageUrl || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"}
                    alt={dest.name}
                    fallbackTitle={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* District & State Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md border-0 text-[11px] font-semibold">
                      State: {dest.state} • {dest.district}
                    </Badge>
                  </div>

                  {/* Title overlay on image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">{dest.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-200 mt-0.5">
                      <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                      <span>{dest.district}, {dest.state}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {dest.shortDescription || dest.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {dest.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {dest.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground self-center">
                        +{dest.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                    <Link
                      href={`/explore/${dest.slug}`}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Button size="sm" asChild className="rounded-lg text-xs h-8 px-3">
                      <Link href={`/app/plan?dest=${dest.slug}`}>
                        <span>Plan Trip</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
