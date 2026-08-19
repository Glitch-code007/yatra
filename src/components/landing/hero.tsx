"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Search, MapPin, Sparkles, ArrowRight, Compass, ShieldCheck, IndianRupee, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DestinationService } from "@/services/destination.service"

export function Hero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isFocused, setIsFocused] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val.length >= 2) {
      setSuggestions(DestinationService.getAutocompleteSuggestions(val))
    } else {
      setSuggestions([])
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const quickBadges = [
    { name: "Jaipur", slug: "jaipur", district: "Jaipur District", state: "Rajasthan" },
    { name: "Munnar", slug: "munnar-kerala", district: "Idukki District", state: "Kerala" },
    { name: "Goa", slug: "goa", district: "North & South Goa", state: "Goa" },
    { name: "Leh Ladakh", slug: "leh-ladakh", district: "Leh District", state: "Ladakh (UT)" },
    { name: "Varanasi", slug: "varanasi", district: "Varanasi District", state: "Uttar Pradesh" },
    { name: "Hampi", slug: "hampi", district: "Vijayanagara District", state: "Karnataka" },
  ]

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-12 pb-20">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Value badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>India&apos;s Intelligent Travel Decision Platform</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-tight"
        >
          Plan Better. Travel Smarter. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-600 to-amber-500">
            Explore India with Confidence.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground text-balance"
        >
          Get AI-orchestrated day-by-day itineraries, verified local price guides, multi-modal transport comparisons, scam alerts, and budget analytics across India.
        </motion.p>

        {/* Search & Planner Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mx-auto mt-10 max-w-2xl"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-card border border-border/80 shadow-2xl rounded-2xl sm:rounded-full"
          >
            <div className="relative flex-1 w-full flex items-center pl-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mr-2" />
              <Input
                type="text"
                placeholder="Type location, district, or state (e.g. Rajasthan, Idukki, Varanasi, Goa)..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                className="border-0 shadow-none focus-visible:ring-0 text-sm sm:text-base placeholder:text-muted-foreground/70"
              />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-full px-8 shadow-md gap-2">
              <Search className="h-4 w-4" />
              <span>Explore</span>
            </Button>
          </form>

          {/* Autocomplete Dropdown */}
          {isFocused && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl z-50 text-left overflow-hidden">
              {suggestions.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/explore/${item.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.subtext}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Suggestion Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs"
        >
          <span className="text-muted-foreground font-medium">Popular States & Locations:</span>
          {quickBadges.map((badge) => (
            <Link
              key={badge.slug}
              href={`/explore/${badge.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 bg-card/60 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all shadow-xs"
            >
              <span className="font-bold">{badge.name}</span>
              <span className="text-[10px] text-muted-foreground">({badge.district}, {badge.state})</span>
            </Link>
          ))}
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20 gap-2 h-12 text-base">
            <Link href="/app/plan">
              <Compass className="h-5 w-5" />
              <span>Plan My Trip (Multi-Step Wizard)</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl px-8 h-12 text-base gap-2">
            <Link href="/explore">
              <span>Browse All Destinations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-border/50 text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/40">
            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="font-bold text-sm">Verified Scam Alerts</div>
              <div className="text-xs text-muted-foreground">Tourist tout protection</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/40">
            <IndianRupee className="h-8 w-8 text-amber-500 shrink-0" />
            <div>
              <div className="font-bold text-sm">Local Price Guide</div>
              <div className="text-xs text-muted-foreground">Auto, cab & meal rates</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/40">
            <Sparkles className="h-8 w-8 text-purple-500 shrink-0" />
            <div>
              <div className="font-bold text-sm">AI Day-by-Day Plan</div>
              <div className="text-xs text-muted-foreground">Tailored to your budget</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/40">
            <Calendar className="h-8 w-8 text-blue-500 shrink-0" />
            <div>
              <div className="font-bold text-sm">Trip Journal & Real Log</div>
              <div className="text-xs text-muted-foreground">Planned vs Actual spend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
