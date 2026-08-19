"use client"

import { Compass, Train, CalendarCheck, ShieldAlert, Sparkles, BookOpen } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Discover & Choose",
    description: "Browse curated Indian destinations with authentic climate records, attractions, local cuisines, and realistic seasonal tips.",
    icon: Compass,
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    step: "02",
    title: "Multi-Modal Travel Decision",
    description: "Compare Train (Vande Bharat/Express), Flight, Volvo Bus, and Outstation Cab with true costs and travel times from your home city.",
    icon: Train,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    step: "03",
    title: "Generate AI Itinerary & Budget",
    description: "Receive a tailored day-by-day plan with morning, lunch, afternoon, and evening slots matched to your budget allocation.",
    icon: CalendarCheck,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    step: "04",
    title: "Scam Defense & Price Check",
    description: "Access verified auto fare benchmarks, tourist scam warnings, and one-tap emergency helplines wherever you are.",
    icon: ShieldAlert,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    step: "05",
    title: "Capture Real Trip & Compare",
    description: "Record actual expenses and visited spots on the go. Compare Planned vs. Actual spending and export your travel memory card.",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>End-to-End Travel Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How Yatra Works
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            From initial destination inspiration to live on-ground safety and post-trip expense reconciliation — you stay in complete control of every decision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="relative flex flex-col p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-black text-muted-foreground/30 font-mono">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
