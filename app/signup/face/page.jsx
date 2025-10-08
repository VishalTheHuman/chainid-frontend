"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header.jsx"
import { CameraCapture } from "@/components/camera-capture.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { useDeviceDetection } from "@/lib/device-detection.js"
import { createUser, setCurrentUser } from "@/lib/api.js"
import { useToast } from "@/components/ui/toast.jsx"

export default function SignUpFacePage() {
  const router = useRouter()
  const isMobile = useDeviceDetection()
  const { addToast } = useToast()

  useEffect(() => {
    // Ensure details exist
    const u = localStorage.getItem("signup_username")
    if (!u) router.replace("/signup")
  }, [router])

  const handleCapture = async (b64) => {
    localStorage.setItem("signup_face", b64)
    // Always continue to fingerprint/passkey step for both desktop and mobile
    router.push("/signup/fingerprint")
  }

  return (
    <main className="min-h-dvh relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
      <SiteHeader />
      <div className="relative mx-auto max-w-4xl px-4 py-6 space-y-4">
        <h1 className="font-display text-3xl text-foreground">Capture Face</h1>
        <CameraCapture mode="face" device={isMobile ? "mobile" : "desktop"} facing="user" onCapture={handleCapture} />
        <Card className="p-4 glass border-subtle">
          <p className="text-sm text-foreground">
            {isMobile 
              ? "📱 Use the SELFIE camera (front camera) on your phone. We'll resize to 214×214 automatically."
              : "Use your webcam for face recognition. We'll resize to 214×214 automatically."
            }
          </p>
        </Card>
        <Button variant="outline" onClick={() => router.back()} className="w-full">
          Back
        </Button>
      </div>
    </main>
  )
}
