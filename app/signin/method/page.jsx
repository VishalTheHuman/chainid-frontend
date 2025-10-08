"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Label } from "@/components/ui/label.jsx"
import { SiteHeader } from "@/components/site-header.jsx"
import { useDeviceDetection } from "@/lib/device-detection.js"

export default function SignInMethodPage() {
  const params = useSearchParams()
  const router = useRouter()
  const username = params.get("username") || ""
  const isMobile = useDeviceDetection()

  const choose = (mode) => {
    if (!username) return
    router.push(`/signin/capture?username=${encodeURIComponent(username)}&mode=${mode}`)
  }

  return (
    <main className="min-h-dvh relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
      <SiteHeader />
      <div className="relative mx-auto max-w-xl px-4 py-12 min-h-[70svh] grid place-items-center">
        <div className="w-full space-y-6">
          <h1 className="font-display text-3xl text-foreground">Choose a method</h1>
          <Card className="p-6 space-y-5 glass-strong border-subtle">
            <Label className="text-sm">
              Sign in as <span className="font-medium">{username}</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Use Face ID with your camera, or Passkey fingerprint/Touch ID on this device.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Button onClick={() => choose("face")} className="btn-shimmer w-full">
                Sign in with Face ID
              </Button>
              <Button onClick={() => choose("fingerprint")} variant="secondary" className="w-full">
                Sign in with Fingerprint (Passkey)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
