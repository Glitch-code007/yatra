"use client"

import {
  Sparkles,
  IndianRupee,
  ShieldCheck,
  MapPin,
  Bot,
  PieChart,
  Siren,
  FileCheck2,
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI Itinerary Orchestrator",
    description: "Generate complete day-by-day plans sequenced logically by proximity and opening hours. Adjust with one click (Cheaper, More Nature, More Food).",
    badge: "Intelligent Engine",
    color: "text-primary bg-primary/10",
  },
  {
    icon: IndianRupee,
    title: "Local Price Guide & Fare Checker",
    description: "Know what autos, meals, taxis, and boat rides actually cost before you pay. Use our interactive price evaluator to avoid tourist markup.",
    badge: "Verified Rates",
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Destination Scam Intelligence",
    description: "Real-world database of common tout tactics, gem scams, and commission diversion risks with verified prevention advice.",
    badge: "Safety First",
    color: "text-red-600 bg-red-500/10",
  },
  {
    icon: PieChart,
    title: "Dynamic Budget Allocator",
    description: "Smart category-wise budget breakdowns for transport, stays, dining, and activities with interactive visual charts.",
    badge: "Financial Control",
    color: "text-purple-600 bg-purple-500/10",
  },
  {
    icon: Siren,
    title: "1-Tap Emergency & Safety Directory",
    description: "Instant access to Women in Distress (1091), Tourist Police (1363), Ambulance (108), and localized hospital & trauma centers.",
    badge: "Pan-India 24x7",
    color: "text-rose-600 bg-rose-500/10",
  },
  {
    icon: Bot,
    title: "Context-Aware AI Travel Assistant",
    description: "Ask questions grounded in our verified database: 'What should I eat in Varanasi?', 'How to avoid touts in Jaipur?', or 'Is ₹500 fair for this auto?'",
    badge: "Grounded Facts",
    color: "text-blue-600 bg-blue-500/10",
  },
  {
    icon: FileCheck2,
    title: "Planned vs. Actual Trip Journal",
    description: "Log real expenditures and visited locations during your journey. Review comprehensive budget variances and export your travel memory card.",
    badge: "Trip Capture",
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    icon: MapPin,
    title: "Interactive Category Map",
    description: "Explore attractions, authentic food joints, accommodations, and nearby emergency services mapped with clear pins and distance filters.",
    badge: "Spatial Navigation",
    color: "text-cyan-600 bg-cyan-500/10",
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-muted/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Not a Basic Booking Site</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built for Smart Decision-Making in India
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            We don&apos;t force automatic bookings or affiliate clutter. Yatra gives you the factual intelligence, budget transparency, and safety tools to travel on your own terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 rounded-2xl border border-border/60 bg-card hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
