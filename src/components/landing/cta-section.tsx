"use client"

import Link from "next/link"
import { Compass, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-primary to-emerald-800 px-8 py-16 text-center text-white shadow-2xl">
          {/* Subtle decorative circles */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ready for your next Indian adventure?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Start Planning Your Custom Trip in Under 2 Minutes
            </h2>

            <p className="mt-4 text-sm sm:text-base text-zinc-100/90 leading-relaxed">
              No sign-up required to explore. Create your custom day-by-day itinerary, analyze train vs flight options, and get verified local price benchmarks today.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-xl bg-white text-primary hover:bg-zinc-100 font-bold px-8 h-12 shadow-lg">
                <Link href="/app/plan" className="gap-2">
                  <Compass className="h-5 w-5" />
                  <span>Launch Trip Planner</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 h-12">
                <Link href="/explore" className="gap-2">
                  <span>Explore 12+ Destinations</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
