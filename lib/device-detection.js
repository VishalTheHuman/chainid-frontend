import { useState, useEffect } from 'react'

// Hook to detect if device is mobile based on screen width
export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      // Consider mobile if screen width is 768px or less (Tailwind's md breakpoint)
      setIsMobile(window.innerWidth <= 768)
    }

    // Check on mount
    checkDevice()

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice)

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobile
}

// Legacy function for backward compatibility (can be removed later)
export function isMobileUA() {
  if (typeof navigator === "undefined") return false
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}
