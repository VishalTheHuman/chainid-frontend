"use client"

import { useRouter } from "next/navigation"
import { useDeviceDetection } from "@/lib/device-detection.js"

export default function SignUpMethodPage() {
  const router = useRouter()
  const isMobile = useDeviceDetection()
  
  return (
    <main className="min-h-dvh relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
      <div className="relative mx-auto max-w-md px-4 py-10 min-h-[70svh] grid place-items-center">
        <div className="w-full rounded-xl border border-subtle glass-strong p-6">
          <h1 className="font-display text-2xl text-foreground">Choose your capture method</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use Face ID with your camera or register a Passkey (fingerprint/Touch ID).</p>
          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => router.push("/signup/face")}
              className="rounded-md bg-primary text-primary-foreground py-2 hover:opacity-90 w-full"
            >
              Start with Face ID
            </button>
            <button
              onClick={() => router.push("/signup/fingerprint")}
              className="rounded-md border border-border py-2 hover:bg-card w-full"
            >
              Start with Fingerprint (Passkey)
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
