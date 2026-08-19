"use client"

import { useState } from "react"
import { User, Sparkles, Save, Heart, Train, ShieldCheck, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("Vignesh K")
  const [travelStyle, setTravelStyle] = useState<"budget" | "balanced" | "comfortable" | "luxury">("balanced")
  const [preferredTransport, setPreferredTransport] = useState("train")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Heritage & Forts",
    "Food & Street Food",
    "Nature & Mountains",
  ])

  const interestList = [
    "Heritage & Forts",
    "Food & Street Food",
    "Nature & Mountains",
    "Beach & Coastal",
    "Adventure & Treks",
    "Spiritual & Sacred",
    "Photography",
    "Handicrafts & Shopping",
  ]

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Travel preferences saved successfully!")
  }

  return (
    <div className="space-y-8 pb-16 max-w-3xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <User className="h-3.5 w-3.5" />
          <span>Traveler Persona</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Profile & Travel Preferences</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Personalize how our AI and planning engines orchestrate your Indian journeys.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 border-border/60 space-y-6">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Display Name
            </label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-11 font-medium rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Default Travel Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "budget", label: "Budget Backpacker", sub: "Hostels & Dhabas" },
                { id: "balanced", label: "Balanced Explorer", sub: "3AC & Mid Hotels" },
                { id: "comfortable", label: "Comfort Traveler", sub: "Boutique & 2AC/Flights" },
                { id: "luxury", label: "Luxury Connoisseur", sub: "5-Star & Palaces" },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setTravelStyle(style.id as any)}
                  className={`p-3 rounded-xl text-xs text-left border transition-all ${
                    travelStyle === style.id
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border bg-card hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <div>{style.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{style.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Preferred Inter-City Transit
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "train", label: "Indian Railways (3AC/2AC)" },
                { id: "flight", label: "Domestic Flight" },
                { id: "bus", label: "AC Volvo Bus" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPreferredTransport(t.id)}
                  className={`p-3 rounded-xl text-xs text-left border transition-all ${
                    preferredTransport === t.id
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Favorite Interests & Travel Themes
            </label>
            <div className="flex flex-wrap gap-2">
              {interestList.map((interest) => {
                const isSelected = selectedInterests.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedInterests(selectedInterests.filter((i) => i !== interest))
                      } else {
                        setSelectedInterests([...selectedInterests, interest])
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="rounded-xl font-bold px-8 gap-2">
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
