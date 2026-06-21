export async function validateWhopLicense(licenseKey: string, deviceId: string): Promise<{ status: "valid" | "invalid" | "error"; message?: string }> {
  const OMNIHOOK_PRODUCT_ID = "prod_gRSgmVbbJRipf"

  try {
    // Validate via backend you control. Set `VITE_BACKEND_URL` when building the plugin.
    const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || ""

    if (!BACKEND_URL) {
      console.warn("OmniHook: VITE_BACKEND_URL not configured. License validation disabled.")
      return { status: "error", message: "Validation backend not configured." }
    }

    const response = await fetch(`${BACKEND_URL.replace(/\/$/, "")}/validate-license`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ licenseKey, deviceId })
    })

    if (response.status >= 500) {
      return { status: "error", message: "Validation server error." }
    }

    if (!response.ok) {
      return { status: "invalid", message: "Invalid license key." }
    }

    const data = await response.json()
    // Backend should return { status: 'valid'|'invalid'|'error', message?: string }
    return data
  } catch (error) {
    console.error("Whop validation error:", error)
    return { status: "error", message: "Network error. Please try again." }
  }
}

export function generateDeviceId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
