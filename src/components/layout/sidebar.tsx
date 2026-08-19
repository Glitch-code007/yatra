"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
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
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebarStore } from "@/store/sidebar.store"

const sidebarItems = [
  {
    group: "Main",
    items: [
      { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
      { label: "Explore Destinations", href: "/explore", icon: Compass },
      { label: "Plan a Trip", href: "/app/plan", icon: Plane },
    ],
  },
  {
    group: "Trips",
    items: [
      { label: "My Itineraries", href: "/app/itineraries", icon: CalendarDays },
      { label: "My Trips", href: "/app/trips", icon: Briefcase },
      { label: "Trip Map", href: "/app/trips/map", icon: Map },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { label: "Budget & Prices", href: "/app/prices", icon: IndianRupee },
      { label: "Safety & Scams", href: "/app/safety", icon: Shield },
      { label: "Emergency Services", href: "/app/emergency", icon: Siren },
      { label: "AI Assistant", href: "/app/assistant", icon: MessageSquareText },
    ],
  },
  {
    group: "Personal",
    items: [
      { label: "Saved Places", href: "/app/saved", icon: Bookmark },
      { label: "Trip Journal", href: "/app/journal", icon: BookOpen },
      { label: "Profile", href: "/app/profile", icon: User },
      { label: "Settings", href: "/app/settings", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebarStore()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 72 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar-background"
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden text-lg font-bold tracking-tight text-sidebar-foreground whitespace-nowrap"
                >
                  Yatra
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {sidebarItems.map((group) => (
              <div key={group.group}>
                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40"
                    >
                      {group.group}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      item.href === "/app/dashboard"
                        ? pathname === "/app/dashboard"
                        : pathname.startsWith(item.href)

                    const linkContent = (
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                          isActive
                            ? "bg-sidebar-primary/10 text-sidebar-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-colors",
                            isActive
                              ? "text-sidebar-primary"
                              : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                          )}
                        />
                        <AnimatePresence>
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 h-6 w-[3px] rounded-r-full bg-sidebar-primary"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    )

                    if (!isOpen) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>
                            {linkContent}
                          </TooltipTrigger>
                          <TooltipContent side="right" sideOffset={10}>
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      )
                    }

                    return (
                      <div key={item.href} className="relative">
                        {linkContent}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="border-t border-sidebar-border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isOpen ? "default" : "icon"}
                className={cn(
                  "w-full text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !isOpen && "h-10 w-10"
                )}
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                {isOpen && <span className="ml-2">Sign Out</span>}
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right" sideOffset={10}>
                Sign Out
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggle}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-background text-sidebar-foreground/50 shadow-sm transition-colors hover:text-sidebar-foreground"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </motion.aside>
    </TooltipProvider>
  )
}
