"use client"

import { useState } from "react"
import {
  Siren,
  Phone,
  Hospital,
  Shield,
  Train,
  HeartHandshake,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NATIONWIDE_EMERGENCY_NUMBERS, REGIONAL_EMERGENCY_HUBS } from "@/data/emergency-directory"
import { INDIAN_DESTINATIONS } from "@/data/destinations"

export default function EmergencyServicesPage() {
  const [selectedHub, setSelectedHub] = useState("jaipur")
  const regionalHub = REGIONAL_EMERGENCY_HUBS[selectedHub] || []

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
          <Siren className="h-3.5 w-3.5" />
          <span>24x7 Emergency Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Emergency Helplines & Medical Trauma Centers
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
          Quick-dial hotlines for Police, Ambulance, Women Safety, Tourist Assistance, and localized hospital trauma hubs.
        </p>
      </div>

      {/* Critical Hotlines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NATIONWIDE_EMERGENCY_NUMBERS.map((item) => (
          <Card key={item.id} className="p-5 border-border/60 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={item.priority === "critical" ? "destructive" : "secondary"} className="text-[10px] uppercase font-bold">
                  {item.category}
                </Badge>
                {item.tollFree && <span className="text-[10px] text-emerald-600 font-bold">Toll Free</span>}
              </div>
              <h3 className="font-bold text-base">{item.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            <Button asChild size="lg" className="w-full font-bold gap-2 text-sm h-11 bg-rose-600 hover:bg-rose-700 text-white shadow-md">
              <a href={`tel:${item.phone}`}>
                <Phone className="h-4 w-4" />
                <span>Call Helpline {item.phone}</span>
              </a>
            </Button>
          </Card>
        ))}
      </div>

      {/* Regional Destination Emergency Centers */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Regional Trauma Hospitals & Tourist Police</h2>
            <p className="text-xs text-muted-foreground">Select destination to locate nearest emergency trauma centers.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INDIAN_DESTINATIONS.map((d) => (
              <button
                key={d.slug}
                onClick={() => setSelectedHub(d.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedHub === d.slug
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card border border-border/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regionalHub.length > 0 ? (
            regionalHub.map((hub) => (
              <Card key={hub.id} className="p-5 border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{hub.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                    {hub.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{hub.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground">{hub.stateOrCity}</span>
                  <Button asChild size="sm" variant="outline" className="text-xs font-bold gap-1.5 h-8">
                    <a href={`tel:${hub.phone}`}>
                      <Phone className="h-3 w-3 text-primary" />
                      <span>{hub.phone}</span>
                    </a>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center text-xs text-muted-foreground md:col-span-2 border-dashed">
              For emergency dispatch in {selectedHub.toUpperCase()}, dial unified helpline <strong>112</strong> immediately.
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
