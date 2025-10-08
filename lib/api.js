export const API_BASE_URL = process.env.NEXT_PUBLIC_CHAINID_API_BASE_URL || "https://3c68cc3471301.notebooks.jarvislabs.net"

// Keep backend compatibility: strip any data URL prefix and whitespace
export function stripDataUrl(b64) {
  if (!b64) return ""
  const i = b64.indexOf(",")
  return (i >= 0 ? b64.slice(i + 1) : b64).replace(/\s/g, "")
}

async function api(path, init) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
      mode: "cors", // Explicitly set CORS mode
    })
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => "")
      let errorMessage = `Request failed: ${res.status}`
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData?.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      throw new Error(errorMessage)
    }
    
    const data = await res.json().catch(() => ({}))
    return data
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to backend at ${API_BASE_URL}`)
    }
    throw error
  }
}

// --- Backend endpoints ---

export async function createUser(payload) {
  // Backend requires both face and fingerprint base64 (no data URL)
  return api("/create-user", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      face_image_b64: stripDataUrl(payload.face_image_b64),
      fingerprint_image_b64: stripDataUrl(payload.fingerprint_image_b64),
    }),
  })
}

export async function authFace(username, probeImageB64) {
  return api("/auth-face", {
    method: "POST",
    body: JSON.stringify({
      username,
      probe_image_b64: stripDataUrl(probeImageB64),
    }),
  })
}

export async function authFingerprint(username, probeImageB64) {
  return api("/auth-fingerprint", {
    method: "POST",
    body: JSON.stringify({
      username,
      probe_image_b64: stripDataUrl(probeImageB64),
    }),
  })
}

export async function getLogs(limit = 50) {
  const qs = new URLSearchParams({ limit: String(limit) })
  return api(`/logs?${qs.toString()}`)
}

export async function getHealth() {
  return api(`/health`)
}

// Additional API functions based on backend endpoints
export async function updateUser(payload) {
  return api("/update-user", {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteUser(username) {
  return api("/delete-user", {
    method: "DELETE",
    body: JSON.stringify({ username }),
  })
}

export async function getApiInfo() {
  return api("/")
}

// Session management utilities
export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem("chainid_username")
}

export function setCurrentUser(username) {
  if (typeof window === 'undefined') return
  localStorage.setItem("chainid_username", username)
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return
  localStorage.removeItem("chainid_username")
}

export function isLoggedIn() {
  return !!getCurrentUser()
}
