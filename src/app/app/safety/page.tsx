"use client"

import { useState } from "react"
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Phone,
  HelpCircle,
  Lock,
  HeartHandshake,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { INDIAN_DESTINATIONS } from "@/data/destinations"
import { SafetyService, PAN_INDIA_SAFETY_TIPS } from "@/services/safety.service"

export default function SafetyAlertsPage() {
  const [selectedDestination, setSelectedDestination] = useState("jaipur")
  const localAlerts = SafetyService.getSafetyAlertsByDestination(selectedDestination)

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Scam & Safety Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          India Scam Defense & Safety Alerts Directory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
          Documented tourist traps, commission tout schemes, and practical street-smart guidelines verified across Indian destinations.
        </p>
      </div>

      {/* Destination Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {INDIAN_DESTINATIONS.map((d) => (
          <button
            key={d.slug}
            onClick={() => setSelectedDestination(d.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDestination === d.slug
                ? "bg-red-600 text-white shadow-sm"
                : "bg-card border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Localized Destination Scams */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Documented Scam Warnings for {selectedDestination.toUpperCase()}</h2>

        {localAlerts.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No critical active scam alerts recorded for this destination.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localAlerts.map((alert) => (
              <Card key={alert.id} className="p-5 border-red-500/20 bg-red-500/5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    <h3 className="font-bold text-base text-foreground">{alert.title}</h3>
                  </div>
                  <Badge variant="destructive" className="text-[10px] uppercase font-bold">
                    {alert.severity} Risk
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{alert.description}</p>

                <div className="p-3 rounded-xl bg-card border border-border/80 text-xs">
                  <div className="font-bold text-primary mb-1">🛡️ How to Avoid / Protect Yourself:</div>
                  <div className="text-muted-foreground">{alert.howToAvoid}</div>
                </div>

                <div className="text-[10px] text-muted-foreground italic flex items-center justify-between">
                  <span>Source: {alert.dataSource}</span>
                  <span>Verified: {alert.lastVerifiedAt}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pan-India Travel Rules */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h2 className="text-lg font-bold">Pan-India Street-Smart Travel Guidelines</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAN_INDIA_SAFETY_TIPS.map((tip, idx) => (
            <Card key={idx} className="p-5 border-border/60 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>{tip.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
              <div className="p-2.5 rounded-lg bg-muted/60 text-[11px] font-medium text-muted-foreground">
                💡 <strong>Advice:</strong> {tip.advice}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
