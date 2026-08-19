import Link from "next/link"
import { Compass, ShieldCheck, Heart, MapPin, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Yatra</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Intelligent travel decision-support platform designed for explorers navigating India. Plan, budget, stay safe, and capture memories.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Independent travel recommendations</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Discover India</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li><Link href="/explore/jaipur" className="hover:text-primary transition-colors">Jaipur (Pink City)</Link></li>
              <li><Link href="/explore/goa" className="hover:text-primary transition-colors">Goa (Beaches & Shacks)</Link></li>
              <li><Link href="/explore/munnar-kerala" className="hover:text-primary transition-colors">Munnar & Kerala</Link></li>
              <li><Link href="/explore/leh-ladakh" className="hover:text-primary transition-colors">Leh Ladakh High Passes</Link></li>
              <li><Link href="/explore/varanasi" className="hover:text-primary transition-colors">Varanasi Ghats</Link></li>
              <li><Link href="/explore" className="hover:text-primary transition-colors font-medium text-foreground">View All 12+ Destinations →</Link></li>
            </ul>
          </div>

          {/* Planning Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Smart Tools</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li><Link href="/app/plan" className="hover:text-primary transition-colors">Multi-Step Trip Planner</Link></li>
              <li><Link href="/app/prices" className="hover:text-primary transition-colors">Local Price & Fare Checker</Link></li>
              <li><Link href="/app/safety" className="hover:text-primary transition-colors">Scam Intelligence Directory</Link></li>
              <li><Link href="/app/emergency" className="hover:text-primary transition-colors">Emergency Services Map</Link></li>
              <li><Link href="/app/assistant" className="hover:text-primary transition-colors">AI Travel Assistant</Link></li>
              <li><Link href="/app/dashboard" className="hover:text-primary transition-colors">Personal Trip Dashboard</Link></li>
            </ul>
          </div>

          {/* Emergency & Safety Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Emergency & Helpline</h4>
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs">
              <div className="font-bold text-destructive mb-1">National Helpline: 112</div>
              <div className="text-[11px] text-muted-foreground">Women Helpline: 1091</div>
              <div className="text-[11px] text-muted-foreground">Tourist Helpline: 1363</div>
            </div>
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
              Yatra provides informational guidance. We never process live transport or hotel bookings.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Yatra Travel Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span>for incredible India travel.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
