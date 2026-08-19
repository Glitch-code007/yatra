"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Compass,
  Plane,
  CalendarDays,
  Briefcase,
  Map,
  IndianRupee,
  Shield,
  Siren,
  MessageSquareText,
  Bookmark,
  BookOpen,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const mobileNavItems = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Plan Trip", href: "/app/plan", icon: Plane },
  { label: "Itineraries", href: "/app/itineraries", icon: CalendarDays },
  { label: "My Trips", href: "/app/trips", icon: Briefcase },
  { label: "Trip Map", href: "/app/trips/map", icon: Map },
  { label: "Prices", href: "/app/prices", icon: IndianRupee },
  { label: "Safety", href: "/app/safety", icon: Shield },
  { label: "Emergency", href: "/app/emergency", icon: Siren },
  { label: "AI Assistant", href: "/app/assistant", icon: MessageSquareText },
  { label: "Saved", href: "/app/saved", icon: Bookmark },
  { label: "Journal", href: "/app/journal", icon: BookOpen },
  { label: "Profile", href: "/app/profile", icon: User },
  { label: "Settings", href: "/app/settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Compass className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">Yatra</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-xl lg:hidden">
            <div className="flex h-14 items-center gap-2 border-b border-border px-4">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Compass className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold">Yatra</span>
              </Link>
            </div>
            <ScrollArea className="h-[calc(100vh-3.5rem)]">
              <div className="space-y-1 p-3">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    item.href === "/app/dashboard"
                      ? pathname === "/app/dashboard"
                      : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </>
  )
}
