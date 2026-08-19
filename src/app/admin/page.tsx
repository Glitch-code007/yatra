"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ShieldAlert,
  Database,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Compass,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { INDIAN_DESTINATIONS } from "@/data/destinations"
import { toast } from "sonner"

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([
    {
      id: "rep-1",
      type: "outdated_price",
      destination: "Jaipur",
      title: "Amer Fort Audio Guide Fee Update",
      description: "Audio guide fee is now ₹250 instead of ₹200 as of last month.",
      status: "pending",
      date: "2026-02-10",
    },
    {
      id: "rep-2",
      type: "scam_report",
      destination: "Goa",
      title: "New Calangute Jet Ski Unauthorized Vendor",
      description: "Unregistered operators operating near shack 4 without lifejackets.",
      status: "reviewed",
      date: "2026-02-14",
    },
  ])

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
    )
    toast.success("User report marked as resolved!")
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Admin Control Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Data Management & Verification</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage Indian destinations, verify price guides, moderate user reports, and maintain dataset integrity.
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/app/dashboard">Return to App Dashboard</Link>
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border/60">
          <div className="text-xs text-muted-foreground font-semibold">Active Destinations</div>
          <div className="text-2xl font-extrabold mt-1">{INDIAN_DESTINATIONS.length}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">100% Published & Verified</div>
        </Card>
        <Card className="p-5 border-border/60">
          <div className="text-xs text-muted-foreground font-semibold">Pending User Reports</div>
          <div className="text-2xl font-extrabold mt-1">1</div>
          <div className="text-[10px] text-amber-600 font-bold mt-0.5">Needs Admin Action</div>
        </Card>
        <Card className="p-5 border-border/60">
          <div className="text-xs text-muted-foreground font-semibold">Price Benchmarks</div>
          <div className="text-2xl font-extrabold mt-1">45+</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Across All Zones</div>
        </Card>
        <Card className="p-5 border-border/60">
          <div className="text-xs text-muted-foreground font-semibold">System Health</div>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600">99.9%</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">All Services Operational</div>
        </Card>
      </div>

      {/* User Reports Moderation */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">User Information Reports & Correction Submissions</h2>
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="p-5 border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={r.status === "resolved" ? "secondary" : "outline"} className="text-[10px] uppercase font-bold">
                    {r.status}
                  </Badge>
                  <span className="font-bold text-sm">{r.title}</span>
                  <span className="text-xs text-muted-foreground">({r.destination})</span>
                </div>
                <p className="text-xs text-muted-foreground">{r.description}</p>
                <div className="text-[10px] text-muted-foreground">Reported: {r.date}</div>
              </div>

              {r.status !== "resolved" && (
                <Button size="sm" onClick={() => handleResolve(r.id)} className="text-xs font-bold shrink-0">
                  Verify & Resolve
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Destination Content Registry */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Destination Database Registry</h2>
          <Button size="sm" className="gap-1.5 text-xs font-bold">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Destination</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDIAN_DESTINATIONS.map((d) => (
            <Card key={d.id} className="p-4 border-border/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">{d.name}</div>
                <div className="text-xs text-muted-foreground">{d.state} • Score: {d.popularityScore}</div>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold text-emerald-600">
                Verified
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
