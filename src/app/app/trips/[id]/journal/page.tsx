"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import {
  BookOpen,
  IndianRupee,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  Smile,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TripStorageService } from "@/services/trip-storage.service"
import { BudgetService } from "@/services/budget.service"
import { Trip, TripJournalEntry } from "@/types"
import { toast } from "sonner"

export default function TripJournalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [entries, setEntries] = useState<TripJournalEntry[]>([])

  // New Expense Entry Form
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("food")
  const [expenseDescription, setExpenseDescription] = useState("")

  // New Note / Memory Form
  const [memoryNote, setMemoryNote] = useState("")
  const [placeVisited, setPlaceVisited] = useState("")
  const [mood, setMood] = useState<"amazing" | "good" | "neutral" | "bad">("amazing")

  useEffect(() => {
    const t = TripStorageService.getTripById(resolvedParams.id)
    setTrip(t)
    setEntries(TripStorageService.getJournalEntriesByTrip(resolvedParams.id))
  }, [resolvedParams.id])

  if (!trip) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Loading trip journal...</p>
      </div>
    )
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(expenseAmount)
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid expense amount.")
      return
    }

    TripStorageService.addJournalEntry(trip.id, {
      entryType: "expense",
      expenseAmountInr: amt,
      expenseCategory,
      expenseDescription: expenseDescription || `Expense for ${expenseCategory}`,
    })

    setExpenseAmount("")
    setExpenseDescription("")
    setEntries(TripStorageService.getJournalEntriesByTrip(trip.id))
    setTrip(TripStorageService.getTripById(trip.id))
    toast.success("Expense logged to journal!")
  }

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!memoryNote.trim() && !placeVisited.trim()) {
      toast.error("Please write a short note or place name.")
      return
    }

    TripStorageService.addJournalEntry(trip.id, {
      entryType: "note",
      content: memoryNote,
      placeName: placeVisited,
      mood,
    })

    setMemoryNote("")
    setPlaceVisited("")
    setEntries(TripStorageService.getJournalEntriesByTrip(trip.id))
    toast.success("Memory note logged to journal!")
  }

  // Calculate Planned vs Actual Variance
  const actualExpenses = entries
    .filter((e) => e.entryType === "expense" && e.expenseAmountInr)
    .map((e) => ({
      category: e.expenseCategory || "other",
      amountInr: e.expenseAmountInr || 0,
    }))

  const budgetSummary = trip.budgetBreakdown
    ? BudgetService.comparePlanVsActual(trip.budgetBreakdown, actualExpenses)
    : null

  return (
    <div className="space-y-8 pb-16">
      {/* Back Link */}
      <div>
        <Link
          href={`/app/trips/${trip.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Trip Workspace</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/60 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Trip Journal & Live Expense Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Capturing: {trip.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log real expenditures, notes, and visited landmarks on the go.
          </p>
        </div>

        <Button asChild size="sm" className="rounded-xl gap-1.5 text-xs font-bold">
          <Link href={`/app/trips/${trip.id}/summary`}>
            <FileText className="h-3.5 w-3.5" />
            <span>View Final Summary</span>
          </Link>
        </Button>
      </div>

      {/* Planned vs Actual Reconciliation Bar */}
      {budgetSummary && (
        <Card className="p-6 border-border/60 bg-gradient-to-r from-muted/30 via-card to-background space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-amber-500" />
            <span>Planned vs. Actual Spending Tracker</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px]">Total Planned Budget</span>
              <div className="font-bold text-sm">₹{budgetSummary.totalBudget.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px]">Actual Spent So Far</span>
              <div className="font-bold text-sm text-primary">₹{budgetSummary.totalActualSpent.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px]">Remaining Budget</span>
              <div
                className={`font-bold text-sm ${
                  budgetSummary.netDifference >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                ₹{budgetSummary.netDifference.toLocaleString()}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-muted-foreground text-[10px]">Budget Status</span>
              <div className="font-bold text-sm">
                {budgetSummary.isUnderBudget ? "✓ Within Budget" : "⚠️ Over Budget"}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Logging Forms (2 Cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form 1: Log Real Expense */}
        <Card className="p-5 border-border/60 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-primary">
            <Plus className="h-4 w-4" />
            <span>Log an Actual Expense</span>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Expense Category</label>
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card"
              >
                <option value="transport">Inter-city Transport (Train/Flight/Bus)</option>
                <option value="accommodation">Hotel / Stay Night</option>
                <option value="food">Dining & Street Food</option>
                <option value="local_transport">Local Auto / Taxi / Metro</option>
                <option value="activities">Entry Ticket / Guide / Activity</option>
                <option value="buffer">Shopping / Souvenirs / Misc</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Amount Spent (₹ INR)</label>
              <Input
                type="number"
                placeholder="e.g. 450"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Description / Notes</label>
              <Input
                type="text"
                placeholder="e.g. Lunch at LMB (Dal Baati Thali)"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <Button type="submit" size="sm" className="w-full font-bold h-9 text-xs">
              Record Expense
            </Button>
          </form>
        </Card>

        {/* Form 2: Log Place / Memory / Mood */}
        <Card className="p-5 border-border/60 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-600">
            <Smile className="h-4 w-4" />
            <span>Record Memory & Visited Spot</span>
          </div>

          <form onSubmit={handleAddMemory} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Place Visited</label>
              <Input
                type="text"
                placeholder="e.g. Amer Fort Sunset Point"
                value={placeVisited}
                onChange={(e) => setPlaceVisited(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Mood / Experience</label>
              <div className="flex gap-2">
                {[
                  { id: "amazing", label: "🤩 Amazing" },
                  { id: "good", label: "😊 Good" },
                  { id: "neutral", label: "😐 Okay" },
                  { id: "bad", label: "😕 Disappointing" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id as any)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      mood === m.id
                        ? "bg-primary/10 border-primary text-primary font-bold"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Travel Note</label>
              <Input
                type="text"
                placeholder="e.g. Stunning Sheesh Mahal mirror work, tea stall outside was great."
                value={memoryNote}
                onChange={(e) => setMemoryNote(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <Button type="submit" size="sm" variant="outline" className="w-full font-bold h-9 text-xs">
              Save Memory Note
            </Button>
          </form>
        </Card>
      </div>

      {/* Journal Entries Timeline */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Journal Timeline ({entries.length} Entries)</h3>

        {entries.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card text-muted-foreground text-xs">
            No journal entries recorded yet. Use the forms above to log your expenses and memory highlights.
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      {entry.entryType}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {entry.mood && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-medium">
                        Mood: {entry.mood}
                      </span>
                    )}
                  </div>

                  {entry.entryType === "expense" ? (
                    <div className="pt-1">
                      <div className="font-bold text-sm text-foreground">
                        ₹{entry.expenseAmountInr?.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-muted-foreground">({entry.expenseCategory})</span>
                      </div>
                      <div className="text-muted-foreground">{entry.expenseDescription}</div>
                    </div>
                  ) : (
                    <div className="pt-1">
                      {entry.placeName && (
                        <div className="font-bold text-sm text-foreground">📍 {entry.placeName}</div>
                      )}
                      <div className="text-muted-foreground">{entry.content}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
