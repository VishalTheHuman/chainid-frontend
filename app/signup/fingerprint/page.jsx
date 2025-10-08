"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { createUser, setCurrentUser } from "@/lib/api.js"
import { useToast } from "@/components/ui/toast.jsx"

export default function SignUpFingerprintPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [supportMsg, setSupportMsg] = useState("Checking device support…")
  const [supportLevel, setSupportLevel] = useState("warn") // ok | warn | err
  const [showHttpsHint, setShowHttpsHint] = useState(false)

  const username = useMemo(() => {
    if (typeof window === "undefined") return ""
    return localStorage.getItem("signup_username") || ""
  }, [])

  const storageKeys = useMemo(() => ({
    id: `passkey_${username}_id`,
    raw: `passkey_${username}_raw`,
  }), [username])

  useEffect(() => {
    if (!username) {
      router.replace("/signup")
      return
    }
    const face = localStorage.getItem("signup_face")
    if (!face) {
      // Ensure we have face captured before passkey step
      router.replace("/signup/face")
      return
    }
    // Initial capability check
    ;(async () => {
      const ok = await checkAvailability()
      if (!ok) setSupportLevel("warn")
    })()
    // Compute HTTPS hint on client only
    if (typeof window !== "undefined") {
      const shouldShow = location.protocol !== "https:" && location.hostname !== "localhost"
      setShowHttpsHint(shouldShow)
    }
  }, [router, username])

  function bufToB64url(buf) {
    const bytes = new Uint8Array(buf)
    let str = ""
    for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i])
    const base64 = btoa(str)
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
  }

  function randBuf(len) {
    const a = new Uint8Array(len)
    crypto.getRandomValues(a)
    return a.buffer
  }

  async function checkAvailability() {
    if (typeof window === "undefined") return false
    if (!("PublicKeyCredential" in window)) {
      setSupportMsg("WebAuthn not supported in this browser")
      setSupportLevel("err")
      return false
    }
    const hasPlatform = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false)
    if (hasPlatform) {
      setSupportMsg("Platform authenticator available (fingerprint/Touch ID)")
      setSupportLevel("ok")
    } else {
      setSupportMsg("No platform authenticator detected on this device")
      setSupportLevel("warn")
    }
    return hasPlatform
  }

  async function registerCredential() {
    const rpId = typeof window !== "undefined" ? location.hostname : ""
    const publicKey = {
      rp: { id: rpId, name: "ChainID" },
      user: {
        id: new TextEncoder().encode((Math.random() + 1).toString(36).slice(2)),
        name: username,
        displayName: username,
      },
      challenge: randBuf(32),
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      timeout: 60000,
      attestation: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "preferred",
        userVerification: "required",
      },
    }
    const cred = await navigator.credentials.create({ publicKey })
    if (!cred) throw new Error("Creation returned null")
    const id = cred.id
    const rawB64 = bufToB64url(cred.rawId)
    localStorage.setItem(storageKeys.id, id)
    localStorage.setItem(storageKeys.raw, rawB64)
    return { id }
  }

  async function onUseFingerprint() {
    try {
      setSubmitting(true)
      const ok = await checkAvailability()
      if (!ok) return

      // Ensure passkey exists for this username
      const has = !!(localStorage.getItem(storageKeys.id) || localStorage.getItem(storageKeys.raw))
      if (!has) {
        await registerCredential()
      }

      // Complete signup with backend using captured face; send face for both fields to maintain compatibility
      const name = localStorage.getItem("signup_name") || ""
      const email = localStorage.getItem("signup_email") || ""
      const face = localStorage.getItem("signup_face") || ""

      await createUser({
        name,
        username,
        email,
        face_image_b64: face,
        fingerprint_image_b64: face,
      })

      setCurrentUser(username)
      addToast("Account created successfully!", "success")

      localStorage.removeItem("signup_name")
      localStorage.removeItem("signup_username")
      localStorage.removeItem("signup_email")
      localStorage.removeItem("signup_face")
      router.replace("/dashboard")
    } catch (e) {
      addToast(e?.message || "Passkey setup failed. Please try again.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  function clearPasskey() {
    localStorage.removeItem(storageKeys.id)
    localStorage.removeItem(storageKeys.raw)
    setSupportMsg("Passkey cleared for this user. You can register again.")
    setSupportLevel("warn")
  }

  return (
    <main className="min-h-dvh relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
      <SiteHeader />
      <div className="relative mx-auto max-w-2xl px-4 py-6 space-y-4">
        <h1 className="font-display text-3xl text-foreground">Set up fingerprint</h1>
        <Card className="p-4 glass border-subtle space-y-3">
          <p className={`text-sm ${supportLevel === "ok" ? "text-emerald-300" : supportLevel === "err" ? "text-red-300" : "text-yellow-300"}`}>{supportMsg}</p>
          <p className="text-sm text-foreground/80">
            We will set up fingerprint on this device using the platform authenticator.
          </p>
          {showHttpsHint && (<p className="text-xs text-yellow-300">WebAuthn requires HTTPS. Use localhost or deploy over HTTPS.</p>)}
          <div className="grid grid-cols-1 gap-2">
            <Button onClick={onUseFingerprint} disabled={submitting} className="btn-shimmer w-full">
              {submitting ? "Setting up…" : "Use fingerprint now"}
            </Button>
            <Button variant="secondary" onClick={clearPasskey} disabled={submitting} className="w-full">
              Clear saved passkey
            </Button>
          </div>
        </Card>
        <Button variant="outline" onClick={() => router.back()} disabled={submitting} className="w-full">
          Back
        </Button>
      </div>
    </main>
  )
}
