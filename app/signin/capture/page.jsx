"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { CameraCapture } from "@/components/camera-capture.jsx"
import { authFace, authFingerprint, setCurrentUser } from "@/lib/api.js"
import { SiteHeader } from "@/components/site-header.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { useDeviceDetection } from "@/lib/device-detection.js"
import { useToast } from "@/components/ui/toast.jsx"

export default function CaptureSignInPage() {
  const params = useSearchParams()
  const username = params.get("username") || ""
  const mode = params.get("mode") || "face"
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const isMobile = useDeviceDetection()
  const { addToast } = useToast()


  const facing = mode === "fingerprint" && isMobile ? "environment" : "user"
  const device = isMobile ? "mobile" : "desktop"
  const [showHttpsHint, setShowHttpsHint] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shouldShow = location.protocol !== "https:" && location.hostname !== "localhost"
      setShowHttpsHint(shouldShow)
    }
  }, [])

  async function handleCapture(b64) {
    try {
      setSubmitting(true)
      const res = mode === "face" ? await authFace(username, b64) : await authFingerprint(username, b64)

      if (res.authenticated) {
      setCurrentUser(username)
      addToast("Authentication successful!", "success")
      
      // Stop camera immediately after successful authentication
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            stream.getTracks().forEach(track => track.stop())
          })
          .catch(() => {})
      }
      
      router.replace("/dashboard")
      } else {
        addToast("Authentication failed. Please try again.", "error")
      }
    } catch (e) {
      addToast(e?.message || "Authentication error. Please try again.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const storageKeys = useMemo(() => ({
    id: `passkey_${username}_id`,
    raw: `passkey_${username}_raw`,
  }), [username])

  const b64urlToBuf = useCallback((b64url) => {
    const pad = "=".repeat((4 - (b64url.length % 4)) % 4)
    const base64 = (b64url + pad).replace(/-/g, "+").replace(/_/g, "/")
    const raw = atob(base64)
    const buf = new ArrayBuffer(raw.length)
    const arr = new Uint8Array(buf)
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
    return buf
  }, [])

  const randBuf = useCallback((len) => {
    const a = new Uint8Array(len)
    crypto.getRandomValues(a)
    return a.buffer
  }, [])

  async function authenticateWithPasskey() {
    const id = typeof window !== "undefined" ? localStorage.getItem(storageKeys.id) : null
    const raw = typeof window !== "undefined" ? localStorage.getItem(storageKeys.raw) : null
    if (!id && !raw) {
      addToast("No passkey found for this user on this device. Please sign up first or use Face ID.", "error")
      return false
    }
    const allowCredential = (id || raw) ? [{
      id: b64urlToBuf(raw || id),
      type: "public-key",
      transports: ["internal"],
    }] : undefined
    const publicKey = {
      challenge: randBuf(32),
      allowCredentials: allowCredential,
      timeout: 60000,
      userVerification: "required",
    }
    const assertion = await navigator.credentials.get({ publicKey })
    if (!assertion) throw new Error("Assertion returned null")
    const ok = !!(assertion.response.authenticatorData && assertion.response.signature)
    return ok
  }

  return (
    <main className="min-h-dvh relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
      <SiteHeader />
      <div className="relative mx-auto max-w-4xl px-4 py-6 space-y-4">
        <h1 className="font-display text-2xl text-foreground">{mode === "fingerprint" ? "Use fingerprint" : `Capture ${mode}`}</h1>
        {mode === "fingerprint" ? (
          <Card className="p-4 glass border-subtle space-y-3">
            <p className="text-sm text-foreground">Authenticate using your device passkey (fingerprint/Touch ID).</p>
            <div className="grid grid-cols-1 gap-2">
              <Button onClick={async () => {
                try {
                  setSubmitting(true)
                  const ok = await authenticateWithPasskey()
                  if (!ok) {
                    addToast("Authentication failed. Please try again.", "error")
                    return
                  }
                  // On success, consider user authenticated without camera flow
                  setCurrentUser(username)
                  addToast("Authentication successful!", "success")
                  router.replace("/dashboard")
                } catch (e) {
                  addToast(e?.message || "Authentication error. Please try again.", "error")
                } finally {
                  setSubmitting(false)
                }
              }} disabled={submitting} className="btn-shimmer w-full">{submitting ? "Authenticating…" : "Use fingerprint now"}</Button>
            </div>
            {showHttpsHint && (
              <p className="text-xs text-yellow-300">WebAuthn requires HTTPS. Use localhost or deploy over HTTPS.</p>
            )}
          </Card>
        ) : (
          <>
            <CameraCapture mode={mode} device={device} facing={facing} onCapture={handleCapture} />
            <Card className="p-4 glass border-subtle">
              <p className="text-sm text-foreground">
                Image will be centered and resized to 214×214 before being sent for verification.
              </p>
            </Card>
          </>
        )}
        <Button variant="outline" onClick={() => history.back()} disabled={submitting} className="w-full">
          Back
        </Button>
      </div>
    </main>
  )
}
