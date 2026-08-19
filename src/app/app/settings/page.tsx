"use client"

import { useState } from "react"
import { Settings, Shield, Trash2, Download, Moon, Sun, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { TripStorageService } from "@/services/trip-storage.service"
import { toast } from "sonner"

export default function SettingsPage() {
  const [offlineSync, setOfflineSync] = useState(true)
  const [safetyAlertNotifications, setSafetyAlertNotifications] = useState(true)

  const handleExportData = () => {
    if (typeof window !== "undefined") {
      const trips = TripStorageService.getAllTrips()
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trips, null, 2))
      const downloadAnchor = document.createElement("a")
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", "yatra_trips_backup.json")
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      toast.success("All your saved trips exported as JSON!")
    }
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all local saved trips and bookmarks? This action cannot be undone.")) {
      if (typeof window !== "undefined") {
        localStorage.clear()
        toast.info("All local data cleared.")
        window.location.reload()
      }
    }
  }

  return (
    <div className="space-y-8 pb-16 max-w-3xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <Settings className="h-3.5 w-3.5" />
          <span>App Controls</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Settings & Data Privacy</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage your offline storage, data backups, and privacy controls.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance & Theme */}
        <Card className="p-6 border-border/60 space-y-4">
          <h3 className="font-bold text-base">Appearance & Interface</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Theme Preference</div>
              <div className="text-xs text-muted-foreground">Switch between light and dark color modes.</div>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        {/* Offline & Sync */}
        <Card className="p-6 border-border/60 space-y-4">
          <h3 className="font-bold text-base">Offline & Syncing</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Offline Itinerary Cache</div>
              <div className="text-xs text-muted-foreground">Cache saved itineraries for low-connectivity train journeys.</div>
            </div>
            <Switch checked={offlineSync} onCheckedChange={setOfflineSync} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div>
              <div className="text-sm font-semibold">Real-Time Scam Alert Warnings</div>
              <div className="text-xs text-muted-foreground">Show prominent warnings when viewing active destination tout alerts.</div>
            </div>
            <Switch checked={safetyAlertNotifications} onCheckedChange={setSafetyAlertNotifications} />
          </div>
        </Card>

        {/* Data Backup & Privacy */}
        <Card className="p-6 border-border/60 space-y-4">
          <h3 className="font-bold text-base">Data Backup & Privacy Controls</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Yatra respects your privacy. All your itineraries, journal entries, and bookmarks are stored safely on your device or linked Supabase account without tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2 text-xs font-bold">
              <Download className="h-4 w-4" />
              <span>Export All Trips (JSON)</span>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearAllData} className="gap-2 text-xs font-bold">
              <Trash2 className="h-4 w-4" />
              <span>Clear Local Data</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
