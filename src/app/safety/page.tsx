import Link from "next/link"
import { ShieldCheck, Siren, Phone, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NATIONWIDE_EMERGENCY_NUMBERS } from "@/data/emergency-directory"
import { PAN_INDIA_SAFETY_TIPS } from "@/services/safety.service"

export default function PublicSafetyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pb-20">
        {/* Hero */}
        <div className="bg-gradient-to-b from-red-500/10 via-background to-background py-14 border-b border-border/40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 mb-3">
              <ShieldCheck className="h-4 w-4" />
              <span>India Travel Safety Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Travel India with Street-Smart Confidence
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Essential verified safety guidelines, 24x7 pan-India emergency helplines, digital payment security, and common tout scam defenses.
            </p>
          </div>
        </div>

        {/* Helplines Grid */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Siren className="h-5 w-5 text-rose-600" />
              <span>Pan-India 24x7 Emergency Helplines</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {NATIONWIDE_EMERGENCY_NUMBERS.map((item) => (
                <Card key={item.id} className="p-4 border-border/60 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{item.category}</span>
                      {item.tollFree && <span className="text-[10px] text-emerald-600 font-bold">Toll Free</span>}
                    </div>
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <Button asChild size="sm" variant="destructive" className="w-full h-8 text-xs font-bold gap-1.5">
                    <a href={`tel:${item.phone}`}>
                      <Phone className="h-3 w-3" />
                      <span>Dial {item.phone}</span>
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Practical Travel Rules */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Key Safety Advice for Travelers</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAN_INDIA_SAFETY_TIPS.map((tip, idx) => (
                <Card key={idx} className="p-5 border-border/60 space-y-2">
                  <h3 className="font-bold text-sm text-foreground">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                  <div className="p-2.5 rounded-lg bg-muted/60 text-[11px] font-medium text-muted-foreground">
                    💡 <strong>Advice:</strong> {tip.advice}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
