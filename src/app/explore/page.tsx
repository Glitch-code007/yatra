"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Search, MapPin, Calendar, Sparkles, Filter, Compass, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { DestinationService } from "@/services/destination.service"
import { getAllAvailableStateDetails } from "@/data/state-directory"
import { ALL_INDIAN_STATES_AND_UTS } from "@/data/travel-matrix"

const regions = [
  { id: "all", label: "All Regions" },
  { id: "North", label: "North India" },
  { id: "South", label: "South India" },
  { id: "West", label: "West India" },
  { id: "Central", label: "Central India" },
  { id: "East", label: "East India" },
  { id: "Northeast", label: "Northeast" },
]

const tagFilters = [
  { id: "all", label: "All Styles" },
  { id: "Heritage", label: "Heritage & Forts" },
  { id: "Beach", label: "Beaches & Coastal" },
  { id: "Nature", label: "Hills & Nature" },
  { id: "Adventure", label: "Adventure & Biking" },
  { id: "Spiritual", label: "Spiritual & Sacred" },
  { id: "Romantic", label: "Romantic Getaways" },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")

  const allDestinations = useMemo(() => DestinationService.getAllDestinations(), [])

  // Filter Indian States according to selected Region and Search Query
  const filteredStates = useMemo(() => {
    let list = ALL_INDIAN_STATES_AND_UTS

    if (selectedRegion !== "all") {
      list = list.filter((s) => s.region.toLowerCase() === selectedRegion.toLowerCase())
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q) ||
          s.capitalCity?.toLowerCase().includes(q)
      )
    }

    return list
  }, [searchQuery, selectedRegion])

  // Filter Destinations according to selected Region, Tag, and Search Query
  const filteredDestinations = useMemo(() => {
    let list = allDestinations

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.district?.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // 2. Region Filter
    if (selectedRegion !== "all") {
      list = list.filter((d) => d.region.toLowerCase() === selectedRegion.toLowerCase())
    }

    // 3. Tag Filter
    if (selectedTag !== "all") {
      list = list.filter((d) => d.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()))
    }

    return list
  }, [allDestinations, searchQuery, selectedRegion, selectedTag])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pb-20">
        {/* Header Banner */}
        <div className="bg-gradient-to-b from-primary/10 via-background to-background py-12 border-b border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>India Destination Directory</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Explore Destinations Across India
              </h1>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Discover verified travel intelligence for 36 Indian States &amp; UTs — filtered by Region, District, and Location with verified attractions, authentic foods, and safety benchmarks.
              </p>
            </div>

            {/* Search Bar (SortBy removed) */}
            <div className="mt-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search Indian states, destinations, districts, or attractions (e.g. Rajasthan, North, Munnar, Goa, Taj Mahal)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-sm bg-card shadow-xs rounded-xl border-border/80"
                />
              </div>
            </div>

            {/* Region Tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-primary" /> Segregate by Region:
              </span>
              {regions.map((r) => {
                const count =
                  r.id === "all"
                    ? ALL_INDIAN_STATES_AND_UTS.length
                    : ALL_INDIAN_STATES_AND_UTS.filter((s) => s.region.toLowerCase() === r.id.toLowerCase()).length

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegion(r.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedRegion === r.id
                        ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40"
                        : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/50"
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      selectedRegion === r.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Style / Tag Filter Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Filter by Style:</span>
              {tagFilters.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTag(t.id)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    selectedTag === t.id
                      ? "bg-secondary text-secondary-foreground font-semibold border border-primary/40"
                      : "bg-transparent text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Browse by State Section (Segregated by Region) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>
                  Popular Places by State ({filteredStates.length} {selectedRegion === "all" ? "States & UTs across India" : `${selectedRegion} States & UTs`})
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Click any state below to view its popular tourist places listed line-by-line with famous food &amp; speciality of each place.
              </p>
            </div>
          </div>

          {filteredStates.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/40 my-4">
              <p className="text-sm text-muted-foreground">No states found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {filteredStates.map((stateItem) => {
                const stateSlug = stateItem.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
                const hasDetail = getAllAvailableStateDetails().some((s) => s.stateSlug === stateSlug || s.stateName === stateItem.name)
                return (
                  <Link
                    key={stateItem.name}
                    href={`/explore/state/${stateSlug}`}
                    className={`p-3 rounded-xl text-xs font-medium text-left border transition-all flex flex-col justify-between gap-1 group hover:border-primary hover:bg-primary/5 hover:shadow-sm ${
                      hasDetail ? "bg-card border-border/80 ring-1 ring-primary/20" : "bg-muted/30 border-border/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-bold text-foreground text-[12px] group-hover:text-primary transition-colors truncate">{stateItem.name}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{stateItem.type} • {stateItem.region} India</div>
                    </div>
                    {hasDetail ? (
                      <div className="text-[10px] text-primary font-bold mt-1 flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>Places & Food Guide</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-0.5">
                        <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                        <span>Explore State</span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-medium text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filteredDestinations.length}</span> destinations in {selectedRegion === "all" ? "All Regions" : `${selectedRegion} India`}
            </div>
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40 my-8">
              <Compass className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-bold">No destinations match your criteria</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Try searching for a different keyword or resetting your region and style filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedRegion("all")
                  setSelectedTag("all")
                }}
                className="mt-4"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredDestinations.map((dest) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    key={dest.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Destination Image Cover */}
                    <div className="relative h-56 w-full overflow-hidden bg-muted">
                      <SafeImage
                        src={dest.primaryImageUrl || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"}
                        alt={dest.name}
                        fallbackTitle={dest.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md border-0 text-[11px] font-semibold">
                          State: {dest.state} • {dest.district}
                        </Badge>
                      </div>

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

                      {/* Tag pills */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {dest.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
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
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
