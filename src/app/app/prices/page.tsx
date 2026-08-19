"use client"

import { useState } from "react"
import {
  IndianRupee,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Filter,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { INDIAN_DESTINATIONS } from "@/data/destinations"
import { PriceIntelligenceService } from "@/services/price-intelligence.service"
import { toast } from "sonner"

export default function PriceGuidePage() {
  const [selectedDestination, setSelectedDestination] = useState("jaipur")
  const [checkerCategory, setCheckerCategory] = useState("transport")
  const [quotedPrice, setQuotedPrice] = useState("")
  const [checkResult, setCheckResult] = useState<any>(null)

  const handlePriceCheck = (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseFloat(quotedPrice)
    if (!priceNum || isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price amount in ₹ INR.")
      return
    }
    const result = PriceIntelligenceService.evaluatePrice(selectedDestination, checkerCategory, priceNum)
    setCheckResult(result)
  }

  const priceGuides = PriceIntelligenceService.getPriceGuidesByDestination(selectedDestination)

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <IndianRupee className="h-3.5 w-3.5" />
          <span>Local Price Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          India Local Price Guide & Fair Fare Checker
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
          Know what auto rickshaws, meals, taxis, boat rides, and guides actually cost before you negotiate or pay.
        </p>
      </div>

      {/* Destination Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {INDIAN_DESTINATIONS.map((d) => (
          <button
            key={d.slug}
            onClick={() => {
              setSelectedDestination(d.slug)
              setCheckResult(null)
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDestination === d.slug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Interactive Price Evaluator Tool */}
      <Card className="border-primary/40 bg-gradient-to-r from-primary/5 via-card to-background p-6 shadow-md max-w-3xl">
        <div className="flex items-center gap-2 text-primary font-bold text-base mb-1">
          <Sparkles className="h-5 w-5" />
          <span>Interactive &quot;Is This Price Fair?&quot; Evaluator</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Got quoted a fare by an auto driver or shopkeeper? Enter the amount to verify against verified local benchmarks.
        </p>

        <form onSubmit={handlePriceCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
            <select
              value={checkerCategory}
              onChange={(e) => setCheckerCategory(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-card shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="transport">Auto Rickshaw / Taxi Transit</option>
              <option value="food">Authentic Meal / Thali</option>
              <option value="guide">Tour Guide Fee</option>
              <option value="rental">Scooter / Bike Rental</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Quoted Rate (₹ INR)</label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              className="h-10 text-xs font-bold"
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full h-10 text-xs font-bold">
              Evaluate Fairness
            </Button>
          </div>
        </form>

        {checkResult && (
          <div
            className={`mt-5 p-4 rounded-xl border text-xs leading-relaxed ${
              checkResult.status === "fair" || checkResult.status === "great_deal"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
                : checkResult.status === "slightly_high"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300"
                : "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-300"
            }`}
          >
            <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
              {checkResult.status === "fair" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Fair Price Verified! (₹{checkResult.reportedPriceInr})</span>
                </>
              ) : checkResult.status === "slightly_high" ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Slightly Above Normal (₹{checkResult.reportedPriceInr})</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span>Potential Overcharging Warning (₹{checkResult.reportedPriceInr})</span>
                </>
              )}
            </div>
            <p className="mt-1">{checkResult.advice}</p>
            <div className="mt-2 text-[10px] opacity-80">
              Standard Benchmark: ₹{checkResult.benchmarkMinInr} – ₹{checkResult.benchmarkMaxInr} • Source: {checkResult.source} • Verified: {checkResult.lastVerified}
            </div>
          </div>
        )}
      </Card>

      {/* Price Guides List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Standard Benchmarks for {selectedDestination.toUpperCase()}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priceGuides.map((guide) => (
            <Card key={guide.id} className="p-5 border-border/60 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">{guide.category}</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                    {guide.verificationStatus}
                  </Badge>
                </div>

                <h3 className="font-bold text-base text-foreground">{guide.itemName}</h3>

                <div className="text-xl font-black text-primary">
                  ₹{guide.priceMinInr} – ₹{guide.priceMaxInr}{" "}
                  <span className="text-xs font-normal text-muted-foreground">({guide.unit})</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{guide.description}</p>

                {guide.tips && (
                  <div className="text-[11px] p-2.5 rounded-lg bg-muted/60 text-muted-foreground font-medium">
                    💡 <strong>Tip:</strong> {guide.tips}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border/40 text-[10px] text-muted-foreground flex items-center justify-between">
                <span>Source: {guide.dataSource}</span>
                <span>Verified: {guide.lastVerifiedAt}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
