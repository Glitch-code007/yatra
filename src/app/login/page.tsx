"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Compass, LogIn, Lock, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Welcome back to Yatra!")
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
          <h1 className="text-xl font-bold">Sign In to Your Account</h1>
          <p className="text-xs text-muted-foreground">
            Access your saved itineraries, trip journals, and custom preferences.
          </p>
        </div>

        <Card className="p-6 border-border/60 shadow-xl space-y-4">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
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
              <label className="font-semibold text-muted-foreground block mb-1">Password</label>
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
              {isLoading ? "Signing in..." : "Sign In to Yatra"}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/40">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Create one for free
            </Link>
          </div>
        </Card>

        <div className="text-center">
          <Link href="/app/dashboard" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <span>Continue as Guest</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
