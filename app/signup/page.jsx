"use client"

import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import { useState } from "react"
import { useDeviceDetection } from "@/lib/device-detection.js"

export default function SignUpDetailsPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [agree, setAgree] = useState(false)
  const isMobile = useDeviceDetection()

  const canContinue = name && username && email && agree

  const next = () => {
    if (!canContinue) return
    // Persist details for next steps
    localStorage.setItem("signup_name", name)
    localStorage.setItem("signup_username", username)
    localStorage.setItem("signup_email", email)
    router.push(isMobile ? "/signup/method" : "/signup/face")
  }

  return (
    <main className="min-h-dvh relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
      <SiteHeader />
      <div className="relative mx-auto max-w-2xl px-4 py-12 min-h-[70svh] grid place-items-center">
        <div className="w-full space-y-8">
          <h1 className="font-display text-3xl text-foreground">Create your ChainID</h1>
          <Card className="p-6 grid gap-5 glass-strong border-subtle">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="terms" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
              <Label htmlFor="terms" className="text-sm">
                I agree to the Terms and Conditions
              </Label>
            </div>
            <div className="flex items-center justify-end">
              <Button onClick={next} disabled={!canContinue} className="btn-shimmer w-full">
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
