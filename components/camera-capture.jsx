"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card } from "@/components/ui/card.jsx"
import { cn } from "@/lib/utils.js"

export function CameraCapture({ mode, device, facing = "user", onCapture, onCancel, className }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [shot, setShot] = useState(null)
  const [error, setError] = useState(null)
  const shouldMirror = facing !== "environment"

  const start = useCallback(async () => {
    setError(null)
    setShot(null)
    setReady(false)
    try {
      // Ensure full teardown before re-init to avoid black screen on retake
      if (videoRef.current) {
        try {
          videoRef.current.pause()
        } catch {}
        videoRef.current.srcObject = null
        // Force the element to reset internal state for Safari/iOS
        try {
          videoRef.current.load()
        } catch {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      // Give the browser a moment to release the camera
      await new Promise((r) => requestAnimationFrame(() => r(undefined)))

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: facing === "environment" ? { exact: "environment" } : "user",
          // Attempt torch only for mobile + fingerprint; some browsers ignore unknown keys safely
          ...(mode === "fingerprint" && device === "mobile" ? { advanced: [{ torch: true }] } : {}),
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        const v = videoRef.current
        v.srcObject = stream
        v.muted = true
        v.playsInline = true
        v.autoplay = true

        await new Promise((resolve) => {
          const onLoaded = () => {
            v.removeEventListener("loadedmetadata", onLoaded)
            resolve()
          }
          if (v.readyState >= 1 && v.videoWidth > 0) resolve()
          else v.addEventListener("loadedmetadata", onLoaded, { once: true })
        })
        await v.play().catch(() => {})
        setReady(true)
      }
    } catch (e) {
      setError(e?.message || "Camera access failed.")
    }
  }, [facing, mode, device])

  useEffect(() => {
    start()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [start])

  const takeShot = () => {
    const video = videoRef.current
    if (!video) return
    const size = 214
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const { videoWidth: w, videoHeight: h } = video
    
    // Use center crop for both face and fingerprint to avoid zooming
    const s = Math.min(w, h)
    const sx = (w - s) / 2
    const sy = (h - s) / 2
    if (shouldMirror) {
      ctx.translate(size, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, sx, sy, s, s, 0, 0, size, size)
    
    const b64 = canvas.toDataURL("image/jpeg", 0.92)
    setShot(b64)
    
    // Stop the camera stream immediately after capturing
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  const retake = () => {
    setShot(null)
    setReady(false)
    if (videoRef.current) {
      try {
        videoRef.current.pause()
      } catch {}
      try {
        videoRef.current.srcObject = null
      } catch {}
      try {
        videoRef.current.load()
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    requestAnimationFrame(() => {
      start()
    })
  }

  const instruction = (() => {
    if (mode === "face" && device === "desktop") {
      return "Center your face with good lighting, look straight at the webcam."
    }
    if (mode === "face" && device === "mobile") {
      return "📱 Use the SELFIE camera (front camera). Hold the phone at eye level and ensure good lighting."
    }
    if (mode === "fingerprint" && device === "mobile") {
      return "📱 Use the BACK camera with flash enabled. Fill the frame with your fingertip for best results."
    }
    return "For fingerprints, please use a mobile device with the back camera."
  })()

  return (
    <Card className={cn("p-4 space-y-4 glass-strong border-subtle", className)}>
      <div className="text-sm text-foreground font-medium">{instruction}</div>
      {!shot ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-black aspect-square max-w-md mx-auto">
            <video 
              ref={videoRef} 
            className="w-full h-full object-cover" 
              playsInline 
              muted 
              autoPlay 
            style={{ objectPosition: 'center center', transform: shouldMirror ? 'scaleX(-1)' : 'none' }}
            />
            {!ready && <div className="absolute inset-0 grid place-items-center text-xs">Initializing camera…</div>}
          </div>
          {error ? (
            <div className="text-destructive text-sm">{error}</div>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={takeShot} className="flex-1">
                Capture
              </Button>
              {onCancel ? (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <img
            src={shot || "/placeholder.svg"}
            alt="Captured preview"
            className="w-full aspect-square max-w-md mx-auto object-cover rounded-lg border"
          />
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={retake} className="flex-1">
              Retake
            </Button>
            <Button onClick={() => onCapture(shot)} className="flex-1">
              Use photo
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
