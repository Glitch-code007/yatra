"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import {
  FileText,
  Calendar,
  IndianRupee,
  Users,
  Compass,
  ArrowLeft,
  Share2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Smile,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TripStorageService } from "@/services/trip-storage.service"
import { BudgetService } from "@/services/budget.service"
import { Trip, TripJournalEntry } from "@/types"
import { toast } from "sonner"

export default function TripSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [entries, setEntries] = useState<TripJournalEntry[]>([])

  useEffect(() => {
    setTrip(TripStorageService.getTripById(resolvedParams.id))
    setEntries(TripStorageService.getJournalEntriesByTrip(resolvedParams.id))
  }, [resolvedParams.id])

  if (!trip) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Loading trip summary...</p>
      </div>
    )
  }

  const actualExpenses = entries
    .filter((e) => e.entryType === "expense" && e.expenseAmountInr)
    .map((e) => ({
      category: e.expenseCategory || "other",
      amountInr: e.expenseAmountInr || 0,
    }))

  const notes = entries.filter((e) => e.entryType === "note")

  const budgetSummary = trip.budgetBreakdown
    ? BudgetService.comparePlanVsActual(trip.budgetBreakdown, actualExpenses)
    : null

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Trip summary link copied!")
    }
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Back Link & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          href={`/app/trips/${trip.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Workspace</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="text-xs gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>
          <Button size="sm" onClick={handlePrint} className="text-xs gap-1.5 font-bold">
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </Button>
        </div>
      </div>

      {/* Printable Travel Journal Report Card */}
      <div className="p-8 rounded-3xl bg-card border border-border/80 shadow-lg space-y-8 print:border-none print:shadow-none">
        {/* Header */}
        <div className="border-b border-border/60 pb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Compass className="h-4 w-4" />
            <span>Yatra Trip Summary & Memory Card</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{trip.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Route: {trip.originName} → {trip.destinationName}</span>
            <span>•</span>
            <span>{trip.startDate} to {trip.endDate} ({trip.numDays} Days)</span>
            <span>•</span>
            <span>{trip.numTravelers} Traveler(s)</span>
          </div>
        </div>

        {/* Planned vs Actual Reconciliation Card */}
        {budgetSummary && (
          <div className="p-6 rounded-2xl bg-muted/40 border border-border/60 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Financial Reconciliation (Planned vs. Actual)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground">Total Budget</span>
                <div className="font-bold text-sm">₹{budgetSummary.totalBudget.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground">Planned Estimate</span>
                <div className="font-bold text-sm">₹{budgetSummary.totalPlannedCost.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground">Actual Spent</span>
                <div className="font-bold text-sm text-primary">₹{budgetSummary.totalActualSpent.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground">Net Savings / Variance</span>
                <div
                  className={`font-bold text-sm ${
                    budgetSummary.netDifference >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {budgetSummary.netDifference >= 0 ? "+" : ""}₹{budgetSummary.netDifference.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Category breakdown table */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-muted-foreground">Expense Categories:</div>
              {budgetSummary.categories.map((cat) => (
                <div key={cat.categoryKey} className="flex items-center justify-between text-xs p-2 rounded-lg bg-card">
                  <span className="font-medium">{cat.categoryName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-[11px]">
                      Planned: ₹{cat.plannedAmount.toLocaleString()}
                    </span>
                    <span className="font-bold">
                      Actual: ₹{cat.actualAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highlights & Memory Notes */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Smile className="h-4 w-4 text-amber-500" />
            <span>Captured Memories & Visited Landmarks ({notes.length})</span>
          </h3>

          {notes.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No memory notes recorded for this journey.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {notes.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
                  {n.placeName && (
                    <div className="font-bold text-primary">📍 {n.placeName}</div>
                  )}
                  <p className="text-muted-foreground leading-relaxed">{n.content}</p>
                  {n.mood && (
                    <div className="text-[10px] text-muted-foreground pt-1">
                      Mood: {n.mood}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info on printable card */}
        <div className="pt-6 border-t border-border/40 text-center text-[10px] text-muted-foreground">
          Generated via Yatra — Intelligent Travel Planning Platform for India.
        </div>
      </div>
    </div>
  )
}
