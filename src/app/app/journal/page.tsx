"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  Plus,
  IndianRupee,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Camera,
  Smile,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TripStorageService } from "@/services/trip-storage.service"
import { Trip, TripJournalEntry } from "@/types"
import { toast } from "sonner"

export default function TripJournalHubPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripId, setSelectedTripId] = useState<string>("")
  const [journalEntries, setJournalEntries] = useState<TripJournalEntry[]>([])

  // New Quick Entry Form State
  const [entryType, setEntryType] = useState<"expense" | "place_visited" | "note">("expense")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("food")
  const [placeName, setPlaceName] = useState("")
  const [mood, setMood] = useState<"amazing" | "good" | "neutral" | "bad">("amazing")

  useEffect(() => {
    const allTrips = TripStorageService.getAllTrips()
    setTrips(allTrips)
    if (allTrips.length > 0) {
      setSelectedTripId(allTrips[0].id)
      setJournalEntries(TripStorageService.getJournalEntries(allTrips[0].id))
    }
  }, [])

  const handleTripChange = (id: string) => {
    setSelectedTripId(id)
    setJournalEntries(TripStorageService.getJournalEntries(id))
  }

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTripId) {
      toast.error("Please create or select a trip first.")
      return
    }

    if (entryType === "expense" && (!amount || isNaN(Number(amount)))) {
      toast.error("Please enter a valid expense amount in ₹ INR.")
      return
    }

    if (!description && !placeName) {
      toast.error("Please provide a note, place, or expense description.")
      return
    }

    const newEntry: TripJournalEntry = {
      id: `jnl-${Date.now()}`,
      tripId: selectedTripId,
      entryType,
      expenseAmountInr: entryType === "expense" ? Number(amount) : undefined,
      expenseCategory: entryType === "expense" ? category : undefined,
      expenseDescription: entryType === "expense" ? description : undefined,
      placeName: entryType === "place_visited" ? placeName : undefined,
      content: description,
      mood,
      createdAt: new Date().toISOString(),
    }

    TripStorageService.addJournalEntry(newEntry)
    setJournalEntries(TripStorageService.getJournalEntries(selectedTripId))
    
    // Reset Form
    setDescription("")
    setAmount("")
    setPlaceName("")
    toast.success("Journal memory logged successfully!")
  }

  const selectedTrip = trips.find((t) => t.id === selectedTripId)
  const totalLoggedExpense = journalEntries
    .filter((e) => e.entryType === "expense" && e.expenseAmountInr)
    .reduce((sum, e) => sum + (e.expenseAmountInr || 0), 0)

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Travel Memory & Expense Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Trip Journal & Real Spend Tracker</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Log live on-the-road travel expenses, visited heritage places, memorable moments, and track budget variances.
          </p>
        </div>

        {selectedTrip && (
          <Button asChild size="sm" className="font-bold gap-1.5 shadow-sm">
            <Link href={`/app/trips/${selectedTrip.id}/journal`}>
              <span>Open Detailed Trip Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {trips.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20 my-8">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold">No active trips found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Plan your first journey using our 5-step intelligent planner to start logging memories and daily expenses.
          </p>
          <Button asChild size="sm" className="mt-4 font-bold">
            <Link href="/app/plan">Plan a New Trip</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Quick Entry Form */}
          <Card className="p-6 border-border/60 shadow-xs space-y-6 lg:col-span-1">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider block mb-2">
                Select Active Journey
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => handleTripChange(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm font-semibold rounded-xl border border-input bg-card shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.destinationName})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider block mb-2">
                  Entry Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "expense", label: "Expense (₹)" },
                    { id: "place_visited", label: "Place Visited" },
                    { id: "note", label: "Memory Note" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setEntryType(type.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        entryType === type.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {entryType === "expense" && (
                <>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Amount Spent (₹ INR)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="e.g. 450"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-9 h-10 text-xs rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">Expense Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-card shadow-xs"
                    >
                      <option value="food">Food & Dining</option>
                      <option value="transport">Local Transport (Auto/Taxi)</option>
                      <option value="activities">Entry Tickets & Guides</option>
                      <option value="stay">Hotel / Stay</option>
                      <option value="shopping">Shopping & Souvenirs</option>
                      <option value="emergency">Other / Emergency</option>
                    </select>
                  </div>
                </>
              )}

              {entryType === "place_visited" && (
                <div>
                  <label className="text-xs font-semibold block mb-1">Location or Attraction Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Amer Fort, Calangute Beach, Mattupetty Dam"
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold block mb-1">Notes / Description</label>
                <Input
                  type="text"
                  placeholder="e.g. Authentic Rajasthani Thali near City Palace"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <Button type="submit" size="sm" className="w-full h-10 text-xs font-bold gap-1.5 shadow-md">
                <Plus className="h-4 w-4" />
                <span>Save to Trip Journal</span>
              </Button>
            </form>
          </Card>

          {/* Right Column: Timeline & Log History */}
          <div className="space-y-6 lg:col-span-2">
            {/* Trip Spend Summary Card */}
            {selectedTrip && (
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-card border border-border/60 shadow-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Planned Budget</span>
                  <div className="font-extrabold text-base sm:text-lg">
                    ₹{(selectedTrip.totalBudgetInr || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Logged Actual Spend</span>
                  <div className="font-extrabold text-base sm:text-lg text-primary">
                    ₹{totalLoggedExpense.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Budget Health</span>
                  <div className="font-extrabold text-base sm:text-lg text-emerald-600">
                    {totalLoggedExpense <= (selectedTrip.totalBudgetInr || 0) ? "Within Budget ✓" : "Over Budget"}
                  </div>
                </div>
              </div>
            )}

            {/* Entries List */}
            <Card className="p-6 border-border/60 shadow-xs space-y-4">
              <h3 className="font-bold text-base flex items-center justify-between">
                <span>Recorded Timeline Entries</span>
                <Badge variant="secondary" className="text-xs">
                  {journalEntries.length} logged
                </Badge>
              </h3>

              {journalEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground py-8 text-center">
                  No journal entries recorded for this trip yet. Use the form on the left to add your first expense or memory!
                </p>
              ) : (
                <div className="space-y-3">
                  {journalEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold">
                            {entry.entryType.replace("_", " ")}
                          </Badge>
                          {entry.expenseCategory && (
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                              • {entry.expenseCategory}
                            </span>
                          )}
                        </div>
                        {entry.placeName && <div className="font-bold text-foreground text-sm">{entry.placeName}</div>}
                        <div className="text-muted-foreground leading-relaxed">{entry.content || entry.expenseDescription}</div>
                        <div className="text-[10px] text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</div>
                      </div>

                      {entry.expenseAmountInr && (
                        <div className="font-extrabold text-sm text-foreground shrink-0">
                          ₹{entry.expenseAmountInr.toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
