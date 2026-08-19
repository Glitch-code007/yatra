"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Compass, UserPlus, Lock, Mail, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Account created! Welcome to Yatra.")
      router.push("/app/dashboard")
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Compass className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Yatra</span>
          </Link>
          <h1 className="text-xl font-bold">Create Your Free Account</h1>
          <p className="text-xs text-muted-foreground">
            Save custom itineraries, capture trip journals, and personalize recommendations.
          </p>
        </div>

        <Card className="p-6 border-border/60 shadow-xl space-y-4">
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g. Vignesh"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="pl-9 h-11 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 h-11 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 h-11 text-xs"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 text-xs font-bold shadow-md">
              {isLoading ? "Creating Account..." : "Join Yatra Free"}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/40">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
