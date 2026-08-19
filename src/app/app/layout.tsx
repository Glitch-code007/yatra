"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useSidebarStore } from "@/store/sidebar.store"
import { cn } from "@/lib/utils"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen } = useSidebarStore()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Top Nav Drawer */}
      <MobileNav />

      {/* Desktop Collapsible Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area with Dynamic Margin for Sidebar */}
      <div
        className={cn(
          "transition-all duration-200 ease-in-out min-h-screen flex flex-col",
          "lg:ml-[72px]",
          isOpen && "lg:ml-[260px]"
        )}
      >
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
