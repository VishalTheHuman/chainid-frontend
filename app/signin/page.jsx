"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Card } from "@/components/ui/card.jsx"
import { SiteHeader } from "@/components/site-header.jsx"
import { useDeviceDetection } from "@/lib/device-detection.js"

export default function SignInPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const isMobile = useDeviceDetection()

  const nextStep = () => {
    const u = username.trim()
    if (!u) return
    router.push(`/signin/method?username=${encodeURIComponent(u)}`)
  }

  return (
    <main className="min-h-dvh relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
      <SiteHeader />
      <div className="relative mx-auto max-w-xl px-4 py-12 min-h-[70svh] grid place-items-center">
        <div className="w-full space-y-6">
          <h1 className="font-display text-3xl text-foreground">Sign in</h1>
          <Card className="p-6 space-y-4 glass-strong border-subtle">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="e.g. satoshi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button onClick={nextStep} className="btn-shimmer w-full">
              Continue
            </Button>
          </Card>
        </div>
      </div>
    </main>
  )
}
